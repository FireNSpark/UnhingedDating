<!-- /public/auth.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>UNHINGED — Sign In</title>
  <link rel="stylesheet" href="./style.css" />
  <style>
    body{background:#0f0f12;color:#fff;font:500 16px/1.5 Inter,system-ui}
    .wrap{max-width:520px;margin:0 auto;padding:28px}
    h1{font-size:36px;margin:12px 0 18px}
    .card{background:#15161b;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px}
    label{display:block;margin:10px 0 6px;color:#e8e8e8;font-size:14px}
    input{width:100%;background:#0c0c0c;border:1px solid #2a2a2a;color:#fff;padding:14px;border-radius:12px;outline:none}
    input:focus{border-color:#F6C31C;box-shadow:0 0 0 3px #f6c31c33}
    .row{display:flex;gap:10px;align-items:center;margin-top:12px}
    .btn{padding:12px 14px;border-radius:12px;border:0;font-weight:800;cursor:pointer}
    .primary{background:#E11D2A;color:#fff}
    .ghost{background:#23242e;color:#fff;border:1px solid rgba(255,255,255,.08)}
    .link{color:#cfd0de;text-decoration:none}
    .link:hover{text-decoration:underline}
    #msg{margin-top:10px;color:#bdbdcc}
    .ok{color:#7CFF7C} .warn{color:#F6C31C}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Sign in to Unhinged</h1>
    <div class="card">
      <form id="authForm">
        <label>Email</label>
        <input id="email" type="email" autocomplete="email" required />
        <label>Password</label>
        <input id="password" type="password" autocomplete="current-password" required />
        <div class="row">
          <button id="signin"  class="btn ghost"   type="button">Sign In</button>
          <button id="signup"  class="btn primary" type="button">Create account</button>
          <a id="forgot" class="link" href="#">Forgot?</a>
        </div>
        <div id="msg">Ready.</div>
      </form>
    </div>
  </div>

  <script type="module">
    // Use your initialized Firebase app/auth from /public/js/firebase.js
    import { auth } from "./js/firebase.js";
    import {
      onAuthStateChanged,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      sendPasswordResetEmail,
      updateProfile
    } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

    const emailEl = document.getElementById("email");
    const passEl  = document.getElementById("password");
    const msg     = document.getElementById("msg");
    const signin  = document.getElementById("signin");
    const signup  = document.getElementById("signup");
    const forgot  = document.getElementById("forgot");

    // If already signed in, go straight to profile
    onAuthStateChanged(auth, (user) => {
      if (user) go("/profile.html");
    });

    function ui(status, cls="") {
      msg.className = cls;
      msg.textContent = status;
    }

    async function doSignIn() {
      ui("Signing in…");
      try {
        await signInWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
        go("/profile.html");
      } catch (e) {
        ui(clean(e), "warn");
      }
    }

    async function doSignUp() {
      ui("Creating account…");
      try {
        const cred = await createUserWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
        // Optional: set a display name based on the email before redirect
        const nameGuess = emailEl.value.split("@")[0];
        try { await updateProfile(cred.user, { displayName: nameGuess }); } catch {}
        go("/profile.html");
      } catch (e) {
        ui(clean(e), "warn");
      }
    }

    async function doForgot(ev) {
      ev.preventDefault();
      ui("Sending reset link…");
      try {
        await sendPasswordResetEmail(auth, emailEl.value.trim());
        ui("Reset link sent. Check your inbox.", "ok");
      } catch (e) {
        ui(clean(e), "warn");
      }
    }

    function go(path) {
      // robust redirect (works on previews/subpaths)
      location.assign(new URL(path, location).href);
    }

    function clean(err) {
      const m = (err && (err.message || String(err))) || "Something went wrong";
      return m.replace(/^Firebase:\s*/i, "");
    }

    signin.addEventListener("click", doSignIn);
    signup.addEventListener("click", doSignUp);
    forgot.addEventListener("click", doForgot);
  </script>
</body>
</html>
