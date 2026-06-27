import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        default:''
    },
    screens:{
        type:Number,
        default:1
    },
    genres:{
        type:[Number],
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
const Theater = mongoose.model('Theater',theaterSchema);
export default Theater;
