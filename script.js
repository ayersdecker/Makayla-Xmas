// Poem lines supplied by the user
const LINES = [
  "Before the room fills with noise, there’s a pause.",
  "Every ending carries something forward.",
  "Glasses don’t rise for the past.",
  "In the moment between seconds, everything resets.",
  "Nothing changes — until it does."
];

const ornamentsEl = document.getElementById('ornaments');
const linesEl = document.getElementById('lines');
const puzzleEl = document.getElementById('puzzle');
const submitBtn = document.getElementById('submit');
const answerInput = document.getElementById('answer');
const feedback = document.getElementById('feedback');
const success = document.getElementById('success');
const attachBtn = document.getElementById('attachBtn');
const openBtn = document.getElementById('openBtn');
const attachOverlay = document.getElementById('attach-overlay');
const attachFrame = document.getElementById('attach-frame');
const attachClose = document.getElementById('attach-close');
const attachBar = document.getElementById('attach-bar');

let revealed = Array(LINES.length).fill(false);

function makeOrnaments() {
  LINES.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'orn';
    b.textContent = '★';
    b.title = `Reveal line ${i+1}`;
    b.addEventListener('click', () => reveal(i, b));
    ornamentsEl.appendChild(b);

    const p = document.createElement('div');
    p.className = 'line';
    p.id = `line-${i}`;
    p.textContent = '';
    linesEl.appendChild(p);
  });
}

function reveal(i, btn) {
  if (revealed[i]) return;
  revealed[i] = true;
  btn.style.transform = 'scale(.98)';
  const p = document.getElementById(`line-${i}`);
  p.textContent = LINES[i];
  setTimeout(()=>p.classList.add('visible'),10);

  if (revealed.every(Boolean)) {
    setTimeout(()=>puzzleEl.classList.remove('hidden'), 400);
  }
}

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') checkAnswer(); });

function checkAnswer(){
  const val = answerInput.value.trim().toUpperCase();
  // passphrase is the first letters of each line
  const pass = LINES.map(l=>l.trim()[0]).join('').toUpperCase();
  if(!val){ feedback.textContent = 'Try typing the passphrase.'; return; }
  if(val === pass){
    feedback.textContent = '';
    puzzleEl.classList.add('hidden');
    success.classList.remove('hidden');
    celebrate();
  } else {
    feedback.textContent = 'Not quite — check the first letters.';
  }
}

// small celebration: twinkle ornaments + snow intensifies
function celebrate(){
  document.querySelectorAll('.orn').forEach((o, idx)=>{
    setTimeout(()=>{ o.style.transform='scale(1.15)'; o.style.background='linear-gradient(45deg,#fffb,#ffe1)'; }, idx*120);
  });
  // confetti-like stars
  for(let i=0;i<30;i++){
    const s = document.createElement('div');
    s.textContent='✦'; s.style.position='fixed'; s.style.left = `${Math.random()*90+5}%`;
    s.style.top = `${Math.random()*40+10}%`; s.style.fontSize='18px'; s.style.opacity='0.9';
    s.style.zIndex = 3; document.body.appendChild(s);
    setTimeout(()=>s.remove(), 4200);
  }
}

// Attach / Open behavior
function promptForUrl(){
  const url = prompt('Enter a URL to attach/open', 'https://example.com');
  if(!url) return null;
  try{ new URL(url); return url; } catch(e){ alert('Invalid URL'); return null; }
}

function openInNewTab(){
  const url = promptForUrl(); if(!url) return;
  window.open(url, '_blank', 'noopener');
}

function attachToPage(){
  // Navigate the current tab to the next page in this site.
  // This keeps navigation in the same tab instead of embedding or opening a new tab.
  window.location.href = 'next.html';
}

attachBtn && attachBtn.addEventListener('click', attachToPage);
openBtn && openBtn.addEventListener('click', openInNewTab);
attachClose && attachClose.addEventListener('click', ()=>{ attachOverlay.classList.add('hidden'); attachOverlay.setAttribute('aria-hidden','true'); attachFrame.src='about:blank'; });

// make overlay draggable by the bar
(function makeDraggable(){
  let isDown=false, startX=0, startY=0, startLeft=0, startTop=0;
  if(!attachBar) return;
  attachBar.addEventListener('pointerdown', (e)=>{
    isDown=true; attachBar.setPointerCapture(e.pointerId);
    const rect = attachOverlay.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY; startLeft = rect.left; startTop = rect.top;
  });
  window.addEventListener('pointermove', (e)=>{
    if(!isDown) return;
    const dx = e.clientX - startX; const dy = e.clientY - startY;
    attachOverlay.style.right = 'auto';
    attachOverlay.style.left = Math.max(6, startLeft + dx) + 'px';
    attachOverlay.style.top = Math.max(6, startTop + dy) + 'px';
  });
  window.addEventListener('pointerup', ()=>{ isDown=false; });
})();

/* Snow animation on canvas */
function makeSnow(){
  const canvas = document.getElementById('snow');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth; let h = canvas.height = innerHeight;
  window.addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; });
  const flakes = Array.from({length:120}, ()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*3+1,d:Math.random()*1.5}));
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='rgba(255,255,255,0.85)';
    flakes.forEach(f=>{ ctx.beginPath(); ctx.moveTo(f.x,f.y); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill(); });
    update();
    requestAnimationFrame(draw);
  }
  let t=0;
  function update(){
    t+=0.01;
    flakes.forEach(f=>{
      f.y += Math.cos(t+f.d) + 0.5 + f.r/2;
      f.x += Math.sin(t) * 0.5;
      if(f.y>h+10){ f.y = -10; f.x = Math.random()*w; }
    });
  }
  draw();
}

makeOrnaments();
makeSnow();
