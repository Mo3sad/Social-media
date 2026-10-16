import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  RegisterSchema,
  type RegisterSchemaType,
} from "../../../schemas/auth.schema";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function RegistrationForm() {
  const [erorr, seterorr] = useState<string | null>(null);
  const [isLoding, setisLoding] = useState<boolean>(false);
  const Navigate = useNavigate();

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState } = form;

  function handelRegister(vlaue: RegisterSchemaType) {
    console.log(vlaue);
    setisLoding(true);
    seterorr(null);
    axios
      .post("https://route-posts.routemisr.com/users/signup", vlaue)
      .then((res) => {
        console.log(res.data);
        Navigate("/login");
      })
      .catch((err) => {
        seterorr(err.response?.data?.message || "حدث خطأ أثناء التسجيل");
      })
      .finally(() => {
        setisLoding(false);
      });
  }

  return (
  <div className="min-h-screen bg-[#eaf2f8] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300" dir="ltr">
  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 w-full max-w-md transition-all">
    
    {/* Header / Brand Logo */}
    <div className="text-center mb-6">
      <div className="w-12 h-12 bg-[#149188] rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-md shadow-teal-500/20">
        S
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Create an Account
      </h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        Join us and start connecting with your friends
      </p>
    </div>

    {/* Global Error Banner */}
    {erorr && (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-medium text-center py-3 px-4 rounded-xl mb-4">
        {erorr}
      </div>
    )}

    <form className="space-y-4" onSubmit={handleSubmit(handelRegister)}>
      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <input
          {...register("name")}
          type="text"
          placeholder="Katherine Cole"
          className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-white px-4 py-2.5 rounded-xl border border-transparent focus:border-[#149188] focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
        />
        {formState.errors.name?.message && (
          <p className="text-red-500 text-xs mt-1">
            {formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="katherine@example.com"
          className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-white px-4 py-2.5 rounded-xl border border-transparent focus:border-[#149188] focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
        />
        {formState.errors.email?.message && (
          <p className="text-red-500 text-xs mt-1">
            {formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          Date of Birth
        </label>
        <input
          {...register("dateOfBirth")}
          type="date"
          defaultValue="2000-01-01"
          className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-white px-4 py-2.5 rounded-xl border border-transparent focus:border-[#149188] focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
        />
        {formState.errors.dateOfBirth?.message && (
          <p className="text-red-500 text-xs mt-1">
            {formState.errors.dateOfBirth.message}
          </p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          Gender
        </label>
        <select
          defaultValue="male"
          {...register("gender")}
          className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-white px-4 py-2.5 rounded-xl border border-transparent focus:border-[#149188] focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {formState.errors.gender?.message && (
          <p className="text-red-500 text-xs mt-1">
            {formState.errors.gender.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-white px-4 py-2.5 rounded-xl border border-transparent focus:border-[#149188] focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
        />
        {formState.errors.password?.message && (
          <p className="text-red-500 text-xs mt-1">
            {formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Re-Password */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          {...register("rePassword")}
          placeholder="••••••••"
          className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-gray-800 dark:text-white px-4 py-2.5 rounded-xl border border-transparent focus:border-[#149188] focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
        />
        {formState.errors.rePassword?.message && (
          <p className="text-red-500 text-xs mt-1">
            {formState.errors.rePassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoding}
        className="w-full mt-2 bg-[#149188] hover:bg-[#0f736c] disabled:bg-[#149188]/60 text-white font-semibold py-3 rounded-xl shadow-md shadow-teal-500/20 transition duration-200 flex items-center justify-center gap-2"
      >
        {isLoding ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Signing up...</span>
          </>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>

    {/* Login Link */}
    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-[#149188] dark:text-teal-400 font-semibold hover:underline"
      >
        Log In
      </Link>
    </p>

  </div>
</div>
  );
}