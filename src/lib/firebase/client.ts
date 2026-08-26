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

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let firebaseStorage: FirebaseStorage | null = null;

function getFirebase() {
  if (typeof window === "undefined") throw new Error("Firebase is only available in the browser.");
  if (auth && firestore && firebaseStorage && firebaseApp) return { firebaseApp, auth, db: firestore, storage: firebaseStorage };

  const missing = Object.entries(firebaseConfig).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) throw new Error(`Firebase is not configured on this deployment. Missing: ${missing.join(", ")}`);

  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
  firebaseStorage = getStorage(firebaseApp);
  return { firebaseApp, auth, db: firestore, storage: firebaseStorage };
}

// Lazy proxies keep server rendering/build-time imports safe while exposing the
// db/storage names expected by the admin pages. The real Firebase instances are
// created only in the browser when a Firestore/Storage operation is performed.
export const db = new Proxy({} as Firestore, {
  get(_target, property) {
    return (getFirebase().db as any)[property];
  },
});

export const storage = new Proxy({} as FirebaseStorage, {
  get(_target, property) {
    return (getFirebase().storage as any)[property];
  },
});

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle() {
  const { auth } = getFirebase();
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
  if (typeof window !== "undefined" && auth) await firebaseSignOut(auth);
}
