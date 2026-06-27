import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

// create a new booking
const createBooking = async(req,res)=>{
    try{
        const {showId, seats} = req.body;

        if(!showId || !seats || seats.length === 0){
            return res.status(400).send('showId and seats are required');
        }

        const show = await Show.findById(showId);
        if(!show){
            return res.status(404).send('show not found');
        }

        // check if any requested seat is already booked
        const alreadyBooked = [];
        for(let i=0; i<seats.length; i++){
            if(show.bookedSeats.includes(seats[i])){
                alreadyBooked.push(seats[i]);
            }
        }

        if(alreadyBooked.length > 0){
            return res.status(400).json({
                message:'some seats are already booked',
                conflictSeats: alreadyBooked
            });
        }

        // atomically push seats to bookedSeats
        const updated = await Show.findOneAndUpdate(
            {
                _id: showId,
                bookedSeats: {$nin: seats}  // double check no conflict
            },
            {
                $push: {bookedSeats: {$each: seats}}
            },
            {new:true}
        );

        if(!updated){
            return res.status(400).send('seats booking conflict, try again');
        }

        // calculate total amount
        const totalAmount = seats.length * show.price;

        const booking = await Booking.create({
            user: req.user._id,
            show: showId,
            seats: seats,
            totalAmount: totalAmount,
            status:'confirmed'
        });

        return res.status(201).json(booking);
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

// get logged in user's bookings
const getMyBookings = async(req,res)=>{
    try{
        const bookings = await Booking.find({user: req.user._id})
            .populate({
                path:'show',
                populate:[
                    {path:'movie', select:'title posterUrl'},
                    {path:'theater', select:'name city'}
                ]
            })
            .sort({createdAt:-1});

        return res.json(bookings);
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

// get single booking by id
const getBookingById = async(req,res)=>{
    try{
        const booking = await Booking.findById(req.params.id)
            .populate({
                path:'show',
                populate:[
                    {path:'movie', select:'title posterUrl duration'},
                    {path:'theater', select:'name city address'}
                ]
            });

        if(!booking){
            return res.status(404).send('booking not found');
        }

        // make sure user can only see their own booking
        if(booking.user.toString() !== req.user._id.toString()){
            return res.status(403).send('not authorized');
        }

        return res.json(booking);
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

// cancel a booking
const cancelBooking = async(req,res)=>{
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).send('booking not found');
        }

        // check ownership
        if(booking.user.toString() !== req.user._id.toString()){
            return res.status(403).send('not authorized');
        }

        if(booking.status === 'cancelled'){
            return res.status(400).send('booking already cancelled');
        }

        // remove seats from show's bookedSeats
        await Show.findByIdAndUpdate(booking.show,{
            $pull: {bookedSeats: {$in: booking.seats}}
        });

        booking.status = 'cancelled';
        await booking.save();

        return res.json({message:'booking cancelled', booking});
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

export {createBooking, getMyBookings, getBookingById, cancelBooking};
