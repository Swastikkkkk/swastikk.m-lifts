
/* ===== CONFIG: the only block you need to edit to make this site live ===== */
/* =====================================================================
   CONFIG · the only block you need to edit to make this site live.
   Everything below is read by both the apply form and the lap-time board.
   Step-by-step setup (the Apps Script to paste, and how to deploy it) is
   in code.gs, delivered alongside this file — it is the backend half of
   this CONFIG block, and its SECRET_KEY constant must match the one here.
   ===================================================================== */
const SL_CFG={
  /* Google Apps Script web app URL, from Deploy > New deployment in the
     Apps Script editor once code.gs is pasted in and deployed. Until this
     is set, applications are saved on the visitor's device and handed off
     over WhatsApp instead, so nothing is lost — but nothing reaches your
     inbox automatically either. */
  SCRIPT_URL:"https://script.google.com/macros/s/AKfycbyypKbENwgDzma3Cg6KFJ9v0vZ8eh-xOiNQSjmGlq-1SfJ1hyNpxtxFEY_9FqOJtAUk/exec",
  /* A shared password between this page and code.gs, so a stranger can't
     write junk rows into your sheet. Pre-filled here; code.gs carries the
     identical value — leave both as they are unless you regenerate one. */
  SECRET_KEY:"swastik-lifts-form-v1-2026",
  /* Country code + number, digits only. Every WhatsApp link on the page uses this. */
  WHATSAPP:"917384221979",
  /* Your inbox. Shown as a manual "email it instead" fallback on this page
     if the backend is unreachable, alongside the automatic email code.gs
     already sends on every successful submission. */
  EMAIL:"",
  PRICE:"\u20b9500"
};
window.SL_CFG=SL_CFG;
const SCRIPT_URL=SL_CFG.SCRIPT_URL,SECRET_KEY=SL_CFG.SECRET_KEY;
const BACKEND_ON=/^https:\/\//.test(SL_CFG.SCRIPT_URL)&&!/PASTE_/.test(SL_CFG.SCRIPT_URL);
/* one number, one place: rewrite every wa.me link from CONFIG */
addEventListener('DOMContentLoaded',()=>{try{
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{a.href=a.href.replace(/wa\.me\/\d+/,'wa.me/'+SL_CFG.WHATSAPP)});
}catch(e){}});

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
const G=!!(window.gsap&&window.ScrollTrigger)&&!REDUCE;
document.documentElement.classList.add(G?'anim':'no-anim');
if('scrollRestoration' in history)history.scrollRestoration='manual';
if(location.hash==='#apply'){history.replaceState(null,'',location.pathname+location.search);scrollTo(0,0);requestAnimationFrame(()=>scrollTo(0,0))}
lockScroll(true);
const PLATE={red:'#0a0a0a',blue:'#2a2926',yellow:'#4d4a44',green:'#7a7468',white:'#a8a194'};

let lenis=null,heroDone=false;
/* the lock must hit html as well as body: html is the scrolling element now */
function lockScroll(on){
  document.documentElement.classList.toggle('locked',!!on);
  document.body.classList.toggle('locked',!!on);
}
if(G){
  gsap.registerPlugin(ScrollTrigger);
  if(window.Lenis&&matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){lenis=new Lenis({lerp:.13});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);lenis.stop()}
  /* nav goes translucent once you leave the hero */
  {const nav=document.querySelector('.nav');let stuck=false;
   const upd=y=>{const s=(y||window.scrollY||0)>72;if(s!==stuck){stuck=s;nav.classList.toggle('stuck',s)}};
   if(lenis)lenis.on('scroll',e=>upd(e.scroll!==undefined?e.scroll:window.scrollY));
   addEventListener('scroll',()=>upd(),{passive:true});upd()}
}
$$('[data-scroll]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();lenis?lenis.scrollTo(t,{duration:1.3}):t.scrollIntoView({behavior:'smooth'})}));

/* ===== shared lego-lifter builder (used by intro + guide) ===== */
function buildLifter(){
  const grad=(()=>{const c=document.createElement('canvas');c.width=4;c.height=1;const x=c.getContext('2d');[['#7d7d7d',0],['#b4b4b4',1],['#d9d9d9',2],['#ececec',3]].forEach(([col,i])=>{x.fillStyle=col;x.fillRect(i,0,1,1)});const tx=new THREE.CanvasTexture(c);tx.minFilter=tx.magFilter=THREE.NearestFilter;return tx})();
  const M=c=>new THREE.MeshToonMaterial({color:c,gradientMap:grad});
  const OUT=new THREE.MeshBasicMaterial({color:0x14120f,side:THREE.BackSide});
  const skin=M(0xf7cd1e),ink=M(0x1b1916),hairM=M(0x241f1b),tank=M(0x2c5bd6),white=M(0xf6f4ee),red=M(0xc8302c),blue=M(0x2f4f9e),steel=M(0xb9b6b0),gold=M(0xd9b03c),shade=M(0x0d0d0f);
  const root=new THREE.Group();
  function mesh(g,m,x,y,z,p,sx=1,sy=1,sz=1,ol=.05){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);p.add(o);if(ol){const k=new THREE.Mesh(g,OUT);k.position.copy(o.position);k.scale.set(sx+ol,sy+ol,sz+ol);p.add(k);o.userData.ol=k}return o}
  const box=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const legL=new THREE.Group(),legR=new THREE.Group();legL.position.set(-.28,1.25,0);legR.position.set(.28,1.25,0);root.add(legL,legR);
  [legL,legR].forEach(l=>{mesh(box(.34,.6,.34),ink,0,-.32,0,l);mesh(box(.28,.52,.28),ink,0,-.84,0,l);mesh(box(.36,.16,.6),white,0,-1.14,.06,l);mesh(box(.39,.05,.3),red,0,-1.085,.2,l,1,1,1,.01);mesh(box(.38,.07,.62),ink,0,-1.21,.06,l)});
  const torso=new THREE.Group();torso.position.y=1.25;root.add(torso);
  mesh(box(.8,.4,.5),ink,0,.05,0,torso);
  mesh(box(.85,.5,.5),tank,0,.48,0,torso);
  mesh(box(1.05,.62,.56),tank,0,1.02,0,torso);
  /* The chest was one flat slab, which is why he read as a box with arms next to the
     reference. Pec plates and an ab column now stand proud of the vest; the outline shell
     that every mesh already carries then draws the separation for free. */
  [-1,1].forEach(s=>{const pc=mesh(box(.46,.34,.1),tank,s*.255,1.12,.30,torso,1,1,1,.02);pc.rotation.z=s*.07});
  [0,1,2].forEach(r=>[-1,1].forEach(s=>mesh(box(.2,.15,.08),tank,s*.115,.78-r*.19,.28,torso,1,1,1,.018)));
  [-1,1].forEach(s=>mesh(box(.12,.5,.09),tank,s*.4,.72,.25,torso,1,1,1,.018));   // obliques
  mesh(box(.42,.16,.58),white,0,1.3,.01,torso,1,1,1,.02);
  mesh(box(1.1,.13,.62),ink,0,.26,0,torso);
  mesh(new THREE.TorusGeometry(.32,.032,8,26,3.14),gold,0,1.56,.26,torso,1,1,1,0).rotation.x=1.3;
  mesh(new THREE.OctahedronGeometry(.09,0),gold,0,1.16,.36,torso,1,1,1,.01);
  mesh(new THREE.OctahedronGeometry(.045,0),red,0,1.16,.42,torso,1,1,1,0);
  const armL=new THREE.Group(),armR=new THREE.Group();armL.position.set(-.62,1.42,0);armR.position.set(.62,1.42,0);torso.add(armL,armR);
  [armL,armR].forEach((a,i)=>{const s=i?1:-1;
    mesh(box(.46,.42,.44),tank,0,.01,0,a);                 // delt
    mesh(box(.36,.28,.36),tank,0,-.27,0,a);                 // sleeve
    mesh(box(.36,.5,.34),skin,0,-.6,0,a);                   // upper arm
    mesh(box(.22,.3,.13),skin,0,-.56,.2,a,1,1,1,.02);       // biceps
    mesh(box(.18,.26,.12),skin,0,-.6,-.19,a,1,1,1,.02);     // triceps
    const fo=new THREE.Group();fo.position.set(0,-.86,0);a.add(fo);a.userData.fo=fo;
    mesh(box(.29,.52,.27),skin,0,-.26,0,fo);
    mesh(box(.15,.2,.11),skin,0,-.11,.16,fo,1,1,1,.02);     // brachioradialis
    mesh(box(.17,.06,.27),ink,0,-.46,0,fo);
    const hand=new THREE.Group();hand.position.set(0,-.56,.02);fo.add(hand);
    mesh(new THREE.SphereGeometry(.17,12,12),skin,0,0,0,hand);
    mesh(new THREE.TorusGeometry(.11,.05,8,10,3.6),skin,s*.02,-.05,.06,hand,1,1,1,0).rotation.y=1.57;
  });
  const head=new THREE.Group();head.position.y=1.65;torso.add(head);
  mesh(new THREE.CylinderGeometry(.23,.19,.55,14),skin,0,-.25,0,head);
  mesh(new THREE.CylinderGeometry(.4,.4,.62,22),skin,0,.31,0,head);
  mesh(new THREE.CylinderGeometry(.09,.09,.09,10),skin,0,.665,0,head,1,1,1,.015);
  const face=new THREE.Group();face.position.set(0,.31,0);head.add(face);
  [-1,1].forEach(s=>mesh(box(.09,.09,.05),ink,s*.15,.05,.375,face,1,1,1,0));
  mesh(new THREE.TorusGeometry(.13,.022,6,14,2.6),ink,0,-.14,.36,face,1,1,1,0).rotation.z=-Math.PI/2-.3;
  [-1,1].forEach(s=>mesh(box(.11,.03,.04),ink,s*.16,.16,.375,face,1,1,1,0));
  const shades=new THREE.Group();shades.position.set(0,.36,0);head.add(shades);
  mesh(box(.42,.13,.05),shade,0,0,.39,shades,1,1,1,.015);
  [-1,1].forEach(s=>{const c=mesh(new THREE.CylinderGeometry(.08,.08,.06,14),shade,s*.185,0,.39,shades,1,1,1,0);c.rotation.x=1.5708});
  const curls=new THREE.Group();head.add(curls);
  for(let i=0;i<24;i++){const a=i*2.5,r=.28+((i*7)%4)*.05,y=.57+((i*5)%4)*.06,sz=.15+((i*3)%3)*.03;
    mesh(box(sz,sz,sz),hairM,Math.cos(a)*r,y,Math.sin(a)*r*.9,curls,1,1,1,.03)}
  for(let i=0;i<8;i++){mesh(box(.16,.16,.16),hairM,-.28+i*.08,.73-Math.abs(i-3.5)*.03,.14+((i*3)%3)*.03,curls,1,1,1,.03)}
  [-1,1].forEach(s=>{for(let i=0;i<3;i++)mesh(box(.13,.13,.13),hairM,s*.4,.45-i*.13,.18+i*.03,curls,1,1,1,.03)});
  mesh(new THREE.TorusGeometry(.47,.06,8,20,Math.PI),ink,0,.37,-.03,head,1,1,1,0);
  [-1,1].forEach(s=>{
    mesh(new THREE.CylinderGeometry(.21,.21,.17,16),ink,s*.47,.37,0,head,1,1,1,0).rotation.z=1.57;
    mesh(new THREE.CylinderGeometry(.14,.14,.06,16),steel,s*.555,.37,0,head,1,1,1,0).rotation.z=1.57;
    mesh(new THREE.CylinderGeometry(.045,.045,.09,10),red,s*.6,.37,0,head,1,1,1,0).rotation.z=1.57;
  });
  const bar=new THREE.Group();root.add(bar);
  mesh(new THREE.CylinderGeometry(.045,.045,3.2,10),steel,0,0,0,bar,1,1,1,.02).rotation.z=1.57;
  [[-1.3,red,.48],[-1.17,red,.48],[-1.04,blue,.4],[1.3,red,.48],[1.17,red,.48],[1.04,blue,.4]].forEach(([x,m,r])=>{mesh(new THREE.CylinderGeometry(r,r,.11,22),m,x,0,0,bar,1,1,1,.03).rotation.z=1.57});
  bar.position.set(0,.5,.7);
  root.position.y=-2.05;root.rotation.y=.1;
  return {root,torso,armL,armR,head,face,legL,legR,bar};
}

/* ===== INTRO ===== */
const intro=$('#intro');
function endIntro(){if(intro.classList.contains('gone'))return;intro.classList.add('gone');lockScroll(false);if(lenis){lenis.start();lenis.resize()}heroIn();G&&ScrollTrigger.refresh()}
(function(){
  let seen=false;try{seen=!!sessionStorage.getItem('sl_intro');sessionStorage.setItem('sl_intro','1')}catch(e){}
  $('#skip').onclick=()=>{G?gsap.to(intro,{yPercent:-100,duration:.7,ease:'expo.inOut',onComplete:endIntro}):endIntro()};
  if(!G||seen){setTimeout(endIntro,0);return}
  const n=$('#introNum'),l=$('#introL'),flash=$('#iflash'),o={v:0,p:0};
  const L=(a,b,k)=>a+(b-a)*k;
  /* ---------------------------------------------------------------------------
     A real deadlift, not a set of hand-tuned angles.
     Everything is in metres for a 1.75 m lifter, and the pose is solved rather
     than posed: the bar path and the hip height are the only things authored.
       bar on the floor sits at plate radius (0.225 m)
       hands are ON the bar, arms stay straight (that is what a deadlift is)
         -> shoulder = hand + armLength, at a small lean
       torso length then fixes the lean from the hip height
       the legs are 2-bone IK from the hip to a planted ankle
     This is why the old version looked wrong: the arms were given a local
     rotation that compounded with the torso's, swinging them up past the head
     instead of hanging to the bar.
     --------------------------------------------------------------------------- */
  /* shX went from .215 to .250 because at the old width the biceps were geometrically
     inside the rib cage at lockout — the arms read as fused to the torso instead of hanging
     beside it. Wider shoulders also give the V-taper that makes a back look like a back. */
  const SEG={ankle:.075,shin:.43,thigh:.45,torso:.52,arm:.701,hipX:.115,shX:.187,grip:.30};
  /* He is 6'5". The rig above is proportioned at about 5'7", so the whole body sits inside a
     group scaled by BH while the barbell stays at true size outside it — a taller lifter on a
     standard bar, not a scaled-up photograph. The solver keeps working in rig-local units and
     the keyframes below are in world metres, so poseDeadlift divides by BH on the way in. */
  const BH=1.101;
  const BARR={r:.0145,half:.655,plateR:.225};
  const SMS=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
  function buildDeadlifter(){
    const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.62,metalness:0},o));
    const skin=M(0xe6b79a,{roughness:.70}),skinD=M(0xc99479,{roughness:.72}),
          suit=M(0x15161b,{roughness:.62}),
          belt=M(0x5d3c22,{roughness:.62}),buckle=M(0xb9b6b0,{roughness:.3,metalness:.8}),
          sock=M(0xf2eee6,{roughness:.86}),shoe=M(0x17171b,{roughness:.6}),sole=M(0xdedad0,{roughness:.8}),
          sleeveM=M(0x1a1b21,{roughness:.84}),hair=M(0x16120e,{roughness:.92}),
          eyeW=M(0xeee8dc,{roughness:.3}),eyeD=M(0x241a12,{roughness:.25}),
          steel=M(0xb4b1ab,{roughness:.31,metalness:.85}),knurl=M(0x8e8b86,{roughness:.66,metalness:.6}),
          hub=M(0x9c9a95,{roughness:.35,metalness:.7});
    const TAU=Math.PI*2,PI=Math.PI;
    const g=(p)=>{const o=new THREE.Group();p&&p.add(o);return o};
    const cyl=(r1,r2,h,m,p,x=0,y=0,z=0)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,16),m);
      o.position.set(x,y,z);o.castShadow=true;p.add(o);return o};
    const box=(w,h,d,m,p,x=0,y=0,z=0)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
      o.position.set(x,y,z);o.castShadow=true;p.add(o);return o};
    const sph=(r,m,p,x=0,y=0,z=0,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),m);
      o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;p.add(o);return o};

    /* ------------------------------------------------------------------
       The body is not assembled out of parts any more. Each limb and the
       torso are ONE generated surface: a grid swept along the limb axis
       whose radius is a profile curve plus a sum of smooth anatomical
       swells. A pec is a place where the skin is 2 cm further from the
       spine, not a ball resting on a barrel — so there is no seam to see,
       nothing that could be deleted without changing the body, and the
       silhouette reads as muscle before any shading happens.
       ------------------------------------------------------------------ */
    const fall=q=>{if(q>=1)return 0;const f=1-q;return f*f*(3-2*f)};   // smooth, compact support
    const dA=(a,b)=>{let d=(a-b)%TAU;if(d>PI)d-=TAU;if(d<-PI)d+=TAU;return d};
    // Catmull-Rom through (y,value) knots: profiles stay C1, so no terracing
    const crv=t0=>{const t=t0.slice().sort((a,b)=>a[0]-b[0]),n=t.length;return y=>{
      if(y<=t[0][0])return t[0][1];if(y>=t[n-1][0])return t[n-1][1];
      let i=0;while(i<n-2&&y>t[i+1][0])i++;
      const u=(y-t[i][0])/(t[i+1][0]-t[i][0]),u2=u*u,u3=u2*u,
            p0=t[Math.max(0,i-1)][1],p1=t[i][1],p2=t[i+1][1],p3=t[Math.min(n-1,i+2)][1];
      return .5*(2*p1+(p2-p0)*u+(2*p0-5*p1+4*p2-p3)*u2+(3*p1-3*p2+p3-p0)*u3)}};
    /* One closed surface. The ring loop wraps with modulo instead of a duplicated
       seam column, so shared vertices average their normals and the mesh lights as
       a single skin all the way round. */
    const shell=(nu,nv,fn,m,p,openBase)=>{
      const pos=[],idx=[],R=[];
      const put=q=>{pos.push(q[0],q[1],q[2]);return pos.length/3-1};
      let base=-1;if(!openBase)base=put(fn(0,0));
      for(let j=openBase?0:1;j<nv;j++){const r=[];for(let i=0;i<nu;i++)r.push(put(fn(i/nu,j/nv)));R.push(r)}
      const top=put(fn(0,1));
      if(!openBase)for(let i=0;i<nu;i++)idx.push(base,R[0][(i+1)%nu],R[0][i]);
      for(let j=0;j<R.length-1;j++){const A=R[j],B=R[j+1];
        for(let i=0;i<nu;i++){const k=(i+1)%nu;idx.push(A[i],A[k],B[i],A[k],B[k],B[i])}}
      const L=R[R.length-1];for(let i=0;i<nu;i++)idx.push(L[i],L[(i+1)%nu],top);
      const geo=new THREE.BufferGeometry();
      geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
      geo.setIndex(idx);geo.computeVertexNormals();
      const o=new THREE.Mesh(geo,m);o.castShadow=true;o.receiveShadow=true;p&&p.add(o);return o};
    /* a=0 faces front (+z). bump = [angle, height, angular width, height width,
       depth, diagonal skew] and is pushed along the surface normal, so it swells
       the skin rather than sitting on it. Negative depth cuts a groove — which is
       all a six-pack actually is. */
    const body=(y0,y1,W,D,Z,bumps,m,p,nu,nv,pw,noise)=>shell(nu||44,nv||60,(u,v)=>{
      const a=u*TAU,y=y0+(y1-y0)*v;
      let w=Math.max(.0006,W(y)),d=Math.max(.0006,D(y));
      const z0=Z?Z(y):0;let sa=Math.sin(a),ca=Math.cos(a);
      if(pw){sa=Math.sign(sa)*Math.pow(Math.abs(sa),pw);ca=Math.sign(ca)*Math.pow(Math.abs(ca),pw)}
      let disp=noise?noise(a,v):0;
      for(let i=0;i<bumps.length;i++){const b=bumps[i],dy=y-b[1],da=dA(a,b[0])+(b[5]||0)*dy;
        disp+=b[4]*fall((da/b[2])*(da/b[2])+(dy/b[3])*(dy/b[3]))}
      const nx=d*Math.sin(a),nz=w*Math.cos(a),nl=Math.hypot(nx,nz)||1;
      return [w*sa+disp*nx/nl,y,z0+d*ca+disp*nz/nl]},m,p);
    // swept along z instead of y: the foot runs forward, not up
    const swept=(z0,z1,Wx,Ty,By,m,p,nu=28,nv=24)=>shell(nu,nv,(u,v)=>{
      const a=u*TAU,z=z0+(z1-z0)*v,w=Math.max(.0008,Wx(z)),t=Ty(z),b=By(z);
      const sa=Math.sign(Math.sin(a))*Math.pow(Math.abs(Math.sin(a)),.62),
            ca=Math.sign(Math.cos(a))*Math.pow(Math.abs(Math.cos(a)),.62);
      return [w*sa,(t+b)/2+(t-b)/2*ca,z]},m,p);
    // a tube swept round the x axis — used for the fingers closing on the bar
    const arcTube=(cx,cy,cz,x,R,a0,a1,rf,m,p)=>shell(10,16,(u,v)=>{
      const th=u*TAU,f=a0+(a1-a0)*v,r=rf(v),sf=Math.sin(f),cf=Math.cos(f);
      const px=cx+x+r*Math.cos(th);
      return [px,cy-R*sf+r*Math.sin(th)*-sf,cz+R*cf+r*Math.sin(th)*cf]},m,p);

    const root=g(null);
    const bodyG=g(root);bodyG.scale.setScalar(BH);
    const hips=g(bodyG);

    /* ---------------- torso: one volume, hip to neck ---------------- */
    const TW=crv([[-.125,.004],[-.09,.096],[-.05,.130],[.00,.138],[.06,.134],[.12,.130],[.17,.132],
      [.23,.141],[.29,.152],[.35,.169],[.40,.178],[.45,.174],[.50,.166],[.52,.150],[.545,.112],[.565,.060],[.585,.004]]);
    const TD=crv([[-.125,.004],[-.09,.076],[-.05,.100],[.00,.105],[.06,.102],[.12,.100],[.17,.101],
      [.23,.107],[.29,.116],[.35,.125],[.40,.127],[.45,.122],[.50,.112],[.52,.100],[.545,.076],[.565,.042],[.585,.004]]);
    const TZ=crv([[-.125,0],[-.05,-.004],[.06,0],[.17,.003],[.29,.006],[.40,.005],[.50,-.004],[.585,-.010]]);
    const TB=[];
    TB.push([0,.405,.14,.075,-.013]);                 // sternum trench between the pecs
    TB.push([0,.245,.085,.145,-.009]);                // linea alba
    [.295,.235,.175].forEach(y=>TB.push([0,y,.60,.017,-.0075]));   // tendinous intersections
    TB.push([PI,.335,.11,.20,-.013]);TB.push([PI,.482,2.30,.055,.019]);                 // spinal furrow
    [-1,1].forEach(s=>{
      TB.push([s*.60,.385,.60,.062,.027]);            // pectoral, thick and square-edged
      TB.push([s*.50,.440,.50,.036,.013]);            // clavicular head
      TB.push([s*.58,.322,.56,.020,-.010]);           // the shelf under it
      [.325,.265,.205,.150].forEach((y,i)=>TB.push([s*.255,y,.235,.031,.0115-i*.001]));  // rectus, four tiers
      TB.push([s*1.02,.195,.44,.090,.015,.55]);       // external oblique, running diagonally
      TB.push([s*.62,.105,.40,.055,.010,.9]);         // inguinal ridge into the pelvis
      for(let i=0;i<3;i++)TB.push([s*.94,.345-i*.031,.155,.021,.0085]);   // serratus fingers
      TB.push([s*2.05,.355,.66,.115,.026]);           // lat, wide at the top: this is the V
      TB.push([s*2.00,.235,.42,.100,.015]);
      TB.push([s*1.92,.450,.46,.050,.016]);           // teres / rear shoulder
      TB.push([s*2.60,.470,.62,.055,.020]);TB.push([s*1.55,.505,.78,.045,.018]);           // upper trap sweeping to the acromion
      TB.push([PI-s*.55,.395,.40,.090,.013]);         // rhomboid / infraspinatus
      TB.push([PI-s*.17,.200,.17,.130,.014]);         // erector column
      TB.push([s*1.25,.030,.40,.070,.010]);           // iliac crest
    });
    const torso=g(hips);
    const trunk=body(-.125,.585,TW,TD,TZ,TB,skin,torso,56,78);
    // lifting belt, sitting on the waist the surface actually has
    const belted=body(.020,.132,crv([[.020,.128],[.045,.144],[.10,.146],[.132,.130]]),
      crv([[.020,.098],[.045,.112],[.10,.114],[.132,.100]]),TZ,[],belt,torso,36,10,.75);
    box(.056,.070,.026,buckle,torso,0,.078,.126);
    body(-.170,.086,crv([[-.170,.018],[-.13,.084],[-.09,.114],[-.05,.134],[-.01,.144],[.02,.143],[.05,.110],[.086,.004]]),
      crv([[-.170,.016],[-.13,.068],[-.09,.092],[-.05,.108],[-.01,.113],[.02,.112],[.05,.088],[.086,.004]]),TZ,[],suit,hips,34,18);

    /* ---------------- neck + head ---------------- */
    const neck=g(torso);neck.position.set(0,.515,0);
    body(-.060,.155,crv([[-.060,.004],[-.03,.062],[.01,.070],[.07,.066],[.12,.064],[.155,.004]]),
      crv([[-.060,.004],[-.03,.066],[.01,.072],[.07,.067],[.12,.064],[.155,.004]]),
      crv([[-.06,0],[.06,.002],[.155,.004]]),
      [[0,.050,.30,.045,.004],[-.55,.045,.34,.050,.006],[.55,.045,.34,.050,.006],
       [PI,.010,1.30,.060,.013]],skin,neck,32,26);
    const head=g(neck);head.position.set(0,.100,0);head.scale.setScalar(1.12);
    const HW=crv([[-.030,.004],[-.010,.026],[.012,.048],[.032,.062],[.056,.069],[.080,.073],
      [.105,.0720],[.130,.0705],[.155,.0665],[.178,.054],[.208,.004]]);
    const HD=crv([[-.030,.006],[-.010,.034],[.012,.062],[.032,.082],[.056,.090],[.080,.094],
      [.105,.0955],[.130,.0935],[.155,.0875],[.178,.070],[.208,.006]]);
    const HZ=crv([[-.030,.036],[.012,.020],[.056,.006],[.105,-.002],[.155,-.006],[.208,-.008]]);
    const HB=[
      [0,.008,.36,.024,.0095],                       // chin
      [0,.098,.125,.044,.015],[0,.0765,.135,.016,.010], // nose bridge, then the tip
      [0,.0525,.34,.010,.0050],[0,.0375,.30,.010,.0048],[0,.0450,.30,.006,-.0038], // lips + the line between
      [0,.064,.09,.013,-.0030],                      // philtrum
      [PI,.148,.95,.055,.009]                        // occiput
    ];
    [-1,1].forEach(s=>{
      HB.push([s*.95,.034,.40,.030,.0095]);          // mandible: the jaw he was missing
      HB.push([s*.30,.046,.10,.012,-.0025]);         // mouth corner
      HB.push([s*.80,.099,.34,.030,.0085]);          // cheekbone
      HB.push([s*.70,.058,.30,.032,-.0055]);         // cheek hollow under it
      HB.push([s*.42,.128,.40,.014,.0085]);          // brow ridge
      HB.push([s*.42,.108,.30,.015,-.0085]);         // eye socket
      HB.push([s*.42,.1165,.34,.007,.0045]);         // upper lid
      HB.push([s*.42,.0985,.32,.006,.0030]);         // lower lid
      HB.push([s*.97,.142,.30,.030,-.0045]);         // temple
      HB.push([s*.185,.0755,.075,.010,.0045]);       // nostril wing
    });
    body(-.030,.208,HW,HD,HZ,HB,skin,head,52,56);
    const onFace=(x,y,d)=>{const w=HW(y),k=Math.min(.999,Math.abs(x)/w);
      return HZ(y)+HD(y)*Math.sqrt(1-k*k)-(d||0)};
    [-1,1].forEach(s=>{
      sph(.0098,eyeW,head,s*.0305,.1048,.0792,1,1,.86);
      sph(.0062,eyeD,head,s*.0313,.1045,.0848,1,1,.62);
      sph(.0027,M(0x0d0906),head,s*.0315,.1045,.0872,1,1,.5);
      sph(.0128,skin,head,s*.0305,.1140,.0768,1,.62,.72);        // upper lid
      sph(.0112,skinD,head,s*.0305,.1098,.0812,1,.16,.34);       // lash line
      for(let i=0;i<4;i++){const bx=s*(.016+i*.0096),by=.1236+i*.0016;
        sph(.0054,hair,head,bx,by,onFace(bx,by,.0035),1,.60,.9)}   // brow, laid on the ridge
      const ear=sph(.020,skin,head,s*.0690,.0965,-.008,.38,1.35,.80);ear.rotation.y=s*.30;
      sph(.010,skinD,head,s*.0735,.0955,-.006,.30,1.05,.62).rotation.y=s*.30;
    });
    /* Hair: a real short crop that hugs the skull, not a pile of spheres. One open
       cap starting at a hairline that moves with the angle — high at the temples,
       low at the nape — with a little carved texture in the surface. */
    const hy=a=>.0985+.0505*Math.cos(a)+.0010*Math.cos(2*a);
    shell(48,26,(u,v)=>{
      const a=u*TAU,y0=hy(a),y=y0+(.204-y0)*Math.pow(v,.82);
      const t=.0038+.0058*Math.pow(v,.7)
              +.0030*(Math.sin(a*9+v*6.5)*.5+Math.sin(a*15-v*11)*.32+Math.sin(a*6+v*17)*.3);
      const w=HW(y)+t,d=HD(y)+t;
      return [w*Math.sin(a),y,HZ(y)+d*Math.cos(a)]},hair,head,true);

    /* ---------------- arms: deltoid to fingertips, one surface ---------------- */
    const AW=crv([[.104,.004],[.082,.042],[.055,.064],[.015,.0715],[-.030,.069],[-.080,.067],
      [-.135,.069],[-.195,.065],[-.250,.057],[-.298,.0475],[-.345,.0545],[-.400,.0565],
      [-.465,.0512],[-.535,.0415],[-.605,.0345],[-.658,.0300],[-.688,.0400],[-.708,.0360],[-.730,.004]]);
    const AD=crv([[.104,.004],[.082,.040],[.055,.060],[.015,.0660],[-.030,.064],[-.080,.063],
      [-.135,.066],[-.195,.063],[-.250,.055],[-.298,.0470],[-.345,.0528],[-.400,.0525],
      [-.465,.0470],[-.535,.0380],[-.605,.0310],[-.658,.0265],[-.688,.0280],[-.708,.0240],[-.730,.004]]);
    const AZ=crv([[.104,0],[-.135,.002],[-.298,0],[-.400,-.004],[-.535,-.009],[-.658,-.017],[-.700,-.031],[-.730,-.034]]);

    const shoulders={},arms={};
    [-1,1].forEach(s=>{const k=s<0?'L':'R';
      const sh=g(torso);sh.position.set(s*SEG.shX,SEG.torso-.02,0);shoulders[k]=sh;
      sh.rotation.z=s*.150;   // arms hang a little wide, clear of the quads
      const arm=g(sh);arms[k]=arm;
      const o=s*PI/2;   // outward
      const AB=[
        [0,.020,.95,.058,.012],[o,.030,.95,.062,.014],[PI,.012,.90,.056,.011],   // three delt heads
        [o*.62,.028,.11,.055,-.0035],[PI-o*.55,.020,.11,.052,-.0030],            // striations between them
        [0,-.055,1.30,.022,-.006],                                               // delt / biceps tie-in
        [0,-.150,.88,.088,.019],[0,-.145,.34,.052,.006],[0,-.150,.085,.075,-.0035],
        [o*.85,-.228,.36,.060,.007],                                             // brachialis
        [PI,-.190,.78,.110,.018],[PI-o*.58,-.168,.36,.080,.009],[PI,-.185,.08,.090,-.0040],
        [PI,-.300,.55,.032,.008],                                                // olecranon
        [o*.55,-.372,.46,.075,.012],[o*1.28,-.402,.50,.090,.008],[-o*.80,-.400,.60,.100,.009],
        [0,-.688,.80,.016,.004]                                                  // thenar pad
      ];
      body(-.730,.104,AW,AD,AZ,AB,skin,arm,36,74);
      // fingers closing over the bar, thumb pinned across them: a hook grip
      for(let f=0;f<4;f++)arcTube(0,-.701,0,(f-1.5)*.0232,.0262,-.62,2.30,
        v=>.0122-.0034*v-.0018*Math.abs(f-1.5),skinD,arm);
      arcTube(0,-.699,0,-s*.0395,.0285,-1.15,1.25,v=>.0125-.0030*v,skinD,arm);
    });

    /* ---------------- legs ---------------- */
    const THW=crv([[.075,.010],[.030,.084],[-.020,.101],[-.080,.105],[-.150,.101],[-.220,.094],
      [-.290,.086],[-.355,.077],[-.415,.069],[-.455,.063],[-.490,.006]]);
    const THD=crv([[.075,.010],[.030,.082],[-.020,.099],[-.080,.103],[-.150,.098],[-.220,.090],
      [-.290,.082],[-.355,.073],[-.415,.066],[-.455,.060],[-.490,.006]]);
    const SHW=crv([[.055,.008],[.015,.058],[-.030,.074],[-.085,.078],[-.140,.075],[-.200,.065],
      [-.265,.053],[-.330,.041],[-.395,.035],[-.430,.032],[-.462,.005]]);
    const SHD=crv([[.055,.008],[.015,.056],[-.030,.072],[-.085,.077],[-.140,.074],[-.200,.064],
      [-.265,.051],[-.330,.039],[-.395,.033],[-.430,.030],[-.462,.005]]);
    const legs={};
    [-1,1].forEach(s=>{const k=s<0?'L':'R',o=s*PI/2;
      const th=g(hips);th.position.set(s*SEG.hipX,0,0);
      body(-.490,.075,THW,THD,crv([[-.49,0],[-.20,.004],[.075,.002]]),[
        [0,-.205,.58,.135,.011],                       // rectus femoris
        [o*.95,-.160,.52,.150,.013],                   // vastus lateralis, high on the outside
        [-o*.82,-.352,.46,.055,.015],                  // the medialis teardrop over the knee
        [PI,-.225,.92,.160,.015],[PI,-.220,.09,.150,-.0045],   // hamstrings, split down the middle
        [-o*1.90,-.140,.56,.150,.012],                 // adductors
        [o*1.30,-.290,.16,.140,-.0050],                // IT band
        [PI,-.010,.85,.075,.013]                       // glute
      ],skin,th,40,58);
      // shorts, cut to the leg they sit on
      body(-.215,.028,crv([[-.215,.094],[-.16,.105],[-.06,.117],[.028,.112]]),
        crv([[-.215,.092],[-.16,.103],[-.06,.115],[.028,.110]]),null,[],suit,th,30,12,.8);
      const shin=g(th);shin.position.set(0,-SEG.thigh,0);
      body(-.462,.055,SHW,SHD,crv([[-.462,-.004],[-.20,-.006],[.055,-.002]]),[
        [PI-o*.45,-.120,.46,.105,.016],[PI+o*.45,-.150,.44,.100,.015],   // gastroc heads
        [PI,-.270,.80,.085,.007],                                        // soleus
        [o*.32,-.180,.36,.160,.007],                                     // tibialis
        [0,-.150,.10,.180,-.0035]                                        // the shin bone
      ],skin,shin,34,50);
      {const kn=body(-.075,.090,crv([[-.075,.062],[-.02,.075],[.04,.076],[.090,.064]]),
        crv([[-.075,.060],[-.02,.073],[.04,.074],[.090,.062]]),null,[],sleeveM,shin,26,10);kn.position.y=.004}
      cyl(.046,.050,.15,sock,shin,0,-.365,0);
      const foot=g(shin);foot.position.set(0,-SEG.shin,0);
      swept(-.092,.202,crv([[-.092,.004],[-.072,.034],[-.040,.048],[0,.055],[.060,.056],[.120,.053],[.170,.042],[.202,.004]]),
        crv([[-.092,-.062],[-.070,-.050],[.170,-.050],[.202,-.062]]),
        crv([[-.092,-.068],[-.070,-.075],[.170,-.075],[.202,-.068]]),sole,foot);
      swept(-.088,.198,crv([[-.088,.004],[-.070,.030],[-.040,.044],[0,.050],[.060,.051],[.120,.048],[.165,.038],[.198,.004]]),
        crv([[-.088,-.030],[-.070,.010],[-.040,.048],[0,.062],[.030,.042],[.075,.026],[.120,.018],[.165,.010],[.198,-.020]]),
        crv([[-.088,-.046],[-.070,-.056],[-.040,-.058],[0,-.058],[.120,-.058],[.165,-.056],[.198,-.030]]),shoe,foot);
      foot.rotation.y=s*.17;
      legs[k]={thigh:th,shin,foot};
    });
    /* ------- the bar: 20 kg power bar, 230 kg loaded, and it bends ------- */
    const bar=g(root);
    const SEGN=17,segs=[];
    for(let i=0;i<SEGN;i++){
      const x=-BARR.half+(i/(SEGN-1))*BARR.half*2;
      const m=(Math.abs(x)>.16&&Math.abs(x)<.42)?knurl:steel;   // knurl bands where the hands go
      const s=cyl(BARR.r,BARR.r,BARR.half*2/(SEGN-1)+.004,m,bar,x,0,0);
      s.rotation.z=Math.PI/2;segs.push({m:s,x});
    }
    const sleeves={};
    [-1,1].forEach(sgn=>{const k=sgn<0?'L':'R';
      /* The sleeve starts where the knurled shaft ends. It used to sit at the bar's centre,
         so the plates loaded inward from x=.04 and swallowed the hands gripping at x=.19 —
         the barbell was effectively a barrel around his wrists. Plates belong outboard. */
      const sl=g(bar);sleeves[k]=sl;sl.position.x=sgn*BARR.half;
      const shaft=cyl(.025,.025,.42,steel,sl,sgn*.21,0,0);shaft.rotation.z=Math.PI/2;
      // 3 x 25 red, 1 x 20 blue, 1 x 10 green = 105 kg a side, plus a 20 kg bar
      let off=.012;
      [[.06,0xc8302c],[.06,0xc8302c],[.06,0xc8302c],[.05,0x2f4f9e],[.035,0x3f8a56]].forEach(([t,c])=>{
        const pl=new THREE.Mesh(new THREE.CylinderGeometry(BARR.plateR,BARR.plateR,t,30),M(c,{roughness:.5}));
        pl.rotation.z=Math.PI/2;pl.position.x=sgn*(off+t/2);pl.castShadow=true;pl.receiveShadow=true;sl.add(pl);
        const h2=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,t+.006,16),hub);
        h2.rotation.z=Math.PI/2;h2.position.x=sgn*(off+t/2);sl.add(h2);
        off+=t+.004;
      });
      const col=cyl(.055,.055,.055,steel,sl,sgn*(off+.03),0,0);col.rotation.z=Math.PI/2;
    });
    return {root,hips,torso,chest:trunk,neck,head,shoulders,arms,legs,bar,segs,sleeves};
  }

  /* keyframes: only the bar path and the hip height are authored, everything
     else is solved from them. barZ stays over the mid-foot, as it must. */
  const DL=[
    /* world metres. barY starts at .225 because that is the radius of a 45 cm plate — the bar
       rests where the plates put it, whoever is lifting — and finishes at .852, which is where
       a 6'5" lifter's arms hang at lockout. */
    //  p     barY    barZ    hipY    tau
    [0.00, .225,  .0617, .7707, .135],
    [0.08, .225,  .0617, .7399, .135],
    [0.16, .225,  .0606, .7267, .132],  // slack pulled out, bar hasn't moved
    [0.23, .2399, .0606, .7355, .130],  // bar bends, plates still on the floor
    [0.30, .2937, .0584, .7773, .128],  // breaks the floor
    [0.42, .3984, .0551, .8390, .120],
    [0.55, .4914, .0496, .8940, .108],  // past the knee
    [0.66, .5965, .0418, .9425, .092],
    [0.77, .6838, .0330, .9887, .062],
    [0.87, .7797, .0253,1.0217, .020],
    [0.94, .8148, .0209,1.0344,-.030],
    [1.00, .8148, .0198,1.0349,-.042],
  ];
  function dlKeys(p){
    p=Math.max(0,Math.min(1,p));
    let i=0;while(i<DL.length-2&&p>DL[i+1][0])i++;
    const a=DL[i],b=DL[i+1],t=SMS((p-a[0])/(b[0]-a[0]||1));
    return {barY:a[1]+(b[1]-a[1])*t,barZ:a[2]+(b[2]-a[2])*t,hipY:a[3]+(b[3]-a[3])*t,tau:a[4]+(b[4]-a[4])*t};
  }
  function poseDeadlift(F,p,now){
    const k=dlKeys(p);
    // grind: the bar shudders while it is heaviest, right off the floor
    const grind=SMS((p-.20)/.09)*(1-SMS((p-.36)/.16));
    const shake=Math.sin(now*31)*.0022*grind+Math.sin(now*19)*.0014*grind;
    /* keyframes are world metres; the rig solves in its own units, so divide by BH going in
       and drive the bar (which lives outside the scaled body) with the world values. */
    const barYw=k.barY+shake,barZw=k.barZ;
    const barY=barYw/BH,barZ=barZw/BH,hipY=k.hipY/BH;
    // shoulder from the hand, because the arms are straight and on the bar
    const shY=barY+SEG.arm*Math.cos(k.tau),shZ=barZ+SEG.arm*Math.sin(k.tau);
    /* The shoulder does not sit at the top of the torso segment — it sits 2 cm below it, and
       at lockout it shrugs up and draws back. Solve the lean against where the joint actually
       is rather than against the segment length, or the hands hang a centimetre off the bar
       at the top of the lift: shY-hipY = R·cos(lean+φ) for the real shoulder offset (sly,slz). */
    const lock=SMS((p-.84)/.16);
    const sly=SEG.torso-.02+lock*.014,slz=-lock*.018;
    const slR=Math.hypot(sly,slz),slPh=Math.atan2(slz,sly);
    const lean=Math.acos(Math.max(-1,Math.min(1,(shY-hipY)/slR)))-slPh;
    const hipZ=shZ-(sly*Math.sin(lean)+slz*Math.cos(lean));
    F.hips.position.set(0,hipY,hipZ);
    F.torso.rotation.x=lean;
    // arms: local rotation has to cancel the torso's, or they swing up past the head
    const armW=Math.atan2(-(barZ-shZ),-(barY-shY));
    F.arms.L.rotation.x=F.arms.R.rotation.x=armW-lean;
    // legs: 2-bone IK, hip to a planted ankle, knee forward
    const L1=SEG.thigh,L2=SEG.shin;
    const dy=SEG.ankle-hipY,dz=-hipZ;
    let d=Math.hypot(dy,dz);d=Math.max(Math.abs(L1-L2)+.004,Math.min(L1+L2-.004,d));
    const aa=(d*d+L1*L1-L2*L2)/(2*d),hh=Math.sqrt(Math.max(0,L1*L1-aa*aa));
    const uy=dy/d,uz=dz/d;                       // hip -> ankle
    const ky=aa*uy+hh*uz,kz=aa*uz+hh*(-uy);      // knee, offset to the front
    const thA=Math.atan2(-kz,-ky);
    const shA=Math.atan2(-(dz-kz),-(dy-ky));
    /* Knees track out over the toes while the bar is heavy and come back under him as he
       finishes, which is the difference between a pull and a flat side-on drawing of one.
       The foot counter-rotates by the same amount so it stays planted instead of rolling. */
    const kOut=.085*(1-SMS((p-.74)/.26));
    ['L','R'].forEach(s=>{const lg=F.legs[s],sg=s==='L'?-1:1;
      lg.thigh.rotation.x=thA;lg.shin.rotation.x=shA-thA;lg.foot.rotation.x=-shA;
      lg.thigh.rotation.z=sg*kOut;lg.foot.rotation.z=-sg*kOut});
    // lockout: the traps shrug up and the shoulders draw back (solved for above)
    ['L','R'].forEach(s=>{const sh=F.shoulders[s];sh.position.y=sly;sh.position.z=slz});
    /* head: counter almost all of the torso lean so the neck stays neutral and he looks a
       few feet out in front, the way a lifter actually does. At .62 the head still pointed
       most of the way at the floor and read as a craned, broken neck. */
    F.head.rotation.x=-lean*.88+.13;
    F.neck.rotation.x=-lean*.12;
    // lockout settle: a real lift doesn't just stop dead — the hips finish snapping forward
    // and decay into a small sway rather than freezing on the last frame
    const settle=SMS((p-.9)/.1)*Math.sin(now*7.5)*Math.exp(-Math.max(0,now-2)*2.6);
    F.hips.rotation.x=settle*.03;F.torso.rotation.z=settle*.012+Math.sin(now*24)*.004*grind;
    // breathing: big brace at the bottom, exhale at the top
    const brace=1+.017*(1-SMS((p-.72)/.2))+.005*Math.sin(now*2.1);
    F.chest.scale.set(brace,1,brace);   // the whole rib cage expands; it is one surface now
    /* bar whip. While the middle rises and the plates are still down the bar
       bends by exactly the lift height, so the plates stay planted. Once it is
       airborne the whip settles and wobbles. */
    const lift=barYw-.225;   // world: the bar is outside the scaled body
    let bend=lift<.062?lift:.062-(.062-.03)*SMS((lift-.062)/.15);
    if(lift>.07)bend+=Math.sin(now*13)*.0045*(1-SMS((p-.9)/.1));
    /* He is holding the bar, so the lockout sway has to take it with him: rotating the hips
       swings his hands through an arc about the hip, and if the bar stays put they slide off
       it at the one moment the camera is closest. */
    const sw=settle*.03,swC=Math.cos(sw),swS=Math.sin(sw);
    const hy=hipY*BH,hz=hipZ*BH,ry=barYw-hy,rz=barZw-hz;
    F.bar.position.set(0,hy+ry*swC-rz*swS,hz+ry*swS+rz*swC);
    F.segs.forEach(s=>{const r=s.x/.78;s.m.position.y=-bend*r*r;s.m.rotation.x=Math.atan(-2*bend*r/.78)});
    ['L','R'].forEach(s=>{const sl=F.sleeves[s],sgn=s==='L'?-1:1;
      sl.position.y=-bend;sl.rotation.x=sgn*Math.atan(2*bend*(.84/.78)/.78)});
    return {lean,grind};
  }
  /* mini three.js stage: one real deadlift, filmed like one */
  let three=null;
  if(window.THREE){
    const cv=$('#iavatar'),W=cv.clientWidth||280,H=cv.clientHeight||340;
    const R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});
    R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(W,H,false);
    R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
    if('outputEncoding' in R)R.outputEncoding=THREE.sRGBEncoding;
    R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.8;
    const S=new THREE.Scene();
    const C=new THREE.PerspectiveCamera(26,W/H,.05,40);
    S.add(new THREE.HemisphereLight(0xdfe8f7,0x3a3228,.34));
    const kl=new THREE.DirectionalLight(0xfff4e2,1.0);kl.position.set(1.9,3.1,2.4);kl.castShadow=true;
    kl.shadow.mapSize.set(1024,1024);Object.assign(kl.shadow.camera,{left:-1.8,right:1.8,top:2.2,bottom:-.5,near:.4,far:9});
    kl.shadow.bias=-.0007;kl.shadow.radius=2.5;S.add(kl);
    /* A back rim is what separates one muscle group from the next on fair skin; without it
       the whole body flattens into a single cream-coloured shape under the key. */
    const rim=new THREE.DirectionalLight(0xa8c2ef,.5);rim.position.set(-2.6,1.6,-2.2);S.add(rim);
    const rim2=new THREE.DirectionalLight(0xffd9b0,.2);rim2.position.set(2.4,1.2,-2.0);S.add(rim2);
    const fl=new THREE.DirectionalLight(0xffffff,.2);fl.position.set(-1.2,.9,2.6);S.add(fl);
    const F=buildDeadlifter();S.add(F.root);
    // platform: its top face is exactly y=0, which is where the feet are planted
    const plat=new THREE.Mesh(new THREE.BoxGeometry(2.9,.09,1.7),new THREE.MeshStandardMaterial({color:0x1d1916,roughness:.95}));
    plat.position.set(0,-.046,.06);plat.receiveShadow=true;S.add(plat);
    const inlay=new THREE.Mesh(new THREE.BoxGeometry(2.3,.005,1.16),new THREE.MeshStandardMaterial({color:0x2b2621,roughness:.9}));
    inlay.position.set(0,.002,.06);inlay.receiveShadow=true;S.add(inlay);
    // a soft contact shadow, so he is planted even past the edge of the shadow map
    {const c2=document.createElement('canvas');c2.width=c2.height=128;const x2=c2.getContext('2d');
     const gr=x2.createRadialGradient(64,64,3,64,64,64);gr.addColorStop(0,'rgba(0,0,0,.45)');gr.addColorStop(1,'rgba(0,0,0,0)');
     x2.fillStyle=gr;x2.fillRect(0,0,128,128);
     const ao=new THREE.Mesh(new THREE.PlaneGeometry(1.45,.9),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c2),transparent:true,depthWrite:false}));
     ao.rotation.x=-Math.PI/2;ao.position.set(0,.005,.01);S.add(ao)}
    let raf=0,running=true,curP=0;const t0=performance.now();
    function draw(p){curP=p}
    function frame(){
      if(!running)return;raf=requestAnimationFrame(frame);
      const now=(performance.now()-t0)/1000;
      poseDeadlift(F,curP,now);
      /* camera: start almost down at bar height so the weight reads as heavy, then rise with
         him. It used to sit at 1.5 looking down, which foreshortened the plates into a barrel
         and hid the hinge. Pulled back a little as well, with a longer lens, to flatten that. */
      const e=SMS(curP),yaw=-.52+e*.26,rad=6.48-e*.52,cy=.98+e*.84;
      C.position.set(Math.sin(yaw)*rad,cy,Math.cos(yaw)*rad);
      C.lookAt(0,.70+e*.48,.02);
      R.render(S,C);
    }
    frame();
    three={draw,stop(){running=false;cancelAnimationFrame(raf);
      // give the GPU its context back; nothing here is drawn again
      setTimeout(()=>{try{R.dispose();const g=R.getContext&&R.getContext();const e=g&&g.getExtension('WEBGL_lose_context');e&&e.loseContext()}catch(e){}},900)}};window.__introDraw=draw;
  }
  gsap.set('#iplate',{scale:.7,opacity:0,rotate:-10,rotateY:-25});
  gsap.set('.intro-n',{opacity:0,scale:.82,y:10});
  gsap.timeline({delay:.15,onComplete:endIntro})
    .to('#iplate',{scale:1,opacity:1,rotate:0,rotateY:0,duration:1,ease:'power3.out'})
    .to('.intro-n',{opacity:1,scale:1,y:0,duration:.6,ease:'back.out(1.6)'},'-=.75')
    .to(o,{v:230,p:100,duration:2.6,ease:'none',onUpdate(){
        n.textContent=Math.round(o.v);
        three&&three.draw(o.p/100);
        l.textContent=o.p<15?'Set the grip':o.p<29?'Pull the slack out':o.p<62?'Off the floor':o.p<88?'Drive the hips':'Lockout \u00b7 230 kg';
      }},'-=.35')
    .to('.intro-n',{scale:1.08,duration:.16,ease:'power2.out'},'-=.06')
    .to('.intro-n',{scale:1,duration:.3,ease:'elastic.out(1,.5)'})
    .to(flash,{opacity:.85,duration:.07,ease:'none'},'<')
    .to(flash,{opacity:0,duration:.4,ease:'power2.out'},'>')
    .to(intro,{yPercent:-100,duration:.85,ease:'expo.inOut',onStart(){three&&three.stop()}},'+=.35');
})();

/* ===== HERO ===== */
if(G)gsap.set('#heroH .ln>span',{yPercent:110});
if(G)gsap.set(['.hero p','.hero .ctas','.teaser','.nav','.kick'],{opacity:0,y:16});
function heroIn(){
  if(heroDone||!G)return;heroDone=true;
  gsap.to('#heroH .ln>span',{yPercent:0,duration:1.3,ease:'expo.out',stagger:.12});
  gsap.fromTo('#heroImg',{scale:1.14},{scale:1.06,duration:2.4,ease:'expo.out'});
  gsap.to(['.kick','.hero p','.hero .ctas','.teaser','.nav'],{opacity:1,y:0,duration:.9,stagger:.1,delay:.5,ease:'power2.out'});
}
if(G)gsap.to('#heroImg',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

/* ===== GSAP button micro-interaction, applied site-wide instead of a plain CSS transition ===== */
if(G){
  const pressable=()=>document.querySelectorAll('.btn,.lnk,.dbtn,.qb button,.tgrid button,.t-hd,.opts button,.tiles button,.chip');
  const arm=el=>{
    if(el._gsapArmed)return;el._gsapArmed=true;
    el.addEventListener('pointerenter',()=>gsap.to(el,{y:-2,duration:.25,ease:'power2.out'}));
    el.addEventListener('pointerleave',()=>gsap.to(el,{y:0,scale:1,duration:.3,ease:'power2.out'}));
    el.addEventListener('pointerdown',()=>gsap.to(el,{scale:.96,duration:.12,ease:'power2.out'}));
    el.addEventListener('pointerup',()=>gsap.to(el,{scale:1,duration:.35,ease:'back.out(2.2)'}));
  };
  pressable().forEach(arm);
  // form steps and other UI built after load get the same treatment, checked on a light interval
  setInterval(()=>pressable().forEach(arm),1200);
}

/* ===== LOAD: scroll-driven barbell ===== */
(function(){
  const L=$('#pL'),R=$('#pR');
  const plates=[[290,36,'#b8322f',25],[290,36,'#b8322f',25],[290,36,'#b8322f',25],[262,32,'#2f4f9e',20],[220,26,'#3f8a56',10]];
  let xl=298,xr=902;const lp=[],rp=[];
  plates.forEach(([h,w,c,kg])=>{
    xl-=w+4;const y=160-h/2;
    L.insertAdjacentHTML('beforeend',`<g class="pl" style="--pc:${c}"><rect x="${xl}" y="${y}" width="${w}" height="${h}" rx="3"/><rect x="${xl+w*.35}" y="${y}" width="${w*.3}" height="${h}" fill="rgba(0,0,0,.18)"/></g>`);
    R.insertAdjacentHTML('beforeend',`<g class="pl" style="--pc:${c}"><rect x="${xr}" y="${y}" width="${w}" height="${h}" rx="3"/><rect x="${xr+w*.35}" y="${y}" width="${w*.3}" height="${h}" fill="rgba(0,0,0,.18)"/></g>`);
    xr+=w+4;
  });
  const lg=$$('#pL .pl'),rg=$$('#pR .pl'),num=$('#loadNum'),lab=$('#loadL');
  const labels=['Empty bar','Warm-up','Working weight','Heavy','Very heavy','230 kg · MUJ record'];
  if(!G){num.textContent='230';lab.textContent=labels[5];return}
  gsap.set(lg,{x:-700,opacity:0});gsap.set(rg,{x:700,opacity:0});
  const o={v:20};
  const tl=gsap.timeline({scrollTrigger:{trigger:'#load',start:'top top',end:'+=105%',pin:true,scrub:1,anticipatePin:1,onUpdate:s=>{window.__load=s.progress}}});
  plates.forEach((p,i)=>{
    const from=o.v,to=o.v+p[3]*2;o.v=to;
    tl.to([lg[i],rg[i]],{x:0,opacity:1,duration:1,ease:'power3.out'},i*1.1)
      .to({},{duration:1,onUpdate(){const v=from+(to-from)*this.progress();num.textContent=Math.round(v);lab.textContent=labels[Math.min(5,Math.round((v-20)/42))]}},i*1.1)
  });
  // the bar only sags once every plate has actually slid into place — this used to fire at
  // an absolute 0.6s into the timeline, while plates were still mid-slide, which showed up
  // as a plate flying along a stray curved path. Now it starts right after the last one lands.
  const loadedAt=(plates.length-1)*1.1+1;
  tl.to('#barPath',{attr:{d:'M0 172 Q600 148 1200 172'},duration:1.6,ease:'power2.out'},loadedAt)
    .to(lg,{y:9,duration:1.6,ease:'power2.out'},loadedAt).to(rg,{y:9,duration:1.6,ease:'power2.out'},loadedAt)
    .to({},{duration:.8});
})();

/* ===== PLATES: rotate with scroll ===== */
if(G){
  $$('#plates .pl-i').forEach((el,i)=>{
    gsap.from(el,{y:40,opacity:0,duration:1,delay:i*.08,ease:'power3.out',scrollTrigger:{trigger:'#plates',start:'top 85%'}});
    gsap.to(el.querySelector('svg'),{rotate:(i%2?-1:1)*180,ease:'none',scrollTrigger:{trigger:'#plates',start:'top bottom',end:'bottom top',scrub:true}});
    el.addEventListener('pointerenter',()=>gsap.to(el,{y:-8,rotate:i%2?-1:1,duration:.35,ease:'power3.out'}));
    el.addEventListener('pointerleave',()=>gsap.to(el,{y:0,rotate:0,duration:.5,ease:'elastic.out(1,.55)'}));
  });
  gsap.from('.filter .ph',{clipPath:'inset(0 0 100% 0)',duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:'.filter',start:'top 70%'}});
}

/* ===== TRANSFORMATION ===== */
(function(){
  const tape=$('#tape');let h='';
  for(let v=60;v<=110;v++)h+=`<div class="tk ${v%5===0?'mj':''}">${v%5===0?`<b>${v}</b>`:''}</div>`;
  tape.innerHTML=h;const px=kg=>-(kg-60)*14;
  tape.style.transform=`translateX(${px(G?68:102)}px)`;
  const ghost=$('#bwGhost'),needle=$('#needle'),delta=$('#bwDelta');
  if(!G){$('#bwNum').textContent='102.0';if(ghost)ghost.textContent='102';return}
  const bw={v:68},num=$('#bwNum');
  gsap.matchMedia().add({d:'(min-width:901px)',m:'(max-width:900px)'},ctx=>{
    const d=ctx.conditions.d;
    gsap.timeline({defaults:{duration:1},scrollTrigger:{trigger:'#trans',start:d?'top top':'top 8%',end:d?'+=85%':'+=65%',pin:true,scrub:.8,anticipatePin:1}})
      .to(bw,{v:102,ease:'none',onUpdate(){num.textContent=bw.v.toFixed(1);tape.style.transform=`translateX(${px(bw.v)}px)`;if(ghost)ghost.textContent=Math.round(bw.v);if(needle)needle.classList.toggle('hot',bw.v%5<.4||bw.v%5>4.6)}},0)
      .to(ghost,{opacity:.13,ease:'none'},0)
      .to('#aImg',{clipPath:'polygon(-20% 145%,140% 145%,140% -30%,-20% -30%)',ease:'none'},0)
      .to('#bImg',{scale:1.07,ease:'none'},0)
      .to('#bImg',{filter:'grayscale(1) contrast(1.05) brightness(.82)',ease:'none',duration:.7},0)
      .to('#flash',{xPercent:280,duration:.16,ease:'power1.in'},.62)
      .to('#aImg',{filter:'grayscale(0) contrast(1.04) saturate(1.08)',duration:.22,ease:'none'},.68)
      .to('#tagB',{opacity:0,duration:.1},.78).to('#tagA',{opacity:1,duration:.1},.84)
      .fromTo(delta,{opacity:0,y:6,scale:.85},{opacity:1,y:0,scale:1,duration:.16,ease:'back.out(2.4)'},.88)
      .to(ghost,{opacity:.055,duration:.12},.94);
    return()=>{bw.v=68;if(needle)needle.classList.remove('hot')};
  });
})();

/* ===== MANIFESTO ===== */
(function(){
  const p=$('#mani');if(!p)return;
  const wrap=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w))f.appendChild(document.createTextNode(w));else{const s=document.createElement('span');s.className='w';s.textContent=w;f.appendChild(s)}});c.replaceWith(f)}else wrap(c)})};
  wrap(p);if(!G)return;
  gsap.fromTo('#mani .w',{opacity:.14},{opacity:1,ease:'none',stagger:.08,scrollTrigger:{trigger:p,start:'top 80%',end:'bottom 50%',scrub:true}});
})();

/* ===== REVEALS ===== */
if(G){
  $$('.steps3>div,.list li,.inc li,.tst>div').forEach(el=>gsap.from(el,{y:26,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}}));
  gsap.to('#fImg',{yPercent:10,ease:'none',scrollTrigger:{trigger:'.filter',start:'top bottom',end:'bottom top',scrub:true}});
  $$('#nope li:not(.yes) .t').forEach(t=>gsap.fromTo(t,{'--s':0},{'--s':1,ease:'none',scrollTrigger:{trigger:t,start:'top 75%',end:'top 50%',scrub:true}}));
  $$('.h2').forEach(h=>gsap.from(h,{y:24,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
  gsap.from('.foot-word',{yPercent:40,ease:'none',scrollTrigger:{trigger:'footer',start:'top bottom',end:'bottom bottom',scrub:true}});

  /* ---------- reading progress across the whole page ---------- */
  gsap.to('#sprog',{scaleX:1,ease:'none',
    scrollTrigger:{trigger:document.documentElement,start:'top top',end:'bottom bottom',scrub:.3}});

  /* ---------- every chapter rule draws itself in (::after can't be tweened, so CSS does it) ---------- */
  $$('.chap').forEach(c=>ScrollTrigger.create({trigger:c,start:'top 92%',once:true,
    onEnter(){c.classList.add('drawn')}}));

  /* ---------- numbers count up when they arrive ---------- */
  function countUp(el,to,pre,post,dp){
    const o={v:0};
    gsap.to(o,{v:to,duration:1.5,ease:'power2.out',
      scrollTrigger:{trigger:el,start:'top 88%',once:true},
      onUpdate(){el.textContent=pre+o.v.toFixed(dp||0)+post}});
  }
  {const b=$$('#tst b');
   if(b[0]){const el=b[0];el.textContent='68 → 68 kg';
     const o={v:68};
     gsap.to(o,{v:102,duration:1.7,ease:'power2.out',
       scrollTrigger:{trigger:el,start:'top 88%',once:true},
       onUpdate(){el.textContent='68 → '+Math.round(o.v)+' kg'}});}
   if(b[1])countUp(b[1],520,'',' kg');}

  /* ---------- quotes fade in just behind their number ---------- */
  $$('#tst q').forEach(q=>gsap.from(q,{opacity:0,y:14,duration:.9,delay:.25,ease:'power2.out',
    scrollTrigger:{trigger:q,start:'top 90%',once:true}}));

  /* ---------- nav gets out of the way going down, comes back going up ---------- */
  (function(){
    const nav=$('.nav'); if(!nav)return;
    const to=gsap.quickTo(nav,'yPercent',{duration:.45,ease:'power3.out'});
    let last=scrollY,shown=true;
    addEventListener('scroll',()=>{
      const y=scrollY,d=y-last; last=y;
      if(y<120){if(!shown){shown=true;to(0)}return}
      if(d>6&&shown){shown=false;to(-140)}
      else if(d<-6&&!shown){shown=true;to(0)}
    },{passive:true});
  })();

  /* ---------- the training-photo rail drifts as you pass it ---------- */
  $$('#rail figure').forEach((f,i)=>gsap.fromTo(f,{y:(i%2?26:0)},{y:(i%2?-26:-52),ease:'none',
    scrollTrigger:{trigger:'#work',start:'top bottom',end:'bottom top',scrub:.6}}));

  /* ---------- footer headline lifts in line by line ---------- */
  gsap.set('.foot-cta h2 .fl>span',{yPercent:110});
  gsap.to('.foot-cta h2 .fl>span',{yPercent:0,duration:1.1,stagger:.12,ease:'expo.out',
    scrollTrigger:{trigger:'footer',start:'top 78%',once:true}});
  gsap.from('.foot-cta .btn',{opacity:0,y:18,duration:.9,delay:.3,ease:'power3.out',
    scrollTrigger:{trigger:'footer',start:'top 78%',once:true}});

  /* ---------- price block: the two halves arrive offset ---------- */
  gsap.from('.price>div:first-child',{opacity:0,x:-22,duration:1,ease:'power3.out',
    scrollTrigger:{trigger:'.price',start:'top 85%',once:true}});
  gsap.from('.price .where span',{opacity:0,y:10,duration:.7,stagger:.1,delay:.35,ease:'power2.out',
    scrollTrigger:{trigger:'.price',start:'top 85%',once:true}});
  gsap.from('.ig',{opacity:0,x:20,duration:.9,ease:'power3.out',
    scrollTrigger:{trigger:'.ig',start:'top 92%',once:true}});

  /* ===================================================================
     Pointer and scroll feel. All of this is desktop-and-mouse only and
     sits behind the same G guard as everything else, so a phone, a
     trackpad user who has asked for less motion, or a browser without
     gsap all get the plain page and none of the work.
     =================================================================== */
  if(matchMedia('(hover:hover)').matches&&matchMedia('(pointer:fine)').matches){

    /* --- the trailing ring --- it lags a little behind the real pointer, which is what
       makes it read as a physical thing rather than a second cursor, and swells over
       anything you can click. The native cursor is deliberately left alone: people fill
       a form on this page, and taking their pointer away to look clever is a bad trade. */
    const ring=document.createElement('div');
    ring.className='cur-ring';document.body.appendChild(ring);
    const rx=gsap.quickTo(ring,'x',{duration:.4,ease:'power3'}),
          ry=gsap.quickTo(ring,'y',{duration:.4,ease:'power3'});
    let curOn=false;
    addEventListener('pointermove',e=>{
      if(!curOn){curOn=true;gsap.to(ring,{opacity:1,duration:.35})}
      rx(e.clientX);ry(e.clientY);
    },{passive:true});
    addEventListener('pointerdown',()=>gsap.to(ring,{scale:.75,duration:.18,ease:'power2.out'}));
    addEventListener('pointerup',()=>gsap.to(ring,{scale:1,duration:.34,ease:'back.out(2)'}));
    document.addEventListener('pointerover',e=>{
      const hit=e.target.closest&&e.target.closest('a,button,summary,[role="button"]');
      gsap.to(ring,{scale:hit?1.8:1,duration:.3,ease:'power3.out'});
      ring.classList.toggle('on',!!hit);
    },{passive:true});
    addEventListener('blur',()=>gsap.to(ring,{opacity:0,duration:.2}));
    addEventListener('pointerleave',()=>gsap.to(ring,{opacity:0,duration:.2}));

    /* --- magnetic buttons --- the button leans towards the pointer while it is near,
       and springs back the moment it leaves. Strength falls off with distance so it
       is a pull, not a snap. */
    $$('.btn,.dbtn,.lnk').forEach(el=>{
      let raf=0;
      const move=e=>{
        if(raf)return;raf=requestAnimationFrame(()=>{raf=0;
          const r=el.getBoundingClientRect();
          const mx=e.clientX-(r.left+r.width/2),my=e.clientY-(r.top+r.height/2);
          const reach=Math.max(r.width,r.height)*.9;
          const pull=Math.max(0,1-Math.hypot(mx,my)/(reach*1.6));
          gsap.to(el,{x:mx*.28*pull,y:my*.32*pull,duration:.5,ease:'power3.out'})})};
      el.addEventListener('pointermove',move,{passive:true});
      el.addEventListener('pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.7,ease:'elastic.out(1,.45)'}));
    });

    /* --- scroll velocity skew --- the page leans a degree or two into the direction
       you are scrolling and settles when you stop. Capped hard, because past about
       four degrees it stops reading as momentum and starts reading as broken. */
    {const skewables=$$('#work .rail, .tst, .plates, #nope, .steps3');
     if(skewables.length){
       let prev=scrollY,vel=0;
       const setSkew=skewables.map(el=>gsap.quickSetter(el,'skewY','deg'));
       const tick=()=>{
         const y=scrollY,d=y-prev;prev=y;
         vel+=(Math.max(-4,Math.min(4,d*.22))-vel)*.12;
         if(Math.abs(vel)<.01)vel=0;
         for(let i=0;i<setSkew.length;i++)setSkew[i](vel);
       };
       gsap.ticker.add(tick);
     }}
  }

  /* --- the numbers strip --- an endless run of the things the page is actually
     selling, drifting on its own and shoved along by the scroll. Runs on touch too:
     it is one transform on one element, which is cheap enough anywhere. */
  {const strip=$('#mq'),row=strip&&strip.querySelector('.mq-in');
   const unit=row&&row.firstElementChild;
   if(row&&unit){
     /* Two copies of the same run of text, so as one slides out of frame the other is
        already filling the gap. We slide the inner row and wrap it by exactly one
        copy's width, which is why the seam never shows. */
     row.appendChild(unit.cloneNode(true));
     let x=0,boost=0,prev=scrollY;
     const DRIFT=-38;                            // px per second, leftwards, on its own
     const set=gsap.quickSetter(row,'x','px');
     /* Width is measured on resize, never in the ticker: reading offsetWidth forces a
        layout, and doing that every frame is exactly the kind of thing that turns a
        cheap transform into a jank source. */
     let w=unit.offsetWidth||1;
     const remeasure=()=>{w=unit.offsetWidth||1};
     addEventListener('resize',remeasure,{passive:true});
     addEventListener('load',remeasure);
     if(document.fonts&&document.fonts.ready)document.fonts.ready.then(remeasure).catch(()=>{});
     gsap.ticker.add((t,dtms)=>{
       const y=scrollY;boost+=((y-prev)*2.4-boost)*.08;prev=y;
       x+=(DRIFT*(dtms/1000))-boost*(dtms/1000);
       if(x<=-w)x+=w;else if(x>0)x-=w;
       set(x)})}}
}

/* mobile CTA */
let cardVis=false;new IntersectionObserver(e=>{cardVis=e[0].isIntersecting;mcta()}).observe($('#apply'));
function mcta(){$('#mcta').classList.toggle('show',scrollY>innerHeight*.6&&!cardVis)}
addEventListener('scroll',mcta,{passive:true});


/* ===== DRIVE: story world with physics (three.js + cannon.js) ===== */
(function(){
  if(!window.THREE||!window.CANNON)return;
  if(matchMedia('(max-width:900px)').matches||matchMedia('(pointer:coarse)').matches){const d=document.getElementById('drive');if(d)d.remove();return}
  const PH={before:$('#bImg').src,flex:$('#aImg').src,dead:$('#heroImg').src,mirror:$('#fImg').src,lock:$('#gLock').src,dbb:$('#gDbb').src,tri:$('#gTri').src,curl:$('#gCurl').src,crowd:$('#gCrowd').src};
  const GP=i=>{const e=$('#gp'+i);return e?e.src:''};
  /* Every photograph in the story bible belongs to a checkpoint, so none of them are
     scattered round the map as decoration any more — they are installed at the chapter
     they were taken for, in the order the bible puts them in. */
  const EXTRAS=[];
  const WA_TXT=encodeURIComponent("Hi Swastik! I just drove through your story on the swastikk.m site. I want to join the powerbuilding coaching (₹1,980/month). How do I start the trial?");
  /* ----------------------------------------------------------------------------
     THE STORY. Sourced verbatim from "TRACK STORY BIBLE — 68 -> 102": thirteen
     checkpoints, in the bible's order, with the bible's hook lines, numbers and
     reference photographs. u runs 0..1 round the loop, so the order on the road is
     the order in the document. Nothing here is invented: where the bible gives no
     number, none is shown.
     photos[] is that checkpoint's reference set, first one on the main board and the
     rest installed beside it — never shuffled, never reused somewhere else.
     ---------------------------------------------------------------------------- */
  const JOURNEY=[
    {id:'cp01',chapter:'01',name:'The joke',u:.008,side:1,kind:'photo',bw:68,
     hook:'Nobody asked how I was. They just told me how I looked.',
     stat:'~68 KG  ·  11TH STANDARD, POST MID-TERMS',
     title:'~68 kg',sub:'11th standard, post mid-terms',
     line:'"Nobody asked how I was. They just told me how I looked."',
     line2:'Badminton till 6:30. Then a relative, in front of everyone: look at your face and arms.',
     photos:[{src:GP(1),ar:.549,cap:'11th standard'}]},

    {id:'cp02',chapter:'02',name:'The first rep',u:.075,side:-1,kind:'photo',bw:68,
     hook:'Bad form. Borrowed courage. One rep that started everything.',
     stat:'FIRST DEADLIFT PR  ·  120 KG',
     title:'120 kg',sub:'First deadlift PR',pr:'120 kg',prName:'First deadlift PR',
     line:'"Bad form. Borrowed courage. One rep that started everything."',
     line2:'Absolute rubbish at first. Then another beginner taught him the compound lifts.',
     photos:[{src:GP(11),ar:.562,cap:'First sessions'},{src:GP(17),ar:.565,cap:'The gym buddy'}]},

    {id:'cp03',chapter:'03',name:'The squat',u:.145,side:1,kind:'rack',bw:81,
     hook:"Less taunts. More 'you look in shape, man.'",
     stat:'140 KG PR  ·  180 KG × 3 WITNESSED  ·  81 KG AT COLLEGE',
     title:'140 kg',sub:'Second deadlift PR',pr:'140 kg',prName:'Second deadlift PR',
     line:'"Less taunts. More \u2018you look in shape, man.\u2019"',
     line2:'First competition, 140 kg. Then a senior repped 180 for three like it was nothing.',
     photos:[{src:GP(16),ar:.549,cap:'Club gym'},{src:GP(18),ar:.566,cap:'Mask on'},{src:GP(7),ar:.562,cap:'First flight'}]},

    {id:'cp04',chapter:'04',name:'The ego',u:.215,side:-1,kind:'photo',bw:81,big:true,
     hook:'High ego. Higher expectations. About to meet both.',
     stat:'81 KG  ·  ABHIVRATA, POWERLIFTING',
     title:'81 kg',sub:'Abhivrata · the college meet',
     line:'"High ego. Higher expectations. About to meet both."',
     line2:'A senior asked him to fill a slot. He said yes, certain he was the best in the room.',
     photos:[{src:GP(5),ar:1.772,cap:'Competition day'}]},

    {id:'cp05',chapter:'05',name:'The reality check',u:.295,side:1,kind:'bench',bw:81,
     hook:'My third attempt was their warm-up.',
     stat:'SQUAT 100 vs 225 KG  ·  BENCH FAILED 80 vs 120 KG',
     title:'100 kg',sub:'Third attempt · their warm-up',
     line:'"My third attempt was their warm-up."',
     line2:'100 kg was their warm-up weight. He failed 80 on the bench and watched 120 fly.',
     photos:[{src:GP(14),ar:.565,cap:'Squats first'},{src:GP(12),ar:.562,cap:'Then bench'}]},

    {id:'cp06',chapter:'06',name:'The pull hill',u:.395,side:-1,kind:'photo',bw:81,big:true,anim:'deadlift',
     hook:"242.5kg came off that floor. My ego didn't survive the pull.",
     stat:'155 KG FAILED  →  242.5 KG WITNESSED',
     title:'242.5 kg',sub:"MUJ all-time record, witnessed",pr:'242.5 kg',prName:'MUJ all-time record, witnessed',
     line:'"242.5kg came off that floor. My ego didn\u2019t survive the pull."',
     line2:'It broke something and rebuilt it better. Strength was the game. Muscle was the byproduct.',
     photos:[{src:GP(13),ar:.564,cap:'His attempt'},{src:GP(19),ar:.566,cap:'242.5 off the floor'}]},

    {id:'cp07',chapter:'07',name:'The arms they laughed at',u:.500,side:1,kind:'photo',bw:94,
     hook:'Same arms. Different sentence.',
     stat:'81 KG  →  94 KG',
     title:'81 → 94 kg',sub:'First real bulk · 4th year',
     line:'"Same arms. Different sentence."',
     line2:'The direct answer to chapter 01. Full circle, without a word said back.',
     photos:[{src:GP(4),ar:.562,cap:'Same doorway'},{src:GP(20),ar:.561,cap:'Front double biceps'},{src:GP(2),ar:.461,cap:'Before'}]},

    {id:'cp08',chapter:'08',name:'102 kg',u:.575,side:-1,kind:'photo',bw:102,
     hook:'The scale went up. So did my mistakes. Then I actually learned something.',
     stat:'94→100 UNFOCUSED  ·  100→102 INFORMED  ·  150 / 225 / 100 KG',
     title:'102 kg',sub:'Squat 150 · Deadlift 225 · Bench 100',pr:'225 kg',prName:'Deadlift at 102 kg',
     line:'"The scale went up. So did my mistakes. Then I actually learned something."',
     line2:'The number on the scale means nothing without the work behind it.',
     photos:[{src:GP(10),ar:.562,cap:'94 → 100, unfocused'},{src:GP(9),ar:.562,cap:'100 → 102, informed'}]},

    {id:'cp09',chapter:'09',name:'The reps nobody saw',u:.650,side:1,kind:'photo',bw:102,
     hook:'I trained for a record while my own body was working against me.',
     stat:'INFECTION 10 MONTHS  ·  SURGERY, 6TH SEM  ·  RECOVERY 5 MONTHS',
     title:'10 months',sub:'Trained through all of it',
     line:'"I trained for a record while my own body was working against me."',
     line2:'Close to the record. All of it gone in one decision made for his health, not his goals.',
     photos:[{src:GP(15),ar:.665,cap:'Through the prep'},{src:GP(8),ar:.555,cap:'Carrying it quietly'}]},

    {id:'cp10',chapter:'10',name:'The platform',u:.762,side:-1,kind:'trophy',bw:102,
     hook:'Four months back from surgery. New record. My name on it.',
     stat:'230 KG  ·  4 MONTHS AFTER SURGERY',
     title:'230 kg',sub:"MUJ all-time conventional deadlift",pr:'230 kg',prName:'MUJ all-time conventional deadlift',
     line:'"Four months back from surgery. New record. My name on it."',
     line2:'Rebuilt from close to nothing, and the heaviest conventional pull the place has seen.',
     photos:[{src:PH.dead,ar:1.780,cap:'The record'}]},

    {id:'cp11',chapter:'11',name:'Same gym floor',u:.845,side:1,kind:'photo',bw:102,
     hook:"I've cried on this floor twice. Once from pain. Once from joy.",
     stat:'145 KG × 3, LOWER BACK  ·  6 MONTHS REHAB',
     title:'6 months',sub:'Physiotherapy and rehab',
     line:'"I\u2019ve cried on this floor twice. Once from pain. Once from joy."',
     line2:'Four weeks after the record he crawled out of the gym. Same gym. Same floor. Different person.',
     photos:[{src:GP(21),ar:.748,cap:'Doing the rehab properly'}]},

    {id:'cp12',chapter:'12',name:'Now',u:.905,side:-1,kind:'photo',bw:102,
     hook:'Fifteen kilos away. This time, for good.',
     stat:'230 KG HELD  →  242.5 KG TARGET',
     title:'230 → 242.5 kg',sub:'Present day',
     line:'"Fifteen kilos away. This time, for good."',
     line2:'More caution, more recovery, more respect. Make it exist first, make it better later.',
     photos:[{src:GP(6),ar:.561,cap:'Now'},{src:GP(3),ar:.555,cap:'Still under the bar'}]},

    {id:'cp13',chapter:'13',name:'Your chapter',u:.962,side:1,kind:'sign',bw:102,final:true,
     hook:"This was mine. What's yours?",
     stat:'THE FINISH LINE IS THE START LINE',
     title:'Your chapter',sub:'The loop starts again',
     line:'"This was mine. What\u2019s yours?"',
     line2:'The finish line is the start line. Chapter 01 is waiting.',
     photos:[]},
  ];
  const VEHS={
    car:{label:'Car',engine:650,max:30.8,slip:2.4,xw:1.05,zf:1.35,zb:-1.35,r:.46,rest:.42,steer:.55,roll:.02},
  };
  const WEATHERS=[
    {id:'day',label:'Day',bg:0x9dc0dd,fog:[110,300],hemi:.62,sun:0xfff7e8,sunI:1.12,ground:0x5c6b44,leaf:0x39672b,part:null,slip:1,skyTop:0x4a86c6,skyBottom:0xc3d9ea,star:0,sunA:.7,terr:[1.06,1.1,.98],snow:0,water:0x2f6f8c,ridge:[.46,.53,.62]},
    {id:'dusk',label:'Dusk',bg:0x2e2418,fog:[80,240],hemi:.5,sun:0xffcf92,sunI:1.0,ground:0x3a3124,leaf:0x3d4a2c,part:null,slip:1,skyTop:0x3d4a72,skyBottom:0xd98f4e,star:.72,sunA:1,terr:[1.16,1,.82],snow:0,water:0x3c4f5e,ridge:[.3,.28,.3]},
    {id:'rain',label:'Rain',bg:0x5b656d,fog:[45,175],hemi:.52,sun:0xc3d0dc,sunI:.42,ground:0x15171a,leaf:0x27342c,part:'rain',slip:.75,skyTop:0x4d5760,skyBottom:0x707a82,star:.04,sunA:.25,terr:[.8,.88,.96],snow:0,water:0x25404e,ridge:[.16,.18,.22]},
    {id:'snow',label:'Snow',bg:0xc4cad0,fog:[38,160],hemi:.66,sun:0xffffff,sunI:.62,ground:0xd8dde1,leaf:0xdfe6ea,part:'snow',slip:.55,skyTop:0xf0f4f8,skyBottom:0xc4cad0,star:0,sunA:.5,terr:[1.02,1.04,1.08],snow:.88,water:0x5d7581,ridge:[.62,.66,.72]},
    {id:'autumn',label:'Autumn',bg:0x6a4a2c,fog:[75,240],hemi:.54,sun:0xffc082,sunI:1.02,ground:0x2a2016,leaf:0xc2561f,part:'leaves',slip:.95,skyTop:0x6c5330,skyBottom:0xb08046,star:.34,sunA:.85,terr:[1.42,1.04,.68],snow:0,water:0x3d4a44,ridge:[.3,.22,.15]},
    /* Night. The only light is the moon, so the key light goes cold and dim, the ground
       loses most of its colour, and the stars come all the way up. The sun sprite is left
       faintly on rather than off — a pinhole low on the horizon reads as the last of the
       day going, which is kinder than a hard cut to black. */
    {id:'night',label:'Night',bg:0x070b16,fog:[64,250],hemi:.30,sun:0xbcd0f2,sunI:.42,ground:0x121722,leaf:0x1b2a22,part:null,slip:.95,skyTop:0x05080f,skyBottom:0x172542,star:1,sunA:.22,terr:[.70,.78,.98],snow:0,water:0x15273a,ridge:[.09,.12,.20]},
  ];
  /* ---------- dom ---------- */
  const sec=$('#drive'),cv=$('#dc'),hud=$('#dhud'),kgEl=$('#dkg'),hint=$('#dhint'),startBtn=$('#dstart'),toast=$('#dtoast'),mm=$('#dmap'),mx2=mm.getContext('2d'),spd=$('#dspeed'),chap=$('#dchap'),prompt=$('#dprompt'),viewer=$('#dview'),bigmap=$('#dbig'),bmc=$('#dbigc'),cine=$('#dcine'),mob=$('#dmob'),mute=$('#dmute'),liftEl=$('#dlift');
  let W=sec.clientWidth,H=sec.clientHeight,active=false,driving=false,muted=false;
  const SAVE=(()=>{try{return JSON.parse(localStorage.getItem('sl_drive2')||'{}')}catch(e){return{}}})();
  const LOW=!matchMedia('(hover:hover)').matches;const TOUCH=matchMedia('(pointer:coarse)').matches||LOW;
  /* ---------- renderer / scene ---------- */
  const R=new THREE.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance'});
  R.shadowMap.enabled=!LOW;R.shadowMap.type=THREE.PCFSoftShadowMap;
  /* One quality: Ultra, and it is not a menu. Everything the old tiers used to switch off
     is simply on — shadows, grass, dust, stars, the full particle budget. The only thing
     that still varies is the pixel-ratio cap, because resolution is the one cost that
     scales with the panel instead of with the scene: a 3x phone screen would otherwise
     render nine times the pixels for a picture the same size. Everything else is kept
     cheap by construction (Lambert materials, instanced scatter, a shadow map redrawn
     every third frame, boards culled by distance) rather than by asking the player. */
  const ULTRA={dpr:1.3,dprLow:1.15,shEvery:3};
  /* Quality used to be decided once, from a coarse touch/mouse guess, and never
     revisited — so a weak laptop with a mouse got full shadows and 1.3 DPR for
     the entire drive regardless of actual frame rate. This instead watches the
     real FPS while driving and steps quality down (then back up) to match. */
  let qTier=LOW?1:0;             // 0 full, 1 reduced, 2 minimum
  /* The downgrade used to need a full 1.2s of bad frames per step, so a weak phone
     stuttered for ~2.5s before reaching the cheapest tier. The first drop is now quick
     and the second only slightly slower; the upgrade stays deliberately slow so quality
     can't oscillate. */
  const Q_UP_MS=3000;let qGoodT=0,qBadT=0;
  const qDownMs=()=>qTier===0?450:900;
  function tierCfg(t){
    return t===2?{dpr:.75,shadow:false,shEvery:6}
         : t===1?{dpr:LOW?1.0:1.05,shadow:!LOW,shEvery:5}
         :        {dpr:ULTRA.dpr,shadow:true,shEvery:ULTRA.shEvery};
  }
  function setTier(t){
    if(t===qTier)return;qTier=t;const c=tierCfg(t);
    R.setPixelRatio(Math.min(devicePixelRatio||1,c.dpr));R.setSize(W,H,false);
    R.shadowMap.enabled=c.shadow;if(sun){sun.castShadow=c.shadow;sun.shadow.needsUpdate=true}
    ULTRA.shEvery=c.shEvery;
  }
  function watchFps(dt){
    if(!active||!driving||dt<=0)return;
    const fps=1/dt;
    if(fps<42){qGoodT=0;qBadT+=dt*1000;if(qBadT>qDownMs()&&qTier<2){setTier(qTier+1);qBadT=0}}
    else if(fps>56){qBadT=0;qGoodT+=dt*1000;if(qGoodT>Q_UP_MS&&qTier>0){setTier(qTier-1);qGoodT=0}}
    else{qGoodT=0;qBadT=0}
  }
  const SCN={grass:null,dust:null,stars:null};
  const DPR=()=>Math.min(devicePixelRatio||1,LOW?ULTRA.dprLow:ULTRA.dpr);
  function applyQ(){
    const c=tierCfg(qTier);
    R.setPixelRatio(Math.min(devicePixelRatio||1,c.dpr));R.setSize(W,H,false);
    R.shadowMap.enabled=c.shadow;
    if(typeof sun!=='undefined'&&sun){sun.castShadow=c.shadow;sun.shadow.needsUpdate=true}
    if(SCN.grass)SCN.grass.visible=true;
    if(SCN.dust)SCN.dust.visible=true;
    if(SCN.stars)SCN.stars.visible=true;
    if(typeof pGeo!=='undefined'&&pGeo)pGeo.setDrawRange(0,PCOUNT);
  }

  if('outputEncoding' in R)R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.98;
  const S=new THREE.Scene();S.background=new THREE.Color(0x0e0e0d);S.fog=new THREE.Fog(0x0e0e0d,55,170);
  const C=new THREE.PerspectiveCamera(50,W/H,.1,320);
  let ZN={drag:0,fog:1,tint:[1,1,1]},fogFar0=170,fogNear0=55,hemi0=.55,sunI0=1.05;
  let progU=0;
  const hemi=new THREE.HemisphereLight(0xdfeaff,0x3c3a30,.55);S.add(hemi);
  const sun=new THREE.DirectionalLight(0xfff2dd,1.05);sun.position.set(18,34,12);sun.castShadow=!LOW;sun.shadow.mapSize.set(LOW?512:640,LOW?512:640);sun.shadow.autoUpdate=false;sun.shadow.bias=-.0006;Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:110});S.add(sun);S.add(sun.target);
  const SUN_DIR=new THREE.Vector3(18,34,12).normalize();
  const MOON_DIR=new THREE.Vector3(-20,26,-14).normalize(); // rides opposite the sun
  const SUN_OFF_DEFAULT=new THREE.Vector3(18,34,12);
  const SUN_OFF_LOW=new THREE.Vector3(34,8,22); // a low, golden-hour sun angle, used only while parked at the summit
  const SUN_DIR_LOW=SUN_OFF_LOW.clone().normalize();
  let recapCam=false;
  const fillL=new THREE.DirectionalLight(0x8fa8ff,.1);fillL.position.set(-16,9,-11);S.add(fillL);
  /* ---------- sky dome, sun glow, stars, dust: atmosphere so the world isn't just flat fog ---------- */
  const skyMat=new THREE.ShaderMaterial({uniforms:{topColor:{value:new THREE.Color(0x323a52)},bottomColor:{value:new THREE.Color(0x0e0e0d)},offset:{value:9},exponent:{value:.68}},
    vertexShader:'varying vec3 vWP;void main(){vec4 wp=modelMatrix*vec4(position,1.0);vWP=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}',
    fragmentShader:'uniform vec3 topColor;uniform vec3 bottomColor;uniform float offset;uniform float exponent;varying vec3 vWP;void main(){float h=normalize(vWP+vec3(0.0,offset,0.0)).y;gl_FragColor=vec4(mix(bottomColor,topColor,max(pow(max(h,0.0),exponent),0.0)),1.0);}',
    side:THREE.BackSide,fog:false,depthWrite:false});
  const sky=new THREE.Mesh(new THREE.SphereGeometry(280,20,14),skyMat);S.add(sky);
  const sunTexC=document.createElement('canvas');sunTexC.width=sunTexC.height=128;
  {const gx=sunTexC.getContext('2d'),gr=gx.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,246,222,1)');gr.addColorStop(.35,'rgba(255,224,168,.5)');gr.addColorStop(1,'rgba(255,224,168,0)');gx.fillStyle=gr;gx.fillRect(0,0,128,128)}
  const sunSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(sunTexC),color:0xfff2dd,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
  sunSprite.scale.set(50,50,1);sunSprite.position.copy(sun.position).normalize().multiplyScalar(260);S.add(sunSprite);
  /* ---------- the night sky ----------
     Two hundred identical white dots read as static, so this is a real star field:
     sizes and colours vary, roughly a third of them are pulled into a tilted band so
     there is a milky way to look up at, and each one twinkles on its own phase. It is
     still a single draw call — the variation lives in attributes, the twinkle in the
     vertex shader, so none of it costs anything per frame on the CPU. */
  const STARN=LOW?240:560;
  const starPos=new Float32Array(STARN*3),starSize=new Float32Array(STARN),
        starPhase=new Float32Array(STARN),starTint=new Float32Array(STARN*3);
  {const BAND=new THREE.Vector3(.42,.62,.66).normalize();  // the milky way's tilt
   const t1=new THREE.Vector3(),t2=new THREE.Vector3(),p=new THREE.Vector3();
   t1.set(-BAND.y,BAND.x,0).normalize();t2.crossVectors(BAND,t1).normalize();
   for(let i=0;i<STARN;i++){
     const inBand=i%3===0;   // a third of the sky's stars belong to the band
     if(inBand){const a=Math.random()*Math.PI*2,spread=(Math.random()+Math.random()-1)*.20;
       p.copy(t1).multiplyScalar(Math.cos(a)).addScaledVector(t2,Math.sin(a)).addScaledVector(BAND,spread).normalize()}
     else{const th=Math.random()*Math.PI*2,ph=Math.acos(Math.random()*.9);
       p.set(Math.sin(ph)*Math.cos(th),Math.cos(ph),Math.sin(ph)*Math.sin(th))}
     if(p.y<0)p.y=-p.y;                       // keep them all above the horizon
     const r=272;
     starPos[i*3]=p.x*r;starPos[i*3+1]=p.y*r*.9+20;starPos[i*3+2]=p.z*r;
     // a few bright ones, most of them faint; band stars sit smaller and denser
     const big=Math.random();
     starSize[i]=(inBand?.7:1)*(big>.965?3.4:big>.85?2.1:1.25)*(LOW?1.15:1);
     starPhase[i]=Math.random()*6.283;
     // real stars are not white: lean a little warm or a little blue
     const warm=Math.random();
     const c=warm>.72?[1,.86,.7]:warm>.4?[1,.98,.94]:[.78,.86,1];
     starTint[i*3]=c[0];starTint[i*3+1]=c[1];starTint[i*3+2]=c[2]}}
  const starGeo=new THREE.BufferGeometry();
  starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));
  starGeo.setAttribute('aSize',new THREE.BufferAttribute(starSize,1));
  starGeo.setAttribute('aPhase',new THREE.BufferAttribute(starPhase,1));
  starGeo.setAttribute('aTint',new THREE.BufferAttribute(starTint,3));
  const starMat=new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0},uOpacity:{value:.6},uPix:{value:Math.min(devicePixelRatio||1,2)}},
    transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending,
    vertexShader:`attribute float aSize;attribute float aPhase;attribute vec3 aTint;
      uniform float uTime,uOpacity,uPix;varying float vA;varying vec3 vT;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
        float tw=.58+.42*sin(uTime*1.6+aPhase);vA=uOpacity*tw;vT=aTint;
        gl_PointSize=aSize*uPix;}`,
    fragmentShader:`varying float vA;varying vec3 vT;
      void main(){vec2 d=gl_PointCoord-vec2(.5);float r=length(d);if(r>.5)discard;
        float a=1.-smoothstep(0.,.5,r);a*=a;gl_FragColor=vec4(vT,vA*a);}`});
  const stars=new THREE.Points(starGeo,starMat);stars.frustumCulled=false;S.add(stars);SCN.stars=stars;
  /* The moon. Rides opposite the sun, fades in with the stars, and carries its own soft
     halo so it reads as light rather than a pasted-on disc. */
  const moonC=document.createElement('canvas');moonC.width=moonC.height=128;
  {const g=moonC.getContext('2d');
   const hal=g.createRadialGradient(64,64,10,64,64,64);
   hal.addColorStop(0,'rgba(226,232,246,.95)');hal.addColorStop(.34,'rgba(206,216,238,.30)');
   hal.addColorStop(1,'rgba(180,196,230,0)');g.fillStyle=hal;g.fillRect(0,0,128,128);
   g.beginPath();g.arc(64,64,25,0,6.283);g.fillStyle='#eef1fa';g.fill();
   g.globalAlpha=.16;g.fillStyle='#8f9ab4';
   [[56,55,7],[72,70,5],[62,76,4],[75,56,3],[52,68,3]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,6.283);g.fill()})}
  const moon=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(moonC),
    transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending,opacity:0}));
  moon.scale.set(34,34,1);moon.frustumCulled=false;S.add(moon);
  /* A shooting star every so often, but only when there are stars out to shoot across.
     One reused line, so it costs nothing when it is not running. */
  const shootGeo=new THREE.BufferGeometry();
  shootGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));
  const shootMat=new THREE.LineBasicMaterial({color:0xfdf6e6,transparent:true,opacity:0,depthWrite:false,fog:false,blending:THREE.AdditiveBlending});
  const shootL=new THREE.Line(shootGeo,shootMat);shootL.frustumCulled=false;shootL.visible=false;S.add(shootL);
  const shoot={t:0,dur:0,next:4+Math.random()*9,from:new THREE.Vector3(),dir:new THREE.Vector3()};
  const DUSTN=LOW?40:100;const dustPos=new Float32Array(DUSTN*3);
  for(let i=0;i<DUSTN;i++){dustPos[i*3]=(Math.random()-.5)*76;dustPos[i*3+1]=Math.random()*9+.5;dustPos[i*3+2]=(Math.random()-.5)*76}
  const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));
  const dustMat=new THREE.PointsMaterial({color:0xffe6bd,size:.11,transparent:true,opacity:.4,depthWrite:false});
  const dust=new THREE.Points(dustGeo,dustMat);S.add(dust);SCN.dust=dust;
  /* Lambert, not Standard. Every lit surface out here is matte low-poly, and the PBR shader
     was costing a full physically-based BRDF per pixel for a look that Lambert reproduces
     almost exactly. On an integrated GPU this is the difference between a smooth drive and a
     slideshow, because the scene is fill-rate bound rather than geometry bound. The PBR-only
     options are dropped on the way in so the rest of the code can keep passing them. */
  const PBRONLY=['roughness','metalness','normalMap','normalScale','roughnessMap','metalnessMap','envMap','envMapIntensity','clearcoat','flatShading'];
  const M=(c,o={})=>{const q=Object.assign({color:c},o);PBRONLY.forEach(k=>delete q[k]);return new THREE.MeshLambertMaterial(q)};
  const paper=M(0xf2eee6),ink=M(0x15140f),bone=M(0xc9c2b4),red=M(0xb8322f),blue=M(0x2f4f9e),green=M(0x3f8a56),yellow=M(0xd9b23a),steel=M(0xa9a59d,{metalness:.45,roughness:.4}),gold=M(0xd4a83a,{metalness:.75,roughness:.28}),glow=new THREE.MeshBasicMaterial({color:0xf2eee6}),rubber=M(0x232220,{roughness:.95}),skin=M(0xe2b48f),tankM=M(0x2c5bd6),hairM=M(0x1d1915);
  const groundM=M(0x1c1b18),roadM=M(0x57544d,{roughness:.88}),edgeM=M(0x81786a),skirtM=M(0x26241f,{side:THREE.DoubleSide}),leafM=M(0x33402c),trunkM=M(0x3a2c20);
  /* ---------- physics ---------- */
  const world=new CANNON.World();world.gravity.set(0,-24,0);world.broadphase=new CANNON.SAPBroadphase(world);world.allowSleep=true;world.defaultContactMaterial.friction=.3;
  const gM=new CANNON.Material('g'),oM=new CANNON.Material('o');world.addContactMaterial(new CANNON.ContactMaterial(gM,oM,{friction:.5,restitution:.1}));
  // no infinite ground plane: the world heightfield below is the only ground, which is what lets the pond have a real bed
  const BOUND=192;[[BOUND,0,0,.5,8,BOUND],[-BOUND,0,0,.5,8,BOUND],[0,0,BOUND,BOUND,8,.5],[0,0,-BOUND,BOUND,8,.5]].forEach(([x,y,z,a,b,c])=>{const w=new CANNON.Body({mass:0});w.addShape(new CANNON.Box(new CANNON.Vec3(a,b,c)));w.position.set(x,y,z);world.addBody(w)});
  /* Heightfield half-extent and grid spacing, declared early because the branch and
     summit road below need them. The terrain is one mesh that is never frustum culled,
     so its vertex count is paid on every single frame: at ES=2 a world this size is
     42k vertices, which is what made the bigger map stutter. Coarsening the grid is
     far cheaper than shrinking the world, and the roads survive it because their
     corridor is flattened ten metres wide either side and the tarmac is drawn from
     this same field, so the road can never disagree with the ground it sits on. */
  const WS=205,ES=LOW?3:2.5;
  const dyn=[];
  function staticBox(x,y,z,a,b,c,ry=0){const w=new CANNON.Body({mass:0,material:oM});w.addShape(new CANNON.Box(new CANNON.Vec3(a,b,c)));w.position.set(x,y,z);w.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),ry);world.addBody(w);return w}
  function dynBox(mesh,x,y,z,a,b,c,mass,ry=0){const bd=new CANNON.Body({mass,material:oM});bd.addShape(new CANNON.Box(new CANNON.Vec3(a,b,c)));bd.position.set(x,y,z);bd.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),ry);bd.angularDamping=.5;bd.linearDamping=.2;bd.sleepSpeedLimit=.3;world.addBody(bd);mesh.position.set(x,y,z);mesh.rotation.y=ry;S.add(mesh);dyn.push({mesh,body:bd,home:new CANNON.Vec3(x,y,z),q:bd.quaternion.clone()});return bd}
  /* ---------- road spline ---------- */
  const PTS=[[0,-38],[38,-70],[83,-54],[99,-10],[80,35],[35,58],[-22,51],[-64,26],[-77,-22],[-48,-51]].map(([x,z])=>new THREE.Vector3(x,0,z));
  const curve=new THREE.CatmullRomCurve3(PTS,true,'catmullrom',.55);
  const N=420,SAMP=[];for(let i=0;i<=N;i++)SAMP.push(curve.getPointAt(i/N));
  /* Two rises, because the story needs two. HILLS[0] is checkpoint 06's Pull Hill — the
     climb the car has to fight up. HILLS[1] is checkpoint 10's Platform: it comes later on
     the loop and it is deliberately the higher of the two, so the literal high point of the
     map is the record, not the failure that preceded it. */
  const HILLS=[{a:.265,b:.385,c:.475,d:.595,H:11},{a:.645,b:.755,c:.805,d:.915,H:13}];
  const HILL=HILLS[0];
  function hAt(u){u=((u%1)+1)%1;let out=0;
    for(let i=0;i<HILLS.length;i++){const {a,b,c,d,H}=HILLS[i];if(u<=a||u>=d)continue;let h;
      if(u<b){const t=(u-a)/(b-a);h=H*t*t*(3-2*t)}else if(u<=c)h=H;else{const t=(d-u)/(d-c);h=H*t*t*(3-2*t)}
      if(h>out)out=h}
    return out}
  const at=u=>{const p=curve.getPointAt(((u%1)+1)%1),tg=curve.getTangentAt(((u%1)+1)%1);p.y=hAt(u);return {p,tg,n:new THREE.Vector3(-tg.z,0,tg.x),ry:Math.atan2(tg.x,tg.z)}};
  /* ---------- side road: a spur off the main loop that climbs to a west-side summit.
     It leaves the circuit at the top of the Platform hill (checkpoint 10), passes the
     ramp yard, then keeps climbing out to a lookout at the map's edge for the sunset.
     peakR is hard-clamped to stay inside the heightfield/physics walls no matter where
     BR_U actually lands on the spline, so a bad guess here can't put anything out of bounds. */
  const BR_U=.775,BR_LEN=34,PEAK_DIST=62,PEAK_RISE=10;
  const PTS_CTR=PTS.reduce((a,p)=>a.add(p),new THREE.Vector3()).divideScalar(PTS.length);
  const BR_START=curve.getPointAt(BR_U).clone();BR_START.y=0;
  const BR_OUT=BR_START.clone().sub(PTS_CTR);BR_OUT.y=0;BR_OUT.normalize();
  const BR_H=hAt(BR_U);
  const RAMPYARD={x:BR_START.x+BR_OUT.x*BR_LEN,z:BR_START.z+BR_OUT.z*BR_LEN};
  const SAFE_R=WS-20;
  let peakX=RAMPYARD.x+BR_OUT.x*PEAK_DIST,peakZ=RAMPYARD.z+BR_OUT.z*PEAK_DIST;
  const peakR=Math.hypot(peakX,peakZ);
  if(peakR>SAFE_R){const s=SAFE_R/peakR;peakX*=s;peakZ*=s}
  const PEAK={x:peakX,z:peakZ};
  const PEAK_H=BR_H+PEAK_RISE;
  const BR_MID=new THREE.Vector3(BR_START.x+BR_OUT.x*BR_LEN*.55+BR_OUT.z*6,0,BR_START.z+BR_OUT.z*BR_LEN*.55-BR_OUT.x*6);
  const BR_END=new THREE.Vector3(RAMPYARD.x,0,RAMPYARD.z);
  const BR_MID2=new THREE.Vector3((RAMPYARD.x+PEAK.x)/2+BR_OUT.z*7,0,(RAMPYARD.z+PEAK.z)/2-BR_OUT.x*7);
  const BR_PEAKV=new THREE.Vector3(PEAK.x,0,PEAK.z);
  const brCurveToYard=new THREE.CatmullRomCurve3([BR_START,BR_MID,BR_END],false,'catmullrom',.5);
  const BR_YARD_LEN=brCurveToYard.getLength();
  const brCurve=new THREE.CatmullRomCurve3([BR_START,BR_MID,BR_END,BR_MID2,BR_PEAKV],false,'catmullrom',.5);
  const U_YARD=Math.min(.92,BR_YARD_LEN/brCurve.getLength());
  const BN=90,BSAMP=[];for(let i=0;i<=BN;i++)BSAMP.push(brCurve.getPointAt(i/BN));
  // match the branch's road texture density to the main loop's (34 repeats over its full length)
  const BR_REP=34*(brCurve.getLength()/curve.getLength());
  const brSmooth=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
  /* The climb finishes at U_TOP rather than at the very end of the curve, so the last
     stretch of road is already level at PEAK_H by the time it reaches the lookout's flat
     pad. Running the rise all the way to u=1 left the road still climbing into ground
     that had already been flattened, and the two met in a step. */
  /* The ring road: a circle laid round the ramp yard, flat at the yard's own height.
     The branch arrives, and instead of a dead end there is something to lap — the three
     ramps sit inside it, so you can cut across the middle or stay on the tarmac. */
  const RING={x:RAMPYARD.x,z:RAMPYARD.z,r:19};
  const U_TOP=.93;
  function brHAt(u){if(u<=U_YARD)return BR_H;
    return BR_H+(PEAK_H-BR_H)*brSmooth(Math.min(1,(u-U_YARD)/Math.max(.001,U_TOP-U_YARD)))}
  const bAt=u=>{const uc=Math.max(0,Math.min(1,u));const p=brCurve.getPointAt(uc),tg=brCurve.getTangentAt(Math.max(.001,Math.min(.999,uc)));p.y=brHAt(uc);return {p,tg,n:new THREE.Vector3(-tg.z,0,tg.x)}};
  const SM=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
  const LRP=(a,b,t)=>a+(b-a)*t;
  /* ---------- value noise + procedural textures (no external assets: single-file site) ---------- */
  function hash2(x,z){const s=Math.sin(x*127.1+z*311.7)*43758.5453;return s-Math.floor(s)}
  function noise2(x,z){const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi,u=xf*xf*(3-2*xf),v=zf*zf*(3-2*zf);const a=hash2(xi,zi),b=hash2(xi+1,zi),c=hash2(xi,zi+1),d=hash2(xi+1,zi+1);return (a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v}
  function fbm2(x,z){return noise2(x,z)*1+noise2(x*2.3,z*2.3)*.5+noise2(x*5.1,z*5.1)*.22}
  // soft organic grain, tiled over the ground so it reads as soil and not as flat polygons
  function grainTex(px,scl,rep,lo){const c=document.createElement('canvas');c.width=c.height=px;const cx=c.getContext('2d');const im=cx.createImageData(px,px);
    for(let j=0;j<px;j++)for(let i=0;i<px;i++){const n=(noise2(i*scl,j*scl)*.6+noise2(i*scl*3.1,j*scl*3.1)*.28+noise2(i*scl*8.3,j*scl*8.3)*.12)/1;
      const v=Math.max(0,Math.min(1,lo+(1-lo)*n))*255;const k=(j*px+i)*4;im.data[k]=im.data[k+1]=im.data[k+2]=v|0;im.data[k+3]=255}
    cx.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);t.anisotropy=4;return t}
  // tiling ripple normal map for the water surface
  function waterNormTex(){const px=256,c=document.createElement('canvas');c.width=c.height=px;const cx=c.getContext('2d');const im=cx.createImageData(px,px);
    const wav=(i,j)=>{const u=i/px*Math.PI*2,v=j/px*Math.PI*2;
      return Math.sin(u*2+v*1)*.5+Math.sin(u*3-v*4)*.3+Math.sin(u*6+v*5)*.14+(noise2(i*.09,j*.09)-.5)*.5};
    for(let j=0;j<px;j++)for(let i=0;i<px;i++){
      const dx=wav((i+1)%px,j)-wav((i-1+px)%px,j),dy=wav(i,(j+1)%px)-wav(i,(j-1+px)%px);
      const k=(j*px+i)*4;im.data[k]=Math.max(0,Math.min(255,128+dx*120));im.data[k+1]=Math.max(0,Math.min(255,128+dy*120));im.data[k+2]=252;im.data[k+3]=255}
    cx.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);t.anisotropy=4;return t}
  /* ---------- zones (terrain is carved around them, so they come first) ---------- */
  const POND={x:30,z:16,r:11,depth:2.2},PG={x:2,z:-14};
  const WATER_Y=.02;
  function edgeR(a){return POND.r*(1+(noise2(Math.cos(a)*2+9,Math.sin(a)*2+9)-.5)*.34)}
  const pondR=(x,z)=>edgeR(Math.atan2(z-POND.z,x-POND.x));
  /* ---------- level pads, so nothing is built on a slope ---------- */
  function stDist(J){return J.kind==='sign'?10:J.kind==='photo'?(J.big?15:12.5):10}
  function placeAt(u,side,dist){const {p,n}=at(u);return {x:p.x+n.x*side*dist,y:p.y,z:p.z+n.z*side*dist,ry:Math.atan2(-n.x*side,-n.z*side)}}
  /* placeAt turns a board square-on to the road, which is exactly how you end up reading a
     story out of the side window at 70 km/h. faceAt keeps the same spot and turns the board
     up the road instead, to the angle you actually approach it from: deg is measured off the
     driving line, so a small number is a board aimed straight at the windscreen and 90 is the
     old square-on placement. Because the road curves, the angle is taken from the tangent at
     that point, so every board stays readable from the direction you arrive. */
  function faceAt(u,side,dist,deg){const {p,n,tg}=at(u);const a=(deg===undefined?26:deg)*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a);
    const dx=-tg.x*ca-n.x*side*sa,dz=-tg.z*ca-n.z*side*sa;
    return {x:p.x+n.x*side*dist,y:p.y,z:p.z+n.z*side*dist,ry:Math.atan2(dx,dz)}}
  const LEN=curve.getLength();
  const PADS=JOURNEY.map(J=>{const q=placeAt(J.u,J.side,stDist(J));return {x:q.x,z:q.z,y:q.y,r:J.big?10:7.5,f:J.big?18:15}});
  EXTRAS.forEach(E=>{const q=placeAt(E.u,E.side,11);E.q=q;PADS.push({x:q.x,z:q.z,y:q.y,r:6,f:12})});
  PADS.push({x:PG.x,z:PG.z,y:0,r:17,f:28});
  // the pad has to hold the whole ring, not just the ramps, or the circle rides a slope
  PADS.push({x:RAMPYARD.x,z:RAMPYARD.z,y:BR_H,r:RING.r+5,f:RING.r+15});
  PADS.push({x:PEAK.x,z:PEAK.z,y:PEAK_H,r:8,f:16});
  /* ---------- one world heightfield: rolling land, a real mountain, a pond basin, a valley rim ---------- */
  /* One sample run and one bounding box per hill: a single box round both would drag every
     grid point between them through the inner loop for nothing. */
  const MASS=HILLS.map(HL=>{const pts=[];
    for(let i=Math.floor(HL.a*N)-3;i<=Math.ceil(HL.d*N)+3;i+=2){const k=(i+N)%N,h=hAt(i/N);if(h>0)pts.push({x:SAMP[k].x,z:SAMP[k].z,h})}
    let a=1e9,b=-1e9,c=1e9,d=-1e9;pts.forEach(s=>{a=Math.min(a,s.x);b=Math.max(b,s.x);c=Math.min(c,s.z);d=Math.max(d,s.z)});
    return {pts,bb:{a:a-36,b:b+36,c:c-36,d:d+36}}});
  function roadNear(x,z){let bi=0,bd=1e9;
    for(let i=0;i<N;i+=6){const dx=SAMP[i].x-x,dz=SAMP[i].z-z,d=dx*dx+dz*dz;if(d<bd){bd=d;bi=i}}
    for(let i=bi-6;i<=bi+6;i++){const k=(i+N)%N,dx=SAMP[k].x-x,dz=SAMP[k].z-z,d=dx*dx+dz*dz;if(d<bd){bd=d;bi=k}}
    let bestD=bd,bestU=bi/N,branch=false,ring=false;
    // the branch spur is short, so a full linear scan of it is cheap
    for(let i=0;i<=BN;i++){const dx=BSAMP[i].x-x,dz=BSAMP[i].z-z,d=dx*dx+dz*dz;if(d<bestD){bestD=d;bestU=i/BN;branch=true}}
    /* The ring road is a circle, so it needs no samples at all: how far you are from the
       tarmac is just how far your radius is from the circle's. One subtraction beats
       walking a polyline, which matters because this runs for every cell of the heightfield. */
    {const dx=x-RING.x,dz=z-RING.z,dr=Math.abs(Math.hypot(dx,dz)-RING.r),d=dr*dr;
     if(d<bestD){bestD=d;bestU=0;branch=true;ring=true}}
    return {d:Math.sqrt(bestD),u:bestU,branch,ring}}
  function rollingH(x,z){return (fbm2(x*.0115+3,z*.0115-5)-.52)*15+(fbm2(x*.046-8,z*.046+2)-.5)*4.4+(fbm2(x*.15+21,z*.15-13)-.5)*1.1}
  function mountH(x,z){let h=0,md=1e9,any=false;
    for(let m=0;m<MASS.length;m++){const BB=MASS[m].bb;if(x<BB.a||x>BB.b||z<BB.c||z>BB.d)continue;any=true;
    const HSAMP=MASS[m].pts;
    for(let i=0;i<HSAMP.length;i++){const s=HSAMP[i],dd=Math.hypot(s.x-x,s.z-z);if(dd<md)md=dd;
      let f;if(dd<5.5)f=1;else if(dd<34){const q=1-(dd-5.5)/28.5;f=q*q*(3-2*q)}else continue;
      const hh=s.h*f;if(hh>h)h=hh}}
    if(!any)return 0;
    if(h>.2){const rr=(fbm2(x*.055+4,z*.055-6)-.5)*(5.4+h*.5)+(fbm2(x*.17-11,z*.17+8)-.5)*2.1;
      h=Math.max(.2,h+rr*SM((md-9)/13)*Math.min(1,h/3))}
    return h}
  function terrainH(x,z){
    let h=rollingH(x,z);
    const m=mountH(x,z);if(m>h)h=m;
    // the pond sits in its own shallow hollow, then the bed is carved below the waterline
    const pd=Math.hypot(x-POND.x,z-POND.z),pr=pondR(x,z);
    if(pd<pr*2.7){const lw=(1-SM((pd-pr*1.1)/(pr*1.55)))*.92;h=h*(1-lw)+.3*lw}
    if(pd<pr*1.32){const bw=1-SM((pd-pr*.94)/(pr*.36));h=h*(1-bw)+(-POND.depth*SM((pr*.99-pd)/(pr*.52)))*bw}
    // valley rim, so the world has a horizon instead of an edge
    const de=Math.max(Math.abs(x),Math.abs(z));
    if(de>116){const t=SM((de-116)/32);h+=t*(18+(fbm2(x*.04+7,z*.04-3)-.5)*20)}
    // the road corridor stays true to the spline, and wins over everything
    const rn=roadNear(x,z),fw=1-SM((rn.d-9.8)/30);
    if(fw>0)h=h*(1-fw)+(rn.ring?BR_H:rn.branch?brHAt(rn.u):hAt(rn.u))*fw;
    for(let i=0;i<PADS.length;i++){const p=PADS[i],dd=Math.hypot(p.x-x,p.z-z);
      if(dd<p.f){const w=1-SM((dd-p.r)/(p.f-p.r));h=h*(1-w)+p.y*w}}
    return h}
  const rockPts=[];
  const terrainM=new THREE.MeshLambertMaterial({color:0xffffff,vertexColors:true,map:grainTex(160,.07,120,.55)});
  const HF=(function(){
    const nx=Math.round(WS*2/ES)+1,nz=nx,minX=-WS,maxZ=WS;
    const data=[],slope=new Float32Array(nx*nz);
    let lo=1e9;
    for(let i=0;i<nx;i++){const row=new Array(nz),x=minX+i*ES;
      for(let j=0;j<nz;j++){const h=terrainH(x,maxZ-j*ES);row[j]=h;if(h<lo)lo=h}
      data.push(row)}
    /* cannon builds each heightfield cell as a convex pillar whose base is pinned at local -1, so any
       sample at or below that collapses the pillar and the solver spits out NaN the moment a wheel
       touches it. That is what launched the car in the pond. Lift the whole field into positive space,
       pin minValue at 0 so every pillar has real volume, and drop the body back down by the same amount. */
    const OFF=2-Math.min(0,lo);
    for(let i=0;i<nx;i++)for(let j=0;j<nz;j++)data[i][j]+=OFF;
    const shape=new CANNON.Heightfield(data,{elementSize:ES,minValue:0});
    const body=new CANNON.Body({mass:0,material:gM});body.addShape(shape);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);body.position.set(minX,-OFF,maxZ);world.addBody(body);
    const pos=new Float32Array(nx*nz*3),col=new Float32Array(nx*nz*3),uv=new Float32Array(nx*nz*2),idx=[];
    for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const k=i*nz+j;
      pos[k*3]=minX+i*ES;pos[k*3+1]=data[i][j]-OFF-.02;pos[k*3+2]=maxZ-j*ES;
      uv[k*2]=i/(nx-1);uv[k*2+1]=1-j/(nz-1);
      const hx=(data[Math.min(nx-1,i+1)][j]-data[Math.max(0,i-1)][j])/(2*ES),hz=(data[i][Math.min(nz-1,j+1)]-data[i][Math.max(0,j-1)])/(2*ES);
      slope[k]=Math.hypot(hx,hz)}
    // wind CCW when seen from above, otherwise every normal points down and the ground renders unlit
    for(let i=0;i<nx-1;i++)for(let j=0;j<nz-1;j++){const a=i*nz+j,b=(i+1)*nz+j;idx.push(a,b,a+1,b,b+1,a+1)}
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    g.setIndex(idx);g.computeVertexNormals();
    const mesh=new THREE.Mesh(g,terrainM);mesh.receiveShadow=true;S.add(mesh);
    // altitude + slope painting, repainted when the weather changes so snow actually settles
    function paint(snowAmt,tint){
      const col=g.attributes.color.array; // the attribute owns its own copy, so write into that one
      for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const k=i*nz+j,x=minX+i*ES,z=maxZ-j*ES,h=data[i][j]-OFF,sl=slope[k];
        let r=.215,g2=.365,b=.135;
        const dry=noise2(x*.062+5,z*.062-2)-.5,fine=noise2(x*.33-3,z*.33+7)-.5;r+=dry*.1+fine*.05;g2+=dry*.05+fine*.05;b+=dry*.015+fine*.035;
        const patch=noise2(x*.021-14,z*.021+9);r=LRP(r,.3,SM((patch-.55)/.4)*.55);g2=LRP(g2,.335,SM((patch-.55)/.4)*.55);b=LRP(b,.16,SM((patch-.55)/.4)*.55);
        const dirt=SM((sl-.3)/.45)*.7;r=LRP(r,.34,dirt);g2=LRP(g2,.245,dirt);b=LRP(b,.15,dirt);
        const rk=Math.max(SM((sl-.62)/.5),SM((h-9)/10)*.85);r=LRP(r,.42,rk);g2=LRP(g2,.4,rk);b=LRP(b,.365,rk);
        const sc=Math.max(SM((h-16.5)/5.5)*(1-SM((sl-1.3)/.6)*.75),snowAmt);r=LRP(r,.93,sc);g2=LRP(g2,.95,sc);b=LRP(b,.98,sc);
        const pd=Math.hypot(x-POND.x,z-POND.z),pr=pondR(x,z);
        if(pd<pr*1.55&&h<1.2){const sand=SM((1.2-h)/1.05)*SM((pr*1.55-pd)/(pr*.5))*(1-snowAmt*.8);r=LRP(r,.7,sand);g2=LRP(g2,.61,sand);b=LRP(b,.42,sand)}
        col[k*3]=r*tint[0];col[k*3+1]=g2*tint[1];col[k*3+2]=b*tint[2]}
      g.attributes.color.needsUpdate=true}
    const hAcc=(x,z)=>{const fi=(x-minX)/ES,fj=(maxZ-z)/ES;if(fi<0||fj<0||fi>=nx-1||fj>=nz-1)return 0;const i=fi|0,j=fj|0,tx=fi-i,tz=fj-j;
      return ((data[i][j]*(1-tx)+data[i+1][j]*tx)*(1-tz)+(data[i][j+1]*(1-tx)+data[i+1][j+1]*tx)*tz)-OFF};
    const slAcc=(x,z)=>{const fi=Math.round((x-minX)/ES),fj=Math.round((maxZ-z)/ES);if(fi<0||fj<0||fi>nx-1||fj>nz-1)return 0;return slope[fi*nz+fj]};
    // boulders, on the steep flanks only, clear of the road
    {let seed=53;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;let tries=0;
      while(rockPts.length<38&&tries<5000){tries++;const x=(rnd()-.5)*374,z=(rnd()-.5)*374;const hh=hAcc(x,z);
        if(hh<.5)continue;if(slAcc(x,z)<.42)continue;if(roadNear(x,z).d<11)continue;
        rockPts.push([x,hh,z,.65+rnd()*1.7,rnd()*Math.PI*2])}}
    const rockIM=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),M(0x585349,{roughness:.98,flatShading:true,map:grainTex(64,.09,2,.52)}),rockPts.length);
    rockIM.receiveShadow=true;
    {const o=new THREE.Object3D();rockPts.forEach(([x,hh,z,s,ry],i)=>{o.position.set(x,hh+s*.22,z);o.scale.set(s,s*.78,s*.92);o.rotation.set(ry*.5,ry,ry*.3);o.updateMatrix();rockIM.setMatrixAt(i,o.matrix)});S.add(rockIM)}
    return {h:hAcc,slope:slAcc,paint,mesh}})();
  /* ---------- distant ridge line, so the horizon is land and not fog ---------- */
  const farRidge=(function(){const pos=[],idx=[],col=[];const SEG=84,R0=268;
    for(let i=0;i<=SEG;i++){const a=i/SEG*Math.PI*2;const hh=16+fbm2(Math.cos(a)*7+31,Math.sin(a)*7-12)*30;
      const r=R0+noise2(Math.cos(a)*4,Math.sin(a)*4)*22;
      pos.push(Math.cos(a)*r,-4,Math.sin(a)*r,Math.cos(a)*r,hh,Math.sin(a)*r);
      col.push(.20,.21,.25,.30,.32,.38);
      if(i<SEG){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,fog:true,transparent:true,opacity:.9,depthWrite:false}));m.renderOrder=-1;S.add(m);return m})();
  function ridgeTint(t){const c=farRidge.geometry.attributes.color,a=c.array;
    for(let i=0;i<a.length;i+=6){a[i]=t[0];a[i+1]=t[1];a[i+2]=t[2];a[i+3]=Math.min(1,t[0]*1.45);a[i+4]=Math.min(1,t[1]*1.45);a[i+5]=Math.min(1,t[2]*1.45)}
    c.needsUpdate=true}
  /* ---------- road surface ---------- */
  function strip(w,yo,mat){const pos=[],idx=[],uv=[];for(let i=0;i<=N;i++){const {p,n}=at(i/N);n.multiplyScalar(w/2);
      pos.push(p.x-n.x,p.y+yo,p.z-n.z,p.x+n.x,p.y+yo,p.z+n.z);uv.push(0,i/N*34,1,i/N*34);
      if(i<N){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.receiveShadow=true;S.add(m);return m}
  // same recipe as strip(), but walks the short branch spur instead of the main loop
  /* The branch road is laid on the heightfield itself rather than on the ideal curve
     height. The two are not the same thing: roadNear quantises u to one of BN steps and
     the field is sampled on a 2m grid, and up at the summit the lookout's pad flattens
     the ground to PEAK_H while the curve is still climbing towards it. Drawing the ideal
     height left the tarmac and the surface you actually drive on disagreeing by up to
     half a metre on the climb, which is what put the car underneath the road. Sampling
     HF.h per vertex means the road cannot disagree with the ground by construction. */
  function stripB(w,yo,mat){const pos=[],idx=[],uv=[];for(let i=0;i<=BN;i++){const {p,n}=bAt(i/BN);n.multiplyScalar(w/2);
      const lx=p.x-n.x,lz=p.z-n.z,rx=p.x+n.x,rz=p.z+n.z;
      pos.push(lx,HF.h(lx,lz)+yo,lz,rx,HF.h(rx,rz)+yo,rz);uv.push(0,i/BN*BR_REP,1,i/BN*BR_REP);
      if(i<BN){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.receiveShadow=true;S.add(m);return m}
  roadM.map=grainTex(128,.07,1,.72);roadM.map.repeat.set(2,1);
  edgeM.map=grainTex(64,.12,1,.6);edgeM.map.repeat.set(3,1);
  strip(7.6,.04,edgeM);strip(5.8,.09,roadM);
  stripB(7,.04,edgeM);stripB(5.2,.09,roadM);
  /* The ring, built the same way as the branch: a band swept round the circle with its
     height read off the heightfield, so the tarmac sits on the ground rather than near it. */
  function stripRing(w,yo,mat){const SEG=72,pos=[],idx=[],uv=[];
    for(let i=0;i<=SEG;i++){const a=i/SEG*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);
      const ix=RING.x+ca*(RING.r-w/2),iz=RING.z+sa*(RING.r-w/2);
      const ox=RING.x+ca*(RING.r+w/2),oz=RING.z+sa*(RING.r+w/2);
      pos.push(ix,HF.h(ix,iz)+yo,iz,ox,HF.h(ox,oz)+yo,oz);
      uv.push(0,i/SEG*26,1,i/SEG*26);
      if(i<SEG){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.receiveShadow=true;S.add(m);return m}
  stripRing(7,.04,edgeM);stripRing(5.2,.09,roadM);
  // dashes round the inside of the circle, so it reads as a lane and not a painted disc
  (function(){const SEG=48,im=new THREE.InstancedMesh(new THREE.PlaneGeometry(.14,1.4),M(0xd8d2c2),SEG);
    const o=new THREE.Object3D();let k=0;
    for(let i=0;i<SEG;i++){const a=i/SEG*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);
      const dx=RING.x+ca*(RING.r-2.1),dz=RING.z+sa*(RING.r-2.1);
      o.position.set(dx,HF.h(dx,dz)+.1,dz);o.rotation.set(-Math.PI/2,0,-a);o.updateMatrix();im.setMatrixAt(k++,o.matrix)}
    im.count=k;S.add(im)})();
  const prog=strip(.28,.11,glow);prog.geometry.setDrawRange(0,0);
  // lane dashes (instanced)
  (function(){const cnt=Math.floor(N/5)*2;const im=new THREE.InstancedMesh(new THREE.PlaneGeometry(.14,1.3),M(0xd8d2c2),cnt);const o=new THREE.Object3D();let k=0;for(let i=0;i<N;i+=5){const {p,tg,n}=at(i/N);for(const s of [1,-1]){o.position.set(p.x+n.x*2.5*s,p.y+.1,p.z+n.z*2.5*s);o.rotation.set(-Math.PI/2,0,-Math.atan2(tg.x,tg.z));o.updateMatrix();if(k<cnt)im.setMatrixAt(k++,o.matrix)}}im.count=k;S.add(im)})();
  // same lane dashes, laid down the branch spur
  (function(){const cnt=Math.floor(BN/4)*2;const im=new THREE.InstancedMesh(new THREE.PlaneGeometry(.14,1.3),M(0xd8d2c2),cnt);const o=new THREE.Object3D();let k=0;for(let i=0;i<BN;i+=4){const {p,tg,n}=bAt(i/BN);for(const s of [1,-1]){const dx=p.x+n.x*2.2*s,dz=p.z+n.z*2.2*s;o.position.set(dx,HF.h(dx,dz)+.1,dz);o.rotation.set(-Math.PI/2,0,-Math.atan2(tg.x,tg.z));o.updateMatrix();if(k<cnt)im.setMatrixAt(k++,o.matrix)}}im.count=k;S.add(im)})();
  // center dashes keep the road readable through bends and over the hills
  (function(){const cnt=Math.floor(N/7),im=new THREE.InstancedMesh(new THREE.PlaneGeometry(.2,1.55),M(0xe8dfc9),cnt);const o=new THREE.Object3D();let k=0;for(let i=0;i<N;i+=7){const {p,tg}=at(i/N);o.position.set(p.x,p.y+.115,p.z);o.rotation.set(-Math.PI/2,0,-Math.atan2(tg.x,tg.z));o.updateMatrix();im.setMatrixAt(k++,o.matrix)}im.count=k;S.add(im)})();
  // lamp posts (instanced posts + instanced bulbs so it is 2 draw calls, not 60)
  const lamps=[];
  (function(){const US=[];for(let i=0;i<N;i+=21)US.push(i/N);
    const postIM=new THREE.InstancedMesh(new THREE.CylinderGeometry(.06,.08,3.2,6),steel,US.length);
    const bulbGeo=new THREE.SphereGeometry(.22,8,8);const o=new THREE.Object3D();
    US.forEach((u,i)=>{const {p,n}=at(u);const bx=p.x+n.x*4.6,bz=p.z+n.z*4.6;
      o.position.set(bx,p.y+1.6,bz);o.rotation.set(0,0,0);o.scale.set(1,1,1);o.updateMatrix();postIM.setMatrixAt(i,o.matrix);
      const bulb=new THREE.Mesh(bulbGeo,M(0x3a3733));bulb.position.set(bx,p.y+3.3,bz);S.add(bulb);lamps.push({u,bulb})});
    S.add(postIM)})();
  /* ---------- water ---------- */
  const pondPts=[];{const K=34;for(let k=0;k<K;k++){const a=k/K*Math.PI*2,rr=edgeR(a);pondPts.push({a,rr,x:POND.x+Math.cos(a)*rr,z:POND.z+Math.sin(a)*rr})}}
  const waterNorm=waterNormTex();
  const waterM=new THREE.MeshPhongMaterial({color:0x2f5566,shininess:64,specular:0x6f8f9f,transparent:true,opacity:.86,normalMap:waterNorm,normalScale:new THREE.Vector2(.45,.45)});
  const water=(function(){const s=new THREE.Shape();pondPts.forEach((p,k)=>{const x=Math.cos(p.a)*p.rr*1.02,z=Math.sin(p.a)*p.rr*1.02;k===0?s.moveTo(x,z):s.lineTo(x,z)});s.closePath();
    const g=new THREE.ShapeGeometry(s,26);const m=new THREE.Mesh(g,waterM);m.rotation.x=-Math.PI/2;m.position.set(POND.x,WATER_Y,POND.z);S.add(m);return m})();
  const ripple=new THREE.Mesh(new THREE.RingGeometry(.9,1.1,28),new THREE.MeshBasicMaterial({color:0xdfe9ef,transparent:true,opacity:0,depthWrite:false}));ripple.rotation.x=-Math.PI/2;S.add(ripple);
  /* ---------- pond dressing: instanced boulders, reeds and lilies ---------- */
  (function(){
    const rocks=[],reeds=[],lilies=[];let seed=17;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    pondPts.forEach((p,i)=>{if(i%2===0){const s=.4+rnd()*.8;rocks.push([p.x+Math.cos(p.a)*1.25,p.z+Math.sin(p.a)*1.25,s,rnd()*6.3])}
      for(let k=0;k<3;k++){const rx=p.x+(rnd()-.5)*2.2,rz=p.z+(rnd()-.5)*2.2;reeds.push([rx,rz,.8+rnd()*1.05,rnd()*6.3])}});
    for(let i=0;i<7;i++){const a=rnd()*6.3,rr=(.25+rnd()*.5)*POND.r;lilies.push([POND.x+Math.cos(a)*rr,POND.z+Math.sin(a)*rr,.26+rnd()*.22])}
    const o=new THREE.Object3D();
    const rIM=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1,0),M(0x5f584c,{roughness:.96,flatShading:true}),rocks.length);rIM.castShadow=!LOW;rIM.receiveShadow=true;
    rocks.forEach(([x,z,s,ry],i)=>{o.position.set(x,HF.h(x,z)+s*.3,z);o.scale.set(s,s*.8,s);o.rotation.set(ry*.4,ry,ry*.2);o.updateMatrix();rIM.setMatrixAt(i,o.matrix)});S.add(rIM);
    const reedGeo=new THREE.ConeGeometry(.05,1,4);const reedIM=new THREE.InstancedMesh(reedGeo,M(0x3f5228,{roughness:.95}),reeds.length*3);
    let k=0;reeds.forEach(([x,z,h,ry])=>{const gy=HF.h(x,z);for(let b=0;b<3;b++){const hh=h*(.7+((b*37)%10)/22);
      o.position.set(x+Math.cos(ry+b*2.1)*.13,gy+hh/2,z+Math.sin(ry+b*2.1)*.13);o.scale.set(1,hh,1);o.rotation.set(Math.cos(ry+b)*.07,ry,Math.sin(ry+b)*.07);o.updateMatrix();reedIM.setMatrixAt(k++,o.matrix)}});
    reedIM.count=k;S.add(reedIM);
    const lilyIM=new THREE.InstancedMesh(new THREE.CircleGeometry(1,10),M(0x2e4a26,{roughness:.6,side:THREE.DoubleSide}),lilies.length);
    lilies.forEach(([x,z,s],i)=>{o.position.set(x,WATER_Y+.03,z);o.scale.set(s,s,s);o.rotation.set(-Math.PI/2,0,i);o.updateMatrix();lilyIM.setMatrixAt(i,o.matrix)});S.add(lilyIM)})();
  /* ---------- grass tufts near the road and the water (one draw call) ---------- */
  (function(){if(LOW)return;const T=[];let seed=709;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;let tries=0;
    while(T.length<420&&tries<9000){tries++;const x=(rnd()-.5)*372,z=(rnd()-.5)*372;const rd=roadNear(x,z).d;
      const pd=Math.hypot(x-POND.x,z-POND.z);
      if(!(rd<20||pd<POND.r*1.9))continue;if(rd<4.2)continue;if(pd<pondR(x,z)*1.05)continue;
      const h=HF.h(x,z);if(HF.slope(x,z)>1.15)continue;if(h<-.2)continue;
      T.push([x,h,z,.5+rnd()*.7,rnd()*6.3])}
    const g=new THREE.PlaneGeometry(.42,.44);g.translate(0,.2,0);
    const im=new THREE.InstancedMesh(g,new THREE.MeshLambertMaterial({color:0x51612f,side:THREE.DoubleSide}),T.length*2);
    const o=new THREE.Object3D();let k=0;
    T.forEach(([x,h,z,s,ry])=>{for(let b=0;b<2;b++){o.position.set(x,h,z);o.scale.set(s,s*(1+b*.2),s);o.rotation.set(0,ry+b*1.57,0);o.updateMatrix();im.setMatrixAt(k++,o.matrix)}});
    im.count=k;S.add(im);SCN.grass=im})();
  /* ---------- labels ---------- */
  function label(txt,sub,w=1024,h=256,dark=false){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=dark?'#f2eee6':'#15140f';x.fillRect(0,0,w,h);x.fillStyle=dark?'#15140f':'#f2eee6';x.textAlign='center';x.textBaseline='middle';x.font=`600 ${sub?h*.4:h*.5}px -apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Inter,"Helvetica Neue",Arial,sans-serif`;x.fillText(txt,w/2,sub?h*.38:h*.5,w*.94);if(sub){x.font=`600 ${h*.12}px ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace`;x.fillStyle=dark?'#6b675f':'#9a958c';x.fillText(sub.toUpperCase(),w/2,h*.78,w*.94)}const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
  function signPost(x,z,y,txt,sub,dark,ry){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;S.add(g);const post=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,3.2,6),steel);post.position.y=1.6;g.add(post);const b=new THREE.Mesh(new THREE.BoxGeometry(6.4,1.8,.2),dark?paper:ink);b.position.y=3.8;g.add(b);const pl=new THREE.Mesh(new THREE.PlaneGeometry(6.2,1.6),new THREE.MeshBasicMaterial({map:label(txt,sub,1024,264,dark)}));pl.position.set(0,3.8,.12);g.add(pl);const p2=pl.clone();p2.rotation.y=Math.PI;p2.position.z=-.12;g.add(p2);staticBox(x,y+1.6,z,.15,1.6,.15);return g}
  signPost(POND.x+POND.r+2,POND.z,0,'The pond','drive in · you can swim',false,-Math.PI/2);
  signPost(PG.x,PG.z+15,0,'Playground','ramps · crates · cones',false,0);
  signPost(RAMPYARD.x,RAMPYARD.z+13,BR_H,'Ramp yard','launch off all three',false,0);
  signPost(BR_START.x-BR_OUT.x*4,BR_START.z-BR_OUT.z*4,BR_H,'Ramp yard →','off the main road',false,Math.atan2(BR_OUT.x,BR_OUT.z));
  signPost(PEAK.x-BR_OUT.x*7,PEAK.z-BR_OUT.z*7,PEAK_H,'The summit','stop for the view',false,Math.atan2(BR_OUT.x,BR_OUT.z));
  const TL=new THREE.TextureLoader();
  /* Billboard textures are the single biggest thing the GPU has to carry in this scene: the
     page's photos are up to 1600px wide, and a full-size copy of each one costs megabytes of
     VRAM and texture bandwidth per frame for a picture that is never more than a few hundred
     pixels on screen. So the game keeps its own small power-of-two copy of every photo,
     decoded once and shared by every board that uses it. The plane's own aspect ratio undoes
     the stretch, so squaring the image off costs nothing visually. */
  const TEXC=new Map();
  function gameTex(src,ar){
    if(TEXC.has(src))return TEXC.get(src);
    const W=ar>1.2?512:256,H=ar>1.2?256:512;
    const c=document.createElement('canvas');c.width=W;c.height=H;
    const cx=c.getContext('2d');cx.fillStyle='#b9b2a4';cx.fillRect(0,0,W,H);
    const t=new THREE.CanvasTexture(c);
    t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;
    t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.anisotropy=1;
    if('colorSpace' in t&&THREE.SRGBColorSpace)t.colorSpace=THREE.SRGBColorSpace;
    else if('encoding' in t&&THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;
    TEXC.set(src,t);
    /* Decoding seventeen full-resolution photos at once is what actually stalls a laptop:
       each one is a 1000x1900-ish bitmap, and held together they are hundreds of megabytes
       before a single one has been scaled down. So they go through a one-at-a-time queue,
       and where the browser supports it createImageBitmap decodes straight to the small size
       instead of decoding full-size first and shrinking after. */
    TQ.push(()=>new Promise(done=>{
      const draw=img=>{try{cx.drawImage(img,0,0,W,H);t.needsUpdate=true}catch(_){}
        if(img&&img.close)img.close();done()};
      // Reuse the page image when it is already decoded. This avoids a second file:// or
      // cross-origin decode, which can leave a Three.js billboard black while the DOM image works.
      const pageImg=[...document.images].find(im=>im.src===src||im.currentSrc===src);
      if(pageImg&&pageImg.complete&&pageImg.naturalWidth){draw(pageImg)}
      else {const im=new Image();im.decoding='async';im.onload=()=>draw(im);im.onerror=()=>done();im.src=src}
    }));
    tqPump();
    return t;
  }
  const TQ=[];let tqBusy=false;
  function tqPump(){if(tqBusy||!TQ.length)return;tqBusy=true;
    const job=TQ.shift();
    Promise.resolve(job()).then(()=>{tqBusy=false;
      /* one photo per idle slot, so decoding never lands inside a frame that is trying to draw */
      setTimeout(tqPump,0)})}
  /* ---------- lifter figure (animated) ---------- */
  function lifter(){const S1=1.5,root=new THREE.Group(),pelvis=new THREE.Group();pelvis.position.y=.96;root.add(pelvis);root.scale.setScalar(S1);
    const cyl=(r,l,m)=>{const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.9,l,8),m);c.position.y=-l/2;c.castShadow=true;g.add(c);return g};
    const hip=new THREE.Mesh(new THREE.BoxGeometry(.42,.2,.24),ink);pelvis.add(hip);
    const torso=new THREE.Group();pelvis.add(torso);const chest=new THREE.Mesh(new THREE.BoxGeometry(.56,.72,.3),tankM);chest.position.y=.38;chest.castShadow=true;torso.add(chest);
    const sh=new THREE.Mesh(new THREE.BoxGeometry(.7,.16,.3),skin);sh.position.y=.74;torso.add(sh);
    const head=new THREE.Group();head.position.y=.9;torso.add(head);head.add(new THREE.Mesh(new THREE.SphereGeometry(.16,10,10),skin));
    // curly crop that hugs the skull: a cap pushed back to the hairline, curls on top, face clear
    {const cap=new THREE.Mesh(new THREE.SphereGeometry(.163,10,10),hairM);cap.position.set(0,.028,-.03);cap.scale.set(1.02,1.0,.98);head.add(cap)}
    const HR=[{y:.115,r:.07,n:8,skip:2},{y:.06,r:.12,n:10,skip:.8},{y:-.01,r:.15,n:10,skip:.25},{y:-.075,r:.125,n:7,skip:.1}];
    HR.forEach((rg,ri)=>{for(let i=0;i<rg.n;i++){const a=(i/rg.n)*6.283+ri*.6;
      if(Math.sin(a)>rg.skip)continue;const jr=rg.r*(1+((i*7)%5-2)*.02);
      const b=new THREE.Mesh(new THREE.SphereGeometry(.052+((i*3)%4)*.007,6,6),hairM);
      b.position.set(Math.cos(a)*jr,rg.y+((i*5)%4-1.5)*.016,Math.sin(a)*jr*.94-.02);head.add(b)}})
    const arm=s=>{const g=new THREE.Group();g.position.set(s*.36,.72,0);torso.add(g);const up=cyl(.075,.34,skin);g.add(up);const el=new THREE.Group();el.position.y=-.34;up.add(el);const fo=cyl(.065,.32,skin);el.add(fo);const hand=new THREE.Object3D();hand.position.y=-.34;fo.add(hand);return {sh:g,up,el,hand}};
    const leg=s=>{const g=new THREE.Group();g.position.set(s*.13,-.05,0);pelvis.add(g);const th=cyl(.1,.48,ink);g.add(th);const kn=new THREE.Group();kn.position.y=-.48;th.add(kn);const sn=cyl(.08,.46,ink);kn.add(sn);const f=new THREE.Mesh(new THREE.BoxGeometry(.14,.07,.28),paper);f.position.set(0,-.48,.08);sn.add(f);return {g,th,kn}};
    const A=[arm(-1),arm(1)],Lg=[leg(-1),leg(1)];
    const bar=new THREE.Group();root.add(bar);const rod=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,2.1,8),steel);rod.rotation.z=Math.PI/2;bar.add(rod);
    return {root,pelvis,torso,A,Lg,bar,rod}}
  function addPlates(bar,list){list.forEach(([x,m,r])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.07,20),m);p.rotation.z=Math.PI/2;p.position.x=x;p.castShadow=true;bar.add(p)})}
  const anims=[];const tmpV=new THREE.Vector3();
  function poseSquat(F,t){const a=(1-Math.cos(t))/2;const th=-1.35*a,sn=.72*a;F.Lg.forEach(l=>{l.th.rotation.x=th;l.kn.rotation.x=sn-th});F.pelvis.position.y=.96-(.48*(1-Math.cos(th))+.46*(1-Math.cos(sn)));F.pelvis.position.z=-(.48*Math.sin(-th)-.46*Math.sin(sn));F.torso.rotation.x=.55*a;F.A.forEach((q,i)=>{q.sh.rotation.set(.9,0,(i?-1:1)*.55);q.el.rotation.x=-2.3});F.root.updateMatrixWorld(true);F.A[0].hand.getWorldPosition(tmpV);const L0=F.root.worldToLocal(tmpV.clone());F.A[1].hand.getWorldPosition(tmpV);const L1=F.root.worldToLocal(tmpV.clone());F.bar.position.set(0,(L0.y+L1.y)/2+.04,(L0.z+L1.z)/2-.04)}
  function poseDeadLego(F,t){ // drives the shared LEGO-minifig rig (buildLifter) through a full bottom-to-lockout deadlift rep
    const b=(1-Math.cos(t))/2; // 0 = bottom, bar gripped near the platform · 1 = standing lockout
    const torsoX=.74-(.74-.03)*b,hipY=.93+(1.25-.93)*b,legX=-.16+.16*b,barY=.5+(1.45-.5)*b,barZ=.75-(.75-.55)*b;
    // armL/armR are children of torso, so their rotation COMPOUNDS with torsoX in world space.
    // Real deadlift form keeps the arms hanging near-vertical (as straight "straps") the whole rep,
    // so we solve for the local rotation that cancels the torso's lean and leaves a small world-space angle.
    const armWorld=.1+.05*b,armX=armWorld-torsoX;
    F.torso.rotation.x=torsoX;F.torso.position.y=hipY;
    F.legL.rotation.x=F.legR.rotation.x=legX;
    F.armL.rotation.x=F.armR.rotation.x=armX;
    F.bar.position.set(0,barY,barZ);
    F.head.rotation.x=-torsoX*.5;
  }
  function poseDead(F,t){const b=(1-Math.cos(t))/2;const hin=1.05*(1-b),th=-.75*(1-b),sn=.28*(1-b);F.Lg.forEach(l=>{l.th.rotation.x=th;l.kn.rotation.x=sn-th});F.pelvis.position.y=.96-(.48*(1-Math.cos(th))+.46*(1-Math.cos(sn)));F.pelvis.position.z=-(.48*Math.sin(-th)-.46*Math.sin(sn))-.12*(1-b);F.torso.rotation.x=hin;F.A.forEach((q,i)=>{q.sh.rotation.set(-hin+.05,0,(i?-1:1)*.08);q.el.rotation.x=0});F.root.updateMatrixWorld(true);F.A[0].hand.getWorldPosition(tmpV);const L0=F.root.worldToLocal(tmpV.clone());F.A[1].hand.getWorldPosition(tmpV);const L1=F.root.worldToLocal(tmpV.clone());F.bar.position.set(0,(L0.y+L1.y)/2,(L0.z+L1.z)/2)}
  function poseBench(F,t){const a=(1-Math.cos(t))/2;F.Lg.forEach(l=>{l.th.rotation.x=-.2;l.kn.rotation.x=1.75});F.torso.rotation.x=0;F.A.forEach((q,i)=>{q.sh.rotation.set(-1.57+.9*(1-a),0,(i?-1:1)*(.75*(1-a)+.12));q.el.rotation.x=-1.5*(1-a)});F.root.updateMatrixWorld(true);F.A[0].hand.getWorldPosition(tmpV);const L0=F.root.worldToLocal(tmpV.clone());F.A[1].hand.getWorldPosition(tmpV);const L1=F.root.worldToLocal(tmpV.clone());F.bar.position.set(0,(L0.y+L1.y)/2,(L0.z+L1.z)/2)}
  /* ---------- stations ---------- */
  const stations=[];
  /* Boards are the bulk of the draw calls out here and almost all of them are behind you or
     over a hill at any moment. A cheap distance check every eighth frame keeps only the ones
     you could actually be looking at in the render list. */
  const CULL=[];
  /* One caption design for the whole journey: a red rule, a small chapter line, the story
     line big, and the date/place small underneath. Dark panel, bone type, no glow — it reads
     as a printed board bolted to a frame rather than a screen floating in a field. */
  const CAPS='600 %dpx -apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Inter,"Helvetica Neue",Arial,sans-serif';
  const CAPM='600 %dpx ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace';
  function capTex(eye,line,sub){const w=1024,h=224,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
    x.fillStyle='#14130f';x.fillRect(0,0,w,h);x.fillStyle='#b8322f';x.fillRect(0,0,w,7);
    x.textBaseline='middle';x.textAlign='left';
    if(eye){x.fillStyle='#9a958c';x.font=CAPM.replace('%d',26);x.fillText(eye.toUpperCase(),36,48,w-72)}
    x.fillStyle='#f2eee6';let fs=78;x.font=CAPS.replace('%d',fs);
    while(x.measureText(line).width>w-72&&fs>32){fs-=3;x.font=CAPS.replace('%d',fs)}
    x.fillText(line,36,eye?(sub?122:128):(sub?112:118));
    if(sub){x.fillStyle='#8d887f';x.font=CAPM.replace('%d',24);x.fillText(sub.toUpperCase(),36,186,w-72)}
    const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
  /* Every chapter gets the same board and the board carries four things and no more:
     the chapter number, the title, the hook line from the bible, and the key stat. The
     story itself is told in the overlay as you pass, so no board is ever a wall of text. */
  function chapTex(ch,name,hook,stat){const w=1024,h=368,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
    x.fillStyle='#14130f';x.fillRect(0,0,w,h);x.fillStyle='#b8322f';x.fillRect(0,0,w,10);
    x.textBaseline='middle';x.textAlign='left';
    x.fillStyle='#b8322f';x.font=CAPM.replace('%d',32);x.fillText('CHAPTER '+ch,44,66);
    x.fillStyle='#f2eee6';let fs=86;x.font=CAPS.replace('%d',fs);
    while(x.measureText(name.toUpperCase()).width>w-88&&fs>30){fs-=3;x.font=CAPS.replace('%d',fs)}
    x.fillText(name.toUpperCase(),44,142);
    /* The hook is the line that has to land at speed, so it wraps onto a second line rather
       than shrinking away to nothing — a long quote stays the same size as a short one. */
    if(hook){let hs=42,ln=[];
      for(;;){x.font='italic '+CAPS.replace('%d',hs);
        ln=[];let cur='';hook.split(' ').forEach(word=>{const t=cur?cur+' '+word:word;
          if(x.measureText(t).width>w-88&&cur){ln.push(cur);cur=word}else cur=t});if(cur)ln.push(cur);
        if(ln.length<=2||hs<=26)break;hs-=2}
      x.fillStyle='#a8a297';
      ln.slice(0,2).forEach((t,i)=>x.fillText(t,44,206+i*(hs+10)));}
    if(stat){x.fillStyle='#211e18';x.fillRect(38,286,w-76,58);x.fillStyle='#b8322f';x.fillRect(38,286,7,58);
      x.fillStyle='#e6e0d4';let ss=32;x.font=CAPM.replace('%d',ss);
      while(x.measureText(stat).width>w-128&&ss>15){ss-=1;x.font=CAPM.replace('%d',ss)}
      x.fillText(stat,64,316)}
    const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
  const CHAPM=new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
  /* These two used to be positioned by their CENTRE at a hardcoded height, which ignored
     how tall the caption itself is — so on every photo board the caption's bottom edge sank
     0.226 into the top of the picture frame, and the strip prints overlapped by 0.091.
     Take the top of the thing underneath instead and stack the caption above it, so the
     clearance is correct whatever the board's width works out to. */
  function chapBoard(g,J,w,topY,gap){const bh=w*.359;
    const lab=new THREE.Mesh(new THREE.PlaneGeometry(w,bh),
      new THREE.MeshBasicMaterial({map:chapTex(J.chapter,J.name,J.hook,J.stat),side:THREE.DoubleSide}));
    lab.position.set(0,topY+bh/2+(gap===undefined?.45:gap),.3);g.add(lab);return lab}
  function titleBoard(g,eye,line,sub,w,topY){const bh=w*.219;
    const lab=new THREE.Mesh(new THREE.PlaneGeometry(w,bh),new THREE.MeshBasicMaterial({map:capTex(eye,line,sub),side:THREE.DoubleSide}));
    lab.position.set(0,topY+bh/2+.35,.26);g.add(lab)}
  JOURNEY.forEach(J=>{
    if(J.photos&&J.photos.length){J.photo=J.photos[0].src;J.ar=J.photos[0].ar}
    const dist=stDist(J);const {x,y,z,ry}=faceAt(J.u,J.side,dist,26);const rroad=placeAt(J.u,J.side,dist).ry;
    const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;S.add(g);J.pos=new THREE.Vector3(x,y,z);J.group=g;
    /* The board turns up the road so you can read it. The gear underneath it — rack, bench,
       podium — is a physical thing in a field and still faces the road, so it gets its own
       group turned back by the difference. */
    const gq=new THREE.Group();gq.rotation.y=rroad-ry;g.add(gq);
    {const gy=HF.h(x,z);if(y-gy>.3){const hh=y-gy;const pil=new THREE.Mesh(new THREE.BoxGeometry(J.big?11:8,hh,1.2),skirtM);pil.position.y=-hh/2;g.add(pil)}}
    if(J.kind==='photo'){const h=J.big?8.6:13,w=h*(J.ar||.56);const frame=new THREE.Mesh(new THREE.BoxGeometry(w+.6,h+.6,.36),paper);frame.position.y=h/2+1.7;g.add(frame);const mat=new THREE.MeshBasicMaterial({map:gameTex(J.photo,J.ar||.56),side:THREE.DoubleSide});const pic=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);pic.position.set(0,h/2+1.7,.2);g.add(pic);const back=pic.clone();back.rotation.y=Math.PI;back.position.z=-.2;g.add(back);[-1,1].forEach(s=>{const post=new THREE.Mesh(new THREE.BoxGeometry(.3,1.8,.3),ink);post.position.set(s*(w/2-.7),.9,0);g.add(post)});chapBoard(g,J,Math.max(8.5,w+.6),h+2.0);staticBox(x,y+1.4,z,w/2+.3,1.4,.4,ry);
      if(J.anim==='deadlift'){const plat=new THREE.Group();plat.position.set(0,0,5.2);g.add(plat);const pf=new THREE.Mesh(new THREE.BoxGeometry(4.6,.14,3.6),M(0x2b241c,{roughness:.9}));pf.position.y=.07;pf.receiveShadow=true;plat.add(pf);const pinset=new THREE.Mesh(new THREE.BoxGeometry(3.6,.01,2.6),M(0x3a332a,{roughness:.88}));pinset.position.y=.145;plat.add(pinset);
        const F=buildLifter();F.root.scale.setScalar(.64);F.root.position.y=.14;F.root.rotation.y=Math.PI;F.root.traverse(o=>{if(o.isMesh)o.castShadow=true});plat.add(F.root);anims.push({F,pose:poseDeadLego,speed:1.15,g:J})}}
    if(J.kind==='sign'){const post=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,3.6,8),steel);post.position.y=1.8;g.add(post);const b=new THREE.Mesh(new THREE.BoxGeometry(8,2.4,.25),paper);b.position.y=4.4;b.castShadow=true;g.add(b);const pl=new THREE.Mesh(new THREE.PlaneGeometry(7.8,2.8),new THREE.MeshBasicMaterial({map:chapTex(J.chapter,J.name,J.hook,J.stat),side:THREE.DoubleSide}));pl.position.set(0,4.4,.14);g.add(pl);const p2=pl.clone();p2.rotation.y=Math.PI;p2.position.z=-.14;g.add(p2);staticBox(x,y+1.8,z,.15,1.8,.15)}
    if(J.kind==='rack'){const base=new THREE.Mesh(new THREE.BoxGeometry(6,.14,5),rubber);base.position.y=.07;base.receiveShadow=true;gq.add(base);[-1.5,1.5].forEach(s=>{[-1,1].forEach(zz=>{const up=new THREE.Mesh(new THREE.BoxGeometry(.18,4.6,.18),ink);up.position.set(s,2.3,zz*.9);up.castShadow=true;gq.add(up)})});const top=new THREE.Mesh(new THREE.BoxGeometry(3.2,.16,.16),ink);top.position.set(0,4.6,.9);gq.add(top);const top2=top.clone();top2.position.z=-.9;gq.add(top2);
      const F=lifter();F.root.position.y=.14;F.root.rotation.y=Math.PI;gq.add(F.root);addPlates(F.bar,[[-.95,red,.34],[-.88,red,.34],[-.81,red,.34],[-.75,paper,.2],[.95,red,.34],[.88,red,.34],[.81,red,.34],[.75,paper,.2]]);anims.push({F,pose:poseSquat,speed:1.3,g:J});
      chapBoard(g,J,7.5,4.68);staticBox(x,y+2.3,z,1.7,2.3,1,ry)}
    if(J.kind==='bench'){const base=new THREE.Mesh(new THREE.BoxGeometry(6,.14,5),rubber);base.position.y=.07;gq.add(base);const pad=new THREE.Mesh(new THREE.BoxGeometry(.75,.18,2.1),red);pad.position.set(0,.66,.15);pad.castShadow=true;gq.add(pad);[-.7,.9].forEach(zz=>{const leg=new THREE.Mesh(new THREE.BoxGeometry(.5,.58,.1),ink);leg.position.set(0,.3,zz);gq.add(leg)});[-1.25,1.25].forEach(s=>{const up=new THREE.Mesh(new THREE.BoxGeometry(.14,2.3,.14),ink);up.position.set(s,1.15,-.95);gq.add(up)});
      const F=lifter();F.root.rotation.x=-Math.PI/2;F.root.position.set(0,.75+.12*1.5,-1.2);gq.add(F.root);addPlates(F.bar,[[-.95,red,.34],[-.88,blue,.3],[.95,red,.34],[.88,blue,.3]]);anims.push({F,pose:poseBench,speed:1.4,g:J});
      chapBoard(g,J,7.5,2.3);staticBox(x,y+1,z,1.6,1,1.6,ry)}
    if(J.kind==='trophy'){const pod=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.7,1.2,28),paper);pod.position.y=.6;pod.castShadow=true;pod.receiveShadow=true;gq.add(pod);const step=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.6,.5,24),ink);step.position.y=1.45;gq.add(step);const cup=new THREE.Group();cup.position.y=1.7;gq.add(cup);J.cup=cup;const body=new THREE.Mesh(new THREE.LatheGeometry([[.25,0],[.55,.1],[.3,.3],[.35,.9],[1.0,1.9],[1.2,2.5],[1.15,2.6],[.98,2.55],[.9,2.2],[.5,1.4],[.3,.9],[.28,.35],[.5,.15],[.25,.05]].map(([r,yy])=>new THREE.Vector2(r,yy)),32),gold);body.castShadow=true;cup.add(body);[-1,1].forEach(s=>{const hh=new THREE.Mesh(new THREE.TorusGeometry(.5,.08,8,20,3.2),gold);hh.position.set(s*1.15,1.9,0);hh.rotation.y=Math.PI/2;hh.rotation.z=s>0?-1.57:1.57;cup.add(hh)});chapBoard(g,J,8,4.3);[-3.6,3.6].forEach(s=>{const ban=new THREE.Mesh(new THREE.BoxGeometry(1.4,5,.1),red);ban.position.set(s,3.5,-1.5);gq.add(ban)});staticBox(x,y+.6,z,2.6,.6,2.6)}
    /* The rest of that checkpoint's reference photos, installed as a short run of prints
       right after the main board — its own points on the curve, same side of the road, the
       same faceAt mechanism the beat signs already use safely. Earlier this nested the
       prints inside the board's own approach-tilted group and offset them along its local
       axis; that axis leans up to 26 deg off the true road normal, so on a tight bend one
       print swung back across the road instead of away from it. Placing each on the curve
       directly means a print can only ever move further out, never back over the lane. */
    if(J.photos&&J.photos.length>1){
      J.photos.slice(1).forEach((P,k)=>{
        const n2=k+1,du=7+6*(n2-1),u2=(J.u+du/LEN)%1,dist2=dist+1.2*n2;
        const q=faceAt(u2,J.side,dist2,22);
        const h=6.2,w=h*P.ar;
        const gp=new THREE.Group();gp.position.set(q.x,q.y,q.z);gp.rotation.y=q.ry;S.add(gp);
        {const gy2=HF.h(q.x,q.z);if(y-gy2>.3){const hh=y-gy2;const pil=new THREE.Mesh(new THREE.BoxGeometry(6,hh,1),skirtM);pil.position.y=-hh/2;gp.add(pil)}}
        const fr=new THREE.Mesh(new THREE.BoxGeometry(w+.4,h+.4,.28),paper);fr.position.y=h/2+1.4;gp.add(fr);
        const pi=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:gameTex(P.src,P.ar),side:THREE.DoubleSide}));
        pi.position.set(0,h/2+1.4,.16);gp.add(pi);const back=pi.clone();back.rotation.y=Math.PI;back.position.z=-.16;gp.add(back);
        [-1,1].forEach(s2=>{const po=new THREE.Mesh(new THREE.BoxGeometry(.22,1.5,.22),ink);po.position.set(s2*(w/2-.45),.75,0);gp.add(po)});
        if(P.cap)titleBoard(gp,'',P.cap,'',Math.max(5.4,w+.4),h+1.8);
        staticBox(q.x,y+1.1,q.z,w/2+.2,1.1,.3,q.ry);
        CULL.push(gp);
      });}
    CULL.push(g);
    stations.push(J);
  });
  /* ---------- the rest of the album: prints between the chapters ---------- */
  EXTRAS.forEach(E=>{
    const {x,y,z,ry}=faceAt(E.u,E.side,11,24);
    const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;S.add(g);
    {const gy=HF.h(x,z);if(y-gy>.3){const hh=y-gy;const pil=new THREE.Mesh(new THREE.BoxGeometry(6,hh,1.1),skirtM);pil.position.y=-hh/2;g.add(pil)}}
    const h=E.ar>1?5.4:8.2,w=h*E.ar;
    const fr=new THREE.Mesh(new THREE.BoxGeometry(w+.45,h+.45,.3),paper);fr.position.y=h/2+1.5;g.add(fr);
    const pm=new THREE.MeshBasicMaterial({map:gameTex(E.src,E.ar),side:THREE.DoubleSide});
    const pi=new THREE.Mesh(new THREE.PlaneGeometry(w,h),pm);pi.position.set(0,h/2+1.5,.17);g.add(pi);const back=pi.clone();back.rotation.y=Math.PI;back.position.z=-.17;g.add(back);
    [-1,1].forEach(s2=>{const po=new THREE.Mesh(new THREE.BoxGeometry(.24,1.6,.24),ink);po.position.set(s2*(w/2-.5),.8,0);g.add(po)});
    titleBoard(g,'',E.cap,E.sub,Math.max(6.5,w+.45),h+2.8);
    staticBox(x,y+1.2,z,w/2+.2,1.2,.35,ry);
    CULL.push(g);
  });
  /* ---------- the run of small boards that carries the story between chapters ----------
     The chapters sit 30 to 50 metres apart, which leaves no room for a second billboard, so
     the words in between are told the way roadside boards have always told them: a short run
     of small signs read one after another at speed, each one finishing the last, ending at a
     marker that names the chapter you are driving into. Every board in a run is turned up the
     road, low and close to the shoulder, so it arrives in the windscreen and not the window.
     The whole run is built after the first frame in small time-boxed batches, so none of it
     shows up as a hitch on the way in. */
  /* The short signs between the chapters, each one a line out of that chapter's own story
     in the bible. They set up the board you are about to reach; they never restate it. */
  const BEATS={
    cp01:['He came home happy that evening.','Nobody asked how he was.'],
    cp02:['The first sessions were rubbish.','Then somebody showed him the lifts.'],
    cp03:['Protein, creatine, and a friend who taught him.','His body took its first flight.'],
    cp04:['They needed a name on the entry list.','He said yes without hesitating.'],
    cp05:['Squats first.','Their warm-up was his third attempt.'],
    cp06:['Same day. Deadlift portion.','Watch what comes off the floor at the top.'],
    cp07:['The arms a relative called weak.','They carry real weight now.'],
    cp08:['Six kilos of mostly fat.','Then he actually read the research.'],
    cp09:['Ten months of infection.','He trained through every one of them.'],
    cp10:['Four months out of surgery.','Look up.'],
    cp11:['Four weeks after the record.','He crawled out of that gym.'],
    cp12:['Fifteen kilos left.','This time he is in no hurry.'],
    cp13:['That was his road.','The next board is yours.'],
  };
  const beatPanelG=new THREE.BoxGeometry(4.6,1.3,.16),beatFaceG=new THREE.PlaneGeometry(4.4,1.14),beatPostG=new THREE.BoxGeometry(.15,1,.15);
  const markPanelG=new THREE.BoxGeometry(5.4,2.3,.2),markFaceG=new THREE.PlaneGeometry(5.2,2.14),markPostG=new THREE.BoxGeometry(.2,1,.2);
  const markRuleG=new THREE.BoxGeometry(.22,2.3,.22);
  function beatTex(txt){const w=512,h=128,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
    x.fillStyle='#14130f';x.fillRect(0,0,w,h);x.fillStyle='#b8322f';x.fillRect(0,0,9,h);
    x.fillStyle='#f2eee6';x.textAlign='center';x.textBaseline='middle';
    let fs=54;x.font=CAPS.replace('%d',fs);
    while(x.measureText(txt).width>w-52&&fs>22){fs-=2;x.font=CAPS.replace('%d',fs)}
    x.fillText(txt,w/2+4,h/2+2);
    const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
  function markTex(eye,name){const w=512,h=224,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
    x.fillStyle='#f2eee6';x.fillRect(0,0,w,h);x.fillStyle='#b8322f';x.fillRect(0,0,w,8);
    x.textAlign='center';x.textBaseline='middle';
    x.fillStyle='#8a857b';x.font=CAPM.replace('%d',26);x.fillText(eye.toUpperCase(),w/2,68,w-48);
    x.fillStyle='#15140f';let fs=66;x.font=CAPS.replace('%d',fs);
    while(x.measureText(name).width>w-56&&fs>26){fs-=2;x.font=CAPS.replace('%d',fs)}
    x.fillText(name,w/2,146,w-48);
    const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
  /* Nothing in a run is allowed to end up in the water, so a side that lands in the pond
     flips to the other shoulder rather than sinking. */
  const wetAt=(u,side,d)=>{const q=faceAt(u,side,d,0);return Math.hypot(q.x-POND.x,q.z-POND.z)<POND.r+4};
  const drySide=(u,side,d)=>wetAt(u,side,d)?-side:side;
  function beatSign(u,side0,txt){
    const side=drySide(u,side0,7.8);const {x,y,z,ry}=faceAt(u,side,7.8,20);
    /* Sit on whichever is higher, the road line or the ground under the sign, and grow the
       posts down to meet the other one, so a board never floats on an embankment or buries
       itself in the hillside. */
    const gy=HF.h(x,z),base=Math.max(y,gy),drop=base-gy,ph=1.55+drop;
    const g=new THREE.Group();g.position.set(x,base,z);g.rotation.y=ry;S.add(g);
    const pan=new THREE.Mesh(beatPanelG,ink);pan.position.y=2.1;pan.castShadow=true;g.add(pan);
    const fa=new THREE.Mesh(beatFaceG,new THREE.MeshBasicMaterial({map:beatTex(txt)}));fa.position.set(0,2.1,.09);g.add(fa);
    [-1,1].forEach(sx=>{const po=new THREE.Mesh(beatPostG,steel);po.scale.y=ph;po.position.set(sx*1.75,ph/2-drop,0);g.add(po)});
    staticBox(x,base+1.9,z,2.3,.9,.2,ry);g.userData.story='beat';CULL.push(g);return g}
  function chapterMark(u,side0,J){
    const side=drySide(u,side0,8.8);const {x,y,z,ry}=faceAt(u,side,8.8,22);
    const gy=HF.h(x,z),base=Math.max(y,gy),drop=base-gy,ph=2.1+drop;
    const g=new THREE.Group();g.position.set(x,base,z);g.rotation.y=ry;S.add(g);
    const pan=new THREE.Mesh(markPanelG,paper);pan.position.y=3.3;pan.castShadow=true;g.add(pan);
    const fa=new THREE.Mesh(markFaceG,new THREE.MeshBasicMaterial({map:markTex('Chapter '+J.chapter,J.name)}));fa.position.set(0,3.3,.11);g.add(fa);
    const rule=new THREE.Mesh(markRuleG,red);rule.position.set(-2.85,3.3,0);g.add(rule);
    [-1,1].forEach(sx=>{const po=new THREE.Mesh(markPostG,steel);po.scale.y=ph;po.position.set(sx*2.1,ph/2-drop,0);g.add(po)});
    staticBox(x,base+2.6,z,2.7,1.3,.25,ry);g.userData.story='mark';CULL.push(g);return g}
  const BUILD=[];
  JOURNEY.forEach((J,i)=>{
    const prev=i?JOURNEY[i-1].u:.004,gap=(J.u-prev)*LEN,lines=BEATS[J.id]||[];
    if(gap<20){if(lines[1])BUILD.push(()=>beatSign(J.u-gap*.5/LEN,J.side,lines[1]))}
    else{
      lines.slice(0,2).forEach((t,k)=>{const back=gap*(k?.42:.62);BUILD.push(()=>beatSign(J.u-back/LEN,J.side,t))});
      BUILD.push(()=>chapterMark(J.u-gap*.22/LEN,-J.side,J));
    }});
  (function(){
    const drain=()=>{const t0=performance.now();
      while(BUILD.length&&performance.now()-t0<7)BUILD.shift()();
      if(BUILD.length)('requestIdleCallback' in window)?requestIdleCallback(drain,{timeout:300}):setTimeout(drain,50)};
    ('requestIdleCallback' in window)?requestIdleCallback(drain,{timeout:1200}):setTimeout(drain,300);
  })();
  const trophyLight=new THREE.PointLight(0xffd27a,1.1,18);const TJ=JOURNEY.find(j=>j.kind==='trophy');trophyLight.position.set(TJ.pos.x,5,TJ.pos.z);S.add(trophyLight);
  /* ---------- gates ---------- */
  function gate(u,txt,fn,when){const {p,ry}=at(u);const g=new THREE.Group();g.position.set(p.x,p.y,p.z);g.rotation.y=ry;S.add(g);[-1,1].forEach(s=>{const post=new THREE.Mesh(new THREE.BoxGeometry(.5,6.5,.5),paper);post.position.set(s*4.4,3.25,0);post.castShadow=true;g.add(post);staticBox(p.x+Math.cos(ry)*s*4.4,3,p.z-Math.sin(ry)*s*4.4,.3,3,.3)});const top=new THREE.Mesh(new THREE.BoxGeometry(9.8,1.4,.5),paper);top.position.y=6.9;g.add(top);const t=new THREE.Mesh(new THREE.PlaneGeometry(9.4,1.2),new THREE.MeshBasicMaterial({map:label(txt,'',1024,140,true)}));t.position.set(0,6.9,.3);g.add(t);const t2=t.clone();t2.rotation.y=Math.PI;t2.position.z=-.3;g.add(t2);return {pos:new THREE.Vector3(p.x,p.y,p.z),fn,when,cool:0,used:false}}
  /* Gates trigger on contact, so nothing that leaves the game is allowed to be one. The
     WhatsApp gate that used to sit here opened wa.me the moment a wheel crossed u=.96 —
     no click, no confirmation, and it re-armed on every lap. It is gone. The only way out
     of this world to WhatsApp now is the button in the chapter 13 panel, and that button
     asks first. Driving, steering, checkpoints, timers and stray taps cannot reach it. */
  const gates=[gate(.985,'Start your trial →',()=>finale(),()=>seen.size>=8)];
  /* One confirmation, used by every external link in the game. */
  const extPanel=$('#dext'),extGo=$('#dextgo');let extURL='';
  function askExternal(url){extURL=url;extPanel.classList.add('on');driving=false;for(const k in key)key[k]=0}
  function closeExternal(){extPanel.classList.remove('on');extURL=''}
  $('#dextx').onclick=closeExternal;$('#dextcancel').onclick=closeExternal;
  extGo.onclick=()=>{const u=extURL;closeExternal();if(u)window.open(u,'_blank','noopener')};
  /* ---------- playground obstacles ---------- */
  function crateMesh(s){const m=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),M(0xd9d2c2));m.castShadow=true;m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:0x15140f})));return m}
  for(let i=0;i<4;i++)for(let j=0;j<4-i;j++)dynBox(crateMesh(1.1),PG.x-8+(j-1.5+i*.5)*1.15,i*1.12+.6,PG.z-6,.55,.55,.55,6);
  const coneBodies=[];
  function cone(x,z){const g=new THREE.Group();const c=new THREE.Mesh(new THREE.ConeGeometry(.35,1,10),red);c.castShadow=true;g.add(c);const b=new THREE.Mesh(new THREE.BoxGeometry(.8,.08,.8),ink);b.position.y=-.46;g.add(b);coneBodies.push({b:dynBox(g,x,.5,z,.35,.5,.35,1),x,z})}
  for(let i=0;i<7;i++)cone(PG.x+8,PG.z-10+i*3.2);
  function tire(x,z){const g=new THREE.Group();const t=new THREE.Mesh(new THREE.TorusGeometry(.5,.24,8,16),rubber);t.rotation.x=Math.PI/2;g.add(t);dynBox(g,x,.3,z,.75,.25,.75,4)}
  for(let i=0;i<5;i++)tire(PG.x-3+i*1.6,PG.z+6);
  function ramp(x,z,ry,ang=.2,base=0){const y=base+.5;const m=new THREE.Mesh(new THREE.BoxGeometry(4,.5,7),M(0x8f2a2a));m.position.set(x,y,z);m.rotation.set(-ang,ry,0,'YXZ');m.castShadow=true;m.receiveShadow=true;S.add(m);const b=new CANNON.Body({mass:0,material:gM});b.addShape(new CANNON.Box(new CANNON.Vec3(2,.25,3.5)));b.position.set(x,y,z);const q1=new CANNON.Quaternion();q1.setFromAxisAngle(new CANNON.Vec3(0,1,0),ry);const q2=new CANNON.Quaternion();q2.setFromAxisAngle(new CANNON.Vec3(1,0,0),-ang);b.quaternion=q1.mult(q2);world.addBody(b)}
  ramp(PG.x,PG.z-2,0);ramp(PG.x-2,PG.z+12,Math.PI/2,.16);
  /* ---------- ramp yard: three jumps down the side spur, for the ramp-rally mission.
     The yard sits on top of the Platform hill, not at ground level, so every prop here
     is based off BR_H instead of the 0 the playground's props assume. */
  const RAMPS=[{x:RAMPYARD.x-6,z:RAMPYARD.z-5,ry:0},{x:RAMPYARD.x+6,z:RAMPYARD.z+1,ry:Math.PI/2},{x:RAMPYARD.x-1,z:RAMPYARD.z+9,ry:Math.PI}];
  RAMPS.forEach((r,i)=>{r.id=i;ramp(r.x,r.z,r.ry,.22,BR_H)});
  const rampHit=new Set();
  /* ---------- woodland: two species, clustered into copses, all instanced ---------- */
  const treePts=[];
  (function(){
    let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    const okSpot=(x,z,minRoad)=>{
      if(roadNear(x,z).d<minRoad)return false;
      if((x-POND.x)**2+(z-POND.z)**2<(POND.r+6)**2)return false;
      if((x-PG.x)**2+(z-PG.z)**2<24*24)return false;
      if(PADS.some(p=>(p.x-x)**2+(p.z-z)**2<p.r*p.r))return false;
      const h=HF.h(x,z);if(h<.35)return false;
      if(HF.slope(x,z)>1.35)return false;
      return true};
    // copses first, then loners, so the woods clump the way real ones do
    const centres=[];let tries=0;
    while(centres.length<16&&tries<800){tries++;const x=(rnd()-.5)*360,z=(rnd()-.5)*360;if(okSpot(x,z,26))centres.push([x,z])}
    centres.forEach(([cx,cz])=>{const n=7+(rnd()*11|0);
      for(let i=0;i<n;i++){const a=rnd()*6.283,r=rnd()*18+2,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;
        if(!okSpot(x,z,13))continue;treePts.push([x,z,.78+rnd()*.85,rnd()<.62?0:1,rnd()*6.283])}});
    tries=0;while(treePts.length<150&&tries<4000){tries++;const x=(rnd()-.5)*368,z=(rnd()-.5)*368;
      if(!okSpot(x,z,13))continue;treePts.push([x,z,.7+rnd()*.8,rnd()<.5?0:1,rnd()*6.283])}
    const conifer=treePts.filter(t=>t[3]===0),broad=treePts.filter(t=>t[3]===1);
    const o=new THREE.Object3D();
    const barkM=M(0x40301f,{roughness:1,map:grainTex(48,.14,2,.55)});
    const needleM=leafM,broadM=M(0x47632a,{roughness:.96});
    // conifers: a trunk plus three stacked cones
    if(conifer.length){
      const trIM=new THREE.InstancedMesh(new THREE.CylinderGeometry(.16,.28,2.6,6),barkM,conifer.length);
      const tiers=[[3.0,1.95,1.55],[4.3,1.5,1.35],[5.4,1.05,1.05]];
      const tierIM=tiers.map(()=>new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,8),needleM,conifer.length));
      tierIM.forEach(m=>{m.castShadow=!LOW;m.receiveShadow=true});
      conifer.forEach(([x,z,s,,ry],i)=>{const y=HF.h(x,z);
        o.position.set(x,y+1.3*s,z);o.scale.set(s,s,s);o.rotation.set(0,ry,0);o.updateMatrix();trIM.setMatrixAt(i,o.matrix);
        tiers.forEach(([ty,rad,hh],k)=>{o.position.set(x,y+ty*s,z);o.scale.set(rad*s,hh*s,rad*s);o.rotation.set(0,ry+k*.7,0);o.updateMatrix();tierIM[k].setMatrixAt(i,o.matrix)})});
      S.add(trIM);tierIM.forEach(m=>S.add(m))}
    // broadleaf: short trunk, three offset canopy blobs
    if(broad.length){
      const trIM=new THREE.InstancedMesh(new THREE.CylinderGeometry(.2,.32,2.1,6),barkM,broad.length);
      const blobs=[[0,2.9,0,1.55],[.7,3.5,.25,1.15],[-.6,3.3,-.35,1.05]];
      const blobIM=blobs.map(()=>new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),broadM,broad.length));
      blobIM.forEach(m=>{m.castShadow=!LOW;m.receiveShadow=true});
      broad.forEach(([x,z,s,,ry],i)=>{const y=HF.h(x,z);
        o.position.set(x,y+1.05*s,z);o.scale.set(s,s,s);o.rotation.set(0,ry,0);o.updateMatrix();trIM.setMatrixAt(i,o.matrix);
        blobs.forEach(([bx,by,bz,br],k)=>{o.position.set(x+bx*s,y+by*s,z+bz*s);o.scale.set(br*s,br*s*.85,br*s);o.rotation.set(ry+k,ry*.5,k*.6);o.updateMatrix();blobIM[k].setMatrixAt(i,o.matrix)})});
      S.add(trIM);blobIM.forEach(m=>S.add(m))}
    // only the roadside trees need to be solid; the rest are scenery and cost nothing
    treePts.forEach(([x,z,s])=>{if(roadNear(x,z).d<42)staticBox(x,HF.h(x,z)+1.2,z,.34,1.2,.34)});
    // low scrub, one draw call, to stop the ground reading as bare polygons
    if(!LOW){const B=[];let t2=0;
      while(B.length<170&&t2<6000){t2++;const x=(rnd()-.5)*372,z=(rnd()-.5)*372;
        if(roadNear(x,z).d<5.5)continue;
        if((x-POND.x)**2+(z-POND.z)**2<(pondR(x,z)*1.02)**2)continue;
        if(HF.h(x,z)<-.15||HF.slope(x,z)>1.5)continue;
        B.push([x,z,.55+rnd()*.8,rnd()*6.283])}
      const bIM=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),M(0x475a2a,{roughness:.98}),B.length);bIM.receiveShadow=true;
      B.forEach(([x,z,s,ry],i)=>{o.position.set(x,HF.h(x,z)+s*.42,z);o.scale.set(s,s*.62,s*.9);o.rotation.set(ry*.3,ry,ry*.2);o.updateMatrix();bIM.setMatrixAt(i,o.matrix)});
      S.add(bIM)}
  })();
  /* ---------- gold rings (the ring-run mission) ---------- */
  const ringPts=[];{let seed=91;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;let tries=0;
    while(ringPts.length<6&&tries<5000){tries++;const x=(rnd()-.5)*250,z=(rnd()-.5)*250;
      if(roadNear(x,z).d<15)continue;
      if((x-POND.x)**2+(z-POND.z)**2<(POND.r+8)**2)continue;if((x-PG.x)**2+(z-PG.z)**2<24*24)continue;
      if(PADS.some(p=>(p.x-x)**2+(p.z-z)**2<(p.r+6)**2))continue;
      if(ringPts.some(q=>(q[0]-x)**2+(q[1]-z)**2<30*30))continue;
      if(HF.h(x,z)<.2||HF.slope(x,z)>.85)continue;
      ringPts.push([x,z])}}
  const rings=ringPts.map((p,i)=>{const y=HF.h(p[0],p[1]);const g=new THREE.Group();g.position.set(p[0],y,p[1]);S.add(g);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.5,.13,8,24),new THREE.MeshBasicMaterial({color:0xd4a83a}));ring.rotation.x=Math.PI/2;ring.position.y=1.6;g.add(ring);
    const ring2=ring.clone();ring2.scale.setScalar(.6);ring2.material=new THREE.MeshBasicMaterial({color:0xf2eee6,transparent:true,opacity:.7});g.add(ring2);
    const glowQ=new THREE.PointLight(0xd4a83a,1.2,11);glowQ.position.y=1.6;g.add(glowQ);
    g.visible=false;
    return {i,pos:g.position,ring,ring2,g,done:false}});
  let ringIdx=0;
  /* ---------- missions ---------- */
  const MSAVE=(()=>{try{return JSON.parse(localStorage.getItem('sl_miss')||'{}')}catch(e){return{}}})();
  const LAP_TARGET=80000;
  const MISSIONS=[
    {id:'rings',name:'Ring run',hint:'Drive through all six gold rings',goal:6},
    {id:'cones',name:'Cone slalom',hint:'Knock over seven cones at the playground',goal:7},
    {id:'swim',name:'Take it swimming',hint:'Drive into the pond and wade through',goal:1},
    {id:'air',name:'Send it',hint:'Catch a full second of air off a ramp',goal:1},
    {id:'ramps',name:'Ramp rally',hint:'Take the side road and launch off all three yard ramps',goal:3},
    {id:'story',name:'Read the whole thing',hint:'Pull up at all 13 chapters',goal:13},
    {id:'lap',name:'Hot lap',hint:'Time a lap under '+(LAP_TARGET/1000)+'s',goal:1},
  ];
  MISSIONS.forEach(m=>{m.prog=0;if(MSAVE[m.id]){m.done=true;m.prog=m.goal}});
  const missEl=$('#dmiss'),missH=$('#dmissh'),missS=$('#dmisss'),missC=$('#dmissc');
  function missSave(){try{const o={};MISSIONS.forEach(m=>{if(m.done)o[m.id]=1});localStorage.setItem('sl_miss',JSON.stringify(o))}catch(e){}}
  const curMission=()=>MISSIONS.find(m=>!m.done)||null;
  function missUI(){const m=curMission(),n=MISSIONS.filter(x=>x.done).length;
    missC.textContent=n+'/'+MISSIONS.length;
    if(!m){missH.textContent='All missions cleared';missS.textContent='You ate. No crumbs left.';}
    else{missH.textContent=m.name;missS.textContent=m.hint+(m.goal>1?'  ·  '+Math.min(m.prog,m.goal)+'/'+m.goal:'')}
    rings.forEach((r,i)=>{r.g.visible=!!m&&m.id==='rings'&&i===ringIdx&&!r.done})}
  function missSet(id,v){const m=MISSIONS.find(x=>x.id===id);if(!m||m.done)return;
    if(v<=m.prog)return;m.prog=v;
    if(m.prog>=m.goal){m.done=true;missSave();blip(680,.3,.13);toastMsg('Mission done · '+m.name);
      const nx=curMission();if(nx)setTimeout(()=>toastMsg('Next up · '+nx.name),1900);else setTimeout(()=>toastMsg('Every mission cleared. Built different.'),1900)}
    else blip(560,.16,.1);
    missUI()}
  missUI();
  /* ---------- circuit: the road is a closed loop, so it is also a race track ---------- */
  const TLEN=curve.getLength();
  const lapEl=$('#dlap'),lapT=$('#dlapt'),lapN=$('#dlapn'),lapB=$('#dlapb'),lapSecs=$$('#dlap .lsec i');
  const boardEl=$('#dboard'),bdList=$('#dbdlist'),bdName=$('#dbdname'),bdSave=$('#dbdsave'),bdNote=$('#dbdnote'),raceBtn=$('#drace');
  function fmtT(ms){if(!isFinite(ms)||ms<=0)return '--:--.--';const m=Math.floor(ms/60000),s=Math.floor(ms%60000/1000),c=Math.floor(ms%1000/10);
    return m+':'+String(s).padStart(2,'0')+'.'+String(c).padStart(2,'0')}
  let LAPS=(()=>{try{const a=JSON.parse(localStorage.getItem('sl_laps')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}})();
  let raceMode=false,lapArmed=false,lapStart=0,lapProg=0,lapNo=0,lapVoid=false,offT=0,lapU=0,lapInit=false,
      bestMs=LAPS.reduce((a,l)=>Math.min(a,l.ms||Infinity),Infinity),lastMs=0,pendingMs=0,remoteRows=null;
  const cfg=()=>(window.SL_CFG||{});
  const backendReady=()=>{const u=cfg().SCRIPT_URL||'';return /^https:\/\//.test(u)&&!/PASTE_/.test(u)};
  function startRace(){
    if(raceMode){stopRace();return}
    raceMode=true;lapArmed=true;lapVoid=false;lapProg=0;lapNo=0;lapInit=false;offT=0;
    lapEl.classList.add('on');lapEl.classList.remove('void','best');raceBtn.textContent='Stop timing';
    lapT.textContent='--:--.--';lapN.textContent='Cross the line';lapB.textContent='Best '+fmtT(bestMs);
    toastMsg('Timing armed · cross the start gate to begin');blip(700,.14)}
  function stopRace(){raceMode=false;lapArmed=false;lapEl.classList.remove('on');raceBtn.textContent='Time a lap'}
  function lapRow(l,me){return '<li class="'+(me?'me pend':'')+'"><span class="p">'+l.p+'</span><span><span class="n">'+
    String(l.n||'Anon').replace(/[<>&]/g,'')+'</span> <span class="v">'+String(l.veh||'').replace(/[<>&]/g,'')+'</span></span><span class="t">'+fmtT(l.ms)+'</span></li>'}
  function renderBoard(){
    const base=(remoteRows&&remoteRows.length?remoteRows:LAPS).slice();
    const saved=LAPS.some(l=>l.ms===pendingMs);
    // the lap you just set shows straight away, marked unsaved until you put a name to it
    if(pendingMs&&!saved)base.push({n:(function(){try{return localStorage.getItem('sl_name')||'You'}catch(e){return 'You'}})(),ms:pendingMs,veh:V.label,pend:true});
    const rows=base.sort((a,b)=>a.ms-b.ms).slice(0,8);
    bdList.innerHTML=rows.length?rows.map((l,i)=>lapRow(Object.assign({p:i+1},l),!!l.pend)).join('')
      :'<li class="em">No laps yet. Hit \u201cTime a lap\u201d, cross the start gate and go round once.</li>';
    bdNote.textContent=pendingMs&&!saved?('Your last lap: '+fmtT(pendingMs)+' \u00b7 add a name and save it')
      :(backendReady()?'Times are shared with everyone who plays this track.':'Times are kept on this device. The shared board switches on once the site owner sets the endpoint in CONFIG.')}
  async function pullBoard(){if(!backendReady())return;
    try{const r=await fetch(cfg().SCRIPT_URL+'?board=1',{method:'GET'});const d=await r.json();
      if(d&&Array.isArray(d.laps)){remoteRows=d.laps.filter(l=>l&&isFinite(l.ms));renderBoard()}}catch(e){}}
  /* This used to report success the moment the request came back at all, without ever
     looking at what the server said. The sheet could reply "implausible lap" and the
     button would still say Saved, so a time that never reached the board looked like it
     had. Read the answer and tell the truth about it. */
  async function pushLap(entry){if(!backendReady())return false;
    try{const r=await fetch(cfg().SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({key:cfg().SECRET_KEY,type:'lap',name:entry.n,ms:entry.ms,vehicle:entry.veh,at:new Date().toISOString()})});
      const t=await r.text();let d={};try{d=JSON.parse(t)}catch(e){}
      return !!(r.ok&&d.ok!==false)}catch(e){return false}}
  function openBoard(){boardEl.classList.add('on');try{bdName.value=localStorage.getItem('sl_name')||''}catch(e){}
    bdSave.disabled=!pendingMs;renderBoard();pullBoard()}
  function closeBoard(){boardEl.classList.remove('on')}
  raceBtn.onclick=startRace;$('#dboardb').onclick=openBoard;$('#dboardx').onclick=closeBoard;
  boardEl.addEventListener('click',e=>{if(e.target===boardEl)closeBoard()});
  bdSave.onclick=async()=>{if(!pendingMs)return;
    const nm=(bdName.value||'').trim().slice(0,14)||'Anon';try{localStorage.setItem('sl_name',nm)}catch(e){}
    const entry={n:nm,ms:pendingMs,veh:V.label,at:Date.now()};
    LAPS.push(entry);LAPS.sort((a,b)=>a.ms-b.ms);LAPS=LAPS.slice(0,8);
    try{localStorage.setItem('sl_laps',JSON.stringify(LAPS))}catch(e){}
    bdSave.disabled=true;bdSave.textContent='Saving…';
    const ok=await pushLap(entry);
    /* Either way the time is already in this browser, so say which of the two it is
       rather than claiming the shared board took it when it did not. */
    bdSave.textContent=ok?'Saved':'Saved on this device';
    if(ok)pullBoard();
    renderBoard();setTimeout(()=>{bdSave.textContent='Save my time'},1900)};
  function lapDone(ms){
    lastMs=ms;pendingMs=ms;
    const isBest=ms<bestMs;if(isBest)bestMs=ms;
    lapEl.classList.toggle('best',isBest);
    blip(isBest?880:640,.35,.14);
    toastMsg((isBest?'New best lap · ':'Lap · ')+fmtT(ms));
    if(ms<LAP_TARGET)missSet('lap',1);
    lapB.textContent='Best '+fmtT(bestMs);
    setTimeout(()=>lapEl.classList.remove('best'),2600)}
  /* ---------- start / finish gantry ---------- */
  (function(){const {p,ry,n}=at(0);
    // painted line
    const lw=6.2,seg=10;const cg=document.createElement('canvas');cg.width=seg*2;cg.height=8;const cx=cg.getContext('2d');
    for(let i=0;i<seg;i++)for(let j=0;j<2;j++){cx.fillStyle=(i+j)%2?'#f2eee6':'#1b1a16';cx.fillRect(i*2,j*4,2,4)}
    const lt=new THREE.CanvasTexture(cg);lt.magFilter=THREE.NearestFilter;
    const line=new THREE.Mesh(new THREE.PlaneGeometry(lw,1.5),new THREE.MeshBasicMaterial({map:lt}));
    line.rotation.set(-Math.PI/2,0,-ry);line.position.set(p.x,p.y+.115,p.z);S.add(line);
    const g=new THREE.Group();g.position.set(p.x,p.y,p.z);g.rotation.y=ry;S.add(g);
    [-1,1].forEach(s=>{const post=new THREE.Mesh(new THREE.BoxGeometry(.4,7,.4),paper);post.position.set(s*4.6,3.5,0);post.castShadow=!LOW;g.add(post);
      staticBox(p.x+Math.cos(ry)*s*4.6,p.y+3,p.z-Math.sin(ry)*s*4.6,.26,3,.26)});
    const top=new THREE.Mesh(new THREE.BoxGeometry(10,1.5,.45),ink);top.position.y=7.3;g.add(top);
    const lab=new THREE.Mesh(new THREE.PlaneGeometry(9.6,1.3),new THREE.MeshBasicMaterial({map:label('START · FINISH','one lap · beat the board',1024,150,false)}));
    lab.position.set(0,7.3,.26);g.add(lab);const l2=lab.clone();l2.rotation.y=Math.PI;l2.position.z=-.26;g.add(l2)})();
  /* ---------- traffic lights ----------
     Placed between chapters and clear of the two overtaking stretches, so they never
     hold a car up in the middle of a story beat or fight the overtake logic. The AI
     reads them: amber and red both bring a car down to a stop a few metres short of
     the line, and it pulls away again when the light goes green. You are not forced
     to stop — this is a story road, not a driving test — but the traffic behaves. */
  const LIGHTS=[{u:.185,off:0},{u:.545,off:9.5}];
  const L_CYCLE=20,L_GREEN=11,L_AMBER=2;
  const lightPhase=(L,ts)=>{const t=((ts+L.off)%L_CYCLE+L_CYCLE)%L_CYCLE;
    return t<L_GREEN?0:t<L_GREEN+L_AMBER?1:2};   // 0 green, 1 amber, 2 red
  (function(){
    const housing=M(0x15140f);
    LIGHTS.forEach(L=>{
      const q=faceAt(L.u,1,7,14);
      const g=new THREE.Group();g.position.set(q.x,q.y,q.z);g.rotation.y=q.ry;S.add(g);
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(.09,.115,4.4,7),steel);pole.position.y=2.2;g.add(pole);
      const box=new THREE.Mesh(new THREE.BoxGeometry(.52,1.34,.34),housing);box.position.set(0,4.15,.1);g.add(box);
      const hood=new THREE.Mesh(new THREE.BoxGeometry(.6,.08,.42),housing);hood.position.set(0,4.86,.14);g.add(hood);
      // top to bottom: red, amber, green
      L.lamps=[0,1,2].map(k=>{
        const m=new THREE.MeshBasicMaterial({color:0x201f1c,fog:true});
        const s=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),m);
        s.position.set(0,4.58-k*.42,.28);g.add(s);return m});
      staticBox(q.x,q.y+2,q.z,.17,2,.17);
      CULL.push(g)})})();
  const L_ON=[0xe0352b,0xf0a828,0x35c05a],L_OFF=[0x2c1512,0x2b2412,0x13291a];
  function updLights(ts){for(let i=0;i<LIGHTS.length;i++){const L=LIGHTS[i],ph=lightPhase(L,ts);
    for(let k=0;k<3;k++)L.lamps[k].color.setHex(ph===k?L_ON[k]:L_OFF[k])}}
  /* ---------- traffic: other cars actually driving the loop ---------- */
  const traffic=[];
  (function(){
    const n=LOW?3:5,COLS=[0x2f4f9e,0xb8322f,0xd9d2c2,0x3f8a56,0x8a857b];
    const bodyM=new THREE.MeshPhongMaterial({vertexColors:true,shininess:38,specular:0x2a2a2a});
    const bodyIM=new THREE.InstancedMesh(new THREE.BoxGeometry(1.85,.62,4),bodyM,n);
    const cabIM=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.58,1.9),M(0x1b1a16,{roughness:.35,metalness:.35}),n);
    const whIM=new THREE.InstancedMesh(new THREE.CylinderGeometry(.42,.42,.34,12),rubber,n*4);
    const tlIM=new THREE.InstancedMesh(new THREE.BoxGeometry(1.5,.14,.06),M(0xff3b30,{emissive:0xff3b30,emissiveIntensity:.9}),n);
    const hlIM=new THREE.InstancedMesh(new THREE.BoxGeometry(1.4,.16,.06),M(0xfff2c0,{emissive:0xfff2c0,emissiveIntensity:1.1}),n);
    bodyIM.castShadow=!LOW;cabIM.castShadow=!LOW;
    [bodyIM,cabIM,whIM,tlIM,hlIM].forEach(m=>{m.frustumCulled=false;S.add(m)});
    for(let i=0;i<n;i++){
      const lane=(i%2?1:-1)*2.05;
      const bd=new CANNON.Body({mass:0,type:CANNON.Body.KINEMATIC,material:oM});
      bd.addShape(new CANNON.Box(new CANNON.Vec3(.95,.62,2.05)));world.addBody(bd);
      traffic.push({u:(i+.35)/n,lane,base:6.5+((i*53)%10)/10*5.5,spd:0,bd});
      bodyIM.setColorAt(i,new THREE.Color(COLS[i%COLS.length]))}
    if(bodyIM.instanceColor)bodyIM.instanceColor.needsUpdate=true;
    const o=new THREE.Object3D();
    traffic.mesh={bodyIM,cabIM,whIM,tlIM,hlIM,o,n}})();
  function updTraffic(dt,now){
    const {bodyIM,cabIM,whIM,tlIM,hlIM,o}=traffic.mesh;
    for(let i=0;i<traffic.length;i++){const t=traffic[i];
      const {p,tg,n}=at(t.u);
      const x=p.x+n.x*t.lane,z=p.z+n.z*t.lane,y=p.y;
      // ease off if the player is right in front, so they nose along instead of ramming through
      let want=t.base;
      if(active){const dx=car.position.x-x,dz=car.position.z-z,ahead=dx*tg.x+dz*tg.z,off=Math.abs(dx*n.x+dz*n.z);
        const d2=Math.hypot(dx,dz);
        const OV=(progU>.100&&progU<.178)||(progU>.252&&progU<.338);
        if(ahead>0&&ahead<13&&off<2.6)want=Math.max(1.2,t.base*(ahead/13));
        else if(OV&&ahead>-7&&ahead<36&&off<9)want=t.base*2.4;
        if(d2>150)want=t.base}
      /* A light that is not green brings them down to a stop about four metres short
         of it. The ramp is on distance rather than a hard brake, so they roll up to the
         line and ease away again when it turns, instead of snapping to a halt. */
      {let sd=Infinity;
       for(let li=0;li<LIGHTS.length;li++){const L=LIGHTS[li];
         if(lightPhase(L,now/1000)===0)continue;
         let du=L.u-t.u;if(du<0)du+=1;
         const d=du*TLEN;if(d<30&&d<sd)sd=d}
       if(sd<30)want=Math.min(want,Math.max(0,(sd-4)/9)*t.base)}
      t.spd+=(want-t.spd)*Math.min(1,dt*1.4);
      t.u=(t.u+(t.spd*dt)/TLEN)%1;
      const yaw=Math.atan2(tg.x,tg.z);
      const pitch=Math.atan2(hAt(t.u+.004)-hAt(t.u-.004),TLEN*.008);
      o.rotation.order='YXZ';
      o.position.set(x,y+.86,z);o.rotation.set(-pitch,yaw,0);o.scale.set(1,1,1);o.updateMatrix();bodyIM.setMatrixAt(i,o.matrix);
      o.position.set(x,y+1.45,z-0);o.updateMatrix();cabIM.setMatrixAt(i,o.matrix);
      o.position.set(x+tg.x*2.05,y+.72,z+tg.z*2.05);o.updateMatrix();hlIM.setMatrixAt(i,o.matrix);
      o.position.set(x-tg.x*2.05,y+.78,z-tg.z*2.05);o.updateMatrix();tlIM.setMatrixAt(i,o.matrix);
      const rot=now/1000*t.spd*2.2;
      if(frameN%2===0)for(let w=0;w<4;w++){const fz=w<2?1.35:-1.35,sx=w%2?1:-1;
        o.position.set(x+tg.x*fz+n.x*sx*.92,y+.42,z+tg.z*fz+n.z*sx*.92);
        o.rotation.set(rot,yaw,Math.PI/2);o.updateMatrix();whIM.setMatrixAt(i*4+w,o.matrix)}
      t.bd.position.set(x,y+.86,z);
      t.bd.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),yaw);
      t.bd.velocity.set(tg.x*t.spd,0,tg.z*t.spd);
      t.bd.aabbNeedsUpdate=true}
    bodyIM.instanceMatrix.needsUpdate=true;cabIM.instanceMatrix.needsUpdate=true;if(frameN%2===0)whIM.instanceMatrix.needsUpdate=true;
    tlIM.instanceMatrix.needsUpdate=true;hlIM.instanceMatrix.needsUpdate=true}
  /* ---------- animals: circling birds, grazing herds, ducks on the pond ---------- */
  function bird(){const g=new THREE.Group();const bm=new THREE.MeshBasicMaterial({color:0x232220,side:THREE.DoubleSide});
    const body=new THREE.Mesh(new THREE.ConeGeometry(.1,.46,6),bm);body.rotation.x=Math.PI/2;g.add(body);
    const wL=new THREE.Mesh(new THREE.PlaneGeometry(.58,.16),bm);wL.position.x=-.28;g.add(wL);const wR=wL.clone();wR.position.x=.28;g.add(wR);
    return {g,wL,wR}}
  const birds=[];for(let i=0;i<5;i++){const b=bird();const y=8+((i*37)%10)/10*4;b.g.position.set(POND.x+(i-2)*4,y,POND.z+(i%2?4:-4));S.add(b.g);
    birds.push({...b,a:i*1.26,r:8+((i*53)%10),sp:.14+((i*29)%10)/10*.14,y})}
  // grazers: a neck that actually drops to the grass, and they scatter when a car comes at them
  function grazer(hex){const g=new THREE.Group();const bm=M(hex,{roughness:.95});
    const body=new THREE.Mesh(new THREE.BoxGeometry(1.05,.58,.46),bm);body.position.y=.72;body.castShadow=!LOW;g.add(body);
    const rump=new THREE.Mesh(new THREE.BoxGeometry(.3,.44,.42),bm);rump.position.set(-.6,.7,0);g.add(rump);
    const tail=new THREE.Mesh(new THREE.BoxGeometry(.07,.3,.07),bm);tail.position.set(-.76,.56,0);g.add(tail);
    const neck=new THREE.Group();neck.position.set(.48,.86,0);g.add(neck);
    const nk=new THREE.Mesh(new THREE.BoxGeometry(.24,.42,.26),bm);nk.position.set(.05,-.14,0);nk.rotation.z=-.35;neck.add(nk);
    const head=new THREE.Mesh(new THREE.BoxGeometry(.34,.24,.26),bm);head.position.set(.24,-.34,0);neck.add(head);
    const muzzle=new THREE.Mesh(new THREE.BoxGeometry(.13,.14,.2),M(0x2a2622,{roughness:.9}));muzzle.position.set(.42,-.38,0);neck.add(muzzle);
    [-1,1].forEach(s=>{const ear=new THREE.Mesh(new THREE.BoxGeometry(.06,.14,.1),bm);ear.position.set(.14,-.19,s*.13);ear.rotation.z=.4;neck.add(ear)});
    const legs=[];for(const sx of[-1,1])for(const sz of[-1,1]){const lg=new THREE.Mesh(new THREE.BoxGeometry(.13,.62,.13),bm);
      lg.position.set(.34*sx,.34,.16*sz);g.add(lg);legs.push(lg)}
    return {g,legs,neck,tail}}
  const critters=[];const CRIT_COL=[0x6b4a30,0x8a7458,0x4c4842,0x715a3e,0x93785a];
  {let seed=311;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    const herds=[];let tries=0;
    while(herds.length<(LOW?2:3)&&tries<900){tries++;const x=(rnd()-.5)*220,z=(rnd()-.5)*220;
      if(roadNear(x,z).d<26)continue;
      if((x-POND.x)**2+(z-POND.z)**2<(POND.r+14)**2)continue;if((x-PG.x)**2+(z-PG.z)**2<30*30)continue;
      if(HF.h(x,z)<.4||HF.slope(x,z)>.55)continue;
      if(herds.some(h=>(h[0]-x)**2+(h[1]-z)**2<70*70))continue;
      herds.push([x,z])}
    herds.forEach(([hx,hz])=>{const n=3+(rnd()*3|0);
      for(let i=0;i<n;i++){const a=rnd()*6.283,r=rnd()*9;
        const x=hx+Math.cos(a)*r,z=hz+Math.sin(a)*r;
        const c=grazer(CRIT_COL[(critters.length)%CRIT_COL.length]);
        c.g.position.set(x,HF.h(x,z),z);c.g.rotation.y=rnd()*6.283;S.add(c.g);
        critters.push({...c,herd:{x:hx,z:hz},tgt:{x,z},t:1+rnd()*7,state:'graze',ry:c.g.rotation.y,spd:0})}})}
  const ducks=[];
  {let seed=1207;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    const bodyM=M(0xe8e4da,{roughness:.8}),headM2=M(0x2f4a33,{roughness:.7}),beakM=M(0xd9a83a,{roughness:.6});
    for(let i=0;i<(LOW?2:4);i++){const g=new THREE.Group();
      const b=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),bodyM);b.scale.set(1.35,.8,.9);g.add(b);
      const t=new THREE.Mesh(new THREE.ConeGeometry(.11,.28,6),bodyM);t.position.set(-.3,.06,0);t.rotation.z=-1.9;g.add(t);
      const nk=new THREE.Mesh(new THREE.CylinderGeometry(.06,.07,.2,8),headM2);nk.position.set(.19,.16,0);g.add(nk);
      const hd=new THREE.Mesh(new THREE.SphereGeometry(.11,10,8),headM2);hd.position.set(.22,.29,0);g.add(hd);
      const bk2=new THREE.Mesh(new THREE.ConeGeometry(.05,.13,6),beakM);bk2.position.set(.33,.27,0);bk2.rotation.z=-1.57;g.add(bk2);
      const a=rnd()*6.283,rr=POND.r*(.25+rnd()*.45);
      g.position.set(POND.x+Math.cos(a)*rr,WATER_Y+.1,POND.z+Math.sin(a)*rr);S.add(g);
      ducks.push({g,a,r:rr,sp:(.12+rnd()*.2)*(rnd()<.5?-1:1),bob:rnd()*6.283})}}
  /* ---------- weather particles ---------- */
  const PCOUNT=LOW?500:1200;const pGeo=new THREE.BufferGeometry();const pPos=new Float32Array(PCOUNT*3);for(let i=0;i<PCOUNT;i++){pPos[i*3]=(Math.random()-.5)*90;pPos[i*3+1]=Math.random()*40;pPos[i*3+2]=(Math.random()-.5)*90}pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
  const pMat=new THREE.PointsMaterial({color:0xffffff,size:.3,transparent:true,opacity:.8,depthWrite:false});const parts=new THREE.Points(pGeo,pMat);parts.frustumCulled=false;parts.visible=false;S.add(parts);
  /* ---------- the sky belongs to the story, not to a button ----------
     The weather picker is gone. Each chapter names a mood instead, and the world cross-fades
     into it over a few seconds while you keep driving: the climb clouds over, the summit goes
     gold, the last stretch warms up. The fade is nothing but value-lerping across a handful of
     colours and light intensities — no terrain repaint, no rebuilt geometry, nothing that can
     spike a frame halfway through a corner. The ground tint rides on the terrain material,
     which multiplies the vertex colours the heightfield was painted with once at startup. */
  const DUSTA={day:.1,dusk:.34,rain:0,snow:.05,autumn:.3,night:.14};
  const wxOf=id=>WEATHERS.find(w=>w.id===id)||WEATHERS[0];
  const wxCopy=w=>({id:w.id,bg:w.bg,fog:[w.fog[0],w.fog[1]],hemi:w.hemi,sun:w.sun,sunI:w.sunI,ground:w.ground,leaf:w.leaf,
    part:w.part,slip:w.slip,skyTop:w.skyTop,skyBottom:w.skyBottom,star:w.star,sunA:w.sunA,water:w.water,
    terr:[w.terr[0],w.terr[1],w.terr[2]],ridge:[w.ridge[0],w.ridge[1],w.ridge[2]],dust:DUSTA[w.id]||0});
  const CHMOOD=['day','day','day','day','rain','dusk','dusk','day','dusk','day','autumn','autumn','dusk'];
  let wx=wxCopy(wxOf(CHMOOD[0])),wxA=wxCopy(wx),wxB=wxCopy(wx),wxT=1,wxDur=1,partA=wx.part?1:0,ridgeN=0;
  const _cA=new THREE.Color(),_cB=new THREE.Color();
  const mixHex=(a,b,t)=>_cA.setHex(a).lerp(_cB.setHex(b),t).getHex();
  const mixN=(a,b,t)=>a+(b-a)*t;
  const snapWx=w=>({id:w.id,bg:w.bg,fog:[w.fog[0],w.fog[1]],hemi:w.hemi,sun:w.sun,sunI:w.sunI,ground:w.ground,leaf:w.leaf,
    part:w.part,slip:w.slip,skyTop:w.skyTop,skyBottom:w.skyBottom,star:w.star,sunA:w.sunA,water:w.water,
    terr:[w.terr[0],w.terr[1],w.terr[2]],ridge:[w.ridge[0],w.ridge[1],w.ridge[2]],dust:w.dust});
  function applyWx(full){
    S.background.setHex(wx.bg);S.fog.color.setHex(wx.bg);S.fog.near=wx.fog[0];S.fog.far=wx.fog[1];
    hemi.intensity=wx.hemi;sun.color.setHex(wx.sun);sun.intensity=wx.sunI;
    /* the weather owns these numbers; the story bands below only bend them, so the
       baseline is re-read here rather than sampled once on the first frame. */
    fogNear0=wx.fog[0];fogFar0=wx.fog[1];hemi0=wx.hemi;sunI0=wx.sunI;
    groundM.color.setHex(wx.ground);leafM.color.setHex(wx.leaf);waterM.color.setHex(wx.water);
    terrainM.color.setRGB(wx.terr[0],wx.terr[1],wx.terr[2]);
    skyMat.uniforms.topColor.value.setHex(wx.skyTop);skyMat.uniforms.bottomColor.value.setHex(wx.skyBottom);
    starMat.uniforms.uOpacity.value=wx.star;moon.material.opacity=Math.min(1,wx.star*1.35);
    sunSprite.material.color.setHex(wx.sun);sunSprite.material.opacity=wx.sunA;dustMat.opacity=wx.dust;
    if(full||ridgeN++%6===0)ridgeTint(wx.ridge);
    parts.visible=partA>.02;pMat.opacity=.8*partA;
    pMat.color.setHex(wx.part==='rain'?0x9fb4c8:wx.part==='leaves'?0xd0692a:0xffffff);
    pMat.size=wx.part==='rain'?.16:wx.part==='leaves'?.5:.34;
    applyVehicle()}
  function mood(id,dur){const t=wxOf(id);if(t.id===wxB.id)return;wxA=snapWx(wx);wxB=wxCopy(t);wxT=0;wxDur=dur||6}
  /* Night is a mode you hold, not a mood the road hands you. While it is on it outranks
     the chapter moods and the summit's dusk, so driving into a new chapter does not
     yank the sky back to daylight underneath you; turning it off hands control back. */
  let nightOn=false;
  function toggleNight(){
    nightOn=!nightOn;
    const nb=$('#dnight');if(nb)nb.textContent=nightOn?'Daylight':'Night';
    if(nightOn){mood('night',3.5);toastMsg('Night · press N to bring the day back')}
    else{mood(atSummit?'dusk':(CHMOOD[act]||'day'),3.5);toastMsg('Daylight')}}
  function stepWx(dt){
    if(wxT>=1)return;
    wxT=Math.min(1,wxT+dt/wxDur);const e=wxT*wxT*(3-2*wxT);
    wx.bg=mixHex(wxA.bg,wxB.bg,e);wx.sun=mixHex(wxA.sun,wxB.sun,e);wx.ground=mixHex(wxA.ground,wxB.ground,e);
    wx.leaf=mixHex(wxA.leaf,wxB.leaf,e);wx.water=mixHex(wxA.water,wxB.water,e);
    wx.skyTop=mixHex(wxA.skyTop,wxB.skyTop,e);wx.skyBottom=mixHex(wxA.skyBottom,wxB.skyBottom,e);
    wx.fog[0]=mixN(wxA.fog[0],wxB.fog[0],e);wx.fog[1]=mixN(wxA.fog[1],wxB.fog[1],e);
    wx.hemi=mixN(wxA.hemi,wxB.hemi,e);wx.sunI=mixN(wxA.sunI,wxB.sunI,e);
    wx.star=mixN(wxA.star,wxB.star,e);wx.sunA=mixN(wxA.sunA,wxB.sunA,e);
    wx.dust=mixN(wxA.dust,wxB.dust,e);wx.slip=mixN(wxA.slip,wxB.slip,e);
    for(let i=0;i<3;i++){wx.terr[i]=mixN(wxA.terr[i],wxB.terr[i],e);wx.ridge[i]=mixN(wxA.ridge[i],wxB.ridge[i],e)}
    if(wxA.part===wxB.part){wx.part=wxB.part;partA=wxB.part?1:0}
    else if(e<.5){wx.part=wxA.part;partA=wxA.part?1-e*2:0}
    else{wx.part=wxB.part;partA=wxB.part?(e-.5)*2:0}
    if(wxT>=1)wx.id=wxB.id;
    applyWx(wxT>=1)}
  /* ---------- vehicle ---------- */
  const car=new THREE.Group();S.add(car);
  const chassisB=new CANNON.Body({mass:190,material:oM});chassisB.addShape(new CANNON.Box(new CANNON.Vec3(1,.32,2)),new CANNON.Vec3(0,.2,0));chassisB.addShape(new CANNON.Box(new CANNON.Vec3(.7,.3,.9)),new CANNON.Vec3(0,.8,-.2));chassisB.angularDamping=.4;chassisB.allowSleep=false;
  {const {p,tg}=at(.004);chassisB.position.set(p.x,1.2,p.z);chassisB.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.atan2(tg.x,tg.z))}
  const veh=new CANNON.RaycastVehicle({chassisBody:chassisB,indexRightAxis:0,indexUpAxis:1,indexForwardAxis:2});
  const wo={radius:.46,directionLocal:new CANNON.Vec3(0,-1,0),suspensionStiffness:40,suspensionRestLength:.42,frictionSlip:2.4,dampingRelaxation:2.8,dampingCompression:4.8,maxSuspensionForce:1e5,rollInfluence:.02,axleLocal:new CANNON.Vec3(-1,0,0),chassisConnectionPointLocal:new CANNON.Vec3(),maxSuspensionTravel:.4,customSlidingRotationalSpeed:-30,useCustomSlidingRotationalSpeed:true};
  [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([x,z])=>{wo.chassisConnectionPointLocal.set(x,.05,z);veh.addWheel(wo)});
  veh.addToWorld(world);
  /* Chassis dynamics constants. A raycast vehicle with none of this leans like a boat,
     keeps full grip on a wheel that is barely touching the road, and has no idea how
     fast it is going. Front bar is stiffer than the rear on purpose: that biases the
     car towards understeer, which is what you want on a road you are reading signs off.
     Drag is quadratic so the top end tapers on its own instead of hitting the governor,
     and downforce is taken along the body's own up axis so it plants the floor, not the world. */
  const ARB_F=5200,ARB_R=4200,AERO_DRAG=.3,LOAD_CAP=1.6,LOAD_EXP=.6;
  /* Careful with applyForce in this build of cannon: the second argument is a point in
     WORLD space, not an offset from the centre of mass, whatever the docs say. Passing
     a small offset silently applies the force way out near the world origin instead, and
     the lever arm that gives you grows the further you drive from spawn — which reads as
     the car spontaneously backflipping off a jump. Pass chassisB.position for a force
     through the centre of mass, or the actual contact point to apply it at a wheel. */
  const bodyUp=new CANNON.Vec3(),UPV=new CANNON.Vec3(0,1,0),fScratch=new CANNON.Vec3(),
        lvScratch=new CANNON.Vec3(),qScratch=new CANNON.Quaternion(),fwdScratch=new CANNON.Vec3(),
        wComp=[0,0,0,0],wLoad=[0,0,0,0];
  // visuals
  const vis={car:new THREE.Group()};car.add(vis.car);
  const add=(g,geo,m,x,y,z,sh=true)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=sh;g.add(o);return o};
  const headM=M(0xfff2c0,{emissive:0xfff2c0,emissiveIntensity:1.3}),tailM=M(0xff3b30,{emissive:0xff3b30,emissiveIntensity:.5});
  {const g=vis.car;add(g,new THREE.BoxGeometry(2,.62,4),paper,0,.5,0);add(g,new THREE.BoxGeometry(1.9,.35,.6),paper,0,.6,2.1);add(g,new THREE.BoxGeometry(1.7,.62,2),ink,0,1.1,-.2);const ws=add(g,new THREE.BoxGeometry(1.55,.42,.08),M(0x9cc0ff,{roughness:.15,metalness:.5}),0,1.12,.84,false);ws.rotation.x=-.25;add(g,new THREE.BoxGeometry(.55,.64,4.04),red,0,.5,0,false);add(g,new THREE.BoxGeometry(2.1,.1,.5),ink,0,1.25,-2);[-.6,.6].forEach(x=>add(g,new THREE.BoxGeometry(.34,.2,.06),headM,x,.68,2.41,false));[-.7,.7].forEach(x=>add(g,new THREE.BoxGeometry(.34,.16,.06),tailM,x,.62,-2.03,false));add(g,new THREE.CylinderGeometry(.5,.5,.12,18),red,0,1.48,-.2)}
  function wheelMesh(r,wd){const g=new THREE.Group();g.rotation.order='YXZ';const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,wd,18),rubber);t.rotation.z=Math.PI/2;t.castShadow=true;g.add(t);const rim=new THREE.Mesh(new THREE.CylinderGeometry(r*.58,r*.58,wd+.02,8),bone);rim.rotation.z=Math.PI/2;g.add(rim);return g}
  const wv={car:[0,1,2,3].map(()=>wheelMesh(.46,.42))};wv.car.forEach(w=>vis.car.add(w));
  const V=VEHS.car;
  function applyVehicle(){veh.wheelInfos.forEach((w,i)=>{const sx=i%2?-1:1;w.chassisConnectionPointLocal.set(sx*V.xw,.05,i<2?V.zf:V.zb);w.radius=V.r;w.suspensionRestLength=V.rest;w.frictionSlip=V.slip*wx.slip;w.rollInfluence=V.roll});chassisB.angularDamping=.4}
  function saveAll(){try{localStorage.setItem('sl_drive2',JSON.stringify({seen:[...seen]}))}catch(e){}}
  /* ---------- audio ---------- */
  let AC=null,eng=null,engG=null;
  function audioInit(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();eng=AC.createOscillator();eng.type='sawtooth';eng.frequency.value=55;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=320;engG=AC.createGain();engG.gain.value=0;eng.connect(f);f.connect(engG);engG.connect(AC.destination);eng.start()}catch(e){}}
  function blip(freq=880,dur=.12,vol=.08){if(!AC||muted)return;try{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(vol,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+dur);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+dur)}catch(e){}}
  let hornOn=false;
  function honk(on){if(!AC||muted)return;try{
    if(on&&!hornOn){hornOn=true;const g=AC.createGain();g.gain.setValueAtTime(0,AC.currentTime);g.gain.linearRampToValueAtTime(.12,AC.currentTime+.03);g.connect(AC.destination);
      const oscs=[392,466].map(f=>{const o=AC.createOscillator();o.type='square';o.frequency.value=f;o.connect(g);o.start();return o});
      hornNodes={g,oscs}}
    else if(!on&&hornOn){hornOn=false;if(hornNodes){const {g,oscs}=hornNodes;g.gain.setTargetAtTime(0,AC.currentTime,.04);setTimeout(()=>{try{oscs.forEach(o=>o.stop());g.disconnect()}catch(e){}},200);hornNodes=null}}
  }catch(e){}}
  let hornNodes=null;
  /* Not listed on the controls, not in the guide, not in the menu. Loud and sudden on
     purpose, but it goes through a hard limiter and the picture never strobes: a
     black/white flicker at that rate is a seizure risk, and the fright comes from the
     cut and the noise anyway, not from hammering the output. Honours the sound toggle,
     and will not fire again for eight seconds. */
  let egT=0;
  function eg(){
    const tn=performance.now();if(tn-egT<8000)return;egT=tn;
    if(AC&&!muted)try{
      const t0=AC.currentTime;
      const lim=AC.createDynamicsCompressor();
      lim.threshold.value=-9;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.001;lim.release.value=.12;
      lim.connect(AC.destination);
      const out=AC.createGain();out.connect(lim);
      out.gain.setValueAtTime(0,t0);
      out.gain.linearRampToValueAtTime(.8,t0+.01);
      out.gain.setValueAtTime(.8,t0+.42);
      out.gain.exponentialRampToValueAtTime(.0001,t0+1.15);
      const sh=AC.createWaveShaper();
      {const n=1024,c=new Float32Array(n);
       for(let i=0;i<n;i++){const x=i*2/n-1;c[i]=(1+22)*x*20*Math.PI/180/(Math.PI+22*Math.abs(x))}
       sh.curve=c;sh.oversample='2x';sh.connect(out)}
      // the crack that makes you flinch
      {const len=Math.floor(AC.sampleRate*.45),b=AC.createBuffer(1,len,AC.sampleRate),d=b.getChannelData(0);
       for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.1);
       const s=AC.createBufferSource();s.buffer=b;
       const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2700;bp.Q.value=.6;
       s.connect(bp);bp.connect(sh);s.start(t0)}
      // a semitone-crushed cluster falling away underneath it
      [92,97,139,146,233].forEach((f,i)=>{
        const o=AC.createOscillator();o.type=i%2?'sawtooth':'square';
        o.frequency.setValueAtTime(f*3.1,t0);
        o.frequency.exponentialRampToValueAtTime(f*.55,t0+1);
        const g=AC.createGain();g.gain.value=.2;
        o.connect(g);g.connect(sh);o.start(t0);o.stop(t0+1.2)});
      // and the shriek over the top
      {const o=AC.createOscillator();o.type='sawtooth';
       o.frequency.setValueAtTime(1900,t0);
       o.frequency.exponentialRampToValueAtTime(300,t0+.5);
       const g=AC.createGain();g.gain.setValueAtTime(.26,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+.58);
       o.connect(g);g.connect(sh);o.start(t0);o.stop(t0+.62)}
    }catch(e){}
    try{
      const box=document.createElement('div');
      box.style.cssText='position:fixed;inset:0;z-index:99999;background:#000;pointer-events:none;overflow:hidden;contain:strict';
      const src=document.getElementById('gp13')||document.getElementById('gp1')||document.getElementById('heroImg');
      const im=document.createElement('img');
      if(src)im.src=src.currentSrc||src.src;
      im.style.cssText='position:absolute;inset:-12%;width:124%;height:124%;object-fit:cover;'+
        'filter:grayscale(1) contrast(3.4) brightness(1.45) invert(1);will-change:transform';
      box.appendChild(im);document.body.appendChild(box);
      const s0=performance.now();
      (function j(){
        const k=(performance.now()-s0)/900;
        if(k>=1){box.remove();return}
        const a=1-k;
        im.style.transform='translate('+((Math.random()-.5)*30*a)+'px,'+((Math.random()-.5)*30*a)+'px) scale('+(1.04+Math.random()*.12*a)+') rotate('+((Math.random()-.5)*2.6*a)+'deg)';
        if(k>.8)box.style.opacity=String((1-k)/.2);
        requestAnimationFrame(j)})();
    }catch(e){}}
  mute.onclick=()=>{muted=!muted;mute.textContent=muted?'Sound off':'Sound on'};
  {const nb=$('#dnight');if(nb)nb.onclick=()=>toggleNight()}
  /* ---------- input ---------- */
  /* The bible's "ON THE TRACK" notes, made physical. Each band is a stretch of the loop
     with a drag figure (0 = free, 1 = crawling), a fog distance and a colour the light is
     pulled toward. It is one lookup and two lerps a frame — no extra geometry, no
     post-processing, nothing that scales with the size of the world.
       01  narrow and dim, a drag on the accelerator, forcing a slow start
       05  the car visibly struggles: this is the track's 'gap' moment
       09  the darkest, roughest stretch, low visibility, little control
       10  the payoff: the light opens up at the top of the second hill
     Nothing here ever stops the car, and every band releases before the next chapter. */
  const ZONES=[
    {a:.980,b:1.04,drag:.34,fog:.62,tint:[.62,.63,.70],id:'cp01'},
    {a:-.02,b:.052,drag:.34,fog:.62,tint:[.62,.63,.70],id:'cp01'},
    {a:.262,b:.330,drag:.30,fog:.80,tint:[.80,.80,.86],id:'cp05'},
    {a:.612,b:.700,drag:.26,fog:.46,tint:[.50,.52,.58],id:'cp09'},
    {a:.724,b:.806,drag:0,  fog:1.34,tint:[1.16,1.12,1.02],id:'cp10'},
  ];
  function zoneAt(u){u=((u%1)+1)%1;let d=0,f=1,t0=1,t1=1,t2=1;
    for(let i=0;i<ZONES.length;i++){const Z=ZONES[i];if(u<=Z.a||u>=Z.b)continue;
      // ease in and out of the band so nothing snaps on as you cross the line
      const w=SM(Math.min((u-Z.a),(Z.b-u))/((Z.b-Z.a)*.34));
      if(Z.drag*w>d)d=Z.drag*w;
      f=f+(Z.fog-1)*w;t0=t0+(Z.tint[0]-1)*w;t1=t1+(Z.tint[1]-1)*w;t2=t2+(Z.tint[2]-1)*w}
    return {drag:d,fog:f,tint:[t0,t1,t2]}}
  const key={};
  const KMAP={ArrowUp:'f',KeyW:'f',ArrowDown:'b',KeyS:'b',ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',Space:'h',ShiftLeft:'boost',ShiftRight:'boost',KeyH:'horn'};
  addEventListener('keydown',e=>{if(!active)return;if(e.code==='Escape'){if(boardEl.classList.contains('on'))closeBoard();else if(viewer.classList.contains('on'))closeViewer();else if(recapEl&&recapEl.el.style.display!=='none')closeSummitRecap();else if(bigmap.classList.contains('on'))toggleMap();else if(cineOn)endCine();else exitDrive();return}if(cineOn){if(e.code==='Space')endCine();return}if(!driving)return;if(e.code==='KeyM'){toggleMap();return}if(e.code==='KeyT'){eg();return}if(e.code==='KeyN'){toggleNight();return}if(e.code==='KeyR'){resetCar();return}if(e.code==='KeyE'||e.code==='Enter'){interact();return}if(e.code==='KeyL'){startRace();return}if(e.code==='KeyB'){boardEl.classList.contains('on')?closeBoard():openBoard();return}const k=KMAP[e.code];if(!k)return;key[k]=1;e.preventDefault()});
  addEventListener('keyup',e=>{const k=KMAP[e.code];if(k)key[k]=0});
  function hold(el,k){const on=e=>{e.preventDefault();key[k]=1;el.classList.add('dn');try{el.setPointerCapture(e.pointerId)}catch(_){}if(navigator.vibrate)navigator.vibrate(8)};const off=()=>{key[k]=0;el.classList.remove('dn')};el.addEventListener('pointerdown',on);['pointerup','pointercancel','lostpointercapture'].forEach(ev=>el.addEventListener(ev,off));el.addEventListener('contextmenu',e=>e.preventDefault())}
  hold($('#dL'),'l');hold($('#dR'),'r');hold($('#dgas'),'f');hold($('#dbrk'),'b');hold($('#dboost'),'boost');
  $('#dresetb').onclick=resetCar;prompt.addEventListener('click',()=>interact());

  /* ---------- tool menu: five buttons collapse behind one on touch ---------- */
  {const mb=$('#dmenu'),row=$('#drow');
   const setMenu=o=>{row.classList.toggle('open',o);mb.setAttribute('aria-expanded',o?'true':'false')};
   mb.onclick=e=>{e.stopPropagation();setMenu(!row.classList.contains('open'))};
   // any choice inside closes it, and so does a tap on the road
   row.addEventListener('click',e=>{if(e.target.closest('.dbtn'))setMenu(false)});
   addEventListener('pointerdown',e=>{
     if(!row.classList.contains('open'))return;
     if(!row.contains(e.target)&&e.target!==mb)setMenu(false);
   },true);}

  /* ---------- tilt steering (phones only) ----------
     Reads gamma (left/right roll) and maps it to an analog steering value, so
     it is smoother than the binary arrow buttons. The first reading becomes
     the neutral point, which means it works however you happen to be holding
     the phone — lying flat or propped up — instead of assuming 0°. iOS 13+
     requires a user gesture to grant permission, hence the button. */
  let tiltOn=false,tiltZero=null,tiltSteer=0,steerActual=0;
  const TILT_RANGE=26;    // degrees of roll for full lock
  const TILT_DEAD=1.6;    // ignore small hand tremor
  const tiltBtn=$('#dtiltb');
  function tiltLabel(){if(tiltBtn)tiltBtn.textContent='Tilt: '+(tiltOn?'on':'off')}
  function onTilt(e){
    if(!tiltOn||e.gamma==null)return;
    // in landscape the roll axis is beta, in portrait it is gamma
    const land=Math.abs(window.orientation||0)===90||innerWidth>innerHeight;
    let v=land?(e.beta||0)*(((window.orientation||0)<0)?-1:1):(e.gamma||0);
    if(tiltZero===null)tiltZero=v;
    let d=v-tiltZero;
    if(Math.abs(d)<TILT_DEAD)d=0;else d-=Math.sign(d)*TILT_DEAD;
    tiltSteer=Math.max(-1,Math.min(1,d/TILT_RANGE));
  }
  async function toggleTilt(){
    if(tiltOn){tiltOn=false;tiltZero=null;tiltSteer=0;tiltLabel();toastMsg('Tilt steering off');return}
    try{
      const D=window.DeviceOrientationEvent;
      if(!D){toastMsg('This phone has no tilt sensor');return}
      if(typeof D.requestPermission==='function'){
        const r=await D.requestPermission();
        if(r!=='granted'){toastMsg('Tilt permission denied');return}
      }
      addEventListener('deviceorientation',onTilt);
      tiltOn=true;tiltZero=null;tiltLabel();
      toastMsg('Tilt on · hold the phone how you like, that is centre');
    }catch(_){toastMsg('Tilt not available here')}
  }
  if(tiltBtn){tiltBtn.onclick=toggleTilt;tiltLabel()}
  // re-centre when the phone is rotated, otherwise neutral is wrong
  addEventListener('orientationchange',()=>{tiltZero=null});
  const rot=$('#drot');let rotDismissed=false;
  function checkRot(){rot.classList.toggle('on',active&&TOUCH&&innerHeight>innerWidth&&!rotDismissed&&!cineOn)}
  $('#drotx').onclick=()=>{rotDismissed=true;checkRot()};addEventListener('resize',checkRot);addEventListener('orientationchange',()=>setTimeout(()=>{resize();checkRot()},250));
  function resetCar(){const {p,tg}=at(progU);
    chassisB.position.set(p.x,p.y+1.4,p.z);chassisB.velocity.set(0,0,0);chassisB.angularVelocity.set(0,0,0);
    chassisB.force.set(0,0,0);chassisB.torque.set(0,0,0);chassisB.linearDamping=.01;chassisB.angularDamping=.4;
    chassisB.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.atan2(tg.x,tg.z));
    veh.wheelInfos.forEach(w=>{w.suspensionLength=w.suspensionRestLength;w.deltaRotation=0});
    for(let i=0;i<4;i++){veh.applyEngineForce(0,i);veh.setBrake(0,i)}
    sub=0;inPond=false;steerActual=0;if(raceMode&&!lapArmed&&!lapVoid){lapVoid=true;lapEl.classList.add('void')}blip(330,.2)}
  function toastMsg(s){toast.textContent=s;clearTimeout(toast._t);
    if(window.gsap){gsap.killTweensOf(toast);
      gsap.fromTo(toast,{opacity:0,y:-10,scale:.94},{opacity:1,y:0,scale:1,duration:.45,ease:'back.out(1.7)'});
      toast._t=setTimeout(()=>gsap.to(toast,{opacity:0,y:-8,duration:.35,ease:'power2.in'}),1700)}
    else{toast.classList.add('show');toast._t=setTimeout(()=>toast.classList.remove('show'),1700)}}
  /* ---------- interaction / viewer ---------- */
  let near=null,vi=0;const seen=new Set(SAVE.seen||[]);const photosOnly=JOURNEY.filter(j=>j.photo);
  let atSummit=false,summitMoodBack=null;
  function interact(){if(atSummit){summitRecap();return}if(!near||!driving)return;openViewer(near)}
  function openViewer(s){viewer.classList.add('on');driving=false;for(const k in key)key[k]=0;blip(660,.15);renderViewer(s)}
  const vimg=$('#dvimg'),vtro=$('#dvtro'),vstat=$('#dvstat'),vnav=$('#dvp').parentElement;
  function renderViewer(s){vimg.hidden=true;vtro.hidden=true;vstat.hidden=true;vnav.style.visibility='hidden';
    if(s.pr&&!s.photo){vstat.hidden=false;vstat.innerHTML='<div class="mono">Personal record</div><b>'+s.pr+'</b><span class="mono">'+s.prName+'</span>';$('#dvt').textContent='Chapter '+s.chapter+' · '+s.name;$('#dvs').textContent=s.line+' '+s.line2;$('#dvn').textContent=''}
    else if(s.kind==='trophy'){vtro.hidden=false;$('#dvt').textContent='Active performer';$('#dvs').textContent='Powerlifting championship · 230 kg, highest conventional deadlift at MUJ';$('#dvn').textContent=''}
    else if(s.kind==='sign'){closeViewer();yourChapter();return}
    else{vi=photosOnly.indexOf(s);vimg.hidden=false;vimg.src=s.photo;$('#dvt').textContent=(s.pr?s.pr+' · ':'')+s.title;$('#dvs').textContent='Chapter '+s.chapter+' · '+s.name+' · '+s.sub;$('#dvn').textContent=(vi+1)+' / '+photosOnly.length;vnav.style.visibility='visible'}}
  function closeViewer(){viewer.classList.remove('on');driving=true}
  /* ---------- summit recap: park at the peak, get a ~10s montage of the whole story ---------- */
  let recapEl=null,recapTimer=null;
  function buildRecap(){
    if(recapEl)return recapEl;
    const el=document.createElement('div');
    Object.assign(el.style,{position:'absolute',inset:'0',background:'rgba(8,8,7,.96)',zIndex:'6',
      display:'none',placeItems:'center',gridTemplateRows:'1fr auto',
      padding:'calc(60px + env(safe-area-inset-top,0px)) 20px 30px',opacity:'0',transition:'opacity .4s'});
    const img=document.createElement('img');
    Object.assign(img.style,{maxWidth:'min(92vw,760px)',maxHeight:'62vh',objectFit:'contain',
      boxShadow:'0 30px 80px rgba(0,0,0,.6)',opacity:'0',transition:'opacity .3s',gridRow:'1',alignSelf:'center'});
    const foot=document.createElement('div');
    Object.assign(foot.style,{textAlign:'center',color:'#f2eee6',
      fontFamily:'ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace',gridRow:'2'});
    const cap=document.createElement('div');cap.style.fontSize='15px';cap.style.marginBottom='6px';
    const bwEl=document.createElement('div');bwEl.style.fontSize='26px';bwEl.style.fontWeight='600';
    const hint=document.createElement('div');hint.style.marginTop='12px';hint.style.fontSize='11px';hint.style.opacity='.6';hint.textContent='Esc to skip';
    foot.append(cap,bwEl,hint);el.append(img,foot);sec.appendChild(el);
    recapEl={el,img,cap,bwEl};return recapEl}
  function closeSummitRecap(){
    if(recapTimer){recapTimer.forEach(id=>clearTimeout(id));recapTimer=null}
    if(recapEl){recapEl.el.style.opacity='0';setTimeout(()=>{if(recapEl)recapEl.el.style.display='none'},400)}
    driving=true}
  function summitRecap(){
    driving=false;for(const k in key)key[k]=0;
    // opening sting: a short rising arpeggio
    [440,554,659,880].forEach((f,k)=>setTimeout(()=>blip(f,.22,.09),k*90));
    const r=buildRecap();
    const chapters=JOURNEY.filter(J=>J.photo).map(J=>({src:J.photo,cap:'Chapter '+J.chapter+' · '+J.name,bw:J.bw+' kg'}));
    if(!chapters.length){closeSummitRecap();return}
    const last=JOURNEY[JOURNEY.length-1];
    const quoteSlide={src:(last&&last.photo)||chapters[chapters.length-1].src,cap:'I did it. You can too.',bw:'',quote:true};
    r.el.style.display='grid';requestAnimationFrame(()=>r.el.style.opacity='1');
    const CH_STEP=580,QUOTE_HOLD=2800;
    const paint=s=>{r.img.style.opacity='0';
      setTimeout(()=>{if(!recapEl)return;r.img.src=s.src;r.cap.textContent=s.cap;r.bwEl.textContent=s.bw;
        r.cap.style.fontSize=s.quote?'19px':'15px';r.cap.style.fontStyle=s.quote?'italic':'normal';
        r.img.style.opacity='1'},160)};
    paint(chapters[0]);
    const timers=[];
    chapters.forEach((s,idx)=>{if(idx===0)return;timers.push(setTimeout(()=>paint(s),idx*CH_STEP))});
    const quoteAt=chapters.length*CH_STEP;
    timers.push(setTimeout(()=>{paint(quoteSlide);
      // closing chord: a small resolving cadence
      [523,659,784].forEach((f,k)=>setTimeout(()=>blip(f,.5,.08),k*70))},quoteAt));
    timers.push(setTimeout(closeSummitRecap,quoteAt+QUOTE_HOLD));
    recapTimer=timers;}
  $('#dvx').onclick=closeViewer;$('#dvp').onclick=()=>{vi=(vi-1+photosOnly.length)%photosOnly.length;renderViewer(photosOnly[vi])};$('#dvnx').onclick=()=>{vi=(vi+1)%photosOnly.length;renderViewer(photosOnly[vi])};
  let sx=0;viewer.addEventListener('pointerdown',e=>sx=e.clientX);viewer.addEventListener('pointerup',e=>{const d=e.clientX-sx;if(Math.abs(d)>60&&!vimg.hidden){vi=(vi+(d<0?1:-1)+photosOnly.length)%photosOnly.length;renderViewer(photosOnly[vi])}});
  /* ---------- story + guidance ---------- */
  const storyEl=$('#dstory'),objEl=$('#dobj'),objArrow=$('#dobjarrow'),objTxt=$('#dobjtxt'),wrongEl=$('#dwrong');
  const nextStation=()=>stations.find(s=>!seen.has(s.id)&&s.u>=progU-.03)||stations.find(s=>!seen.has(s.id))||null;
  function bodyweight(){let bw=68;stations.forEach(s=>{if(seen.has(s.id))bw=Math.max(bw,s.bw)});return bw}
  function updBW(){kgEl.innerHTML=bodyweight()+'<small> kg</small>'}
  function tell(s){if(raceMode){if(s.final){}return}const im=storyEl.querySelector('img');if(s.photo){im.src=s.photo;im.hidden=false}else im.hidden=true;storyEl.querySelector('.se').textContent='Chapter '+s.chapter+' · '+s.name;storyEl.querySelector('.s1').textContent=s.line;storyEl.querySelector('.s2').textContent=s.line2+(s.pr||s.kind==='photo'||s.kind==='trophy'?(TOUCH?'  Tap to look closer.':'  Press E to look closer.'):'');storyEl.classList.remove('on');void storyEl.offsetWidth;storyEl.classList.add('on');clearTimeout(storyEl._t);storyEl._t=setTimeout(()=>storyEl.classList.remove('on'),7500);if(s.final&&!raceMode)setTimeout(()=>{if(!raceMode)finale()},3000)}
  /* Chapter 13 is the only checkpoint that is not about him. One question, one answer,
     kept on this device, and then the loop hands back to chapter 01. */
  const yrs=$('#dyours'),yrsTxt=$('#dyourstxt');
  function yourChapter(){if(yrs.classList.contains('on'))return;
    yrs.classList.add('on');driving=false;for(const k in key)key[k]=0;storyEl.classList.remove('on');
    try{yrsTxt.value=localStorage.getItem('sl_goal')||''}catch(e){}
    setTimeout(()=>{try{yrsTxt.focus()}catch(e){}},260);blip(392,.45,.1)}
  function closeYours(){yrs.classList.remove('on');driving=true}
  $('#dyoursskip').onclick=closeYours;
  $('#dyoursgo').onclick=()=>{const v=yrsTxt.value.trim();
    if(v){try{localStorage.setItem('sl_goal',v)}catch(e){}}
    closeYours();toastMsg(v?'Chapter 01: '+v:'Chapter 01 is yours');blip(523,.5,.1)};
  const fin=$('#dfin');
  function finale(){if(fin.classList.contains('on'))return;fin.classList.add('on');driving=false;for(const k in key)key[k]=0;storyEl.classList.remove('on');blip(392,.5,.1);setTimeout(()=>blip(523,.6,.1),180)}
  $('#dfintrial').onclick=()=>{fin.classList.remove('on');exitDrive();const el=$('#apply');setTimeout(()=>lenis?lenis.scrollTo(el,{duration:1.4}):el.scrollIntoView({behavior:'smooth'}),120)};
  $('#dfinkeep').onclick=()=>{fin.classList.remove('on');driving=true};
  $('#dfinwa').onclick=()=>{fin.classList.remove('on');askExternal('https://wa.me/'+((window.SL_CFG&&SL_CFG.WHATSAPP)||'917384221979')+'?text='+WA_TXT)};
  const beamM=new THREE.MeshBasicMaterial({color:0xf2eee6,transparent:true,opacity:.16,depthWrite:false});const beam=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,46,20,1,true),beamM);S.add(beam);
  const ringB=new THREE.Mesh(new THREE.RingGeometry(2.2,2.6,36),new THREE.MeshBasicMaterial({color:0xf2eee6,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));ringB.rotation.x=-Math.PI/2;S.add(ringB);
  const guideArrow=new THREE.Group();{const ah=new THREE.Shape();ah.moveTo(0,1.1);ah.lineTo(.8,.1);ah.lineTo(.28,.1);ah.lineTo(.28,-.9);ah.lineTo(-.28,-.9);ah.lineTo(-.28,.1);ah.lineTo(-.8,.1);ah.closePath();const am=new THREE.Mesh(new THREE.ExtrudeGeometry(ah,{depth:.18,bevelEnabled:false}),glow);am.rotation.x=-Math.PI/2;guideArrow.add(am)}S.add(guideArrow);
  /* ---------- minimap ---------- */
  const MAPS=SAMP.filter((_,i)=>i%2===0);let mapRot=0;
  /* The static half of the map (water, woods, road, hill) never changes, so draw it once
     into an offscreen bitmap. Re-stroking 150 trees as canvas arcs several times a second
     was costing real frames for a 180px widget. */
  let mapCache=null;
  function buildMapCache(){
    const CS=560,k=2,cv2=document.createElement('canvas');cv2.width=cv2.height=CS;
    const c=cv2.getContext('2d');c.translate(CS/2,CS/2);
    c.fillStyle='rgba(45,76,92,.9)';c.beginPath();c.arc(POND.x*k,POND.z*k,POND.r*k,0,6.283);c.fill();
    c.strokeStyle='rgba(143,42,42,.8)';c.lineWidth=1.6;c.strokeRect((PG.x-12)*k,(PG.z-12)*k,24*k,24*k);
    c.fillStyle='rgba(120,150,110,.4)';treePts.forEach(([x,z])=>{c.beginPath();c.arc(x*k,z*k,1.7,0,6.283);c.fill()});
    c.strokeStyle='#5a5750';c.lineWidth=3.2*k;c.beginPath();MAPS.forEach((p,i)=>{i?c.lineTo(p.x*k,p.z*k):c.moveTo(p.x*k,p.z*k)});c.closePath();c.stroke();
    c.strokeStyle='#8a7a5a';c.lineWidth=4.2*k;HILLS.forEach(HL=>{c.beginPath();for(let i=Math.floor(HL.a*N);i<=HL.d*N;i++){const p=SAMP[i];i===Math.floor(HL.a*N)?c.moveTo(p.x*k,p.z*k):c.lineTo(p.x*k,p.z*k)}c.stroke()});
    mapCache=cv2;
  }
  function drawMap(c,size,big){const sc=size/2/(big?118:60);c.clearRect(0,0,size,size);c.save();c.translate(size/2,size/2);
    c.beginPath();c.arc(0,0,size/2-1,0,6.283);c.fillStyle='rgba(18,17,15,.88)';c.fill();c.clip();
    const q=chassisB.quaternion,yaw=Math.atan2(2*(q.w*q.y+q.x*q.z),1-2*(q.y*q.y+q.z*q.z));
    if(!big){let d=(yaw+Math.PI-mapRot);d=Math.atan2(Math.sin(d),Math.cos(d));mapRot+=d*.1;c.rotate(mapRot);c.translate(-chassisB.position.x*sc,-chassisB.position.z*sc)}
    if(!mapCache)buildMapCache();
    {const s=140*sc;c.drawImage(mapCache,-s,-s,s*2,s*2)}
    c.strokeStyle='#f2eee6';c.lineWidth=2;c.beginPath();const n=Math.floor(progU*MAPS.length);for(let i=0;i<=n&&i<MAPS.length;i++){const p=MAPS[i];i?c.lineTo(p.x*sc,p.z*sc):c.moveTo(p.x*sc,p.z*sc)}c.stroke();
    const t=performance.now()/500,NX=nextStation();
    stations.forEach(s=>{const on=seen.has(s.id),pulse=near===s||NX===s;c.fillStyle=on?'#f2eee6':'#8a857b';c.beginPath();c.arc(s.pos.x*sc,s.pos.z*sc,big?5:3.4,0,6.283);c.fill();if(pulse){c.strokeStyle='rgba(242,238,230,.75)';c.lineWidth=1.5;c.beginPath();c.arc(s.pos.x*sc,s.pos.z*sc,(big?9:6)+Math.sin(t)*2,0,6.283);c.stroke()}if(big){c.fillStyle='#c9c2b4';c.font='600 11px ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace';c.textAlign='left';c.fillText(s.chapter+' '+s.name.toUpperCase(),s.pos.x*sc+9,s.pos.z*sc+4)}});
    {const mC=curMission();
     if(mC&&mC.id==='rings'){const qA=rings[ringIdx];
       if(qA&&!qA.done){c.fillStyle='#d4a83a';c.beginPath();c.arc(qA.pos.x*sc,qA.pos.z*sc,big?5:3.4,0,6.283);c.fill();
         c.strokeStyle='rgba(212,168,58,.8)';c.lineWidth=1.5;c.beginPath();c.arc(qA.pos.x*sc,qA.pos.z*sc,(big?9:6)+Math.sin(t)*2,0,6.283);c.stroke();
         if(big){c.fillStyle='#d4a83a';c.font='600 11px ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace';c.textAlign='left';c.fillText('RING '+(ringIdx+1)+'/6',qA.pos.x*sc+9,qA.pos.z*sc+4)}}}
     // traffic shows up on the map so you can see what you are racing into
     c.fillStyle='rgba(242,238,230,.75)';traffic.forEach(tc=>{const pt=at(tc.u).p;c.beginPath();c.arc(pt.x*sc,pt.z*sc,big?3.4:2.2,0,6.283);c.fill()})}
    // the ring road, drawn as the circle it is
    {c.strokeStyle='rgba(242,238,230,.45)';c.lineWidth=big?3:2;
     c.beginPath();c.arc(RING.x*sc,RING.z*sc,RING.r*sc,0,6.283);c.stroke()}
    // the summit: a warm marker so the lookout reads as a real destination, pulsing once you're actually parked there
    {c.fillStyle=atSummit?'#f2b26b':'#c98a4a';c.beginPath();c.arc(PEAK.x*sc,PEAK.z*sc,big?5:3.4,0,6.283);c.fill();
     if(atSummit){c.strokeStyle='rgba(242,178,107,.8)';c.lineWidth=1.5;c.beginPath();c.arc(PEAK.x*sc,PEAK.z*sc,(big?9:6)+Math.sin(t)*2,0,6.283);c.stroke()}
     if(big){c.fillStyle='#f2b26b';c.font='600 11px ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace';c.textAlign='left';c.fillText('SUMMIT',PEAK.x*sc+9,PEAK.z*sc+4)}}
    if(big){c.fillStyle='#9fc3d6';c.font='600 11px ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace';c.fillText('POND',POND.x*sc-14,POND.z*sc+4);c.fillStyle='#d88';c.fillText('PLAYGROUND',(PG.x-12)*sc,(PG.z-13)*sc);c.fillStyle='#cdb98f';const hp=SAMP[Math.floor(.44*N)];c.fillText('HILL',hp.x*sc+10,hp.z*sc-10)}
    c.translate(chassisB.position.x*sc,chassisB.position.z*sc);c.rotate(Math.PI-yaw);c.fillStyle='#f2eee6';c.beginPath();c.moveTo(0,-7);c.lineTo(5,5);c.lineTo(0,2.5);c.lineTo(-5,5);c.closePath();c.fill();c.restore();
    c.strokeStyle='rgba(242,238,230,.5)';c.lineWidth=1.5;c.beginPath();c.arc(size/2,size/2,size/2-1,0,6.283);c.stroke()}
  function toggleMap(){const on=!bigmap.classList.contains('on');bigmap.classList.toggle('on',on);driving=!on;for(const k in key)key[k]=0;if(on)drawMap(bmc.getContext('2d'),bmc.width,true)}
  mm.onclick=toggleMap;$('#dbigx').onclick=toggleMap;
  /* ---------- loop ---------- */
  const camT=new THREE.Vector3(),look=new THREE.Vector3(),fwd=new THREE.Vector3(),tmp=new THREE.Vector3(),lastV=new THREE.Vector3();
  let last=performance.now(),flipT=0,frameN=0,spdS=0,shake=0,idleT=0,cineOn=false,inPond=false,sub=0,pondToast=0,liftShown=false,missHint=false,airT=0;
  let act=-1,chapEase=0,camRoll=0;const lookT=new THREE.Vector3();
  /* ---------- the idle backdrop ----------
     Before you press Start, this section is a picture of a world, not a world you are
     in: the car does not move and nothing is being driven. It used to keep redrawing
     the whole scene a few times a second to show that, which is far too slow to read
     as motion and far too much work to be free — it just looked like the page was
     struggling. So it now renders a handful of frames to let the lighting settle, keeps
     one of them as a still, and then stops rendering altogether until you actually
     start the engine. If grabbing the still ever fails we fall back to the old
     throttled redraw rather than leaving an empty canvas. */
  let idleLast=0,idleLow=0,posterState=0,posterWarm=0,wasActive=false;
  const poster=document.createElement('img');
  poster.id='dposter';poster.alt='';poster.decoding='async';
  if(cv.insertAdjacentElement)cv.insertAdjacentElement('afterend',poster);
  function loop(now){requestAnimationFrame(loop);
    const r=sec.getBoundingClientRect();
    if(active!==wasActive){
      wasActive=active;
      if(active){poster.style.display='none'}
      else{posterState=0;posterWarm=0}   // take a fresh still: the weather may have moved on
    }
    if(!active){
      if(r.bottom<0||r.top>innerHeight||document.hidden){last=now;return}
      if(posterState===1){last=now;return}          // the still is up; there is nothing to draw
      // 1 = warming up for the still, rendered near full res so it is not a blurry one.
      // 2 = the still failed, so fall back to the old low-res throttled redraw.
      if(posterState===0&&posterWarm<4){
        if(idleLow!==1){idleLow=1;R.setPixelRatio(Math.min(devicePixelRatio||1,1));R.setSize(W,H,false)}}
      else{
        if(now-idleLast<(LOW?240:130)){last=now;return}
        idleLast=now;
        if(idleLow!==2){idleLow=2;R.setPixelRatio(Math.min(devicePixelRatio,.6));R.setSize(W,H,false)}}
    }else if(idleLow){idleLow=0;applyQ()}
    const dt=Math.min(.1,(now-last)/1000);last=now;frameN++;
    watchFps(dt);
    const sp=chassisB.velocity.length();
    if(active&&driving){
      const f=key.f?1:0,b=key.b?1:0,l=key.l?1:0,rr=key.r?1:0;
      // water: how far the hull is under the waterline, 0 on dry land, 1 fully submerged
      {const pd=Math.hypot(chassisB.position.x-POND.x,chassisB.position.z-POND.z),pr=pondR(chassisB.position.x,chassisB.position.z);
       sub=pd<pr*1.05?Math.max(0,Math.min(1,(WATER_Y-(chassisB.position.y-.52))/1.5)):0}
      inPond=sub>.06;
      ZN=zoneAt(progU);const zd=ZN.drag;
      const boost=key.boost?1:0;
      const eMul=(1-sub*.66)*(1-zd*.52),vmax=V.max*(1+boost*.28)*(1-sub*.68)*(1-zd*.38);
      /* Tractive force used to be flat all the way to the cap, so the car pulled just as
         hard at 90 as it did from rest and then hit a wall. This is the shape a gearbox
         actually gives you: strong off the line, tapering as the revs run out. */
      // pitch: +1 nose-down (descending), -1 nose-up. Taken from the chassis forward axis.
      const fwd=fwdScratch;fwd.set(0,0,1);chassisB.quaternion.vmult(fwd,fwd);
      const grade=Math.max(0,-fwd.y);
      /* Tractive force. The engine is deliberately modest now — it used to be strong enough
         to reach 60 km/h in under a second, which is why the smallest touch of throttle sent
         the car flying. What it no longer has in raw grunt it gets back on a slope: climbAid
         hands the driven wheels exactly the component of weight the hill is taking away, so
         the Pull Hill still climbs at a steady pull the way a low gear would, while flat
         ground stays civilised. Without it this engine cannot get up its own mountain. */
      const climb=Math.max(0,fwd.y);
      const climbAid=climb*chassisB.mass*Math.abs(world.gravity.y)/2;
      const sr=Math.min(1,sp/Math.max(1,vmax)),tq=f?1-.35*sr*sr:1;
      const force=(f-b)*(V.engine*tq+(f?climbAid:0))*(1+boost*.4)*eMul*(sp>vmax?0:1);
      veh.applyEngineForce(-force,2);veh.applyEngineForce(-force,3);
      /* Downhill used to run away: engine force cuts out at V.max, but nothing opposed gravity
         on a descent, so the car kept accelerating with only the 2.2 coast brake resisting it.
         Two things fix it. A governor bleeds speed whenever we are over the cap regardless of
         what the engine is doing, and a grade term adds real engine braking proportional to how
         steep the descent is, the way a low gear would. */
      const over=Math.max(0,sp-vmax)/Math.max(1,vmax);
      const gradeBrake=grade*10*(f?0:1);         // gentle passive braking; the downhill remains driveable
      const govBrake=Math.min(18,over*42);        // scales in only once past the cap
      const coast=(f===0&&b===0)?.8:0;
      /* Brakes are plumbed the way a real car's are: front biased under normal braking,
         because that is where the weight goes when you slow down, and the handbrake on
         the rear axle only, which is what lets it rotate the car instead of just stopping it. */
      const svc=Math.max(coast,gradeBrake,govBrake);
      for(let i=0;i<4;i++){const fr=i<2;veh.setBrake(Math.max(svc*(fr?1.25:.75),key.h?(fr?0:52):0),i)}
      // hard ceiling: if it is still climbing past the cap, damp the velocity directly
      if(sp>vmax*1.18&&!inPond){const s=vmax*1.18/sp;chassisB.velocity.x*=s;chassisB.velocity.z*=s}
      // steeper ground => more angular damping, which is what kills the hillside wobble
      chassisB.angularDamping=.4+grade*.34;
      /* Steering input: buttons are binary, tilt is analog. Whichever the
         rider is actually using wins, so you can tap an arrow mid-corner
         without turning tilt off. */
      let steerIn=l-rr;
      if(tiltOn&&steerIn===0)steerIn=tiltSteer;
      const st=steerIn*V.steer*Math.max(.35,1-sp/46);steerActual+=(st-steerActual)*Math.min(1,dt*8);veh.setSteeringValue(steerActual,0);veh.setSteeringValue(steerActual,1);
      tailM.emissiveIntensity=(b||key.h)?1.6:boost?1.2:.5;
      // cannon integrates damping as pow(1-damping,dt), so anything at or above 1 turns the whole
      // body into NaN on the next step. That was the real cause of the car "flying" over the pond.
      chassisB.linearDamping=.01+sub*.82;
      if(sub>0){
        // buoyancy scales with how submerged it is and is capped under its own weight, so it wallows instead of taking off
        const lift=chassisB.mass*24*sub*.88;
        fScratch.set(0,lift,0);chassisB.applyForce(fScratch,chassisB.position);
        // water grabs the hull: kill spin and sideways slide
        const av=chassisB.angularVelocity,k=Math.min(.55,sub*9*dt);av.x-=av.x*k;av.z-=av.z*k;av.y-=av.y*k*.5;
        // quadratic drag, so wading has real weight to it
        const v=chassisB.velocity,vs=v.length();
        if(vs>.05){const dq=Math.min(chassisB.mass*13,vs*vs*7.5)*sub;fScratch.set(-v.x/vs*dq,-v.y/vs*dq*.4,-v.z/vs*dq);chassisB.applyForce(fScratch,chassisB.position)}
        if(now-pondToast>6000){pondToast=now;toastMsg(sub>.6?'Wading through, take it slow':'Careful, shallow water')}}
      /* ---------- chassis dynamics ----------
         Three things a raycast vehicle does not give you for free, and all three are
         what made this car feel like a brick on ice. An anti-roll bar per axle, which
         trades load across the car in a corner instead of letting it lean over and ride
         on two wheels. Aero, so the top end tapers off on its own and the faster you go
         the harder the floor is pressed into the road. And tyre grip that scales with how
         hard each wheel is actually loaded — a wheel that has gone light in a corner now
         gives up grip the way a real one does, which is where the understeer comes from. */
      /* Everything below reuses scratch vectors and arrays held outside the loop. This
         block runs sixty times a second, and the version that allocated a dozen Vec3s
         and two arrays per frame handed the collector a steady drip of garbage for no
         reason — which is exactly the kind of thing that shows up as stutter. */
      {const wi=veh.wheelInfos,STATIC=chassisB.mass*Math.abs(world.gravity.y)/4;
       UPV.set(0,1,0);chassisB.quaternion.vmult(UPV,bodyUp);
       for(let i=0;i<wi.length;i++){const w=wi[i],rest=w.suspensionRestLength||1;
         const sf=+w.suspensionForce;
         wLoad[i]=w.isInContact&&isFinite(sf)?Math.max(0,sf):0;
         wComp[i]=w.isInContact?Math.max(0,Math.min(1,w.suspensionLength/rest)):1}
       // anti-roll bars — front axle is wheels 0/1, rear is 2/3. Unrolled, so no closure per frame.
       if(!inPond)for(let ax=0;ax<2;ax++){
         const l=ax*2,r=l+1,k=ax?ARB_R:ARB_F;
         // both wheels on the axle have to be down, or landing off a ramp gets jumpy
         if(!wi[l].isInContact||!wi[r].isInContact||!wi[l].raycastResult||!wi[r].raycastResult)continue;
         const fN=(wComp[l]-wComp[r])*k;if(!isFinite(fN)||Math.abs(fN)<1)continue;
         bodyUp.scale(-fN,fScratch);chassisB.applyForce(fScratch,wi[l].raycastResult.hitPointWorld);
         bodyUp.scale(fN,fScratch);chassisB.applyForce(fScratch,wi[r].raycastResult.hitPointWorld)}
       /* Aero is drag only, applied at the centre of mass so it cannot pitch the car.
          Downforce was tried and thrown out: on springs this soft it squashed the
          suspension until the floor grounded out, which cost half the top speed and
          eventually put the car on its roof. Drag on its own does the useful half —
          it tapers the top end and, because it pulls at the centre of mass while the
          drive pushes at the rear contact patches, it settles the nose under power. */
       if(!inPond){const vv=chassisB.velocity,vs=Math.hypot(vv.x,vv.z);
         if(vs>.5&&isFinite(vs)){
           const dg=Math.min(chassisB.mass*8,vs*vs*AERO_DRAG);
           fScratch.set(-vv.x/vs*dg,0,-vv.z/vs*dg);chassisB.applyForce(fScratch,chassisB.position)}}
       lvScratch.copy(chassisB.velocity);chassisB.quaternion.conjugate(qScratch);qScratch.vmult(lvScratch,lvScratch);
       const lateral=Math.min(1,Math.abs(lvScratch.x)/8),rearGrip=key.h?.58:1,
             grip=V.slip*wx.slip*(1-sub*.72)*(1+grade*.55)*(1+lateral*.22);
       for(let i=0;i<wi.length;i++){
         // load sensitivity: grip climbs with load, but slower than the load does
         const lr=STATIC>0?wLoad[i]/STATIC:1;
         const ls=wi[i].isInContact?Math.max(.4,Math.pow(Math.min(LOAD_CAP,lr),LOAD_EXP)):1;
         wi[i].frictionSlip=grip*(i>1?rearGrip:1)*(isFinite(ls)?ls:1)}
       // nothing above is allowed to hand the solver a NaN — that is what used to launch the car
       const F=chassisB.force,T=chassisB.torque;
       if(!isFinite(F.x)||!isFinite(F.y)||!isFinite(F.z))F.set(0,0,0);
       if(!isFinite(T.x)||!isFinite(T.y)||!isFinite(T.z))T.set(0,0,0)}
      world.step(1/60,dt,3);
      const dv=tmp.set(chassisB.velocity.x,chassisB.velocity.y,chassisB.velocity.z).sub(lastV).length();lastV.set(chassisB.velocity.x,chassisB.velocity.y,chassisB.velocity.z);if(dv>7){shake=Math.min(1,dv/25);blip(90,.25,.15)}
      if(chassisB.position.y<-9||!isFinite(chassisB.position.y)||!isFinite(chassisB.velocity.x)){resetCar();toastMsg('Pulled you back onto the road')}
      UPV.set(0,1,0);const up=bodyUp;chassisB.quaternion.vmult(UPV,up);if(up.y<.25){flipT+=dt;if(flipT>1.8){resetCar();flipT=0;toastMsg('Back on the road, lock in')}}else flipT=0;
      if(f||b||l||rr||Math.abs(tiltSteer)>.12)idleT=0;else{idleT+=dt;if(idleT>10){idleT=-999;toastMsg(TOUCH?'Hold GAS on the right':'W to drive. Follow the arrow.')}}
      if(frameN%4===0){let best=1e9,bi=0;for(let i=0;i<=N;i+=2){const d=(SAMP[i].x-chassisB.position.x)**2+(SAMP[i].z-chassisB.position.z)**2;if(d<best){best=d;bi=i}}const u=bi/N;if(best<60&&(u>progU||u<progU-.5))progU=u;prog.geometry.setDrawRange(0,Math.floor(progU*N)*6);if(frameN%16===0)lamps.forEach(L=>{L.bulb.material.color.setHex(L.u<=progU?0xf2eee6:0x3a3733)});
        const summitD=Math.hypot(car.position.x-PEAK.x,car.position.z-PEAK.z);
        const wasSummit=atSummit;atSummit=summitD<12;recapCam=atSummit;
        if(atSummit&&!wasSummit){summitMoodBack=CHMOOD[act]||'day';if(!nightOn)mood('dusk',5);blip(600,.16,.08);toastMsg((TOUCH?'Tap':'Press E')+' for the montage')}
        else if(!atSummit&&wasSummit&&!recapTimer){if(summitMoodBack){if(!nightOn)mood(summitMoodBack,4);summitMoodBack=null}}
        let nn=null,nd=1e9;stations.forEach(s=>{const d=Math.hypot(s.pos.x-car.position.x,s.pos.z-car.position.z);if(d<nd){nd=d;nn=s}});const wasNear=near;near=atSummit?null:(nd<(nn&&nn.big?22:19)?nn:null);
        if(near&&!seen.has(near.id)){seen.add(near.id);saveAll();updBW();tell(near);
          if(near.id==='cp10'){blip(392,.55,.14);setTimeout(()=>blip(523,.55,.14),150);setTimeout(()=>blip(659,.8,.15),300);
            toastMsg('230 kg \u00b7 four months after surgery')}
          else blip(520,.3,.1)}
        /* The chapter you are in is decided by how far round the road you are, not by what
           you happen to be parked next to, so the indicator, the sky and the little camera
           settle all change as you drive into a section rather than when you stop at it. */
        {let a=0;for(let k=0;k<JOURNEY.length;k++)if(progU>=JOURNEY[k].u-.028)a=k;
         if(a!==act){act=a;const JA=JOURNEY[a];
           chap.textContent='Chapter '+JA.chapter+' \u00b7 '+JA.name;
           chap.classList.remove('mark');void chap.offsetWidth;chap.classList.add('mark');
           if(!nightOn)mood(CHMOOD[a],6);chapEase=1;if(a>0)blip(360,.18,.05)}}
        if(near!==wasNear||atSummit!==wasSummit){
          const show=atSummit||(!!near&&near.kind!=='sign');prompt.classList.toggle('on',show);
          if(atSummit)prompt.textContent=(TOUCH?'Tap · ':'E · ')+'Park for the view';
          else if(near)prompt.textContent=(TOUCH?'Tap · ':'E · ')+(near.pr&&!near.photo?'See the PR':near.kind==='trophy'?'Inspect trophy':near.anim?'See the PR':'View photo')}
        // deadlift climb counter
        const onHill=best<60&&u>HILL.a&&u<HILL.c+.02&&chassisB.position.y>hAt(u)-.5+.3;
        if(onHill){const kgv=Math.round((60+(242.5-60)*Math.min(1,hAt(u)/HILL.H))/2.5)*2.5;liftEl.querySelector('b').textContent=kgv%1?kgv.toFixed(1):kgv;liftEl.querySelector('.dls').textContent=kgv>=230?'top of the hill · 230 kg':'keep climbing';if(!liftShown){liftShown=true;liftEl.classList.add('on')}}else if(liftShown&&(u<HILL.a-.01||u>HILL.d)){liftShown=false;liftEl.classList.remove('on')}}
      // a gate is the end of the story, not something to trip over every lap
      if(!raceMode)gates.forEach(g=>{g.cool=Math.max(0,g.cool-dt);
        if(g.used||g.cool>0)return;
        if(g.when&&!g.when())return;
        if(Math.hypot(g.pos.x-car.position.x,g.pos.z-car.position.z)<3.6&&Math.abs(g.pos.y-car.position.y)<4){g.cool=6;g.used=true;g.fn()}});
      /* ---- missions ---- */
      {const mc=curMission();
       if(mc&&mc.id==='rings'){const r=rings[ringIdx];
         if(r&&!r.done&&Math.hypot(r.pos.x-car.position.x,r.pos.z-car.position.z)<3.8){r.done=true;ringIdx++;missSet('rings',ringIdx)}}
       if(sub>.45)missSet('swim',1);
       if(seen.size>=13)missSet('story',13);
       if(frameN%12===0&&mc&&mc.id==='cones'){let k=0;coneBodies.forEach(c=>{if(Math.hypot(c.b.position.x-c.x,c.b.position.z-c.z)>1.5||c.b.position.y<.34)k++});if(k>0)missSet('cones',k)}
       // airtime
       let airborne=true;for(let i=0;i<veh.wheelInfos.length;i++)if(veh.wheelInfos[i].isInContact){airborne=false;break}
       if(airborne&&sp>4&&sub<.1){airT+=dt;if(airT>1)missSet('air',1)}else airT=0;
       if(sp>6)for(const r of RAMPS)if(!rampHit.has(r.id)&&Math.hypot(r.x-car.position.x,r.z-car.position.z)<4){rampHit.add(r.id);missSet('ramps',rampHit.size)}}
      /* ---- lap timing ---- */
      if(raceMode){
        // the ramp yard is off the timed circuit, so treat it exactly like being off-road
        const rn0=roadNear(car.position.x,car.position.z);
        const rn=rn0.branch?{d:99,u:lapU}:rn0;
        if(!lapInit){lapU=rn.u;lapInit=true}
        let du=rn.u-lapU;const wrapFwd=du<-.5,wrapBack=du>.5;
        if(wrapFwd)du+=1;else if(wrapBack)du-=1;
        if(Math.abs(du)<.06&&rn.d<16)lapProg+=du;
        lapU=rn.u;
        if(rn.d>18){offT+=dt;if(offT>2&&!lapVoid&&!lapArmed){lapVoid=true;lapEl.classList.add('void');toastMsg('Lap scrubbed · stay on the road')}}
        else offT=Math.max(0,offT-dt*.6);
        if(wrapFwd){
          if(lapArmed){lapArmed=false;lapStart=now;lapNo=1;lapProg=0;lapVoid=false;offT=0;lapEl.classList.remove('void');blip(820,.2);toastMsg('Go')}
          else{const ms=now-lapStart;
            if(!lapVoid&&lapProg>.88&&ms>12000)lapDone(ms);
            else if(lapVoid)toastMsg('Lap scrubbed · going again');
            lapStart=now;lapNo++;lapProg=0;lapVoid=false;offT=0;lapEl.classList.remove('void')}}
        if(frameN%4===0&&!lapArmed){lapT.textContent=fmtT(now-lapStart);lapN.textContent='Lap '+lapNo;
          for(let i=0;i<lapSecs.length;i++)lapSecs[i].classList.toggle('on',lapProg>(i+1)*.25-.25)}}
      if(AC&&engG){const spq=isFinite(sp)?sp:0;engG.gain.setTargetAtTime(muted?0:.05+Math.min(.06,spq/300),AC.currentTime,.05);eng.frequency.setTargetAtTime(55+spq*9+(f?12:0),AC.currentTime,.08)}
      honk(!!key.horn);
    }else{if(AC&&engG)engG.gain.setTargetAtTime(0,AC.currentTime,.05);honk(false)}
    car.position.copy(chassisB.position);car.quaternion.copy(chassisB.quaternion);
    if(sub>0&&active){car.position.y-=sub*.3;ripple.position.set(car.position.x,WATER_Y+.05,car.position.z);ripple.material.opacity=Math.min(.55,sp/9)*sub;ripple.scale.setScalar(1.7+(now/300)%1.3)}else ripple.material.opacity=0;
    waterNorm.offset.set(now/26000,now/17000);
    // wheels
    const wi=veh.wheelInfos,wl=wv.car;
    wl.forEach((w,i)=>{const c=wi[i].chassisConnectionPointLocal;w.position.set(c.x,.05-wi[i].suspensionLength,c.z);w.rotation.set(wi[i].rotation,i<2?wi[i].steering:0,0)});
    if(active)for(let i=0;i<dyn.length;i++){const d=dyn[i];if(d.body.sleepState===2&&frameN%30)continue;d.mesh.position.copy(d.body.position);d.mesh.quaternion.copy(d.body.quaternion);if(d.body.position.y<-5){d.body.position.copy(d.home);d.body.quaternion.copy(d.q);d.body.velocity.setyou();d.body.angularVelocity.setyou()}}
    const tt=now/1000;if(active)anims.forEach(a=>{const dd=Math.hypot(a.g.pos.x-car.position.x,a.g.pos.z-car.position.z);if(dd<70)a.pose(a.F,tt*a.speed)});
    rings.forEach(q=>{if(q.g.visible){q.ring.rotation.z+=dt*1.5;q.ring2.rotation.z-=dt*2.1}});
    if(active&&driving)updTraffic(dt,now);
    // the lamps only need repainting a few times a second to read as changing
    if(active&&frameN%5===0)updLights(now/1000);
    if(active)birds.forEach(b=>{b.a+=dt*b.sp;const x=POND.x+Math.cos(b.a)*b.r,z=POND.z+Math.sin(b.a)*b.r;b.g.position.set(x,b.y+Math.sin(tt*.6+b.a)*.6,z);b.g.rotation.y=-b.a+Math.PI/2;const fl=Math.sin(tt*9+b.a)*.9;b.wL.rotation.z=fl;b.wR.rotation.z=-fl});
    if(active)for(let ci=0;ci<critters.length;ci++){const c=critters[ci];
      const near2=active?Math.hypot(car.position.x-c.g.position.x,car.position.z-c.g.position.z):999;
      if(near2<16&&c.state!=='flee'&&sp>3){c.state='flee';c.t=2.5+Math.random()*2;
        const ax=c.g.position.x-car.position.x,az=c.g.position.z-car.position.z,al=Math.hypot(ax,az)||1;
        c.tgt.x=c.g.position.x+ax/al*26;c.tgt.z=c.g.position.z+az/al*26}
      c.t-=dt;
      if(c.t<=0){
        if(c.state==='graze'){c.state='walk';const a=Math.random()*6.283,d=4+Math.random()*9;
          c.tgt.x=c.herd.x+Math.cos(a)*d;c.tgt.z=c.herd.z+Math.sin(a)*d;c.t=4+Math.random()*4}
        else{c.state='graze';c.t=4+Math.random()*7}}
      const want=c.state==='flee'?5.6:c.state==='walk'?1.3:0;
      c.spd+=(want-c.spd)*Math.min(1,dt*3);
      if(c.spd>.05){const dx=c.tgt.x-c.g.position.x,dz=c.tgt.z-c.g.position.z,dd2=Math.hypot(dx,dz);
        if(dd2>.6){const tRy=Math.atan2(dx,dz);let rel=tRy-c.ry;rel=Math.atan2(Math.sin(rel),Math.cos(rel));
          c.ry+=rel*Math.min(1,dt*(c.state==='flee'?4.5:2.4));c.g.rotation.y=c.ry;
          let nx2=c.g.position.x+Math.sin(c.ry)*c.spd*dt,nz2=c.g.position.z+Math.cos(c.ry)*c.spd*dt;
          nx2=Math.max(-128,Math.min(128,nx2));nz2=Math.max(-128,Math.min(128,nz2));
          c.g.position.set(nx2,HF.h(nx2,nz2),nz2)}
        else if(c.state!=='graze'){c.state='graze';c.t=3+Math.random()*5}
        c.legs.forEach((lg,li)=>{lg.rotation.x=Math.sin(tt*(c.state==='flee'?12:5.5)+li*Math.PI/2)*(c.state==='flee'?.75:.42)})}
      else c.legs.forEach(lg=>{lg.rotation.x*=.9});
      // head down in the grass when settled, up and watching when something is moving
      const nk=c.state==='graze'?1.02+Math.sin(tt*1.4+ci)*.07:c.state==='flee'?-.12:.3;
      c.neck.rotation.z+=(nk-c.neck.rotation.z)*Math.min(1,dt*3.5);
      c.tail.rotation.x=Math.sin(tt*2+ci)*.2}
    if(active)ducks.forEach(d=>{d.a+=dt*d.sp;const x=POND.x+Math.cos(d.a)*d.r,z=POND.z+Math.sin(d.a)*d.r;
      d.g.position.set(x,WATER_Y+.1+Math.sin(tt*1.7+d.bob)*.03,z);d.g.rotation.y=-d.a+(d.sp>0?Math.PI/2:-Math.PI/2);
      d.g.rotation.z=Math.sin(tt*2.2+d.bob)*.05});
    if(frameN%8===0){const cx=car.position.x,cz=car.position.z;
      for(let i=0;i<CULL.length;i++){const G=CULL[i];const dx=G.position.x-cx,dz=G.position.z-cz;G.visible=dx*dx+dz*dz<10200}}
        if(TJ.cup)TJ.cup.rotation.y+=dt*.6;
    if(active&&parts.visible&&frameN%2===0){const pa=pGeo.attributes.position.array,fall=wx.part==='rain'?38:wx.part==='snow'?4:3;const PN=pGeo.drawRange.count||PCOUNT;for(let i=0;i<PN;i++){const j=i*3;pa[j+1]-=fall*dt*2;if(wx.part!=='rain'){pa[j]+=Math.sin(tt+i)*dt*1.6;pa[j+2]+=Math.cos(tt*.7+i)*dt*1}if(pa[j+1]<0)pa[j+1]+=40}pGeo.attributes.position.needsUpdate=true;parts.position.set(Math.round(car.position.x/10)*10,car.position.y-4,Math.round(car.position.z/10)*10)}
    if(active){const nx=nextStation();const tgt=nx?nx.pos:gates[0].pos;
      beam.position.set(tgt.x,tgt.y+23,tgt.z);ringB.position.set(tgt.x,tgt.y+.1,tgt.z);beamM.opacity=.12+Math.sin(now/400)*.05;ringB.scale.setScalar(1+Math.sin(now/300)*.12);
      const dx=tgt.x-car.position.x,dz=tgt.z-car.position.z,dist=Math.hypot(dx,dz);const yawT=Math.atan2(dx,dz);
      guideArrow.position.set(car.position.x,car.position.y+3.6+Math.sin(now/260)*.15,car.position.z);guideArrow.rotation.y=yawT;guideArrow.visible=dist>22&&!cineOn;
      const q=chassisB.quaternion,yawC=Math.atan2(2*(q.w*q.y+q.x*q.z),1-2*(q.y*q.y+q.z*q.z));let rel=yawT-yawC;rel=Math.atan2(Math.sin(rel),Math.cos(rel));
      objArrow.style.transform='rotate('+(-rel*180/Math.PI)+'deg)';
      if(frameN%6===0)objTxt.textContent=nx?('Next · Chapter '+nx.chapter+' · '+nx.name+' · '+Math.round(dist)+' m'):('Finish · Trial gate · '+Math.round(dist)+' m');
      const tg=at(progU).tg;fwd.set(0,0,1).applyQuaternion(car.quaternion);wrongEl.classList.toggle('on',sp>4&&(fwd.x*tg.x+fwd.z*tg.z)<-.5&&dist>22&&!inPond)}
    stepWx(Math.min(.05,dt));
    fwd.set(0,0,1).applyQuaternion(car.quaternion);fwd.y=0;fwd.normalize();
    /* Camera. Every smoothing constant here is an exponential on dt rather than a fixed
       fraction per frame, so the follow feels identical at 30 fps and at 144 instead of
       snapping on fast machines and swimming on slow ones. The aim point is smoothed
       separately from the position, which is what takes the last of the jitter out of the
       horizon; the body rolls a degree or so into a turn; and driving into a new chapter
       eases the camera back a little and opens the lens for a second, without ever taking
       the car away from you. */
    if(!cineOn&&!recapCam){
      if(chapEase>0)chapEase=Math.max(0,chapEase-dt*.7);
      const ce=chapEase*chapEase*(3-2*chapEase);
      const pf=W<H?1.5:1,dist=(9.5+Math.min(5,sp*.2)+ce*1.9)*pf,hgt=(4.8+Math.min(2,sp*.07)+ce*.7)*pf;
      camT.copy(car.position).addScaledVector(fwd,-dist).add(tmp.set(0,hgt,0));
      C.position.lerp(camT,1-Math.exp(-dt*(active?6.5:3.2)));
      lookT.copy(car.position).addScaledVector(fwd,6).add(tmp.set(0,1.05,0));
      if(shake>.01){lookT.x+=(Math.random()-.5)*shake*.3;lookT.y+=(Math.random()-.5)*shake*.3;shake*=Math.pow(.08,dt)}
      look.lerp(lookT,1-Math.exp(-dt*9));
      C.lookAt(look);
      const st0=veh.wheelInfos[0]?veh.wheelInfos[0].steering:0;
      camRoll+=(-st0*Math.min(1,sp/16)*.085-camRoll)*(1-Math.exp(-dt*5));
      if(Math.abs(camRoll)>.0005)C.rotateZ(camRoll);
      const tf=50+Math.min(10,sp*.35)-ce*2.6;
      if(Math.abs(C.fov-tf)>.02){C.fov+=(tf-C.fov)*(1-Math.exp(-dt*3.2));C.updateProjectionMatrix()}}
    else if(recapCam){
      // parked at the summit: swing the camera round behind the car so the low sun stays in frame
      camT.copy(car.position).addScaledVector(SUN_DIR_LOW,-15).add(tmp.set(0,6.5,0));
      C.position.lerp(camT,1-Math.exp(-dt*1.1));
      lookT.copy(car.position).addScaledVector(SUN_DIR_LOW,45).add(tmp.set(0,2.5,0));
      look.lerp(lookT,1-Math.exp(-dt*1.4));
      C.lookAt(look);
      if(Math.abs(camRoll)>.0005){camRoll*=Math.exp(-dt*4)}
      if(Math.abs(C.fov-42)>.02){C.fov+=(42-C.fov)*(1-Math.exp(-dt*2));C.updateProjectionMatrix()}}
    const sunOff=recapCam?SUN_OFF_LOW:SUN_OFF_DEFAULT;
    sun.position.set(car.position.x+sunOff.x,car.position.y+sunOff.y,car.position.z+sunOff.z);sun.target.position.copy(car.position);
    sky.position.copy(C.position);stars.position.copy(C.position);stars.rotation.y+=dt*.0015;
    /* ---------- night sky: twinkle, moon, the odd shooting star ---------- */
    starMat.uniforms.uTime.value+=dt;
    moon.position.copy(C.position).addScaledVector(MOON_DIR,250);
    {const lit=wx.star>.12;
     if(!lit){shoot.next=3+Math.random()*8;if(shootL.visible){shootL.visible=false;shootMat.opacity=0}}
     else if(shoot.dur>0){
       shoot.t+=dt;const k=shoot.t/shoot.dur;
       if(k>=1){shoot.dur=0;shootL.visible=false;shootMat.opacity=0;shoot.next=5+Math.random()*11}
       else{
         const a=shootGeo.attributes.position.array;
         // head runs along the path, tail trails behind it
         const hx=shoot.from.x+shoot.dir.x*k*170,hy=shoot.from.y+shoot.dir.y*k*170,hz=shoot.from.z+shoot.dir.z*k*170;
         a[0]=C.position.x+hx;a[1]=hy;a[2]=C.position.z+hz;
         a[3]=C.position.x+hx-shoot.dir.x*26;a[4]=hy-shoot.dir.y*26;a[5]=C.position.z+hz-shoot.dir.z*26;
         shootGeo.attributes.position.needsUpdate=true;
         shootMat.opacity=Math.sin(k*Math.PI)*.85*wx.star}}
     else{
       shoot.next-=dt;
       if(shoot.next<=0){
         const th=Math.random()*6.283,ph=.35+Math.random()*.5,r=250;
         shoot.from.set(Math.sin(ph)*Math.cos(th)*r,Math.cos(ph)*r*.8+70,Math.sin(ph)*Math.sin(th)*r);
         shoot.dir.set(-Math.cos(th)*.7+(Math.random()-.5)*.5,-.35-Math.random()*.3,-Math.sin(th)*.7+(Math.random()-.5)*.5).normalize();
         shoot.t=0;shoot.dur=.55+Math.random()*.45;shootL.visible=true}}}
    sunSprite.position.copy(car.position).addScaledVector(recapCam?SUN_DIR_LOW:SUN_DIR,260);
    dust.position.set(car.position.x,0,car.position.z);dust.rotation.y+=dt*.02;
    if(active&&frameN%3===0){spdS+=(sp*3.6-spdS)*.4;spd.textContent=String(Math.round(spdS)).padStart(3,'0')}
    // the shadow map is only redrawn as often as the current tier asks for
    /* the story's light. Captured once the weather has set its own values, then pulled
       toward whatever band of the loop the car is in. */
    {const z=ZN,e=.08;
     S.fog.far+=(fogFar0*z.fog-S.fog.far)*e;S.fog.near+=(fogNear0*Math.min(1,z.fog)-S.fog.near)*e;
     const lt=(z.tint[0]+z.tint[1]+z.tint[2])/3;
     hemi.intensity+=(hemi0*lt-hemi.intensity)*e;sun.intensity+=(sunI0*Math.min(1.25,lt)-sun.intensity)*e}
    if(R.shadowMap.enabled){const se=ULTRA.shEvery;if(se&&frameN%se===0)sun.shadow.needsUpdate=true}
    R.render(S,C);if(active&&frameN%6===0)drawMap(mx2,mm.width,false);
    /* Grab the still immediately after the draw, in this same frame: the drawing buffer
       is not preserved past the end of it, so this is the only moment it can be read. */
    if(!active&&posterState===0&&++posterWarm>=4){
      try{const url=cv.toDataURL('image/jpeg',.86);
        if(url&&url.length>2048){poster.src=url;poster.style.display='block';posterState=1}
        else posterState=2}
      catch(e){posterState=2}}
  }
  requestAnimationFrame(loop);
  /* ---------- cinematic ---------- */
  let cineA=0;
  function cinematic(){cineOn=true;driving=false;cine.classList.add('on');const lines=$$('#dcine span');lines.forEach(l=>l.classList.remove('on'));cineA=0;
    let i=0;const step=()=>{if(!cineOn)return;if(i<lines.length){lines.forEach(l=>l.classList.remove('on'));lines[i].classList.add('on');i++;cine._t=setTimeout(step,1700)}else endCine()};step();
    const p0=car.position;const rf=()=>{if(!cineOn)return;cineA+=.005;C.position.set(p0.x+Math.sin(cineA+.6)*10,3+cineA*4,p0.z+Math.cos(cineA+.6)*10);C.lookAt(p0.x,1,p0.z);requestAnimationFrame(rf)};rf()}
  function endCine(){if(!cineOn)return;cineOn=false;missEl.classList.add('on');if(!missHint){missHint=true;const m0=curMission();if(m0)setTimeout(()=>toastMsg('Mission · '+m0.name),1200)}clearTimeout(cine._t);cine.classList.remove('on');driving=true;hud.classList.add('on');if(TOUCH)mob.classList.add('on');checkRot();blip(440,.3,.08);objEl.classList.add('on');updBW()}
  cine.onclick=endCine;
  function resize(){W=sec.clientWidth;H=sec.clientHeight;R.setPixelRatio(DPR());R.setSize(W,H,false);C.aspect=W/H;C.updateProjectionMatrix();if(sun.shadow)sun.shadow.needsUpdate=true}addEventListener('resize',resize);
  function enterDrive(){active=true;sec.classList.add('active');document.documentElement.classList.add('driving');if(TOUCH){sec.classList.add('touch');try{const fs=sec.requestFullscreen||sec.webkitRequestFullscreen;if(fs){const pr=fs.call(sec);if(pr&&pr.then)pr.then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(_){}}).catch(()=>{})}}catch(_){}}lenis&&lenis.stop();document.body.classList.add('locked');resize();audioInit();hint.textContent=TOUCH?'':'WASD drive · E look closer · L time a lap · M map · R reset';cinematic()}
  function exitDrive(){stopRace();closeBoard();missEl.classList.remove('on');try{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{})}catch(_){}document.documentElement.classList.remove('driving');fin.classList.remove('on');objEl.classList.remove('on');wrongEl.classList.remove('on');storyEl.classList.remove('on');liftEl.classList.remove('on');rot.classList.remove('on');active=false;driving=false;cineOn=false;clearTimeout(cine._t);cine.classList.remove('on');sec.classList.remove('active');lenis&&lenis.start();document.body.classList.remove('locked');hud.classList.remove('on');mob.classList.remove('on');viewer.classList.remove('on');bigmap.classList.remove('on');for(const k in key)key[k]=0;resize()}
  startBtn.onclick=enterDrive;$('#dexit').onclick=exitDrive;

  /* ---------- read the story without driving ----------
     Most visitors will never start the engine, and the thirteen chapters are
     the strongest thing on the page. This renders the same JOURNEY data as a
     plain scrollable list, built lazily on first open. */
  {const rd=$('#dread'),rdList=$('#dreadlist');let built=false;
   const build=()=>{
     if(built)return;built=true;
     rdList.innerHTML=JOURNEY.map(c=>{
       const q=(c.line||c.hook||'').replace(/^"|"$/g,'');
       const body=c.line2||c.stat||'';
       const ph=(c.photos&&c.photos[0]&&c.photos[0].src)||'';
       return '<li>'+
         '<div class="rc">Chapter '+c.chapter+' · '+c.name+'</div>'+
         (q?'<p class="rq">'+q+'</p>':'')+
         (body?'<p class="rb">'+body+'</p>':'')+
         (ph?'<img loading="lazy" alt="" src="'+ph+'">':'')+
       '</li>';
     }).join('');
   };
   const open=()=>{build();rd.classList.add('on');rd.scrollTop=0;document.body.style.overflow='hidden'};
   const close=()=>{rd.classList.remove('on');document.body.style.overflow=''};
   $('#dreadb').onclick=open;
   $('#dreadx').onclick=close;
   addEventListener('keydown',e=>{if(e.code==='Escape'&&rd.classList.contains('on'))close()});}
  HF.paint(0,[1,1,1]);applyWx(true);applyQ();updBW();
  /* Three.js compiles a program the first time a material is drawn. That made the first
     glimpse of this section cost one enormous frame. Compile them up front, in idle time,
     while the visitor is still reading the hero. */
  {let warmed=false;
   const warm=()=>{if(warmed)return;warmed=true;
     try{const d=R.getPixelRatio();R.setPixelRatio(.08);R.compile(S,C);R.render(S,C);R.setPixelRatio(d);R.setSize(W,H,false)}catch(e){}};
   const schedule=()=>{if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:4000});else setTimeout(warm,2200)};
   // wait for the intro to clear first, so the two WebGL scenes never compete
   const intro=$('#intro');
   if(intro&&!intro.classList.contains('gone')){
     const ob=new MutationObserver(()=>{if(intro.classList.contains('gone')){ob.disconnect();schedule()}});
     ob.observe(intro,{attributes:true,attributeFilter:['class']});setTimeout(schedule,7000);
   }else schedule();
   startBtn.addEventListener('pointerenter',warm,{once:true});}
  window.__drive={enter:()=>startBtn.click(),active:()=>active,near:()=>near,next:()=>nextStation()};
  window.__dbg={R,S,quality:()=>({tier:'Ultra',dpr:R.getPixelRatio()}),chassisB,veh,key:()=>key,active:()=>active,endCine,interact,toggleMap,tp:(u)=>{const {p,tg}=at(u);chassisB.position.set(p.x,p.y+1.3,p.z);chassisB.velocity.set(0,0,0);chassisB.angularVelocity.set(0,0,0);chassisB.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.atan2(tg.x,tg.z));progU=u},tpXY:(x,z)=>{chassisB.position.set(x,HF.h(x,z)+1.4,z);chassisB.velocity.set(0,0,0);chassisB.angularVelocity.set(0,0,0);chassisB.force.set(0,0,0);chassisB.torque.set(0,0,0)},hAt,C,freeze:v=>{cineOn=!!v},car,critters,birds,ducks,rings,rockPts,HF,anims,JOURNEY,traffic,startRace:()=>startRace(),lapState:()=>({raceMode,lapArmed,lapProg,lapNo,lapVoid,bestMs}),missions:MISSIONS,openBoard,sub:()=>sub};
})();

/* ===== GUIDE: cartoon lifter (three.js) ===== */
(function(){
  if(!window.THREE||REDUCE||matchMedia('(max-height:560px)').matches)return;
  const wrap=$('#guide'),cv=$('#gc'),bub=$('#bubble');
  let W=cv.clientWidth||180,H=cv.clientHeight||220;
  const R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true,powerPreference:'low-power'});
  /* He looked chewed up on a phone because this was capped at 1 on any touch screen:
     a 180x220 canvas drawn at 180x220 real pixels, then stretched across a 3x display.
     Draw at up to 2x instead. The canvas is tiny, so the cost of this is close to nothing. */
  const DPR=()=>Math.max(1,Math.min(devicePixelRatio||1,2));
  R.setPixelRatio(DPR());R.setSize(W,H,false);
  const S=new THREE.Scene();const C=new THREE.PerspectiveCamera(26,W/H,.1,50);C.position.set(0,1.6,13.5);C.lookAt(0,1.5,0);
  /* The CSS size changes at the 900px breakpoint and again in driving mode, but the
     backing store never followed, so he got stretched on top of being soft. Re-fit
     whenever the element's real size actually changes. */
  function fit(){const w=cv.clientWidth||W,h=cv.clientHeight||H;if(w===W&&h===H)return;
    W=w;H=h;C.aspect=W/H;C.updateProjectionMatrix();R.setPixelRatio(DPR());R.setSize(W,H,false)}
  addEventListener('resize',fit,{passive:true});addEventListener('orientationchange',fit,{passive:true});
  S.add(new THREE.HemisphereLight(0xfff7ec,0x3a3733,1.25));const dl=new THREE.DirectionalLight(0xffffff,.75);dl.position.set(3,7,6);S.add(dl);
  const grad=(()=>{const c=document.createElement('canvas');c.width=4;c.height=1;const x=c.getContext('2d');[['#7d7d7d',0],['#b4b4b4',1],['#d9d9d9',2],['#ececec',3]].forEach(([col,i])=>{x.fillStyle=col;x.fillRect(i,0,1,1)});const tx=new THREE.CanvasTexture(c);tx.minFilter=tx.magFilter=THREE.NearestFilter;return tx})();
  const M=c=>new THREE.MeshToonMaterial({color:c,gradientMap:grad});
  const OUT=new THREE.MeshBasicMaterial({color:0x14120f,side:THREE.BackSide});
  const skin=M(0xf7cd1e),ink=M(0x1b1916),hairM=M(0x241f1b),tank=M(0x2c5bd6),white=M(0xf6f4ee),red=M(0xc8302c),blue=M(0x2f4f9e),steel=M(0xb9b6b0),eyeW=M(0xffffff),gold=M(0xd9b03c),shade=M(0x0d0d0f);
  const root=new THREE.Group();S.add(root);
  function mesh(g,m,x,y,z,p,sx=1,sy=1,sz=1,ol=.05){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);p.add(o);if(ol){const k=new THREE.Mesh(g,OUT);k.position.copy(o.position);k.scale.set(sx+ol,sy+ol,sz+ol);p.add(k);o.userData.ol=k}return o}
  const box=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  /* ---- lego-minifig proportions, verified box skeleton (reliable widths, no floating parts) + lego head/hands ---- */
  /* Legs. These used to be two rigid blocks pinned at a fixed height in the root while the
     torso's hip height animated separately — so every time he sat down to pull, the hips
     slid clean off the top of the legs. And with no knee, the whole leg swung from the hip
     like a plank. Now it's a proper hip -> knee -> ankle chain hanging off a hip group that
     moves with the torso, and the knee angle gets solved so the feet stay planted. */
  const LT=.62,LS=.58,ANK=.05;                       // thigh, shin, ankle height off the floor
  const hips=new THREE.Group();hips.position.y=1.25;root.add(hips);
  const legL=new THREE.Group(),legR=new THREE.Group();legL.position.set(-.28,0,0);legR.position.set(.28,0,0);hips.add(legL,legR);
  const knees=[],feet=[];
  [legL,legR].forEach(l=>{
    mesh(box(.34,.62,.34),ink,0,-.31,0,l);                              // thigh
    const kn=new THREE.Group();kn.position.y=-LT;l.add(kn);knees.push(kn);
    mesh(box(.29,.56,.29),ink,0,-.29,0,kn);                             // shin
    const ft=new THREE.Group();ft.position.y=-LS;kn.add(ft);feet.push(ft);
    mesh(box(.36,.16,.6),white,0,.06,.06,ft);                           // shoe
    mesh(box(.39,.05,.3),red,0,.115,.2,ft,1,1,1,.01);                   // stripe
    mesh(box(.38,.07,.62),ink,0,-.01,.06,ft);                           // sole
  });
  /* Two-link solve in the sagittal plane: given how low the hips are and how far back
     they've travelled, find the thigh and shin angles that leave the ankle planted on the
     floor, knee tracking forward like a real one. tz is how far forward the foot sits
     relative to the hip, which is what keeps him from dragging his feet backwards. */
  function solveLeg(hy,tz){
    const ty=ANK-hy;let d=Math.hypot(tz,ty);const MX=LT+LS-.004;
    if(d>MX)d=MX;if(d<.24)d=.24;
    const al=Math.atan2(tz,-ty);
    const be=Math.acos(Math.max(-1,Math.min(1,(LT*LT+d*d-LS*LS)/(2*LT*d))));
    const pt=al+be,kz=LT*Math.sin(pt),ky=-LT*Math.cos(pt);
    const ps=Math.atan2(tz-kz,-(ty-ky));                                // shin, raked to the foot
    return[-pt,-(ps-pt),ps];                                            // thigh, knee, ankle (sole stays flat)
  }
  /* torso: stepped taper (hip narrow -> chest wide), matches classic minifig silhouette */
  const torso=new THREE.Group();torso.position.y=1.25;root.add(torso);
  mesh(box(.8,.4,.5),ink,0,.05,0,torso); // hips
  mesh(box(.85,.5,.5),tank,0,.48,0,torso); // waist
  mesh(box(1.05,.62,.56),tank,0,1.02,0,torso); // chest / shoulders
  mesh(box(.42,.16,.58),white,0,1.3,.01,torso,1,1,1,.02); // collar stripe
  mesh(box(1.1,.13,.62),ink,0,.26,0,torso); // belt
  mesh(new THREE.TorusGeometry(.32,.032,8,26,3.14),gold,0,1.56,.26,torso,1,1,1,0).rotation.x=1.3; // cuban link chain
  mesh(new THREE.OctahedronGeometry(.09,0),gold,0,1.16,.36,torso,1,1,1,.01); // pendant
  mesh(new THREE.OctahedronGeometry(.045,0),red,0,1.16,.42,torso,1,1,1,0); // gem
  /* arms: chunky muscular, shoulder overlaps well into the chest so there's no gap */
  const armL=new THREE.Group(),armR=new THREE.Group();armL.position.set(-.62,1.42,0);armR.position.set(.62,1.42,0);torso.add(armL,armR);
  [armL,armR].forEach((a,i)=>{const s=i?1:-1;
    mesh(box(.4,.4,.4),tank,0,0,0,a); // shoulder / sleeve cap (overlaps chest edge)
    mesh(box(.32,.26,.32),tank,0,-.25,0,a); // sleeve edge
    mesh(box(.3,.5,.3),skin,0,-.6,0,a); // bicep (bulked up)
    const fo=new THREE.Group();fo.position.set(0,-.86,0);a.add(fo);a.userData.fo=fo;
    mesh(box(.25,.52,.25),skin,0,-.26,0,fo); // forearm (overlaps elbow)
    mesh(box(.17,.06,.27),ink,0,-.46,0,fo); // wristband
    const hand=new THREE.Group();hand.position.set(0,-.56,.02);fo.add(hand);
    mesh(new THREE.SphereGeometry(.17,12,12),skin,0,0,0,hand); // claw base (overlaps wrist)
    mesh(new THREE.TorusGeometry(.11,.05,8,10,3.6),skin,s*.02,-.05,.06,hand,1,1,1,0).rotation.y=1.57; // claw hook
  });
  /* head: classic lego cylinder + stud + printed face, joined to the chest by a proper neck */
  const head=new THREE.Group();head.position.y=1.65;torso.add(head);
  mesh(new THREE.CylinderGeometry(.23,.19,.55,14),skin,0,-.25,0,head); // neck (reaches down into the chest)
  mesh(new THREE.CylinderGeometry(.4,.4,.62,22),skin,0,.31,0,head); // head cylinder
  mesh(new THREE.CylinderGeometry(.09,.09,.09,10),skin,0,.665,0,head,1,1,1,.015); // top stud
  // face plate (used for blink scale) — printed dot-eyes + smile, flat on the cylinder front
  const face=new THREE.Group();face.position.set(0,.31,0);head.add(face);
  [-1,1].forEach(s=>mesh(box(.09,.09,.05),ink,s*.15,.05,.375,face,1,1,1,0));
  mesh(new THREE.TorusGeometry(.13,.022,6,14,2.6),ink,0,-.14,.36,face,1,1,1,0).rotation.z=-Math.PI/2-.3;
  [-1,1].forEach(s=>mesh(box(.11,.03,.04),ink,s*.16,.16,.375,face,1,1,1,0)); // brows
  // drip shades — flat bar lens across the eyes, worn cool
  const shades=new THREE.Group();shades.position.set(0,.36,0);head.add(shades);
  mesh(box(.42,.13,.05),shade,0,0,.39,shades,1,1,1,.015); // lens bar
  [-1,1].forEach(s=>{const c=mesh(new THREE.CylinderGeometry(.08,.08,.06,14),shade,s*.185,0,.39,shades,1,1,1,0);c.rotation.x=1.5708}); // rounded lens ends
  // blocky curly-hair piece sitting on the cylinder head
  const curls=new THREE.Group();head.add(curls);
  for(let i=0;i<24;i++){const a=i*2.5,r=.28+((i*7)%4)*.05,y=.57+((i*5)%4)*.06,sz=.15+((i*3)%3)*.03;
    mesh(box(sz,sz,sz),hairM,Math.cos(a)*r,y,Math.sin(a)*r*.9,curls,1,1,1,.03)}
  for(let i=0;i<8;i++){mesh(box(.16,.16,.16),hairM,-.28+i*.08,.73-Math.abs(i-3.5)*.03,.14+((i*3)%3)*.03,curls,1,1,1,.03)}
  [-1,1].forEach(s=>{for(let i=0;i<3;i++)mesh(box(.13,.13,.13),hairM,s*.4,.45-i*.13,.18+i*.03,curls,1,1,1,.03)}); // sideburns
  // big over-ear headphones, arching clear of the curls
  mesh(new THREE.TorusGeometry(.47,.06,8,20,Math.PI),ink,0,.37,-.03,head,1,1,1,0);
  [-1,1].forEach(s=>{
    mesh(new THREE.CylinderGeometry(.21,.21,.17,16),ink,s*.47,.37,0,head,1,1,1,0).rotation.z=1.57; // cup shell
    mesh(new THREE.CylinderGeometry(.14,.14,.06,16),steel,s*.555,.37,0,head,1,1,1,0).rotation.z=1.57; // inner pad
    mesh(new THREE.CylinderGeometry(.045,.045,.09,10),red,s*.6,.37,0,head,1,1,1,0).rotation.z=1.57; // logo nub
  });
  /* barbell */
  const bar=new THREE.Group();root.add(bar);
  mesh(new THREE.CylinderGeometry(.045,.045,3.2,10),steel,0,0,0,bar,1,1,1,.02).rotation.z=1.57;
  [[-1.3,red,.48],[-1.17,red,.48],[-1.04,blue,.4],[1.3,red,.48],[1.17,red,.48],[1.04,blue,.4]].forEach(([x,m,r])=>{mesh(new THREE.CylinderGeometry(r,r,.11,22),m,x,0,0,bar,1,1,1,.03).rotation.z=1.57});
  bar.position.set(0,.5,.7);
  root.position.y=-2.05;root.rotation.y=.12;
  /* state machine */
  let mode='idle',modeT0=performance.now(),t0=performance.now(),mx=0,my=0,vel=0,lastY=scrollY,hop=0,click=0,blink=0;
  function setMode(m){if(m!==mode){mode=m;modeT0=performance.now()}}
  const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
  const seg=(tt,a,b,va,vb)=>tt<=a?va:tt>=b?vb:va+(vb-va)*ease((tt-a)/(b-a));
  const GUIDE={
    top:{mode:'idle',hello:"Hey, I'm Swastik. Tap me any time.",tips:["This is swastikk.m: powerbuilding coaching. Strength and size, one plan.","Scroll down, or tap a stop below and I'll take you there."]},
    load:{mode:'lift',hello:"That bar's loading to 230 kg. My deadlift.",tips:["Keep scrolling, the bar loads plate by plate up to 230 kg.","230 kg. Heaviest conventional deadlift at MUJ."]},
    drive:{mode:'point',hello:"Want the full story? Drive through it.",tips:["Hit Start engine. 13 chapters from 68 kg to 102 kg.","Thirteen chapters, in order, on boards you read from the driver's seat.","There's a hill that loads the deadlift as you climb, and a pond you can drive into."]},
    trans:{mode:'flex',hello:"68 kg on a plastic chair. Then 102.",tips:["Scroll and the photo wipes from before to after.","Same person. Only thing that changed: the plan, and actually sticking to it."]},
    work:{mode:'flex',hello:"Real training photos, no filter.",tips:["Deadlift, double biceps, triceps, curls. Swipe the strip on phone."]},
    offer:{mode:'idle',hello:"This is what you get. All of it.",tips:["A program built for you, form checks on video, food that fits, weekly check-ins, and WhatsApp access to me."]},
    price:{mode:'point',hello:"₹66 a day. Less than your whey.",tips:["One plan: ₹1,980 a month, everything included.","In person at MUJ Jaipur, or online from anywhere."]},
    results:{mode:'flex',hello:"My numbers, not a pitch.",tips:["68 to 102 kg, 520 kg total across squat, bench and deadlift.","More on Instagram @swastikk.m."]},
    nope:{mode:'idle',hello:"Honest filter. Read it twice.",tips:["If you want abs in 21 days, this isn't it. If you'll show up three days a week, it is."]},
    apply:{mode:'point',hello:"Two minutes, mostly taps.",tips:["9 quick questions. Mostly taps.","Your answers save if you close the tab. I reply on WhatsApp."]},
    game:{mode:'point',hello:"Follow the arrow. Each billboard is a chapter.",tips:["Arrow above the car points to the next chapter. The beam of light marks it.","Stop near a billboard or a lifter and press E (or tap the prompt) to look closer.","The sky changes as the story does — you don't have to touch a thing.","The hill loads the deadlift as you climb. The pond is inside the loop, drive in and swim.","Lost? M opens the map. R puts you back on the road."]},
  };
  const STOPS=[['drive','Drive'],['trans','Proof'],['price','Price'],['apply','Apply']];
  let cur='',tmr,tipI=0;
  const inGame=()=>document.documentElement.classList.contains('driving');
  function bshow(html,ms){clearTimeout(tmr);bub.classList.remove('show');setTimeout(()=>{bub.innerHTML=html;bub.classList.add('show')},160);if(ms)tmr=setTimeout(()=>bub.classList.remove('show'),ms)}
  function say(k){if(k===cur||inGame())return;cur=k;tipI=0;const G=GUIDE[k];if(!G)return;setMode(G.mode);bshow(G.hello+'<em class="bt">Tap me for more</em>',4200)}
  const secs=Object.keys(GUIDE).map(id=>document.getElementById(id)).filter(Boolean);
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)say(e.target.id)})},{rootMargin:'-40% 0px -40% 0px'});secs.forEach(s=>io.observe(s));
  addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-0.12)*2;my=(e.clientY/innerHeight-0.82)*2},{passive:true});
  cv.addEventListener('click',()=>{click=1;const k=inGame()?'game':(cur||'top');const G=GUIDE[k];setMode(G.mode);const tip=G.tips[tipI%G.tips.length];tipI++;
    const chips=inGame()?'':'<div class="bchips">'+STOPS.map(([id,l])=>'<button data-go="'+id+'">'+l+'</button>').join('')+'</div>';
    bshow('<span class="bn mono">'+(tipI)+' / '+G.tips.length+'</span>'+tip+chips,7000)});
  bub.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;const el=document.getElementById(b.dataset.go);if(el){lenis?lenis.scrollTo(el,{duration:1.2}):el.scrollIntoView({behavior:'smooth'})}bub.classList.remove('show')});
  new MutationObserver(()=>{fit();if(inGame()){cur='';setMode('point');bshow(GUIDE.game.hello+'<em class="bt">Tap me for tips</em>',5000)}}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  const L=(a,b,k)=>a+(b-a)*k;
  setInterval(()=>{blink=1},3200+Math.random()*1500);
  let gLast=0;
  /* This is a second WebGL scene. It used to redraw every frame forever, even while
     hidden and even while the game had the screen. Now it only draws when visible,
     at 30fps, and drops to 10fps whenever the game is running. */
  function gRate(){
    if(!wrap.classList.contains('on')||wrap.style.opacity==='0'||document.hidden)return 0;
    const r=wrap.getBoundingClientRect();
    if(r.bottom<=0||r.top>=innerHeight+40)return 0;
    if(document.documentElement.classList.contains('driving'))return 100;
    return matchMedia('(hover:hover)').matches?33:55;
  }
  function frame(now){
    requestAnimationFrame(frame);
    const rate=gRate();
    if(!rate||now-gLast<rate)return;
    gLast=now;const t=(now-t0)/1000;
    const dy=scrollY-lastY;lastY=scrollY;vel=L(vel,Math.max(-1,Math.min(1,dy/40)),.15);
    if(click){hop=1;click=0}hop=L(hop,0,.06);blink=L(blink,0,.25);
    let aL=0,aR=0,aLz=0,aRz=0,fL=0,fR=0,barY=.5,barZ=.7,torsoX=0,barVis=true,bob=0,hipY=1.25,legX=0,twistY=0,nod=0,tilt=0;
    if(mode==='lift'){const p=window.__load||0;torsoX=L(.7,.03,p);hipY=L(.95,1.25,p);barY=L(.5,1.45,p);barZ=L(.75,.55,p);aL=aR=L(1.0,.05,p)}
    else if(mode==='flex'){aLz=2.45;aRz=-2.45;aL=aR=-.35;fL=-2.1;fR=-2.1;barVis=false;bob=Math.sin(t*3)*.03}
    else if(mode==='point'){aR=-1.55;aL=.25;fR=-.2;barVis=false;bob=Math.sin(t*3)*.03}
    else if(mode==='workout'){
      /* warm-up (arm raises x2, bodyweight squats x2, torso twists) then a full 2-rep deadlift */
      const wt=(now-modeT0)/1000;barVis=wt>=7.9&&wt<13.4;
      if(wt<.5){aL=aR=.15}
      else if(wt<1.3){torsoX=seg(wt,.5,1.3,0,-.08);aL=aR=seg(wt,.5,1.3,.15,1.5)}
      else if(wt<1.9){torsoX=seg(wt,1.3,1.9,-.08,0);aL=aR=seg(wt,1.3,1.9,1.5,.15)}
      else if(wt<2.7){torsoX=seg(wt,1.9,2.7,0,-.08);aL=aR=seg(wt,1.9,2.7,.15,1.5)}
      else if(wt<3.3){torsoX=seg(wt,2.7,3.3,-.08,0);aL=aR=seg(wt,2.7,3.3,1.5,.15)}
      else if(wt<4.1){torsoX=seg(wt,3.3,4.1,0,.4);hipY=seg(wt,3.3,4.1,1.25,.92);legX=seg(wt,3.3,4.1,0,-.22);aL=aR=seg(wt,3.3,4.1,.15,.55)}
      else if(wt<4.8){torsoX=seg(wt,4.1,4.8,.4,0);hipY=seg(wt,4.1,4.8,.92,1.25);legX=seg(wt,4.1,4.8,-.22,0);aL=aR=seg(wt,4.1,4.8,.55,.15)}
      else if(wt<5.6){torsoX=seg(wt,4.8,5.6,0,.4);hipY=seg(wt,4.8,5.6,1.25,.92);legX=seg(wt,4.8,5.6,0,-.22);aL=aR=seg(wt,4.8,5.6,.15,.55)}
      else if(wt<6.3){torsoX=seg(wt,5.6,6.3,.4,0);hipY=seg(wt,5.6,6.3,.92,1.25);legX=seg(wt,5.6,6.3,-.22,0);aL=aR=seg(wt,5.6,6.3,.55,.15)}
      else if(wt<6.9){twistY=seg(wt,6.3,6.9,0,.5);torsoX=seg(wt,6.3,6.9,0,.08);hipY=1.25;aL=aR=.15}
      else if(wt<7.5){twistY=seg(wt,6.9,7.5,.5,-.5);torsoX=.08;hipY=1.25;aL=aR=.15}
      else if(wt<7.9){twistY=seg(wt,7.5,7.9,-.5,0);torsoX=seg(wt,7.5,7.9,.08,0);hipY=1.25;aL=aR=.15}
      else if(wt<8.7){torsoX=seg(wt,7.9,8.7,0,.7);hipY=seg(wt,7.9,8.7,1.25,.95);legX=seg(wt,7.9,8.7,0,-.12);aL=aR=seg(wt,7.9,8.7,.15,1.0);barY=.5;barZ=.75}
      else if(wt<9.6){torsoX=seg(wt,8.7,9.6,.7,.03);hipY=seg(wt,8.7,9.6,.95,1.25);legX=seg(wt,8.7,9.6,-.12,0);aL=aR=seg(wt,8.7,9.6,1.0,.05);barY=seg(wt,8.7,9.6,.5,1.45);barZ=seg(wt,8.7,9.6,.75,.55)}
      else if(wt<10.1){torsoX=.03;hipY=1.25;aL=aR=.05;barY=1.45;barZ=.55}
      else if(wt<11.0){torsoX=seg(wt,10.1,11.0,.03,.7);hipY=seg(wt,10.1,11.0,1.25,.95);legX=seg(wt,10.1,11.0,0,-.12);aL=aR=seg(wt,10.1,11.0,.05,1.0);barY=seg(wt,10.1,11.0,1.45,.5);barZ=seg(wt,10.1,11.0,.55,.75)}
      else if(wt<11.9){torsoX=seg(wt,11.0,11.9,.7,.03);hipY=seg(wt,11.0,11.9,.95,1.25);legX=seg(wt,11.0,11.9,-.12,0);aL=aR=seg(wt,11.0,11.9,1.0,.05);barY=seg(wt,11.0,11.9,.5,1.45);barZ=seg(wt,11.0,11.9,.75,.55)}
      else if(wt<12.5){torsoX=.03;hipY=1.25;aL=aR=.05;barY=1.45;barZ=.55}
      else if(wt<13.4){torsoX=seg(wt,12.5,13.4,.03,0);hipY=1.25;aL=aR=seg(wt,12.5,13.4,.05,.15);barY=seg(wt,12.5,13.4,1.45,.5);barZ=seg(wt,12.5,13.4,.55,.75)}
      else{aL=aR=.15}
    }
    else{
      /* Idle is the pose he's in most of the time, so idle IS the deadlift. He used to be
         frozen mid-hinge here, which read as a prop; then he stood around, which read as
         not lifting at all. Now he works through a real rep on a loop: set, pull, lock it
         out, control it back down, breathe, go again. Same p=0 bottom / p=1 lockout
         mapping the scroll-driven lift uses, so both modes agree on what a rep looks like. */
      const P=4.6,u=(t%P)/P;
      let p;
      if(u<.10)p=0;                          // set up on the bar, take the breath
      else if(u<.34)p=ease((u-.10)/.24);     // pull
      else if(u<.52)p=1;                     // lockout, hold it honest
      else if(u<.76)p=1-ease((u-.52)/.24);   // control it down, no dropping
      else p=0;                              // reset on the floor before the next one
      const br=Math.sin(t*2.4)*.012,grind=p>.05&&p<.95?Math.sin(t*22)*.004:0;
      torsoX=L(.70,.03,p);hipY=L(.95,1.25,p)+br;
      barY=L(.50,1.45,p);barZ=L(.75,.55,p);barVis=true;
      bob=br+grind;                          // bar speed slows and the body shakes mid-pull
      nod=Math.sin(t*3.6)*.05*(1-p);         // headphones on between reps, head still under load
      twistY=Math.sin(t*.5)*.03*(1-p);
    }
    /* The pull looked wrong because the arms and the bar were animated on two separate
       timelines: the arms swung through their own arc while the bar moved through its
       own, so the hands drifted off the bar mid-rep and it stopped reading as a deadlift.
       Solve it instead. The arm is a straight line from the shoulder, so work out where
       the shoulder actually is (the torso hinge moves it), point the arm at the bar, and
       put the bar exactly where the hand lands. Arms stay straight, hands stay attached,
       and the bar travels the short vertical line it does in real life. */
    /* A hinge sends the hips BACKWARD as the chest comes down — that was missing, so his
       shoulders swung way out over the bar and the arms had to reach forward to find it,
       which is why lockout looked like a front raise. Counterweight the hips and the
       shoulders stay stacked over the bar. */
    const hipZ=-.85*Math.sin(torsoX);
    /* any time a bar is in shot he is holding it — idle reps included */
    const grip=barVis;
    if(grip){
      const SH=1.42,ARM=1.42,BZ=.12;                            // shoulder height, arm length, bar over midfoot
      barZ=BZ;                                                  // the bar does not wander forward mid-rep
      let shY=hipY+SH*Math.cos(torsoX),shZ=hipZ+SH*Math.sin(torsoX);
      let d=Math.hypot(barY-shY,barZ-shZ);
      // at the bottom of the rep the floor is further than his arms are long, so sit the
      // hips down the difference rather than stretching him or leaving the bar hanging
      if(d>ARM){hipY-=(d-ARM);shY=hipY+SH*Math.cos(torsoX)}
      const dy=barY-shY,dz=barZ-shZ;d=Math.hypot(dy,dz)||1;
      const th=Math.atan2(-dz/d,-dy/d);                         // arm angle in world, straight down = 0
      aL=aR=th-torsoX;fL=fR=0;                                  // elbows locked, nobody curls a deadlift
      barY=shY-ARM*Math.cos(th);barZ=shZ-ARM*Math.sin(th);      // bar rides the hands, not its own path
    }

    torso.rotation.x=L(torso.rotation.x,torsoX,.1);
    torso.position.y=L(torso.position.y,hipY,.1);torso.position.z=L(torso.position.z,hipZ,.1);
    torso.rotation.y=L(torso.rotation.y,twistY,.1);
    /* hips carry the legs now, so the pelvis can never separate from them again */
    hips.position.y=L(hips.position.y,hipY,.1);hips.position.z=L(hips.position.z,hipZ,.1);
    const[tq,kq,fq]=solveLeg(hips.position.y,-hips.position.z);
    legL.rotation.x=L(legL.rotation.x,tq+legX,.15);legR.rotation.x=L(legR.rotation.x,tq+legX,.15);
    knees[0].rotation.x=L(knees[0].rotation.x,kq,.15);knees[1].rotation.x=L(knees[1].rotation.x,kq,.15);
    feet[0].rotation.x=L(feet[0].rotation.x,fq,.15);feet[1].rotation.x=L(feet[1].rotation.x,fq,.15);
    armL.rotation.x=L(armL.rotation.x,aL,.1);armR.rotation.x=L(armR.rotation.x,aR,.1);
    armL.rotation.z=L(armL.rotation.z,aLz,.1);armR.rotation.z=L(armR.rotation.z,aRz,.1);
    armL.userData.fo.rotation.x=L(armL.userData.fo.rotation.x,fL,.1);armR.userData.fo.rotation.x=L(armR.userData.fo.rotation.x,fR,.1);
    bar.visible=barVis;bar.position.y=L(bar.position.y,barY,.1);bar.position.z=L(bar.position.z,barZ,.1);
    /* That left-to-right slant was scroll velocity tilting the bar on its Z axis while
       both hands stayed level — so the bar sheared through the grip. A loaded bar does
       not tilt. Hold it dead level any time he is actually holding it. */
    bar.rotation.z=L(bar.rotation.z,grip?0:-vel*.12,.12);
    head.rotation.y=L(head.rotation.y,mx*.45+tilt,.08);head.rotation.x=L(head.rotation.x,-my*.3-torso.rotation.x*.8+nod,.08);
    head.rotation.z=L(head.rotation.z,tilt*.5,.08);
    root.position.y=-2.05+bob+Math.sin(t*9)*hop*.25+hop*.5;
    /* squash-stretch and the idle yaw both read as more slant once there is a bar in
       shot, so flatten them out and square him to camera for the duration of the pull */
    const sq=1+Math.abs(vel)*(grip?0:.1);root.scale.set(1/Math.sqrt(sq),sq,1/Math.sqrt(sq));
    root.rotation.y=L(root.rotation.y,grip?.02:.12+Math.sin(t*.7)*.06+vel*.1,.1);
    face.scale.y=1.05-blink*.35;if(face.userData.ol)face.userData.ol.scale.y=1.1-blink*.35;
    torso.scale.setScalar(1+Math.sin(t*2)*.012);
    R.render(S,C);
  }
  requestAnimationFrame(frame);
  function playWorkout(){
    if(inGame()||mode==='workout')return;
    setMode('workout');bshow('Let me warm up first.<em class="bt"></em>',2600);
    setTimeout(()=>{if(mode==='workout')bshow('Now the deadlift.<em class="bt"></em>',3200)},7900);
    setTimeout(()=>{if(mode==='workout'){const back=(GUIDE[cur]||GUIDE.top).mode;setMode(back)}},13700);
  }
  function scheduleWorkout(){setTimeout(()=>{if(!inGame()&&mode!=='workout')playWorkout();scheduleWorkout()},11000+Math.random()*6000)}
  const show=()=>{wrap.classList.add('on');say('top');setTimeout(playWorkout,3800);scheduleWorkout()};
  /* hold him back until the hero has been read, so he never sits on top of the headline CTA */
  const showWhenPastHero=()=>{
    let done=false;
    const check=()=>{if(done)return;const h=document.querySelector('.hero');
      const past=!h||h.getBoundingClientRect().bottom<innerHeight*.5;
      if(past){done=true;removeEventListener('scroll',check);show()}};
    addEventListener('scroll',check,{passive:true});
    if(lenis)lenis.on('scroll',check);
    check()};
  if('IntersectionObserver' in window){
    const card=$('#card');
    if(card)new IntersectionObserver(es=>{es.forEach(e=>{wrap.style.opacity=e.isIntersecting?'0':'';wrap.style.pointerEvents=e.isIntersecting?'none':''})},
      {threshold:.28}).observe(card)}
  if(intro.classList.contains('gone'))setTimeout(showWhenPastHero,600);
  else{const ob=new MutationObserver(()=>{if(intro.classList.contains('gone')){ob.disconnect();setTimeout(showWhenPastHero,900)}});ob.observe(intro,{attributes:true})}
})();


/* ===== FORM ===== */
const SECTIONS=['Basics','Training','Schedule','Plan','Contact'];
const ftin=cm=>{const t=cm/2.54;return `${Math.floor(t/12)} ft ${Math.round(t%12)} in`};
const STEPS=[
 {s:0,label:'Full name',type:'text',ph:'Type your name',req:true,auto:'name'},
 {s:0,label:'Age',type:'slider',min:15,max:45,def:20,unit:'yrs',req:true},
 {s:1,label:'Current weight (kg)',type:'slider',min:35,max:150,def:68,unit:'kg',hint:'I started at 68. No judgement.',req:true},
 {s:1,label:'Training experience',type:'choice',opts:['Never trained','Under 6 months','6 months to 2 years','2+ years'],req:true},
 {s:1,label:'Main goal',type:'choice',opts:['Build muscle','Get stronger','Both','Lose fat, keep strength'],req:true},
 {s:2,label:'Days per week you can train',type:'tiles',opts:['2-3','4','5','6'],unit:'days',req:true},
 {s:2,label:'Any injuries or pain?',type:'multi',opts:['None','Lower back','Knees','Shoulders','Other'],excl:'None',hint:'Tap all that apply.',req:true},
 {s:3,label:'Plan',type:'choice',opts:['Online · ₹500/month','In person · ₹1,200/month','Not sure yet'],req:true},
 {s:4,label:'WhatsApp number',type:'tel',hint:"This is how I'll reach you. Nobody else sees it.",req:true},
];
let ST={},cur=0,rev=false,backToRev=false,started=false;
try{const s=JSON.parse(localStorage.getItem('sl_app')||'null');if(s&&s.ST){ST=s.ST;cur=Math.min(+s.cur||0,STEPS.length-1)}}catch(e){}
const persist=()=>{try{localStorage.setItem('sl_app',JSON.stringify({ST,cur}))}catch(e){}};
const fv=$('#fv'),bb=$('#bb'),secs=$('#secs');
const pc=[PLATE.red,PLATE.blue,PLATE.yellow,PLATE.green,PLATE.white],phh=[80,72,64,54,42],pk=[25,20,15,10,5];
const side=()=>SECTIONS.map((_,i)=>`<i class="p" data-i="${i}" style="height:${phh[i]}px;background:${pc[i]}"></i>`).join('');
bb.innerHTML=`<div class="sl l"><i class="col"></i>${side()}</div><div class="rod"></div><div class="sl r"><i class="col"></i>${side()}</div>`;
secs.innerHTML=SECTIONS.map((n,i)=>`<span data-i="${i}">${n}</span>`).join('');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function defState(st){return st.type==='slider'?st.def:st.type==='lifts'?{unknown:true,squat:60,bench:40,deadlift:80}:st.type==='multi'?{sel:[],other:''}:''}
function get(st){return ST[st.label]===undefined?defState(st):ST[st.label]}
function ser(st){const v=get(st);switch(st.type){
  case 'slider':return String(v);
  case 'lifts':return v.unknown?"Don't know":`Squat ${v.squat}kg / Bench ${v.bench}kg / Deadlift ${v.deadlift}kg`;
  case 'multi':return v.sel.map(x=>x==='Other'&&v.other.trim()?'Other: '+v.other.trim():x).join(', ');
  case 'tel':return v?'+91 '+v:'';
  case 'insta':return v?'@'+v:'';
  default:return String(v||'').trim()}}
const shown=st=>{const s=ser(st);return s&&st.type==='slider'?s+' '+st.unit:s};
function secDone(i){const last=STEPS.map((s,k)=>s.s===i?k:-1).filter(k=>k>=0).pop();return rev||cur>last}
function bar(){
  let kg=20;$$('#bb .p').forEach(p=>p.classList.toggle('on',secDone(+p.dataset.i)));
  SECTIONS.forEach((_,i)=>{if(secDone(i))kg+=pk[i]*2});$('#loadKg').textContent=kg+' KG';
  $$('#secs span').forEach(n=>{const i=+n.dataset.i;n.classList.toggle('act',!rev&&STEPS[cur].s===i);n.classList.toggle('dn',secDone(i))});
  $('#qprog').style.width=(rev?100:cur/STEPS.length*100)+'%';
}
const fmtTel=d=>d.length>5?d.slice(0,5)+' '+d.slice(5):d;

function body(st){
  const v=get(st);
  switch(st.type){
  case 'choice':return `<div class="opts">${st.opts.map((o,i)=>`<button type="button" class="opt ${v===o?'sel':''}" data-v="${esc(o)}"><span class="k">${i+1}</span>${esc(o)}</button>`).join('')}</div>`;
  case 'tiles':return `<div class="tiles">${st.opts.map((o,i)=>`<button type="button" class="tile opt ${v===o?'sel':''}" data-v="${esc(o)}"><b>${esc(o)}</b><span class="mono">${st.unit}</span></button>`).join('')}</div>`;
  case 'multi':return `<div class="chips">${st.opts.map(o=>`<button type="button" class="chip ${v.sel.includes(o)?'sel':''}" data-v="${esc(o)}" aria-pressed="${v.sel.includes(o)}">${esc(o)}</button>`).join('')}</div>
    <input id="q${cur}o" class="other" type="text" placeholder="Other: tell me in a few words (optional)" value="${esc(v.other)}" ${v.sel.includes('Other')?'':'hidden'}>`;
  case 'slider':return `<div class="sld">
    <div class="sld-val"><input id="q${cur}" class="sld-num" type="text" inputmode="numeric" aria-label="${esc(st.label)}" value="${v}"><small>${st.unit}</small></div>
    <div class="sld-sub mono steel">${st.sub?st.sub(v):'&nbsp;'}</div>
    <div class="sld-row"><button type="button" class="step" data-d="-1" aria-label="Decrease">−</button><input id="q${cur}r" type="range" min="${st.min}" max="${st.max}" step="1" value="${v}" aria-label="${esc(st.label)} slider"><button type="button" class="step" data-d="1" aria-label="Increase">+</button></div>
    <div class="sld-ends mono"><span>${st.min}</span><span>Drag, tap ± or type</span><span>${st.max}</span></div></div>`;
  case 'lifts':return `<button type="button" class="chip dk ${v.unknown?'sel':''}" id="dk">Don't know</button>
    <div class="lifts ${v.unknown?'off':''}">${['squat','bench','deadlift'].map(k=>`<div class="lift"><span class="mono">${k}</span><input id="q${cur}${k}" type="range" min="0" max="300" step="2.5" value="${v[k]}" data-k="${k}" aria-label="${k} in kg"><b><span>${v[k]}</span> kg</b></div>`).join('')}</div>`;
  case 'tel':return `<div class="tel"><span>+91</span><input id="q${cur}" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="98765 43210" value="${fmtTel(v)}" maxlength="11"></div>`;
  case 'insta':return `<div class="tel"><span>@</span><input id="q${cur}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="yourhandle" value="${esc(v)}"></div>`;
  default:return `<input id="q${cur}" type="text" autocomplete="${st.auto||'off'}" autocapitalize="words" placeholder="${esc(st.ph||'')}" value="${esc(v)}">`;
  }
}
function render(){
  bar();persist();if(rev)return review();
  const st=STEPS[cur];const left=Math.max(1,Math.round((STEPS.length-cur)*6/60));
  const empty=!ser(st);
  const label=backToRev?'Save':cur===STEPS.length-1?(st.req||!empty?'Review':'Skip & review'):(!st.req&&empty&&st.type!=='lifts'?'Skip':'Next');
  const html=`<div class="qin"><div class="qc mono"><span>${String(cur+1).padStart(2,'0')} / ${STEPS.length} · ${SECTIONS[st.s]}</span><span>~${left} min left</span></div>
  <h3 class="qt">${esc(st.label)}${st.req?'':' <em>(optional)</em>'}</h3>${st.hint?`<div class="qh">${esc(st.hint)}</div>`:''}
  <div class="qb">${body(st)}</div><div class="err" id="err" role="alert"></div>
  <div class="fnav"><button type="button" class="back mono" id="bk" ${cur===0?'style="visibility:hidden"':''}>← Back</button><button type="button" class="btn" id="nx"><span>${label}</span><span class="ar">→</span></button></div></div>`;
  // step transition: swap content while GSAP fades/slides it in, instead of a flat innerHTML swap
  if(window.gsap&&fv.firstElementChild){
    const dir=render._dir||1;
    gsap.to(fv,{opacity:0,x:-14*dir,duration:.16,ease:'power2.in',onComplete(){
      fv.innerHTML=html;wire(st);
      gsap.fromTo(fv,{opacity:0,x:14*dir},{opacity:1,x:0,duration:.32,ease:'power2.out'});
    }});
  }else{fv.innerHTML=html;wire(st)}
  if(started){const r=$('#card').getBoundingClientRect();if(r.top<0||r.top>innerHeight*.6){const y=r.top+scrollY-90;lenis?lenis.scrollTo(y,{duration:.6}):scrollTo({top:y,behavior:'smooth'})}}
  started=true;
}
function setNx(){const st=STEPS[cur],b=$('#nx');if(!b||backToRev)return;const empty=!ser(st);b.firstElementChild.textContent=cur===STEPS.length-1?(st.req||!empty?'Review':'Skip & review'):(!st.req&&empty&&st.type!=='lifts'?'Skip':'Next')}
function wire(st){
  const hover=matchMedia('(hover:hover)').matches,err=$('#err');
  const t=fv.querySelector('#q'+cur);
  if(st.type==='choice'||st.type==='tiles'){
    fv.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ST[st.label]=b.dataset.v;fv.querySelectorAll('.opt').forEach(o=>o.classList.toggle('sel',o===b));persist();setTimeout(next,220)});
  }
  if(st.type==='multi'){
    const o=$('#q'+cur+'o');
    fv.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{
      const v=get(st),x=c.dataset.v;let sel=v.sel.includes(x)?v.sel.filter(y=>y!==x):[...v.sel,x];
      if(st.excl){if(x===st.excl&&sel.includes(x))sel=[x];else if(x!==st.excl)sel=sel.filter(y=>y!==st.excl)}
      ST[st.label]={sel,other:v.other};
      fv.querySelectorAll('.chip').forEach(k=>{const on=sel.includes(k.dataset.v);k.classList.toggle('sel',on);k.setAttribute('aria-pressed',on)});
      o.hidden=!sel.includes('Other');if(!o.hidden&&x==='Other'&&hover)o.focus({preventScroll:true});
      err.textContent='';persist();
    });
    o.oninput=()=>{const v=get(st);ST[st.label]={sel:v.sel,other:o.value};persist()};
    o.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();next()}};
  }
  if(st.type==='slider'){
    const r=$('#q'+cur+'r'),n=t,sub=fv.querySelector('.sld-sub');
    const paint=val=>{n.style.width=(String(val).length*.62+.15)+'em';r.style.setProperty('--p',((val-st.min)/(st.max-st.min)*100)+'%');if(st.sub)sub.textContent=st.sub(val)};
    const set=(val,from)=>{val=Math.max(st.min,Math.min(st.max,Math.round(+val)));if(isNaN(val))val=st.def;ST[st.label]=val;if(from!=='r')r.value=val;if(from!=='n')n.value=val;paint(val);persist()};
    r.oninput=()=>set(r.value,'r');
    n.oninput=()=>{const d=n.value.replace(/\D/g,'').slice(0,3);n.value=d;if(d&&+d>=st.min&&+d<=st.max){ST[st.label]=+d;r.value=d;paint(+d);persist()}};
    n.onfocus=()=>n.select();
    n.onblur=()=>set(n.value||get(st));
    n.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();set(n.value||get(st));next()}if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();set(get(st)+(e.key==='ArrowUp'?1:-1))}};
    fv.querySelectorAll('.step').forEach(b=>{let to,iv;const bump=()=>set(get(st)+ +b.dataset.d);
      const stop=()=>{clearTimeout(to);clearInterval(iv)};
      b.onpointerdown=e=>{e.preventDefault();bump();to=setTimeout(()=>iv=setInterval(bump,60),380)};
      b.onpointerup=b.onpointerleave=b.onpointercancel=stop;
      b.onclick=e=>{if(e.detail===0)bump()};});
    set(get(st));
  }
  if(st.type==='lifts'){
    const dk=$('#dk'),wrap=fv.querySelector('.lifts');
    const paint=()=>{const v=get(st);dk.classList.toggle('sel',v.unknown);wrap.classList.toggle('off',v.unknown);
      wrap.querySelectorAll('input').forEach(r=>{r.style.setProperty('--p',(r.value/300*100)+'%');r.nextElementSibling.firstElementChild.textContent=r.value})};
    dk.onclick=()=>{const v={...get(st)};v.unknown=!v.unknown;ST[st.label]=v;paint();persist()};
    wrap.querySelectorAll('input').forEach(r=>r.oninput=()=>{const v={...get(st)};v[r.dataset.k]=+r.value;v.unknown=false;ST[st.label]=v;paint();persist()});
    paint();
  }
  if(st.type==='tel'){
    t.oninput=()=>{let d=t.value.replace(/\D/g,'');if(d.length>10&&d.startsWith('91'))d=d.slice(2);d=d.slice(0,10);t.value=fmtTel(d);ST[st.label]=d;err.textContent='';persist();setNx()};
  }
  if(st.type==='insta'){
    t.oninput=()=>{const v=t.value.replace(/^@+/,'').replace(/\s/g,'');t.value=v;ST[st.label]=v;persist();setNx()};
  }
  if(st.type==='text'){t.oninput=()=>{ST[st.label]=t.value;persist();err.textContent=''}}
  if(t&&['text','tel','insta'].includes(st.type)){
    t.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();next()}};
    if(started&&hover)t.focus({preventScroll:true});
  }
  $('#nx').onclick=next;
  $('#bk').onclick=()=>{cur--;render._dir=-1;render()};
}
function next(){
  const st=STEPS[cur],err=$('#err'),v=get(st);
  if(ST[st.label]===undefined&&(st.type==='slider'||st.type==='lifts'))ST[st.label]=defState(st);
  if(st.req){
    if((st.type==='text')&&!ser(st))return err.textContent='Need a name so I know who I\'m talking to.';
    if((st.type==='choice'||st.type==='tiles')&&!v)return err.textContent='Tap one to continue.';
    if(st.type==='multi'&&!v.sel.length)return err.textContent='Tap at least one.';
  }
  if(st.type==='tel'&&!/^[6-9]\d{9}$/.test(v))return err.textContent='Enter your 10-digit mobile number.';
  if(backToRev||cur===STEPS.length-1){rev=true;backToRev=false}else cur++;
  render._dir=1;render();
}
function review(){
  fv.innerHTML=`<div class="qin"><div class="qc mono"><span>All plates loaded · 220 kg</span><span>Last step</span></div><h3 class="qt">Check your answers.</h3><div class="qh">Tap any row to change it.</div>
  <div class="rvw">${STEPS.map((s,i)=>`<button type="button" class="rv" data-i="${i}"><span class="l">${esc(s.label)}</span><span class="v">${esc(shown(s)||'—')}</span><span class="ed mono">Edit</span></button>`).join('')}</div>
  <div class="err" id="err" role="alert"></div>
  <input id="sl_hp" class="sl-hp" type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
  <div class="fnav"><button type="button" class="back mono" id="bk">← Back</button><button type="button" class="btn" id="sub"><span>Submit the form</span><span class="ar">→</span></button></div></div>`;
  fv.querySelectorAll('.rv').forEach(b=>b.onclick=()=>{cur=+b.dataset.i;rev=false;backToRev=true;render()});
  $('#bk').onclick=()=>{rev=false;cur=STEPS.length-1;render._dir=-1;render()};
  $('#sub').onclick=submit;
}
/* ---------- lead delivery ----------
   Three layers, so an application can never quietly vanish:
   1. POST to the Apps Script endpoint (writes a row in Swastik's sheet)
   2. if that fails, park it in localStorage and retry on the next visit
   3. either way, offer a pre-filled WhatsApp handoff so the lead lands today   */
function leadSummary(vals){
  const pick=['Full name','Age','Plan','Current weight (kg)','Training experience',
    'Current best lifts (squat / bench / deadlift)','Main goal','Days per week you can train','Gym access',
    'Any injuries or pain?','WhatsApp number','Instagram handle'];
  const lines=pick.filter(k=>vals[k]!==undefined&&vals[k]!=='').map(k=>k+': '+vals[k]);
  return 'swastikk.m application\n\n'+lines.join('\n')+'\n\n(Sent from the website form.)';
}
function waLink(vals){return 'https://wa.me/'+SL_CFG.WHATSAPP+'?text='+encodeURIComponent(leadSummary(vals))}
function queueLead(payload){try{
  const q=JSON.parse(localStorage.getItem('sl_queue')||'[]');q.push(payload);
  localStorage.setItem('sl_queue',JSON.stringify(q.slice(-5)))}catch(e){}}
async function postLead(payload){
  if(!BACKEND_ON)return {ok:false,reason:'unconfigured'};
  try{
    const r=await fetch(SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
    const t=await r.text();let d={};try{d=JSON.parse(t)}catch(e){}
    if(!r.ok||d.ok===false||d.status==='error')return {ok:false,reason:d.error||d.message||('server '+r.status)};
    return {ok:true};
  }catch(e){return {ok:false,reason:'network'}}
}
/* anything queued on an earlier visit gets another go, quietly */
addEventListener('load',async()=>{
  if(!BACKEND_ON)return;
  let q=[];try{q=JSON.parse(localStorage.getItem('sl_queue')||'[]')}catch(e){}
  if(!q.length)return;
  const left=[];
  for(const p of q){const r=await postLead(p);if(!r.ok)left.push(p)}
  try{left.length?localStorage.setItem('sl_queue',JSON.stringify(left)):localStorage.removeItem('sl_queue')}catch(e){}
});
/* Honeypot: an off-screen field no human can see or tab into, so anything in it
   came from a bot filling every input on the page. We fake the success screen
   rather than showing an error, because telling a bot it failed just teaches it
   to try again. Nothing is sent. */
function isBot(){const h=document.getElementById('sl_hp');return !!(h&&h.value)}
async function submit(){
  const b=$('#sub'),err=$('#err');b.disabled=true;b.firstElementChild.textContent='Lifting\u2026';err.textContent='';
  if(isBot()){return done(Object.fromEntries(STEPS.map(s=>[s.label,ser(s)])),true)}
  const vals=Object.fromEntries(STEPS.map(s=>[s.label,ser(s)]));
  const payload={key:SECRET_KEY,type:'application',submittedAt:new Date().toISOString(),
    answers:STEPS.map(s=>({label:s.label,value:vals[s.label]})),...vals};
  const r=await postLead(payload);
  if(r.ok){try{localStorage.removeItem('sl_app')}catch(e){}return done(vals,true)}
  // nothing reached the sheet, so keep it and hand it over on WhatsApp instead
  queueLead(payload);
  if(r.reason==='network'){
    b.disabled=false;b.firstElementChild.textContent='Try again';
    err.innerHTML='Couldn\u2019t reach the server, so your answers are saved on this device and will send themselves next time you open the site. '+
      'If you\u2019d rather not wait, <a href="'+waLink(vals)+'" target="_blank" rel="noopener" style="border-bottom:1px solid currentColor">send them on WhatsApp</a>.';
    return;
  }
  done(vals,false);
}
function done(vals,delivered){
  $$('#bb .p').forEach(p=>p.classList.add('on'));secs.innerHTML='';$('#qprog').style.width='100%';
  const first=esc((vals['Full name']||'').split(' ')[0]||'lifter');
  const body=delivered
    ? `<p class="qh" style="max-width:40ch;margin:14px auto 0">Application\u2019s in, ${first}. I\u2019ll message you on WhatsApp soon. Go eat something with protein in it.</p>`
    : `<p class="qh" style="max-width:42ch;margin:14px auto 0">Saved, ${first}. One tap left \u2014 send it to me on WhatsApp and I\u2019ll read it today.</p>
       <div class="fin-cta" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:22px">
         <a class="btn ink" href="${waLink(vals)}" target="_blank" rel="noopener"><span>Send on WhatsApp</span><span class="ar">\u2192</span></a>
         ${SL_CFG.EMAIL?`<a class="lnk" href="mailto:${esc(SL_CFG.EMAIL)}?subject=${encodeURIComponent('swastikk.m application')}&body=${encodeURIComponent(leadSummary(vals))}" style="border-color:var(--ink)">Email it instead</a>`:''}
       </div>`;
  fv.innerHTML=`<div class="done qin"><div class="lights" id="dl"><i class="jl"></i><i class="jl"></i><i class="jl"></i></div><div class="gl disp">Good lift.</div>
  ${body}<img src="${$('#fImg').src}" alt="Swastik"></div>`;
  $$('#dl .jl').forEach((j,i)=>setTimeout(()=>j.classList.add('on'),250+i*260));
}
/* number keys pick options on desktop */
addEventListener('keydown',e=>{
  if(rev||/INPUT|TEXTAREA/.test(document.activeElement.tagName)||e.metaKey||e.ctrlKey)return;
  const r=$('#card').getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
  const n=+e.key;const o=fv.querySelectorAll('.opt');if(n>=1&&n<=o.length){o[n-1].click()}
});
/* hero quick-start */
$$('#teaser [data-goal]').forEach(b=>b.onclick=()=>{
  ST['Main goal']=b.dataset.goal;persist();
  $$('#teaser [data-goal]').forEach(x=>x.classList.toggle('sel',x===b));
  const t=$('#apply');setTimeout(()=>lenis?lenis.scrollTo(t,{duration:1.2}):t.scrollIntoView({behavior:'smooth'}),250);
});
render();

