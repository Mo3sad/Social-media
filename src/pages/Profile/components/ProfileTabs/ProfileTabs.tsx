import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoaderApi from "../../../../components/LoaderApi/LoaderApi";
import { Bookmark, FileText } from "lucide-react";
import { userDataContext } from "../../../../Context/userData.Context";
import PostCard from "../../../Home/components/PostCard/PostCard";

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<"posts" | "bookmarks">("posts");
  

  const userContext = useContext(userDataContext);
  const userId = userContext?.userData?._id;



  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["getUserPosts", userId],
    queryFn: () => {
      const token = localStorage.getItem("userToken");
      return axios.get(
        `https://route-posts.routemisr.com/users/${userId}/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    enabled: !!userId,
  });


  const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery({
    queryKey: ["getUserBookmarks"],
    queryFn: () => {
      const token = localStorage.getItem("userToken");
      return axios.get("https://route-posts.routemisr.com/users/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  });

  const myPosts = postsData?.data?.data?.posts || postsData?.data?.posts || [];
  const bookmarksPosts = bookmarksData?.data?.data.bookmarks;
// console.log(bookmarksPosts);

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-2 mb-4 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition cursor-pointer ${
            activeTab === "posts"
              ? "bg-[#149188] text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Posts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bookmarks")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition cursor-pointer ${
            activeTab === "bookmarks"
              ? "bg-[#149188] text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarks</span>
        </button>
      </div>

      {/* Tabs Content */}
      <div className="space-y-4">
        {activeTab === "posts" && (
          <>
            {postsLoading ? (
              <LoaderApi />
            ) : myPosts.length > 0 ? (
              myPosts.map((post: any) => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                <p className="text-sm text-gray-400">You haven't posted anything yet.</p>
              </div>
            )}
          </>
        )}

        {activeTab === "bookmarks" && (
          <>
            {bookmarksLoading ? (
              <LoaderApi />
            ) : bookmarksPosts.length > 0 ? (
              bookmarksPosts.map((post: any) => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                <p className="text-sm text-gray-400">No bookmarked posts found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}