"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function FormRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{name?: string, email?: string, phone?: string, password?: string, confirmPassword?: string}>({});

  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("Register");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const newErrors: {name?: string, email?: string, phone?: string, password?: string, confirmPassword?: string} = {};
    if (!name.trim()) newErrors.name = t("errorNameEmpty");
    if (!email.trim()) newErrors.email = t("errorEmailEmpty");
    if (!phone.trim()) newErrors.phone = t("errorPhoneEmpty");
    if (!password.trim()) newErrors.password = t("errorPasswordEmpty");
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t("errorConfirmEmpty");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("confirmMismatch");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t("registerSuccess"));
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 2000);
      } else {
        toast.error(data.message || t("registerFailed"));
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="border rounded-lg border-gray-300 p-8 py-10">
        <div className="w-full flex gap-3 items-center mb-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <h2 className="text-2xl font-semibold text-gray-700 flex justify-center">
            {t("title")}
          </h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="text-gray-600 gap-1 text-sm w-full flex justify-center mb-8">
          <span>{t("subtitle")}</span>{" "}
          <Link href={`/${locale}/login`} className="text-[#0D9488] font-medium ml-1">
            {t("login")}
          </Link>
        </div>
        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <span className="text-gray-700 text-xs pb-1">{t("name")} </span>
            <span className="text-red-400">*</span>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder={t("namePlaceholder")}
              className={`text-xs text-gray-700 p-3 w-full rounded border ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none mt-1`}
            />
            {errors.name && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.name}</p>
            )}
          </div>
          <div>
            <span className="text-gray-700 text-xs pb-1">{t("email")} </span>
            <span className="text-red-400">*</span>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder={t("emailPlaceholder")}
              className={`text-xs text-gray-700 p-3 w-full rounded border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none mt-1`}
            />
            {errors.email && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>
            )}
          </div>
          <div>
            <span className="text-gray-700 text-xs pb-1">{t("phone")} </span>
            <span className="text-red-400">*</span>
            <input
              id="register-phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder={t("phonePlaceholder")}
              className={`text-xs text-gray-700 p-3 w-full rounded border ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none mt-1`}
            />
            {errors.phone && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.phone}</p>
            )}
          </div>
          <div>
            <span className="text-gray-700 text-xs pb-1">{t("password")} </span>
            <span className="text-red-400">*</span>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder={t("passwordPlaceholder")}
              className={`text-xs text-gray-700 p-3 w-full rounded border ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none mt-1`}
            />
            {errors.password && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.password}</p>
            )}
          </div>
          <div>
            <span className="text-gray-700 text-xs pb-1">
              {t("confirmPassword")}{" "}
            </span>
            <span className="text-red-400">*</span>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              placeholder={t("confirmPlaceholder")}
              className={`text-xs text-gray-700 p-3 w-full rounded border ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'} focus:outline-none mt-1`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="bg-[#0D9488] my-3 font-semibold w-full text-sm text-white p-3 rounded cursor-pointer hover:bg-[#0b8278] transition disabled:opacity-70"
          >
            {loading ? "..." : t("register")}
          </button>
        </form>
      </div>
    </div>
  );
}

