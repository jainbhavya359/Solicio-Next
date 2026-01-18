import connect from "@/src/dbConfig/dbConnection";
import Loan from "@/src/models/LoanModel";
import { calculateEMI } from "@/src/utils/emiCal";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json([], { status: 200 });
  }

  const loans = await Loan.find({ email }).lean();
  const today = new Date();

  const enriched = loans.map((loan) => {
    let nextDueDate = loan.nextDueDate;

    if (!nextDueDate) {
      nextDueDate = new Date(loan.firstEmIDate);
    }

    const diffDays = Math.ceil(
      (new Date(nextDueDate).getTime() - today.getTime()) / 86400000
    );

    let status = loan.status;
    if (loan.status === "active" && diffDays < 0) {
      status = "overdue";
    }

    return {
      ...loan,
      nextDueDate,
      daysLeft: diffDays,
      emiPreview: loan.emiAmount,
      status,
    };
  });

  return NextResponse.json(enriched);
}


export async function POST(req: NextRequest) {
  const body = await req.json();

  const tenureMonths =
    body.tenureUnit === "years" ? body.tenure * 12 : body.tenure;

  const { emi, totalPayable, totalInterest } = calculateEMI({
    principal: body.principalAmount,
    annualRate: body.interestRate,
    tenureMonths,
  });

  const loan = await Loan.create({
    ...body,
    emiAmount: emi,
    totalPayable,
    totalInterest,
    nextDueDate: body.firstEmIDate,
  });

  return NextResponse.json({ success: true, loan });
}
