import mongoose from "mongoose";
 

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,

        },
    password: {
        type: String,
    },
    role:{
        type:String,
        enum: ["organiser", "customer"],

        required:true,
    },
    googleId:{
        type: String,
        unique: true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    otp:{
        type: Number,
    },
    otpExpiry:{
        type:Date,
    }
    
},
    {
        timestamps: true
    }
)

const userModel = mongoose.model("user", userSchema);
export default userModel;