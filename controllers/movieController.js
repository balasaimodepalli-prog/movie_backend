import Movie from '../models/Movie.js';

// get all movies, with optional genre & search filters
const getMovies = async(req,res)=>{
    try{
        let filter = {};

        // filter by genre if provided
        if(req.query.genre){
            filter.genre_ids = Number(req.query.genre);
        }

        // search by title if provided
        if(req.query.search){
            filter.title = {$regex: req.query.search, $options:'i'};
        }

        const movies = await Movie.find(filter);
        return res.json(movies);
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

// get single movie by id
const getMovieById = async(req,res)=>{
    try{
        const movie = await Movie.findById(req.params.id);
        if(!movie){
            return res.status(404).send('movie not found');
        }
        return res.json(movie);
    }
    catch(err){
        return res.status(500).send('error: '+err.message);
    }
}

export {getMovies, getMovieById};
