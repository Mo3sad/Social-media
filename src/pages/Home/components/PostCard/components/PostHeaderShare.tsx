import { Repeat2 } from "lucide-react";
import type { PostHeaderProps } from "../../../../../types/post.type";


export default function PostHeaderShare({user,formatData ,isEditedLocally,postCreatAt,DEFAULTPHOTO ,renderOptionsMenu}:PostHeaderProps) {
  return (
   
    <>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={user?.photo || DEFAULTPHOTO}
            alt={user?.name || "User"}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-slate-800"
            onError={(e) => {
              e.currentTarget.src = DEFAULTPHOTO;
            }}
          />

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {user?.name || "Unknown User"}
              </h3>
              <h3>{isEditedLocally && <span className="text-xs text-green-500">(Edited)</span>}</h3>
              {user?.username && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  @{user.username}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#149188] mt-0.5 font-medium">
              <Repeat2 className="w-3.5 h-3.5" />

              <span>Shared a post</span>

              <span className="text-gray-400">•</span>

              <span className="text-gray-400 dark:text-gray-500">
                {formatData(postCreatAt)}
              </span>
            </div>
          </div>
        </div>

        {renderOptionsMenu()}
      </div>
    </>
  );
}
