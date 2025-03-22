import { NextFunction, Request, Response } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction, statusCode: number = 500) => {
    res.status(statusCode).json({ message: err.message });
    next();
}   

export default errorHandler
