import Feedback from "../models/Feedback.js";


async function submitFeedback(req, res) {
    try {
    const { role, name, feedback } = req.body;
    if (!role || !name || !feedback) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newFeedback = new Feedback({ role, name, feedback });
    await newFeedback.save();

    res.json({ message: "Thank you for your feedback!" });
  } catch (error) {
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

 

export { submitFeedback, getAllFeedback };