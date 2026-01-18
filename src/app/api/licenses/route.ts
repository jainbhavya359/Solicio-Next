import connect from "@/src/dbConfig/dbConnection";
import License from "@/src/models/LicensesModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const license = await License.create({
      email: body.email,
      licenseName: body.licenseName,
      licenseCategory: body.licenseCategory,
      issuingAuthority: body.issuingAuthority,
      licenseNumber: body.licenseNumber,
      issueDate: body.issueDate,
      expiryDate: body.expiryDate,
      renewalRequired: body.renewalRequired,
      renewalFrequency: body.renewalFrequency,
      remarks: body.remarks,
    });

    return NextResponse.json({
      success: true,
      license,
    });
  } catch (error) {
    console.error("Create license error:", error);
    return NextResponse.json(
      { error: "Failed to create license" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const licenses = await License.find({ email }).sort({
      expiryDate: 1,
    });

    return NextResponse.json(licenses);
  } catch (error) {
    console.error("Get licenses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch licenses" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "License ID is required" },
        { status: 400 }
      );
    }

    const deleted = await License.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "License not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "License deleted successfully",
    });
  } catch (error) {
    console.error("Delete license error:", error);
    return NextResponse.json(
      { error: "Failed to delete license" },
      { status: 500 }
    );
  }
}

