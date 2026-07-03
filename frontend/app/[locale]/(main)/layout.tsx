import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AuthGuard from "@/app/components/Auth/AuthGuard";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </AuthGuard>
  );
}
