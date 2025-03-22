import express from 'express';
import { UserController } from "../controller/user-controler";

const UserRouter: express.Router = express.Router();

UserRouter.post('/user/sign-up', UserController.signUp);  
UserRouter.post('/user/sign-in', UserController.signIn);

export default UserRouter;
