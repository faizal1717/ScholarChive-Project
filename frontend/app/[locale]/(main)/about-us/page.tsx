import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function page() {
  const t = await getTranslations("AboutUs");

  return (
    <main className="relative mx-auto my-8 min-h-screen w-full max-w-[1208px] px-3 gap-6">
      <div className="w-full h-72 relative rounded-xl overflow-hidden bg-[#c6dfdd]">
        <Image
          src="/about_us_picture.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="w-full my-10 text-gray-700">
        <h1 className="font-semibold text-4xl justify-center flex">
          {t("title")}
        </h1>
        <br />
        <br />
        <div className="text-base w-full text-center px-20">
          <p>{t("paragraph1")}</p>
          <br />
          <p>{t("paragraph2")}</p>
          <br />
          <p>{t("paragraph3")}</p>
          <br />
          <p>{t("paragraph4")}</p>
        </div>
      </div>
    </main>
  );
}
