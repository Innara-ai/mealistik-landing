// src/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Vite exposes only VITE_* at build time
const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;

function must(name: string) {
  const v = env[name];
  if (!v) {
    console.error(`[ENV] Missing ${name}. Did you set it in .env.local and in your host's env?`);
  }
  return v!;
}

const firebaseConfig = {
  apiKey: must("VITE_FIREBASE_API_KEY"),
  authDomain: must("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: must("VITE_FIREBASE_PROJECT_ID"),
  appId: must("VITE_FIREBASE_APP_ID"),
  // optional
  measurementId: env["VITE_FIREBASE_MEASUREMENT_ID"],
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
