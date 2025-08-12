<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>UNHINGED — Red Flags</title>
<style>
  :root{--red:#E11D2A} *{box-sizing:border-box}
  body{margin:0;background:#0f0f12;color:#fff;font:500 16px/1.5 Inter,system-ui}
  .wrap{max-width:1100px;margin:0 auto;padding:18px}
  a{color:#fff;text-decoration:none} .pill{padding:8px 12px;background:#1a1b22;border:1px solid rgba(255,255,255,.08);border-radius:999px}
  h1{margin:6px 0 2px;font-size:26px;font-weight:900} .sub{color:#cfd0de}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:14px}
  .card{background:#15161b;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px}
  .flag{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:999px;background:#2a1c1f;border:1px solid rgba(255,255,255,.08);font-weight:800}
  .emoji{font-size:14px} .level{margin-left:auto;color:#ffcdd2}
  .desc{color:#cfd0de;font-size:14px;margin-top:6px}
</style></head><body>
<div class="wrap">
  <div><a class="pill" href="index.html">← Home</a></div>
  <h1>Red Flags</h1><div class="sub">We don’t hide them — we track them. Reduce them by behaving better.</div>
  <div class="grid" id="list"></div>
</div>
<script>
const flags=[
 {name:'Serial Ghosting', level:'High', desc:'Repeatedly vanishes without a word.'},
 {name:'Double Booking', level:'High', desc:'Schedules overlapping dates.'},
 {name:'Reply Roulette', level:'Mid',  desc:'Inconsistent response time (days).'},
 {name:'Financial Chaos', level:'Mid',  desc:'Cancels over money then flexes later.'},
 {name:'Ex Orbiting',     level:'Mid',  desc:'Keeps the ex in the chat.'},
 {name:'Chronic Tardiness',level:'Low', desc:'Late >15 min more than twice.'},
 {name:'Plan Drifter',    level:'Low',  desc:'Always “down for whatever,” decides never.'},
 {name:'Love Bomb → Fade',level:'High', desc:'Overhype then disappear.'},
 {name:'Boundary Blurrer',level:'Mid',  desc:'Pushy about comfort zones.'},
 {name:'Stories Missing', level:'Low',  desc:'Vague or shifting details.'},
];
const lvlEmoji=l=>l==='High'?'🚩🚩🚩':(l==='Mid'?'🚩🚩':'🚩');
const root=document.getElementById('list');
root.innerHTML=flags.map(f=>`
  <div class="card">
    <div class="flag"><span class="emoji">${lvlEmoji(f.level)}</span>${f.name}<span class="level">${f.level}</span></div>
    <div class="desc">${f.desc}</div>
  </div>
`).join('');
</script>
</body></html>
