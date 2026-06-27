import Theater from '../models/Theater.js';

// get all theaters, with optional city filter
const getTheaters = async(req,res)=>{
    try{
        let filter = {};

        if(req.query.city){
            filter.city = {$regex: req.query.city, $options:'i'};
        }

        const theaters = await Theater.find(filter);
        return res.json(theaters);
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

// get single theater by id
const getTheaterById = async(req,res)=>{
    try{
        const theater = await Theater.findById(req.params.id);
        if(!theater){
            return res.status(404).send('theater not found');
        }
        return res.json(theater);
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

export {getTheaters, getTheaterById};
