import { useRef, useContext, useEffect } from "react";
import { Image, X, Globe, Smile, Video } from "lucide-react";
import { userDataContext } from "../../../../Context/userData.Context";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: string | null;
  selectedFile: File | null;
  setSelectedImage: (image: string | null) => void;
  setSelectedFile: (file: File | null) => void;

  // 👈 مخصصة للتعديل (Update)
  isEditMode?: boolean;
  postId?: string;
  initialBody?: string;
  setIsEditedLocally?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  selectedImage,
  selectedFile,
  setSelectedImage,
  setSelectedFile,
  handleImageChange,
  isEditMode = false,
  postId,
  initialBody = "",
  setIsEditedLocally,
}: CreatePostModalProps) {
  const query = useQueryClient();
  const user = useContext(userDataContext);
  const userData = user?.userData;

  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // لو احنا في وضع التعديل، نحط النص القديم جوه الـ textarea أول ما المودل يفتح
  useEffect(() => {
    if (isOpen && textInputRef.current) {
      textInputRef.current.value = initialBody;
    }
  }, [isOpen, initialBody]);

  // دالة الإرسال (تفرق بين إنشاء بوست جديد أو تعديل بوست موجود)
  const mutationFn = (formdata: FormData) => {
    const token = localStorage.getItem("userToken");
    const headers = {
      token: token || "",
      Authorization: `Bearer ${token}`,
    };

    if (isEditMode && postId) {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}`,
        formdata,
        { headers },
      );
    } else {
      // 👈 لو إنشاء جديد
      return axios.post(`https://route-posts.routemisr.com/posts`, formdata, {
        headers,
      });
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(
        isEditMode ? "Post updated successfully" : "Post created successfully",
      );

      query.invalidateQueries({
        queryKey: ["getAllPost"],
      });
      query.invalidateQueries({
        queryKey: ["getUserPosts"],
      });
      
      if (isEditMode) {
        setIsEditedLocally?.(true);
        const editedPosts = JSON.parse(
          localStorage.getItem("editedPosts") || "{}",
        );
        editedPosts[postId as string] = true;
        localStorage.setItem("editedPosts", JSON.stringify(editedPosts));
      }
      setSelectedImage(null);
      setSelectedFile(null);
      if (textInputRef.current) textInputRef.current.value = "";
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Operation failed");
    },
  });

  if (!isOpen) return null;

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
  };

  function handleSubmit() {
    const formData = new FormData();

    const bodyText = textInputRef.current?.value || "";
    if (bodyText.trim()) {
      formData.append("body", bodyText);
    }
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    mutate(formData);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mx-auto">
            {isEditMode ? "Edit Post" : "Create Post"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="flex items-center gap-3 px-5 pt-4">
          <img
            src={
              userData?.photo ||
              "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
            }
            alt={userData?.name || "User"}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-slate-800"
          />
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">
              {userData?.name || "Unknown User"}
            </h4>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[10px] text-gray-600 dark:text-gray-300 w-fit mt-0.5">
              <Globe className="w-3 h-3" />
              <span>Public</span>
            </div>
          </div>
        </div>

        {/* Modal Body / Textarea */}
        <div className="p-5 flex-1 overflow-y-auto">
          <textarea
            ref={textInputRef}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-none"
          />

          {/* Image Preview Box */}
          {selectedImage && (
            <div className="relative mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 max-h-60 bg-black/5">
              <img
                src={selectedImage}
                alt="Upload preview"
                className="w-full h-full object-cover max-h-60"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Add to your post section */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-between border border-gray-200 dark:border-slate-700 rounded-2xl p-3">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Add to your post
            </span>
            <div className="flex items-center gap-1">
              <label className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-green-500 transition cursor-pointer">
                <Image className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-blue-500 transition"
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-amber-500 transition"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-5 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full bg-[#149188] hover:bg-[#117a72] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{isEditMode ? "Updating..." : "Posting..."}</span>
              </>
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
