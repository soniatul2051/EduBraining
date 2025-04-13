import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

// Load environment variables
config({ path: "./config/config.env" });

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://edubrain.vercel.app",
  "https://edu-brain-frontend.vercel.app",
  "https://edubraincom.vercel.app",
  "https://edubrain.onrender.com",
  "https://edubraining.onrender.com",
  ""
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked CORS request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"]
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Route imports
import coursedata from "./routes/coursedataRoute.js";
import user from "./routes/userRoutes.js";
import Submissions from "./routes/submissionRoute.js";
import Assignment from "./routes/AssignmentRoute.js";
import Progress from "./routes/ProgressRoute.js";
import course from "./routes/courseRoute.js";
import enrollment from "./routes/EnrollmentRoutes.js";
import doubt from "./routes/doubtRoutes.js";

// Route mounting
app.use("/api/v1", coursedata);
app.use("/api/v1", user);
app.use("/api/v1", Submissions);
app.use("/api/v1", Assignment);
app.use("/api/v1", Progress);
app.use("/api/v1", course);
app.use("/api/v1", enrollment);
app.use("/api/v1", doubt);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduBrain API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedUrl: req.originalUrl
  });
});

// Error middleware
app.use(ErrorMiddleware);

// Server configuration
const PORT = process.env.PORT || 4000;
const ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`Server running in ${ENV} mode on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});

export default app;