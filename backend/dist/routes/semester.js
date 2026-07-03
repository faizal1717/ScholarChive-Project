"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const semester_1 = __importDefault(require("../models/semester"));
const course_1 = __importDefault(require("../models/course"));
const module_1 = __importDefault(require("../models/module"));
const assignment_1 = __importDefault(require("../models/assignment"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const { name, userId } = req.body;
        const semester = await semester_1.default.create({
            name,
            userId,
        });
        res.status(201).json(semester);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
});
router.get("/detail/:id", async (req, res) => {
    try {
        const semester = await semester_1.default.findById(req.params.id);
        if (!semester) {
            return res.status(404).json({
                message: "Semester tidak ditemukan",
            });
        }
        res.status(200).json(semester);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
});
router.get("/:userId", async (req, res) => {
    try {
        const semesters = await semester_1.default.find({
            userId: req.params.userId,
        });
        const semestersWithCount = await Promise.all(semesters.map(async (semester) => {
            const courseCount = await course_1.default.countDocuments({
                semesterId: semester._id,
            });
            return {
                ...semester.toObject(),
                courseCount,
            };
        }));
        res.status(200).json(semestersWithCount);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const semesterId = req.params.id;
        const courses = await course_1.default.find({ semesterId });
        const courseIds = courses.map((course) => course._id);
        await assignment_1.default.deleteMany({ courseId: { $in: courseIds } });
        await module_1.default.deleteMany({ courseId: { $in: courseIds } });
        await course_1.default.deleteMany({ semesterId });
        await semester_1.default.findByIdAndDelete(semesterId);
        res.status(200).json({
            message: "Semester dan seluruh data terkait berhasil dihapus",
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
