(function(){
'use strict';
var d=document,KEY='kemach-cart';
var CAT={sourdough:['לחם מחמצת כפרי',32],challah:['חלה מתוקה קלועה',28],babka:['בבקה שוקולד',54],giftbox:['מארז מתנה "בוקר טוב"',149]};
function load(){try{var c=JSON.parse(localStorage.getItem(KEY)||'{}');return c&&typeof c==='object'?c:{}}catch(e){return {}}}
var cart=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}render()}
function total(){var t=0;Object.keys(cart).forEach(function(k){if(CAT[k])t+=CAT[k][1]*cart[k]});return t}
function count(){var n=0;Object.keys(cart).forEach(function(k){n+=cart[k]});return n}
function fmt(n){return '₪'+n.toLocaleString('he-IL')}
function el(tag,cls,txt){var e=d.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function render(){
  d.querySelectorAll('[data-cart-count]').forEach(function(e){e.textContent=count()});
  d.querySelectorAll('[data-cart-total]').forEach(function(e){e.textContent=fmt(total())});
  d.querySelectorAll('[data-cart-items]').forEach(function(box){
    box.textContent='';var keys=Object.keys(cart).filter(function(k){return CAT[k]&&cart[k]>0});
    if(!keys.length){var em=el('p','empty','הסל ריק כרגע 🥖');box.appendChild(em);
      if(location.pathname.indexOf('checkout')>-1){var a=el('a','btn btn-ghost','לבחירת מאפים');a.href='index.html#products';a.style.display='flex';a.style.justifyContent='center';box.appendChild(a)}return}
    keys.forEach(function(k){var row=el('div','line');row.appendChild(el('b',null,CAT[k][0]));row.appendChild(el('span',null,fmt(CAT[k][1]*cart[k])));
      var q=el('div','qty');var m=el('button',null,'−');m.type='button';m.setAttribute('aria-label','הפחתת כמות '+CAT[k][0]);m.onclick=function(){cart[k]--;if(cart[k]<=0)delete cart[k];save()};
      var p=el('button',null,'+');p.type='button';p.setAttribute('aria-label','הוספת כמות '+CAT[k][0]);p.onclick=function(){cart[k]++;save()};
      q.appendChild(m);q.appendChild(el('span',null,String(cart[k])));q.appendChild(p);row.appendChild(q);box.appendChild(row)});
  });
  d.querySelectorAll('[data-paybox]').forEach(function(b){b.style.opacity=count()?'1':'.45';b.style.pointerEvents=count()?'auto':'none'});
}
var toastT;function toast(msg){var t=d.querySelector('[data-toast]');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show')},2600)}
var drawer=d.getElementById('cart'),scrim=d.querySelector('[data-scrim]');
function openCart(o){if(!drawer)return;drawer.classList.toggle('open',o);scrim.classList.toggle('open',o);drawer.setAttribute('aria-hidden',!o);if(o){var x=drawer.querySelector('.x');x&&x.focus()}}
d.querySelectorAll('[data-open-cart]').forEach(function(b){b.addEventListener('click',function(){openCart(true)})});
d.querySelectorAll('[data-close-cart]').forEach(function(b){b.addEventListener('click',function(){openCart(false)})});
scrim&&scrim.addEventListener('click',function(){openCart(false)});
d.addEventListener('keydown',function(e){if(e.key==='Escape')openCart(false)});
d.querySelectorAll('[data-add]').forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.add;cart[k]=(cart[k]||0)+1;save();toast('נוסף לסל: '+CAT[k][0]+' ✓')})});
render();

/* ---- checkout only ---- */
if(!d.getElementById('paypal-container'))return;
// Sign in with Google: clearly labelled DEMO, nothing is sent anywhere
var gsi=d.querySelector('[data-gsi]');
gsi&&gsi.addEventListener('click',function(){d.querySelector('[data-gsi-note]').hidden=false;d.querySelector('[data-signed]').classList.add('on');gsi.style.display='none';var n=d.getElementById('n');if(n&&!n.value)n.value='לקוח לדוגמה'});
// Bit: payment link from the business's processor (placeholder)
var bit=d.querySelector('[data-bit]');
bit&&bit.addEventListener('click',function(e){e.preventDefault();toast('הדגמה: כאן יופיע קישור התשלום בביט של העסק (Grow / Cardcom וכו׳)')});
// PayPal Sandbox (public "sb" client-id)
function initPayPal(){
  if(!window.paypal||!paypal.Buttons){return false}
  try{paypal.Buttons({style:{layout:'vertical',shape:'rect',label:'pay',height:45},
    createOrder:function(data,actions){return actions.order.create({purchase_units:[{description:'קמח ומלח – הזמנה לדוגמה',amount:{currency_code:'ILS',value:String(total()||1)}}]})},
    onApprove:function(data,actions){return actions.order.capture().then(function(){cart={};save();toast('התשלום אושר (Sandbox) – תודה! 🎉')})},
    onError:function(){toast('שגיאת PayPal במצב בדיקה')}
  }).render('#paypal-container').catch(function(){})}catch(e){}
  return true}
// Google Pay TEST environment
function initGPay(){
  if(!window.google||!google.payments||!google.payments.api)return false;
  try{
  var client=new google.payments.api.PaymentsClient({environment:'TEST'});
  var card={type:'CARD',parameters:{allowedAuthMethods:['PAN_ONLY','CRYPTOGRAM_3DS'],allowedCardNetworks:['MASTERCARD','VISA','AMEX']},
    tokenizationSpecification:{type:'PAYMENT_GATEWAY',parameters:{gateway:'example',gatewayMerchantId:'exampleGatewayMerchantId'}}};
  var base={apiVersion:2,apiVersionMinor:0};
  var box=d.getElementById('gpay-container');
  function onClick(){var req=Object.assign({},base,{allowedPaymentMethods:[card],merchantInfo:{merchantName:'קמח ומלח (דמו)'},transactionInfo:{totalPriceStatus:'FINAL',totalPrice:String(total()||1),currencyCode:'ILS',countryCode:'IL'}});
    client.loadPaymentData(req).then(function(){toast('Google Pay (TEST) – התקבל טוקן לדוגמה ✓')}).catch(function(){})}
  function fallback(){var b=el('button','bit-btn','תשלום עם  G Pay');b.type='button';b.onclick=function(){toast('Google Pay זמין בדפדפן Chrome עם חשבון Google. במצב TEST לא מתבצע חיוב.')};box.appendChild(b)}
  client.isReadyToPay(Object.assign({},base,{allowedPaymentMethods:[card]})).then(function(r){
    if(r&&r.result){box.appendChild(client.createButton({onClick:onClick,buttonType:'pay',buttonSizeMode:'fill'}))}else fallback()
  }).catch(fallback);
  }catch(e){}
  return true}
var tries=0;(function wait(){var a=initPayPal.done||(initPayPal.done=initPayPal()),b=initGPay.done||(initGPay.done=initGPay());if((!a||!b)&&tries++<40)setTimeout(wait,250)})();
})();
