import { asyncHandler } from "../helper/async-handler";
import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken';
import {prismaClient} from "@repo/db/client";
import { JWT_SECRET } from "@repo/backened-common/config";
import {CreateUserSchema} from "@repo/common/types";


const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password, phone, photo} = req.body;

    CreateUserSchema.parse({name, email, password, phone, photo});
    
    if(!name || !email || !password){
        return next(new Error('Invalid name, email or password'));
    }

    

    const user = await prismaClient.user.findUnique({where: {email}});

    if(user){
        return next(new Error('User already exists'));
    }

    const newUser = await prismaClient.user.create({data: {name, email, password, phone, photo}});

    console.log(newUser);

    const hashtoken = jwt.sign({id: newUser.id}, JWT_SECRET, {expiresIn: '1h'});

    res.status(200).json({
        message: "Signup Success",
        token: hashtoken,
        user: {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id,
        }
    })
})

const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const {email, password} = req.body;

   if(!email || !password){
    return next(new Error('Invalid email or password'));
   } 

   const user = await prismaClient.user.findUnique({where: {email}});

   if(!user){
    return next(new Error('User not found'));
   }

   if(user.password !== password){
    return next(new Error('Invalid password'));
   }

   const hashtoken = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1h'});

   res.json({
    id: user.id,
    name: user.name,
    email: user.email

   })
})



export const UserController = {
    signUp,
    signIn,
    
}