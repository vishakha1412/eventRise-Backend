import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function verifyEmail(req,res){
    const { token } = req.query;
  if (!token) return res.status(400).send("Missing token");

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    const user = await User.findById(decoded.uid);
    if (!user) return res.status(404).send("User not found");

    if (user.isVerified) {
      return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=already`);
    }

    user.isVerified = true;
    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=success`);
  } catch (err) {
    return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=invalid`);
  }
}
export {verifyEmail};


