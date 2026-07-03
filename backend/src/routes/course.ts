// import express from "express";
// import Course from "../models/course";
// import Module from "../models/module";
// import Assignment from "../models/assignment";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const { name, userId, semesterId } = req.body;

//     const course = await Course.create({
//       name,
//       userId,
//       semesterId,
//     });

//     res.status(201).json(course);
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Gagal tambah course",
//     });
//   }
// });
// router.get("/detail/:id", async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({
//         message: "Mata kuliah tidak ditemukan",
//       });
//     }
//     res.json(course);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// });

// router.get("/user/:userId", async (req, res) => {
//   try {
//     const courses = await Course.find({
//       userId: req.params.userId,
//     }).populate("semesterId", "name");

//     res.json(courses);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Gagal ambil semua course",
//     });
//   }
// });

// router.get("/:semesterId", async (req, res) => {
//   try {
//     const courses = await Course.find({
//       semesterId: req.params.semesterId,
//     });

//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({
//       message: "Gagal ambil course",
//     });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const courseId = req.params.id;

//     await Assignment.deleteMany({ courseId });
//     await Module.deleteMany({ courseId });
//     await Course.findByIdAndDelete(courseId);

//     res.status(200).json({
//       message: "Mata kuliah dan seluruh data terkait berhasil dihapus",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// });

// export default router;

import express from "express";
import Course from "../models/course";
import Module from "../models/module";
import Assignment from "../models/assignment";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET Semua Mata Kuliah
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("semesterId", "name")
      .populate("userId", "name email");

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal mengambil semua mata kuliah",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Tambah Mata Kuliah
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
  try {
    const { name, userId, semesterId } = req.body;

    const course = await Course.create({
      name,
      userId,
      semesterId,
    });

    res.status(201).json(course);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal tambah course",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Detail Mata Kuliah
|--------------------------------------------------------------------------
*/
router.get("/detail/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Mata kuliah tidak ditemukan",
      });
    }

    res.json(course);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Semua Mata Kuliah Milik User
|--------------------------------------------------------------------------
*/
router.get("/user/:userId", async (req, res) => {
  try {
    const courses = await Course.find({
      userId: req.params.userId,
    }).populate("semesterId", "name");

    res.json(courses);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal mengambil course user",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Semua Mata Kuliah Berdasarkan Semester
|--------------------------------------------------------------------------
*/
router.get("/:semesterId", async (req, res) => {
  try {
    const courses = await Course.find({
      semesterId: req.params.semesterId,
    });

    res.json(courses);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal mengambil course semester",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Hapus Mata Kuliah
|--------------------------------------------------------------------------
*/
router.delete("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;

    await Assignment.deleteMany({
      courseId,
    });

    await Module.deleteMany({
      courseId,
    });

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      message: "Mata kuliah dan seluruh data terkait berhasil dihapus",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;
