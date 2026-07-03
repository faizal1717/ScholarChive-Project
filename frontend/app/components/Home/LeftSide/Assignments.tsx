"use client";

import { ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Assignments() {
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("LeftSide");

  return (
    <Link href={`/${locale}/assignments`}>
      <div className="flex gap-2 p-3 mt-1 hover:bg-[#dcf1ef] rounded-lg cursor-pointer transition">
        <ClipboardListIcon width={20} height={20}></ClipboardListIcon>
        <span className="font-semibold text-sm">{t("assignments")}</span>
      </div>
    </Link>
  );
}
