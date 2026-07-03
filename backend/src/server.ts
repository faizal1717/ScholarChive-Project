import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import courseRoutes from "./routes/course";
import semesterRoutes from "./routes/semester";
import moduleRoutes from "./routes/module";
import assignmentRoutes from "./routes/assignment";
import searchRoutes from "./routes/search";

import path from "path";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
