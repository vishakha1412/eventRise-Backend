import EventOrganiser from "../models/eventorganiser.model.js";
import Feedback from "../models/Feedback.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";


async function submitFeedback(req, res) {
     const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Please login to submit feedback" });
  }
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   req.user = decoded;
   const eventOrganiser = await EventOrganiser.findById(decoded.id);
    req.eventOrganiser = eventOrganiser;
  const user = await userModel.findById(decoded.id);
    req.user = user;

  
    try {
    const { role, name, feedback } = req.body;
    if (!role || !name || !feedback) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const newFeedback= await Feedback.create({
        role,
        name,
        feedback,
        userId:decoded.id || null
    })
   // await newFeedback.save();

    res.json({  
      message: "Thank you for your feedback!",
       userId: decoded.id,
       feedback: newFeedback
      
      
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
async function getAllFeedback(req, res) {
    try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
async function deleleteFeedback(req, res) {
   try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Please login to delete feedback" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUserId = decoded.id;
    if (!loggedInUserId) {
      return res.status(401).json({ message: "Unauthorized: You must be logged in to delete feedback" });
    }

    const feedbackId = req.params.id; // corrected from req.params.i
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.userId.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own feedback" });
    }

    await Feedback.findByIdAndDelete(feedbackId);
    res.json({ message: "Feedback deleted successfully" });

  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error" });
  }

};
 
export { submitFeedback, getAllFeedback, deleleteFeedback };