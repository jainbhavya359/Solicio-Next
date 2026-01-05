import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid';

export const sendEmail = async({email, emailType, userId}: any) => {
    try{
        const hashedToken = uuidv4();

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