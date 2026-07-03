"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Setting() {
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("LeftSide");

  return (
    <Link href={`/${locale}/settings`}>
      <div className="flex gap-2 p-3 mt-1 hover:bg-[#dcf1ef] rounded-lg cursor-pointer transition-colors duration-150">
        <SettingsIcon width={20} height={20} />
        <span className="font-semibold text-sm">{t("settings")}</span>
      </div>
    </Link>
  );
}
