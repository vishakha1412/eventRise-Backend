 
import userModel from "../models/user.model.js";

async function getUserById(req,res){
    try{
    const UserId=req.params.id;
     if (!UserId || UserId.length !== 24) {
      return res.status(400).json({ message: "Invalid user ID" });
    }


    const eventUser=await userModel.findById(UserId).select("-password");
    if(!eventUser){
         return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(eventUser);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
}
export {getUserById};



   