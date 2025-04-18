import express from "express";
import {
  createOrder,
  verifyPayment,
  razorpayWebhook,
  getRazorpayKey
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify", isAuthenticated, verifyPayment);
router.post("/webhook", express.raw({ type: "application/json" }), razorpayWebhook);
router.get("/get-razorpay-key", isAuthenticated, getRazorpayKey);

export default router;