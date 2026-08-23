import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken || typeof idToken !== "string") return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    if (decoded.admin !== true) return NextResponse.json({ error: "This Google account is not authorised for admin access." }, { status: 403 });
    if (!decoded.email_verified) return NextResponse.json({ error: "Email not verified." }, { status: 403 });
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
    const response = NextResponse.json({ ok: true, email: decoded.email });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_MAX_AGE_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Session creation failed:", err);
    return NextResponse.json({ error: "Could not verify sign-in. Please try again." }, { status: 401 });
  }
}
