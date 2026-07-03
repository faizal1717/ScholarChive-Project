"use client";

import { BookOpenIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Courses() {
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("LeftSide");

  return (
    <Link href={`/${locale}/courses`}>
      <div className="flex gap-2 p-3 mt-1 hover:bg-[#dcf1ef] rounded-lg cursor-pointer transition">
        <BookOpenIcon width={20} height={20}></BookOpenIcon>
        <span className="font-semibold text-sm">{t("courses")}</span>
      </div>
    </Link>
  );
}
