import "server-only";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials are missing. See .env.local.example.");
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

// Keep Firebase Admin initialisation lazy. Next.js evaluates API route modules
// during `next build`; credentials should only be required when a request
// actually uses an Admin SDK service. This allows the site to build before
// production environment variables are configured in Vercel.
function lazyProxy<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_target, property, receiver) {
      return Reflect.get(factory(), property, receiver);
    },
  });
}

export const adminApp = lazyProxy<App>(getAdminApp);
export const adminAuth = lazyProxy<Auth>(() => getAuth(getAdminApp()));
export const adminDb = lazyProxy<Firestore>(() => getFirestore(getAdminApp()));
export const adminStorage = lazyProxy<Storage>(() => getStorage(getAdminApp()));
