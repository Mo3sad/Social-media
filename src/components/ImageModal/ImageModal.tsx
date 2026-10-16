import { X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
  title?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  altText = "Image preview",
  title = "Photo",
}: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-red-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center max-h-[75vh] overflow-hidden rounded-xl bg-slate-950">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-auto max-h-[75vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}