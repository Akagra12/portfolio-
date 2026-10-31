// Cursor Glow
const cg = document.getElementById('cursorGlow');
if (cg) {
  document.addEventListener('mousemove', e => {
    cg.style.left = e.clientX + 'px';
    cg.style.top = e.clientY + 'px';
  });
}

// Particles
const cv = document.getElementById('particleCanvas');
if (cv) {
  const cx = cv.getContext('2d');
  let pts = [];
  function rz() { cv.width = innerWidth; cv.height = innerHeight; }
  rz();
  addEventListener('resize', rz);
  class P {
    constructor() { this.r(); }
    r() {
      this.x = Math.random() * cv.width;
      this.y = Math.random() * cv.height;
      this.s = Math.random() * 1.2 + 0.3;
      this.sx = (Math.random() - 0.5) * 0.25;
      this.sy = (Math.random() - 0.5) * 0.25;
      this.o = Math.random() * 0.3 + 0.06;
    }
    u() {
      this.x += this.sx;
      this.y += this.sy;
      if (this.x < 0 || this.x > cv.width || this.y < 0 || this.y > cv.height) this.r();
    }
    d() {
      cx.beginPath();
      cx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
      cx.fillStyle = `rgba(0,229,255,${this.o})`;
      cx.fill();
    }
  }
  for (let i = 0; i < 40; i++) pts.push(new P());
  (function a() {
    cx.clearRect(0, 0, cv.width, cv.height);
    pts.forEach(p => { p.u(); p.d(); });
    requestAnimationFrame(a);
  })();
}

// Navbar
const nb = document.getElementById('navbar');
if (nb) {
  addEventListener('scroll', () => nb.classList.toggle('scrolled', scrollY > 50));
}

// Mobile menu
const nt=document.getElementById('navToggle'),mm=document.getElementById('mobileMenu');
if(nt&&mm){nt.addEventListener('click',()=>{nt.classList.toggle('active');mm.classList.toggle('active');document.body.style.overflow=mm.classList.contains('active')?'hidden':''});
document.querySelectorAll('.mobile-link').forEach(l=>l.addEventListener('click',()=>{nt.classList.remove('active');mm.classList.remove('active');document.body.style.overflow=''}));}

// 3D Tilt
document.querySelectorAll('[data-tilt]').forEach(card=>{
  const inner=card.querySelector('.card-3d-inner')||card;
  card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;
    inner.style.transform=`rotateY(${x*10}deg) rotateX(${-y*10}deg) translateZ(8px)`;});
  card.addEventListener('mouseleave',()=>{inner.style.transform='rotateY(0) rotateX(0) translateZ(0)'});
});

// Scroll animations
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('[data-animate]').forEach(el=>{const d=el.dataset.delay||0;el.style.transitionDelay=d*.15+'s';obs.observe(el)});

// Counter animation
const statsObs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){
  entry.target.querySelectorAll('[data-count]').forEach(c=>{const t=+c.dataset.count;const dur=1200;const st=performance.now();
    (function u(now){const p=Math.min((now-st)/dur,1);c.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(u)})(performance.now())});
  statsObs.unobserve(entry.target)}})},{threshold:.5});
document.querySelectorAll('.stats-row,.hero-stats').forEach(el=>statsObs.observe(el));

// Toggle buttons (Projects page)
document.querySelectorAll('.toggle-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const card=btn.closest('.work-card');
    card.querySelectorAll('.toggle-btn').forEach(b=>b.classList.remove('active'));
    card.querySelectorAll('.toggle-content').forEach(c=>c.classList.add('hidden'));
    btn.classList.add('active');
    const target=document.getElementById(btn.dataset.target);
    if(target)target.classList.remove('hidden');
  });
});

// Filter pills (Credentials page)
document.querySelectorAll('.filter-pills .pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;
    document.querySelectorAll('.cred-entry-card, .cred-entry').forEach(entry => {
      entry.style.display = (filter === 'all' || entry.dataset.category === filter) ? 'flex' : 'none';
    });
  });
});

// Skill tabs (Skills page)
document.querySelectorAll('.skill-tabs .skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.skill-tabs .skill-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    document.querySelectorAll('.skills-catalog-grid .skill-catalog-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'flex' : 'none';
    });
    // Fallback if legacy skill-panel exists
    document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + cat);
    if (panel) panel.classList.add('active');
  });
});

// 3D Globe (Skills page) — wireframe sphere with rotation
const globeEl=document.getElementById('globeCanvas');
if(globeEl){
  const gc=globeEl.getContext('2d');
  let gw,gh,rotY=0,rotX=0.3,mouseX=0,mouseInfluence=0;
  function resizeGlobe(){
    gw=globeEl.parentElement.offsetWidth;gh=600;
    globeEl.width=gw*window.devicePixelRatio;globeEl.height=gh*window.devicePixelRatio;
    globeEl.style.width=gw+'px';globeEl.style.height=gh+'px';globeEl.style.left='0';globeEl.style.transform='none';
    gc.scale(window.devicePixelRatio,window.devicePixelRatio);
  }
  resizeGlobe();addEventListener('resize',()=>{gc.setTransform(1,0,0,1,0,0);resizeGlobe()});
  
  // Mouse interaction
  globeEl.parentElement.addEventListener('mousemove',e=>{
    const rect=globeEl.parentElement.getBoundingClientRect();
    mouseX=(e.clientX-rect.left)/rect.width-0.5;
    mouseInfluence=0.5;
  });
  globeEl.parentElement.addEventListener('mouseleave',()=>{mouseInfluence=0});
  
  function project(lat,lon,cx2,cy2,r){
    const cosLat=Math.cos(lat);
    const x3d=cosLat*Math.sin(lon+rotY);
    const y3d=Math.sin(lat)*Math.cos(rotX)-cosLat*Math.cos(lon+rotY)*Math.sin(rotX);
    const z3d=Math.sin(lat)*Math.sin(rotX)+cosLat*Math.cos(lon+rotY)*Math.cos(rotX);
    return {x:cx2+x3d*r,y:cy2-y3d*r,z:z3d};
  }
  
  function drawGlobe(){
    gc.setTransform(window.devicePixelRatio,0,0,window.devicePixelRatio,0,0);
    gc.clearRect(0,0,gw,gh);
    const cx2=gw/2,cy2=gh/2,r=Math.min(gw,gh)*0.4;
    
    // Outer glow
    const grd=gc.createRadialGradient(cx2,cy2,r*0.2,cx2,cy2,r*1.3);
    grd.addColorStop(0,'rgba(0,229,255,0.06)');grd.addColorStop(0.5,'rgba(0,229,255,0.02)');grd.addColorStop(1,'transparent');
    gc.fillStyle=grd;gc.beginPath();gc.arc(cx2,cy2,r*1.3,0,Math.PI*2);gc.fill();
    
    const steps=50;
    // Longitude lines (meridians)
    for(let i=0;i<18;i++){
      const lon=i*Math.PI/9;
      gc.beginPath();
      let started=false;
      for(let j=0;j<=steps;j++){
        const lat=Math.PI*j/steps-Math.PI/2;
        const p=project(lat,lon,cx2,cy2,r);
        const alpha=0.04+Math.max(0,p.z)*0.12;
        if(!started){gc.moveTo(p.x,p.y);started=true;gc.strokeStyle=`rgba(0,229,255,${alpha})`}
        else gc.lineTo(p.x,p.y);
      }
      gc.lineWidth=0.6;gc.stroke();
    }
    
    // Latitude lines (parallels)
    for(let i=1;i<9;i++){
      const lat=Math.PI*i/9-Math.PI/2;
      gc.beginPath();
      let started=false;
      for(let j=0;j<=steps;j++){
        const lon=Math.PI*2*j/steps;
        const p=project(lat,lon,cx2,cy2,r);
        const alpha=0.04+Math.max(0,p.z)*0.12;
        if(!started){gc.moveTo(p.x,p.y);started=true;gc.strokeStyle=`rgba(0,229,255,${alpha})`}
        else gc.lineTo(p.x,p.y);
      }
      gc.lineWidth=0.6;gc.stroke();
    }
    
    // Grid dots at intersections
    for(let i=0;i<18;i++){
      const lon=i*Math.PI/9;
      for(let j=1;j<9;j++){
        const lat=Math.PI*j/9-Math.PI/2;
        const p=project(lat,lon,cx2,cy2,r);
        if(p.z>-0.1){
          const alpha=0.1+Math.max(0,p.z)*0.4;
          const sz=0.8+Math.max(0,p.z)*1.2;
          gc.beginPath();gc.arc(p.x,p.y,sz,0,Math.PI*2);
          gc.fillStyle=`rgba(0,229,255,${alpha})`;gc.fill();
        }
      }
    }
    
    // Center glow dot
    const cg2=gc.createRadialGradient(cx2,cy2,0,cx2,cy2,12);
    cg2.addColorStop(0,'rgba(0,229,255,0.6)');cg2.addColorStop(0.5,'rgba(0,229,255,0.15)');cg2.addColorStop(1,'transparent');
    gc.fillStyle=cg2;gc.beginPath();gc.arc(cx2,cy2,12,0,Math.PI*2);gc.fill();
    gc.beginPath();gc.arc(cx2,cy2,3,0,Math.PI*2);gc.fillStyle='rgba(0,229,255,0.8)';gc.fill();
    
    // Rotation
    rotY+=0.004+mouseInfluence*mouseX*0.01;
    mouseInfluence*=0.95;
    requestAnimationFrame(drawGlobe);
  }
  drawGlobe();
}

// Typewriter effect for Hero (Reference Image 2)
const typeEl = document.getElementById('heroTypewriter');
if (typeEl) {
  const roles = [
    "Full Stack & AI/ML Developer",
    "Backend Systems Engineer",
    "Java & Python Developer",
    "Applied Computer Vision Engineer"
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;
  function tickType() {
    const current = roles[roleIdx];
    if (isDeleting) {
      typeEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typeEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }
    let speed = isDeleting ? 35 : 75;
    if (!isDeleting && charIdx === current.length) {
      speed = 2200; // pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 350;
    }
    setTimeout(tickType, speed);
  }
  setTimeout(tickType, 800);
}

// Project Category Filtering (Phase 3)
document.querySelectorAll('.project-filters .filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.project-filters .filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;
    document.querySelectorAll('.works-grid .work-card').forEach(card => {
      const cats = card.dataset.categories ? card.dataset.categories.split(' ') : [];
      if (filter === 'all' || cats.includes(filter)) {
        card.style.display = 'flex';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Project Detail Modal (Phase 3)
const modalBackdrop = document.getElementById('projectModal');
const modalDialog = document.getElementById('modalContent');
const modalClose = document.getElementById('modalCloseBtn');
let lastFocusedElement = null;

function openProjectModal(projectId) {
  const tpl = document.getElementById('tpl-' + projectId);
  if (!tpl || !modalBackdrop || !modalDialog) return;
  lastFocusedElement = document.activeElement;
  modalDialog.innerHTML = tpl.innerHTML;
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (modalClose) {
    setTimeout(() => modalClose.focus(), 50);
  }
}

function closeProjectModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

document.querySelectorAll('.btn-detail-trigger').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openProjectModal(btn.dataset.project);
  });
});

if (modalClose) {
  modalClose.addEventListener('click', closeProjectModal);
}

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeProjectModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (!modalBackdrop || !modalBackdrop.classList.contains('open')) return;

  if (e.key === 'Escape') {
    closeProjectModal();
    return;
  }

  // Focus trap for accessibility
  if (e.key === 'Tab') {
    const focusable = modalBackdrop.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
});
