"use client";

import AddCourseButton from "@/app/components/Home/RightSide/Courses/AddCourseButton";
import { GraduationCapIcon, BookOpenIcon, MoreVertical, Trash2Icon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "id";
  const semesterId = searchParams.get("id");
  const t = useTranslations("DetailSemester");
  const tCommon = useTranslations("Common");

  const [courses, setCourses] = useState<any[]>([]);
  const [semesterName, setSemesterName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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
        setCourses((prev) => prev.filter((item) => (item._id || item.id) !== confirmDelete.id));
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

  const fetchCourses = async (semId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${semId}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchSemesterDetails = async (semId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/semesters/detail/${semId}`);
      if (res.ok) {
        const data = await res.json();
        setSemesterName(data.name);
      }
    } catch (error) {
      console.error("Error fetching semester details:", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      router.replace(`/${locale}/login`);
      return;
    }

    if (!semesterId) {
      const fetchSemestersAndRedirect = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/semesters/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              router.replace(`/${locale}/detail-semester?id=${data[0]._id}`);
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching semesters:", error);
          setLoading(false);
        }
      };
      fetchSemestersAndRedirect();
    } else {
      setLoading(true);
      Promise.all([
        fetchCourses(semesterId),
        fetchSemesterDetails(semesterId),
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [semesterId, router, locale]);

  if (loading) {
    return (
      <div className="animate-pulse">

        <div className="flex items-start gap-4 md:items-center">
          <div className="rounded-lg bg-gray-200 w-14 h-14 p-3"></div>
          <div>
            <div className="h-7 bg-gray-200 rounded w-48 mb-2"></div>
          </div>
        </div>


        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="w-40 h-10 rounded-lg bg-gray-200"></div>
          </div>

          <div className="mt-4 border-b border-gray-300"></div>

          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative h-[220px] w-full border border-gray-300 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-gray-200 mt-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-40 mt-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!semesterId) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6">
        <div className="rounded-full bg-[#0D9488]/10 p-6">
          <GraduationCapIcon width={48} height={48} className="text-[#0D9488]" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-800">{t("noSemesters")}</h2>
        <p className="mt-2 text-gray-500 max-w-md">
          {t("noSemestersDesc")}
        </p>
        <button
          onClick={() => router.push(`/${locale}`)}
          className="mt-6 px-6 py-2.5 bg-[#0D9488] text-white rounded-lg font-semibold hover:bg-[#0b7d72] transition cursor-pointer"
        >
          {t("backToDashboard")}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start gap-4 md:items-center">
        <div className="rounded-lg bg-[#0D9488]/10 p-3">
          <GraduationCapIcon
            width={32}
            height={32}
            className="text-[#0D9488]"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
            {semesterName || t("semesterFallback")}
          </h1>
        </div>
      </div>

      <section className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{t("courses")}</h2>
            <p className="text-sm text-gray-500">
              {t("manageCoursesDesc")}
            </p>
          </div>

          <AddCourseButton semesterId={semesterId} onSuccess={() => fetchCourses(semesterId)} />
        </div>

        <div className="mt-4 border-b border-gray-300"></div>

        <div className="mt-6">
          {courses.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0D9488]/10">
                <BookOpenIcon
                  width={32}
                  height={32}
                  className="text-[#0D9488]"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {t("noCourses")}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {t("noCoursesDescDetail")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {courses.map((course: any) => (
                <div key={course._id || course.id} className="relative h-[220px] w-full">
                  <div className="absolute top-2 right-2 z-20" data-menu-id={course._id || course.id}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setOpenMenuId(openMenuId === (course._id || course.id) ? null : (course._id || course.id));
                      }}
                      className="p-1.5 rounded-lg hover:bg-[#b2deda] transition-colors duration-150 cursor-pointer"
                    >
                      <MoreVertical size={17} className="text-[#0D9488]" />
                    </button>
                    {openMenuId === (course._id || course.id) && (
                      <div className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden z-30">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpenMenuId(null);
                            setConfirmDelete({ id: course._id || course.id, name: course.name });
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
                    href={`/${locale}/detail-course?id=${course._id || course.id}`}
                    className="h-full w-full border border-[#0D9488] bg-[#dcf1ef] rounded-lg text-center flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#0D9488] flex items-center justify-center mt-4">
                      <BookOpenIcon className="w-8 h-8 text-white" />
                    </div>

                    <div className="font-bold text-lg text-gray-700 px-4 line-clamp-2">
                      {course.name}
                    </div>

                    <div className="text-sm text-gray-600">{tCommon("detail")}</div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


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
