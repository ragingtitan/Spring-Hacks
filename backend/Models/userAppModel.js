import mongoose from "mongoose";

const userAppSchema = new mongoose.Schema({
    prompt:{
        type: String,
        required: true
    },
    response:{
        type: String,
        required: true
    },
    timeStamp:{
        type: Date,
        default: Date.now
    },
    fineTuning:{
        type: Object,
        default:{}
    }
})