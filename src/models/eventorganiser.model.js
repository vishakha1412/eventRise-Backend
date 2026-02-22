 import mongoose from "mongoose";

const EventOrganiserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
   role: {
    type: String,
    enum: ["organiser", "customer"],
    required: true,
  },
   otp:{
        type: Number,
    },
    otpExpiry:{
        type:Date,
    },
     isVerified:{
        type:Boolean,
        default:false
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    lastVerificationEmailSent: {
  type: Date,
  default: null,
},
    


 
 
},{timestamps:true});

const EventOrganiser = mongoose.model("EventOrganiser", EventOrganiserSchema);

export default EventOrganiser;
