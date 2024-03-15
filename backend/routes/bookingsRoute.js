// bookingRoutes.js

import express from 'express';
import { checkBooking, createBooking , getBookings , deleteBooking} from '../controllers/bookingController.js';

const router = express.Router();

// Route for checking booking availability
router.post('/check', checkBooking);

// Route for creating a new booking
router.post('/create', createBooking);

router.get('/',getBookings);

router.delete('/:id',deleteBooking);

export default router;

