import { useRef, useEffect } from "react";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

interface EmojiPickerPopoverProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
}

export default function EmojiPickerPopover({
  onEmojiSelect,
  isOpen,
  setIsOpen,
}: EmojiPickerPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // إغلاق القائمة عند الضغط خارج المكون
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* زرار فتح الإيموجي */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-1.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
          isOpen
            ? "text-[#149188] bg-slate-100 dark:bg-slate-800"
            : "text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        title="Add emoji"
      >
        <Smile className="w-5 h-5" />
      </button>

      {/* نافذة الإيموجي بيكر (تم ضبط التموضع بدقة للشاشات الكبيرة والموبايل) */}
      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-[300px] sm:w-[320px]">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
              lazyLoadEmojis={true}
              searchDisabled={false}
              width="100%"
              height={340}
              previewConfig={{ showPreview: false }}
            />
          </div>
        </div>
      )}
    </div>
  );
}