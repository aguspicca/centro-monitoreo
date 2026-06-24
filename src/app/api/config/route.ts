import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url: clientUrl, email: clientEmail, token: clientToken } = await request.json();

    const url = process.env.JIRA_URL || clientUrl;
    const email = process.env.JIRA_EMAIL || clientEmail;
    const token = process.env.JIRA_API_TOKEN || clientToken;

    const credentials = Buffer.from(`${email}:${token}`).toString("base64");
    const baseUrl = url.replace(/\/$/, "");

    const response = await fetch(`${baseUrl}/rest/api/2/myself`, {
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Auth failed: ${response.status}` });
    }

    const user = await response.json();
    return NextResponse.json({ success: true, user: user.displayName });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
