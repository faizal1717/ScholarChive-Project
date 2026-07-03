"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  SearchIcon,
  Loader2Icon,
  GraduationCapIcon,
  BookOpenIcon,
  LayersIcon,
  ClipboardListIcon,
  XIcon,
} from "lucide-react";

interface SearchResults {
  semesters: Array<{ _id: string; name: string }>;
  courses: Array<{ _id: string; name: string }>;
  modules: Array<{
    _id: string;
    name: string;
    courseId?: { _id: string; name: string } | string;
  }>;
  assignments: Array<{
    _id: string;
    name: string;
    courseId?: { _id: string; name: string } | string;
  }>;
}

export default function Search() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "id";
  const t = useTranslations("Search");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.id) setUserId(parsed.id);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  useEffect(() => {
    // Click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (val: string) => {
    if (!val.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    if (!userId) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(val)}&userId=${userId}`,
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      handleSearch(val);
    }, 300);
  };

  const handleClear = () => {
    setQuery("");
    setResults(null);
    setLoading(false);
  };

  const handleItemClick = (url: string) => {
    setFocused(false);
    router.push(url);
  };

  const hasResults =
    results &&
    (results.semesters.length > 0 ||
      results.courses.length > 0 ||
      results.modules.length > 0 ||
      results.assignments.length > 0);

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto z-55">
      <div className="relative flex items-center w-full">
        <SearchIcon
          size={18}
          className={`absolute left-3.5 transition-colors duration-200 ${
            focused ? "text-[#0D9488]" : "text-gray-400"
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          placeholder={t("placeholder")}
          className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 outline-none "
        />
        {loading ? (
          <Loader2Icon
            size={18}
            className="absolute right-3.5 text-[#0D9488] animate-spin"
          />
        ) : query ? (
          <button
            onClick={handleClear}
            className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition cursor-pointer"
          >
            <XIcon size={14} />
          </button>
        ) : null}
      </div>

      {/* Results Dropdown Overlay */}
      {focused && (query.trim() || !userId) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {!userId ? (
            <div className="p-4 text-center text-sm text-gray-500 font-medium">
              {t("loginRequired")}
            </div>
          ) : loading ? (
            <div className="p-6 flex flex-col items-center justify-center text-gray-500 gap-2">
              <Loader2Icon size={24} className="text-[#0D9488] animate-spin" />
              <span className="text-xs font-semibold">{t("searching")}</span>
            </div>
          ) : results && !hasResults ? (
            <div className="p-6 text-center text-sm text-gray-500 font-medium">
              {t("noResults", { query })}
            </div>
          ) : results ? (
            <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 py-1 scrollbar-thin">
              {results.semesters.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                    <GraduationCapIcon size={12} className="text-purple-500" />
                    {t("semesters")}
                  </div>
                  <div className="space-y-0.5">
                    {results.semesters.map((sem) => (
                      <button
                        key={sem._id}
                        onClick={() =>
                          handleItemClick(
                            `/${locale}/detail-semester?id=${sem._id}`,
                          )
                        }
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        {sem.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {results.courses.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                    <BookOpenIcon size={12} className="text-teal-500" />
                    {t("courses")}
                  </div>
                  <div className="space-y-0.5">
                    {results.courses.map((course) => (
                      <button
                        key={course._id}
                        onClick={() =>
                          handleItemClick(
                            `/${locale}/detail-course?id=${course._id}`,
                          )
                        }
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                        {course.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {results.modules.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                    <LayersIcon size={12} className="text-blue-500" />
                    {t("modules")}
                  </div>
                  <div className="space-y-0.5">
                    {results.modules.map((mod) => {
                      const courseName =
                        typeof mod.courseId === "object"
                          ? mod.courseId.name
                          : "";
                      return (
                        <button
                          key={mod._id}
                          onClick={() =>
                            handleItemClick(
                              `/${locale}/detail-course?id=${
                                typeof mod.courseId === "object"
                                  ? mod.courseId._id || ""
                                  : mod.courseId
                              }&tab=module`,
                            )
                          }
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span className="text-sm text-gray-700 font-medium truncate">
                              {mod.name}
                            </span>
                          </div>
                          {courseName && (
                            <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                              {courseName}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {results.assignments.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                    <ClipboardListIcon size={12} className="text-orange-500" />
                    {t("assignments")}
                  </div>
                  <div className="space-y-0.5">
                    {results.assignments.map((ass) => {
                      const courseName =
                        typeof ass.courseId === "object"
                          ? ass.courseId.name
                          : "";
                      return (
                        <button
                          key={ass._id}
                          onClick={() =>
                            handleItemClick(
                              `/${locale}/detail-course?id=${
                                typeof ass.courseId === "object"
                                  ? ass.courseId._id || ""
                                  : ass.courseId
                              }&tab=assignment`,
                            )
                          }
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span className="text-sm text-gray-700 font-medium truncate">
                              {ass.name}
                            </span>
                          </div>
                          {courseName && (
                            <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                              {courseName}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
