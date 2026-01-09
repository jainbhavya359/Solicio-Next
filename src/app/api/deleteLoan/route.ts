import connect from "@/src/dbConfig/dbConnection";
import Loan from "@/src/models/LoanModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Loan ID is required" },
        { status: 400 }
      );
    }

    const deletedLoan = await Loan.findByIdAndDelete(id);

    if (!deletedLoan) {
      return NextResponse.json(
        { error: "Loan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Loan deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete loan error:", error);
    return NextResponse.json(
      { error: "Failed to delete loan" },
      { status: 500 }
    );
  }
}
