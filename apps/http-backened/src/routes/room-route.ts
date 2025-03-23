import express from 'express';
import { createRoom, getChat,getSlug } from "../controller/room-controller";
import { authMiddleware } from '../middleware/auth';
import { get } from 'mongoose';
const RoomRouter: express.Router = express.Router();

// Direct middleware approach
RoomRouter.post('/create', authMiddleware, createRoom);
RoomRouter.get('chats/:roomId',getChat)
RoomRouter.get('room/:slug',getSlug)

export default RoomRouter;