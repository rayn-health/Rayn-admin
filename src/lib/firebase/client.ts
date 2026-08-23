"use client";

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase browser services must never be initialized while Next.js is
// prerendering on Vercel. Doing so makes a missing NEXT_PUBLIC_* value look
// like an auth/invalid-api-key build error. The real services are created
// when the client bundle runs in the browser.
const isBrowser = typeof window !== "undefined";

export const firebaseApp = (
  isBrowser
    ? getApps().length
      ? getApp()
      : initializeApp(firebaseConfig)
    : null
) as FirebaseApp;

export const auth = (isBrowser ? getAuth(firebaseApp) : null) as Auth;
export const db = (isBrowser ? getFirestore(firebaseApp) : null) as Firestore;
export const storage = (isBrowser ? getStorage(firebaseApp) : null) as FirebaseStorage;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle() {
  if (!isBrowser || !auth) {
    throw new Error("Google sign-in is only available in the browser.");
  }

  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    await firebaseSignOut(auth);
    throw new Error(body.error || "Not authorised for admin access.");
  }
  return result.user;
}

export async function signOutAdmin() {
  await fetch("/api/auth/logout", { method: "POST" });
  if (isBrowser && auth) {
    await firebaseSignOut(auth);
  }
}
