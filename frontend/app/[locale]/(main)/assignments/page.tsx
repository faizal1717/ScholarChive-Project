import AssignmentsClient from "@/app/components/Assignments/AssignmentsClient";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1208px] px-4 py-6 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}`}
          className="p-2 border rounded-xl hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon size={20} className="text-gray-700" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
            Semua Tugas
          </h1>
          <p className="text-sm text-gray-500">
            Daftar lengkap tugas dari semua mata kuliah
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="mt-8">
        <AssignmentsClient />
      </section>
    </div>
  );
}
