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

  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("Register");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t("confirmMismatch") || "Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
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
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="text-xs text-gray-700 p-3 w-full rounded border border-gray-300 focus:outline-none focus:border-[#0D9488] mt-1"
            />
          </div>
          <div>
            <span className="text-gray-700 text-xs pb-1">{t("email")} </span>
            <span className="text-red-400">*</span>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="text-xs text-gray-700 p-3 w-full rounded border border-gray-300 focus:outline-none focus:border-[#0D9488] mt-1"
            />
          </div>
          <div>
            <span className="text-gray-700 text-xs pb-1">{t("phone")} </span>
            <span className="text-red-400">*</span>
            <input
              id="register-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
              className="text-xs text-gray-700 p-3 w-full rounded border border-gray-300 focus:outline-none focus:border-[#0D9488] mt-1"
            />
          </div>
          <div>
            <span className="text-gray-700 text-xs pb-1">{t("password")} </span>
            <span className="text-red-400">*</span>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className="text-xs text-gray-700 p-3 w-full rounded border border-gray-300 focus:outline-none focus:border-[#0D9488] mt-1"
            />
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("confirmPlaceholder")}
              className="text-xs text-gray-700 p-3 w-full rounded border border-gray-300 focus:outline-none focus:border-[#0D9488] mt-1"
            />
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
