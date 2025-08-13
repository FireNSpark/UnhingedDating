// public/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- Minimal config (yours) ---
const firebaseConfig = {
  apiKey: "AIzaSyC4K7iCqvxTo6Gj5oIPsErF_vMDlhi0znE",
  authDomain: "unhinged-8c6da.firebaseapp.com",
  projectId: "unhinged-8c6da",
  storageBucket: "unhinged-8c6da.appspot.com",
  messagingSenderId: "248472796860",
  appId: "1:248472796860:web:1d7488b03935ae64f5dab9"
  // NOTE: measurementId intentionally removed to avoid analytics issues on mobile
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence (wrapped, no top-level await)
(async () => {
  try { await setPersistence(auth, browserLocalPersistence); }
  catch (_) { /* ignore */ }
})();
