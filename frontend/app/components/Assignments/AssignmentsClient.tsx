"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ClipboardListIcon,
  BookOpenIcon,
  CalendarIcon,
  FileTextIcon,
  EyeIcon,
  DownloadIcon,
} from "lucide-react";
import PreviewModal from "@/app/components/PreviewModal/PreviewModal";
import { useTranslations } from "next-intl";

interface Assignment {
  _id: string;
  name: string;
  courseId: { _id: string; name: string } | string;
  dueDate?: string;
  fileUrl?: string;
  createdAt: string;
}

const getFullFileUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
};

const getFileExtension = (url?: string) => {
  if (!url) return "";
  return url.split(".").pop()?.toUpperCase() || "";
};

const handleDownload = async (url: string, name: string) => {
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

export default function AssignmentsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("Assignments");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleOpenPreview = (url: string, name: string) => {
    setPreviewUrl(url);
    setPreviewName(name);
    setPreviewOpen(true);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      router.replace(`/${locale}/login`);
      return;
    }

    const fetchAssignments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setAssignments(data);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [router, locale]);



  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[1, 2].map((group) => (
          <div key={group}>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-gray-200 p-2 w-9 h-9"></div>
              <div className="h-5 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 bg-white rounded-xl p-4 flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const grouped: Record<string, { courseName: string; courseId: string; assignments: Assignment[] }> = {};
  assignments.forEach((ass) => {
    const course = ass.courseId as { _id: string; name: string };
    const courseId = course?._id || "unknown";
    const courseName = course?.name || t("unknownCourse");
    if (!grouped[courseId]) {
      grouped[courseId] = { courseName, courseId, assignments: [] };
    }
    grouped[courseId].assignments.push(ass);
  });

  return (
    <>
      {assignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0D9488]/10">
            <ClipboardListIcon width={32} height={32} className="text-[#0D9488]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">{t("noAssignments")}</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            {t("noAssignmentsDesc")}
          </p>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="mt-6 px-6 py-2.5 bg-[#0D9488] text-white rounded-lg font-semibold hover:bg-[#0b7d72] transition cursor-pointer"
          >
            {t("backToDashboard")}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.values(grouped).map((group) => (
            <div key={group.courseId}>
              {/* Course header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-lg bg-orange-100 p-2">
                  <BookOpenIcon size={16} className="text-orange-600" />
                </div>
                <Link
                  href={`/${locale}/detail-course?id=${group.courseId}`}
                  className="font-semibold text-gray-800 hover:text-[#0D9488] transition"
                >
                  {group.courseName}
                </Link>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {t("assignmentCount", { count: group.assignments.length })}
                </span>
              </div>

              {/* Assignment cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {group.assignments.map((ass) => {
                  const fileUrl = getFullFileUrl(ass.fileUrl);
                  const ext = getFileExtension(ass.fileUrl);

                  return (
                    <div
                      key={ass._id}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-orange-200 transition-all duration-200"
                    >
                      {/* Top row: icon + name */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-orange-50 flex items-center justify-center">
                          <ClipboardListIcon size={18} className="text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                            {ass.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <CalendarIcon size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {new Date(ass.createdAt).toLocaleDateString(
                                locale === "en" ? "en-US" : "id-ID",
                                { day: "numeric", month: "short", year: "numeric" }
                              )}
                            </span>
                            {ext && (
                              <span className="ml-auto text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {ext}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>


                      {/* File indicator */}
                      {ass.fileUrl ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f0fdfb] border border-[#d1fae5] rounded-lg">
                          <FileTextIcon size={13} className="text-[#0D9488] flex-shrink-0" />
                          <span className="text-xs text-[#0D9488] truncate flex-1">{t("fileAvailable")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                          <FileTextIcon size={13} className="text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-400">{t("noFile")}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      {ass.fileUrl && (
                        <div className="flex gap-2">
                           <button
                            onClick={() => handleOpenPreview(fileUrl, ass.name)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#0D9488] text-[#0D9488] text-xs font-semibold hover:bg-[#f0fdfb] transition cursor-pointer"
                          >
                            <EyeIcon size={13} />
                            {t("preview")}
                          </button>
                          <button
                            onClick={async () => {
                              setDownloadingId(ass._id);
                              await handleDownload(fileUrl, ass.name);
                              setDownloadingId(null);
                            }}
                            disabled={downloadingId === ass._id}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0D9488] text-white text-xs font-semibold hover:bg-[#0b7d72] transition cursor-pointer disabled:opacity-60"
                          >
                            {downloadingId === ass._id ? (
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <DownloadIcon size={13} />
                            )}
                            {t("download")}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {previewOpen && (
        <PreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          fileUrl={previewUrl}
          fileName={previewName}
        />
      )}
    </>
  );
}
