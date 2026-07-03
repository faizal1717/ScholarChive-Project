"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "id";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.replace(`/${locale}/login`);
      return;
    }

    setIsAuthenticated(true);
    setLoading(false);

    // Initialize activity timestamp
    localStorage.setItem("lastActivity", Date.now().toString());

    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    // Listen to user activity events
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Check periodically for inactivity
    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity) {
        const timePassed = Date.now() - Number(lastActivity);
        if (timePassed > INACTIVITY_TIMEOUT) {
          // Clear credentials
          localStorage.removeItem("user");
          localStorage.removeItem("lastActivity");
          
          setIsAuthenticated(false);
          toast.error(
            locale === "id" 
              ? "Sesi Anda telah berakhir karena tidak ada aktivitas selama 20 menit." 
              : "Your session has expired due to 20 minutes of inactivity."
          );
          router.replace(`/${locale}/login`);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [router, locale]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
