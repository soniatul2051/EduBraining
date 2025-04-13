import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";

// Debug function for token verification
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;
  
  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  
  // Or from cookies
  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return next(new ErrorHandler("Not Logged In", 401));
  }
  
  try {
    // IMPORTANT FIX: Using the same JWT_SECRET used in the User model
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // IMPORTANT FIX: The model uses _id but you're looking for decoded.id
    req.user = await User.findById(decoded._id);
    
    if (!req.user) {
      return next(new ErrorHandler("User no longer exists", 401));
    }
    
    next();
  } catch (error) {
    // More descriptive error for debugging
    console.error("JWT Verification Error:", error.message);
    return next(new ErrorHandler("Authentication failed - " + error.message, 401));
  }
});

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access this resource`,
        403
      )
    );
  
  next();
};