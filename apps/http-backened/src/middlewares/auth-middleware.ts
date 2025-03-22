import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config/config";
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token){
            return next(new Error('Unauthorized'));
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return next(new Error('Unauthorized'));
        }
    
}



