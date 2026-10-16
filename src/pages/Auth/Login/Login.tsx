import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  type loginSchemaType,
} from "../../../schemas/auth.schema";

import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { userDataContext } from "../../../Context/userData.Context";


export default function LoginationForm() {
 
const [erorr, seterorr] = useState<string | null>(null);
const [isLoding, setisLoding] = useState(false);


const context = useContext(userDataContext);



const Navigate = useNavigate();

const form = useForm<loginSchemaType>({
  defaultValues: {
    email: "",
    password: "",
  },
  resolver: zodResolver(loginSchema),
  mode: "onChange",
});

const { register, handleSubmit, formState } = form;



async function handelRegister(value: loginSchemaType) {
  setisLoding(true);
  seterorr(null);

  try {

    const loginResponse = await axios.post(
      "https://route-posts.routemisr.com/users/signin",
      value,
    );


    const token = loginResponse.data.data.token;

    localStorage.setItem("userToken", token);

   
    const profileResponse = await axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      {
        headers: {
          token,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    

   
    const user = profileResponse.data.data.user;

    if (!user) {
      throw new Error("User data not found in profile response");
    }

    if (!context) {
      throw new Error("UserDataProvider is missing");
    }

    context.setuserData(user);

    
    Navigate("/");
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      seterorr(
        err.response?.data?.message || "Failed to login or load profile",
      );
    } else if (err instanceof Error) {
      seterorr(err.message);
    } else {
      seterorr("Something went wrong");
    }
  } finally {
    setisLoding(false);
  }
}


  return (
    <div
      className="min-h-screen bg-[#eaf2f8] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300"
      dir="ltr"
    >
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 w-full max-w-md transition-all">
        {/* Header / Brand Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#149188] rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-md shadow-teal-500/20">
            S
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Log in to access your account
          </p>
        </div>

        {/* Global Error Banner */}
        {erorr && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-medium text-center py-3 px-4 rounded-xl mb-4">
            {erorr}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(handelRegister)}>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoding}
            className="w-full mt-2 bg-[#149188] hover:bg-[#0f736c] disabled:bg-[#149188]/60 text-white font-semibold py-3 rounded-xl shadow-md shadow-teal-500/20 transition duration-200 flex items-center justify-center gap-2"
          >
            {isLoding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Register Redirect Link */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/Register"
            className="text-[#149188] dark:text-teal-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
