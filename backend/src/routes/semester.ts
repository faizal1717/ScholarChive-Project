import express from "express";
import Semester from "../models/semester";
import Course from "../models/course";
import Module from "../models/module";
import Assignment from "../models/assignment";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, userId } = req.body;

    const semester = await Semester.create({
      name,
      userId,
    });

    res.status(201).json(semester);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/detail/:id", async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) {
      return res.status(404).json({
        message: "Semester tidak ditemukan",
      });
    }
    res.status(200).json(semester);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const semesters = await Semester.find({
      userId: req.params.userId,
    });

    const semestersWithCount = await Promise.all(
      semesters.map(async (semester) => {
        const courseCount = await Course.countDocuments({
          semesterId: semester._id,
        });
        return {
          ...semester.toObject(),
          courseCount,
        };
      })
    );

    res.status(200).json(semestersWithCount);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const semesterId = req.params.id;

    const courses = await Course.find({ semesterId });
    const courseIds = courses.map((course) => course._id);

    await Assignment.deleteMany({ courseId: { $in: courseIds } });
    await Module.deleteMany({ courseId: { $in: courseIds } });
    await Course.deleteMany({ semesterId });
    await Semester.findByIdAndDelete(semesterId);

    res.status(200).json({
      message: "Semester dan seluruh data terkait berhasil dihapus",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;
