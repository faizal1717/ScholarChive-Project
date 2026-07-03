"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function FormCourse({
  open,

  onClose,

  semesterId,

  onSuccess,
}: any) {
  const [name, setName] = useState("");
  const t = useTranslations("FormCourse");
  const tCommon = useTranslations("Common");

  if (!open) return null;

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("http://localhost:3001/api/courses", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,

        userId: user.id,

        semesterId,
      }),
    });

    if (res.ok) {
      toast.success(t("addSuccess"));

      setName("");

      onClose();

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } else {
      toast.error(t("addFailed"));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-5">{t("addCourse")}</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("courseNamePlaceholder")}
          className="w-full border focus:outline-none rounded-lg p-3" />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg cursor-pointer">
            {tCommon("cancel")}
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#0D9488] text-white px-4 py-2 rounded-lg cursor-pointer">
            {tCommon("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
