import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("ContactUs");

  return (
    <main className="py-20 flex">
      <section className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
        <div className="flex items-center justify-center">
          <div className="bg-linear-to-r from-[#0D9488] to-gray-200 rounded-lg shadow-xl p-8 w-full">
            <div className="flex items-center justify-center h-80">
              <Image
                width={1024}
                height={1024}
                src="/contact-us.png"
                alt="contact-us"
                className="max-h-full object-contain"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl w-full text-gray-700 justify-center flex font-bold leading-tight">
            {t("helpDesk")}
          </h1>
          <h2 className="font-medium w-full text-lg flex text-gray-700 justify-center">
            {t("subtitle")}
          </h2>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-3 pt-4 gap-3">
            <div className="border border-gray-300 rounded-xl p-10 hover:border-[#0D9488] text-center hover:shadow-lg transition">
              <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center mb-6">
                <MailIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t("email")}</h3>
              <p className="mt-3 w-full text-sm flex justify-center text-gray-600">
                faizalardi.81@gmail.com
              </p>
            </div>

            <div className="border border-gray-300 rounded-xl p-10 hover:border-[#0D9488] text-center hover:shadow-lg transition">
              <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center mb-6">
                <PhoneIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t("phone")}</h3>
              <p className="mt-3 text-gray-600 text-sm">085799825616</p>
            </div>

            {/* <div className="border border-gray-300 rounded-xl hover:border-[#0D9488] p-10 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center mb-6">
                <MessageCircleIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t("whatsapp")}</h3>
              <p className="mt-3 text-gray-600 text-sm">{t("whatsappChat")}</p>
            </div> */}
          </div>
        </div>
      </section>
    </main>
  );
}
