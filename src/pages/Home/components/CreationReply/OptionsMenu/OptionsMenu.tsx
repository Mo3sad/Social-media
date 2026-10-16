import  { useRef, useState, useEffect } from "react";
import { MoreHorizontal, Edit3, Trash2 } from "lucide-react";

interface OptionsMenuProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  deleteLabel?: string;
  editLabel?: string;
}

export default function OptionsMenu({
  isOwner,
  onEdit,
  onDelete,
  isDeleting = false,
  deleteLabel = "Delete",
  editLabel = "Edit",
}: OptionsMenuProps) {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOwner) return null;

  return (
    <div className="relative" ref={optionsRef}>
      <button
        type="button"
        onClick={() => setShowOptions((previous) => !previous)}
        aria-label="Options"
        aria-expanded={showOptions}
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      >
        <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {showOptions && (
        <div className="absolute right-0 top-full mt-2 z-50 w-48 overflow-hidden rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
          {/* زر التعديل */}
          <button
            type="button"
            onClick={() => {
              setShowOptions(false);
              onEdit();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <Edit3 className="w-4 h-4 text-[#149188]" />
            <span>{editLabel}</span>
          </button>

          {/* زر الحذف */}
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => {
              setShowOptions(false);
              onDelete();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50 border-t border-gray-100 dark:border-slate-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? "Deleting..." : deleteLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}