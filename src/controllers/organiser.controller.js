import EventOrganiser from "../models/eventorganiser.model.js";
import Event from "../models/event.model.js";

async function getOrganiserById(req,res){
    const OrganiserId=req.params.id;
    const eventOrganiser=await EventOrganiser.findById(OrganiserId)

    const eventByOrganiser =await Event.find({
    eventOrganiser : eventOrganiser})
    console.log(eventByOrganiser)

    if(!eventOrganiser){
         return res.status(404).json({ message: "organiser not found" });
    }
    res.status(200).json({
        message:"Organiser retrieved succesfully",
       
           eventOrganiser :{
            ...eventOrganiser.toObject(),
            event:eventByOrganiser

        }
    });
    }
    export {getOrganiserById}
   