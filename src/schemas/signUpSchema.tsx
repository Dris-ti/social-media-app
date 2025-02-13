import { z } from 'zod'

export const signUpSchema = z.object({
    username: z
        .string()
        .max(30, "Username must not be more than 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),

    email: z
        .string()
        .email(),

    phone: z
        .string()
        .regex(/^[0-9]+$/),

    password: z
        .string()
        .min(6, "Password must contain 6 characters."),

    profilePic: z.string(),

    bio: z
        .string()
        .max(200, "Bio must not greater than 200 characters"),

    isPrivate: z.boolean(),

    role: z.string(),
    
    createdAt: z.date()
})