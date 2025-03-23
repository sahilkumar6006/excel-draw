import { asyncHandler } from "../helper/async-handler";
import { NextFunction, Request, Response } from "express";
import {CreateUserSchema, SigninSchema} from "@repo/common/types";
import {prismaClient} from "@repo/db/client";
import jwt from "jsonwebtoken";

const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        return next(new Error(parsedData.error.message));
    }

    const { email, password } = parsedData.data;

    const user = await prismaClient.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return next(new Error("User not found"));
    }

    if (user.password !== password) {
        return next(new Error("Invalid password"));
    }

    const token = jwt.sign({ id: user.id }, "secret");

    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        photo: user.photo,
        token
    });
});

const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        return next(new Error(parsedData.error.message));
    }

    const { password, email, name, phone, photo } = parsedData.data;

    const user = await prismaClient.user.create({
        data: {
            password,
            email,
            name,
            phone: phone || '',
            photo: photo || ''
        }
    })

    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        photo: user.photo
    })
});

export { signUp, signIn }
