import Show from '../models/Show.js';

// get shows with filters: movieId, theaterId, date
const getShows = async(req,res)=>{
    try{
        let filter = {};

        if(req.query.movieId){
            filter.movie = req.query.movieId;
        }
        if(req.query.theaterId){
            filter.theater = req.query.theaterId;
        }
        if(req.query.date){
            filter.date = req.query.date;
        }

        const shows = await Show.find(filter)
            .populate('movie','title posterUrl genre_ids vote_average duration')
            .populate('theater','name city address');

        return res.json(shows);
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

// get single show by id
const getShowById = async(req,res)=>{
    try{
        const show = await Show.findById(req.params.id)
            .populate('movie','title posterUrl genre_ids vote_average duration')
            .populate('theater','name city address');

        if(!show){
            return res.status(404).send('show not found');
        }
        return res.json(show);
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

// get seat availability for a show
const getShowSeats = async(req,res)=>{
    try{
        const show = await Show.findById(req.params.id);
        if(!show){
            return res.status(404).send('show not found');
        }

        // generate all seats A1-F10
        const rows = ['A','B','C','D','E','F'];
        const allSeats = [];
        for(let r=0; r<rows.length; r++){
            for(let s=1; s<=10; s++){
                allSeats.push(rows[r]+s);
            }
        }

        const seatMap = [];
        for(let i=0; i<allSeats.length; i++){
            seatMap.push({
                seat: allSeats[i],
                isBooked: show.bookedSeats.includes(allSeats[i])
            });
        }

        return res.json({
            showId: show._id,
            totalSeats: show.totalSeats,
            bookedCount: show.bookedSeats.length,
            availableCount: show.totalSeats - show.bookedSeats.length,
            seats: seatMap
        });
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

export {getShows, getShowById, getShowSeats};
