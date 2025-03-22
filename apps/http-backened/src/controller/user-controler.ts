import { asyncHandler } from "../helper/async-handler";
import { NextFunction, Request, Response } from "express"
import { UserModel } from "../models/user-model";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/config";

const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return next(new Error('Invalid name, email or password'));
    }

    

    const user = await UserModel.findOne({email});

    if(user){
        return next(new Error('User already exists'));
    }

    const newUser = await UserModel.create({name, email, password});

    res.json({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
    })
})

const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const {email, password} = req.body;

   if(!email || !password){
    return next(new Error('Invalid email or password'));
   } 

   const user = await UserModel.findOne({email});

   if(!user){
    return next(new Error('User not found'));
   }

   if(user.password !== password){
    return next(new Error('Invalid password'));
   }

   const hashtoken = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: '1h'});


   res.json({
    id: user._id,
    name: user.name,
    email: user.email

   })
})



export const UserController = {
    signUp,
    signIn,
    
}