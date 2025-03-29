import { CreateRoomSchema } from "@repo/common/types";
import { NextFunction, Request, Response } from "express"
import {prismaClient} from "@repo/db/client";

// Add a type for the request with user
type RequestWithUser = Request & { 
  user?: { 
    id: string 
  } 
};

export const createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log("Request body:", req.body);
        
        const parsedData = CreateRoomSchema.safeParse(req.body);
        if (!parsedData.success) {
            next(new Error(parsedData.error.message));
            return;
        }
        
        const userReq = req as RequestWithUser;
        if (!userReq.user) {
            res.status(401).json({
                message: "Unauthorized: User not authenticated"
            });
            return;
        }
        
        const userId = userReq.user.id;
        
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        });

        res.json({
            roomId: room.id.toString(),
            slug: room.slug
        });
    } catch (error) {
        console.error("Error creating room:", error);
        next(new Error("Failed to create room"));
    }
};


export const getChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const roomId = req.params.roomId;
   
    try {
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.error("Error getting chat:", e);
        next(new Error("Failed to get chat"));
    }
    // try {
    //     const roomId = Number(req.params.roomId);
    //     console.log(req.params.roomId);
    //     const messages = await prismaClient.chat.findMany({
    //         where: {
    //             roomId: roomId.toString()
    //         },
    //         orderBy: {
    //             id: "desc"
    //         },
    //         take: 1000
    //     });

    //     res.json({
    //         messages
    //     })
    // } catch(e) {
    //     console.log(e);
    //     res.json({
    //         messages: []
    //     })
    // }

};


export const getSlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const slug = req.params.slug;
    console.log(slug);

    const room = await prismaClient.room.findUnique({
        where: {
            slug: slug
        }
    })
    
    res.json({
        roomId: room?.id.toString(),
        slug: room?.slug
    })
}