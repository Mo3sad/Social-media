import { Image } from "lucide-react";
import { userDataContext } from "../../../../Context/userData.Context";
import { useContext, useState } from "react";
import CreatePostModal from "../CreatePostModal/CreatePostModal";

export default function CreatePost() {
  const user = useContext(userDataContext);
  const userData = user?.userData;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  };

  return (
    <div
      className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm transition-colors mb-4"
      dir="ltr"
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* صورة البروفايل */}
        <img
          src={
            userData?.photo ||
            "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
          }
          alt={userData?.name || "User"}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-gray-200 dark:border-slate-700"
        />

        {/* زرار فتح المودل (مضبوط ومقيد بـ min-w-0 عشان مايخرجش بره الشاشة) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 min-w-0 bg-gray-100 dark:bg-slate-800/80 hover:bg-gray-200/70 dark:hover:bg-slate-800 transition rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 cursor-pointer text-left overflow-hidden"
        >
          <span className="block text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal truncate">
            {`What's on your mind, ${userData?.name?.split(" ")[0] || "there"}?`}
          </span>
        </button>

        {/* زرار اختيار الصورة السريع */}
        <label className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-green-500 transition cursor-pointer shrink-0">
          <Image className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFile(null);
          setImagePreview(null);
        }}
        selectedImage={imagePreview}
        selectedFile={selectedFile}
        handleImageChange={handleImageChange}
        setSelectedImage={setImagePreview}
        setSelectedFile={setSelectedFile}
      />
    </div>
  );
}
