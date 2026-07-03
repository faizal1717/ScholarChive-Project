"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function FormLogin() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotErrors, setForgotErrors] = useState<{email?: string, otp?: string, password?: string}>({});
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const newErrors: {email?: string, password?: string} = {};
    if (!email.trim()) newErrors.email = t("errorEmailEmpty");
    if (!password.trim()) newErrors.password = t("errorPasswordEmpty");
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t("loginSuccess"));
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 1500);
      } else {
        toast.error(data.message || t("loginFailed"));
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail.trim()) {
      setForgotErrors({ email: t("enterEmail") });
      return;
    }
    setForgotErrors({});

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        toast.success(data.message || t("otpSentSuccess"));
      } else {
        toast.error(data.message || t("otpSendFailed"));
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {otp?: string, password?: string} = {};
    if (!otp.trim()) newErrors.otp = t("errorOtpEmpty");
    if (!newPassword.trim()) newErrors.password = t("errorNewPasswordEmpty");
    
    if (Object.keys(newErrors).length > 0) {
      setForgotErrors(newErrors);
      return;
    }
    setForgotErrors({});

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp,
          newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(t("resetSuccess"));
        setShowForgot(false);
        setOtpSent(false);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        toast.error(data.message || t("resetFailed"));
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (showForgot) {
    return (
      <div className="w-full max-w-md">
        <div className="border rounded-lg border-gray-300 p-8 bg-white shadow-sm">
          <div className="w-full flex gap-3 py-1 items-center mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <h2 className="text-2xl font-semibold text-gray-700">{t("forgotTitle")}</h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <p className="text-xs text-gray-500 text-center">
                {t("forgotDesc")}
              </p>
              <div>
                <label className="text-gray-700 text-xs font-semibold pb-1 block">{t("email")}</label>
                <input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    if (forgotErrors.email) setForgotErrors({ ...forgotErrors, email: undefined });
                  }}
                  placeholder={t("forgotEmailPlaceholder")}
                  className={`text-xs text-gray-700 p-3 w-full rounded border ${forgotErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none`}
                />
                {forgotErrors.email && (
                  <p className="text-red-500 text-[11px] mt-1 font-medium">{forgotErrors.email}</p>
                )}
              </div>

              <button
                id="forgot-send-otp"
                type="submit"
                disabled={loading}
                className="bg-[#0D9488] font-semibold w-full text-sm text-white p-3 rounded cursor-pointer hover:bg-[#0b7d72] transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  t("sendOtp")
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="w-full text-center text-xs font-semibold text-gray-500 hover:text-gray-700 py-1.5 cursor-pointer"
              >
                {t("backToLogin")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-gray-700 text-xs font-semibold pb-1 block">{t("otpLabel")}</label>
                <input
                  id="forgot-otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (forgotErrors.otp) setForgotErrors({ ...forgotErrors, otp: undefined });
                  }}
                  placeholder={t("otpPlaceholder")}
                  className={`text-xs text-center font-mono tracking-widest text-gray-700 p-3 w-full rounded border ${forgotErrors.otp ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none`}
                  maxLength={6}
                />
                {forgotErrors.otp && (
                  <p className="text-red-500 text-[11px] mt-1 font-medium text-center">{forgotErrors.otp}</p>
                )}
              </div>

              <div>
                <label className="text-gray-700 text-xs font-semibold pb-1 block">{t("newPasswordLabel")}</label>
                <input
                  id="forgot-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (forgotErrors.password) setForgotErrors({ ...forgotErrors, password: undefined });
                  }}
                  placeholder={t("newPasswordPlaceholder")}
                  className={`text-xs text-gray-700 p-3 w-full rounded border ${forgotErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none`}
                />
                {forgotErrors.password && (
                  <p className="text-red-500 text-[11px] mt-1 font-medium">{forgotErrors.password}</p>
                )}
              </div>

              <button
                id="forgot-submit-reset"
                type="submit"
                disabled={loading}
                className="bg-[#0D9488] font-semibold w-full text-sm text-white p-3 rounded cursor-pointer hover:bg-[#0b7d72] transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  t("resetPassword")
                )}
              </button>

              <div className="flex justify-between items-center text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[#0D9488] hover:underline font-semibold cursor-pointer"
                >
                  {t("changeEmail")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setOtpSent(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 font-semibold cursor-pointer"
                >
                  {t("backToLogin")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="border rounded-lg border-gray-300 p-8 bg-white shadow-sm">
        <div className="w-full flex gap-3 py-1 items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <h2 className="text-2xl font-semibold flex text-gray-700 justify-center">
            {t("welcome")}
          </h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="text-gray-600 text-sm w-full flex justify-center mb-10">
          {t("subtitle")}
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <span className="text-gray-700 text-xs pb-1 block font-semibold">{t("email")} <span className="text-red-400">*</span></span>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder={t("emailPlaceholder")}
              className={`text-xs text-gray-700 p-3 w-full rounded border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none`}
            />
            {errors.email && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>
            )}
          </div>
          <div>
            <span className="text-gray-700 text-xs pb-1 block font-semibold">{t("password")} <span className="text-red-400">*</span></span>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder={t("passwordPlaceholder")}
              className={`text-xs text-gray-700 p-3 w-full rounded border ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none`}
            />
            {errors.password && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.password}</p>
            )}
          </div>
          <div className="flex w-full justify-end text-xs text-[#0D9488]">
            <button
              id="login-forgot-password-link"
              type="button"
              onClick={() => setShowForgot(true)}
              className="cursor-pointer font-semibold hover:underline bg-transparent border-none"
            >
              {t("forgotPassword")}
            </button>
          </div>
          <button
            id="login-submit"
            type="submit"
            className="bg-[#0D9488] font-semibold w-full text-sm text-white p-3 rounded cursor-pointer hover:bg-[#0b7d72] transition"
          >
            {t("login")}
          </button>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs text-gray-500 font-semibold">{t("or")}</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="w-full">
            <Link
              href={`/${locale}/register`}
              className="block text-center font-semibold text-[#0D9488] w-full border border-[#0d9488] hover:bg-[#0d9488] hover:text-white p-3 text-sm rounded transition"
            >
              {t("register")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

