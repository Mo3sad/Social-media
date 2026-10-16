import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import LoaderApi from "../../components/LoaderApi/LoaderApi";
import { UserPlus, UserCheck, FileText, X } from "lucide-react";
import toast from "react-hot-toast";
import PostCard from "../Home/components/PostCard/PostCard";
import { userDataContext } from "../../Context/userData.Context";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userContext = useContext(userDataContext);

  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null,
  );

 
  const { data: profileRes, isLoading: isProfileLoading } = useQuery({
    queryKey: ["getUserProfileData", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/profile`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    enabled: !!userId,
  });


  const { data: postsRes, isLoading: isPostsLoading } = useQuery({
    queryKey: ["getUserPosts", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(
        `https://route-posts.routemisr.com/users/${userId}/posts`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    enabled: !!userId,
  });

  const profileData = profileRes?.data;
  const userInfo = profileData?.user;
  const userPosts = postsRes?.data?.posts || postsRes?.posts || [];

  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (profileData?.isFollowing !== undefined) {
      setIsFollowing(profileData.isFollowing);
    }
  }, [profileData]);

 
  const { mutate: handleFollow, isPending: isFollowPending } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("userToken");
      return axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      setIsFollowing((prev) => !prev);
      toast.success(
        isFollowing ? "Unfollowed successfully" : "Followed successfully",
      );
      queryClient.invalidateQueries({
        queryKey: ["getUserProfileData", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["getMyProfile"] });
      if (userContext?.getUserProfile) {
        userContext.getUserProfile();
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoaderApi />
      </div>
    );
  }


  const currentList =
    modalType === "followers" ? userInfo?.followers : userInfo?.following;

  return (
    <div className="max-w-4xl mx-auto pb-10 bg-gray-50 dark:bg-slate-950 min-h-screen relative">
      {/* 🟦 كارد الغلاف والبروفايل */}
      <div className="bg-white dark:bg-slate-900 shadow-sm rounded-b-3xl overflow-hidden border-b border-gray-100 dark:border-slate-800">
        {/* Cover Photo */}
        <div className="h-48 md:h-72 w-full bg-gradient-to-r from-[#149188] to-teal-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Profile Details Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between -mt-16 md:-mt-20 mb-4 gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="relative">
                <img
                  src={
                    userInfo?.photo ||
                    "https://static.vecteezy.com/system/resources/previews/009/292/652/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt={userInfo?.name || "User"}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-xl bg-white"
                />
              </div>

              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {userInfo?.name || "User Profile"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  @
                  {userInfo?.username ||
                    userInfo?.email?.split("@")[0] ||
                    "username"}
                </p>

                {/* 🎯 إحصائيات قابلة للضغط لتفتح المودال */}
                <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <button
                    onClick={() => setModalType("followers")}
                    className="hover:text-[#149188] transition cursor-pointer"
                  >
                    <strong className="text-gray-900 dark:text-white">
                      {userInfo?.followersCount || 0}
                    </strong>{" "}
                    Followers
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setModalType("following")}
                    className="hover:text-[#149188] transition cursor-pointer"
                  >
                    <strong className="text-gray-900 dark:text-white">
                      {userInfo?.followingCount || 0}
                    </strong>{" "}
                    Following
                  </button>
                </div>
              </div>
            </div>

            {/* زر الـ Follow */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center pb-2">
              <button
                type="button"
                onClick={() => handleFollow()}
                disabled={isFollowPending}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm disabled:opacity-50 ${
                  isFollowing
                    ? "bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 border border-gray-200 dark:border-slate-700"
                    : "bg-[#149188] hover:bg-[#10766f] text-white"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex gap-6 text-sm font-semibold text-[#149188]">
            <span className="border-b-2 border-[#149188] pb-3 cursor-pointer">
              Posts
            </span>
          </div>
        </div>
      </div>

      {/* 📄 لستة البوستات */}
      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
        {isPostsLoading ? (
          <div className="flex justify-center py-10">
            <LoaderApi />
          </div>
        ) : userPosts.length > 0 ? (
          userPosts.map((post: any) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">
              No posts available yet.
            </p>
          </div>
        )}
      </div>

      {/* 🟢 نافذة منبثقة (Modal) لعرض قائمة الـ Followers أو Following */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white capitalize">
                {modalType}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-4 space-y-3">
              {currentList && currentList.length > 0 ? (
                currentList.map((user: any) => {
                  const targetId = user._id || user.id;
                  return (
                    <div
                      key={targetId}
                      onClick={() => {
                        setModalType(null); // قفل المودال
                        navigate(`/UserProfile/${targetId}`); // الانتقال لبروفايله
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <img
                        src={
                          user.photo ||
                          "https://static.vecteezy.com/system/resources/previews/009/292/652/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                        }
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white hover:underline">
                          {user.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          @{user.username || "user"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No {modalType} found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
