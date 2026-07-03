"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_1 = __importDefault(require("../models/course"));
const module_1 = __importDefault(require("../models/module"));
const assignment_1 = __importDefault(require("../models/assignment"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const { name, userId, semesterId } = req.body;
        const course = await course_1.default.create({
            name,
            userId,
            semesterId,
        });
        res.status(201).json(course);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal tambah course",
        });
    }
});
router.get("/detail/:id", async (req, res) => {
    try {
        const course = await course_1.default.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                message: "Mata kuliah tidak ditemukan",
            });
        }
        res.json(course);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
});
router.get("/user/:userId", async (req, res) => {
    try {
        const courses = await course_1.default.find({
            userId: req.params.userId,
        }).populate("semesterId", "name");
        res.json(courses);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Gagal ambil semua course",
        });
    }
});
router.get("/:semesterId", async (req, res) => {
    try {
        const courses = await course_1.default.find({
            semesterId: req.params.semesterId,
        });
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({
            message: "Gagal ambil course",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        await assignment_1.default.deleteMany({ courseId });
        await module_1.default.deleteMany({ courseId });
        await course_1.default.findByIdAndDelete(courseId);
        res.status(200).json({
            message: "Mata kuliah dan seluruh data terkait berhasil dihapus",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
});
exports.default = router;
