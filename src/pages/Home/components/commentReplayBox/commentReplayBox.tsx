import { Send, Image } from "lucide-react";
import { useContext, useState } from "react";
import { userDataContext } from "../../../../Context/userData.Context";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  PostSchema,
  type PostSchemaType,
} from "../../../../schemas/posts.schema";

interface CommentReplyBoxProps {
  onClose?: () => void; // دالة اختيارية لو حابب تقفله من الأب
  commentID: string;
  postId: string;
}

export default function CommentReplyBox({
  onClose,
  postId,
  commentID,
}: CommentReplyBoxProps) {
  const user = useContext(userDataContext);
  const userData = user?.userData;
  const [isClose, setIsClose] = useState(false);
  let userdata = user?.userData;

  // لو المستخدم ضغط إغلاق، ما نرضش الكومبوننت ده نهائياً
  if (isClose) return null;
  const form = useForm<PostSchemaType>({
    defaultValues: {
      content: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(PostSchema),
    reValidateMode: "onSubmit",
  });
  const { register, handleSubmit, formState, reset } = form;
  const formdata = new FormData();
  const query = useQueryClient();

  function createReplay(formdata: FormData) {
    const token = localStorage.getItem("userToken");

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentID}/replies`,
      formdata,
      {
        headers: {
          token: token || "",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  const { isPending, mutate } = useMutation({
    mutationFn: createReplay,

    onSuccess: () => {
      toast.success("Comment created successfully");
      query.invalidateQueries({
        queryKey: ["getAllReplies", postId, commentID],
      });
      reset();
       setIsClose(true);
    if (onClose) onClose();
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create comment");
    },
  });
  function handelReplay(value: PostSchemaType) {
    formdata.append("content", value.content);
   
    if (value.image?.[0]) {
      formdata.append("image", value.image[0]);
    }

    mutate(formdata);
  }

  if (formState.errors.content) {
    toast.error(`${formState.errors.content.message}`);
  }
  if (formState.errors.image) {
    toast.error(`${formState.errors.image.message}`);
  }
  return (
    <div
      className="relative w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm transition-colors"
      dir="ltr"
    >
      {/* Close Button Handler */}
      <button
        type="button"
        onClick={() => {
          setIsClose(true);
          if (onClose) onClose();
        }}
        className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1"
        title="Close"
      >
        <IoCloseSharp className="w-4 h-4" />
      </button>

      {/* Input area with user avatar */}
      <div className="flex items-start gap-3 mt-1">
        {/* Current User Avatar */}
        <img
          src={userdata?.photo}
          alt={userdata?.name}
          className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200 dark:border-slate-700 mt-1"
        />

        {/* Input & Actions Container */}
        <form
          onSubmit={handleSubmit(handelReplay)}
          className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#149188] transition"
        >
          {/* Textarea for reply */}
          <textarea
            {...register("content")}
            rows={2}
            placeholder="Write a reply..."
            className="w-full bg-transparent text-xs sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-none"
          />

          {/* Bottom Toolbar inside the box (Attach image & Send button) */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700/60 mt-1">
            {/* Attach Image Option */}
            <label className="text-gray-400 hover:text-[#149188] dark:hover:text-[#149188] transition p-1">
              <input hidden {...register("image")} type="file" />
              <Image className="w-4 h-4" />
            </label>

            {/* Send Reply Button */}
            <button
              type="submit"
              disabled={isPending}
              className="p-1.5 sm:px-3 disabled:bg-slate-800 disabled:cursor-not-allowed sm:py-1.5 bg-[#149188] hover:bg-[#0f736c] disabled:opacity-40 text-white rounded-xl flex items-center gap-1.5 text-xs font-semibold transition shadow-sm"
            >
              <span className="hidden sm:inline">
                {" "}
                {isPending ? "Posting..." : "Reply"}{" "}
              </span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
