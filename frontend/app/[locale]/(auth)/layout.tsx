import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
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
      {children}
    </>
  );
}
