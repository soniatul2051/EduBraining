// models/Doubt.js
import mongoose from 'mongoose';

const doubtSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: ''
    },
    mentorResponse: {
        type: String,
        default: ''
    },
    mentorFileUrl: { 
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Doubt = mongoose.model('Doubt', doubtSchema);

export default Doubt;