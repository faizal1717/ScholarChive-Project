import express from "express";
import Module from "../models/module";
import upload from "../middleware/upload";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { name, userId, courseId } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const moduleObj = await Module.create({
      name,
      userId,
      courseId,
      fileUrl,
    });

    res.status(201).json(moduleObj);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal tambah modul",
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const modules = await Module.find({
      userId: req.params.userId,
    }).populate("courseId", "name");

    res.json(modules);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal ambil semua modul",
    });
  }
});

router.get("/:courseId", async (req, res) => {
  try {
    const modules = await Module.find({
      courseId: req.params.courseId,
    });

    res.json(modules);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal ambil modul",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const moduleId = req.params.id;
    await Module.findByIdAndDelete(moduleId);

    res.status(200).json({
      message: "Modul berhasil dihapus",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal menghapus modul",
    });
  }
});

export default router;
