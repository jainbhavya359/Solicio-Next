import connect from "@/src/dbConfig/dbConnection";
import Loan from "@/src/models/LoanModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest){
    try{
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const loans = await Loan.find({email});

        return NextResponse.json(loans);
    }catch(error){
        console.error("Loan API error:", error);
        return NextResponse.json({error: "Loan api Failed"}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try{
        const reqBody = await request.json();
        console.log(reqBody);

        const newLoan = new Loan({
            name: reqBody.name,
            email: reqBody.email,
            loan: reqBody.loanName,
            lender: reqBody.lender,
            amount: reqBody.amount,
            pan_number: reqBody.panNum,
            date: reqBody.date,
        });

        console.log(newLoan);

        const savedLoan = await newLoan.save();
        console.log(savedLoan);

        return NextResponse.json({message: "Loan Added Successfully", success: true});
    }catch(error){
        console.error("Loan API error:", error);
        return NextResponse.json({error: "Loan api Failed"}, {status: 500});
    }
}