import Event from "../models/event.model.js";
 
import { uploadFile } from "../services/storage.service.js";
import Like from "../models/likes.model.js";
import save from "../models/save.model.js"
import { v4 as uuid} from "uuid";

async function createEvent(req,res){
    
    //console.log(req.body);
   // console.log(req.file)
    
     
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "File is missing or invalid" });
    }


 const fileUploadResult=await uploadFile(req.file.buffer,uuid())
 
 const event =await Event.create({
    name:req.body.name,
    description:req.body.description,
    image:fileUploadResult.url,
    eventOrganiser:req.eventOrganiser._id
 })
     res.status(201).json({
        message: "eventcreated successfully",
        event:event
        
    })
      
}catch (err) {
    console.error("Event creation error:", err);
    res.status(500).json({ 
         error: err.message || "Internal Server Error",
    help: err.help || "Please contact support or try again later.",

     });
  }
 
}

async function getEvent(req,res){
    const events=await Event.find({})
    res.status(200).json({
        message:"events fetched successfully",
        events
    })
}
async function likeevent(req,res){
    const{eventId}=req.body;
    const user=req.user;
        const isAlreadyLiked = await Like.findOne({
        user: user._id,
        event: eventId
    })
    if (isAlreadyLiked) {
        await Like.deleteOne({
            user: user._id,
            event: eventId
        })
         await Event.findByIdAndUpdate(eventId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Event unliked successfully"
        })
    }

    const like = await Like.create({
        user: user._id,
        event: eventId
    })

    await Event.findByIdAndUpdate(eventId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Event liked successfully",
        like
    })
}
async function saveEvent(req,res){
    const {eventId}=req.body;
    const user=req.user;
     const isAlreadySaved = await save.findOne({
        user: user._id,
        event: eventId
    })

    if (isAlreadySaved) {
        await save.deleteOne({
            user: user._id,
            event:eventId
        })

        await Event.findByIdAndUpdate(eventId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Event unsaved successfully"
        })
    }

    const save = await save.create({
        user: user._id,
        event: eventId
    })

    await Event.findByIdAndUpdate(eventId, {
        $inc: { savesCount: 1 }
    })
     res.status(201).json({
        message: "Event saved successfully",
        save
    })

}

async function getSaveEvent(req,res){
    const user=req.user;
     const savedEvents = await save.find({ user: user._id }).populate('event');

    if (!savedEvents || savedEvents.length === 0) {
        return res.status(404).json({ message: "No saved event found" });
    }

    res.status(200).json({
        message: "Saved event retrieved successfully",
        savedEvents
    });
}

export{
    createEvent,getEvent,likeevent,saveEvent,getSaveEvent
}