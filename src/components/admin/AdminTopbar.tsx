"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOutAdmin } from "@/lib/firebase/client";
export function AdminTopbar({ email, picture }: { email: string; picture?: string }) { const [signingOut,setSigningOut]=useState(false); const router=useRouter(); async function handleSignOut(){setSigningOut(true);try{await signOutAdmin();router.push("/login");router.refresh();}finally{setSigningOut(false);}} return <header className="flex items-center justify-between border-b border-ink-800 bg-ink-900/60 px-4 md:px-8 py-3"><p className="text-sm text-ink-400 truncate">Signed in as <span className="text-ink-200">{email}</span></p><div className="flex items-center gap-3">{picture&&<img src={picture} alt="" width={28} height={28} className="rounded-full border border-ink-700"/>}<button onClick={handleSignOut} disabled={signingOut} className="text-xs text-ink-400 hover:text-rose">{signingOut?"Signing out…":"Sign out"}</button></div></header>; }
