// Put this in /js/chat.js
import { db } from './app.firebase.js';

const roomSel = document.getElementById('room');
const handle  = document.getElementById('handle');
const enter   = document.getElementById('enter');
const status  = document.getElementById('status');
const feed    = document.getElementById('feed');
const text    = document.getElementById('text');
const sendBtn = document.getElementById('send');

let room = 'lobby';
let name = '';
let unsub = null;

// helpers
const timeFmt = ts => new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

function print(msg, mine=false) {
  const div = document.createElement('div');
  div.className = 'msg';
  div.innerHTML = `
    <div class="${mine?'me':'other'}"><strong>${msg.user}</strong> — ${msg.text}</div>
    <div class="meta">${timeFmt(msg.ts)}</div>
  `;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function system(text) {
  const div = document.createElement('div');
  div.className = 'msg sys';
  div.textContent = text;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

async function join(newRoom){
  // stop old stream
  if (unsub) { unsub(); unsub = null; }

  room = newRoom;
  feed.innerHTML = '';
  system(`Joined ${'#'+room}`);

  // live stream (newest last)
  unsub = db.collection('rooms').doc(room).collection('messages')
    .orderBy('ts', 'asc')
    .limit(200)
    .onSnapshot(snap=>{
      feed.innerHTML = '';
      snap.forEach(doc=>{
        const m = doc.data();
        print(m, m.user === name);
      });
    });
}

async function send(){
  const val = text.value.trim();
  if (!val) return;
  const doc = {
    user: name,
    text: val.slice(0, 500),
    ts: Date.now()
  };
  text.value = '';
  await db.collection('rooms').doc(room).collection('messages').add(doc);
}

enter.addEventListener('click', async ()=>{
  name = (handle.value || '').trim();
  if (!name) { alert('Enter your name.'); return; }
  status.textContent = `Connected as ${name}`;
  text.disabled = false; sendBtn.disabled = false;
  await join(roomSel.value);
});

roomSel.addEventListener('change', async e=>{
  if (!name) { room = e.target.value; return; }
  await join(e.target.value);
});

sendBtn.addEventListener('click', send);
text.addEventListener('keydown', e=>{ if(e.key==='Enter') send(); });
