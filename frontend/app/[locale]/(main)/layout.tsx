import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AuthGuard from "@/app/components/Auth/AuthGuard";
import { Toaster } from "react-hot-toast";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#6c6c6c",
            padding: "12px 36px",
            borderRadius: "8px",
            minWidth: "320px",
            textAlign: "center",
            fontWeight: "600",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          },
        }}
      />
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </AuthGuard>
  );
}
