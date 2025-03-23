import { z } from "zod";

export const CreateUserSchema = z.object({
    password: z.string(),
    email: z.string().email(),
    name: z.string(),
    phone: z.string().optional(),
    photo: z.string().optional()
})

export const SigninSchema = z.object({
    password: z.string(),
    email: z.string().email(),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
})
