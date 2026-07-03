"use client";

import Image from "next/image";
import {
  LogInIcon,
  LogOutIcon,
  PhoneCallIcon,
  UserPlusIcon,
  UsersIcon,
  UserIcon,
} from "lucide-react";
import Search from "./Navbar/Search/Search";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import ButtonSwitch from "./ButtonSwitch/ButtonSwitch";
import { useEffect, useState } from "react";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <div className="mb-3">
      <div className="w-full shadow-sm border-b border-gray-300 xl:block hidden">
        <div className="bg-[#def0ee] h-8.5 flex items-center px-5 text-gray-600">
          <div className="flex items-center w-full justify-end gap-3">
            <Image width={16} height={16} alt="ig" src="/logo-instagram.png" />
          </div>
          <div className="w-1/3 flex items-center gap-4 text-xs justify-end">
            <div className="flex items-center gap-1 hover:text-[#0D9488] transition cursor-pointer">
              <Link
                href={`/${locale}/about-us`}
                className="font-medium cursor-pointer flex items-center gap-1"
              >
                <UsersIcon width={14} height={14} />
                <span>{t("aboutUs")}</span>
              </Link>
            </div>

            <div className="flex items-center gap-1 pr-4 hover:text-[#0D9488] transition cursor-pointer">
              <Link
                href={`/${locale}/contact-us`}
                className="font-medium cursor-pointer flex items-center gap-1"
              >
                <PhoneCallIcon width={14} height={14} />
                <span>{t("contactUs")}</span>
              </Link>
            </div>
            <div className="flex items-center w-1/5">
              <ButtonSwitch></ButtonSwitch>
            </div>
          </div>
        </div>

        <div className="bg-white h-20 flex items-center justify-between px-5">
          <Link href={`/${locale}`}>
            <Image
              width={120}
              height={22}
              src="/logo-landscape-scholarchive.png"
              alt="ScholarChive"
              className="cursor-pointer"
            />
          </Link>
          <div className="flex-1 px-8">
            <Search />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 mx-2 border border-gray-300 bg-gray-300"></div>
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/profile`}
                  className="relative gap-2 overflow-hidden inline-flex items-center rounded py-1.5 px-4 font-semibold text-sm text-[#0D9488] hover:text-white cursor-pointer border border-[#0D9488] hover:bg-[#0D9488] transition"
                >
                  <UserIcon width={16} height={16}></UserIcon>
                  {t("profile")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="relative gap-2 overflow-hidden inline-flex items-center rounded py-1.5 px-4 font-semibold text-sm text-white cursor-pointer bg-red-500 hover:bg-red-600 transition"
                >
                  <LogOutIcon width={16} height={16}></LogOutIcon>
                  {t("logout")}
                </button>
              </div>
            ) : (
              <>
                <Link
                  type="button"
                  href={`/${locale}/login`}
                  className="relative overflow-hidden inline-flex items-center gap-1 rounded py-1.5 px-4 font-semibold text-sm hover:text-white cursor-pointer hover:bg-[#0D9488] border border-[#0D9488] text-[#0D9488]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LogInIcon width={16} height={16} />
                    {t("login")}
                  </span>
                </Link>

                <Link
                  type="button"
                  href={`/${locale}/register`}
                  className="relative overflow-hidden inline-flex items-center gap-1 rounded py-1.5 px-4 font-semibold text-sm text-white cursor-pointer bg-[#0D9488]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <UserPlusIcon width={16} height={16} />
                    {t("register")}
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
