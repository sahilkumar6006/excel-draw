import express from 'express';
import UserRouter from "./user-route";
import RoomRouter from "./room-route";

const router: express.Router = express.Router();

router.use('/user', UserRouter);
router.use('/room', RoomRouter);

export default router;
