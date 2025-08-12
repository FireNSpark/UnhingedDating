<script type="module">
  import { auth } from "./firebase.js";
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

  // Sign up
  export async function doSignup(name, email, pass) {
    const { user } = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) await updateProfile(user, { displayName: name });
    return user;
  }

  // Login
  export async function doLogin(email, pass) {
    const { user } = await signInWithEmailAndPassword(auth, email, pass);
    return user;
  }

  // Logout
  export function doLogout(){ return signOut(auth); }

  // Auth watcher (use on protected pages)
  export function onUser(cb){ return onAuthStateChanged(auth, cb); }
</script>
