"use client";

import { UserIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ProfileButton() {
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("LeftSide");

  return (
    <Link href={`/${locale}/profile`}>
      <div className="flex gap-2 p-3 mt-1 hover:bg-[#dcf1ef] rounded-lg cursor-pointer transition-colors duration-150">
        <UserIcon width={20} height={20} />
        <span className="font-semibold text-sm">{t("profile")}</span>
      </div>
    </Link>
  );
}
