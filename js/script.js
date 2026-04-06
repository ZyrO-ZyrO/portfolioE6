/* ============================================================
   PORTFOLIO — Script v5 · Cosmic Duo
   ============================================================ */

/* ── Curseur + traînée ── */
const curDot = document.createElement('div'); curDot.className = 'cur-dot'; document.body.appendChild(curDot);
const curRing = document.createElement('div'); curRing.className = 'cur-ring'; document.body.appendChild(curRing);
const TRAIL = 10; const trailDots = [];
for(let i=0;i<TRAIL;i++){const d=document.createElement('div');d.className='cur-trail';document.body.appendChild(d);trailDots.push({el:d})}
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
const hist=Array.from({length:TRAIL*3},()=>({x:mx,y:my}));
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
const lerp=(a,b,t)=>a+(b-a)*t;
(function tick(){
  curDot.style.cssText=`left:${mx}px;top:${my}px`;
  rx=lerp(rx,mx,.14); ry=lerp(ry,my,.14);
  curRing.style.cssText=`left:${rx}px;top:${ry}px`;
  hist.unshift({x:mx,y:my}); if(hist.length>TRAIL*3)hist.pop();
  trailDots.forEach((d,i)=>{
    const p=hist[Math.min(i*3+3,hist.length-1)];
    const s=1-i/TRAIL; const op=s*.55; const sz=5*s;
    const h=185+i*4;
    d.el.style.cssText=`left:${p.x}px;top:${p.y}px;opacity:${op};width:${sz}px;height:${sz}px;background:hsl(${h},88%,62%);box-shadow:0 0 ${6*s}px hsl(${h},88%,62%)`;
  });
  requestAnimationFrame(tick);
})();
document.addEventListener('mouseleave',()=>{curDot.style.opacity='0';curRing.style.opacity='0';trailDots.forEach(d=>d.el.style.opacity='0')});
document.addEventListener('mouseenter',()=>{curDot.style.opacity='1';curRing.style.opacity='1'});

/* ── Progress bar ── */
const prog=document.getElementById('scroll-progress');
const updateProg=()=>prog.style.width=(window.scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%';
window.addEventListener('scroll',updateProg,{passive:true});

/* ── Étoiles animées ── */
const canvas=document.getElementById('stars-canvas');
const ctx=canvas.getContext('2d');
let stars=[];
const resize=()=>{canvas.width=innerWidth;canvas.height=innerHeight};
const mkStars=()=>{
  stars=[];
  const n=Math.floor(canvas.width*canvas.height/7200);
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2,r=Math.random()*1.5+.2;
    const sp=(.08+Math.random()*.18)*(.4+r*.3);
    stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,ph:Math.random()*Math.PI*2,sp:Math.random()*.007+.002,warm:Math.random()>.6,op:Math.random()*.55+.1});
  }
};
let t=0;
(function drawS(){
  ctx.clearRect(0,0,canvas.width,canvas.height); t+=.016;
  stars.forEach(s=>{
    s.x+=s.vx; s.y+=s.vy;
    const m=s.r+2;
    if(s.x<-m)s.x=canvas.width+m; if(s.x>canvas.width+m)s.x=-m;
    if(s.y<-m)s.y=canvas.height+m; if(s.y>canvas.height+m)s.y=-m;
    const op=s.op*(.45+.55*Math.sin(t*s.sp*60+s.ph));
    if(s.r>1.2){ctx.shadowColor=s.warm?'rgba(34,211,238,.7)':'rgba(240,171,252,.5)';ctx.shadowBlur=s.r*3}
    else ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=s.warm?`rgba(103,232,249,${op})`:`rgba(240,171,252,${op})`;
    ctx.fill(); ctx.shadowBlur=0;
  });
  requestAnimationFrame(drawS);
})();
resize(); mkStars();
window.addEventListener('resize',()=>{resize();mkStars()},{passive:true});

/* ── Parallaxe blobs ── */
const b1=document.querySelector('.blob-1'),b2=document.querySelector('.blob-2'),b3=document.querySelector('.blob-3');
let tnx=0,tny=0,cnx=0,cny=0;
document.addEventListener('mousemove',e=>{tnx=(e.clientX/innerWidth-.5)*2;tny=(e.clientY/innerHeight-.5)*2});
(function animBlob(){
  cnx=lerp(cnx,tnx,.035); cny=lerp(cny,tny,.035);
  if(b1)b1.style.transform=`translate(${cnx*28}px,${cny*18}px)`;
  if(b2)b2.style.transform=`translate(${-cnx*22}px,${-cny*14}px)`;
  if(b3)b3.style.transform=`translate(${cnx*12}px,${cny*10}px) translate(-50%,-50%)`;
  requestAnimationFrame(animBlob);
})();

/* ── Typewriter ── */
const phrases=['étudiant BTS SIO · Option SLAM','développeur web passionné','créateur de solutions logicielles','futur développeur full-stack'];
const tw=document.getElementById('tw-text');
if(tw){
  let pi=0,ci=0,del=false,pause=0;
  const tick=()=>{
    if(pause>0){pause--;setTimeout(tick,60);return}
    const cur=phrases[pi];
    if(!del){tw.textContent=cur.slice(0,++ci);if(ci===cur.length){del=true;pause=38}setTimeout(tick,75)}
    else{tw.textContent=cur.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;pause=7}setTimeout(tick,38)}
  };
  setTimeout(tick,1400);
}

/* ── Glitch data-text ── */
const hl=document.querySelector('.hero-highlight');
if(hl)hl.setAttribute('data-text',hl.textContent.trim());

/* ── Orbes flottants ── */
const orb_cols=['rgba(6,182,212,.1)','rgba(34,211,238,.07)','rgba(232,121,249,.07)','rgba(8,145,178,.09)'];
const spawnOrb=()=>{
  const o=document.createElement('div'); o.className='floating-orb';
  const sz=30+Math.random()*80,dur=18+Math.random()*20;
  o.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;position:fixed;border-radius:50%;filter:blur(${sz*.3}px);pointer-events:none;z-index:0;opacity:0;background:radial-gradient(circle,${orb_cols[Math.floor(Math.random()*orb_cols.length)]},transparent 70%);animation:orbFloat ${dur}s ${Math.random()*5}s linear forwards`;
  if(!document.getElementById('orb-kf')){
    const s=document.createElement('style');s.id='orb-kf';
    s.textContent='@keyframes orbFloat{0%{transform:translateY(110vh) scale(0);opacity:0}5%{opacity:1;transform:translateY(100vh) scale(1)}95%{opacity:.5}100%{transform:translateY(-10vh) scale(.8);opacity:0}}';
    document.head.appendChild(s);
  }
  document.body.appendChild(o);
  setTimeout(()=>o.remove(),(dur+6)*1000);
};
for(let i=0;i<4;i++)spawnOrb();
setInterval(spawnOrb,4000);

/* ── Particules au clic ── */
document.addEventListener('click',e=>{
  for(let i=0;i<12;i++){
    const p=document.createElement('div'); p.className='click-particle';
    const a=(i/12)*Math.PI*2,d=40+Math.random()*40;
    const h=i%2===0?185+Math.random()*15:300+Math.random()*20;
    const sz=3+Math.random()*4;
    p.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;background:hsl(${h},90%,65%);box-shadow:0 0 ${sz*2}px hsl(${h},90%,65%);--tx:${Math.cos(a)*d}px;--ty:${Math.sin(a)*d}px`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),650);
  }
});

/* ── Boutons magnétiques ── */
setTimeout(()=>{
  document.querySelectorAll('.btn-primary,.btn-ghost').forEach(btn=>{
    const w=document.createElement('div');
    w.style.cssText='display:inline-block;transition:transform .3s cubic-bezier(.34,1.56,.64,1)';
    btn.parentNode.insertBefore(w,btn); w.appendChild(btn);
    w.addEventListener('mousemove',e=>{
      const r=w.getBoundingClientRect();
      w.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.3}px,${(e.clientY-r.top-r.height/2)*.3}px)`;
    });
    w.addEventListener('mouseleave',()=>w.style.transform='');
  });
},400);

/* ── Count-up stats ── */
const countUp=(el,target,dur=1500)=>{
  const start=performance.now(),suf=el.dataset.suffix||'';
  const run=now=>{
    const p=Math.min((now-start)/dur,1);
    el.textContent=Math.floor(p*target)+suf;
    if(p<1)requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
};
const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.querySelectorAll('.stat-num[data-target]').forEach(n=>countUp(n,+n.dataset.target));
      statsObs.unobserve(en.target);
    }
  });
},{threshold:.5});
const statsEl=document.querySelector('.hero-stats');
if(statsEl)statsObs.observe(statsEl);

/* ── Nav pill ── */
const navbar=document.getElementById('navbar');
const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.nav-links a, .nav-mobile a');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',scrollY>30);
  updateProg();
  let cur='';
  sections.forEach(s=>{if(scrollY>=s.offsetTop-130)cur=s.id});
  navLinks.forEach(l=>{const h=l.getAttribute('href').replace('#','');l.classList.toggle('active',h===cur)});
},{passive:true});

/* ── Burger mobile ── */
const burger=document.getElementById('burger');
let mobileNav=null;
burger.addEventListener('click',()=>{
  if(!mobileNav){
    mobileNav=document.createElement('div');
    mobileNav.className='nav-mobile';
    const ul=document.createElement('ul');
    ['accueil','formation','experience','projets','competences','certifications','veille','contact'].forEach(id=>{
      const li=document.createElement('li');
      li.innerHTML=`<a href="#${id}" style="cursor:pointer">${id.charAt(0).toUpperCase()+id.slice(1)}</a>`;
      ul.appendChild(li);
    });
    mobileNav.appendChild(ul);
    document.body.appendChild(mobileNav);
    ul.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');burger.classList.remove('open')}));
  }
  const open=mobileNav.classList.toggle('open');
  burger.classList.toggle('open',open);
});

/* ── Reveal ── */
const revObs=new IntersectionObserver(entries=>{
  entries.forEach((en,i)=>{
    if(en.isIntersecting){setTimeout(()=>en.target.classList.add('visible'),(i%4)*90);revObs.unobserve(en.target)}
  });
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

/* ── Timeline ── */
const tlObs=new IntersectionObserver(entries=>{
  entries.forEach((en,i)=>{
    if(en.isIntersecting){
      setTimeout(()=>{
        en.target.classList.add('visible');
        // Force via style aussi au cas où
        en.target.style.opacity='1';
        en.target.style.transform='translateX(0)';
      },i*140);
      tlObs.unobserve(en.target);
    }
  });
},{threshold:.05,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.timeline-entry').forEach(el=>{
  el.style.cssText='opacity:0;transform:translateX(-14px);transition:opacity .55s ease,transform .55s ease';
  tlObs.observe(el);
});

/* ── Parallaxe 3D cards ── */
document.querySelectorAll('.glass-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.cssText+=`;transform:perspective(900px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-3px);transition:transform .08s ease,border-color .3s,background .3s`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='';
    card.style.transition='transform .5s ease,border-color .3s,background .3s';
  });
});

/* ── Carrousel certifications ── */
const slides=document.querySelectorAll('.certif-slide');
const dotsWrap=document.getElementById('certif-dots');
let cur=0;
if(slides.length){
  slides.forEach((_,i)=>{
    const d=document.createElement('div'); d.className='certif-dot'+(i===0?' active':'');
    d.addEventListener('click',()=>goTo(i));
    dotsWrap.appendChild(d);
  });
  const goTo=n=>{
    slides[cur].classList.remove('active'); cur=(n+slides.length)%slides.length;
    slides[cur].classList.add('active');
    document.querySelectorAll('.certif-dot').forEach((d,i)=>d.classList.toggle('active',i===cur));
  };
  document.getElementById('certif-prev').addEventListener('click',()=>goTo(cur-1));
  document.getElementById('certif-next').addEventListener('click',()=>goTo(cur+1));
}

/* ── Modal sources ── */
window.openSourcesModal=()=>{document.getElementById('sources-modal').classList.add('open')};
window.closeSourcesModal=()=>{document.getElementById('sources-modal').classList.remove('open')};
document.getElementById('sources-modal').addEventListener('click',e=>{if(e.target.id==='sources-modal')closeSourcesModal()});

/* ── Email copiable ── */
window.copyEmail = () => {
  const email    = document.getElementById('email-value').textContent.trim();
  const btn      = document.getElementById('copy-btn');
  const lbl      = document.getElementById('copy-label');
  const icon     = document.getElementById('copy-icon');

  navigator.clipboard.writeText(email).then(() => {
    // Feedback visuel
    btn.classList.add('copied');
    lbl.textContent = 'Copié !';
    icon.innerHTML = '<polyline points="20,6 9,17 4,12"/>'; // check icon

    // Particules au niveau du bouton
    const card = document.getElementById('email-card');
    const rect  = card.getBoundingClientRect();
    for(let i=0;i<8;i++){
      const p=document.createElement('div');p.className='click-particle';
      const a=(i/8)*Math.PI*2,d=25+Math.random()*20;
      const h=i%2===0?185:300;const sz=2+Math.random()*3;
      p.style.cssText=`left:${rect.right-40}px;top:${rect.top+rect.height/2}px;width:${sz}px;height:${sz}px;background:hsl(${h},90%,65%);box-shadow:0 0 ${sz*2}px hsl(${h},90%,65%);--tx:${Math.cos(a)*d}px;--ty:${Math.sin(a)*d}px`;
      document.body.appendChild(p);setTimeout(()=>p.remove(),650);
    }

    // Reset après 2.5s
    setTimeout(() => {
      btn.classList.remove('copied');
      lbl.textContent = 'Copier';
      icon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>';
    }, 2500);
  }).catch(() => {
    // Fallback si clipboard non disponible
    lbl.textContent = 'Erreur';
    setTimeout(() => { lbl.textContent = 'Copier'; }, 2000);
  });
};


/* ══════════════════════════════════════════════════════════
   MODAL IMAGE CERTIF
══════════════════════════════════════════════════════════ */
const certifModal     = document.getElementById('certif-modal');
const certifModalImg  = document.getElementById('certif-modal-img');
const certifModalPH   = document.getElementById('certif-modal-placeholder');
const certifModalTitle = document.getElementById('certif-modal-title');

function openCertifModal(imgSrc, name) {
  certifModalTitle.textContent = name || 'Certification';
  certifModalImg.src = imgSrc;
  certifModalImg.alt = name || 'Certification';

  // Afficher l'image si elle charge, sinon placeholder
  certifModalImg.style.display = 'none';
  certifModalPH.style.display  = 'block';

  certifModalImg.onload = () => {
    certifModalImg.style.display = 'block';
    certifModalPH.style.display  = 'none';
  };
  certifModalImg.onerror = () => {
    certifModalImg.style.display = 'none';
    certifModalPH.style.display  = 'block';
  };

  certifModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.closeCertifModal = () => {
  certifModal.classList.remove('open');
  document.body.style.overflow = '';
};

// Clic sur l'overlay pour fermer
certifModal.addEventListener('click', e => {
  if (e.target === certifModal) closeCertifModal();
});

// Touche Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCertifModal();
    closeSourcesModal();
  }
});

// Délégation de clic sur tous les certif-clickable (même ajoutés dynamiquement)
document.addEventListener('click', e => {
  const circle = e.target.closest('.certif-clickable');
  if (circle) {
    const imgSrc = circle.dataset.certifImg;
    const name   = circle.dataset.certifName;
    openCertifModal(imgSrc, name);
  }
});

function revealAndCopyEmail() {
  const emailEl = document.getElementById('email-value');
  const copyLabel = document.getElementById('copy-label');
  
  // Reconstitue le mail à partir des attributs data pour contrer les bots
  const user = emailEl.getAttribute('data-user');
  const domain = emailEl.getAttribute('data-domain');
  const realEmail = user + '@' + domain;

  // Révèle le mail à l'écran
  emailEl.textContent = realEmail;

  // Copie le mail dans le presse-papier
  navigator.clipboard.writeText(realEmail).then(() => {
    copyLabel.textContent = 'Copié !';
    
    // Remet le texte "Copier" après 2 secondes
    setTimeout(() => {
      copyLabel.textContent = 'Copier';
    }, 2000);
  }).catch(err => {
    console.error('Erreur lors de la copie :', err);
  });
}