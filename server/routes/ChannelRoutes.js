import express from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { createChannel, getUserChannels } from '../controllers/ChannelControllers.js';

const router = express.Router();

router.post("/create-channel", verifyToken, createChannel);
router.get("/get-user-channels", verifyToken, getUserChannels);

export default router;