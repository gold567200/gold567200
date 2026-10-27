/* Keyboard, screen-reader and figure-zoom support applied to every rendered view (v61).
   The views build HTML strings, so instead of editing hundreds of templates this file
   upgrades what was rendered: clickable rows get keyboard focus, fields get names, the new
   page's heading gets focus after navigation, and figures can be enlarged on a phone. */
(function(){
  const view=()=>document.getElementById('view');
  const NATIVE='a[href],button,input,select,textarea,summary,[tabindex]';
  function upgrade(root){
    if(!root) return;
    try{ linkDomains(root); }catch(e){}
    // rows and cards that only have onclick (e.g. <a onclick> lesson lists, the flashcard) become focusable controls
    root.querySelectorAll('[onclick]').forEach(el=>{
      if(el.matches(NATIVE)) return;
      el.setAttribute('tabindex','0');
      if(!el.hasAttribute('role')) el.setAttribute('role', el.tagName==='A'?'link':'button');
    });
    // fields that only have a placeholder get an accessible name
    root.querySelectorAll('input:not([type=hidden]):not([aria-label]),textarea:not([aria-label]),select:not([aria-label])').forEach(el=>{
      if(el.id && root.querySelector('label[for="'+el.id+'"]')) return;
      if(el.closest('label')) return;
      const ph=el.getAttribute('placeholder'); if(ph) el.setAttribute('aria-label',ph);
    });
    // answer options expose their selected state, not only a colour
    root.querySelectorAll('.opt').forEach(el=>el.setAttribute('aria-pressed', el.classList.contains('sel')?'true':'false'));
  }
  // "Domain 7" in lesson text becomes a link to that domain (the curriculum used to call domains "phases")
  const DRX=/\bDomains?\s+\d{1,2}(?:\s*(?:,|and|or|to|–|-|&)\s*\d{1,2})*/g;
  function linkDomains(root){
    if(!window.GP_API) return;
    root.querySelectorAll('.lecture:not([data-dl]),.simplebox:not([data-dl]),.why:not([data-dl])').forEach(box=>{
      box.setAttribute('data-dl','1');
      const walker=document.createTreeWalker(box,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
        const p=n.parentElement; if(!p||p.closest('a,code,pre,button,textarea,script,style,.kw,svg')) return NodeFilter.FILTER_REJECT;
        DRX.lastIndex=0; return DRX.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP; }});
      const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(n=>{ const t=n.nodeValue; const frag=document.createDocumentFragment(); let last=0; DRX.lastIndex=0; let m;
        while((m=DRX.exec(t))){ frag.appendChild(document.createTextNode(t.slice(last,m.index)));
          m[0].split(/(\d{1,2})/).forEach(part=>{ if(/^\d{1,2}$/.test(part)&&GP_API.phase('p'+part)){ const a=document.createElement('a'); a.href='#p'+part; a.className='dlink'; a.textContent=part; a.title=GP_API.phase('p'+part).title; frag.appendChild(a); } else if(part) frag.appendChild(document.createTextNode(part)); });
          last=m.index+m[0].length; }
        frag.appendChild(document.createTextNode(t.slice(last))); n.parentNode.replaceChild(frag,n); });
    });
  }
  // Enter / Space activate the upgraded controls
  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ') return;
    const t=e.target; if(!t||!t.getAttribute) return;
    if(t.classList&&t.classList.contains('figwrap')){ e.preventDefault(); openFig(t); return; }
    if(t.getAttribute('tabindex')==='0'&&t.hasAttribute('onclick')&&!t.matches('button,a[href],input,textarea,select')){ e.preventDefault(); t.click(); }
  });
  // keep aria-pressed in step after any option click
  document.addEventListener('click',e=>{
    const fw=e.target.closest&&e.target.closest('.figwrap'); if(fw&&!e.target.closest('a,button')){ openFig(fw); return; }
    if(e.target.closest&&e.target.closest('.opt')) setTimeout(()=>{ const v=view(); if(v) v.querySelectorAll('.opt').forEach(el=>el.setAttribute('aria-pressed', el.classList.contains('sel')?'true':'false')); },0);
  });
  // figure zoom: a full-screen view that can be scrolled sideways
  let lastFocus=null;
  function openFig(wrap){
    const fig=wrap.closest('figure'); const svg=wrap.querySelector('svg'); if(!svg) return;
    lastFocus=document.activeElement;
    const ov=document.createElement('div'); ov.className='figzoom'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('aria-label','Enlarged figure');
    const cap=fig&&fig.querySelector('figcaption');
    ov.innerHTML='<div class="zbar"><span>Scroll sideways to see all of it.</span><button class="btn sm" type="button">Close</button></div><div class="zbody"></div>'+(cap?'<div class="zcap"></div>':'');
    ov.querySelector('.zbody').appendChild(svg.cloneNode(true));
    if(cap) ov.querySelector('.zcap').innerHTML=cap.innerHTML;
    const close=()=>{ ov.remove(); document.removeEventListener('keydown',esc); if(lastFocus&&lastFocus.focus) lastFocus.focus(); };
    const esc=e=>{ if(e.key==='Escape') close(); };
    ov.querySelector('button').onclick=close; document.addEventListener('keydown',esc);
    document.body.appendChild(ov); ov.querySelector('button').focus();
  }
  // after navigation: name the tab after the page and move focus to its heading (screen readers announce it)
  function afterRoute(){
    const v=view(); if(!v) return; const h=v.querySelector('h1');
    const name=h?h.textContent.trim():'';
    document.title=name?name.slice(0,70)+' · Genius Protocol':'Genius Protocol';
    if(h&&!document.querySelector('.figzoom')){ h.setAttribute('tabindex','-1'); h.style.outline='none'; h.focus({preventScroll:true}); }
  }
  window.addEventListener('hashchange',()=>setTimeout(afterRoute,60));
  function start(){
    const v=view(); if(!v) return;
    upgrade(v); afterRoute();
    new MutationObserver(()=>upgrade(v)).observe(v,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
