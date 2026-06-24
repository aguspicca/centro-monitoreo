import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { jql, url: clientUrl, email: clientEmail, token: clientToken } = await request.json();

    // Usar credenciales del servidor si están configuradas, sino usar las del cliente
    const url = process.env.JIRA_URL || clientUrl;
    const email = process.env.JIRA_EMAIL || clientEmail;
    const token = process.env.JIRA_API_TOKEN || clientToken;

    if (!url || !email || !token || !jql) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const credentials = Buffer.from(`${email}:${token}`).toString("base64");
    const baseUrl = url.replace(/\/$/, "");

    const params = new URLSearchParams({
      jql,
      maxResults: "200",
      fields: "summary,status,assignee,duedate,created,priority",
    });

    const response = await fetch(`${baseUrl}/rest/api/3/search/jql?${params}`, {
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.errorMessages?.[0] || `Jira error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
