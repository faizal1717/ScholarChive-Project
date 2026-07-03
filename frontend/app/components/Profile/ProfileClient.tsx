"use client";

import { useEffect, useState } from "react";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  SettingsIcon,
  GraduationCapIcon,
  BookOpenIcon,
  LayersIcon,
  ClipboardListIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

interface SummaryData {
  semesters: number;
  courses: number;
  modules: number;
  assignments: number;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale || "id";
  const t = useTranslations("Profile");
  const dateLocale = useLocale() === "en" ? "en-US" : "id-ID";

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SummaryData>({
    semesters: 0,
    courses: 0,
    modules: 0,
    assignments: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push(`/${locale}/login`);
      return;
    }

    const parsedUser = JSON.parse(stored);
    if (!parsedUser.id) {
      router.push(`/${locale}/login`);
      return;
    }
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/auth/${parsedUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setUser(parsedUser);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const [semRes, courseRes, moduleRes, assignRes] = await Promise.all([
          fetch(`http://localhost:3001/api/semesters/${parsedUser.id}`),
          fetch(`http://localhost:3001/api/courses/user/${parsedUser.id}`),
          fetch(`http://localhost:3001/api/modules/user/${parsedUser.id}`),
          fetch(`http://localhost:3001/api/assignments/user/${parsedUser.id}`),
        ]);

        const [sems, courses, modules, assignments] = await Promise.all([
          semRes.ok ? semRes.json() : [],
          courseRes.ok ? courseRes.json() : [],
          moduleRes.ok ? moduleRes.json() : [],
          assignRes.ok ? assignRes.json() : [],
        ]);

        setStats({
          semesters: Array.isArray(sems) ? sems.length : 0,
          courses: Array.isArray(courses) ? courses.length : 0,
          modules: Array.isArray(modules) ? modules.length : 0,
          assignments: Array.isArray(assignments) ? assignments.length : 0,
        });
      } catch (error) {
        console.error("Error fetching profile stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserDetails();
    fetchStats();
  }, [locale, router]);

  if (loading) {
    return (
      <>
        <div className="bg-white rounded-lg border border-gray-300 p-6 md:p-8 mb-4 flex flex-col md:flex-row gap-6 items-center animate-pulse">
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          <div className="flex-1 text-center md:text-left space-y-3 w-full flex flex-col items-center md:items-start">
            <div className="h-7 bg-gray-200 rounded-md w-48"></div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 w-full">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-32 hidden md:block"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-40 mt-3"></div>
          </div>
        </div>

        <div className="mb-4 border p-5 border-gray-300 rounded-lg animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-56 mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg border border-gray-300 p-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-7 bg-gray-200 rounded w-12 mt-1"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-300 p-5 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="divide-y divide-gray-100">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 px-2">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-9 h-9 rounded-lg bg-gray-200 flex-shrink-0"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-3 bg-gray-200 rounded w-64 max-w-[80%]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const statCards = [
    { label: t("semesters"), value: stats.semesters, Icon: GraduationCapIcon, bg: "bg-[#f3e8ff]", iconBg: "bg-purple-200", iconColor: "text-purple-700" },
    { label: t("courses"), value: stats.courses, Icon: BookOpenIcon, bg: "bg-[#fee2e2]", iconBg: "bg-red-200", iconColor: "text-red-700" },
    { label: t("modules"), value: stats.modules, Icon: LayersIcon, bg: "bg-[#dbeafe]", iconBg: "bg-blue-200", iconColor: "text-blue-700" },
    { label: t("assignments"), value: stats.assignments, Icon: ClipboardListIcon, bg: "bg-[#ffedd5]", iconBg: "bg-orange-200", iconColor: "text-orange-700" },
  ];

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-300 p-6 md:p-8 mb-4 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14b8a6] flex items-center justify-center shadow-md relative overflow-hidden transition-all duration-300 group-hover:shadow-[#0d9488]/20 group-hover:scale-105">
            <span className="text-white text-4xl font-bold tracking-wider">
              {initial}
            </span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{user?.name || "—"}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1.5 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1.5">
              <MailIcon size={15} className="text-[#0D9488]" />
              {user?.email || "—"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 my-auto hidden md:block" />
            <span className="flex items-center gap-1.5">
              <PhoneIcon size={15} className="text-[#0D9488]" />
              {user?.phone || "—"}
            </span>
          </div>
          {user?.createdAt && (
            <p className="text-xs text-gray-400 mt-3 flex items-center justify-center md:justify-start gap-1">
              <CalendarIcon size={13} />
              {t("joined")}: {new Date(user.createdAt).toLocaleDateString(dateLocale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4 border p-5 border-gray-300 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-4">{t("learningSummary")}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className={`${card.bg} rounded-lg shadow-sm ${card.bg} p-8 flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
              <div className={`w-1/2 flex justify-center p-2 items-center ${card.iconBg} rounded-lg ${card.iconColor} mb-3`}>
                <card.Icon size={32} />
              </div>
              <span className="text-gray-500 font-semibold text-sm">{card.label}</span>
              <span className="text-2xl font-bold text-gray-700 mt-1">
                {loadingStats ? (
                  <span className="inline-block w-6 h-6 bg-gray-200 animate-pulse rounded" />
                ) : (
                  card.value
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-300 p-5">
        <h3 className="font-semibold text-gray-700 mb-4 px-1">{t("quickNav")}</h3>
        <div className="divide-y divide-gray-100">
          <Link
            href={`/${locale}/settings`}
            className="flex items-center justify-between py-3.5 px-2 hover:bg-gray-50/70 rounded-lg transition duration-150 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-[#0D9488]">
                <UserIcon size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">{t("editProfileInfo")}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{t("editProfileDesc")}</p>
              </div>
            </div>
            <ArrowRightIcon size={16} className="text-gray-400 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition duration-150" />
          </Link>

          <Link
            href={`/${locale}/settings?tab=keamanan`}
            className="flex items-center justify-between py-3.5 px-2 hover:bg-gray-50/70 rounded-lg transition duration-150 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-[#0D9488]">
                <SettingsIcon size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">{t("securityPassword")}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{t("securityPasswordDesc")}</p>
              </div>
            </div>
            <ArrowRightIcon size={16} className="text-gray-400 group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition duration-150" />
          </Link>
        </div>
      </div>
    </>
  );
}
