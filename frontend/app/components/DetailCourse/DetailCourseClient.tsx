"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  LayersIcon,
  ClipboardListIcon,
  PlusIcon,
  MoreVertical,
  Trash2Icon,
  XIcon,
  FileTextIcon,
  EyeIcon,
  DownloadIcon,
  CalendarIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import FormModule from "@/app/components/Home/RightSide/Modules/FormModule";
import FormAssignment from "@/app/components/Home/RightSide/Assignment/FormAssignment";
import PreviewModal from "@/app/components/PreviewModal/PreviewModal";
import { useTranslations } from "next-intl";

interface Module {
  _id: string;
  name: string;
  fileUrl?: string;
  createdAt: string;
}

interface Assignment {
  _id: string;
  name: string;
  fileUrl?: string;
  createdAt: string;
}

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

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "id";
  const courseId = searchParams.get("id");

  const [courseName, setCourseName] = useState<string>("");
  const [semesterId, setSemesterId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"module" | "assignment">("module");
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    if (tabParam === "assignment" || tabParam === "module") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const t = useTranslations("DetailCourse");
  const tCommon = useTranslations("Common");
  const [modules, setModules] = useState<Module[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleOpenPreview = (url: string, name: string) => {
    setPreviewUrl(url);
    setPreviewName(name);
    setPreviewOpen(true);
  };

  const [openAddModule, setOpenAddModule] = useState<boolean>(false);
  const [openAddAssignment, setOpenAddAssignment] = useState<boolean>(false);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; type: "module" | "assignment"; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getFullFileUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-menu-id]")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const endpoint = confirmDelete.type === "module" ? "modules" : "assignments";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}/${confirmDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`${confirmDelete.type === "module" ? t("tabModule") : t("tabAssignment")} ${t("deleteSuccess")}`);
        if (confirmDelete.type === "module") {
          setModules((prev) => prev.filter((item) => (item._id) !== confirmDelete.id));
        } else {
          setAssignments((prev) => prev.filter((item) => (item._id) !== confirmDelete.id));
        }
      } else {
        toast.error(`${t("deleteFailed")} ${confirmDelete.type === "module" ? t("tabModule").toLowerCase() : t("tabAssignment").toLowerCase()}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(tCommon("serverError"));
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const fetchCourseDetails = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/detail/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCourseName(data.name);
        setSemesterId(data.semesterId);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const fetchModules = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/modules/${id}`);
      if (res.ok) {
        const data = await res.json();
        setModules(data);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const fetchAssignments = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      router.replace(`/${locale}/login`);
      return;
    }

    if (!courseId) {
      router.replace(`/${locale}`);
      return;
    }

    setLoading(true);
    Promise.all([
      fetchCourseDetails(courseId),
      fetchModules(courseId),
      fetchAssignments(courseId),
    ]).finally(() => {
      setLoading(false);
    });
  }, [courseId, router, locale]);

  if (loading) {
    return (
      <div className="animate-pulse mt-4">
        <div className="flex items-center gap-4">
          <div className="p-2 border rounded-lg w-10 h-10 bg-gray-200"></div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>

        <div className="mt-8 flex border-b border-gray-300">
          <div className="px-6 py-3 w-32 h-12 border-b-2 border-gray-300">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="px-6 py-3 w-32 h-12">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        <section className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="w-32 h-10 rounded-lg bg-gray-200"></div>
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
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/detail-semester?id=${semesterId}`}
          className="p-2 border rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon size={20} className="text-gray-700" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
            {courseName || t("defaultTitle")}
          </h1>
          <p className="text-sm text-gray-500">{t("subtitle")}</p>
        </div>
      </div>

      <div className="mt-8 flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab("module")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "module"
              ? "border-[#0D9488] text-[#0D9488]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <LayersIcon size={18} />
          {t("tabModule")}
        </button>
        <button
          onClick={() => setActiveTab("assignment")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "assignment"
              ? "border-[#0D9488] text-[#0D9488]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <ClipboardListIcon size={18} />
          {t("tabAssignment")}
        </button>
      </div>

      <section className="mt-6">
        {activeTab === "module" ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{t("moduleListTitle")}</h2>
                <p className="text-sm text-gray-500">{t("moduleListDesc")}</p>
              </div>
              <button
                onClick={() => setOpenAddModule(true)}
                className="flex gap-2 items-center border border-[#0D9488] text-[#0D9488] px-4 py-2.5 rounded-lg hover:bg-[#0D9488]/5 transition font-medium text-sm cursor-pointer"
              >
                <PlusIcon size={16} />
                {t("addModule")}
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0D9488]/10">
                  <LayersIcon width={32} height={32} className="text-[#0D9488]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{t("noModules")}</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  {t("noModulesDesc")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {modules.map((mod) => {
                  const fileUrl = getFullFileUrl(mod.fileUrl);
                  const ext = getFileExtension(mod.fileUrl);
                  return (
                    <div
                      key={mod._id}
                      className="relative bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-[#0D9488]/30 transition-all duration-200"
                    >
                      {/* Dropdown Menu button inside relative card container */}
                      <div className="absolute top-3 right-3 z-20" data-menu-id={mod._id}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === mod._id ? null : mod._id);
                          }}
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                        >
                          <MoreVertical size={16} className="text-gray-400 hover:text-gray-600" />
                        </button>
                        {openMenuId === mod._id && (
                          <div className="absolute right-0 top-7 w-32 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden z-30">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                setConfirmDelete({ id: mod._id, type: "module", name: mod.name });
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer font-semibold"
                            >
                              <Trash2Icon size={14} />
                              {tCommon("delete")}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Top row: icon + name */}
                      <div className="flex items-start gap-3 pr-6">
                        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
                          <LayersIcon size={18} className="text-[#0D9488]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                            {mod.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <CalendarIcon size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {new Date(mod.createdAt).toLocaleDateString(
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
                      {mod.fileUrl ? (
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
                      {mod.fileUrl && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenPreview(fileUrl, mod.name)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#0D9488] text-[#0D9488] text-xs font-semibold hover:bg-[#f0fdfb] transition cursor-pointer"
                          >
                            <EyeIcon size={13} />
                            {t("preview")}
                          </button>
                          <button
                            onClick={async () => {
                              setDownloadingId(mod._id);
                              await handleDownload(fileUrl, mod.name);
                              setDownloadingId(null);
                            }}
                            disabled={downloadingId === mod._id}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0D9488] text-white text-xs font-semibold hover:bg-[#0b7d72] transition cursor-pointer disabled:opacity-60"
                          >
                            {downloadingId === mod._id ? (
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
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{t("assignmentListTitle")}</h2>
                <p className="text-sm text-gray-500">{t("assignmentListDesc")}</p>
              </div>
              <button
                onClick={() => setOpenAddAssignment(true)}
                className="flex gap-2 items-center border border-[#0D9488] text-[#0D9488] px-4 py-2.5 rounded-lg hover:bg-[#0D9488]/5 transition font-medium text-sm cursor-pointer"
              >
                <PlusIcon size={16} />
                {t("addAssignment")}
              </button>
            </div>

            {assignments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0D9488]/10">
                  <ClipboardListIcon width={32} height={32} className="text-[#0D9488]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{t("noAssignments")}</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  {t("noAssignmentsDesc")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {assignments.map((ass) => {
                  const fileUrl = getFullFileUrl(ass.fileUrl);
                  const ext = getFileExtension(ass.fileUrl);
                  return (
                    <div
                      key={ass._id}
                      className="relative bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-orange-200 transition-all duration-200"
                    >
                      {/* Dropdown Menu button inside relative card container */}
                      <div className="absolute top-3 right-3 z-20" data-menu-id={ass._id}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === ass._id ? null : ass._id);
                          }}
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                        >
                          <MoreVertical size={16} className="text-gray-400 hover:text-gray-600" />
                        </button>
                        {openMenuId === ass._id && (
                          <div className="absolute right-0 top-7 w-32 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden z-30">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                setConfirmDelete({ id: ass._id, type: "assignment", name: ass.name });
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer font-semibold"
                            >
                              <Trash2Icon size={14} />
                              {tCommon("delete")}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Top row: icon + name */}
                      <div className="flex items-start gap-3 pr-6">
                        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-orange-55 bg-orange-50 flex items-center justify-center">
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
            )}
          </div>
        )}
      </section>

      {courseId && (
        <FormModule
          open={openAddModule}
          onClose={() => setOpenAddModule(false)}
          courseId={courseId}
          onSuccess={() => fetchModules(courseId)}
        />
      )}

      {courseId && (
        <FormAssignment
          open={openAddAssignment}
          onClose={() => setOpenAddAssignment(false)}
          courseId={courseId}
          onSuccess={() => fetchAssignments(courseId)}
        />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex justify-center tems-center gap-3">
                <div>
                  <h3 className="font-bold text-gray-800 w-full flex justify-center text-base">{confirmDelete.type === "module" ? t("deleteModule") : t("deleteAssignment")}</h3>
                </div>
              </div>
              <button
                onClick={() => setConfirmDelete(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <XIcon size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-5">
              <p className="text-sm text-gray-600">
                {confirmDelete.type === "module" ? t("deleteModuleConfirm") : t("deleteAssignmentConfirm")}{" "}
                <span className="font-semibold text-gray-800">"{confirmDelete.name}"</span>?
                {" "}{t("deleteIrreversible")}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {tCommon("cancel")}
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {tCommon("deleting")}
                  </>
                ) : (
                  <>
                    <Trash2Icon size={15} />
                    {tCommon("delete")}
                  </>
                )}
              </button>
            </div>
          </div>
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
