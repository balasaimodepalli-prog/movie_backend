import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    genre_ids:{
        type:[Number],
        default:[]
    },
    language:{
        type:String,
        default:'te'
    },
    posterUrl:{
        type:String,
        default:''
    },
    description:{
        type:String,
        default:''
    },
    duration:{
        type:Number,
        default:150
    },
    vote_average:{
        type:Number,
        default:0
    },
    tmdbId:{
        type:Number,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
const Movie = mongoose.model('Movie',movieSchema);
export default Movie;
