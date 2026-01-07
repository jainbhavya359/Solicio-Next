import { NextResponse, NextRequest } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import User from "@/src/models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import toast from "react-hot-toast";

connect();

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        console.log(reqBody);
        const {email, password} = reqBody;

        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({error: "User not Exists"}, {status: 400});
        }

        const validatePassword = await bcrypt.compare(password, user.password);

        if(!validatePassword){
            return NextResponse.json({error: "Check Your Credentials"}, {status: 400});
        }

        const tokenData = {
            id: user._id
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1h'});
        const response = NextResponse.json({
            message: "Logged In SuccessFully",
            success: true
        });

        response.cookies.set("token", token,{
            httpOnly: true
        });

        return response;

    }catch(error: any){
        return NextResponse.json({error: error.message},{status: 500})
    }
}