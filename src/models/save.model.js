import mongoose from "mongoose";
const saveSchema = new mongoose.Schema({
     
     
    eventOrganiser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EventOrganiser"
        },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    isSave:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


const save = mongoose.model('save', saveSchema);
export default save;