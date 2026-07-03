"use client";

import { HouseIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HomeButton() {
  const t = useTranslations("LeftSide");

  return (
    <div className="flex gap-2 p-3 mt-3 text-white bg-[#0D9488] rounded-lg">
      <HouseIcon width={20} height={20}></HouseIcon>
      <span className="font-semibold text-sm">{t("dashboard")}</span>
    </div>
  );
}
