// /public/js/firebase.js  (pure ES module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyC4K7iCqvxTo6Gj5oIPsErF_vMDlhi0znE",
  authDomain: "unhinged-8c6da.firebaseapp.com",
  projectId: "unhinged-8c6da",
  storageBucket: "unhinged-8c6da.firebasestorage.app",
  messagingSenderId: "248472796860",
  appId: "1:248472796860:web:1d7488b03935ae64f5dab9",
  measurementId: "G-QEEY24M17T"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
