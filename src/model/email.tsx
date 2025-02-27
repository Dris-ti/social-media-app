import * as nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, body: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: body,
    };

    const res = await transporter.sendMail(mailOptions);
    return res;
}