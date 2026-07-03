"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { GraduationCapIcon, MoreVertical, Trash2Icon, AlertTriangleIcon, XIcon } from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface Props {
  reload: boolean;
}

export default function SliderSemesters({ reload }: Props) {
  const params = useParams();
  const locale = params?.locale || "id";
  const [semesters, setSemesters] = useState<any[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState<string>("");
  const [deleting, setDeleting] = useState(false);
  const t = useTranslations("SliderSemesters");
  const tCommon = useTranslations("Common");


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      fetchSemesters(user.id);
    }
  }, [reload]);

  // Close dropdown when clicking outside any menu container
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

  const fetchSemesters = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/semesters/${userId}`);
      const data = await res.json();
      setSemesters(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/semesters/${confirmId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(t("deleteSuccess"));
        setSemesters((prev) => prev.filter((semester) => semester._id !== confirmId));
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(t("deleteFailed"));
      }
    } catch (error) {
      console.log(error);
      toast.error(tCommon("serverError"));
    } finally {
      setDeleting(false);
      setConfirmId(null);
      setConfirmName("");
    }
  };

  if (semesters.length === 0) {
    return (
      <div className="w-full h-[220px] border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center">
        <h3 className="font-semibold lg:text-xl md:text-lg text-sm text-gray-700">
          {t("noSemesters")}
        </h3>
        <p className="md:text-sm text-xs text-gray-500 mt-1">
          {t("noSemestersDesc")}
        </p>
      </div>
    );
  }

  return (
    <>
      <Swiper
        className="select-none w-full"
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
        }}
      >
        {semesters.map((sem) => (
          <SwiperSlide key={sem._id}>
            <div className="relative h-[220px] w-full border border-[#0D9488] bg-[#dcf1ef] rounded-lg text-center flex flex-col items-center justify-center gap-2">
              <div className="absolute top-2 right-2 z-20" data-menu-id={sem._id}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === sem._id ? null : sem._id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#b2deda] transition-colors duration-150 cursor-pointer"
                >
                  <MoreVertical size={17} className="text-[#0D9488]" />
                </button>
                {openMenuId === sem._id && (
                  <div className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden animate-fadeIn z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        setConfirmId(sem._id);
                        setConfirmName(sem.name);
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
                href={`/${locale}/detail-semester?id=${sem._id}`}
                className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-[#0D9488] flex items-center justify-center">
                  <GraduationCapIcon className="w-8 h-8 text-white" />
                </div>
                <div className="font-bold text-lg text-gray-700">{sem.name}</div>
                <div className="text-sm text-gray-600">{t("courseCount", { count: sem.courseCount ?? 0 })}</div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {confirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={() => { setConfirmId(null); setConfirmName(""); }}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex justify-center tems-center gap-3">
                <div>
                  <h3 className="font-bold text-gray-800 w-full flex justify-center text-base">{t("deleteSemesterTitle")}</h3>
                </div>
              </div>
              <button
                onClick={() => { setConfirmId(null); setConfirmName(""); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <XIcon size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-5">
              <p className="text-sm text-gray-600">
                {t("deleteSemesterConfirm1")}
                <span className="font-semibold text-gray-800">"{confirmName}"</span>
                {t("deleteSemesterConfirm2")}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmId(null); setConfirmName(""); }}
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

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn  { animation: fadeIn  0.15s ease-out both; }
        .animate-scaleIn { animation: scaleIn 0.18s ease-out both; }
      `}</style>
    </>
  );
}
