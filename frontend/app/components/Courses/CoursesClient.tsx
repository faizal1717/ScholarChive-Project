"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { BookOpenIcon, GraduationCapIcon, ArrowLeftIcon, MoreVertical, Trash2Icon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface Course {
  _id: string;
  name: string;
  semesterId: { _id: string; name: string } | string;
  createdAt: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("Courses");
  const tCommon = useTranslations("Common");

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      router.replace(`/${locale}/login`);
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/user/${user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router, locale]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${confirmDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(t("deleteSuccess"));
        setCourses((prev) => prev.filter((item) => (item._id || (item as any).id) !== confirmDelete.id));
      } else {
        toast.error(t("deleteFailed"));
      }
    } catch (error) {
      console.log(error);
      toast.error(tCommon("serverError"));
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[1, 2].map((group) => (
          <div key={group}>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-gray-200 p-2 w-9 h-9"></div>
              <div className="h-5 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded-full w-24"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative h-[180px] w-full border border-gray-200 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-gray-200 mt-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mt-2"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Group courses by semester
  const grouped: Record<string, { semesterName: string; semesterId: string; courses: Course[] }> = {};
  courses.forEach((course) => {
    const sem = course.semesterId as { _id: string; name: string };
    const semId = sem?._id || "unknown";
    const semName = sem?.name || t("unknownSemester");
    if (!grouped[semId]) {
      grouped[semId] = { semesterName: semName, semesterId: semId, courses: [] };
    }
    grouped[semId].courses.push(course);
  });

  return (
    <>
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0D9488]/10">
              <BookOpenIcon width={32} height={32} className="text-[#0D9488]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {t("noCourses")}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm">
              {t("noCoursesDesc")}
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
              <div key={group.semesterId}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <GraduationCapIcon size={18} className="text-purple-600" />
                  </div>
                  <Link
                    href={`/${locale}/detail-semester?id=${group.semesterId}`}
                    className="font-semibold text-gray-800 hover:text-[#0D9488] transition"
                  >
                    {group.semesterName}
                  </Link>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {t("courseCount", { count: group.courses.length })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {group.courses.map((course) => (
                    <div key={course._id} className="relative h-[180px] w-full">
                      <div className="absolute top-2 right-2 z-20" data-menu-id={course._id}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpenMenuId(openMenuId === course._id ? null : course._id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#b2deda] transition-colors duration-150 cursor-pointer"
                        >
                          <MoreVertical size={17} className="text-[#0D9488]" />
                        </button>
                        {openMenuId === course._id && (
                          <div className="absolute right-0 top-8 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-30">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setOpenMenuId(null);
                                setConfirmDelete({ id: course._id, name: course.name });
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                            >
                              <Trash2Icon size={15} />
                              {tCommon("delete")}
                            </button>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/${locale}/detail-course?id=${course._id}`}
                        className="h-full w-full border border-[#0D9488] bg-[#dcf1ef] rounded-lg text-center flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-[#0D9488] flex items-center justify-center mt-4">
                          <BookOpenIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="font-bold text-base text-gray-700 px-4 line-clamp-2">
                          {course.name}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
                  <h3 className="font-bold text-gray-800 w-full flex justify-center text-base">{t("deleteCourseTitle")}</h3>
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
                {t("deleteCourseConfirm1")}
                <span className="font-semibold text-gray-800">"{confirmDelete.name}"</span>
                {t("deleteCourseConfirm2")}
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
    </>
  );
}
