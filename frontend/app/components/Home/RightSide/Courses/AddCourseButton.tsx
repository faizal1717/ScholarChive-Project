"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import FormCourse from "./FormCourse";
import { useTranslations } from "next-intl";

export default function AddCourseButton({ semesterId, onSuccess }: any) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("FormCourse");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex gap-2 items-center border border-[#0D9488] text-[#0D9488] px-4 py-3 rounded-lg cursor-pointer hover:bg-[#0D9488]/5 transition"
      >
        <PlusIcon size={18} />
        {t("addCourse")}
      </button>

      <FormCourse
        open={open}
        onClose={() => setOpen(false)}
        semesterId={semesterId}
        onSuccess={onSuccess}
      />
    </>
  );
}
