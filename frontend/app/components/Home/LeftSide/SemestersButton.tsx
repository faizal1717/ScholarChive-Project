"use client";

import { GraduationCap } from "lucide-react";

export default function SemestersButton() {
  return (
    <div className="flex gap-2 p-3 mt-1 hover:bg-[#dcf1ef] rounded-lg">
      <GraduationCap width={20} height={20}></GraduationCap>
      <span className="font-semibold text-sm">Semesters</span>
    </div>
  );
}
