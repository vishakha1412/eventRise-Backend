import mongoose from "mongoose";
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
}, {
    timestamps: true
})
const Like=mongoose.model('Like',likeSchema)
export default Like