import dbConnect from "@/lib/dbConnect";
import {UserModel} from '@/model/db'
import { sendEmail } from "@/model/email";
import bcrypt from 'bcrypt';


async function sendVerifyCodeEmail(email: string, code: string)
{
    const html = `
                <h1>Verify code for Registering in App</h1>
                <p>Your registration code is: ${code}</p>

                <p>If you did not request this, please ignore this email.</p>
                <p>This code will expire in ${process.env.EMAIL_REG_VERIFYCODE_EXPIRY}.</p>
            `;

            return await sendEmail(email, 'Verify your account', html);
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const {username, email, phone, password, profilePic, bio, isPrivate, role, createdAt} = await req.json()

        const findUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(findUserByUsername)
        {
            return Response.json({
                success: false,
                message: "Username already exits. Use a dfferent username"
            },
            {
                status: 500
            })
        }

        const findUserByEmail = await UserModel.findOne({
            email,
            isVerified: true
        })

        if(findUserByEmail)
        {
            return Response.json({
                success: false,
                message: "Email already exits. Use a dfferent email"
            },
            {
                status: 500
            })
        }

        const code = Math.floor(100000 + Math.random() * 999999).toString();
        const expiry = new Date(); // expiry stores an object from new Date(). That's why it can be modified later.
        expiry.setHours(expiry.getMinutes() + 3)
        const hassedPass = (await bcrypt.hash(password, 10)).toString()

        const signupData = new UserModel({
            username,
            email,
            phone,
            password: hassedPass,
            verifyCode: code,
            verifyCodeExpiry: expiry,
            isVerified: false
        })

        await signupData.save();

        const isEmailSend = await sendVerifyCodeEmail(email, code);
        console.log("An email has sent to " + isEmailSend.accepted);
        return Response.json(
            {
                success: true,
                message: "An email has sent to " + isEmailSend.accepted
            },
            {
                status: 201
            }
        )      
    } catch (error) {
        console.error("Error registering User", error);

        return Response.json({
            success: false,
            message: "Error registering User"
        },
        {
            status: 500
        })
    }
}
