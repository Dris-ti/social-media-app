import 'next-auth'


declare module 'next-auth' {
    interface User {
        _id?: string,
        username: string;
        email: string;
        phone: string;
        password: string;
        profilePic?: string;
        bio?: string;
        isPrivate: boolean;
        role: "user" | "moderator" | "admin";
        createdAt: Date;
        updatedAt: Date;
        verifyCode?: number;
        verifyCodeExpiry?: Date;
        isVerified: boolean;

    }
}