import express from 'express';
import UserRouter from "./user-route";

const router: express.Router = express.Router();

router.post('/user', UserRouter);


export default router;
