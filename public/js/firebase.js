// public/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// ✅ Your real Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC4K7iCqvxTo6Gj5oIPsErF_vMDlhi0znE",
  authDomain: "unhinged-8c6da.firebaseapp.com",
  projectId: "unhinged-8c6da",
  storageBucket: "unhinged-8c6da.appspot.com",
  messagingSenderId: "248472796860",
  appId: "1:248472796860:web:1d7488b03935ae64f5dab9",
  measurementId: "G-QEEY24M17T"
};

// Guard: fail loudly if anything is missing
for (const k of ["apiKey", "authDomain", "projectId", "appId"]) {
  if (!firebaseConfig[k]) {
    throw new Error(`[Firebase] Missing ${k} in firebaseConfig`);
  }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Persist auth across page loads/tabs (prevents login -> bounce back)
(async () => {
  try { await setPersistence(auth, browserLocalPersistence); } catch (_) {}
})();

// Analytics can fail on http/local; that's fine
try {
  getAnalytics(app);
} catch (_) {
  // ignore analytics errors
}
