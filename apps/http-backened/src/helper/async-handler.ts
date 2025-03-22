import { NextFunction, Request, Response } from "express"

export const asyncHandler = (callback: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Promise.resolve(callback(req, res, next))          
        } catch (error) {
            next(error)
        }
    }   
}