import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import EventOrganiser from "../models/eventorganiser.model.js";
import { sendVerificationEmail } from "../services/email.service.js";


async function verifyEmail(req,res){
  try{
    const { token } = req.query;
  if (!token)  return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=invalid`);
    console.log("Received token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token data:", decoded);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send("User not found");
    console.log("Decoded token:", user.isVerified);
     
     if (!user) return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=invalid`);

    if (user.isVerified) {
      return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=already`);
    }

    user.isVerified = true;
    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=success`);
  } catch (err) {
    console.log("verify email error:", err);
    return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=invalid`);
  }
  } catch(err){
    return res.status(500).json({message:"Internal Server Error"});
  }
}
async function verifyOrganiserEmail(req,res){
   try {
    const { token } = req.query;
    if (!token) {
      return res.redirect(`${process.env.CLIENT_URL}/organiser/verify-email?status=invalid`);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.redirect(`${process.env.CLIENT_URL}/organiser/verify-email?status=invalid`);
    }

    // Use decoded.id, not req.params
    const organiser = await EventOrganiser.findById(decoded.id);
    if (!organiser) {
      return res.redirect(`${process.env.CLIENT_URL}/organiser/verify-email?status=invalid`);
    }

    if (organiser.isVerified) {
      return res.redirect(`${process.env.CLIENT_URL}/organiser/verify-email?status=already`);
    }

    organiser.isVerified = true;
    await organiser.save();

    return res.redirect(`${process.env.CLIENT_URL}/organiser/verify-email?status=success`);
  } catch (err) {
    console.error("Internal error verifying organiser email:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }


}
async function resendVerificationEmail(req, res) {
    try {
    const { email, role } = req.body;

    const account =
      role === "eventorganiser"
        ? await EventOrganiser.findOne({ email })
        : await User.findOne({ email });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Throttle: check last sent timestamp
    const now = new Date();
    if (
      account.lastVerificationEmailSent &&
      now - account.lastVerificationEmailSent < 5 * 60 * 1000 // 5 minutes
    ) {
      return res
        .status(429)
        .json({ message: "Please wait before requesting another email." });
    }
const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send email
    await sendVerificationEmail({ email: account.email, token, role });

    // Update timestamp
    account.lastVerificationEmailSent = now;
    await account.save();

    return res.json({ message: "Verification email resent successfully" });
  } catch (err) {
    console.error("Error resending verification email:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }


 

}

export {verifyEmail,verifyOrganiserEmail,resendVerificationEmail};


