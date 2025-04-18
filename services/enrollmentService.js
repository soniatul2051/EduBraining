import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { Progress } from "../models/Progress.js";

export async function processEnrollment(userEmail, courseNameTitle, paymentData) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find user by email
    const user = await User.findOne({ email: userEmail }).session(session);
    if (!user) throw new Error('User not found');
    
    // Find course by title
    const course = await Course.findOne({ title: courseNameTitle }).session(session);
    if (!course) throw new Error('Course not found');

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id
    }).session(session);

    if (existingEnrollment) throw new Error('User already enrolled in this course');

    // Create new enrollment
    const enrollment = await Enrollment.create([{
      user: user._id,
      course: course._id,
      paymentAmount: paymentData.amount / 100,
      paymentMethod: paymentData.method,
      paymentStatus: 'completed',
      currency: paymentData.currency,
      razorpayPaymentId: paymentData.id,
    }], { session });

    // Add course to user's enrolledCourses
    user.enrolledCourses.push(course._id);
    await user.save({ session });

    // Create initial progress record
    await Progress.create([{
      userId: user._id,
      courseId: course._id,
      completedLectures: [],
      lastLecture: 0,
      lectureProgress: []
    }], { session });

    await session.commitTransaction();
    return enrollment[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}