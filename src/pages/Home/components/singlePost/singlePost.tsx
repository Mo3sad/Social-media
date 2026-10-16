import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoaderApi from "../../../../components/LoaderApi/LoaderApi";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../PostCard/PostCard";
import CreateComment from "../commentCreation/commentCreation";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

export default function SinglePost() {
  const { id } = useParams();

  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostDetails", id],
    queryFn: getPostDetails,
    enabled: !!id,
  });
  if (isError) {
    toast.error("post not avalibal");
    return 
  }
  const post = data?.data?.data?.post;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl h-[85vh] sm:h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-slate-800 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header (ثابت في الأعلى) */}
        <div className="shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mx-auto truncate max-w-[80%] text-center">
            {post?.user?.name ? `${post.user.name}'s Post` : "Single Post"}
          </h2>

          <button
            onClick={handleClose}
            className="absolute left-3 sm:left-4 top-3.5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center transition"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Middle Content (البوست والتعليقات بس هما اللي بيعملوا سكرول) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex justify-center items-center py-12">
              <LoaderApi />
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-red-500 font-semibold text-sm">
              {error&& "Failed to load post"}
            </div>
          ) : post ? (
            <PostCard post={post} postDetails={true} />
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              Post not found
            </div>
          )}
        </div>

        {/* 3. Sticky Bottom Input (ثابت تحت وواضح دايماً من غير ما السكرول يغطيه) */}
        {post && (
          <div className="shrink-0 p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 z-10">
            <CreateComment postId={id as string} />
          </div>
        )}
      </div>
    </div>
  );
}
