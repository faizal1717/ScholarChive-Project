"use client";

import { useState, useEffect } from "react";
import {
  GraduationCapIcon,
  BookOpenIcon,
  LayersIcon,
  ClipboardListIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface SummaryData {
  semesters: number;
  courses: number;
  modules: number;
  assignments: number;
}

export default function DashboardSummary() {
  const t = useTranslations("DashboardSummary");
  const [summary, setSummary] = useState<SummaryData>({
    semesters: 0,
    courses: 0,
    modules: 0,
    assignments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        const [semRes, courseRes, moduleRes, assignRes] = await Promise.all([
          fetch(`http://localhost:3001/api/semesters/${user.id}`),
          fetch(`http://localhost:3001/api/courses/user/${user.id}`),
          fetch(`http://localhost:3001/api/modules/user/${user.id}`),
          fetch(`http://localhost:3001/api/assignments/user/${user.id}`),
        ]);

        const [sems, courses, modules, assignments] = await Promise.all([
          semRes.ok ? semRes.json() : [],
          courseRes.ok ? courseRes.json() : [],
          moduleRes.ok ? moduleRes.json() : [],
          assignRes.ok ? assignRes.json() : [],
        ]);

        setSummary({
          semesters: Array.isArray(sems) ? sems.length : 0,
          courses: Array.isArray(courses) ? courses.length : 0,
          modules: Array.isArray(modules) ? modules.length : 0,
          assignments: Array.isArray(assignments) ? assignments.length : 0,
        });
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const cards = [
    {
      label: t("totalSemesters"),
      value: summary.semesters,
      icon: <GraduationCapIcon width={36} height={36} className="text-purple-700" />,
      iconBg: "bg-purple-200",
      cardBg: "bg-purple-100",
    },
    {
      label: t("totalCourses"),
      value: summary.courses,
      icon: <BookOpenIcon width={36} height={36} className="text-red-700" />,
      iconBg: "bg-red-200",
      cardBg: "bg-red-100",
    },
    {
      label: t("totalModules"),
      value: summary.modules,
      icon: <LayersIcon width={36} height={36} className="text-blue-700" />,
      iconBg: "bg-blue-200",
      cardBg: "bg-blue-100",
    },
    {
      label: t("totalAssignments"),
      value: summary.assignments,
      icon: <ClipboardListIcon width={36} height={36} className="text-orange-700" />,
      iconBg: "bg-orange-200",
      cardBg: "bg-orange-100",
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.label}
          className={`p-4 ${card.cardBg} rounded-lg text-center shadow-md`}
        >
          <div className="w-full p-2 text-gray-700">
            <div className="w-full flex flex-col items-center justify-center">
              <div className={`p-2 w-1/2 ${card.iconBg} rounded-lg flex justify-center`}>
                {card.icon}
              </div>
              <div className="font-semibold py-2 text-center md:text-base text-sm text-gray-500">
                {card.label}
              </div>
            </div>
            <div className="font-semibold text-gray-700 md:text-xl text-lg lg:text-3xl">
              {loading ? (
                <span className="inline-block w-8 h-7 bg-gray-200 animate-pulse rounded" />
              ) : (
                <span>{card.value}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
