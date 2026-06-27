import express from 'express';
import {getTheaters, getTheaterById} from '../controllers/theaterController.js';

const router = express.Router();

router.get('/', getTheaters);
router.get('/:id', getTheaterById);

export default router;
