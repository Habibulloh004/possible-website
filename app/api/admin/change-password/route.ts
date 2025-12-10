import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword, getAdminSession } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 3) {
      return NextResponse.json(
        { error: "New password must be at least 3 characters long." },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { id: session.id },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found." },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.admin.update({
      where: { id: session.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Failed to change password. Please try again." },
      { status: 500 }
    );
  }
}
