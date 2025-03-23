import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Add a type for the request with user
type RequestWithUser = Request & { 
  user?: { 
    id: string 
  } 
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            message: "Unauthorized: No token provided"
        });
        return;
    }

    // Ensure token is not undefined
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            message: "Unauthorized: Invalid token format"
        });
        return;
    }
    
    try {
        // Use a type assertion for the decoded token
        const decoded = jwt.verify(token, "secret" as jwt.Secret);
        
        if (typeof decoded === 'object' && decoded !== null) {
            // Cast req to our custom type and set user
            (req as RequestWithUser).user = {
                id: (decoded as any).id
            };
            next();
        } else {
            throw new Error('Invalid token payload');
        }
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized: Invalid token"
        });
        return;
    }
};
