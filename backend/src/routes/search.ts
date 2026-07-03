import express from "express";
import Semester from "../models/semester";
import Course from "../models/course";
import Module from "../models/module";
import Assignment from "../models/assignment";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q, userId } = req.query;
    if (!q || !userId) {
      return res.status(400).json({ message: "Parameter pencarian dan userId diperlukan" });
    }

    const qStr = q as string;
    const userIdStr = userId as string;
    const regex = new RegExp(qStr, "i"); // Case-insensitive search

    const [semesters, courses, modules, assignments] = await Promise.all([
      Semester.find({ userId: userIdStr, name: regex }).limit(5),
      Course.find({ userId: userIdStr, name: regex }).limit(5),
      Module.find({ userId: userIdStr, name: regex }).populate("courseId", "name").limit(5),
      Assignment.find({ userId: userIdStr, name: regex }).populate("courseId", "name").limit(5),
    ]);

    res.json({
      semesters,
      courses,
      modules,
      assignments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server saat mencari" });
  }
});

export default router;
