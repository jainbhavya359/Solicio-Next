import { NextResponse, NextRequest } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import User from "@/src/models/UserModel";

connect();

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        console.log(reqBody);
        const {token} = reqBody;

        const user = await User.findOne({token});

        if(!user){
            return NextResponse.json({error: "Invalid Token"}, {status: 400});
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        const savedUser = await user.save();

        return NextResponse.json({message: "User Verified Successfully", success: true, savedUser});

    }catch(error: any){
        return NextResponse.json({error: error.message},{status: 500})
    }
}