import dbConnect from "@/lib/dbConnect";
import { UserModel } from '@/model/db'

export async function POST(req: Request) {
    await dbConnect();

    try{
        const { email, code } = await req.json();

        const user = await UserModel.findOne({
            email
        })

        if(!user)
        {
            console.error("User not found.");
            return Response.json({
                success: false,
                message: "User not found. Try again."
            },
            {
                status: 500
            })
        }

        const isCodeValid = user.verifyCode == code;
        const isCodeNotExpired = user.verifyCodeExpiry ? new Date(user.verifyCodeExpiry) > new Date() : false;

        if(isCodeValid && isCodeNotExpired)
        {
            user.isVerified = true;
            user.verifyCode = 0;
            user.verifyCodeExpiry = undefined; // Remove expiry
            await user.save();
            console.log("Registration Completed successfully.");
            return Response.json({
                success: true,
                message: "Registration completed successfully"
            },
            {
                status: 201
            })
        }
        else if(!isCodeValid)
        {
            console.error("Registration code didn't match.");
            return Response.json({
                success: false,
                message: "Registration code didn't match"
            },
            {
                status: 500
            })
        }
        else{
            await UserModel.deleteOne({ _id: user._id });
            console.error("Registration code expired.");
            return Response.json({
                success: false,
                message: "Registration code expired"
            },
            {
                status: 500
            })
        }

    }
    catch(error)
    {
        console.error("Error verifing user. + error");
        return Response.json({
            success: false,
            message: "Error verifing user. Try again."
        },
            {
                status: 500
            })
    }
}
