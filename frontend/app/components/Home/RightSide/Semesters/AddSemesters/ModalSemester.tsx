"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalSemester({ open, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const t = useTranslations("ModalSemester");
  const tCommon = useTranslations("Common");

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/semesters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          userId: user.id,
        }),
      });

      if (res.ok) {
        toast.success(t("addSuccess"));

        setName("");

        onSuccess();

        onClose();
      } else {
        toast.error(t("addFailed"));
      }
    } catch (error) {
      console.log(error);

      toast.error(tCommon("serverError"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{t("addSemester")}</h2>

        <input
          type="text"
          placeholder={t("semesterNamePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-0 border-gray-300"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#0D9488] text-gray-700 rounded-lg cursor-pointer"
          >
            {tCommon("cancel")}
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#0D9488] text-white rounded-lg cursor-pointer"
          >
            {tCommon("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
