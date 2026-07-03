"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignment_1 = __importDefault(require("../models/assignment"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post("/", upload_1.default.single("file"), async (req, res) => {
    try {
        const { name, userId, courseId, dueDate } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const assignment = await assignment_1.default.create({
            name,
            userId,
            courseId,
            dueDate: dueDate || null,
            fileUrl,
        });
        res.status(201).json(assignment);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal tambah tugas",
        });
    }
});
router.get("/user/:userId", async (req, res) => {
    try {
        const assignments = await assignment_1.default.find({
            userId: req.params.userId,
        }).populate("courseId", "name");
        res.json(assignments);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal ambil semua tugas",
        });
    }
});
router.get("/:courseId", async (req, res) => {
    try {
        const assignments = await assignment_1.default.find({
            courseId: req.params.courseId,
        });
        res.json(assignments);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal ambil tugas",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const assignmentId = req.params.id;
        await assignment_1.default.findByIdAndDelete(assignmentId);
        res.status(200).json({
            message: "Tugas berhasil dihapus",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal menghapus tugas",
        });
    }
});
exports.default = router;
