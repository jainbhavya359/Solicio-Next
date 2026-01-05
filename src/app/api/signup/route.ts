import { NextResponse, NextRequest } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import User from "@/src/models/UserModel";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../../utils/mailer";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        console.log(reqBody);
        const {email, username, password} = reqBody;

        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        await sendEmail({email, emailType: "VERIFY", userid: savedUser._id});

        const tokenData = {
            id: user._id
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1h'});
        const response = NextResponse.json({
            message: "Signed Up SuccessFully",
            success: true
        },{status: 200});

        response.cookies.set("token", token,{
            httpOnly: true
        });

        return response;

    }catch(error: any){
        return NextResponse.json({error: error.message},{status: 500})
    }
}