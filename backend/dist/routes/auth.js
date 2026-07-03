"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOtpEmail = async (toEmail, name, otp) => {
    const host = process.env.EMAIL_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.EMAIL_PORT || "465");
    const secure = process.env.EMAIL_SECURE === "true" || port === 465;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) {
        throw new Error("EMAIL_USER dan EMAIL_PASS belum dikonfigurasi di file backend/.env");
    }
    const transporter = nodemailer_1.default.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
    });
    const mailOptions = {
        from: `"ScholarChive Support" <${user}>`,
        to: toEmail,
        subject: "Reset Password OTP - ScholarChive",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0D9488; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">ScholarChive</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Simpan & Kelola Pembelajaranmu</p>
        </div>
        <div style="border-top: 1px solid #f3f4f6; padding-top: 20px;">
          <p style="font-size: 15px; color: #374151; line-height: 1.5;">Halo <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #374151; line-height: 1.5;">Kami menerima permintaan untuk melakukan reset kata sandi akun ScholarChive Anda. Silakan gunakan kode OTP di bawah ini untuk melanjutkan:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; font-family: monospace; font-size: 32px; font-weight: bold; color: #0D9488; letter-spacing: 5px; border: 2px dashed #0D9488; padding: 12px 28px; border-radius: 8px; background-color: #f0fdfb;">
              ${otp}
            </div>
          </div>
          
          <p style="font-size: 13px; color: #ef4444; font-weight: 500;">Penting: Kode ini hanya berlaku selama 10 menit.</p>
          <p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin-top: 15px;">Jika Anda tidak meminta pengaturan ulang kata sandi ini, Anda dapat mengabaikan email ini dengan aman.</p>
        </div>
        <div style="border-top: 1px solid #f3f4f6; margin-top: 25px; padding-top: 15px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ScholarChive. Hak cipta dilindungi.</p>
        </div>
      </div>
    `,
    };
    await transporter.sendMail(mailOptions);
};
const router = express_1.default.Router();
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email sudah digunakan",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await user_1.default.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "Register berhasil",
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Email tidak ditemukan",
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Password salah",
            });
        }
        res.status(200).json({
            message: "Login berhasil",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
});
router.put("/update/:id", async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const user = await user_1.default.findByIdAndUpdate(req.params.id, { name, email, phone }, { new: true, runValidators: true });
        if (!user)
            return res.status(404).json({ message: "User tidak ditemukan" });
        res.status(200).json({ message: "Profil berhasil diperbarui", user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
router.post("/change-password/:id", async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await user_1.default.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User tidak ditemukan" });
        const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Password lama salah" });
        user.password = await bcrypt_1.default.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password berhasil diubah" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const user = await user_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email tidak terdaftar" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        const userObj = user;
        userObj.resetOtp = otp;
        userObj.resetOtpExpires = expires;
        await user.save();
        try {
            await sendOtpEmail(user.email, user.name, otp);
        }
        catch (mailError) {
            console.error("Failed to send OTP email:", mailError);
            return res.status(400).json({
                message: mailError.message || "Gagal mengirim email OTP. Pastikan konfigurasi SMTP di backend/.env sudah benar."
            });
        }
        res.status(200).json({
            message: "OTP berhasil dikirim ke email Anda",
            email: user.email,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        const userObj = user;
        if (!userObj.resetOtp || userObj.resetOtp !== otp) {
            return res.status(400).json({ message: "Kode OTP salah" });
        }
        if (userObj.resetOtpExpires && new Date() > new Date(userObj.resetOtpExpires)) {
            return res.status(400).json({ message: "Kode OTP sudah kedaluwarsa" });
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        userObj.password = hashedPassword;
        userObj.resetOtp = undefined;
        userObj.resetOtpExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Password berhasil direset" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.default = router;
