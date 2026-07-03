import express from "express";
import Assignment from "../models/assignment";
import upload from "../middleware/upload";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { name, userId, courseId, dueDate } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const assignment = await Assignment.create({
      name,
      userId,
      courseId,
      dueDate: dueDate || null,
      fileUrl,
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal tambah tugas",
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      userId: req.params.userId,
    }).populate("courseId", "name");

    res.json(assignments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal ambil semua tugas",
    });
  }
});

router.get("/:courseId", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      courseId: req.params.courseId,
    });

    res.json(assignments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal ambil tugas",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const assignmentId = req.params.id;
    await Assignment.findByIdAndDelete(assignmentId);

    res.status(200).json({
      message: "Tugas berhasil dihapus",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal menghapus tugas",
    });
  }
});

export default router;
