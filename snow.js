/* Lightweight snow effect shared across pages */
(function(){
  function makeSnow(){
    const canvas = document.getElementById('snow');
    if(!canvas) return;
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

  // Run on next tick so pages that build DOM in scripts have time to create canvas
  requestAnimationFrame(makeSnow);
})();
