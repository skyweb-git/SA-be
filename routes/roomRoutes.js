import express from 'express';
import {
  getRooms,
  getRoomByIdentifier,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js';
import { uploadSingleImage } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(uploadSingleImage, createRoom);

router.route('/:identifier')
  .get(getRoomByIdentifier);

router.route('/:id')
  .put(uploadSingleImage, updateRoom)
  .delete(deleteRoom);

export default router;
