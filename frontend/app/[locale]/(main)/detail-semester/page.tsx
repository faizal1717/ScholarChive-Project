import DetailSemesterClient from "@/app/components/DetailSemester/DetailSemesterClient";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1208px] px-4 py-6 md:px-6">
      <DetailSemesterClient />
    </div>
  );
}
