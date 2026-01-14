import mongoose from "mongoose";

const eventSchema=new mongoose.Schema({
     name: {
        type: String,
        required: true,
    },
    image:[ {
        type: String,
        required: true,
    }],
     
    description: {
        type: String,
    },
    eventOrganiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventOrganiser"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    savesCount: {
        type: Number,
        default: 0
    }
},{timestamps:true})

const Event=mongoose.model("Event",eventSchema);
export default Event