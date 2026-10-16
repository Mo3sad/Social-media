import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../../../../Context/userData.Context";
import { Calendar, Users, Bookmark, UserCheck, Camera, Eye, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import ImageModal from "../../../../components/ImageModal/ImageModal";
import { FollowItem } from "./components/UserListItem";

const DEFAULT_PHOTO =
  "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

export default function ProfileHeader() {
  const userContext = useContext(userDataContext);
  const navigate = useNavigate();
  const userData = userContext?.userData;
  const setUserData = userContext?.setuserData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!userData) return null;

  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("photo", file);

      return axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (response) => {
      toast.success("Profile photo updated successfully!");
      setUploading(false);

      const newPhoto = response.data?.data?.photo;
      if (newPhoto && setUserData) {
        setUserData({ ...userData, photo: newPhoto });
      }
    },
    onError: (error: any) => {
      setUploading(false);
      toast.error(error.response?.data?.message || "Failed to upload photo");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setUploading(true);
    uploadPhotoMutation.mutate(file);
    setShowMenu(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setShowMenu(false);
  };

  const handleViewPhoto = () => {
    setShowPhotoModal(true);
    setShowMenu(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const currentList = modalType === "followers" ? userData?.followers : userData?.following;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors duration-300 mb-6 overflow-hidden">
      
      {/* 🖼️ غلاف فخم وأنيق */}
      <div className="h-40 sm:h-52 w-full bg-gradient-to-r from-[#149188] via-teal-600 to-slate-900 relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="px-6 sm:px-8 pb-6 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="relative group" ref={menuRef}>
              <button
                type="button"
                disabled={uploading}
                onClick={() => setShowMenu((prev) => !prev)}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-slate-900 shadow-xl group relative overflow-hidden cursor-pointer bg-white"
                aria-label="Profile photo options"
              >
                <img
                  src={userData.photo || DEFAULT_PHOTO}
                  alt={userData.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PHOTO;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </button>

              {showMenu && (
                <div className="absolute left-1/2 bottom-[calc(100%+10px)] -translate-x-1/2 z-50 w-48 overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={handleViewPhoto}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#149188]" />
                    <span>View photo</span>
                  </button>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleUploadClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition disabled:opacity-50 cursor-pointer border-t border-gray-100 dark:border-slate-700/50"
                  >
                    <Camera className="w-4 h-4 text-[#149188]" />
                    <span>{uploading ? "Uploading..." : "Upload photo"}</span>
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-1">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {userData.name}
              </h1>
              <p className="text-sm font-medium text-gray-400 dark:text-gray-400 mt-0.5">
                @{userData.username}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
                <Calendar className="w-3.5 h-3.5 text-[#149188]" />
                <span>Joined {formatDate(userData.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 إحصائيات عصرية في كروت منفصلة ونظيفة */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
          
          <button
            onClick={() => setModalType("followers")}
            className="p-3 rounded-2xl bg-gray-50/70 dark:bg-slate-800/60 hover:bg-teal-50/40 dark:hover:bg-slate-800 transition cursor-pointer group border border-transparent hover:border-teal-500/20 shadow-xs"
          >
            <div className="flex items-center justify-center gap-1.5 text-gray-400 dark:text-gray-400 text-xs font-semibold mb-1 group-hover:text-[#149188]">
              <Users className="w-4 h-4 text-[#149188]" />
              <span>Followers</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {userData.followersCount || 0}
            </span>
          </button>

          <button
            onClick={() => setModalType("following")}
            className="p-3 rounded-2xl bg-gray-50/70 dark:bg-slate-800/60 hover:bg-teal-50/40 dark:hover:bg-slate-800 transition cursor-pointer group border border-transparent hover:border-teal-500/20 shadow-xs"
          >
            <div className="flex items-center justify-center gap-1.5 text-gray-400 dark:text-gray-400 text-xs font-semibold mb-1 group-hover:text-[#149188]">
              <UserCheck className="w-4 h-4 text-[#149188]" />
              <span>Following</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {userData.followingCount || 0}
            </span>
          </button>

          <div className="p-3 rounded-2xl bg-gray-50/70 dark:bg-slate-800/60 text-center shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-gray-400 dark:text-gray-400 text-xs font-semibold mb-1">
              <Bookmark className="w-4 h-4 text-[#149188]" />
              <span>Bookmarks</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {userData.bookmarksCount || 0}
            </span>
          </div>
        </div>

        {/* مودال عرض الصورة الشخصية */}
        <ImageModal
          isOpen={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          imageUrl={userData.photo || DEFAULT_PHOTO}
          altText={userData.name}
          title="Profile Photo"
        />

        {/* 🟢 نافذة منبثقة (Modal) لعرض المتابعين أو المتابَعين */}
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800">
              
              {/* Header Modal */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                <h3 className="text-base font-bold text-gray-900 dark:text-white capitalize">
                  {modalType}
                </h3>
                <button
                  onClick={() => setModalType(null)}
                  className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto p-4 space-y-2">
                {currentList && currentList.length > 0 ? (
                  currentList.map((idItem: any) => {
                    const targetId = typeof idItem === "string" ? idItem : idItem._id || idItem.id;
                    const isMyAccount = targetId === userData?._id;

                    return (
                      <FollowItem
                        key={targetId}
                        userId={targetId}
                        onClick={() => {
                          setModalType(null);
                          if (isMyAccount) {
                            navigate(`/profile`);
                          } else {
                            navigate(`/UserProfile/${targetId}`);
                          }
                        }}
                      />
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm font-medium">
                    No {modalType} found.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}