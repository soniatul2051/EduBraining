import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  razorpay_payment_id: {
    type: String
  },
  razorpay_order_id: {
    type: String
  },
  razorpay_signature: {
    type: String
  }
}, { timestamps: true });

export const Payment = mongoose.model("Payment", paymentSchema);