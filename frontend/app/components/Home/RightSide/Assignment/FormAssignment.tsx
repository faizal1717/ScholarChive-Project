"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { UploadCloudIcon, FileTextIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  courseId: string;
  onSuccess?: () => void;
}

export default function FormAssignment({ open, onClose, courseId, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("FormAssignment");
  const tCommon = useTranslations("Common");

  if (!open) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      if (!name.trim()) {
        const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
        setName(baseName);
        if (errorName) setErrorName("");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile && !name.trim()) {
      const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
      setName(baseName);
      if (errorName) setErrorName("");
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorName(t("assignmentNameEmpty") || "Nama tugas tidak boleh kosong");
      return;
    }

    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userId", user.id);
      formData.append("courseId", courseId);
      if (dueDate) {
        formData.append("dueDate", dueDate);
      }
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success(t("addSuccess"));
        setName("");
        setErrorName("");
        setDueDate("");
        setFile(null);
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        toast.error(t("addFailed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(tCommon("serverError"));
    } finally {
      setSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl border border-gray-300 animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-800 mb-5">{t("addAssignment")}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {t("assignmentName")} <span className="text-red-400">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorName) setErrorName("");
              }}
              placeholder={t("assignmentNamePlaceholder")}
              className={`w-full border rounded-lg p-3 focus:outline-0 ${errorName ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]'}`}
            />
            {errorName && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">{errorName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {t("dueDate")}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-0 border-gray-300 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {t("assignmentFile")}
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.xlsx,.doc,.xls,.png,.jpg,.jpeg,.txt"
            />

            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition duration-200 ${
                  isDragActive
                    ? "border-[#0D9488] bg-[#dcf1ef]"
                    : "border-gray-300 hover:border-[#0D9488] hover:bg-gray-50"
                }`}
              >
                <UploadCloudIcon className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  {t("dragDrop")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("fileTypes")}
                </p>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-[#0D9488]/10 p-2.5 rounded-lg text-[#0D9488] flex-shrink-0">
                    <FileTextIcon size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition cursor-pointer"
                    title={t("previewFile")}
                  >
                    <EyeIcon size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
                    title={t("deleteFile")}
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setName("");
              setErrorName("");
              setDueDate("");
              setFile(null);
              onClose();
            }}
            disabled={submitting}
            className="border px-4 py-2 border-[#0D9488] text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50"
          >
            {tCommon("cancel")}
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#0D9488] text-white px-5 py-2 rounded-lg hover:bg-[#0b7d72] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {tCommon("saving")}
              </>
            ) : (
              tCommon("save")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

