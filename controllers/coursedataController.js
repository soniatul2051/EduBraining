import { Course } from "../models/Course.js";
import {courseDetails} from "../models/CourseDetails.js";;
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseBySlug = async (req, res) => {
  try {
    const courseSlug = req.params.slug;
    
   
    let course = await Course.findOne({ slug: courseSlug });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    
    if (!course.poster?.public_id) {
      const details = await courseDetails.findOne({ slug: courseSlug });
      
      if (details?.poster) {
        course.poster = details.poster; 
        await course.save(); 
      }
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error in getCourseBySlug:", error);
    res.status(500).json({ message: error.message });
  }
};