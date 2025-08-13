// public/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔴 REPLACE EVERY VALUE BELOW WITH YOUR REAL FIREBASE CONFIG
// (from Firebase Console → Project Settings → General → Your apps → Web app)
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

// Guard: fail loudly if anything is missing
for (const k of ["apiKey","authDomain","projectId","appId"]) {
  if (!firebaseConfig[k] || String(firebaseConfig[k]).includes("REPLACE_ME")) {
    throw new Error(`[Firebase] Missing ${k} in firebaseConfig. Open public/js/firebase.js and fill real values.`);
  }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Helpful debug: see what app initialized with
console.log("[Firebase] Initialized:", app.options);
