"use client";

import { XIcon, DownloadIcon, FileTextIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

const downloadFile = async (url: string, name: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = url.split(".").pop() || "";
    const fileName = name.includes(".") ? name : `${name}.${ext}`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  } catch {
    window.open(url, "_blank");
  }
};

export default function PreviewModal({ isOpen, onClose, fileUrl, fileName }: PreviewModalProps) {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 animate-scaleIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="bg-[#0D9488]/10 p-1.5 rounded-lg text-[#0D9488] flex-shrink-0">
              <FileTextIcon size={16} />
            </div>
            <h3 className="font-semibold text-gray-800 truncate text-sm">
              {fileName}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <button
              onClick={async () => {
                setDownloading(true);
                await downloadFile(fileUrl, fileName);
                setDownloading(false);
              }}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D9488] text-white hover:bg-[#0b7d72] text-xs font-semibold rounded-lg transition cursor-pointer disabled:opacity-60"
            >
              {downloading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <DownloadIcon size={13} />
              )}
              Unduh
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 p-4 bg-gray-100 flex flex-col min-h-[300px]">
          <iframe
            src={fileUrl}
            className="w-full flex-1 min-h-[65vh] rounded-lg border border-gray-300 bg-white"
            title={fileName}
          />
        </div>
      </div>
    </div>
  );
}
