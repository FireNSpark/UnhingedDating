// /public/js/auth.js  (pure ES module)
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

export async function doSignup(name, email, pass) {
  const { user } = await createUserWithEmailAndPassword(auth, email, pass);
  if (name) await updateProfile(user, { displayName: name });
  return user;
}

export async function doLogin(email, pass) {
  const { user } = await signInWithEmailAndPassword(auth, email, pass);
  return user;
}

export function doLogout(){ return signOut(auth); }
export function onUser(cb){ return onAuthStateChanged(auth, cb); }
