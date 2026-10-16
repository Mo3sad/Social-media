import { Send, Image } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { userDataContext } from "../../../../Context/userData.Context";
import { useContext, useState } from "react";
import EmojiPickerPopover from "../../../../components/EmojiPickerPopover/EmojiPickerPopover";
import type { CommentType } from "../../../../types/post.type";

export default function CreateComment({
  postId,
  querykey,
}: {
  postId: string;
  querykey?: string[];
}) {
  const user = useContext(userDataContext);
  const userData = user?.userData;
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const form = useForm<CommentType>({
    defaultValues: {
      content: "",
    },
    mode: "onSubmit",
   
    reValidateMode: "onSubmit",
  });

  const { register, handleSubmit, formState, reset, watch, setValue } = form;
  
  // بنراقب قيمة المحتوى عشان نضيف عليها الإيموجي صح
  const currentContent = watch("content") || "";

  const handleAddEmoji = (emoji: string) => {
    setValue("content", currentContent + emoji, { shouldValidate: true });
  };

  const query = useQueryClient();

  function createComment(formdata: FormData) {
    const token = localStorage.getItem("userToken");

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
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
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("Comment created successfully");
      query.invalidateQueries({
        queryKey: querykey,
      });
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create comment");
    },
  });

  function handelComment(value: CommentType) {
    const formdata = new FormData();
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
      className="w-full pt-3 mt-3 border-t border-gray-100 dark:border-slate-800"
      dir="ltr"
    >
      <div className="flex items-start gap-2.5">
        {/* User Profile Avatar */}
        <img
          src={userData?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
          alt={userData?.name || "User"}
          className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 dark:border-slate-700"
        />

        {/* Input Box Container */}
        <form
          onSubmit={handleSubmit(handelComment)}
          className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-2 sm:p-2.5 transition-colors focus-within:ring-2 focus-within:ring-[#149188]/30"
        >
          <textarea
            {...register("content")}
            placeholder="Write a comment..."
            rows={2}
            className="w-full bg-transparent text-xs sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-slate-700/50 mt-1">
            <div className="flex items-center gap-1 sm:gap-2 me-9">
              {/* استبدلنا الزرار القديم بمكون الـ EmojiPickerPopover واشتغل مباشرة */}
              <EmojiPickerPopover
                onEmojiSelect={handleAddEmoji}
                isOpen={isEmojiOpen}
                setIsOpen={setIsEmojiOpen}
              />

              <label className="p-1.5 cursor-pointer text-gray-400 hover:text-[#149188] dark:hover:text-[#149188] rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                <input hidden {...register("image")} type="file" />
                <Image className="w-4 h-4" />
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="p-1.5 sm:px-3 disabled:bg-slate-800 disabled:cursor-not-allowed sm:py-1.5 bg-[#149188] hover:bg-[#0f736c] disabled:opacity-40 text-white rounded-xl flex items-center gap-1.5 text-xs font-semibold transition shadow-sm cursor-pointer"
            >
              <span className="hidden sm:inline">
                {isPending ? "Posting..." : "Comment"}
              </span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}