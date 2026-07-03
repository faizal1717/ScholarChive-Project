import ProfileClient from "@/app/components/Profile/ProfileClient";
import Link from "next/link";
import { SettingsIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("Profile");

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="mx-auto min-h-screen w-full max-w-[968px] p-3">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
          </div>
          <Link href={`/${locale}/settings`}>
            <button className="flex items-center cursor-pointer gap-2 px-4 py-2 border border-[#0D9488] rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-sm transition-all active:scale-[0.98]">
              <SettingsIcon size={16} className="text-[#0D9488]" />
              {t("editProfile")}
            </button>
          </Link>
        </div>

        <ProfileClient />
      </div>
    </div>
  );
}
