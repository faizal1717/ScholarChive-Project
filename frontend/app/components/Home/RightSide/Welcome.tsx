"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export default function Welcome() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState<any>(null);
  const t = useTranslations("Welcome");
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);

    const storedUSer = localStorage.getItem("user");

    if (storedUSer) {
      setUser(JSON.parse(storedUSer));
    }

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const dateLocale = locale === "en" ? "en-US" : "id-ID";

  return (
    <div className="text-gray-500 w-full lg:text-sm text-xs">
      <div className="font-semibold text-gray-700 lg:text-xl text-sm wrap-break-word">
        {t("title")} {user?.name || "Guest"}
      </div>
      {time.toLocaleDateString(dateLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}{" "}
      {time.toLocaleTimeString(dateLocale)}
    </div>
  );
}
