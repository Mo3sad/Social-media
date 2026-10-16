import { useState, useContext, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Image as ImageIcon,
  X,
  Check,
} from "lucide-react";

import type {
  TopCommentProps,
  CommentsResponse,
} from "../../../../types/post.type";

import CommentReply from "../CreationReply/CreationReply";
import CommentReplyBox from "../commentReplayBox/commentReplayBox";

import axios, { AxiosError, type AxiosResponse } from "axios";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { userDataContext } from "../../../../Context/userData.Context";
import toast from "react-hot-toast";
import { showDeleteConfirm } from "../showDeleteConfirm";
import OptionsMenu from "../CreationReply/OptionsMenu/OptionsMenu";

export default function TopComment({
  comment,
  createdAt,
  postId,
  postDetails,
}: TopCommentProps) {
  const userContext = useContext(userDataContext);
  const userData = userContext?.userData;
  const currentUserId = userData?._id;

  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    comment.image || null,
  );
  const [removeImage, setRemoveImage] = useState(false);

  // 👈 استرجاع حالة التعديل من الـ localStorage للكومنت ده بالتحديد
  const [isEditedLocally, setIsEditedLocally] = useState<boolean>(() => {
    const editedComments = JSON.parse(
      localStorage.getItem("editedComments") || "{}",
    );
    return Boolean(editedComments[comment._id]);
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  const isOwner = Boolean(
    currentUserId && comment.commentCreator?._id === currentUserId,
  );

  const creatorName = comment.commentCreator?.name || "Anonymous User";

  const avatarLetter = creatorName.charAt(0).toUpperCase();

  const formattedTime = (() => {
    if (!createdAt) return null;
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  })();

  useEffect(() => {
    setEditedContent(comment.content);
    setPreviewImage(comment.image || null);
    setSelectedFile(null);
    setRemoveImage(false);
  }, [comment._id, comment.content, comment.image]);

  const handleLike = () => {
    setIsLiked((prev) => {
      setLikesCount((count) => Math.max(0, count + (prev ? -1 : 1)));
      return !prev;
    });
  };

  async function getAllReplies() {
    const token = localStorage.getItem("userToken");
    return axios.get<CommentsResponse>(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<CommentsResponse>,
    AxiosError
  >({
    queryKey: ["getAllReplies", postId, comment._id],
    queryFn: getAllReplies,
    enabled: Boolean(postId && comment._id),
  });

  const repliesList = data?.data?.data?.replies ?? [];
  const visibleReplies = postDetails ? repliesList : repliesList.slice(0, 1);

  // Update Comment Mutation
  const updateCommentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("userToken");
      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      toast.success("Comment updated successfully!");

      setIsEditing(false);
      setSelectedFile(null);
      setRemoveImage(false);
      setIsEditedLocally(true);

      // 👈 حفظ الـ ID في الـ localStorage عشان يفضل ظاهر بعد الـ Refresh
      const editedComments = JSON.parse(
        localStorage.getItem("editedComments") || "{}",
      );
      editedComments[comment._id] = true;
      localStorage.setItem("editedComments", JSON.stringify(editedComments));

      queryClient.invalidateQueries({
        queryKey: ["getAllComments", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAllPost"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAllReplies", postId, comment._id],
      });
    },

    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to update comment");
    },
  });

  // Delete Comment Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("userToken");
      return axios.delete(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },

    onSuccess: () => {
      toast.success("Comment deleted successfully!");

      // 👈 لو اتحذف، نشيله كمان من الـ localStorage
      const editedComments = JSON.parse(
        localStorage.getItem("editedComments") || "{}",
      );
      delete editedComments[comment._id];
      localStorage.setItem("editedComments", JSON.stringify(editedComments));

      queryClient.invalidateQueries({
        queryKey: ["getAllComments", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAllPost"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAllReplies", postId, comment._id],
      });
    },

    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    },
  });

  function handleEditClick() {
    setEditedContent(comment.content);
    setPreviewImage(comment.image || null);
    setSelectedFile(null);
    setRemoveImage(false);
    setIsEditing(true);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  function handleRemoveImage() {
    setSelectedFile(null);
    setPreviewImage(null);
    setRemoveImage(true);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditedContent(comment.content);
    setPreviewImage(comment.image || null);
    setSelectedFile(null);
    setRemoveImage(false);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleUpdateComment() {
    if (!editedContent.trim() && !previewImage) {
      toast.error("Comment cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("content", editedContent.trim());

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else if (removeImage) {
      formData.append("image", "");
    }

    updateCommentMutation.mutate(formData);
  }

  function handleDeleteCommentClick() {
    showDeleteConfirm(() => {
      deleteCommentMutation.mutate();
    }, "Are you sure you want to delete this comment?");
  }

  return (
    <div
      className="w-full pt-3 mt-3 border-t border-gray-100 dark:border-slate-800"
      dir="ltr"
    >
      <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl transition-colors duration-200">
        {comment.commentCreator?.photo ? (
          <img
            src={comment.commentCreator.photo}
            alt={creatorName}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 dark:border-slate-700"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#149188] text-white flex items-center justify-center text-xs font-bold shrink-0">
            {avatarLetter}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {creatorName}
            </h4>

            <div className="flex items-center gap-2 shrink-0">
              {formattedTime && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {formattedTime}
                </span>
              )}

              {/* Edited label من الـ localStorage */}
              {isEditedLocally && (
                <span className="text-[10px] font-medium text-green-500">
                  • Edited
                </span>
              )}

              <OptionsMenu
                isOwner={isOwner}
                onEdit={handleEditClick}
                onDelete={handleDeleteCommentClick}
                isDeleting={deleteCommentMutation.isPending}
                editLabel="Edit Comment"
                deleteLabel="Delete Comment"
              />
            </div>
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-3">
              <textarea
                value={editedContent}
                onChange={(event) => setEditedContent(event.target.value)}
                rows={3}
                placeholder="Write your comment..."
                className="w-full resize-y rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#149188]"
              />

              {previewImage && (
                <div className="relative w-fit max-w-full">
                  <img
                    src={previewImage}
                    alt="Comment preview"
                    className="max-h-64 max-w-full rounded-xl object-contain"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    aria-label="Remove comment image"
                    className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-600 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#149188] hover:bg-teal-50 dark:hover:bg-slate-700 transition"
              >
                <ImageIcon className="h-4 w-4" />
                {previewImage ? "Change image" : "Add image"}
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleUpdateComment}
                  disabled={updateCommentMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#149188] px-3 py-2 text-xs font-semibold text-white hover:bg-[#107a72] transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {updateCommentMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={updateCommentMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 break-words leading-relaxed">
                {comment.content}
              </p>

              {comment.image && (
                <img
                  src={comment.image}
                  alt="Comment"
                  className="max-w-full h-auto max-h-80 rounded-lg mt-2 object-contain"
                />
              )}
            </>
          )}

          {!isEditing && (
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-1 text-[11px] font-medium transition ${
                  isLiked
                    ? "text-red-500"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <Heart className={`w-3 h-3 ${isLiked ? "fill-red-500" : ""}`} />
                <span>{likesCount > 0 ? likesCount : "Like"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                className="flex items-center gap-1 text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:text-[#149188] transition"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Reply</span>
              </button>
            </div>
          )}

          {isOpen && !isEditing && (
            <div className="mt-2 w-full" dir="ltr">
              <div className="w-[90%] sm:w-[85%]">
                <CommentReplyBox
                  onClose={() => setIsOpen(false)}
                  postId={postId}
                  commentID={comment._id}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {repliesList.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowReplies((previous) => !previous)}
            className="text-xs font-semibold text-[#149188] dark:text-teal-400 hover:underline flex items-center gap-1.5"
          >
            {showReplies
              ? "Hide replies"
              : `View replies (${repliesList.length})`}
          </button>

          {showReplies && (
            <div className="mt-2">
              {isLoading && (
                <p className="text-xs text-gray-400 mt-1">Loading replies...</p>
              )}

              {isError && (
                <p className="text-xs text-red-500 mt-1">
                  {error?.message || "Failed to load replies"}
                </p>
              )}

              {!isLoading &&
                !isError &&
                visibleReplies.map((reply) => (
                  <CommentReply key={reply._id} reply={reply} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
