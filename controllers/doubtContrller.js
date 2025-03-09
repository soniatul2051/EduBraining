// import Doubt from "../models/Doubt.js";
// const convertToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// };

// // 📌 Create a new doubt
// export const createDoubt = async (req, res) => {
//   try {
//     const { file, comments } = req.body;
//     const base64File = await convertToBase64(file);
  
//     // Upload file to Cloudinary
//     const uploadedResponse = await cloudinary.uploader.upload(base64File);
//     const fileUrl = uploadedResponse.secure_url; // Get uploaded file URL

//     const newDoubt = new Doubt({ fileUrl, comments });
//     await newDoubt.save();
//     res.status(201).json({ success: true, message: "Doubt created successfully", doubt: newDoubt });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 📌 Get all doubts (for students or mentors)
// export const getDoubts = async (req, res) => {
//   try {
//     const doubts = await Doubt.find().populate("studentId", "name").populate("mentorId", "name");
//     res.status(200).json({ success: true, doubts });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 📌 Get a single doubt by ID
// export const getDoubtById = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const doubt = await Doubt.findById(userId).populate("studentId mentorId");
//     if (!doubt) return res.status(404).json({ success: false, message: "Doubt not found" });
//     res.status(200).json({ success: true, doubt });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 📌 Update doubt status
// export const updateDoubtStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const updatedDoubt = await Doubt.findByIdAndUpdate(req.params.id, { status }, { new: true });
//     if (!updatedDoubt) return res.status(404).json({ success: false, message: "Doubt not found" });

//     res.status(200).json({ success: true, message: "Doubt status updated", doubt: updatedDoubt });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 📌 Add mentor response to a doubt
// export const addResponse = async (req, res) => {
//   try {
//     const { message, senderId } = req.body;
//     const doubt = await Doubt.findById(req.params.id);

//     if (!doubt) return res.status(404).json({ success: false, message: "Doubt not found" });

//     doubt.responses.push({ message, senderId });
//     await doubt.save();

//     res.status(200).json({ success: true, message: "Response added", doubt });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 📌 Delete doubt
// export const deleteDoubt = async (req, res) => {
//   try {
//     const deletedDoubt = await Doubt.findByIdAndDelete(req.params.id);
//     if (!deletedDoubt) return res.status(404).json({ success: false, message: "Doubt not found" });

//     res.status(200).json({ success: true, message: "Doubt deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
















// controllers/doubtController.js
import Doubt from '../models/Doubt.js';
import cloudinary from 'cloudinary';


// Submit a new doubt
export const submitDoubt = async (req, res) => {
    const { studentId, message } = req.body;
    const file = req.file;

    try {
        let fileUrl = '';
        if (file) {
            const result = await cloudinary.uploader.upload(file.path);
            fileUrl = result.secure_url;
        }

        const newDoubt = new Doubt({
            studentId,
            message,
            fileUrl,
            status: 'pending'
        });

        await newDoubt.save();
        res.status(201).json(newDoubt);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting doubt', error });
    }
};

// Get all doubts for a student
export const getDoubts = async (req, res) => {
    const { studentId } = req.params;

    try {
        const doubts = await Doubt.find({ studentId }).sort({ createdAt: -1 });
        res.status(200).json(doubts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doubts', error });
    }
};
export const getAllDoubts = async (req, res) => {
   

    try {
        const doubts = await Doubt.find().sort({ createdAt: -1 });
        res.status(200).json(doubts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doubts', error });
    }
};

// Update doubt status and mentor response
export const updateDoubt = async (req, res) => {
    const { id } = req.params;
    const { status, mentorResponse } = req.body;

    try {
        const updatedDoubt = await Doubt.findByIdAndUpdate(
            id,
            { status, mentorResponse, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedDoubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }

        res.status(200).json(updatedDoubt);
    } catch (error) {
        res.status(500).json({ message: 'Error updating doubt', error });
    }
};

// Delete a doubt
export const deleteDoubt = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDoubt = await Doubt.findByIdAndDelete(id);

        if (!deletedDoubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }

        res.status(200).json({ message: 'Doubt deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doubt', error });
    }
};
