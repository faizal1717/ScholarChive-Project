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
  const [errorName, setErrorName] = useState("");
  const t = useTranslations("FormCourse");
  const tCommon = useTranslations("Common");

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorName("Nama mata kuliah tidak boleh kosong");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
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
      setErrorName("");

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

        <div>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorName) setErrorName("");
            }}
            placeholder={t("courseNamePlaceholder")}
            className={`w-full border focus:outline-none rounded-lg p-3 ${errorName ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488]'}`} />
          {errorName && (
            <p className="text-red-500 text-[11px] mt-1 font-medium">{errorName}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => {
              setName("");
              setErrorName("");
              onClose();
            }}
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

