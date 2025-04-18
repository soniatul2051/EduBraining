import Razorpay from "razorpay";
import { Payment } from "../models/Payment.js";
import Order from "../models/orders.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { processEnrollment } from "../services/enrollmentService.js";
import crypto from "crypto";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendEmail } from "../utils/sendEmail.js";
import { PAYMENT_SUCCESS } from "../email/emailTemplate.js";

const razorpay = new Razorpay({
  key_id: "rzp_test_aNL77S1olvRTZO",
  key_secret: "oZF0dvEN21n5pQMyNc4SggXI",
});
// Create Razorpay Order
// console.log(razorpay);

export const createOrder = catchAsyncError(async (req, res, next) => {
  const { courseId, amount } = req.body;
  const userId = req.user._id;
  console.log(req.body);

  const options = {
    amount: amount*100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      userId: userId.toString(),
      courseId: courseId.toString(),
    },
  };
  // console.log(options);

  const order = await razorpay.orders.create(options);
//   console.log(order);

  await Order.create({
    user: userId,
    course: courseId,
    amount: order.amount,
    razorpay_order_id: order.id,
    currency: order.currency,
    status: "pending",
  });
  res.status(200).json({
    success: true,
    order,
  });
});

export const verifyPayment = catchAsyncError(async (req, res, next) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");
  
    if (expectedSignature !== razorpay_signature) {
      return next(new ErrorHandler("Payment verification failed", 400));
    }
  
    const order = await Order.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
      },
      { new: true }
    ).populate("user course");
  
    if (!order) {
      return next(new ErrorHandler("Payment record not found", 404));
    }
  
    // Process payment, enrollment, and update enrolledCourses
    const [payment, proce] = await Promise.all([
      Payment.create({
        user: order.user,
        amount: order.amount,
        course: order.course,
        currency: order.currency,
        status: "completed",
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      }),
      processEnrollment(order.user.email, order.course.title, {
        id: razorpay_payment_id,
        amount: order.amount,
        method: "razorpay",
        currency: "INR",
      }),
      User.findByIdAndUpdate(
        order.user._id,
        { $addToSet: { enrolledCourses: order.course._id } },
        { new: true }
      ),
    ]);
  
    if (payment) {
      const emailContent = PAYMENT_SUCCESS(
        order.user.name,
        order.course.title,
        {
          id: razorpay_payment_id,
          amount: order.amount,
          method: "razorpay",
          currency: "INR",
        }
      );
      await sendEmail(order.user?.email, "Payment Successful", emailContent);
    }
  
    res.status(200).json({
      success: true,
      message: "Payment verified, enrollment processed, and course added to enrolled courses",
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
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
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
    key: process.env.RAZORPAY_API_KEY,
  });
});
