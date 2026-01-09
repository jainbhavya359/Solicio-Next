import { NextResponse, NextRequest } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { auth, signOut } from "@/src/utils/auth";

connect();

export async function GET(){
    try{
        const response = NextResponse.json({
            message: "Logged Out Successfully",
            success: true
        });

        const session = await auth();
        if(session?.user){
            await signOut();
            return response;
        }


        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;

    }catch(error: any){
        return NextResponse.json({error: error.message},{status: 500})
    }
}