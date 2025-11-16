import mongoose from "mongoose";
const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    Event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
}, {
    timestamps: true
})


const save = mongoose.model('save', saveSchema);
export default save;