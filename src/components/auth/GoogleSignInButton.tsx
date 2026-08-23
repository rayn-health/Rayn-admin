"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase/client";
export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null); const router = useRouter(); const searchParams = useSearchParams();
  async function handleClick() { setLoading(true); setError(null); try { await signInWithGoogle(); router.push(searchParams.get("next") || "/admin"); router.refresh(); } catch (err) { setError(err instanceof Error ? err.message : "Sign-in failed."); } finally { setLoading(false); } }
  return <div className="flex flex-col items-center gap-3"><button onClick={handleClick} disabled={loading} className="flex items-center gap-3 rounded-md bg-ink-100 text-ink-950 px-5 py-3 font-medium hover:bg-white transition-colors disabled:opacity-60"><span aria-hidden="true">G</span>{loading ? "Signing in…" : "Sign in with Google"}</button>{error && <p className="text-rose text-sm max-w-xs text-center" role="alert">{error}</p>}</div>;
}
