"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname } from "@/i18n/routing";

export default function ButtonSwitch() {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const [language, setLanguage] = useState(params.locale);

  const onSelectChange = (nextLocale: string) => {
    const queryString = searchParams.toString();

    const cleanedPath = pathname.replace(/^\/(id|en)/, "") || "/";

    const fullPath = queryString
      ? `/${nextLocale}${cleanedPath}?${queryString}`
      : `/${nextLocale}${cleanedPath}`;

    startTransition(() => {
      location.replace(fullPath);
    });
  };

  return (
    <div
      className="inline-block relative my-1 rounded bg-[#bababa] overflow-hidden"
      data-unify="ContentSwitcher"
      role="tablist"
    >
      <button
        aria-selected={language === "id"}
        role="tab"
        type="button"
        disabled={isPending}
        className={`relative text-xs px-2 font-semibold py-1 rounded cursor-pointer ${
          language === "id" ? "bg-[#0D9488] text-white" : ""
        } transition-colors ease-in-out duration-100`}
        onClick={() => {
          setLanguage("id");
          onSelectChange("id");
        }}
      >
        ID
      </button>

      <button
        aria-selected={language === "en"}
        role="tab"
        type="button"
        disabled={isPending}
        className={`relative text-xs px-2 font-semibold py-1 rounded cursor-pointer ${
          language === "en" ? "bg-[#0D9488] text-white" : ""
        } transition-colors ease-in-out duration-100`}
        onClick={() => {
          setLanguage("en");
          onSelectChange("en");
        }}
      >
        EN
      </button>
    </div>
  );
}
