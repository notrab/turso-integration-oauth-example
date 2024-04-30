import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.TURSO_CLIENT_ID;
const CLIENT_SECRET = process.env.TURSO_CLIENT_SECRET;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const cookieStore = cookies();

  const CODE = searchParams.get("code");
  const REDIRECT_URI = process.env.TURSO_REDIRECT_URI!;
  const CODE_VERIFIER = cookieStore.get("code_verifier")?.value;

  const url = `https://api.turso.tech/v1/oauth/token?grant_type=authorization_code&code=${CODE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_id=${CLIENT_ID}&code_verifier=${CODE_VERIFIER}`;

  if (CODE) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
    });

    const data = await response.json();

    cookieStore.delete("code_verifier");

    return NextResponse.redirect(
      `${origin}/?access_token=${data.access_token}`,
    );
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
