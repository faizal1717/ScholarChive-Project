"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import ModalSemester from "./ModalSemester";
import { useTranslations } from "next-intl";

interface Props {
  onSuccess: () => void;
}

export default function AddButton({ onSuccess }: Props) {
  const [openModal, setOpenModal] = useState(false);
  const t = useTranslations("ModalSemester");

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="w-full h-full border-2 p-6 border-dashed border-[#0D9488] rounded-lg flex flex-col items-center justify-center hover:bg-[#dcf1ef] cursor-pointer"
      >
        <PlusIcon size={32} />

        <span className="font-semibold">{t("addSemester")}</span>
      </button>

      <ModalSemester
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
