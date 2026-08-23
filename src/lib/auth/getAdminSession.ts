import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export type AdminSession = { uid: string; email: string; picture?: string; name?: string };

export async function getAdminSession(): Promise<AdminSession | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (decoded.admin !== true) return null;
    return { uid: decoded.uid, email: decoded.email ?? "", picture: decoded.picture, name: decoded.name };
  } catch {
    return null;
  }
}
