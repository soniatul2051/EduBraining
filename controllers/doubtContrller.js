
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
    const file = req.file;

    try {

        let mentorFileUrl = '';
        if (file) {
            const result = await cloudinary.uploader.upload(file.path);
            mentorFileUrl = result.secure_url;
        }


        const updatedDoubt = await Doubt.findByIdAndUpdate(
            id,
            { status, mentorResponse, mentorFileUrl,updatedAt: Date.now() },
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
