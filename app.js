import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

// Load environment variables
config({ path: "./config/config.env" });

const app = express();

// Enhanced CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://edubrain.vercel.app",
      "https://edu-brain-frontend.vercel.app",
      "https://edubraincom.vercel.app",
      "https://edubrain.onrender.com",
      "https://edubraining.onrender.com"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked CORS request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Routes
// ... (your existing route imports and mounting) ...

// Error Handling
app.use(ErrorMiddleware);

// Port Configuration with Fallback
const PORT = process.env.PORT || 4000;
const getAvailablePort = async (startPort) => {
  const net = await import('net');
  const server = net.createServer();
  
  return new Promise((resolve) => {
    server.on('error', () => resolve(getAvailablePort(startPort + 1)));
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });
  });
};

(async () => {
  const availablePort = await getAvailablePort(PORT);
  app.listen(availablePort, () => {
    console.log(`Server running on port ${availablePort}`);
    console.log(`Allowed CORS origins: ${corsOptions.origin.toString()}`);
  });
})();

export default app;