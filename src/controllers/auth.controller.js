import userModel from "../models/user.model.js";
import EventOrganiser from "../models/eventorganiser.model.js";
import { sendVerificationEmail } from "../services/email.service.js";
import { sendOtpMail } from "../services/sendotpmail.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

 

async function registerUser(req, res) {
        const { fullName, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           if (!emailRegex.test(email)) {
              return res.status(400).json({ message: "Invalid email format" });
}


        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if(!fullName || !email || !password){
            return res.status(400).json({message:"field all required filed"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword,
            role:"customer"
        });
        const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET, { expiresIn: '2d' });
      res.cookie("token", token,{
         httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,})
      console.log("Sending verification email to:", email);
     
     await sendVerificationEmail({ email, token }).catch((err) => {
        console.log("Error sending email:", err);
    });
      res.status(201).json({ message: "User registered successfully" ,
            token,
             user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            role:user.role
        }
        });
    
}

async function loginUser(req, res) {

    const { email, password } = req.body;
  


    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
       const token = jwt.sign({
        id: user._id,role:user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token,
               {  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,})
     await sendVerificationEmail({ email, token }).catch((err) => {
        console.log("Error sending email:", err);
    });
    res.status(200).json({
        message: "User logged in successfully",
        role:user.role,
        token,
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })
}
function logoutUser(req, res) {
    try{
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}catch(e){
    console.log(e);
}
}
async function updateUserProfile(req,res){
     const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const updatedUser = await EventOrganiser.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      organiser: updatedUser,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }

}
async function registerOrganiser(req,res){
    const{name,businessName,phone,address,email,password}=req.body;
    

    const isAccountAlreadyExists = await EventOrganiser.findOne({
        email
    })
      if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "organiser already exist"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

      const eventorganiser = await EventOrganiser.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        businessName,
        role:"organiser",
    })
    const token =jwt.sign({
        id:eventorganiser._id, 

    },process.env.JWT_SECRET,{expiresIn: "2d"})
    res.cookie("token",token,{
       httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,})
     await sendVerificationEmail({ email, token }).catch((err) => {
        console.log("Error sending email:", err);
    });
    res.status(201).json({
        message:"organiser registered successfully",
        organiser:{
            _id:eventorganiser._id,
             email: eventorganiser.email,
            name: eventorganiser.name,
            address: eventorganiser.address,
            businessName: eventorganiser.businessName,
            phone:eventorganiser.phone
        }
    })
}

async function loginOrganiser(req,res){
     const { email, password } = req.body;

    const organiser = await EventOrganiser.findOne({
        email
    })

    if (!organiser) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, organiser.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
     const token = jwt.sign({
        id: organiser._id,role:organiser.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token,{
        httpOnly: true,
         secure: true, // required for HTTPS
         sameSite: "None", // required for cross-origin cookies
         maxAge: 2 * 24 * 60 * 60 * 1000,

    })
     await sendVerificationEmail({ email, token }).catch((err) => {
        console.log("Error sending email:", err);
    });

    res.status(200).json({
        message: "organiser partner logged in successfully",
        role:organiser.role,
        token,
        organiser: {
            _id: organiser._id,
            email: organiser.email,
            name: organiser.name
        }
    })
}
 async function requestPasswordReset(req, res) {
     try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await sendOtpMail(email, otp);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }

}
async function resetPassword(req, res) {
    try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.otp !== parseInt(otp) ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }

}
async function requestPasswordOrganiserReset(req,res){
    try {
    const { email } = req.body;
    const organiser = await EventOrganiser.findOne({ email });
    if (!organiser) return res.status(404).json({ message: "Organiser not found" });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    organiser.otp = otp;
    organiser.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await organiser.save();

    await sendOtpMail(email, otp);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
}
async function resetPasswordOrganiser(req,res){
     try {
    const { email, otp, newPassword } = req.body;
    const organiser = await EventOrganiser.findOne({ email });
    if (!organiser) return res.status(404).json({ message: "Organiser not found" });

    if (
      organiser.otp !== parseInt(otp) ||
      organiser.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    organiser.password = await bcrypt.hash(newPassword, 10);
    organiser.otp = undefined;
    organiser.otpExpiry = undefined;
    await organiser.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }

}
function logoutOrganiser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        messsage:"Organiser logged out succesfully"
    });
}
export {resetPasswordOrganiser, requestPasswordOrganiserReset, registerUser, loginUser, logoutUser,loginOrganiser,logoutOrganiser,registerOrganiser,updateUserProfile,requestPasswordReset ,resetPassword};
