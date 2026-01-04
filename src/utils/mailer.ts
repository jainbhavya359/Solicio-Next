import bcrypt from "bcryptjs";

const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

export const sendEmail = async({email, emailType, userId}: any) => {
    try{
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        const transport = Nodemailer.createTransport(
            MailtrapTransport({
                token: process.env.MAILTRAP_TOKEN,
            })
        );

        const mailOptions = {
            from: "Solicio@gmail.com",
            to: email,
            subject: "Hello ✔",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>` 
        }

        const info = await transport.sendEmail(mailOptions);
        return info;

    }catch(error: any){
        console.log(error);
        throw new Error(error.message);
    }    
}