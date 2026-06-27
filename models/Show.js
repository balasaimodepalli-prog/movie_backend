import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie',
        required:true
    },
    theater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Theater',
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    totalSeats:{
        type:Number,
        default:60
    },
    bookedSeats:{
        type:[String],
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
const Show = mongoose.model('Show',showSchema);
export default Show;
