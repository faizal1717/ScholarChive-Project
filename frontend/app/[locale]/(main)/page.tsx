import HomeButton from "../../components/Home/LeftSide/HomeButton";
import Image from "next/image";
import ProfileButton from "@/app/components/Home/LeftSide/ProfileButton";
import Courses from "@/app/components/Home/LeftSide/Courses";
import Modules from "@/app/components/Home/LeftSide/Modules";
import Assignments from "@/app/components/Home/LeftSide/Assignments";
import Setting from "@/app/components/Home/LeftSide/Setting";
import { GraduationCapIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Welcome from "../../components/Home/RightSide/Welcome";
import SemesterSection from "@/app/components/Home/RightSide/Semesters/SemesterSection";
import DashboardSummary from "@/app/components/Home/RightSide/DashboardSummary";

export default async function Page() {
  const locale = await getLocale();
  const tLeft = await getTranslations("LeftSide");
  const tDash = await getTranslations("Dashboard");

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1208px] p-3">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Leftside */}
        <section className="w-full md:w-1/4 border text-gray-700 border-gray-300 rounded-lg p-4">
          <div className="w-full border-gray-300 flex border-b p-[0px_12px_8px_12px] items-center gap-2">
            <div>
              <Image
                src={"/logo-scholarchive.png"}
                alt="#"
                width={55}
                height={55}
              ></Image>
            </div>

            <div className="font-semibold text-lg">
              ScholarChive
              <div className="text-xs font-normal text-gray-700">
                {tLeft("tagline")}
              </div>
            </div>
          </div>
          <HomeButton />
          <div className="cursor-pointer">
            <ProfileButton></ProfileButton>
          </div>
          <Link href={`/${locale}/detail-semester`}>
            <div className="flex gap-2 cursor-pointer p-3 mt-1 hover:bg-[#dcf1ef] rounded-lg">
              <GraduationCapIcon width={20} height={20}></GraduationCapIcon>
              <span className="font-semibold text-sm">{tLeft("semesters")}</span>
            </div>
          </Link>
          <Courses />
          <Modules />
          <Assignments />
          <div className="cursor-pointer">
            <Setting></Setting>
          </div>
        </section>

        {/* RightSide */}
        <section className="w-full md:w-3/4 p-4 rounded-lg border text-gray-700 border-gray-300">
          <div className="w-full flex p-4 rounded-lg bg-[#dcf1ef]">
            <div className="min-w-0">
              <div className="text-sm whitespace-nowrap">
                <Welcome />
              </div>
            </div>
            <div className="w-full lg:block hidden">
              <div className="w-full flex justify-end">
                <Image
                  src={"/header_photo.png"}
                  alt="#"
                  width={280}
                  height={280}
                  className="rounded-lg"
                ></Image>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center">
            <div className="my-4 font-semibold pr-4">{tDash("summary")}</div>
            <div className="h-px w-full border border-gray-300"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardSummary />
          </div>
          <div className="w-full flex items-center">
            <div className="my-4 font-semibold pr-4">{tDash("semesters")}</div>
            <div className="h-px w-full border border-gray-300"></div>
          </div>
          <SemesterSection></SemesterSection>
        </section>
      </div>
    </div>
  );
}
