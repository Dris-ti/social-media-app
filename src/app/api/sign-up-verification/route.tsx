import dbConnect from "@/lib/dbConnect";
import { UserModel } from '@/model/db'

export async function POST(req: Request) {
    await dbConnect();

    const { email, code } = await req.json();

    const verfiedUser = await UserModel.findOne({
        email,
        isVerified: true
    })

    if (verfiedUser) {
        console.error("Registration Failed.");
        return Response.json({
            success: false,
            message: "Registration Failed"
        },
            {
                status: 500
            })
    }
    const unverifiedUser = await UserModel.findOne({
        email,
        isVerified: false
    })

    if (!unverifiedUser) {
        console.error("User not found. Try again.");
        return Response.json({
            success: false,
            message: "User not found. Try again."
        },
            {
                status: 500
            })
    }
    else {
        if (unverifiedUser.verifyCode == code) {
            unverifiedUser.isVerified = true;
            unverifiedUser.verifyCode = 0;
            unverifiedUser.verifyCodeExpiry = undefined; // Remove expiry
            // await UserModel.collection.dropIndex("verifyCodeExpiry_1"); // Remove TTL
            await unverifiedUser.save();
            console.error("Registration Completed successfully.");
            return Response.json({
                success: true,
                message: "Registration completed successfully"
            },
                {
                    status: 201
                })
        }
        else {
            console.error("Registration code didn't match.");
            return Response.json({
                success: false,
                message: "Registration code didn't match"
            },
                {
                    status: 500
                })
        }
    }






}
