import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";

// export const isAuthenticated = catchAsyncError(async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) return next(new ErrorHandler("Not Logged In", 401));

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   req.user = await User.findById(decoded._id);

//   next();
// });

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;

  // 1. Check token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Fallback: Check token in cookies
  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorHandler("Not Logged In", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id); 

  if (!req.user) {
    return next(new ErrorHandler("User no longer exists", 401));
  }

  next();
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
