// public/js/auth.js

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { auth } from "./firebase.js";

const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const statusEl = document.getElementById('status');

const signinBtn = document.getElementById('signin');
const createBtn = document.getElementById('create');
const forgotBtn = document.getElementById('forgot');

async function doSignIn() {
  alert('doSignIn() function called'); // Debug probe
  statusEl.textContent = '';
  try {
    const userCred = await signInWithEmailAndPassword(auth, emailEl.value, passEl.value);
    statusEl.textContent = 'Logged in!';
    statusEl.className = 'ok';
    window.location.href = './profile.html';
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.className = 'warn';
  }
}

async function doCreate() {
  statusEl.textContent = '';
  try {
    const userCred = await createUserWithEmailAndPassword(auth, emailEl.value, passEl.value);
    statusEl.textContent = 'Account created!';
    statusEl.className = 'ok';
    window.location.href = './profile.html';
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.className = 'warn';
  }
}

async function doForgot() {
  statusEl.textContent = '';
  try {
    await sendPasswordResetEmail(auth, emailEl.value);
    statusEl.textContent = 'Reset email sent!';
    statusEl.className = 'ok';
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.className = 'warn';
  }
}
