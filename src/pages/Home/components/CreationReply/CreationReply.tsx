import { useState } from "react";
import { Heart } from "lucide-react";
import type { CommentReplyProps } from "../../../../types/post.type";



export default function CommentReply({
  reply,
 
}: CommentReplyProps) {
 

  const [isLiked, setIsLiked] = useState(false);

  const [likesCount, setLikesCount] = useState(
    reply?.likesCount ?? 0,
  );

  const creatorName =
    reply?.commentCreator?.name || "Anonymous";

  const avatarLetter = creatorName.charAt(0).toUpperCase();

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLike = () => {
    setIsLiked((prev) => {
      setLikesCount((count) => Math.max(0, count + (prev ? -1 : 1)));
      return !prev;
    });
  };

  return (
    <div className="flex flex-col ml-6 sm:ml-10 mt-3" dir="ltr">
      <div className="flex items-start gap-2.5 bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl transition-colors">
        {/* Avatar */}
        <div className="flex flex-col items-center shrink-0">
          {reply?.commentCreator?.photo ? (
            <img
              src={reply.commentCreator.photo}
              alt={creatorName}
              className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#149188] text-white flex items-center justify-center text-xs font-bold">
              {avatarLetter}
            </div>
          )}

          <span className="text-[11px] font-bold text-gray-900 dark:text-white mt-1 text-center max-w-[60px] truncate">
            {creatorName}
          </span>
        </div>

        {/* Reply Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
              {formatTime(reply?.createdAt)}
            </span>
          </div>

          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 break-words leading-relaxed">
            {reply?.content}
          </p>
          
          {reply?.image && (
            <img
              src={reply.image}
              alt="Comment"
              className="w-full h-auto rounded-lg mt-2"
            />
          )}


          {/* Actions */}
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
              <Heart
                className={`w-3 h-3 ${isLiked ? "fill-red-500" : ""}`}
              />

              <span>{likesCount > 0 ? likesCount : "Like"}</span>
            </button>

           
          </div>

        </div>
      </div>
    </div>
  );
}