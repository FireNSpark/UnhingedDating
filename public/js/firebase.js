// public/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

console.log("[firebase.js] loading");

const firebaseConfig = {
  apiKey: "AIzaSyC4K7iCqvxTo6Gj5oIPsErF_vMDlhi0znE",
  authDomain: "unhinged-8c6da.firebaseapp.com",
  projectId: "unhinged-8c6da",
  storageBucket: "unhinged-8c6da.appspot.com",
  messagingSenderId: "248472796860",
  appId: "1:248472796860:web:1d7488b03935ae64f5dab9",
  measurementId: "G-QEEY24M17T"
};

// guard: make sure key fields exist
for (const k of ["apiKey","authDomain","projectId","appId"]) {
  if (!firebaseConfig[k]) throw new Error(`[Firebase] Missing ${k} in firebaseConfig`);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// set persistence without top-level await
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("[firebase.js] persistence: local"))
  .catch(err => console.warn("[firebase.js] persistence error:", err?.message || err));

try { getAnalytics(app); } catch (_) {}
console.log("[firebase.js] loaded");
