import FormLogin from "@/app/components/Auth/FormLogin";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-[1208px] shadow-lg rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* LEFT SIDE */}
          <section className="w-full md:w-3/5 relative p-6 md:p-10 bg-[#0D9488] flex flex-col justify-between">
            <div className="px-4">
              <div className="w-full flex items-center rounded-lg">
                <Image
                  src="/logo-landscape-white.png"
                  alt="logo"
                  width={360}
                  height={360}
                />
                <div className="h-px mx-6 w-full border-white border"></div>
              </div>
              <div className="py-2">
                <div className="font-semibold text-lg md:text-3xl text-yellow-400 py-2 capitalize">
                  {t("heroTagline")}
                </div>
                <div className="text-white font-medium text-base md:text-lg">
                  {t("heroDesc")}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Image
                src="/login-picture.png"
                alt="illustration"
                width={500}
                height={500}
                className="mx-auto max-h-[300px] object-contain"
              />
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="w-full md:w-2/5 flex items-center justify-center p-6 md:p-8">
            <FormLogin></FormLogin>
          </section>
        </div>
      </div>
    </div>
  );
}
