import Razorpay from "razorpay";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { processEnrollment } from "../services/enrollmentService.js";
import crypto from "crypto";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";


 

  const razorpay = new Razorpay({
    key_id: "rzp_test_WlINePeY36Zqld",
    key_secret: "i83m0IsEmDCaSaqXgqG1IHKx"
  })
// Create Razorpay Order
console.log(razorpay);

export const createOrder = catchAsyncError(async (req, res, next) => {
  const { courseId, amount } = req.body;
  const userId = req.user._id;
  console.log(req.body);
  

  const options = {
    amount: amount, 
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      userId: userId.toString(),
      courseId: courseId.toString()
    }
  };
  // console.log(options);
  

  const order = await razorpay.orders.create(options);
  console.log(order);
  
 
  await Payment.create({
    user: userId,
    course: courseId,
    amount: amount,
    razorpay_order_id: order.id,
    status: "pending"
  });
  // console.log(orderno);
  

  res.status(200).json({
    success: true,
    order
  });
});


export const verifyPayment = catchAsyncError(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
   
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return next(new ErrorHandler("Payment verification failed", 400));
  }

 
  const payment = await Payment.findOneAndUpdate(
    { razorpay_order_id },
    {
      razorpay_payment_id,
      razorpay_signature,
      status: "completed"
    },
    { new: true }
  ).populate("user course");

  if (!payment) {
    return next(new ErrorHandler("Payment record not found", 404));
  }

  // Process enrollment
  await processEnrollment(
    payment.user.email,
    payment.course.title,
    {
      id: razorpay_payment_id,
      amount: payment.amount,
      method: "razorpay",
      currency: "INR"
    }
  );

  res.status(200).json({
    success: true,
    message: "Payment verified and enrollment processed"
  });
});

// Webhook Handler
export const razorpayWebhook = catchAsyncError(async (req, res, next) => {
  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const event = req.body.event;
  const payment = req.body.payload.payment.entity;

  if (event === "payment.captured") {
    await Payment.findOneAndUpdate(
      { razorpay_payment_id: payment.id },
      { status: "completed" }
    );
  }

  res.status(200).json({ success: true });
});

// Get API Key
export const getRazorpayKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_API_KEY
  });
});