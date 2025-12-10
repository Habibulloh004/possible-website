import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setAdminSession } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Укажите логин и пароль." },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Неверный логин или пароль." },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Неверный логин или пароль." },
        { status: 401 }
      );
    }

    // Set session
    await setAdminSession({
      id: admin.id,
      username: admin.username,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ошибка входа. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
