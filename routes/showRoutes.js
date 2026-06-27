import express from 'express';
import {getShows, getShowById, getShowSeats} from '../controllers/showController.js';

const router = express.Router();

router.get('/', getShows);
router.get('/:id', getShowById);
router.get('/:id/seats', getShowSeats);

export default router;
