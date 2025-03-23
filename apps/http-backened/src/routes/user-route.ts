import express from 'express';
import { signUp, signIn } from "../controller/user-controler";
const UserRouter: express.Router = express.Router();

UserRouter.post('/sign-up', (req, res, next) => signUp(req, res, next));  
UserRouter.post('/sign-in', (req, res, next) => signIn(req, res, next));

export default UserRouter;
