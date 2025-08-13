// public/js/profile.js
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const $ = (id)=>document.getElementById(id);
const statusEl = $("status"), nameEl = $("displayName"), emailEl = $("email");

function msg(t, ok=false){
  if(statusEl){ statusEl.textContent=t; statusEl.className = ok ? "ok" : "warn"; }
}

onAuthStateChanged(auth, (u)=>{
  if(!u){
    msg("You’re signed out.");
    $("profileBox") && ($("profileBox").style.display = "none");
    return;
  }
  $("profileBox") && ($("profileBox").style.display = "block");
  emailEl && (emailEl.textContent = u.email || "—");
  nameEl && (nameEl.value = u.displayName || "");
  msg("Loaded.", true);
});

$("logout")?.addEventListener("click", async ()=>{
  try{
    await signOut(auth);
    location.replace("./auth.html");
  }catch(e){ msg("Couldn’t sign out."); }
});

$("save")?.addEventListener("click", async ()=>{
  const u = auth.currentUser;
  if(!u) return;
  try{
    await updateProfile(u, { displayName: nameEl.value.trim() });
    msg("Saved.", true);
  }catch(e){ msg("Couldn’t save."); }
});

$("deleteAcct")?.addEventListener("click", async ()=>{
  const u = auth.currentUser;
  if(!u) return;
  if(!confirm("Delete your account? This cannot be undone.")) return;
  try{
    await deleteUser(u);
    location.replace("./auth.html");
  }catch(e){ msg("Couldn’t delete (re-auth may be required)."); }
});
