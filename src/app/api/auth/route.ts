import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const validUser = process.env.APP_USERNAME || "admin";
    const validPass = process.env.APP_PASSWORD || "monitoreo2024";
    const gerenciaUser = process.env.GERENCIA_USERNAME || "gerencia";
    const gerenciaPass = process.env.GERENCIA_PASSWORD || "gerencia2024";
    if (username === validUser && password === validPass) {
      return NextResponse.json({ success: true, role: "admin" });
    }
    if (username === gerenciaUser && password === gerenciaPass) {
      return NextResponse.json({ success: true, role: "gerencia" });
    }
    return NextResponse.json({ success: false, error: "Usuario o contrasena incorrectos" }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
