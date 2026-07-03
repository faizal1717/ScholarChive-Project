"use client";

import { LayersIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Modules() {
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("LeftSide");

  return (
    <Link href={`/${locale}/modules`}>
      <div className="flex gap-2 p-3 mt-1 hover:bg-[#dcf1ef] rounded-lg cursor-pointer transition">
        <LayersIcon width={20} height={20}></LayersIcon>
        <span className="font-semibold text-sm">{t("modules")}</span>
      </div>
    </Link>
  );
}
