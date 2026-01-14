import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema(
    {
        role: { type: String, required: true },
        name: { type: String, required: true },
        feedback: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);