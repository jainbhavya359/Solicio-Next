import { NextResponse, NextRequest } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import User from "@/src/models/UserModel";

connect();

export async function GET(request: NextRequest){
    try{
        const token = request.nextUrl.searchParams.get("token");
        console.log(token);

        if(!token){
            return NextResponse.json({error: "Token Missing"},{status:400});
        }

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: { $gt: Date.now() }});

        if(!user){
            return NextResponse.json({error: "Invalid Token"}, {status: 400});
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        const savedUser = await user.save();

        return NextResponse.redirect(new URL("/", request.url));

    }catch(error: any){
        console.log(error)
        return NextResponse.json({error: error.message},{status: 500})
    }
}