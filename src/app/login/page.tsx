import dynamic from "next/dynamic";

const GoogleSignInButton = dynamic(
  () => import("@/components/auth/GoogleSignInButton").then((mod) => mod.GoogleSignInButton),
  { ssr: false, loading: () => <div className="h-12 w-48 animate-pulse rounded-md bg-ink-800" aria-hidden="true" /> }
);

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-soft mb-2">Rayn Admin</p>
        <h1 className="font-display text-3xl text-ink-100">Sign in to continue</h1>
        <p className="text-ink-500 text-sm mt-2 max-w-xs">
          Restricted to the authorised Google account and enforced by Firebase.
        </p>
      </div>
      <GoogleSignInButton />
    </main>
  );
}
