import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import { config } from "dotenv";
import morgan from "morgan";
import net from "net";

// Load environment variables
config({ path: "./.env" }); // Changed to standard .env location
console.log("Environment variables loaded in server.js");

// Validate critical environment variables
const validateEnv = () => {
  const requiredVars = [
    "MONGO_URI",
    "CLOUDINARY_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }

  if (!process.env.PORT) {
    console.warn("Warning: PORT not defined, using default 4000");
    process.env.PORT = 4000;
  }
};
validateEnv();

// Apply morgan middleware
app.use(morgan("dev"));
console.log("Morgan middleware applied");

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});
console.log("Cloudinary configured");

// Database connection
connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch(err => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });

// Port finder utility
const findAvailablePort = async (startPort) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(findAvailablePort(startPort + 1)));
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });
  });
};

// Server startup
const startServer = async () => {
  try {
    const port = await findAvailablePort(parseInt(process.env.PORT));
    
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Error handlers
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      server.close(() => process.exit(1));
    });

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully");
      server.close(() => {
        console.log("Process terminated");
      });
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();