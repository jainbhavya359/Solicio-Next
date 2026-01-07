import nodemailer from "nodemailer";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";


export const sendEmail = async({email, emailType}: any) => {
    try{
        const user = await User.findOne({email});

        const hashedToken = crypto.randomUUID();
        console.log(hashedToken);

        user.verifyToken = hashedToken;
        user.verifyTokenExpiry = Date.now() + 3600000;

        await user.save();

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });

        const mailOptions = {
            from: "Solicio@gmail.com",
            to: email,
            subject: "VERIFY EMAIL",
            html: `<p>Click <a href="${process.env.DOMAIN}/api/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/api/verifyemail?token=${hashedToken}
            </p>` 
        }

        const info = await transport.sendMail(mailOptions);
        return info;

    }catch(error: any){
        console.log("Mail error: ",error);
        throw new Error(error.message);
    }    
}