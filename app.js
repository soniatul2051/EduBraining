import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();


const app = express();

// Load environment variables
config({ path: "./config/config.env" });
console.log("Environment variables loaded in app.js");

// Using middleware
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://edubrain.vercel.app",
    "https://edu-brain-frontend.vercel.app",
    "https://edubraincom.vercel.app",
    "https://edubrain.onrender.com/",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

// Parse body before logging to capture req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom morgan format
morgan.format("custom", ":method :url :status :response-time ms - Body: :req[body]");
app.use(morgan("custom"));
app.use(cors(corsOptions));

console.log("Middleware configured: Morgan, CORS, JSON, URL-encoded, cookie-parser");

// Importing routes
import coursedata from "./routes/coursedataRoute.js";
import user from "./routes/userRoutes.js";
import Submissions from "./routes/submissionRoute.js";
import Assignment from "./routes/AssignmentRoute.js";
import Progress from "./routes/ProgressRoute.js";
import course from "./routes/courseRoute.js";
import enrollment from "./routes/EnrollmentRoutes.js";
import doubt from "./routes/doubtRoutes.js";

// Mounting routes
app.use("/api/v1", coursedata);
app.use("/api/v1", user);
app.use("/api/v1", Submissions);
app.use("/api/v1", Assignment);
app.use("/api/v1", Progress);
app.use("/api/v1", course);
app.use("/api/v1", enrollment);
app.use("/api/v1", doubt);
console.log("Routes mounted under /api/v1");

// Root route
app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.send("Welcome to EduBrain. The server is live.");
});

// Error middleware
app.use(ErrorMiddleware);
console.log("Error middleware applied");

export default app;