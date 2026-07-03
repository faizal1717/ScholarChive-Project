import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("ContactUs");

  return (
    <main className="relative mx-auto my-8 min-h-[calc(100vh-200px)] w-full max-w-[1208px] px-4 flex items-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Illustrative Card */}
        <div className="lg:col-span-5 flex flex-col justify-center bg-[#dcf1ef] rounded-2xl p-8 shadow-xs relative overflow-hidden group min-h-[320px] lg:min-h-full">
          {/* Decorative background gradients/glows */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#0D9488]/15 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <Image
                width={360}
                height={360}
                src="/contact-us.png"
                alt="Contact Us Illustration"
                className="object-contain h-auto max-h-[300px]"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Side: Header and Contact Channels */}
        <div className="lg:col-span-7 flex flex-col justify-center bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-xs space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              {t("helpDesk")}
            </h1>
            <p className="text-gray-500 mt-2 text-base">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Email Card */}
            <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 border border-gray-200/85 rounded-xl hover:border-[#0D9488]/50 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center group-hover:bg-[#0D9488] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                  <MailIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {t("email")}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-gray-800 mt-0.5 truncate">
                    faizalardi.81@gmail.com
                  </p>
                </div>
              </div>
              <a
                href="mailto:faizalardi.81@gmail.com"
                className="self-start sm:self-auto text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-[#0D9488] hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {t("email")}
              </a>
            </div>

            {/* Phone Card */}
            <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 border border-gray-200/85 rounded-xl hover:border-[#0D9488]/50 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center group-hover:bg-[#0D9488] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {t("phone")}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-gray-800 mt-0.5 truncate">
                    085799825616
                  </p>
                </div>
              </div>
              <a
                href="tel:+6285799825616"
                className="self-start sm:self-auto text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-[#0D9488] hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {t("phone")}
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 border border-gray-200/85 rounded-xl hover:border-[#0D9488]/50 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center group-hover:bg-[#0D9488] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                  <MessageCircleIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {t("whatsapp")}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-gray-800 mt-0.5 truncate">
                    {t("whatsappChat")}
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/6285799825616"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto text-xs font-semibold text-[#0D9488] bg-teal-50 hover:bg-[#0D9488] hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Chat
              </a>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
