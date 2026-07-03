"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const course_1 = __importDefault(require("./routes/course"));
const semester_1 = __importDefault(require("./routes/semester"));
const module_1 = __importDefault(require("./routes/module"));
const assignment_1 = __importDefault(require("./routes/assignment"));
const search_1 = __importDefault(require("./routes/search"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.resolve(process.cwd(), "uploads")));
app.use("/api/courses", course_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/semesters", semester_1.default);
app.use("/api/modules", module_1.default);
app.use("/api/assignments", assignment_1.default);
app.use("/api/search", search_1.default);
app.get("/", (req, res) => {
    res.send("API Running...");
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});
