(function(){
  var d=document,b=d.body;
  // header scroll state
  var h=d.querySelector('.header');
  function onS(){h&&h.classList.toggle('scrolled',window.scrollY>30)}
  onS();window.addEventListener('scroll',onS,{passive:true});
  // mobile menu
  var burger=d.querySelector('.burger');
  if(burger){burger.addEventListener('click',function(){var o=b.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o)});
    d.querySelectorAll('.mobile-menu a').forEach(function(a){a.addEventListener('click',function(){b.classList.remove('menu-open');burger.setAttribute('aria-expanded',false)})});}
  // reveal on scroll
  var els=d.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add('in')})}
  // counters
  d.querySelectorAll('[data-count]').forEach(function(el){
    var t=parseFloat(el.dataset.count),suf=el.dataset.suffix||'',done=false;
    var o=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!done){done=true;var s=null;function step(ts){if(!s)s=ts;var p=Math.min((ts-s)/1600,1),v=t*(1-Math.pow(1-p,3));el.textContent=(t%1?v.toFixed(1):Math.round(v).toLocaleString('he-IL'))+suf;if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)}},{threshold:.5});o.observe(el)});
  // demo form -> WhatsApp message
  d.querySelectorAll('form[data-demo]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
    var fd=new FormData(f),lines=[];fd.forEach(function(v,k){if(v)lines.push(k+': '+v)});
    f.classList.add('sent');var ok=f.querySelector('.form-ok');ok&&ok.focus&&ok.focus();
    var num=f.dataset.wa||'972500000000';
    window.open('https://wa.me/'+num+'?text='+encodeURIComponent('פנייה מהאתר\n'+lines.join('\n')),'_blank','noopener');
  })});
  // year
  d.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
  // accessibility widget
  var ab=d.querySelector('.a11y-btn'),ap=d.querySelector('.a11y-panel');
  if(ab&&ap){ab.addEventListener('click',function(){var o=ap.classList.toggle('open');ab.setAttribute('aria-expanded',o)});
    var fs=parseFloat(localStorage.getItem('a11y-fs')||'1');b.style.setProperty('--fs',fs);
    ap.addEventListener('click',function(e){var bt=e.target.closest('button');if(!bt)return;var a=bt.dataset.a;
      if(a==='plus'||a==='minus'){fs=Math.min(1.4,Math.max(.9,fs+(a==='plus'?.1:-.1)));b.style.setProperty('--fs',fs);localStorage.setItem('a11y-fs',fs);return}
      if(a==='reset'){b.className=b.className.replace(/a11y-\S+/g,'');fs=1;b.style.setProperty('--fs',1);localStorage.removeItem('a11y-fs');ap.querySelectorAll('[aria-pressed]').forEach(function(x){x.setAttribute('aria-pressed','false')});return}
      var on=b.classList.toggle('a11y-'+a);bt.setAttribute('aria-pressed',on)});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'){ap.classList.remove('open');b.classList.remove('menu-open')}});}
})();
