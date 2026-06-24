import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const validUser = process.env.APP_USERNAME || "admin";
    const validPass = process.env.APP_PASSWORD || "monitoreo2024";

    if (username === validUser && password === validPass) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Usuario o contraseña incorrectos" }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
