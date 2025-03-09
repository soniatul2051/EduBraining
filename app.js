import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

config({
  path: "./config/config.env",
  
});


//using middleware
const corsOptions = {
  origin: ["http://localhost:3000","https://edubrain.vercel.app","https://edu-brain-frontend.vercel.app","https://edubraincom.vercel.app"],
  optionsSuccessStatus: 200, // Corrected property name
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

//Importing routes
import coursedata from "./routes/coursedataRoute.js";
import user from "./routes/userRoutes.js";
import Submissions from "./routes/submissionRoute.js";
import Assignment from "./routes/AssignmentRoute.js";
import Progress from "./routes/ProgressRoute.js";
import course from "./routes/courseRoute.js";
import enrollment from "./routes/EnrollmentRoutes.js";
import doubt from "./routes/doubtRoutes.js";

app.use("/api/v1", coursedata);
app.use("/api/v1", user);
app.use("/api/v1", Submissions);
app.use("/api/v1", Assignment);
app.use("/api/v1", Progress);
app.use("/api/v1", course);
app.use("/api/v1", enrollment);
app.use("/api/v1", doubt);
// app.use('/api/v1', courseRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to EduBrain. The server is live.");
});

export default app;

app.use(ErrorMiddleware);
