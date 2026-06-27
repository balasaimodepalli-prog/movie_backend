import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    show:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Show',
        required:true
    },
    seats:{
        type:[String],
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['confirmed','cancelled'],
        default:'confirmed'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
const Booking = mongoose.model('Booking',bookingSchema);
export default Booking;
