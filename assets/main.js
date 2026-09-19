(function(){'use strict';
var D=document,W=window,$=function(s,c){return(c||D).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))};
var reduce=W.matchMedia&&W.matchMedia('(prefers-reduced-motion: reduce)').matches;
var btn=$('#burgerBtn'),nav=$('#mainNav');
if(btn&&nav){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false')});
$$('a',nav).forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');btn.classList.remove('open');btn.setAttribute('aria-expanded','false')})})}
var hero=$('.hero');if(hero){W.requestAnimationFrame(function(){setTimeout(function(){hero.classList.add('go')},80)})}
var io=null;
if('IntersectionObserver'in W){io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');(e.target._c||[]).forEach(function(c){c.classList.add('in')});io.unobserve(e.target)}})},{threshold:.12});$$('.reveal').forEach(function(el){io.observe(el)});$$('.curtain').forEach(function(el){var w=el.parentNode;w._c=(w._c||[]).concat(el);io.observe(w)})}else{$$('.reveal,.curtain').forEach(function(el){el.classList.add('in')})}
function count(el){var t=parseInt(el.getAttribute('data-count'),10),s=null,d=1400;function k(n){if(!s)s=n;var p=Math.min((n-s)/d,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(k)}requestAnimationFrame(k)}
var cs=$$('[data-count]');
if('IntersectionObserver'in W&&cs.length&&!reduce){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);co.unobserve(e.target)}})},{threshold:.6});cs.forEach(function(c){co.observe(c)})}else{cs.forEach(function(c){c.textContent=c.getAttribute('data-count')})}
var bar=$('#progress'),par=$$('[data-parallax]'),ticking=false;
function onScroll(){var y=W.pageYOffset||D.documentElement.scrollTop,h=D.documentElement.scrollHeight-W.innerHeight;if(bar)bar.style.width=(h>0?y/h*100:0)+'%';if(!reduce)par.forEach(function(p){p.style.transform='translate3d(0,'+(y*parseFloat(p.getAttribute('data-parallax'))).toFixed(1)+'px,0)'});ticking=false}
W.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
if(W.matchMedia&&W.matchMedia('(pointer:fine)').matches&&!reduce){
$$('.btn').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px)'});b.addEventListener('mouseleave',function(){b.style.transform=''})});
$$('[data-tilt]').forEach(function(c){c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+(x*10).toFixed(1)+'deg) rotateX('+(-y*10).toFixed(1)+'deg)'});c.addEventListener('mouseleave',function(){c.style.transform=''})})}
var CX=120,CY=120,R=78;
function pt(i,v){var a=-Math.PI/2+i*(Math.PI/3);return[CX+R*(v/99)*Math.cos(a),CY+R*(v/99)*Math.sin(a)]}
function poly(v){return v.map(function(x,i){return pt(i,x).map(function(n){return n.toFixed(1)}).join(',')}).join(' ')}
function upd(svg,v){var s=$('.shape',svg);if(s)s.setAttribute('points',poly(v));$$('.dot',svg).forEach(function(d,i){var p=pt(i,v[i]);d.setAttribute('cx',p[0].toFixed(1));d.setAttribute('cy',p[1].toFixed(1))})}
var live=$('#liveCard');
if(live){var sl=$$('.sl input[type=range]'),svg=$('.radar',live),nE=$('[data-name]',live),pE=$('[data-pos]',live),mE=$('[data-meta]',live),f=$('#formPlayer');
function vals(){return sl.map(function(s){return parseInt(s.value,10)})}
function rf(){upd(svg,vals());sl.forEach(function(s){var o=$('output',s.parentNode);if(o)o.textContent=s.value})}
sl.forEach(function(s){s.addEventListener('input',rf)});rf();
if(f){var nm=f.elements.nombre||f.elements.nom,ps=f.elements.posicion||f.elements.poste,ht=f.elements.altura||f.elements.taille,ft=f.elements.pie||f.elements.pied;
function meta(){nE.textContent=(nm&&nm.value.trim())||nE.getAttribute('data-default');pE.textContent=(ps&&ps.value)||pE.getAttribute('data-default');var a=[];if(ht&&ht.value)a.push(ht.value+' cm');if(ft&&ft.value)a.push(ft.value);mE.textContent=a.join(' · ')||mE.getAttribute('data-default')}
[nm,ps,ht,ft].forEach(function(el){if(el){el.addEventListener('input',meta);el.addEventListener('change',meta)}});meta()}}
var tabs=$$('.tab');
tabs.forEach(function(t){t.addEventListener('click',function(){tabs.forEach(function(x){x.classList.toggle('on',x===t);x.setAttribute('aria-selected',x===t?'true':'false')});$$('[data-panel]').forEach(function(p){p.hidden=p.getAttribute('data-panel')!==t.getAttribute('data-tab')});try{history.replaceState(null,'','#'+t.getAttribute('data-tab'))}catch(e){}})});
if(tabs.length&&location.hash==='#recruiter'){var rt=$('.tab[data-tab="recruiter"]');if(rt)rt.click()}
var age=$('#age'),pb=$('#parentBlock');
if(age&&pb){var chk=function(){var a=parseInt(age.value,10),m=!isNaN(a)&&a>=16&&a<18;pb.hidden=!m;$$('input',pb).forEach(function(i){i.required=m})};age.addEventListener('input',chk);chk()}
$$('form[data-endpoint]').forEach(function(form){form.addEventListener('submit',function(e){e.preventDefault();var msg=$('.form-msg',form),sb=$('button[type=submit]',form);if(form.elements._gotcha&&form.elements._gotcha.value)return;sb.disabled=true;var o=sb.textContent;sb.textContent=form.getAttribute('data-sending');msg.className='form-msg';msg.textContent='';
fetch(form.getAttribute('data-endpoint'),{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}}).then(function(r){if(r.ok){W.location.href=form.getAttribute('data-thanks')}else{throw new Error('bad')}}).catch(function(){sb.disabled=false;sb.textContent=o;msg.className='form-msg err';msg.textContent=form.getAttribute('data-error')})})});
var ch=$('#langChooser');
if(ch&&location.search.indexOf('choose')===-1){var l=(navigator.language||'es').toLowerCase();setTimeout(function(){location.replace(l.indexOf('fr')===0?'fr/':'es/')},1400)}
})();
