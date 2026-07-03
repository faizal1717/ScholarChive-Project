import SettingsClient from "@/app/components/Settings/SettingsClient";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Settings");
  return (
    <div className="min-h-screen py-10 px-4">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out both; }
        .animate-fadeIn  { animation: fadeIn 0.2s ease-out both; }
        .input-field {
          width: 100%;
          border: 1px solid #c8c8c8ff;
          border-radius: 6px;
          padding: 11px 44px 11px 44px;
          font-size: 14px;
          color: #1f2937;
          background: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field.focus {
          border-color: #0D9488;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.12);
        }
        .btn-primary {
          background: linear-gradient(135deg, #0D9488, #14b8a6);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      <div className="max-w-2xl mx-auto animate-slideUp">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
        </div>

        <SettingsClient />
      </div>
    </div>
  );
}
