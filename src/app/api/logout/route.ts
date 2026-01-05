import { NextResponse, NextRequest } from "next/server";
import connect from "@/src/dbConfig/dbConnection";

connect();

export async function GET(){
    try{
        const response = NextResponse.json({
            message: "Logged Out Successfully",
            success: true
        });

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;

    }catch(error: any){
        return NextResponse.json({error: error.message},{status: 500})
    }
}