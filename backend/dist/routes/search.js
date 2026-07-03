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
router.get("/", async (req, res) => {
    try {
        const { q, userId } = req.query;
        if (!q || !userId) {
            return res.status(400).json({ message: "Parameter pencarian dan userId diperlukan" });
        }
        const qStr = q;
        const userIdStr = userId;
        const regex = new RegExp(qStr, "i"); // Case-insensitive search
        const [semesters, courses, modules, assignments] = await Promise.all([
            semester_1.default.find({ userId: userIdStr, name: regex }).limit(5),
            course_1.default.find({ userId: userIdStr, name: regex }).limit(5),
            module_1.default.find({ userId: userIdStr, name: regex }).populate("courseId", "name").limit(5),
            assignment_1.default.find({ userId: userIdStr, name: regex }).populate("courseId", "name").limit(5),
        ]);
        res.json({
            semesters,
            courses,
            modules,
            assignments,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Terjadi kesalahan server saat mencari" });
    }
});
exports.default = router;
