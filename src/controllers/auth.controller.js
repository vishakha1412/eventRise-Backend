import userModel from "../models/user.model.js";
import EventOrganiser from "../models/eventorganiser.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
    
        const { fullName, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if(!fullName &!email &!password){
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
    }, process.env.JWT_SECRET)
      res.cookie("token", token)
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

    res.cookie("token", token)

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
    res.cookie("token",token)
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

    res.cookie("token", token)

    res.status(200).json({
        message: "Food partner logged in successfully",
        role:organiser.role,
        token,
        organiser: {
            _id: organiser._id,
            email: organiser.email,
            name: organiser.name
        }
    })
}
function logoutOrganiser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        messsage:"Organiser logged out succesfully"
    });
}
export { registerUser, loginUser, logoutUser,loginOrganiser,logoutOrganiser,registerOrganiser };