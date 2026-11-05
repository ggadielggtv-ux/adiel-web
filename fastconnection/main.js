/* Fast Connection · vanilla JS, no dependencies */
(function(){
var d=document,root=d.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,IO='IntersectionObserver' in window;
root.classList.add('js');
var yr=d.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();

/* header */
var hdr=d.querySelector('.hdr');
function onScroll(){hdr.classList.toggle('scrolled',scrollY>30)}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* mobile menu */
var burger=d.querySelector('.burger'),menu=d.getElementById('menu');
function setMenu(o){burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'סגירת תפריט':'פתיחת תפריט');menu.classList.toggle('open',o);hdr.classList.toggle('menu-open',o);d.body.classList.toggle('lock',o)}
burger.addEventListener('click',function(){setMenu(burger.getAttribute('aria-expanded')!=='true')});
menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){setMenu(false);burger.focus()}});
addEventListener('resize',function(){if(innerWidth>999&&menu.classList.contains('open'))setMenu(false)});

/* reveal */
var els=d.querySelectorAll('[data-r]');
if(IO&&!reduce){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
 els.forEach(function(el){io.observe(el)});
}else els.forEach(function(el){el.classList.add('in')});

/* background video: load & play only when visible */
d.querySelectorAll('video[data-bgv]').forEach(function(v){
 if(reduce||!IO||(navigator.connection&&navigator.connection.saveData))return;
 var loaded=false;
 new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){
   if(!loaded){v.querySelectorAll('source').forEach(function(s){s.src=s.dataset.src});v.load();loaded=true}
   var p=v.play();if(p&&p.catch)p.catch(function(){});
  }else if(loaded)v.pause();
 })},{rootMargin:'200px 0px'}).observe(v);
});

/* mobile dock: visible after the hero, hidden over the contact section */
var hero=d.querySelector('.hero'),ct=d.getElementById('contact');
if(IO&&hero&&ct){var inH=true,inC=false;function u(){d.body.classList.toggle('show-dock',!inH&&!inC)}
 new IntersectionObserver(function(e){inH=e[0].isIntersecting;u()}).observe(hero);
 new IntersectionObserver(function(e){inC=e[0].isIntersecting;u()},{threshold:.05}).observe(ct);}

/* network canvas */
var cv=d.getElementById('net');
if(cv&&cv.getContext){
 var ctx=cv.getContext('2d'),W,H,dpr,pts=[],raf=null,mouse={x:-1e4,y:-1e4};
 function size(){dpr=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  var n=Math.round(Math.min(78,Math.max(26,W*H/19000)));
  while(pts.length<n)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.4+.6});
  pts.length=n;}
 function draw(){
  ctx.clearRect(0,0,W,H);var max=W<700?110:150,i,j,a,b,dx,dy,dd;
  for(i=0;i<pts.length;i++){a=pts[i];
   if(!reduce){a.x+=a.vx;a.y+=a.vy;if(a.x<-20)a.x=W+20;if(a.x>W+20)a.x=-20;if(a.y<-20)a.y=H+20;if(a.y>H+20)a.y=-20}
   for(j=i+1;j<pts.length;j++){b=pts[j];dx=a.x-b.x;dy=a.y-b.y;dd=dx*dx+dy*dy;
    if(dd<max*max){ctx.strokeStyle='rgba(212,175,55,'+(0.16*(1-Math.sqrt(dd)/max)).toFixed(3)+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
   dx=a.x-mouse.x;dy=a.y-mouse.y;dd=dx*dx+dy*dy;
   if(dd<180*180){ctx.strokeStyle='rgba(243,229,171,'+(0.22*(1-Math.sqrt(dd)/180)).toFixed(3)+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke()}
   ctx.fillStyle='rgba(226,196,98,.55)';ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,6.283);ctx.fill();
  }
  if(!reduce)raf=requestAnimationFrame(draw);
 }
 size();draw();
 var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){size();if(reduce)draw()},150)});
 addEventListener('pointermove',function(e){if(e.pointerType==='mouse'){mouse.x=e.clientX;mouse.y=e.clientY}},{passive:true});
 d.addEventListener('visibilitychange',function(){if(reduce)return;if(d.hidden){cancelAnimationFrame(raf);raf=null}else if(!raf)draw()});
}

/* contact form: Web3Forms → FormSubmit → mailto */
var f=d.getElementById('leadform');
if(f){
 var msg=f.querySelector('.form-msg'),btn=f.querySelector('button[type=submit]'),btnHTML=btn.innerHTML,TO='pini@fastconnection.co.il';
 var W3F_KEY='e3067cc6-c3c9-494d-b83c-6b32344aafd6';
 function say(t,ok){msg.textContent=t;msg.className='form-msg '+(ok?'ok':'err');msg.focus()}
 function mailto(data){var b=[];data.forEach(function(v,k){if(k.charAt(0)!=='_'&&v)b.push(k+': '+v)});
  return 'mailto:'+TO+'?subject='+encodeURIComponent('פנייה מהאתר – Fast Connection')+'&body='+encodeURIComponent(b.join('\n'))}
 f.addEventListener('submit',function(e){
  e.preventDefault();
  var name=f.querySelector('#f-name'),phone=f.querySelector('#f-phone'),email=f.querySelector('#f-email');
  [name,phone,email].forEach(function(i){i.removeAttribute('aria-invalid')});
  if(!name.value.trim()){name.setAttribute('aria-invalid','true');name.focus();return say('נא למלא שם.',false)}
  var ph=phone.value.replace(/[^\d+]/g,''),em=email.value.trim();
  if(!ph&&!em){phone.setAttribute('aria-invalid','true');phone.focus();return say('נא להשאיר טלפון או אימייל, כדי שנוכל לחזור אליכם.',false)}
  if(ph&&ph.length<9){phone.setAttribute('aria-invalid','true');phone.focus();return say('נא לבדוק את מספר הטלפון.',false)}
  if(em&&!email.checkValidity()){email.setAttribute('aria-invalid','true');email.focus();return say('נא לבדוק את כתובת האימייל.',false)}
  if(f.querySelector('.hp').value)return;
  var data=new FormData(f);data.delete('_honey');
  btn.disabled=true;btn.textContent='שולח…';
  var subject='פנייה חדשה מהאתר – Fast Connection ('+(data.get('topic')||'')+')';
  var backends=[
   {url:'https://api.web3forms.com/submit',body:function(){var x=new FormData();data.forEach(function(v,k){x.append(k,v)});x.append('access_key',W3F_KEY);x.append('subject',subject);x.append('from_name','אתר Fast Connection');if(em)x.append('replyto',em);return x},
    ok:function(r,j){return r.ok&&j.success===true}},
   {url:'https://formsubmit.co/ajax/'+TO,body:function(){var x=new FormData();data.forEach(function(v,k){x.append(k,v)});x.append('_subject',subject);x.append('_template','table');x.append('_captcha','false');if(em)x.append('_replyto',em);return x},
    ok:function(r,j){return r.ok&&(String(j.success)==='true'||/activat/i.test(String(j.message||'')))}}
  ];
  function attempt(i){
   if(i>=backends.length)return Promise.reject(new Error('all failed'));
   var b=backends[i];
   return fetch(b.url,{method:'POST',headers:{'Accept':'application/json'},body:b.body()})
    .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(b.ok(r,j))return true;throw new Error('fail')})})
    .catch(function(){return attempt(i+1)});
  }
  attempt(0).then(function(){f.reset();say('תודה! הפנייה התקבלה, ונחזור אליכם בהקדם.',true);btn.textContent='נשלח ✓'})
  .catch(function(){
   btn.disabled=false;btn.innerHTML=btnHTML;msg.innerHTML='';
   var a=d.createElement('a');a.href=mailto(data);a.textContent='שליחה דרך תוכנת המייל';
   msg.className='form-msg err';msg.appendChild(d.createTextNode('השליחה לא הצליחה כרגע. אפשר לשלוח את אותם פרטים במייל: '));msg.appendChild(a);msg.focus();
  });
 });
}
})();
