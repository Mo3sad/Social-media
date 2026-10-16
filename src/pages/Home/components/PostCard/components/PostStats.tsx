interface PostStatsProps {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

export default function PostStats({
  likesCount,
  commentsCount,
  sharesCount,
}: PostStatsProps) {
  return (
    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pb-3 mt-3 border-b border-gray-100 dark:border-slate-800">
      {" "}
      <div className="flex items-center gap-1">
        {" "}
        <span className="w-4 h-4 rounded-full bg-[#149188] text-white flex items-center justify-center text-[9px] font-bold">
          ✓{" "}
        </span>
        
        <span>{likesCount} Likes</span>
      </div>
      <div className="flex items-center gap-3">
        <span>{commentsCount} Comments</span>
        <span>{sharesCount} Shares</span>
      </div>
    </div>
  );
}
