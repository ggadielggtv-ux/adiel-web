(function(){
  var f=document.getElementById('leadform'); if(!f) return;
  var msg=f.querySelector('.form-msg'), btn=f.querySelector('button[type=submit]');
  // package buttons preselect the matching option
  document.querySelectorAll('[data-pkg]').forEach(function(a){a.addEventListener('click',function(){
    var v=a.getAttribute('data-pkg'); f.querySelectorAll('input[type=radio]').forEach(function(r){r.checked=(r.value===v)});
    if(v.indexOf('תחזוקה')>-1){var t=f.querySelector('#f-msg'); if(t&&!t.value) t.value='אשמח לשמוע על תחזוקה חודשית לאתר קיים.'}
    setTimeout(function(){var n=f.querySelector('#f-name'); n&&n.focus({preventScroll:true})},450);
  })});
  function say(t,ok){msg.textContent=t;msg.className='form-msg '+(ok?'ok':'err');msg.focus()}
  function mailto(data){
    var b=[];data.forEach(function(v,k){if(k.charAt(0)!=='_'&&v)b.push(k+': '+v)});
    return 'mailto:aronagever49@gmail.com?subject='+encodeURIComponent('פנייה מהאתר של Koraveo')+'&body='+encodeURIComponent(b.join('\n'));
  }
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var name=f.querySelector('#f-name'), email=f.querySelector('#f-email');
    [name,email].forEach(function(i){i.removeAttribute('aria-invalid')});
    if(!name.value.trim()){name.setAttribute('aria-invalid','true');name.focus();return say('נא למלא שם.',false)}
    if(!email.value.trim()||!email.checkValidity()){email.setAttribute('aria-invalid','true');email.focus();return say('נא למלא כתובת אימייל תקינה, כדי שאוכל לחזור אליכם.',false)}
    if(f.querySelector('.hp').value) return;
    var data=new FormData(f); btn.disabled=true; btn.textContent='שולח…';
    fetch('https://formsubmit.co/ajax/aronagever49@gmail.com',{method:'POST',headers:{'Accept':'application/json'},body:data})
      .then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {ok:r.ok,j:j}})})
      .then(function(res){
        if(res.ok&&String(res.j.success)==='true'){f.reset();say('תודה! הפנייה התקבלה, ואחזור אליכם למייל בהקדם.',true);btn.textContent='נשלח ✓';return}
        throw new Error('fail');
      })
      .catch(function(){
        btn.disabled=false;btn.textContent='שליחת הפנייה';
        msg.innerHTML='';var a=document.createElement('a');a.href=mailto(data);a.textContent='לשליחה דרך תוכנת המייל';
        msg.className='form-msg err';msg.appendChild(document.createTextNode('השליחה לא הצליחה כרגע. אפשר לשלוח את אותם פרטים במייל: '));msg.appendChild(a);msg.focus();
      });
  });
})();
(function(){var h=document.querySelector('.hero'),c=document.getElementById('contact');if(!h||!('IntersectionObserver' in window))return;var inHero=true,inC=false;function u(){document.body.classList.toggle('show-cta',!inHero&&!inC)}new IntersectionObserver(function(e){inHero=e[0].isIntersecting;u()}).observe(h);new IntersectionObserver(function(e){inC=e[0].isIntersecting;u()},{threshold:.05}).observe(c)})();
