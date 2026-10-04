import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

router.route('/')
  .post(createBooking)
  .get(getBookings);

router.route('/:id')
  .get(getBookingById)
  .patch(updateBookingStatus)
  .delete(deleteBooking);

export default router;
