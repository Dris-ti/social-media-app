import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import bycrpt from 'bcrypt'
import dbConnect from '@/lib/dbConnect'
import { UserModel } from '@/model/db'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        email: credentials.username
                    })
                    if (!user) {
                        throw new Error('User not found')
                    }

                    if (!user.isVerified) {
                        throw new Error('Account is not verified')
                    }

                    const isPasswordCorrect = await bycrpt.compare(credentials.password, user.password)
                    if (!isPasswordCorrect) {
                        throw new Error('Password is incorrect')
                    }
                    return user;
                }
                catch (error) {
                    throw new Error('Error: ' + error)
                }
            }
        })
    ],

    callbacks:{
        async jwt({ token, user }) {
            if (user) {
                token = {...user }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {...token};
            }
            return session;
        }
    },

    pages: {
        signIn: '/sign-in',
    },
    
    session:{
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
}