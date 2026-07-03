"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const module_1 = __importDefault(require("../models/module"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post("/", upload_1.default.single("file"), async (req, res) => {
    try {
        const { name, userId, courseId } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const moduleObj = await module_1.default.create({
            name,
            userId,
            courseId,
            fileUrl,
        });
        res.status(201).json(moduleObj);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal tambah modul",
        });
    }
});
router.get("/user/:userId", async (req, res) => {
    try {
        const modules = await module_1.default.find({
            userId: req.params.userId,
        }).populate("courseId", "name");
        res.json(modules);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal ambil semua modul",
        });
    }
});
router.get("/:courseId", async (req, res) => {
    try {
        const modules = await module_1.default.find({
            courseId: req.params.courseId,
        });
        res.json(modules);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal ambil modul",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const moduleId = req.params.id;
        await module_1.default.findByIdAndDelete(moduleId);
        res.status(200).json({
            message: "Modul berhasil dihapus",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal menghapus modul",
        });
    }
});
exports.default = router;
