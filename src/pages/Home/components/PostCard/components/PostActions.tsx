import { Link } from "react-router-dom";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
} from "lucide-react";
import { BiLike } from "react-icons/bi";

interface PostActionsProps {
  isLiked: boolean;
  isPending: boolean;
  loadingShare: boolean;
  loadingBookmarked: boolean;
  isBookmarked: boolean;

  mutate: () => void;
  mutateShare: () => void;
  mutateBookmark: () => void;

  postId: string;
  postDetails: boolean;
}

export default function PostActions({
  isLiked,
  isPending,
  loadingShare,
  loadingBookmarked,
  isBookmarked,
  mutate,
  mutateShare,
  mutateBookmark,
  postId,
  postDetails,
}: PostActionsProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      {/* Like */}
      <button
        disabled={isPending}
        onClick={mutate}
        className={`flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition ${
          isLiked
            ? "text-blue-500 bg-blue-50 dark:bg-blue-950/30"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-800 dark:hover:text-blue-800"
        }`}
      >
        <BiLike 
          className={`w-4 h-4 ${isLiked ? "fill-blue-500" : ""}`}
        />

        <span>{isPending ? "Liking..." : "Like"}</span>
      </button>

      {/* Comment */}
      {postDetails ? (
        <button className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
      ) : (
        <Link
          to={`/postDetails/${postId}`}
          className="flex-1 flex items-center justify-center"
        >
          <span className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </span>
        </Link>
      )}

      {/* Share */}
      <button
        disabled={loadingShare}
        onClick={mutateShare}
        className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
      >
        <Share2 className="w-4 h-4" />

        <span>{loadingShare ? "Sharing..." : "Share"}</span>
      </button>

      {/* Bookmark */}
      <button
        disabled={loadingBookmarked}
        onClick={mutateBookmark}
        className={`p-2 cursor-pointer rounded-xl transition ${
          isBookmarked
            ? "text-[#149188] bg-teal-50 dark:bg-teal-950/30"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        <Bookmark
          className={`w-4 h-4 ${isBookmarked ? "fill-[#149188]" : ""}`}
        />
      </button>
    </div>
  );
}