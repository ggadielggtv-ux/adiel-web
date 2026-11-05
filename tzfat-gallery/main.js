/* Koraveo demo · vanilla JS, no dependencies */
(()=>{
const d=document,root=d.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');
/* header state */
const hdr=d.querySelector('.hdr');
const onScroll=()=>{hdr&&hdr.classList.toggle('scrolled',scrollY>40)};
addEventListener('scroll',onScroll,{passive:true});onScroll();
/* mobile menu */
const burger=d.querySelector('.burger'),menu=d.getElementById('menu');
if(burger&&menu){
 const set=o=>{burger.setAttribute('aria-expanded',o);menu.classList.toggle('open',o);d.body.classList.toggle('lock',o)};
 burger.addEventListener('click',()=>set(burger.getAttribute('aria-expanded')!=='true'));
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
 d.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
}
/* reveal on scroll */
const els=d.querySelectorAll('[data-r]');
if('IntersectionObserver' in window&&!reduce){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px',threshold:.08});
 els.forEach(el=>io.observe(el));
}else els.forEach(el=>el.classList.add('in'));
/* counters */
const fmt=n=>n.toLocaleString('he-IL');
const cio='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{
 if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.count;cio.unobserve(el);
 if(reduce){el.textContent=fmt(to);return}
 const t0=performance.now(),dur=1400;const tick=t=>{const p=Math.min(1,(t-t0)/dur),v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=fmt(v);if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)
}),{threshold:.6}):null;
d.querySelectorAll('[data-count]').forEach(el=>cio?cio.observe(el):el.textContent=fmt(+el.dataset.count));
/* tabs */
d.querySelectorAll('[role=tablist]').forEach(list=>{
 const tabs=[...list.querySelectorAll('[role=tab]')];
 const sel=t=>{tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;const p=d.getElementById(x.getAttribute('aria-controls'));if(p){p.hidden=!on;if(on){p.classList.remove('in');void p.offsetWidth;p.classList.add('in')}}})};
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>sel(t));t.addEventListener('keydown',e=>{
  let j=null;if(e.key==='ArrowLeft')j=i+1;if(e.key==='ArrowRight')j=i-1;if(e.key==='Home')j=0;if(e.key==='End')j=tabs.length-1;
  if(j!==null){e.preventDefault();j=(j+tabs.length)%tabs.length;tabs[j].focus();sel(tabs[j])}})});
});
/* parallax */
const px=[...d.querySelectorAll('[data-parallax]')];
if(px.length&&!reduce){
 let ticking=false;const run=()=>{const vh=innerHeight;px.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;const k=parseFloat(el.dataset.parallax)||.12;el.style.transform=`translate3d(0,${((r.top+r.height/2-vh/2)*-k).toFixed(1)}px,0) scale(1.12)`});ticking=false};
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(run)}},{passive:true});run();
}
/* lightbox */
const lb=d.querySelector('.lb');
if(lb){
 const img=lb.querySelector('img'),cap=lb.querySelector('.lb-cap'),items=[...d.querySelectorAll('[data-lb]')];let cur=0,last=null;
 const show=i=>{cur=(i+items.length)%items.length;const a=items[cur];img.src=a.getAttribute('href');img.alt=a.querySelector('img').alt;cap.textContent=a.dataset.cap||''};
 const open=i=>{last=d.activeElement;show(i);lb.hidden=false;d.body.classList.add('lock');lb.querySelector('.lb-x').focus()};
 const close=()=>{lb.hidden=true;d.body.classList.remove('lock');last&&last.focus()};
 items.forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();open(i)}));
 lb.querySelector('.lb-x').addEventListener('click',close);
 lb.querySelector('.lb-n').addEventListener('click',()=>show(cur-1));
 lb.querySelector('.lb-p').addEventListener('click',()=>show(cur+1));
 lb.addEventListener('click',e=>{if(e.target===lb)close()});
 d.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur+1);if(e.key==='ArrowRight')show(cur-1)});
}
/* demo toast for placeholder links & forms */
const toast=d.querySelector('.toast');let tt;
const say=m=>{if(!toast)return;toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),3800)};
d.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();say(a.dataset.msg||'זה אתר לדוגמה: באתר אמיתי הכפתור פותח וואטסאפ עם הודעה מוכנה לעסק.')}));
d.querySelectorAll('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;say(f.dataset.msg||'תודה! זה טופס לדוגמה: באתר אמיתי הבקשה נשלחת לעסק בוואטסאפ או במייל.')}));
/* booking estimate (stay demo) */
const bf=d.getElementById('book');
if(bf){
 const a=bf.querySelector('[name=in]'),b=bf.querySelector('[name=out]'),s=bf.querySelector('[name=suite]'),out=d.getElementById('est');
 const today=new Date();const iso=x=>x.toISOString().slice(0,10);a.min=iso(today);
 const calc=()=>{b.min=a.value||iso(today);if(!a.value||!b.value){out.textContent='בחרו תאריכים לקבלת הערכת מחיר';return}
  const s0=new Date(a.value),e0=new Date(b.value);let n=Math.round((e0-s0)/864e5);if(n<1){out.textContent='תאריך היציאה צריך להיות אחרי תאריך ההגעה';return}
  const o=s.selectedOptions[0],mid=+o.dataset.mid,we=+o.dataset.we;let sum=0;for(let i=0;i<n;i++){const dd=new Date(s0.getTime()+i*864e5).getDay();sum+=(dd===4||dd===5)?we:mid}
  out.innerHTML=`${n} ${n===1?'לילה':'לילות'} · הערכה: <b>₪${fmt(sum)}</b> <small>כולל ארוחת בוקר</small>`};
 [a,b,s].forEach(x=>x.addEventListener('change',calc));calc();
}
/* background video: lazy, muted, paused off-screen, skipped for reduced motion / data saver */
const vids=[...d.querySelectorAll('video[data-bgv]')],saver=navigator.connection&&navigator.connection.saveData;
if(vids.length&&!reduce&&!saver&&'IntersectionObserver' in window){
 const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;
  if(e.isIntersecting){if(!v.dataset.ok){v.querySelectorAll('source[data-src]').forEach(s=>s.src=s.dataset.src);v.load();v.dataset.ok=1;v.addEventListener('playing',()=>v.classList.add('on'),{once:true})}v.play().catch(()=>{})}
  else if(v.dataset.ok)v.pause()}),{rootMargin:'200px 0px'});
 vids.forEach(v=>{v.muted=true;vio.observe(v)});
}
const y=d.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
})();
