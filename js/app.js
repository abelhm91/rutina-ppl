/* ================= Utilidades ================= */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const store = {
  get(k,f){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f; }catch(e){ return f; } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
};
const num = v => { const n=parseFloat(String(v??'').replace(',','.')); return isNaN(n)?0:n; };
const fmt = sec => { sec=Math.max(0,Math.round(sec)); const h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60; return (h?h+':'+String(m).padStart(2,'0'):String(m).padStart(2,'0'))+':'+String(s).padStart(2,'0'); };
const fmtDur = ms => { const m=Math.round(ms/60000); return m>=60?`${Math.floor(m/60)} h ${m%60} min`:`${m} min`; };
const es = n => Math.round(n).toLocaleString('es-ES');
const midnight = d => { const x=new Date(d); x.setHours(0,0,0,0); return x.getTime(); };
function ago(ts){ const n=Math.round((midnight(Date.now())-midnight(ts))/864e5); return n===0?'Hoy':n===1?'Ayer':`Hace ${n} días`; }
function toast(t){ const el=$('toast'); el.textContent=t; el.hidden=false; clearTimeout(toast.t); toast.t=setTimeout(()=>el.hidden=true,2400); }
const I = {
  play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14l12-7z" fill="currentColor"/></svg>',
  yt:'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="3" width="14" height="10" rx="3" fill="#e5322d"/><path d="M6.5 5.6v4.8L10.5 8z" fill="#fff"/></svg>',
  img:'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 12l3.5-4 2.5 3 1.5-1.5L13 12z" fill="currentColor"/></svg>',
  chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  swap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4L3 8l4 4"/><path d="M3 8h13a4 4 0 0 1 4 4"/><path d="M17 20l4-4-4-4"/><path d="M21 16H8a4 4 0 0 1-4-4"/></svg>',
  check:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
const YT='https://www.youtube.com/results?search_query=', IMG='https://www.google.com/search?tbm=isch&q=';

/* ================= Opciones del perfil ================= */
const GOALS = {
  fat:{t:"Perder grasa",d:"Bajar barriga y definir manteniendo el músculo."},
  recomp:{t:"Recomposición",d:"Perder grasa y ganar músculo a la vez, poco a poco."},
  muscle:{t:"Ganar músculo",d:"Aumentar volumen muscular. Comerás algo por encima de mantenimiento."},
  strength:{t:"Ganar fuerza",d:"Mover más peso en los ejercicios básicos."},
  health:{t:"Salud y forma",d:"Estar en forma, sentirte bien y moverte mejor."}
};
const EXP = {
  beg:{t:"Principiante",d:"Menos de 1 año entrenando con regularidad."},
  int:{t:"Intermedio",d:"Entre 1 y 3 años. Conoces la técnica de los básicos."},
  adv:{t:"Avanzado",d:"Más de 3 años entrenando de forma constante."}
};
const EQUIP = {
  g:{t:"Gimnasio completo",d:"Barras, rack, poleas, máquinas y mancuernas."},
  b:{t:"Gimnasio básico",d:"Máquinas, poleas y mancuernas. Sin rack de sentadilla."},
  h:{t:"En casa",d:"Mancuernas y un banco."}
};
const ACT = {
  sed:{t:"Sedentaria",d:"Trabajo sentado, menos de 5.000 pasos al día."},
  light:{t:"Ligera",d:"Algo de movimiento, unos 5.000–8.000 pasos."},
  mod:{t:"Moderada",d:"De pie bastante tiempo o 8.000–12.000 pasos."},
  high:{t:"Muy activa",d:"Trabajo físico o más de 12.000 pasos."}
};
const INJ = {h:"Hombro",c:"Codo",m:"Muñeca",l:"Zona lumbar",r:"Rodilla"};
const PRIO = ["Pecho","Espalda","Hombros","Brazos","Piernas","Glúteo","Abdomen"];
const SPLIT_NAME = d => ({2:"Cuerpo completo · 2 días",3:"3 días",4:"Torso / Pierna · 4 días",5:"Empuje · Tirón · Piernas + Torso / Pierna",6:"Empuje · Tirón · Piernas × 2"})[d];

/* ================= Estado ================= */
let P = store.get('ppl-profile', null);   // perfil
let LAST = store.get('ppl-last', {});     // últimos kg/reps por ejercicio
let HIST = store.get('ppl-hist', []);     // entrenamientos guardados
let training = store.get('ppl-training', null);
let view = store.get('ppl-view','home');
let planSel = store.get('ppl-plansel', 0);
let seenBlock = store.get('ppl-seenblock', 0);
const OLDNAMES = {push:"Empuje",pull:"Tirón",legs:"Piernas"};
// Historial de la versión anterior de la app
HIST = HIST.map(h => h.name ? h : {...h, name:OLDNAMES[h.day]||'Entrenamiento', c:h.day||'push'});

/* ================= Periodización ================= */
function blockLen(){ return P.exp==='beg' ? 8 : 6; }
function weekInfo(){
  const len = blockLen();
  const week = Math.max(0, Math.floor((midnight(Date.now()) - midnight(P.start)) / (7*864e5)));
  const block = Math.floor(week/len), w = week % len;
  const deload = w === len-1;
  const rirs = len===8 ? ["3","3","2","2","2","1–2","1",null] : ["3","2","2","1–2","1",null];
  const adapt = !!P.back && block===0 && w<2;
  return { week, block, w, len, deload, adapt, rir: deload ? "4" : adapt ? "3–4" : rirs[w] };
}
function blockFocus(block){
  const odd = block % 2 === 1;
  return ({
    muscle: odd ? "Fuerza-hipertrofia" : "Hipertrofia",
    recomp: odd ? "Fuerza-hipertrofia" : "Hipertrofia",
    strength: odd ? "Fuerza con más volumen" : "Fuerza",
    fat: "Mantener fuerza y definir",
    health: "Forma general"
  })[P.goal];
}

/* ================= Generador de rutina ================= */
function splitFor(p){
  const d=p.days;
  if(d<=2) return [["fullA",0],["fullB",0]];
  if(d===3) return p.exp==='beg' ? [["fullA",0],["fullB",0],["fullC",0]] : [["push",0],["pull",0],["legs",0]];
  if(d===4) return [["upper",0],["lower",0],["upper",1],["lower",1]];
  if(d===5) return [["push",0],["pull",0],["legs",0],["upper",1],["lower",1]];
  return [["push",0],["pull",0],["legs",0],["push",1],["pull",1],["legs",1]];
}
function allowed(pattern){
  const inj = P.inj || [];
  return LIB.filter(e => e.p===pattern && e.eq.includes(P.eq) && !inj.some(x => e.av.includes(x)));
}
function scheme(e, isMain, block){
  const odd = block % 2 === 1, G = P.goal;
  if(e.p==='core') return {s:3, r:e.t==='s'?'30–45':'10–15', rest:'1 min'};
  let s, r, rest;
  if(G==='strength'){
    if(isMain){ s=odd?4:5; r=odd?'4–6':'3–5'; rest='3–4 min'; }
    else if(e.k==='c'){ s=3; r='6–8'; rest='2–3 min'; }
    else { s=3; r='10–12'; rest='1–2 min'; }
  } else if(G==='muscle' || G==='recomp'){
    if(isMain){ s=4; r=odd?'5–7':'6–8'; rest=odd?'3 min':'2–3 min'; }
    else if(e.k==='c'){ s=3; r='8–10'; rest='2 min'; }
    else { s=3; r='10–15'; rest='1–1,5 min'; }
  } else if(G==='fat'){
    if(isMain){ s=3; r='6–8'; rest='2 min'; }
    else if(e.k==='c'){ s=3; r='8–12'; rest='1,5 min'; }
    else { s=3; r='12–15'; rest='1 min'; }
  } else {
    if(isMain){ s=3; r='8–10'; rest='2 min'; }
    else if(e.k==='c'){ s=3; r='10–12'; rest='1,5 min'; }
    else { s=2; r='12–15'; rest='1 min'; }
  }
  if(P.exp==='beg' && isMain) s=Math.min(s,3);
  if(P.exp==='adv' && e.k==='i' && (G==='muscle'||G==='recomp')) s+=1;
  if((P.prio||[]).includes(e.g)) s+=1;
  return {s:Math.min(s,5), r, rest};
}
function dose(e, si, wi=weekInfo()){
  const isMainSlot = si<2;
  const sc = scheme(e, isMainSlot && e.k==='c', wi.block);
  let s = sc.s;
  if(wi.adapt) s = Math.max(2, s-1);
  if(wi.deload) s = Math.max(1, Math.ceil(s/2));
  return {...e, s, r:sc.r, rest:sc.rest, si};
}
function buildPlan(){
  const wi = weekInfo();
  const maxEx = Math.min(({45:5,60:6,75:7,90:8})[P.time] || 6, P.exp==='beg' ? 6 : 8);
  const split = splitFor(P);
  const count = {}; split.forEach(([t])=>count[t]=(count[t]||0)+1);
  const seen = {};
  return split.map(([type,off],idx) => {
    const T = TPL[type]; seen[type]=(seen[type]||0)+1;
    const used = new Set(), ex = [];
    for(let si=0; si<T.slots.length && ex.length<maxEx; si++){
      const pat = T.slots[si];
      const opts = allowed(pat).filter(e=>!used.has(e.id));
      if(!opts.length) continue;
      const isMainSlot = si<2;
      const rot = isMainSlot ? Math.floor(wi.block/2) + off : wi.block + off + si;
      let e = opts[rot % opts.length];
      const sw = (P.swaps||{})[`${type}${off}:${si}`];
      if(sw && sw.block===wi.block){ const alt=opts.find(x=>x.id===sw.id); if(alt) e=alt; }
      used.add(e.id);
      ex.push(dose(e, si, wi));
    }
    const name = count[type]>1 ? `${T.name} ${seen[type]===1?'A':'B'}` : T.name;
    return { id:`${type}${off}`, idx, type, name, c:T.c, focus:T.focus, ex };
  });
}

/* ================= Nutrición ================= */
function nutrition(p=P){
  const bmr = 10*p.weight + 6.25*p.height - 5*p.age + (p.sex==='f' ? -161 : 5);
  const f = ({sed:1.2, light:1.35, mod:1.5, high:1.65})[p.act] + 0.03*p.days;
  const tdee = bmr*f;
  const adj = ({fat:-0.2, recomp:-0.1, muscle:p.exp==='adv'?0.05:0.1, strength:0.05, health:0})[p.goal];
  const kcal = Math.round(tdee*(1+adj)/50)*50;
  const bmi = p.weight/((p.height/100)**2);
  const refW = bmi>30 ? 25*((p.height/100)**2) : p.weight;
  const pg = Math.round(refW * ({fat:2.0, recomp:2.0, muscle:1.8, strength:1.8, health:1.6})[p.goal]);
  const fg = Math.round(refW * 0.8);
  const cg = Math.max(0, Math.round((kcal - pg*4 - fg*9)/4));
  const steps = ({fat:10000, recomp:9000})[p.goal] || 8000;
  const pace = ({
    fat:`Bajar ${(p.weight*0.005).toFixed(1).replace('.',',')}–${(p.weight*0.0075).toFixed(1).replace('.',',')} kg por semana`,
    recomp:"Peso estable; la cintura debería bajar poco a poco",
    muscle:`Subir ${(p.weight*(p.exp==='beg'?0.0025:0.0015)).toFixed(1).replace('.',',')}–${(p.weight*(p.exp==='beg'?0.005:0.0025)).toFixed(1).replace('.',',')} kg por semana`,
    strength:"Peso estable o subiendo muy despacio",
    health:"Mantener el peso"
  })[p.goal];
  return { bmr:Math.round(bmr/50)*50, tdee:Math.round(tdee/50)*50, kcal, pg, fg, cg, steps, pace, bmi:bmi.toFixed(1).replace('.',',') };
}


/* Qué hacer si no avanzas, según el objetivo, con las calorías ya calculadas */
function adjustRules(n=nutrition()){
  const k=n.kcal, floor=n.bmr;
  const down=`${es(Math.max(floor,k-200))}–${es(Math.max(floor,k-150))} kcal`, up=`${es(k+150)}–${es(k+200)} kcal`;
  const lose=`${(P.weight*0.01).toFixed(1).replace('.',',')} kg`;
  const R = {
    fat:[
      {ok:true, when:'El peso y la cintura bajan poco a poco', act:'Vas bien. No cambies nada.'},
      {when:'En 2–3 semanas no bajan ni el peso ni la cintura', act:'Come menos', kcal:down},
      {when:`Bajas más de ${lose} por semana o pierdes fuerza`, act:'Come más', kcal:up}
    ],
    recomp:[
      {ok:true, when:'La cintura baja, aunque el peso no cambie', act:'Vas bien: pierdes grasa y ganas músculo. No cambies nada.'},
      {when:'En 2–3 semanas no bajan ni la cintura ni el peso', act:'Come menos', kcal:down},
      {when:'Bajas más de 0,5 kg por semana y pierdes fuerza', act:'Come más', kcal:up}
    ],
    muscle:[
      {ok:true, when:'El peso sube despacio y la cintura casi no cambia', act:'Vas bien. No cambies nada.'},
      {when:'En 2–3 semanas el peso no sube', act:'Come más', kcal:up},
      {when:'Subes más de 0,5 kg por semana o la cintura crece rápido', act:'Come menos', kcal:down}
    ],
    strength:[
      {ok:true, when:'Levantas más y el peso está estable', act:'Vas bien. No cambies nada.'},
      {when:'Te estancas en fuerza y el peso baja', act:'Come más', kcal:up},
      {when:'El peso sube rápido y la cintura crece', act:'Come menos', kcal:down}
    ],
    health:[
      {ok:true, when:'El peso se mantiene estable', act:'Vas bien. No cambies nada.'},
      {when:'El peso sube 2–3 semanas seguidas', act:'Come menos', kcal:down},
      {when:'El peso baja 2–3 semanas seguidas sin buscarlo', act:'Come más', kcal:up}
    ]
  };
  return R[P.goal];
}
function adjustHtml(n=nutrition()){
  return `<div class="adj">
    <div class="adj-h"><b>Revisa cada 2 semanas</b><small>Pésate y mide la cintura por la mañana, en ayunas y en las mismas condiciones. Ahora comes ${es(n.kcal)} kcal.</small></div>
    ${adjustRules(n).map(r=>`<div class="adj-r ${r.ok?'ok':r.act==='Come más'?'up':'down'}"><span class="adj-i" aria-hidden="true">${r.ok?'✓':r.act==='Come más'?'+':'−'}</span><div><small>${esc(r.when)}</small><b>${esc(r.act)}${r.kcal?`: <span class="adj-k">${r.kcal}</span>`:''}</b></div></div>`).join('')}
    <p class="adj-f">Quita o añade las calorías de grasas o hidratos, nunca de la proteína. 150–200 kcal son, por ejemplo, 1 cucharada y media de aceite, 2 rebanadas de pan o un puñado de frutos secos. Haz un cambio cada vez y espera otras 2–3 semanas. No bajes de ${es(n.bmr)} kcal.</p>
  </div>`;
}

/* ================= Navegación y vistas ================= */
function setTop(lbl,title,sub){ $('topLbl').textContent=lbl; $('topTitle').textContent=title; $('topSub').textContent=sub||''; }
function render(){
  if(!P){ return; }
  document.querySelectorAll('.nav button').forEach(b=>b.setAttribute('aria-current', b.dataset.view===view?'page':'false'));
  const m=$('main'); m.scrollTop=0;
  if(view==='home') renderHome(m); else if(view==='plan') renderPlan(m); else if(view==='progress') renderProgress(m); else renderProfile(m);
}
function nextIdx(plan){
  for(let i=HIST.length-1;i>=0;i--){ const h=HIST[i]; if(h.sid){ const j=plan.findIndex(s=>s.id===h.sid); if(j>=0) return (j+1)%plan.length; } }
  return 0;
}
function lastOf(sid){ for(let i=HIST.length-1;i>=0;i--) if(HIST[i].sid===sid) return HIST[i]; return null; }
function totalSets(s){ return s.ex.reduce((a,e)=>a+e.s,0); }

function renderHome(m){
  const plan = buildPlan(), wi = weekInfo(), now = new Date();
  const wd = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][now.getDay()];
  setTop(`${wd} ${now.getDate()}`, `Hola, ${P.name}`);
  const s = training ? (plan.find(x=>x.id===training.sid) || training.sess) : plan[nextIdx(plan)];
  const lo = lastOf(s.id);
  const mon = new Date(now); mon.setHours(0,0,0,0); mon.setDate(mon.getDate()-((mon.getDay()+6)%7));
  const days = [...Array(7)].map((_,i)=>{ const x=new Date(mon); x.setDate(mon.getDate()+i); return x; });
  const onDay = x => HIST.filter(h=>new Date(h.start).toDateString()===x.toDateString());
  const weekCount = HIST.filter(h=>h.start>=mon.getTime()).length;
  const newBlock = wi.block>0 && wi.w===0 && seenBlock<wi.block;
  const phase = wi.deload ? 'Semana de descarga' : wi.adapt ? 'Readaptación' : `RIR ${wi.rir}`;
  m.innerHTML = `<div class="view">
    ${newBlock?`<section class="card banner"><span class="lbl">Bloque ${wi.block+1}</span><h3>Rutina renovada</h3><p class="tip">Empieza un bloque nuevo: hay variantes de ejercicios distintas y el foco pasa a ${esc(blockFocus(wi.block).toLowerCase())}. Es buen momento para actualizar tu peso.</p><div class="btn-row"><button type="button" class="btn primary sm" data-act="weight">Actualizar peso</button><button type="button" class="btn ghost sm" data-act="seen">Entendido</button></div></section>`:''}
    ${wi.deload?`<section class="card banner deload"><span class="lbl">Semana ${wi.w+1} de ${wi.len}</span><h3>Semana de descarga</h3><p class="tip">Mismos ejercicios con la mitad de series y sin acercarte al fallo. Sirve para recuperar y volver más fuerte al siguiente bloque.</p></section>`:''}
    <section class="hero ${s.c}" style="--day:var(--${s.c})">
      <div class="lbl">${training?'Entrenamiento en curso':'Te toca'}</div>
      <h2>${esc(s.name)}</h2>
      <p class="muscles">${esc(s.focus)}</p>
      <div class="hero-stats"><span><b>${s.ex.length}</b>ejercicios</span><span><b>${totalSets(s)}</b>series</span><span><b>${P.time}</b>minutos</span></div>
      <button type="button" class="btn-go" data-train="${s.id}">${I.play}${training?'Continuar':'Entrenar'}</button>
      ${lo?`<p class="note left">Última vez: ${ago(lo.start)} · ${fmtDur(lo.end-lo.start)} · ${es(lo.vol)} kg</p>`:''}
    </section>
    <section class="card block-card">
      <div class="sec-h"><h3>Bloque ${wi.block+1}</h3><span class="lbl">${esc(phase)}</span></div>
      <div class="weeks">${[...Array(wi.len)].map((_,i)=>`<span class="${i<wi.w?'past':''} ${i===wi.w?'now':''} ${i===wi.len-1?'dl':''}" title="Semana ${i+1}">${i===wi.len-1?'D':i+1}</span>`).join('')}</div>
      <p class="tip">Semana ${wi.w+1} de ${wi.len} · ${esc(blockFocus(wi.block))}</p>
    </section>
    ${plan.length>1?`<section class="view gap10">
      <div class="sec-h"><h3>Tus sesiones</h3></div>
      <div class="row-days n${plan.length}">${plan.map(x=>{ const l=lastOf(x.id); return `<button type="button" class="mini" style="--day:var(--${x.c})" data-train="${x.id}"><span class="dot"></span><b>${esc(x.name)}</b><small>${l?ago(l.start):'Sin empezar'}</small></button>`; }).join('')}</div>
    </section>`:''}
    <section class="card view gap14">
      <div class="sec-h"><h3>Esta semana</h3><span class="lbl">${weekCount} de ${P.days}</span></div>
      <div class="weekstrip">${days.map((x,i)=>{ const hs=onDay(x), h=hs[0]; const today=x.toDateString()===now.toDateString(); return `<div class="${today?'today':''}"><i class="${h?'on':''}" style="${h?`--day:var(--${h.c})`:''}">${h?esc(h.name[0]):''}</i>${"LMXJVSD"[i]}</div>`; }).join('')}</div>
    </section>
    <section class="card">
      <div class="sec-h mb4"><h3>Historial</h3>${HIST.length>6?`<button type="button" class="link-btn" data-act="histall">Ver todo (${HIST.length})</button>`:''}</div>
      <div class="hist">${HIST.length?HIST.slice(-6).reverse().map(histRow).join(''):'<p class="empty">Cuando termines tu primer entrenamiento aparecerá aquí.</p>'}</div>
    </section>
  </div>`;
}

function lastText(id){ const s=(LAST[id]||[]).filter(x=>x.kg||x.reps); if(!s.length) return ''; return 'Última vez: '+s.map(x=>`${x.kg||'–'}×${x.reps||'–'}`).join(' · '); }
function renderPlan(m){
  const plan = buildPlan(), wi = weekInfo();
  if(planSel>=plan.length) planSel=0;
  const s = plan[planSel];
  setTop(`Bloque ${wi.block+1} · Semana ${wi.w+1}`, 'Tu rutina', wi.deload?'Descarga':`RIR ${wi.rir}`);
  m.innerHTML = `<div class="view">
    <div class="seg-scroll"><div class="seg n${plan.length}" role="tablist">${plan.map((x,i)=>`<button type="button" role="tab" class="${x.c}" style="--day:var(--${x.c})" data-plan="${i}" aria-selected="${i===planSel}">${esc(x.name)}</button>`).join('')}</div></div>
    <p class="tip">${esc(s.focus)} · ${s.ex.length} ejercicios · ${totalSets(s)} series${wi.deload?' · <b>descarga: mitad de series</b>':''}</p>
    <ol class="exl">${s.ex.map((e,i)=>{ const lt=lastText(e.id); return `<li class="exi" style="--day:var(--${s.c})">
      <button type="button" class="exi-h" aria-expanded="false" data-exp="${i}"><span class="num">${i+1}</span><span><b>${esc(e.n)}</b><small>${e.s} × ${e.r}${e.t==='s'?' s':''} · ${e.rest}</small></span>${I.chev}</button>
      <div class="exi-b" hidden>
        <div class="chips">${e.m.map(x=>`<span class="chip">${esc(x)}</span>`).join('')}<button type="button" class="chip chip-btn" data-act="rir">RIR ${esc(wi.rir)} ⓘ</button></div>
        <p class="tip">${esc(e.tip)}</p>
        ${lt?`<p class="last">${esc(lt)}</p><p class="last"><b>${esc(suggest(e,wi).title)}</b></p>`:''}
        <div class="links"><a href="${YT+encodeURIComponent(e.q)}" target="_blank" rel="noopener">${I.yt}Vídeo</a><a href="${IMG+encodeURIComponent(e.q.replace(' técnica',''))}" target="_blank" rel="noopener">${I.img}Imágenes</a></div>
      </div></li>`; }).join('')}</ol>
    <div class="${s.c}" style="--day:var(--${s.c})"><button type="button" class="btn-go" data-train="${s.id}">${I.play}Entrenar ${esc(s.name)}</button></div>
    <section class="card how">
      <h3>Cómo evoluciona tu rutina</h3>
      <ul class="plain">
        <li><b>Bloques de ${wi.len} semanas.</b> Las primeras ${wi.len-1} subes intensidad poco a poco (RIR de 3 a 1). La última es de descarga.</li>
        <li><b>Cada bloque nuevo</b> cambian los ejercicios accesorios. Los básicos cambian cada 2 bloques para que puedas medir tu progreso.</li>
        <li><b>Dentro de cada semana</b> intenta sumar una repetición o un poco de peso respecto a la última vez.</li>
        ${P.back?'<li><b>Las 2 primeras semanas</b> llevan una serie menos para readaptarte tras el parón.</li>':''}
      </ul>
      <button type="button" class="btn ghost sm" data-act="guide">Ver la guía completa</button>
    </section>
  </div>`;
}

function renderProfile(m){
  const n = nutrition(), wi = weekInfo();
  setTop('Perfil', P.name);
  const row = (k,v)=>`<div class="kv"><span>${k}</span><b>${esc(v)}</b></div>`;
  m.innerHTML = `<div class="view">
    <section class="card prof">
      <div class="prof-h"><div class="avatar">${esc((P.name||'?')[0].toUpperCase())}</div><div><b>${esc(P.name)}</b><small>${GOALS[P.goal].t} · ${EXP[P.exp].t}</small></div></div>
      <div class="prof-data">${row('Edad',P.age+' años')}${row('Peso',String(P.weight).replace('.',',')+' kg')}${row('Altura',P.height+' cm')}${row('IMC',n.bmi)}${P.waist?row('Cintura',P.waist+' cm'):''}</div>
      <div class="btn-row"><button type="button" class="btn ghost sm" data-act="weight">Actualizar peso</button><button type="button" class="btn ghost sm" data-act="edit">Editar perfil</button></div>
    </section>
    <section class="card">
      <div class="sec-h mb8"><h3>Tu plan</h3></div>
      ${row('Objetivo',GOALS[P.goal].t)}${row('Nivel',EXP[P.exp].t+(P.back?' · tras un parón':''))}${row('Rutina',SPLIT_NAME(P.days))}${row('Duración',P.time+' min por sesión')}${row('Lugar',EQUIP[P.eq].t)}${row('Molestias',(P.inj||[]).length?(P.inj.map(x=>INJ[x]).join(', ')):'Ninguna')}${row('Prioridad',(P.prio||[]).join(', ')||'Equilibrado')}${row('Progreso',`Bloque ${wi.block+1}, semana ${wi.w+1} de ${wi.len}`)}
    </section>
    <div class="sec-h"><h3>Nutrición</h3><span class="lbl">Mantenimiento ≈ ${es(n.tdee)} kcal</span></div>
    <div class="stat-grid">
      <div class="stat wide"><span class="lbl">Calorías al día</span><span class="big">${es(n.kcal-100)}–${es(n.kcal+100)} <small>kcal</small></span><p>${esc(n.pace)}.</p></div>
      <div class="stat"><span class="lbl">Proteína</span><span class="big">${n.pg} <small>g</small></span><p>En 3–4 comidas.</p></div>
      <div class="stat"><span class="lbl">Grasas</span><span class="big">${n.fg} <small>g</small></span><p>Aceite de oliva, frutos secos, huevo.</p></div>
      <div class="stat"><span class="lbl">Hidratos</span><span class="big">${n.cg} <small>g</small></span><p>Más cerca del entrenamiento.</p></div>
      <div class="stat"><span class="lbl">Pasos</span><span class="big">${es(n.steps)}</span><p>Al día, además de entrenar.</p></div>
    </div>
    ${adjustHtml(n)}
    <ul class="rules">
      <li><b>Duerme 7–8 horas</b><span>Dormir poco aumenta el hambre y frena la recuperación.</span></li>
    </ul>
    <p class="note">Las calorías son una estimación con la fórmula de Mifflin-St Jeor. Si tienes alguna lesión o problema de salud, consulta antes con un profesional.</p>
    <button type="button" class="guide-link" data-act="guide"><span class="gl-ic" aria-hidden="true">?</span><span><b>Cómo funciona tu plan</b><small>Series, RIR, progresión, bloques y alimentación</small></span>${I.chev}</button>
    <div class="sheet-btns"><button type="button" class="btn ghost" data-act="restart">Empezar el programa desde la semana 1</button><button type="button" class="btn danger" data-act="wipe">Borrar todos mis datos</button></div>
  </div>`;
}

/* ================= Cuestionario ================= */
let draft = null, step = 0, editing = false;
const STEPS = [
  {id:'name', title:'¿Cómo te llamas?', sub:'Vamos a crear una rutina hecha para ti. Son 2 minutos.',
    ok:d=>d.name && d.name.trim().length>0,
    html:d=>`<label class="in-big"><span class="lbl">Nombre</span><input id="f-name" data-k="name" type="text" autocomplete="given-name" maxlength="24" value="${esc(d.name||'')}" placeholder="Tu nombre"></label>`},
  {id:'body', title:'Sobre ti', sub:'Lo usamos para calcular tus calorías.',
    ok:d=>d.sex && d.age>=14 && d.age<=90,
    html:d=>`<div class="lbl">Sexo</div>${seg('sex',[['m','Hombre'],['f','Mujer']],d.sex)}
      <label class="in-big"><span class="lbl">Edad</span><span class="in-unit"><input id="f-age" data-k="age" data-num="1" type="text" inputmode="numeric" maxlength="2" value="${esc(d.age||'')}" placeholder="30"><span>años</span></span></label>`},
  {id:'measures', title:'Tus medidas', sub:'La cintura es opcional, pero es la mejor forma de ver si pierdes grasa.',
    ok:d=>d.weight>=35 && d.weight<=250 && d.height>=130 && d.height<=230,
    html:d=>`<label class="in-big"><span class="lbl">Peso</span><span class="in-unit"><input id="f-weight" data-k="weight" data-num="1" type="text" inputmode="decimal" maxlength="5" value="${esc(d.weight?String(d.weight).replace('.',','):'')}" placeholder="75"><span>kg</span></span></label>
      <label class="in-big"><span class="lbl">Altura</span><span class="in-unit"><input id="f-height" data-k="height" data-num="1" type="text" inputmode="numeric" maxlength="3" value="${esc(d.height||'')}" placeholder="175"><span>cm</span></span></label>
      <label class="in-big"><span class="lbl">Cintura (opcional)</span><span class="in-unit"><input id="f-waist" data-k="waist" data-num="1" type="text" inputmode="decimal" maxlength="5" value="${esc(d.waist||'')}" placeholder="85"><span>cm</span></span></label>`},
  {id:'goal', title:'¿Cuál es tu objetivo principal?', sub:'Elige el que más te importe ahora. Podrás cambiarlo cuando quieras.',
    ok:d=>!!d.goal, html:d=>cards('goal',GOALS,d.goal)},
  {id:'exp', title:'¿Cuánta experiencia tienes?', sub:'Cuenta solo el tiempo entrenando con constancia.',
    ok:d=>!!d.exp, html:d=>cards('exp',EXP,d.exp)+`<button type="button" class="toggle" data-tog="back" aria-pressed="${!!d.back}"><span class="sw"></span><span><b>Vuelvo tras un parón</b><small>Más de 3 meses sin entrenar. Empezarás con 2 semanas de readaptación.</small></span></button>`},
  {id:'time', title:'¿Cuánto tiempo tienes?', sub:'Sé realista: es mejor una rutina que puedas cumplir.',
    ok:d=>d.days>=2 && d.time,
    html:d=>`<div class="lbl">Días por semana</div>${seg('days',[[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6']],d.days)}
      <p class="hint">${d.days?esc(splitHint(d)):'&nbsp;'}</p>
      <div class="lbl">Minutos por sesión</div>${seg('time',[[45,'45'],[60,'60'],[75,'75'],[90,'90']],d.time)}`},
  {id:'eq', title:'¿Dónde entrenas?', sub:'Elegimos los ejercicios según el material que tengas.',
    ok:d=>!!d.eq, html:d=>cards('eq',EQUIP,d.eq)},
  {id:'act', title:'¿Cómo es tu día a día?', sub:'Sin contar el entrenamiento. Afecta a cuánto debes comer.',
    ok:d=>!!d.act, html:d=>cards('act',ACT,d.act)},
  {id:'inj', title:'¿Tienes alguna molestia?', sub:'Quitaremos los ejercicios que más la cargan y pondremos alternativas.',
    ok:()=>true,
    html:d=>`<div class="pills">${Object.entries(INJ).map(([k,v])=>`<button type="button" class="pill" data-multi="inj" data-v="${k}" aria-pressed="${(d.inj||[]).includes(k)}">${v}</button>`).join('')}</div><p class="hint">${(d.inj||[]).length?'Si el dolor es fuerte o no mejora, consulta con un fisioterapeuta.':'Si no tienes ninguna, continúa.'}</p>`},
  {id:'prio', title:'¿Quieres priorizar algo?', sub:'Hasta 2 grupos. Tendrán una serie extra en cada ejercicio.',
    ok:()=>true,
    html:d=>`<div class="pills">${PRIO.map(v=>`<button type="button" class="pill" data-multi="prio" data-v="${v}" aria-pressed="${(d.prio||[]).includes(v)}">${v}</button>`).join('')}</div><p class="hint">${(d.prio||[]).length?'':'Si lo dejas vacío, la rutina será equilibrada.'}</p>`},
  {id:'sum', title:'Tu plan está listo', sub:'Revisa el resumen. Todo se puede cambiar después desde tu perfil.',
    ok:()=>true, html:d=>summaryHtml(d)}
];
function seg(k,opts,val){ return `<div class="oseg n${opts.length}">${opts.map(([v,t])=>`<button type="button" data-k="${k}" data-v="${v}" aria-pressed="${String(val)===String(v)}">${t}</button>`).join('')}</div>`; }
function cards(k,obj,val){ return `<div class="ocards">${Object.entries(obj).map(([v,o])=>`<button type="button" class="ocard" data-k="${k}" data-v="${v}" aria-pressed="${val===v}"><b>${o.t}</b><small>${o.d}</small></button>`).join('')}</div>`; }
function splitHint(d){
  return ({2:"Cuerpo completo dos veces por semana.",3:d.exp==='beg'?"Cuerpo completo tres veces: lo mejor para empezar.":"Empuje, tirón y piernas.",4:"Torso y pierna, dos veces cada uno.",5:"Empuje, tirón, piernas, torso y pierna.",6:"Empuje, tirón y piernas, dos veces por semana."})[d.days];
}
function summaryHtml(d){
  const saveP = P; P = {...d, start:Date.now(), inj:d.inj||[], prio:d.prio||[]};
  const plan = buildPlan(), n = nutrition(P), len = blockLen();
  P = saveP;
  return `<div class="sum-plan">
    <div class="kv"><span>Objetivo</span><b>${GOALS[d.goal].t}</b></div>
    <div class="kv"><span>Rutina</span><b>${esc(SPLIT_NAME(d.days))}</b></div>
    <div class="kv"><span>Sesiones</span><b>${plan.map(s=>esc(s.name)).join(', ')}</b></div>
    <div class="kv"><span>Por sesión</span><b>${plan[0].ex.length} ejercicios · ${d.time} min</b></div>
    <div class="kv"><span>Bloques</span><b>${len} semanas con descarga al final</b></div>
    <div class="kv"><span>Calorías</span><b>${es(n.kcal)} kcal al día</b></div>
    <div class="kv"><span>Proteína</span><b>${n.pg} g al día</b></div>
  </div>
  ${editing?`<button type="button" class="toggle" data-tog="restart" aria-pressed="${!!d.restart}"><span class="sw"></span><span><b>Empezar desde la semana 1</b><small>Si lo dejas desactivado, sigues en tu bloque y semana actuales.</small></span></button>`:''}`;
}
function openOnboarding(edit){
  editing = !!edit;
  draft = edit ? {...P, restart:false} : {inj:[], prio:[]};
  step = 0;
  $('onb').hidden = false; document.body.classList.add('lock');
  renderStep();
}
function renderStep(){
  const S = STEPS[step];
  $('onbBar').style.width = ((step+1)/STEPS.length*100)+'%';
  $('onbBack').style.visibility = (step===0 && !editing) ? 'hidden' : 'visible';
  $('onbBack').setAttribute('aria-label', step===0 && editing ? 'Cerrar sin guardar' : 'Atrás');
  $('onbStep').textContent = `${step+1} de ${STEPS.length}`;
  $('onbBody').innerHTML = `<h2>${S.title}</h2><p class="tip">${S.sub}</p><div class="onb-fields">${S.html(draft)}</div>`;
  $('onbNext').textContent = step===STEPS.length-1 ? (editing?'Guardar cambios':'Crear mi rutina') : 'Continuar';
  validate();
  $('onbBody').scrollTop = 0;
}
function validate(){ $('onbNext').disabled = !STEPS[step].ok(draft); }
$('onbBody').addEventListener('input', e=>{
  const k=e.target.dataset.k; if(!k) return;
  if(e.target.dataset.num){ e.target.value=e.target.value.replace(/[^0-9.,]/g,''); draft[k]=num(e.target.value)||''; }
  else draft[k]=e.target.value;
  validate();
});
$('onbBody').addEventListener('click', e=>{
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.k){ const v=b.dataset.v; draft[b.dataset.k] = isNaN(+v) ? v : +v; renderKeepScroll(); return; }
  if(b.dataset.tog){ draft[b.dataset.tog]=!draft[b.dataset.tog]; b.setAttribute('aria-pressed',draft[b.dataset.tog]); return; }
  if(b.dataset.multi){
    const k=b.dataset.multi, v=b.dataset.v, arr=draft[k]=draft[k]||[];
    const i=arr.indexOf(v);
    if(i>=0) arr.splice(i,1); else { if(k==='prio' && arr.length>=2) arr.shift(); arr.push(v); }
    renderKeepScroll(); return;
  }
});
function renderKeepScroll(){ const y=$('onbBody').scrollTop; renderStep(); $('onbBody').scrollTop=y; }
$('onbBody').addEventListener('keydown', e=>{ if(e.key==='Enter' && !$('onbNext').disabled){ e.preventDefault(); $('onbNext').click(); } });
$('onbBack').addEventListener('click', ()=>{
  if(step>0){ step--; renderStep(); }
  else if(editing){ closeOnboarding(); }
});
$('onbNext').addEventListener('click', ()=>{
  if(!STEPS[step].ok(draft)) return;
  if(step<STEPS.length-1){ step++; renderStep(); return; }
  const restart = !editing || draft.restart;
  const start = restart ? Date.now() : P.start;
  const {restart:_r, ...clean} = draft;
  P = {...clean, name:clean.name.trim(), start, inj:clean.inj||[], prio:clean.prio||[]};
  logWeight();
  store.set('ppl-profile', P);
  if(restart){ seenBlock=0; store.set('ppl-seenblock',0); }
  closeOnboarding(); view='home'; store.set('ppl-view',view); render();
  if(editing) toast('Perfil actualizado'); else openGuide();
});
function closeOnboarding(){ $('onb').hidden=true; document.body.classList.remove('lock'); }

/* ================= Entrenamiento ================= */
let tickT=null, wake=null;
async function keepAwake(){ try{ if(navigator.wakeLock) wake=await navigator.wakeLock.request('screen'); }catch(e){ wake=null; } }
document.addEventListener('visibilitychange', ()=>{ if(training && !$('train').hidden && document.visibilityState==='visible') keepAwake(); });
const saveTraining = () => store.set('ppl-training', training);

function startTraining(sid){
  const plan = buildPlan(), s = plan.find(x=>x.id===sid); if(!s) return;
  if(training && training.sid!==sid){
    return sheetConfirm(`Tienes ${training.sess.name} en curso`, 'Si empiezas otra sesión, la actual se descarta sin guardarse en el historial.', 'Empezar '+s.name, ()=>{ training=null; startTraining(sid); });
  }
  if(!training){
    training = { sid, start:Date.now(), sess:s, sets:s.ex.map(e=>Array.from({length:e.s},()=>({kg:"",reps:"",done:false}))) };
    saveTraining();
  }
  openTrain();
}
function tStats(){ let t=0,d=0,vol=0; training.sets.forEach((arr,i)=>arr.forEach(s=>{ t++; if(s.done){ d++; if(training.sess.ex[i].t!=='s') vol+=num(s.kg)*num(s.reps); } })); return {t,d,vol:Math.round(vol)}; }
function openTrain(){
  const s=training.sess, tr=$('train');
  tr.style.setProperty('--day',`var(--${s.c})`); tr.className='train '+s.c; tr.hidden=false;
  $('tDay').textContent='Entrenando · '+s.name;
  renderTrainList(); updTrain();
  restEnd = training.restEnd || null; restAlerted = !!(restEnd && restEnd<Date.now());
  if(restEnd) showRestBar(); else $('restbar').hidden=true;
  clearInterval(tickT); tickT=setInterval(()=>{ updTimer(); tickRest(); },500); updTimer(); tickRest(); keepAwake();
  document.body.classList.add('lock');
  requestAnimationFrame(()=>scrollToCurrent(false));
}
function closeTrain(){ $('train').hidden=true; clearInterval(tickT); $('restbar').hidden=true; try{ wake&&wake.release(); }catch(e){} wake=null; document.body.classList.remove('lock'); render(); }
function updTimer(){ if(training) $('tTime').textContent=fmt((Date.now()-training.start)/1000); }
const currentIdx = () => training.sets.findIndex(arr=>arr.some(s=>!s.done));
function updTrain(){
  const st=tStats();
  $('tProg').textContent=`${st.d}/${st.t} series`; $('tVol').textContent=`${es(st.vol)} kg`;
  $('tBar').style.width=(st.t?st.d/st.t*100:0)+'%';
  const cur=currentIdx();
  document.querySelectorAll('.tex').forEach((el,i)=>{ el.classList.toggle('is-done',training.sets[i].every(s=>s.done)); el.classList.toggle('current',i===cur); });
}
function renderTrainList(){
  const s=training.sess, wi=weekInfo();
  $('tList').innerHTML = (wi.deload?'<p class="note">Semana de descarga: series cómodas, lejos del fallo.</p>':'') + s.ex.map((e,i)=>{
    const lt=lastText(e.id), unit=e.t==='s'?'seg':'reps', sg=suggest(e,wi), prs=training.pr||[];
    return `<section class="tex" data-i="${i}">
    <div class="tex-h"><span class="num">${i+1}</span><div><b>${esc(e.n)}</b><small>${e.s} × ${e.r}${e.t==='s'?' s':''} · ${e.rest} · RIR ${esc(wi.rir)}</small></div>
      <div class="tex-acts"><button type="button" class="icon-btn swap-btn" data-swap="${i}" aria-label="Cambiar ${esc(e.n)} por otro ejercicio">${I.swap}</button><a class="icon-btn" href="${YT+encodeURIComponent(e.q)}" target="_blank" rel="noopener" aria-label="Ver vídeo de ${esc(e.n)}">${I.yt}</a></div></div>
    ${e.swappedFrom?`<p class="swapped">En lugar de ${esc(e.swappedFrom)}${e.swapKeep?' · resto del bloque':' · solo hoy'}</p>`:''}
    <div class="sug ${sg.up?'up':''}"><span class="sug-i" aria-hidden="true">${sg.up?'↑':'→'}</span><div><b>${esc(sg.title)}</b><small>${esc(sg.why)}</small></div></div>
    ${lt?`<p class="last">${esc(lt)}</p>`:''}
    <div class="sets">
      <div class="set-head"><span></span><span>Peso</span><span>${e.t==='s'?'Tiempo':'Reps'}</span><span>Hecha</span></div>
      ${training.sets[i].map((st,j)=>{ return `<div class="set ${st.done?'is-done':''} ${prs.includes(i+'-'+j)?'pr':''}" data-j="${j}">
        <span class="sn">${j+1}</span>
        <label class="fld"><input id="kg-${i}-${j}" type="text" inputmode="decimal" autocomplete="off" placeholder="${esc(sg.kg||'—')}" value="${esc(st.kg)}" data-f="kg" aria-label="Kg, serie ${j+1}"><span>kg</span></label>
        <label class="fld"><input id="rp-${i}-${j}" type="text" inputmode="numeric" autocomplete="off" placeholder="${esc(sg.reps)}" value="${esc(st.reps)}" data-f="reps" aria-label="${unit}, serie ${j+1}"><span>${unit}</span></label>
        <button type="button" class="tick" aria-pressed="${st.done}" aria-label="Serie ${j+1} hecha">${I.check}</button>
      </div>`; }).join('')}
    </div></section>`; }).join('');
}
function scrollToCurrent(smooth=true){
  const i=currentIdx(); if(i<0) return; const el=document.querySelector(`.tex[data-i="${i}"]`); if(!el) return;
  const list=$('tList'); list.scrollTo({top:el.offsetTop-list.offsetTop-8, behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto'});
}
$('tList').addEventListener('input', e=>{
  const inp=e.target; if(!inp.dataset.f) return;
  const i=+inp.closest('.tex').dataset.i, j=+inp.closest('.set').dataset.j;
  inp.value = inp.dataset.f==='kg' ? inp.value.replace(/[^0-9.,]/g,'') : inp.value.replace(/[^0-9]/g,'');
  training.sets[i][j][inp.dataset.f]=inp.value; saveTraining(); if(training.sets[i][j].done) updTrain();
});
$('tList').addEventListener('click', e=>{
  const sb=e.target.closest('[data-swap]'); if(sb){ swapSheet(+sb.dataset.swap); return; }
  const tick=e.target.closest('.tick'); if(!tick) return;
  unlockAudio();
  const row=tick.closest('.set'), i=+tick.closest('.tex').dataset.i, j=+row.dataset.j;
  const sets=training.sets[i], s=sets[j]; s.done=!s.done;
  if(s.done){
    const kgIn=row.querySelector('[data-f=kg]'), rpIn=row.querySelector('[data-f=reps]');
    const prev=sets[j-1];
    if(!s.kg){ s.kg = (prev&&prev.kg) || (kgIn.placeholder!=='—'?kgIn.placeholder:''); kgIn.value=s.kg; }
    if(!s.reps){ s.reps = (prev&&prev.reps) || rpIn.placeholder; rpIn.value=s.reps; }
  }
  row.classList.toggle('is-done',s.done); tick.setAttribute('aria-pressed',s.done);
  training.pr = (training.pr||[]).filter(k=>k!==i+'-'+j);
  let isPR=false;
  if(s.done){
    const e=training.sess.ex[i], sc=score(e,s.kg,s.reps), prev=bestScore(e.id);
    const inSession=training.sets[i].filter((x,k)=>k!==j && x.done).map(x=>score(e,x.kg,x.reps));
    if(prev>0 && sc>prev && sc>Math.max(0,...inSession)){
      isPR=true; training.pr.push(i+'-'+j);
      toast(`🏆 Récord en ${e.n}: ${e.t==='s'?s.reps+' s':`${s.kg||0} kg × ${s.reps}`}`);
    }
  }
  row.classList.toggle('pr',isPR);
  try{ navigator.vibrate&&navigator.vibrate(isPR?[60,40,60,40,120]:s.done?30:10); }catch(_){}
  saveTraining(); updTrain();
  if(s.done){
    const st=tStats();
    if(st.d===st.t){ hideRest(); finishSheet(); return; }
    startRest(training.sess.ex[i].rest);
    if(sets.every(x=>x.done)) setTimeout(()=>scrollToCurrent(true),350);
  }
});
$('tMin').addEventListener('click', closeTrain);
$('tEnd').addEventListener('click', finishSheet);

function restSecs(t){ const n=parseFloat(String(t).replace(',','.')); return (isNaN(n)?1.5:n)*60; }
/* El descanso se guarda con el entrenamiento: sobrevive a minimizar, bloquear la pantalla o cerrar la app */
let restEnd=null, restAlerted=false, actx=null;
function unlockAudio(){ try{ if(!actx){ const A=window.AudioContext||window.webkitAudioContext; if(A) actx=new A(); } if(actx&&actx.state==='suspended') actx.resume(); }catch(e){} }
function beep(times=3){
  try{ if(!actx) return; const t0=actx.currentTime;
    for(let i=0;i<times;i++){ const o=actx.createOscillator(), g=actx.createGain(); o.type='sine'; o.frequency.value=i===times-1?1320:880;
      g.gain.setValueAtTime(0.0001,t0+i*0.35); g.gain.exponentialRampToValueAtTime(0.4,t0+i*0.35+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t0+i*0.35+0.25);
      o.connect(g).connect(actx.destination); o.start(t0+i*0.35); o.stop(t0+i*0.35+0.3); }
  }catch(e){}
}
function showRestBar(){ const rb=$('restbar'); rb.hidden=false; rb.className='restbar'+(training.sess.c==='legs'?' legs':''); }
function startRest(t){
  unlockAudio();
  restEnd=Date.now()+restSecs(t)*1000; restAlerted=false;
  training.restEnd=restEnd; saveTraining();
  showRestBar(); tickRest();
}
function hideRest(){ restEnd=null; restAlerted=false; if(training){ training.restEnd=null; saveTraining(); } $('restbar').hidden=true; }
function tickRest(){
  if(!restEnd) return; const left=(restEnd-Date.now())/1000, rb=$('restbar');
  if(rb.hidden && training && !$('train').hidden) showRestBar();
  if(left>0){
    rb.classList.remove('over');
    $('rbTime').textContent = fmt(left).replace(/^0/,'');
    $('rbLbl').textContent = 'Descanso';
    if(left<=3.05 && left>2 && !restAlerted){ /* aviso suave a falta de 3 s */ }
  } else {
    if(!restAlerted){
      restAlerted=true; rb.classList.add('over');
      if(document.visibilityState==='visible'){ beep(3); try{ navigator.vibrate&&navigator.vibrate([250,120,250,120,400]); }catch(e){} }
    }
    $('rbLbl').textContent = '¡Siguiente serie!';
    $('rbTime').textContent = '+'+fmt(-left).replace(/^0/,'');
    if(left<-600) hideRest();   // a los 10 min de más se quita sola
  }
}
$('rbSkip').addEventListener('click', hideRest);
$('rbPlus').addEventListener('click', ()=>{ if(restEnd){ restEnd=Math.max(restEnd,Date.now())+15000; restAlerted=false; training.restEnd=restEnd; saveTraining(); tickRest(); } });
$('rbMinus').addEventListener('click', ()=>{ if(restEnd){ restEnd-=15000; training.restEnd=restEnd; saveTraining(); tickRest(); } });
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible' && training && restEnd){ tickRest(); } });


/* ================= Cambiar ejercicio al momento ================= */
const PAT_NAME = {hpress:'empuje horizontal',ipress:'press inclinado',vpress:'press de hombro',lateral:'hombro lateral',fly:'aperturas de pecho',triceps:'tríceps',vpull:'tirón vertical',hpull:'remo',reardelt:'hombro posterior',latiso:'dorsal',biceps:'bíceps',squat:'sentadilla o prensa',hinge:'bisagra de cadera',lunge:'trabajo a una pierna',hamcurl:'femoral',quadext:'cuádriceps',calves:'gemelos',glute:'glúteo',core:'abdomen'};
let swapPick = null;
function swapOptions(i){
  const s=training.sess, cur=s.ex[i];
  const inSession=new Set(s.ex.map(x=>x.id));
  return allowed(cur.p).filter(x=>!inSession.has(x.id));
}
function swapSheet(i){
  const cur=training.sess.ex[i], opts=swapOptions(i), done=training.sets[i].filter(x=>x.done).length;
  swapPick=null;
  const lastLine=id=>{ const l=(LAST[id]||[]).filter(x=>x.kg||x.reps); return l.length?`Última vez: ${l.map(x=>`${x.kg||'–'}×${x.reps||'–'}`).slice(0,3).join(' · ')}`:'Sin registros todavía'; };
  const eqTag=x=>{ const n=x.n.toLowerCase(); return /barra|landmine|peso muerto convencional/.test(n)?'Barra':/mancuerna|goblet/.test(n)?'Mancuernas':/polea|cruce|face pull|pallof|jalón/.test(n)?'Polea':/máquina|prensa|contractora|hack|curl femoral|extensión de cuádriceps|abducción|hiperextensiones/.test(n)?'Máquina':'Peso corporal'; };
  openSheet(`<span class="lbl">Cambiar ejercicio</span><h3>${esc(cur.n)}</h3>
    <p class="tip">Alternativas de ${PAT_NAME[cur.p]||'este grupo'} que encajan con tu material${(P.inj||[]).length?' y tus molestias':''}.</p>
    ${opts.length?`<div class="swap-list" role="radiogroup" aria-label="Alternativas">${opts.map(x=>`<button type="button" class="swap-opt" role="radio" aria-checked="false" data-pick="${x.id}">
        <span class="so-main"><b>${esc(x.n)}</b><small>${esc(x.m.join(' · '))}</small><small class="so-last">${esc(lastLine(x.id))}</small></span>
        <span class="so-tag">${eqTag(x)}</span></button>`).join('')}</div>
      ${done?`<p class="warn">Tienes ${done} ${done===1?'serie marcada':'series marcadas'} en este ejercicio. Se quitarán al cambiarlo.</p>`:''}
      <div class="lbl">¿Hasta cuándo?</div>
      <div class="oseg n2 swap-when"><button type="button" data-when="today" aria-pressed="true">Solo hoy</button><button type="button" data-when="block" aria-pressed="false">Resto del bloque</button></div>
      <div class="sheet-btns"><button type="button" class="btn primary" data-ok disabled>Cambiar ejercicio</button><button type="button" class="btn ghost" data-no>Cancelar</button></div>`
    :`<p class="note">No hay otra alternativa para este ejercicio con tu material${(P.inj||[]).length?' y tus molestias':''}. Puedes hacer otra variante por tu cuenta y apuntar los kg igualmente.</p><div class="sheet-btns"><button type="button" class="btn ghost" data-no>Cerrar</button></div>`}`,
  sh=>{
    let when='today';
    sh.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{
      swapPick=b.dataset.pick; sh.querySelectorAll('[data-pick]').forEach(x=>x.setAttribute('aria-checked',x===b)); sh.querySelector('[data-ok]').disabled=false;
    });
    sh.querySelectorAll('[data-when]').forEach(b=>b.onclick=()=>{ when=b.dataset.when; sh.querySelectorAll('[data-when]').forEach(x=>x.setAttribute('aria-pressed',x===b)); });
    const ok=sh.querySelector('[data-ok]'); if(ok) ok.onclick=()=>{ if(!swapPick) return; doSwap(i, swapPick, when==='block'); closeSheet(); };
    sh.querySelector('[data-no]').onclick=closeSheet;
  });
}
function doSwap(i, newId, keep){
  const s=training.sess, cur=s.ex[i], nx=LIB.find(x=>x.id===newId); if(!nx) return;
  const wi=weekInfo(), si=cur.si??i;
  const orig = cur.swappedFrom || cur.n;
  const ne = {...dose(nx, si, wi), swappedFrom: orig===nx.n?undefined:orig, swapKeep:keep};
  s.ex[i]=ne;
  training.sets[i]=Array.from({length:ne.s},()=>({kg:'',reps:'',done:false}));
  training.pr=(training.pr||[]).filter(k=>!k.startsWith(i+'-'));
  if(keep){ P.swaps=P.swaps||{}; P.swaps[`${training.sid}:${si}`]={id:newId, block:wi.block}; store.set('ppl-profile',P); }
  saveTraining(); renderTrainList(); updTrain();
  toast(`Ahora: ${nx.n}`);
}

/* ================= Hojas inferiores ================= */
function openSheet(html,bind){ $('sheet').innerHTML='<div class="grab"></div>'+html; $('scrim').hidden=false; bind&&bind($('sheet')); const f=$('sheet').querySelector('input,button'); f&&f.focus(); }
function closeSheet(){ $('scrim').hidden=true; }
$('scrim').addEventListener('click', e=>{ if(e.target.id==='scrim') closeSheet(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !$('scrim').hidden) closeSheet(); });
function sheetConfirm(title,text,okLabel,ok){
  openSheet(`<h3>${esc(title)}</h3><p class="tip">${esc(text)}</p><div class="sheet-btns"><button type="button" class="btn primary" data-ok>${esc(okLabel)}</button><button type="button" class="btn ghost" data-no>Cancelar</button></div>`,
    sh=>{ sh.querySelector('[data-ok]').onclick=()=>{ closeSheet(); ok(); }; sh.querySelector('[data-no]').onclick=closeSheet; });
}
function finishSheet(){
  const s=training.sess, st=tStats(), dur=Date.now()-training.start, full=st.d===st.t;
  openSheet(`<span class="lbl">${esc(s.name)}</span><h3>${full?'¡Entrenamiento completado!':'¿Terminar entrenamiento?'}</h3>
    <div class="sum"><div><span class="lbl">Tiempo</span><b>${fmt(dur/1000)}</b></div><div><span class="lbl">Series</span><b>${st.d}/${st.t}</b></div><div><span class="lbl">Volumen</span><b>${es(st.vol)}</b></div></div>
    ${(training.pr||[]).length?`<p class="pr-line">🏆 ${training.pr.length===1?'1 récord personal':training.pr.length+' récords personales'} en esta sesión</p>`:''}
    ${full?'':'<p class="tip">Te quedan series por marcar. Lo que has apuntado se guarda igualmente.</p>'}
    <div class="sheet-btns"><button type="button" class="btn primary" data-save>Guardar y terminar</button>${full?'':'<button type="button" class="btn ghost" data-cont>Seguir entrenando</button>'}<button type="button" class="btn danger" data-discard>Descartar entrenamiento</button></div>`,
  sh=>{
    sh.querySelector('[data-save]').onclick=()=>{
      if(st.d>0){
        s.ex.forEach((e,i)=>{ const vals=training.sets[i].filter(x=>x.done&&(x.kg||x.reps)).map(x=>({kg:x.kg,reps:x.reps})); if(vals.length) LAST[e.id]=vals; });
        store.set('ppl-last',LAST);
        const wi=weekInfo();
        const detail = s.ex.map((e,i)=>({id:e.id, n:e.n, t:e.t||'', sets:training.sets[i].filter(x=>x.done).map(x=>({kg:x.kg, reps:x.reps}))})).filter(x=>x.sets.length);
        HIST.push({sid:s.id, name:s.name, c:s.c, start:training.start, end:Date.now(), sets:st.d, vol:st.vol, block:wi.block, week:wi.w, ex:detail, prs:(training.pr||[]).length});
        if(HIST.length>300) HIST=HIST.slice(-300);
        store.set('ppl-hist',HIST);
      }
      training=null; saveTraining(); closeSheet(); view='home'; store.set('ppl-view',view); closeTrain();
      toast(st.d>0?'Entrenamiento guardado':'Entrenamiento cerrado');
    };
    const c=sh.querySelector('[data-cont]'); if(c) c.onclick=closeSheet;
    sh.querySelector('[data-discard]').onclick=()=>{ training=null; saveTraining(); closeSheet(); closeTrain(); toast('Entrenamiento descartado'); };
  });
}
function weightSheet(){
  openSheet(`<h3>Actualizar peso</h3><p class="tip">Pésate por la mañana, en ayunas. Tus calorías se recalculan al guardar.</p>
    <label class="in-big"><span class="lbl">Peso</span><span class="in-unit"><input id="w-new" type="text" inputmode="decimal" maxlength="5" value="${esc(String(P.weight).replace('.',','))}"><span>kg</span></span></label>
    <label class="in-big"><span class="lbl">Cintura (opcional)</span><span class="in-unit"><input id="w-waist" type="text" inputmode="decimal" maxlength="5" value="${esc(P.waist?String(P.waist).replace('.',','):'')}"><span>cm</span></span></label>
    <div class="sheet-btns"><button type="button" class="btn primary" data-ok>Guardar</button><button type="button" class="btn ghost" data-no>Cancelar</button></div>`,
  sh=>{
    sh.querySelector('[data-ok]').onclick=()=>{
      const w=num($('w-new').value), wa=num($('w-waist').value);
      if(w<35||w>250){ toast('Escribe un peso entre 35 y 250 kg'); return; }
      const before=P.weight; P.weight=w; if(wa) P.waist=wa; logWeight(); store.set('ppl-profile',P);
      const wi=weekInfo(); if(seenBlock<wi.block){ seenBlock=wi.block; store.set('ppl-seenblock',seenBlock); }
      closeSheet(); render();
      const diff=Math.round((w-before)*10)/10;
      toast(diff===0?'Peso guardado':`Peso guardado (${diff>0?'+':''}${String(diff).replace('.',',')} kg)`);
    };
    sh.querySelector('[data-no]').onclick=closeSheet;
  });
}


/* ================= Guía del plan ================= */
let gIdx = 0;
function rirList(len){ return len===8 ? ["3","3","2","2","2","1–2","1","D"] : ["3","2","2","1–2","1","D"]; }
function guideSlides(){
  const plan = buildPlan(), n = nutrition(), len = blockLen(), wi = weekInfo();
  const main = plan[0].ex[0], acc = plan[0].ex.find(e=>e.k==='i') || plan[0].ex[plan[0].ex.length-1];
  const [lo,hi] = main.r.split('–').map(Number);
  const hiR = hi || lo, loR = lo;
  const kg = P.goal==='strength' ? 80 : 60;
  const step = main.g==='Piernas'||main.g==='Glúteo' ? 5 : 2.5;
  const fmtKg = v => String(v).replace('.',',');
  return [
    {lbl:'Paso 1', title:'Tu rutina', body:`
      <p>${esc(P.name)}, entrenas <b>${P.days} días por semana</b> con una rutina de <b>${esc(SPLIT_NAME(P.days).toLowerCase())}</b>, pensada para <b>${esc(GOALS[P.goal].t.toLowerCase())}</b>.</p>
      <div class="g-sessions">${plan.map((s,i)=>`<div style="--day:var(--${s.c})"><span>${i+1}</span><b>${esc(s.name)}</b><small>${s.ex.length} ejercicios</small></div>`).join('')}</div>
      <p class="g-note">Las sesiones van en orden. La pantalla de inicio te dice cuál toca. Si un día no puedes ir, al volver haz la siguiente: no hace falta recuperar la que faltó.</p>`},
    {lbl:'Paso 2', title:'Cómo hacer cada serie', body:`
      <p>Cada ejercicio indica <b>series × repeticiones</b> y un <b>RIR</b>: las repeticiones que te quedan "en la recámara" al terminar la serie.</p>
      <div class="g-rir" aria-label="Ejemplo de RIR 2"><div class="g-reps">${[...Array(10)].map((_,i)=>`<i class="${i<8?'done':'left'}">${i+1}</i>`).join('')}</div>
      <p><b>RIR 2:</b> haces 8 repeticiones cuando podrías llegar a 10 con buena técnica.</p></div>
      <ul class="plain"><li>Elige un peso que te deje justo en ese RIR dentro del rango de repeticiones.</li><li>Apunta los kg y las repeticiones reales de cada serie. La próxima vez verás lo que hiciste.</li><li>Al marcar una serie empieza el descanso. Respétalo: es parte del entrenamiento.</li></ul>`},
    {lbl:'Paso 3', title:'Cómo progresar', body:`
      <p>Usamos la <b>doble progresión</b>: primero subes repeticiones y después peso. Ejemplo con ${esc(main.n.toLowerCase())}, ${main.s} × ${main.r}:</p>
      <div class="g-steps">
        <div><span class="lbl">Sesión 1</span><b>${fmtKg(kg)} kg</b><small>${[...Array(main.s)].map((_,i)=>Math.max(loR,hiR-i)).join(' · ')}</small></div>
        <div><span class="lbl">Sesión 2</span><b>${fmtKg(kg)} kg</b><small>${[...Array(main.s)].map((_,i)=>i===main.s-1?Math.max(loR,hiR-1):hiR).join(' · ')}</small></div>
        <div class="up"><span class="lbl">Sesión 3</span><b>${fmtKg(kg)} kg</b><small>${[...Array(main.s)].map(()=>hiR).join(' · ')} ✓</small></div>
        <div class="up2"><span class="lbl">Sesión 4</span><b>${fmtKg(kg+step)} kg</b><small>${[...Array(main.s)].map(()=>loR).join(' · ')}</small></div>
      </div>
      <p class="g-note">Cuando completas <b>todas las series en el tope del rango</b>, sube ${fmtKg(step)} kg y vuelve al mínimo de repeticiones. En ejercicios pequeños como ${esc(acc.n.toLowerCase())}, sube de 1 a 2 kg.</p>`},
    {lbl:'Paso 4', title:`Bloques de ${len} semanas`, body:`
      <p>Tu plan se organiza en bloques. Cada semana aprietas un poco más y la última es de <b>descarga</b>.</p>
      <div class="g-weeks">${rirList(len).map((r,i)=>`<div class="${r==='D'?'dl':''} ${i===wi.w?'now':''}"><span>S${i+1}</span><b>${r==='D'?'Descarga':'RIR '+r}</b></div>`).join('')}</div>
      <ul class="plain"><li><b>Semanas 1 a ${len-1}:</b> el RIR baja poco a poco, cada vez más cerca del fallo.</li><li><b>Semana ${len}:</b> mitad de series y lejos del fallo. Recuperas y vuelves más fuerte.</li>${P.back?'<li><b>Tus 2 primeras semanas</b> llevan una serie menos para readaptarte tras el parón.</li>':''}</ul>`},
    {lbl:'Paso 5', title:'Cada bloque, rutina renovada', body:`
      <p>Al terminar un bloque la app cambia tu rutina sola, como haría un entrenador:</p>
      <ul class="g-list">
        <li><b>Ejercicios accesorios</b><span>Cambian en cada bloque: nuevo estímulo y menos aburrimiento.</span></li>
        <li><b>Ejercicios básicos</b><span>Se mantienen 2 bloques para que puedas comprobar que levantas más.</span></li>
        <li><b>Foco del bloque</b><span>${P.goal==='muscle'||P.goal==='recomp'?'Alterna entre hipertrofia y fuerza-hipertrofia (algo más pesado).':P.goal==='strength'?'Alterna entre fuerza pura y fuerza con más volumen.':'Se mantiene centrado en tu objetivo.'}</span></li>
        <li><b>Tu peso</b><span>Al empezar cada bloque te pediremos actualizarlo para ajustar las calorías.</span></li>
      </ul>`},
    {lbl:'Paso 6', title:'Tu alimentación', body:`
      <p>El entrenamiento construye; la comida decide si ganas músculo o pierdes grasa.</p>
      <div class="g-nut"><div><span class="lbl">Calorías</span><b>${es(n.kcal)}</b><small>kcal al día</small></div><div><span class="lbl">Proteína</span><b>${n.pg} g</b><small>al día</small></div><div><span class="lbl">Pasos</span><b>${es(n.steps)}</b><small>al día</small></div></div>
      <ul class="plain"><li><b>Objetivo:</b> ${esc(n.pace.charAt(0).toLowerCase()+n.pace.slice(1))}.</li><li><b>Duerme 7–8 horas.</b> Sin descanso no hay progreso.</li></ul>
      ${adjustHtml(n)}
      <p class="g-note">Todo esto lo tienes siempre en tu perfil, en "Cómo funciona tu plan".</p>`}
  ];
}
function openGuide(){
  const slides = guideSlides(); gIdx = 0;
  $('gTrack').innerHTML = slides.map((s,i)=>`<section class="g-slide" aria-roledescription="diapositiva" aria-label="${i+1} de ${slides.length}"><span class="lbl">${s.lbl} de ${slides.length}</span><h2>${s.title}</h2><div class="g-body">${s.body}</div></section>`).join('');
  $('gDots').innerHTML = slides.map((_,i)=>`<i data-g="${i}"></i>`).join('');
  $('guide').hidden = false; document.body.classList.add('lock');
  $('gTrack').scrollLeft = 0; updGuide();
}
function closeGuide(){ $('guide').hidden=true; document.body.classList.remove('lock'); if(P && !training) render(); }
function updGuide(){
  const n = $('gTrack').children.length;
  [...$('gDots').children].forEach((d,i)=>d.classList.toggle('on',i===gIdx));
  $('gNext').textContent = gIdx===n-1 ? 'Empezar a entrenar' : 'Siguiente';
  $('gPrev').style.visibility = gIdx===0 ? 'hidden' : 'visible';
}
function goGuide(i){ const t=$('gTrack'); gIdx=Math.max(0,Math.min(i,t.children.length-1)); t.scrollTo({left:gIdx*t.clientWidth, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}); updGuide(); }
$('gTrack').addEventListener('scroll', ()=>{ const t=$('gTrack'); const i=Math.round(t.scrollLeft/t.clientWidth); if(i!==gIdx){ gIdx=i; updGuide(); } }, {passive:true});
$('gNext').addEventListener('click', ()=>{ if(gIdx >= $('gTrack').children.length-1) closeGuide(); else goGuide(gIdx+1); });
$('gPrev').addEventListener('click', ()=>goGuide(gIdx-1));
$('gSkip').addEventListener('click', closeGuide);
$('gDots').addEventListener('click', e=>{ const d=e.target.closest('[data-g]'); if(d) goGuide(+d.dataset.g); });
$('topHelp').addEventListener('click', openGuide);
function rirSheet(){
  openSheet(`<h3>¿Qué es el RIR?</h3><p class="tip">Repeticiones en la recámara: las que te quedan al terminar la serie con buena técnica.</p>
    <div class="g-rir"><div class="g-reps">${[...Array(10)].map((_,i)=>`<i class="${i<8?'done':'left'}">${i+1}</i>`).join('')}</div><p><b>RIR 2:</b> haces 8 cuando podrías llegar a 10.</p></div>
    <div class="sheet-btns"><button type="button" class="btn primary" data-no>Entendido</button></div>`, sh=>{ sh.querySelector('[data-no]').onclick=closeSheet; });
}


/* ================= Historial: ver, editar y eliminar ================= */
const DOW = ["dom","lun","mar","mié","jue","vie","sáb"], MON = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const fDate = ts => { const d=new Date(ts); return `${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };
function histRow(h){ return `<button type="button" class="hist-row" data-hist="${h.start}" style="--day:var(--${h.c})"><span class="bar"></span><div><b>${esc(h.name)}</b><small>${ago(h.start)} · ${fmtDur(h.end-h.start)}</small></div><div class="v">${h.prs?`<span class="pr-badge">🏆 ${h.prs}</span><br>`:''}${h.sets} series<br>${es(h.vol)} kg</div></button>`; }
let hd = null, histMode = 'list';
function openHistOverlay(){ $('histv').hidden=false; document.body.classList.add('lock'); }
function closeHist(){ $('histv').hidden=true; document.body.classList.remove('lock'); hd=null; render(); }
function openHistList(){
  histMode='list'; hd=null; openHistOverlay();
  $('hvTitle').textContent='Historial'; $('hvSub').textContent=`${HIST.length} entrenamientos`;
  $('hvFoot').hidden=true;
  const groups={};
  HIST.slice().reverse().forEach(h=>{ const d=new Date(h.start); const k=`${MON[d.getMonth()]} ${d.getFullYear()}`; (groups[k]=groups[k]||[]).push(h); });
  $('hvBody').innerHTML = HIST.length ? Object.entries(groups).map(([k,arr])=>`<section class="hv-group"><div class="lbl">${k}</div><div class="card hist">${arr.map(histRow).join('')}</div></section>`).join('') : '<p class="empty">Todavía no hay entrenamientos guardados.</p>';
}
function openHistDetail(start){
  const h=HIST.find(x=>x.start===start); if(!h) return;
  histMode='detail';
  hd = JSON.parse(JSON.stringify(h));
  openHistOverlay(); renderHistDetail();
}
function hdStats(){ let sets=0, vol=0; (hd.ex||[]).forEach(e=>e.sets.forEach(s=>{ sets++; if(e.t!=='s') vol+=num(s.kg)*num(s.reps); })); return {sets, vol:Math.round(vol)}; }
function renderHistDetail(){
  $('hvTitle').textContent=hd.name; $('hvSub').textContent=`${fDate(hd.start)} · ${fmtDur(hd.end-hd.start)}`;
  $('hvFoot').hidden=false;
  const st = hd.ex ? hdStats() : {sets:hd.sets, vol:hd.vol};
  $('hvBody').innerHTML = `
    <div class="sum hv-sum" style="--day:var(--${hd.c})"><div><span class="lbl">Series</span><b id="hvSets">${st.sets}</b></div><div><span class="lbl">Volumen</span><b id="hvVol">${es(st.vol)}</b></div><div><span class="lbl">Duración</span><b>${Math.round((hd.end-hd.start)/60000)}<small> min</small></b></div></div>
    ${hd.ex ? hd.ex.map((e,i)=>`<section class="tex hv-ex" data-i="${i}" style="--day:var(--${hd.c})">
      <div class="tex-h"><span class="num">${i+1}</span><div><b>${esc(e.n)}</b><small>${e.sets.length} ${e.sets.length===1?'serie':'series'}</small></div></div>
      <div class="sets">
        <div class="set-head hv"><span></span><span>Peso</span><span>${e.t==='s'?'Tiempo':'Reps'}</span><span></span></div>
        ${e.sets.map((s,j)=>`<div class="set hv" data-j="${j}">
          <span class="sn">${j+1}</span>
          <label class="fld"><input id="hk-${i}-${j}" type="text" inputmode="decimal" autocomplete="off" value="${esc(s.kg)}" placeholder="—" data-f="kg" aria-label="Kg, serie ${j+1}"><span>kg</span></label>
          <label class="fld"><input id="hr-${i}-${j}" type="text" inputmode="numeric" autocomplete="off" value="${esc(s.reps)}" placeholder="—" data-f="reps" aria-label="${e.t==='s'?'Segundos':'Repeticiones'}, serie ${j+1}"><span>${e.t==='s'?'seg':'reps'}</span></label>
          <button type="button" class="del-set" data-del aria-label="Eliminar serie ${j+1}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        </div>`).join('')}
        <button type="button" class="add-set" data-add>+ Añadir serie</button>
      </div></section>`).join('') : '<p class="note">Este entrenamiento se guardó con una versión anterior de la app y no tiene el detalle de las series. Puedes eliminarlo si quieres.</p>'}`;
  $('hvSave').hidden = !hd.ex;
}
function updHdStats(){ const st=hdStats(); const a=$('hvSets'), b=$('hvVol'); if(a) a.textContent=st.sets; if(b) b.textContent=es(st.vol); }
function recalcLast(ids){
  ids.forEach(id=>{
    for(let i=HIST.length-1;i>=0;i--){ const e=(HIST[i].ex||[]).find(x=>x.id===id); if(e){ LAST[id]=e.sets.map(s=>({kg:s.kg,reps:s.reps})); return; } }
    delete LAST[id];
  });
  store.set('ppl-last',LAST);
}
$('hvBody').addEventListener('click', e=>{
  const row=e.target.closest('[data-hist]'); if(row){ $('hvBody').dataset.from='list'; openHistDetail(+row.dataset.hist); return; }
  if(!hd) return;
  const ex=e.target.closest('.hv-ex'); if(!ex) return; const i=+ex.dataset.i;
  if(e.target.closest('[data-del]')){ const j=+e.target.closest('.set').dataset.j; hd.ex[i].sets.splice(j,1); const y=$('hvBody').scrollTop; renderHistDetail(); $('hvBody').scrollTop=y; return; }
  if(e.target.closest('[data-add]')){ const arr=hd.ex[i].sets, lastS=arr[arr.length-1]||{kg:'',reps:''}; arr.push({kg:lastS.kg, reps:lastS.reps}); const y=$('hvBody').scrollTop; renderHistDetail(); $('hvBody').scrollTop=y; return; }
});
$('hvBody').addEventListener('input', e=>{
  const inp=e.target; if(!inp.dataset.f || !hd) return;
  const i=+inp.closest('.hv-ex').dataset.i, j=+inp.closest('.set').dataset.j;
  inp.value = inp.dataset.f==='kg' ? inp.value.replace(/[^0-9.,]/g,'') : inp.value.replace(/[^0-9]/g,'');
  hd.ex[i].sets[j][inp.dataset.f]=inp.value; updHdStats();
});
$('hvBack').addEventListener('click', ()=>{ if(histMode==='detail' && $('hvBody').dataset.from==='list'){ $('hvBody').dataset.from=''; openHistList(); } else closeHist(); });
$('hvSave').addEventListener('click', ()=>{
  if(!hd || !hd.ex) return;
  const idx=HIST.findIndex(x=>x.start===hd.start); if(idx<0) return;
  const ids=new Set([...(HIST[idx].ex||[]).map(e=>e.id)]);
  hd.ex = hd.ex.map(e=>({...e, sets:e.sets.filter(s=>s.kg!==''||s.reps!=='')})).filter(e=>e.sets.length);
  if(!hd.ex.length){ return deleteHist(); }
  const st=hdStats(); hd.sets=st.sets; hd.vol=st.vol;
  HIST[idx]=hd; store.set('ppl-hist',HIST); recalcLast(ids);
  toast('Cambios guardados'); closeHist();
});
$('hvDelete').addEventListener('click', ()=>deleteHist());
function deleteHist(){
  const h=hd;
  sheetConfirm('Eliminar entrenamiento', `Se borrará ${h.name} del ${fDate(h.start)}. No se puede deshacer.`, 'Eliminar', ()=>{
    const ids=(HIST.find(x=>x.start===h.start)?.ex||[]).map(e=>e.id);
    HIST=HIST.filter(x=>x.start!==h.start); store.set('ppl-hist',HIST); recalcLast(ids);
    toast('Entrenamiento eliminado'); closeHist();
  });
}


/* ================= Peso sugerido y récords ================= */
const kgStr = v => { const r=Math.round(v*100)/100; return String(r).replace('.',','); };
function repRange(e){ const m=String(e.r).match(/(\d+)(?:\D+(\d+))?/); const lo=m?+m[1]:8, hi=m&&m[2]?+m[2]:lo; return [lo,hi]; }
function incFor(e){ if(/mancuerna|goblet/i.test(e.n)) return 2; if(e.k==='c') return (e.p==='squat'||e.p==='hinge') ? 5 : 2.5; return 2; }
function suggest(e, wi=weekInfo()){
  const [lo,hi]=repRange(e), last=(LAST[e.id]||[]).filter(x=>x.kg!==''||x.reps!=='');
  if(!last.length) return {kg:'', reps:String(lo), title:`Primera vez: ${e.r}${e.t==='s'?' s':' reps'}`, why:`Elige un peso con el que te queden ${wi.rir} repeticiones en la recámara.`};
  if(e.t==='s'){
    const best=Math.max(...last.map(x=>num(x.reps)));
    const t = wi.deload ? lo : (last.every(x=>num(x.reps)>=hi) ? hi+5 : Math.min(hi, best+5));
    return {kg:'', reps:String(t), up:t>best, title:`Hoy: ${t} s`, why: wi.deload?'Semana de descarga: cómodo.':`La última vez aguantaste ${best} s.`};
  }
  const top=Math.max(...last.map(x=>num(x.kg))), atTop=last.filter(x=>num(x.kg)===top).map(x=>num(x.reps));
  const minR=Math.min(...atTop), allHi=last.length>=Math.min(e.s,last.length) && last.every(x=>num(x.reps)>=hi);
  if(wi.deload) return {kg:kgStr(top), reps:String(lo), title:`Hoy: ${kgStr(top)} kg × ${lo}`, why:'Semana de descarga: mismo peso, menos series y lejos del fallo.'};
  if(top===0){
    if(allHi) return {kg:'', reps:String(hi), up:true, title:`Hoy: añade 2,5 kg de lastre`, why:`Completaste todas las series a ${hi} repeticiones.`};
    return {kg:'', reps:String(Math.min(hi,minR+1)), title:`Hoy: ${Math.min(hi,minR+1)} reps por serie`, why:`La última vez: ${atTop.join(', ')}.`};
  }
  if(allHi && !wi.adapt){ const nk=top+incFor(e); return {kg:kgStr(nk), reps:String(lo), up:true, title:`Hoy: sube a ${kgStr(nk)} kg × ${lo}`, why:`Completaste todas las series a ${hi} repeticiones con ${kgStr(top)} kg.`}; }
  const tr=Math.min(hi, minR+1);
  return {kg:kgStr(top), reps:String(tr), title:`Hoy: ${kgStr(top)} kg × ${tr}`, why: allHi?'Readaptación: mantén el peso estas semanas.':`Suma una repetición respecto a la última vez (${atTop.join(', ')}). Al llegar a ${hi} en todas, sube peso.`};
}
const e1rm = (kg,reps) => kg*(1+reps/30);
function score(e,kg,reps){ kg=num(kg); reps=num(reps); if(e.t==='s' || kg===0) return reps; return e1rm(kg,reps); }
function bestScore(id, exceptStart){
  let b=0, ex=LIB.find(x=>x.id===id)||{};
  HIST.forEach(h=>{ if(h.start===exceptStart) return; (h.ex||[]).forEach(x=>{ if(x.id===id) x.sets.forEach(st=>{ b=Math.max(b,score(ex,st.kg,st.reps)); }); }); });
  return b;
}
function logWeight(){
  P.wlog = P.wlog || [];
  const today = midnight(Date.now()), i = P.wlog.findIndex(x=>midnight(x.t)===today);
  const entry = {t:Date.now(), w:P.weight, waist:P.waist||null};
  if(i>=0) P.wlog[i]=entry; else P.wlog.push(entry);
}

/* ================= Gráficas ================= */
const CH = {};   // datos de cada gráfica para el tooltip
function niceTicks(min,max,n=4){
  if(min===max){ min-=1; max+=1; }
  const span=max-min, raw=span/(n-1), mag=Math.pow(10,Math.floor(Math.log10(raw)));
  const step=[1,2,2.5,5,10].map(m=>m*mag).find(s=>s>=raw)||10*mag;
  const lo=Math.floor(min/step)*step, hi=Math.ceil(max/step)*step, out=[];
  for(let v=lo; v<=hi+1e-9; v+=step) out.push(Math.round(v*100)/100);
  return out;
}
const dShort = ts => { const d=new Date(ts); return `${d.getDate()} ${MON[d.getMonth()]}`; };
function lineChart(id, pts, opt={}){
  // pts: [{t, y, tip}] ordenados por fecha
  const W=340, H=170, L=38, R=12, T=14, B=26;
  if(pts.length<2) return `<p class="empty">${opt.empty||'Necesitas al menos dos registros para ver la gráfica.'}</p>`;
  const ys=pts.map(p=>p.y), ticks=niceTicks(Math.min(...ys),Math.max(...ys));
  const y0=ticks[0], y1=ticks[ticks.length-1], t0=pts[0].t, t1=pts[pts.length-1].t||t0+1;
  const X=t=>L+(W-L-R)*((t-t0)/((t1-t0)||1)), Y=v=>T+(H-T-B)*(1-(v-y0)/((y1-y0)||1));
  const path=pts.map((p,i)=>`${i?'L':'M'}${X(p.t).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');
  const area=`${path}L${X(t1).toFixed(1)},${H-B}L${X(t0).toFixed(1)},${H-B}Z`;
  const lastP=pts[pts.length-1];
  CH[id]={pts:pts.map(p=>({...p, x:X(p.t), yy:Y(p.y)})), W, H};
  return `<div class="chart" data-chart="${id}" style="--c:var(${opt.color||'--pull'})">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opt.label||'Gráfica')}">
      ${ticks.map(v=>`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" class="grid"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" class="ax">${kgStr(v)}</text>`).join('')}
      <text x="${L}" y="${H-6}" class="ax">${dShort(t0)}</text><text x="${W-R}" y="${H-6}" text-anchor="end" class="ax">${dShort(t1)}</text>
      <path d="${area}" class="area"/>
      <path d="${path}" class="line"/>
      ${pts.map(p=>`<circle cx="${X(p.t)}" cy="${Y(p.y)}" r="${p.pr?5:3.5}" class="${p.pr?'dot pr':'dot'}"/>`).join('')}
      <circle cx="${X(lastP.t)}" cy="${Y(lastP.y)}" r="6" class="dot end"/>
      <text x="${Math.min(X(lastP.t), W-R)}" y="${Math.max(T+2,Y(lastP.y)-12)}" text-anchor="end" class="val">${esc(opt.fmt?opt.fmt(lastP.y):kgStr(lastP.y))}</text>
      <line class="cross" x1="0" x2="0" y1="${T}" y2="${H-B}" visibility="hidden"/>
    </svg>
    <div class="tt" hidden></div>
  </div>`;
}
function barChart(id, bars, opt={}){
  // bars: [{label, y, tip}]
  const W=340, H=170, L=38, R=8, T=14, B=26;
  const max=Math.max(...bars.map(b=>b.y),0);
  if(max<=0) return `<p class="empty">${opt.empty||'Todavía no hay datos.'}</p>`;
  const ticks=niceTicks(0,max), y1=ticks[ticks.length-1];
  const slot=(W-L-R)/bars.length, bw=Math.max(6,slot-6);
  const Y=v=>T+(H-T-B)*(1-v/y1);
  CH[id]={pts:bars.map((b,i)=>({...b, x:L+slot*i+slot/2, yy:Y(b.y)})), W, H, bars:true};
  const r=4;
  return `<div class="chart" data-chart="${id}" style="--c:var(${opt.color||'--pull'})">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opt.label||'Gráfica de barras')}">
      ${ticks.map(v=>`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" class="grid"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" class="ax">${v>=1000?kgStr(v/1000)+'k':kgStr(v)}</text>`).join('')}
      ${bars.map((b,i)=>{ const x=L+slot*i+(slot-bw)/2, y=Y(b.y), h=(H-B)-y; if(b.y<=0) return ''; const rr=Math.min(r,h,bw/2);
        return `<path class="bar ${i===bars.length-1?'cur':''}" d="M${x},${H-B}V${y+rr}Q${x},${y} ${x+rr},${y}H${x+bw-rr}Q${x+bw},${y} ${x+bw},${y+rr}V${H-B}Z"/>`; }).join('')}
      ${bars.map((b,i)=>(i===0||i===bars.length-1||i===Math.floor(bars.length/2))?`<text x="${L+slot*i+slot/2}" y="${H-6}" text-anchor="middle" class="ax">${esc(b.label)}</text>`:'').join('')}
    </svg>
    <div class="tt" hidden></div>
  </div>`;
}
function chartTip(el, clientX){
  const d=CH[el.dataset.chart]; if(!d) return;
  const svg=el.querySelector('svg'), rect=svg.getBoundingClientRect(), sx=(clientX-rect.left)*(d.W/rect.width);
  let best=d.pts[0]; d.pts.forEach(p=>{ if(Math.abs(p.x-sx)<Math.abs(best.x-sx)) best=p; });
  const tt=el.querySelector('.tt'); tt.innerHTML=best.tip; tt.hidden=false;
  const px=best.x*rect.width/d.W, py=best.yy*rect.height/d.H;
  tt.style.left=Math.max(4,Math.min(rect.width-tt.offsetWidth-4, px-tt.offsetWidth/2))+'px';
  tt.style.top=Math.max(0,py-tt.offsetHeight-12)+'px';
  const cr=el.querySelector('.cross'); if(cr){ cr.setAttribute('x1',best.x); cr.setAttribute('x2',best.x); cr.setAttribute('visibility','visible'); }
  el.querySelectorAll('.bar').forEach((b,i)=>b.classList.toggle('hl', d.bars && d.pts[i]===best));
}
function chartOut(el){ el.querySelector('.tt').hidden=true; const cr=el.querySelector('.cross'); if(cr) cr.setAttribute('visibility','hidden'); el.querySelectorAll('.bar.hl').forEach(b=>b.classList.remove('hl')); }
$('main').addEventListener('pointermove', e=>{ const c=e.target.closest('.chart'); if(c) chartTip(c,e.clientX); });
$('main').addEventListener('pointerdown', e=>{ const c=e.target.closest('.chart'); if(c) chartTip(c,e.clientX); });
$('main').addEventListener('pointerleave', e=>{ document.querySelectorAll('.chart').forEach(chartOut); }, true);

/* ================= Vista Progreso ================= */
let progEx = store.get('ppl-progex', null), bodyMode = 'w';
function exHistory(id){
  const ex=LIB.find(x=>x.id===id)||{};
  return HIST.filter(h=>(h.ex||[]).some(x=>x.id===id)).map(h=>{
    const x=h.ex.find(y=>y.id===id);
    let best=null; x.sets.forEach(st=>{ const sc=score(ex,st.kg,st.reps); if(!best||sc>best.sc) best={sc,kg:st.kg,reps:st.reps}; });
    return {t:h.start, best, sets:x.sets};
  });
}
function renderProgress(m){
  setTop('Progreso','Tu evolución');
  // ejercicios con datos, ordenados por número de sesiones
  const counts={}; HIST.forEach(h=>(h.ex||[]).forEach(x=>counts[x.id]=(counts[x.id]||0)+1));
  const exIds=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]);
  if(!exIds.includes(progEx)) progEx=exIds[0]||null;
  const totalPR=HIST.reduce((a,h)=>a+(h.prs||0),0);
  // volumen semanal (8 semanas)
  const mon=new Date(); mon.setHours(0,0,0,0); mon.setDate(mon.getDate()-((mon.getDay()+6)%7));
  const weeks=[...Array(8)].map((_,i)=>{ const s=new Date(mon); s.setDate(mon.getDate()-7*(7-i)); const e=new Date(s); e.setDate(s.getDate()+7);
    const hs=HIST.filter(h=>h.start>=s.getTime()&&h.start<e.getTime()); const v=hs.reduce((a,h)=>a+(h.vol||0),0);
    return {label:dShort(s.getTime()), y:v, tip:`<b>Semana del ${dShort(s.getTime())}</b><br>${es(v)} kg · ${hs.length} ${hs.length===1?'sesión':'sesiones'}`}; });
  const last4=weeks.slice(4).reduce((a,w)=>a+w.y,0), prev4=weeks.slice(0,4).reduce((a,w)=>a+w.y,0);
  // peso corporal
  const wlog=(P.wlog||[]).slice().sort((a,b)=>a.t-b.t);
  const wl=wlog.map(x=>({t:x.t, y:x.w, tip:`<b>${String(x.w).replace('.',',')} kg</b><br>${dShort(x.t)}`}));
  const wa=wlog.filter(x=>x.waist).map(x=>({t:x.t, y:x.waist, tip:`<b>${String(x.waist).replace('.',',')} cm</b><br>${dShort(x.t)}`}));
  const body = bodyMode==='w'?wl:wa, bFirst=body[0], bLast=body[body.length-1];
  const bDiff = body.length>1 ? Math.round((bLast.y-bFirst.y)*10)/10 : 0;
  // ejercicio
  let exHtml='<p class="empty">Cuando guardes entrenamientos verás aquí cómo sube tu fuerza en cada ejercicio.</p>';
  if(progEx){
    const ex=LIB.find(x=>x.id===progEx)||{n:progEx}, hist=exHistory(progEx);
    let run=0; const pts=hist.map(h=>{ const pr=h.best.sc>run && run>0; run=Math.max(run,h.best.sc);
      const isT=ex.t==='s'||num(h.best.kg)===0;
      return {t:h.t, y:Math.round(h.best.sc*10)/10, pr, tip:`<b>${isT?h.best.reps+(ex.t==='s'?' s':' reps'):kgStr(num(h.best.kg))+' kg × '+h.best.reps}</b>${isT?'':`<br>1RM est. ${kgStr(Math.round(h.best.sc*2)/2)} kg`}<br>${dShort(h.t)}${pr?' · 🏆':''}`}; });
    const isT = ex.t==='s' || hist.every(h=>num(h.best.kg)===0);
    const top = hist.reduce((a,h)=>(!a||h.best.sc>a.best.sc)?h:a,null);
    const first=pts[0], lastp=pts[pts.length-1];
    const pct = pts.length>1 && first.y>0 ? Math.round((lastp.y-first.y)/first.y*100) : 0;
    exHtml = `
      <div class="ex-stats">
        <div><span class="lbl">Mejor serie</span><b>${isT?top.best.reps+(ex.t==='s'?' s':' reps'):kgStr(num(top.best.kg))+' × '+top.best.reps}</b><small>${dShort(top.t)}</small></div>
        <div><span class="lbl">${isT?'Mejor marca':'1RM estimado'}</span><b>${isT?top.best.reps:kgStr(Math.round(top.best.sc*2)/2)+' kg'}</b><small>${isT?'':'fórmula de Epley'}</small></div>
        <div><span class="lbl">Desde el inicio</span><b class="${pct>0?'pos':pct<0?'neg':''}">${pts.length>1?(pct>0?'+':'')+pct+' %':'—'}</b><small>${hist.length} ${hist.length===1?'sesión':'sesiones'}</small></div>
      </div>
      ${lineChart('ex', pts, {label:`Progreso en ${ex.n}`, fmt:v=>isT?String(v):kgStr(Math.round(v*2)/2)+' kg', empty:'Entrena este ejercicio otra vez para ver la línea de progreso.'})}
      <p class="chart-cap">${isT?'Mejor marca de cada sesión.':'1RM estimado de tu mejor serie en cada sesión. Los puntos grandes son récords.'}</p>
      <div class="hist mini-hist">${hist.slice(-5).reverse().map(h=>`<div class="mh-row"><span>${dShort(h.t)}</span><span>${h.sets.map(s=>isT?`${s.reps}`:`${kgStr(num(s.kg))}×${s.reps}`).join(' · ')}</span></div>`).join('')}</div>`;
  }
  m.innerHTML = `<div class="view">
    <div class="stat-grid three">
      <div class="stat"><span class="lbl">Sesiones</span><span class="big">${HIST.length}</span><p>en total</p></div>
      <div class="stat"><span class="lbl">Récords</span><span class="big">${totalPR}</span><p>personales</p></div>
      <div class="stat"><span class="lbl">Volumen 4 sem.</span><span class="big">${last4>=1000?kgStr(Math.round(last4/100)/10)+'k':es(last4)}</span><p>${prev4>0?`${last4>=prev4?'+':''}${Math.round((last4-prev4)/prev4*100)} % vs. anterior`:'kg movidos'}</p></div>
    </div>
    <section class="card pcard">
      <div class="sec-h"><h3>Fuerza</h3></div>
      ${exIds.length?`<div class="chips-scroll">${exIds.map(id=>{ const x=LIB.find(y=>y.id===id); return `<button type="button" class="echip" data-pex="${id}" aria-pressed="${id===progEx}">${esc(x?x.n:id)}</button>`; }).join('')}</div>`:''}
      ${exHtml}
    </section>
    <section class="card pcard">
      <div class="sec-h"><h3>Volumen semanal</h3><span class="lbl">kg × reps</span></div>
      ${barChart('vol', weeks, {label:'Volumen por semana', empty:'Guarda tu primer entrenamiento para ver el volumen semanal.'})}
    </section>
    <section class="card pcard">
      <div class="sec-h"><h3>Cuerpo</h3>${wa.length?`<div class="mini-seg"><button type="button" data-body="w" aria-pressed="${bodyMode==='w'}">Peso</button><button type="button" data-body="waist" aria-pressed="${bodyMode!=='w'}">Cintura</button></div>`:''}</div>
      ${body.length?`<div class="body-now"><b>${String(bLast.y).replace('.',',')} ${bodyMode==='w'?'kg':'cm'}</b>${body.length>1?`<span class="${(bDiff<0&&P.goal!=='muscle')||(bDiff>0&&P.goal==='muscle')?'pos':bDiff===0?'':'neg'}">${bDiff>0?'+':''}${String(bDiff).replace('.',',')} ${bodyMode==='w'?'kg':'cm'} desde el ${dShort(bFirst.t)}</span>`:''}</div>`:''}
      ${lineChart('body', body, {label:bodyMode==='w'?'Peso corporal':'Cintura', color:'--ok', fmt:v=>String(v).replace('.',',')+(bodyMode==='w'?' kg':' cm'), empty:'Actualiza tu peso cada 1–2 semanas para ver la evolución.'})}
      <button type="button" class="btn ghost sm" data-act="weight">Actualizar peso</button>
    </section>
  </div>`;
}
$('main').addEventListener('click', e=>{
  const pe=e.target.closest('[data-pex]'); if(pe){ progEx=pe.dataset.pex; store.set('ppl-progex',progEx); const y=$('main').scrollTop; render(); $('main').scrollTop=y; return; }
  const bm=e.target.closest('[data-body]'); if(bm){ bodyMode=bm.dataset.body; const y=$('main').scrollTop; render(); $('main').scrollTop=y; }
});

/* ================= Eventos generales ================= */
document.querySelector('.nav').addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; view=b.dataset.view; store.set('ppl-view',view); render(); });
$('main').addEventListener('click', e=>{
  const t=e.target.closest('[data-train]'); if(t){ startTraining(t.dataset.train); return; }
  const hr=e.target.closest('[data-hist]'); if(hr){ openHistDetail(+hr.dataset.hist); return; }
  const p=e.target.closest('[data-plan]'); if(p){ planSel=+p.dataset.plan; store.set('ppl-plansel',planSel); render(); return; }
  const x=e.target.closest('[data-exp]'); if(x){ const li=x.closest('.exi'), b=li.querySelector('.exi-b'), open=b.hidden; b.hidden=!open; x.setAttribute('aria-expanded',open); li.toggleAttribute('open-x',open); return; }
  const a=e.target.closest('[data-act]'); if(!a) return;
  const act=a.dataset.act;
  if(act==='weight') weightSheet();
  else if(act==='edit') openOnboarding(true);
  else if(act==='guide') openGuide();
  else if(act==='histall') openHistList();
  else if(act==='rir') rirSheet();
  else if(act==='seen'){ seenBlock=weekInfo().block; store.set('ppl-seenblock',seenBlock); render(); }
  else if(act==='restart') sheetConfirm('Empezar desde la semana 1','Tu programa vuelve al bloque 1, semana 1. Tus kg, repeticiones e historial se mantienen.','Empezar de nuevo',()=>{ P.start=Date.now(); store.set('ppl-profile',P); seenBlock=0; store.set('ppl-seenblock',0); render(); toast('Programa reiniciado'); });
  else if(act==='wipe') sheetConfirm('Borrar todos los datos','Se borrarán tu perfil, kg, repeticiones e historial de este móvil. No se puede deshacer.','Borrar todo',()=>{ ['ppl-profile','ppl-last','ppl-hist','ppl-training','ppl-log','ppl-seenblock'].forEach(k=>{ try{localStorage.removeItem(k);}catch(_){} }); P=null; LAST={}; HIST=[]; training=null; seenBlock=0; openOnboarding(false); });
});

/* ================= Arranque ================= */
if(P && !P.wlog){ P.wlog=[{t:P.start, w:P.weight, waist:P.waist||null}]; store.set('ppl-profile',P); }
if(!P) openOnboarding(false);
else { render(); if(training && training.sess) openTrain(); }
if('serviceWorker' in navigator){ window.addEventListener('load', ()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }
