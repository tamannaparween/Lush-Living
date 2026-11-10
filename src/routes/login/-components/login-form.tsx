import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, Leaf } from "lucide-react";

import {
  loginSchema,
  type LoginFormValues,
} from "../../../features/auth/schemas/login.schema";
import { login } from "../../../features/auth/services/auth";
import { useAuthStore } from "../../../features/auth/store/auth.store";

export function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoginError(null);

    try {
      const user = await login(values);

      setUser(user);

      await navigate({
        to: user.role === "admin" ? "/admin" : "/",
      });
    } catch {
      setLoginError("Invalid email or password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-6"
    >
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-[#263D2C]">
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          placeholder="Enter your email"
          className="w-full rounded-xl border border-[#DCE5D5] bg-white px-4 py-3.5 text-sm text-[#263D2C] outline-none transition placeholder:text-stone-400 hover:border-[#A9BDA0] focus:border-[#668A62] focus:ring-4 focus:ring-[#668A62]/10"
        />

        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-[#263D2C]"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-[#DCE5D5] bg-white px-4 py-3.5 pr-12 text-sm text-[#263D2C] outline-none transition placeholder:text-stone-400 hover:border-[#A9BDA0] focus:border-[#668A62] focus:ring-4 focus:ring-[#668A62]/10"
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-stone-400 transition hover:text-[#285B35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285B35]"
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Login Error */}
      {loginError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {loginError}
        </p>
      )}

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 flex w-full items-center justify-center gap-3 rounded-xl bg-[#174B36] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103B2A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174B36] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          "Signing in..."
        ) : (
          <>
            Sign In
            <ArrowRight className="size-5" />
          </>
        )}
      </button>

      {/* Small Trust Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
        <Leaf className="size-4 text-[#668A62]" />
        Your greener space starts here.
      </div>
    </form>
  );
}
