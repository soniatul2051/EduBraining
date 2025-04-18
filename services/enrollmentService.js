import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { Progress } from "../models/Progress.js";

export async function processEnrollment(userEmail, courseNameTitle, paymentData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Find the user
    const user = await User.findOne({ email: userEmail }).session(session);
    if (!user) throw new Error("User not found");
    console.log("✅ User found:", user._id.toString());

    // Step 2: Find the course
    const course = await Course.findOne({ title: courseNameTitle }).session(session);
    if (!course) throw new Error("Course not found");
    console.log("✅ Course found:", course._id.toString());

    // Step 3: Check for existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id
    }).session(session);

    if (existingEnrollment) {
      console.log("⚠️ Duplicate enrollment found:", existingEnrollment);
      throw new Error("User already enrolled in this course");
    }

    // Step 4: Create new enrollment
    const [newEnrollment] = await Enrollment.create([{
      user: user._id,
      course: course._id,
      paymentAmount: paymentData.amount / 100,
      paymentMethod: paymentData.method,
      paymentStatus: "completed",
      currency: paymentData.currency,
      razorpayPaymentId: paymentData.id,
    }], { session });

    console.log("✅ Enrollment created:", newEnrollment._id.toString());

    // Step 5: Update user's enrolledCourses
    user.enrolledCourses.push(course._id);
    await user.save({ session });
    console.log("✅ User updated with enrolled course");

    // Step 6: Create initial progress record
    const [progress] = await Progress.create([{
      userId: user._id,
      courseId: course._id,
      completedLectures: [],
      lastLecture: 0,
      lectureProgress: []
    }], { session });

    console.log("✅ Progress created:", progress._id.toString());

    // Step 7: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Enrollment successful",
      enrollment: newEnrollment
    };

  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Enrollment failed:", error.message);
    return {
      success: false,
      message: error.message
    };
  }
}
