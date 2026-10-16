import {  useState } from "react";
import { Lock, KeyRound, ShieldCheck, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function Settings() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState(""); // تأكيد الباسورد لو حابب تتأكد إنه مطابق

  // Mutation لتغيير الباسورد
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { password: string; newPassword: string }) => {
      const token = localStorage.getItem("userToken");
      const res = await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onSuccess: (response) => {
      toast.success("Password changed successfully!");
      // لو الـ API بيرجع توكن جديد محتاج تحدثه في اللوكال ستورج:
      console.log(response);
      
      if (response?.token) {
        localStorage.setItem("userToken", response.token);
      }
      // تفريغ الحقول بعد النجاح
      setPassword("");
      setNewPassword("");
      setRePassword("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !newPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (rePassword && newPassword !== rePassword) {
      toast.error("New passwords do not match");
      return;
    }

    changePasswordMutation.mutate({ password, newPassword });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#149188]" />
          <span>Account Security</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Update your password to keep your account safe and secure.
        </p>
      </div>

      {/* Settings Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-gray-100 py-3 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-[#149188] transition"
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-gray-100 py-3 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-[#149188] transition"
                required
              />
            </div>
          </div>

          {/* Confirm New Password (اختياري لزيادة الأمان) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-gray-100 py-3 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-[#149188] transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="px-6 py-3 bg-[#149188] hover:bg-[#0f736c] text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {changePasswordMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span>{changePasswordMutation.isPending ? "Saving..." : "Update Password"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}