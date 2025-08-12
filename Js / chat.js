// Fallback chat: localStorage + BroadcastChannel (same device/browser tabs)
const roomSel = document.getElementById('room');
const handle  = document.getElementById('handle');
const enter   = document.getElementById('enter');
const status  = document.getElementById('status');
const feed    = document.getElementById('feed');
const text    = document.getElementById('text');
const sendBtn = document.getElementById('send');

let room = 'lobby';
let name = '';
const chan = new BroadcastChannel('unhinged_chat');

function key(r){ return `uh_chat_${r}`; }
function load(r){ return JSON.parse(localStorage.getItem(key(r))||'[]'); }
function save(r,arr){ localStorage.setItem(key(r), JSON.stringify(arr)); }
function timeFmt(ts){ return new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }

function render(r){
  feed.innerHTML = '';
  load(r).slice(-200).forEach(m=>{
    const mine = m.user===name;
    const div = document.createElement('div');
    div.className = 'msg';
    div.innerHTML = `
      <div class="${mine?'me':'other'}"><strong>${m.user}</strong> — ${m.text}</div>
      <div class="meta">${timeFmt(m.ts)}</div>
    `;
    feed.appendChild(div);
  });
  feed.scrollTop = feed.scrollHeight;
}

function post(textVal){
  const msg = { user:name, text:textVal.slice(0,500), ts:Date.now(), room };
  const arr = load(room); arr.push(msg); save(room, arr);
  render(room);
  chan.postMessage({ type:'new', room });
}

enter.addEventListener('click', ()=>{
  name = (handle.value||'').trim();
  if(!name){ alert('Enter your name.'); return; }
  status.textContent = `Connected as ${name}`;
  text.disabled = false; sendBtn.disabled = false;
  render(roomSel.value);
});

roomSel.addEventListener('change', e=>{
  room = e.target.value;
  if(!name) return;
  render(room);
});

sendBtn.addEventListener('click', ()=>{
  const v = text.value.trim(); if(!v) return;
  text.value = ''; post(v);
});
text.addEventListener('keydown', e=>{ if(e.key==='Enter') sendBtn.click(); });

chan.onmessage = (evt)=>{
  if(evt.data?.type==='new' && evt.data.room===room){ render(room); }
};
