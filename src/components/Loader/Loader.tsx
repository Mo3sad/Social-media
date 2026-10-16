import React from "react";

export default function Loader(): React.JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#eaf2f8] dark:bg-slate-950 transition-colors duration-300">
      {/* Logo Wrapper */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-20 h-20 bg-teal-500/20 rounded-2xl animate-ping" />
        <div className="w-16 h-16 bg-[#149188] rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-teal-500/30 z-10 animate-bounce">
          S
        </div>
      </div>

      {/* Brand Name */}
      <div className="flex flex-col items-center mb-8">
        <span className="font-black text-2xl tracking-wider text-gray-800 dark:text-white">
          SOCIAL
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 tracking-[0.3em] font-medium -mt-1">
          media
        </span>
      </div>

      {/* Spinner */}
      <div className="w-8 h-8 border-2 border-teal-200 border-t-[#149188] rounded-full animate-spin" />
    </div>
  );
}
