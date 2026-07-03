"use client";

import { useEffect, useState } from "react";
import {
  UserIcon,
  ShieldCheckIcon,
  MailIcon,
  PhoneIcon,
  KeyRoundIcon,
  SaveIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

type Tab = "profil" | "keamanan";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("Settings");
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [user, setUser] = useState<any>(null);

  // Profil state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setPhone(parsed.phone || "");
    }
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "keamanan" || tab === "profil") {
      setActiveTab(tab as Tab);
    }
  }, [searchParams]);

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error(t("allFieldsRequired"));
      return;
    }
    setSavingProfile(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...user, name, email, phone };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        toast.success(t("profileUpdated"));
      } else {
        toast.error(data.message || t("profileUpdateFailed"));
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error(t("allFieldsRequired"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("minPassword"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("confirmMismatch"));
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t("passwordChanged"));
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || t("passwordChangeFailed"));
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSavingPassword(false);
    }
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return { label: "", color: "", width: "0%" };
    if (pw.length < 6) return { label: t("weak"), color: "#ef4444", width: "25%" };
    if (pw.length < 8) return { label: t("fair"), color: "#f59e0b", width: "50%" };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { label: t("strong"), color: "#10b981", width: "100%" };
    return { label: t("medium"), color: "#0D9488", width: "75%" };
  };

  const strength = passwordStrength(newPassword);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profil", label: t("tabProfile"), icon: <UserIcon size={16} /> },
    { id: "keamanan", label: t("tabSecurity"), icon: <ShieldCheckIcon size={16} /> },
  ];

  return (
    <>

      <div className="bg-white rounded-lg border border-gray-300 p-5 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14b8a6] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl font-bold">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
        <div>
          <div className="font-semibold text-gray-800">{name || "—"}</div>
          <div className="text-sm text-gray-400">{email || "—"}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1.5 border shadow-sm border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
            style={
              activeTab === tab.id
                ? { background: "linear-gradient(135deg,#0D9488,#14b8a6)", color: "white", boxShadow: "0 2px 8px rgba(13,148,136,0.25)" }
                : { color: "#6b7280", background: "transparent" }
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profil" && (
        <div className="bg-white rounded-lg border border-gray-300 p-6 animate-fadeIn">
          <h2 className="font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <UserIcon size={17} className="text-[#0D9488]" />
            {t("profileInfo")}
          </h2>


          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t("fullName")}</label>
            <div className="relative">
              <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="settings-name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("placeholderName")}
              />
            </div>
          </div>


          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t("email")}</label>
            <div className="relative">
              <MailIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="settings-email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholderEmail")}
              />
            </div>
          </div>


          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t("phone")}</label>
            <div className="relative">
              <PhoneIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="settings-phone"
                type="tel"
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("placeholderPhone")}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              id="settings-save-profile"
              onClick={handleUpdateProfile}
              disabled={savingProfile}
              className="btn-primary"
            >
              {savingProfile ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("saving")}
                </>
              ) : (
                <>
                  <SaveIcon size={15} />
                  {t("saveChanges")}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === "keamanan" && (
        <div className="bg-white rounded-lg border border-gray-300 p-6 animate-fadeIn">
          <h2 className="font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <KeyRoundIcon size={17} className="text-[#0D9488]" />
            {t("changePassword")}
          </h2>

          <div className="bg-[#f0fdfb] border border-[#d1fae5] rounded-lg px-4 py-3 mb-5 flex items-start gap-2">
            <AlertCircleIcon size={15} className="text-[#0D9488] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#0D9488]">{t("strongPasswordTip")}</p>
          </div>


          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t("oldPassword")}</label>
            <div className="relative">
              <KeyRoundIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="settings-old-password"
                type={showOld ? "text" : "password"}
                className="input-field"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={t("placeholderOldPassword")}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showOld ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
              </button>
            </div>
          </div>


          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t("newPassword")}</label>
            <div className="relative">
              <KeyRoundIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="settings-new-password"
                type={showNew ? "text" : "password"}
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("placeholderNewPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showNew ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
              </button>
            </div>

            {newPassword && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: strength.width, background: strength.color }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </div>


          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{t("confirmPassword")}</label>
            <div className="relative">
              <KeyRoundIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="settings-confirm-password"
                type={showConfirm ? "text" : "password"}
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("placeholderConfirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirm ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
              </button>
            </div>

            {confirmPassword && (
              <p className={`text-xs mt-1.5 flex items-center gap-1 ${newPassword === confirmPassword ? "text-emerald-500" : "text-red-400"}`}>
                {newPassword === confirmPassword
                  ? <><CheckCircle2Icon size={12} /> {t("passwordMatch")}</>
                  : <><AlertCircleIcon size={12} /> {t("passwordMismatch")}</>}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              id="settings-save-password"
              onClick={handleChangePassword}
              disabled={savingPassword}
              className="btn-primary"
            >
              {savingPassword ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("changing")}
                </>
              ) : (
                <>
                  <ShieldCheckIcon size={15} />
                  {t("changePassword")}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
