export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (!username || !password) {
      return Response.json(
        { success: false, error: "Usuario y contrasena requeridos" },
        { status: 400 }
      );
    }
    const isOperativo =
      username === process.env.APP_USERNAME &&
      password === process.env.APP_PASSWORD;
    if (isOperativo) {
      return Response.json({
        success: true,
        role: "operativo",
        user: { username, email: `${username}@company.com` },
      });
    }
    const isGerencial =
      username === process.env.GERENCIA_USERNAME &&
      password === process.env.GERENCIA_PASSWORD;
    if (isGerencial) {
      return Response.json({
        success: true,
        role: "gerencial",
        user: { username, email: `${username}@company.com` },
      });
    }
    return Response.json(
      { success: false, error: "Credenciales invalidas" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return Response.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
