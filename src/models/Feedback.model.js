import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema(
    {
        role: { type: String, enum:["user", "organizer"], required: true },
        name: { type: String, required: true },
        feedback: { type: String, required: true },
        userId:{type :mongoose.Schema.Types.ObjectId ,ref:"User", required:true}
    },
    { timestamps: true }
);
const Feedback= mongoose.model("Feedback", feedbackSchema);
export default Feedback;