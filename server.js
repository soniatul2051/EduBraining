import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import { config } from "dotenv";
import morgan from "morgan";

// Load env variables
config({ path: ".env" }); // Adjust to "./config/config.env" if needed
console.log("Environment variables loaded in server.js");

// Validate critical environment variables
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env");
  process.exit(1);
}
if (!process.env.PORT) {
  console.warn("Warning: PORT is not defined in .env, using default 3000");
  process.env.PORT = 3000;
}
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Error: Cloudinary credentials are not defined in .env");
  process.exit(1);
}

// Apply morgan middleware
app.use(morgan("dev"));
console.log("Morgan middleware applied");

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

// Connect to DB
connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary configured");

// Start the server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on PORT: ${process.env.PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Error: Port ${process.env.PORT} is already in use`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});