import { Loader2 } from "lucide-react";

interface LoaderProps {
  fullScreen?: boolean; // خيار لجعل اللودر يغطي الصفحة بالكامل أو يظهر داخل كارت
  text?: string;
}

export default function Loader({ fullScreen = true, text = "Loading..." }: LoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 transition-colors duration-300 ${
        fullScreen
          ? "fixed inset-0 min-h-screen bg-[#eaf2f8]/80 dark:bg-slate-950/80 backdrop-blur-sm z-50"
          : "w-full py-12 bg-transparent"
      }`}
      dir="ltr"
    >
      {/* Outer Glowing Circle + Animated Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute w-12 h-12 bg-[#149188]/20 rounded-full blur-md animate-pulse"></div>

        {/* Main Spinner Icon */}
        <Loader2 className="w-10 h-10 text-[#149188] animate-spin relative z-10" />
      </div>

      {/* Loading Text */}
      {text && (
        <p className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-300 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}