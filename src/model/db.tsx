import mongoose, { Schema, Document } from "mongoose";
import { boolean, number } from "zod";

// ----------------- USER ---------------------------

export interface User extends Document {
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

const UserSchema: Schema<User> = new Schema(
    {
        username: {
            type: String, 
            required: true, 
            unique: true
        },
        email: { 
            type: String, 
            required: true, 
            unique: true },
        phone: { 
            type: String, 
            match: /^[0-9]+$/ },
        password: { 
            type: String, 
            required: true },
        profilePic: { 
            type: String, 
            default: "" },
        bio: { 
            type: String, 
            default: "" },
        isPrivate: { 
            type: Boolean, 
            default: false },
        role: { 
            type: String, 
            enum: ["user", "moderator", "admin"], 
            default: "user" },
        verifyCode:{
            type: Number
        },
        verifyCodeExpiry:{
            type: Date
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        createdAt:{
            type: Date,
            default: Date.now(),
        },
        updatedAt:{
            type: Date
        }

    }
);

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

// ----------------- POST ---------------------------

export interface Post extends Document {
    userId: mongoose.Types.ObjectId;
    content: string;
    mediaUrl?: string;
    createdAt: Date;
    updatedAt?: Date;
}

const PostSchema: Schema<Post> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        mediaUrl: { type: String, default: "" },
    },
    { timestamps: true }
);

export const PostModel = (mongoose.models.Post as mongoose.Model<Post>) || mongoose.model<Post>("Post", PostSchema);
// ----------------- COMMENT ---------------------------

export interface Comment extends Document {
    postId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
}

const CommentSchema: Schema<Comment> = new Schema(
    {
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

export const CommentModel = (mongoose.models.Comment as mongoose.Model<Comment>) || mongoose.model<Comment>("Comment", CommentSchema);

// ----------------- LIKE ---------------------------

export interface Like extends Document {
    postId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const LikeSchema: Schema<Like> = new Schema(
    {
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const LikeModel = (mongoose.models.Like as mongoose.Model<Like>) || mongoose.model<Like>("Like", LikeSchema);

// ----------------- FOLLOWER ---------------------------

export interface Follower extends Document {
    // Alice follows Bob
    followerId: mongoose.Types.ObjectId; // Alice
    followingId: mongoose.Types.ObjectId; // Bob 
    createdAt: Date;
}

const FollowerSchema: Schema<Follower> = new Schema(
    {
        followerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        followingId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const FollowerModel = (mongoose.models.Follower as mongoose.Model<Follower>) || mongoose.model<Follower>("Follower", FollowerSchema);

// ----------------- MESSAGE ---------------------------

export interface Message extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    content: string;
    isRead: boolean;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema(
    {
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", MessageSchema);

// ----------------- NOTIFICATION ---------------------------

export interface Notification extends Document {
    userId: mongoose.Types.ObjectId;
    type: "like" | "comment" | "follow" | "mention";
    relatedId: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema<Notification> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["like", "comment", "follow", "mention"], required: true },
        relatedId: { type: Schema.Types.ObjectId, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const NotificationModel = (mongoose.models.Notification as mongoose.Model<Notification>) || mongoose.model<Notification>("Notification", NotificationSchema);


// ----------------- BLOCK ---------------------------

export interface Block extends Document {
    blockerId: mongoose.Types.ObjectId;
    blockedId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const BlockSchema: Schema<Block> = new Schema(
    {
        blockerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        blockedId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const BlockModel = (mongoose.models.Block as mongoose.Model<Block>) || mongoose.model<Block>("Block", BlockSchema);
