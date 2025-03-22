import z from 'zod';

export const UserSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50)
});

export type UserSchema = z.infer<typeof UserSchema>;