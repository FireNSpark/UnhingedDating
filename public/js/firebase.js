// public/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Show banner on screen
function showDebug(msg) {
  let el = document.getElementById("debugBanner");
  if (!el) {
    el = document.createElement("div");
    el.id = "debugBanner";
    el.style.cssText = "position:fixed;top:0;left:0;right:0;background:#111;color:#fff;padding:4px 8px;z-index:9999;font:12px monospace";
    document.body.prepend(el);
  }
  el.textContent = msg;
}

showDebug("[firebase.js] loading");

const firebaseConfig = {
  apiKey: "AIzaSyC4K7iCqvxTo6Gj5oIPsErF_vMDlhi0znE",
  authDomain: "unhinged-8c6da.firebaseapp.com",
  projectId: "unhinged-8c6da",
  storageBucket: "unhinged-8c6da.appspot.com",
  messagingSenderId: "248472796860",
  appId: "1:248472796860:web:1d7488b03935ae64f5dab9",
  measurementId: "G-QEEY24M17T"
};

// guard check
for (const k of ["apiKey","authDomain","projectId","appId"]) {
  if (!firebaseConfig[k]) throw new Error(`[Firebase] Missing ${k} in firebaseConfig`);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => showDebug("[firebase.js] persistence: local"))
  .catch(err => showDebug("[firebase.js] persistence error: " + (err?.message || err)));

try { getAnalytics(app); } catch (_) {}
showDebug("[firebase.js] loaded");
