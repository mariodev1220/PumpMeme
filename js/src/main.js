// PumpMeme: The Pump Collection. CA and X are read at runtime from window.CONFIG (root config.js).
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const body = document.body;
const CFG = window.CONFIG || {};
const CA = String(CFG.ca || '').trim();
const X = String(CFG.x || '').trim();
const handle = (() => { const m = X.match(/(?:x|twitter)\.com\/(?:#!\/)?@?([A-Za-z0-9_]{1,15})/i); return m ? m[1] : ''; })();
const BUY = CA ? 'https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=' + encodeURIComponent(CA) : '';
const CHART = CA ? 'https://dexscreener.com/solana/' + encodeURIComponent(CA) : '';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mob = () => innerWidth < 900;
window.__toastN = 0;

// ---------- live config ----------
function fillConfig() {
  const short = CA ? (CA.length > 12 ? CA.slice(0, 4) + '…' + CA.slice(-4) : CA) : 'TBA';
  $$('[data-ca]').forEach(e => { e.textContent = CA || 'TBA'; });
  $$('[data-ca-short]').forEach(e => { e.textContent = short; });
  $$('[data-x-handle]').forEach(e => { e.textContent = X ? (handle ? '@' + handle : 'Follow') : 'TBA'; });
  $$('[data-x-text]').forEach(e => { e.textContent = X ? (handle ? '@' + handle + ' · ' : '') + X.replace(/^https?:\/\//, '') : 'X TBA'; });
}
fillConfig();

// ---------- toasts ----------
function toast(msg, gold) {
  window.__toastN++;
  const t = $('#toasts'); const e = document.createElement('div'); e.className = 'toast' + (gold ? ' gold' : ''); e.textContent = msg;
  t.appendChild(e); while (t.children.length > (mob() ? 2 : 3)) t.firstChild.remove(); setTimeout(() => e.remove(), 3300);
}
const open = u => { const w = window.open(u, '_blank', 'noopener'); if (w === null) toast('Your browser blocked the new tab. Allow pop-ups and try again.'); };
async function copyCA(btn) {
  if (!CA) return toast('CA TBA. It goes live in config.js at launch.');
  let ok = false;
  try { await navigator.clipboard.writeText(CA); ok = true; } catch (e) {
    try { const ta = document.createElement('textarea'); ta.value = CA; ta.style.cssText = 'position:fixed;opacity:0'; body.appendChild(ta); ta.select(); ok = document.execCommand('copy'); ta.remove(); } catch (e2) { ok = false; }
  }
  if (!ok) return toast('Copy failed. Select the CA and copy it by hand.');
  toast('CA copied. Check it twice before you buy.');
  if (btn && btn.classList.contains('cabox-copy')) { btn.classList.add('done'); btn.textContent = 'Copied'; setTimeout(() => { btn.classList.remove('done'); btn.textContent = 'Copy'; }, 1500); }
}

// ---------- the set ----------
const CARDS = [
  { id: 'lift', name: 'The Lift', img: 'lift', rar: 'common', rl: 'Common', ico: '●', pow: 90, stats: [['PUMP', 90], ['HODL', 85], ['TEAMWORK', 99], ['WOW', 70]], ab: ['Group Lift', 'Needs all four pairs of hands. Gains +10 PUMP for every crew member under the chart.'], fl: 'Nobody lifts alone.' },
  { id: 'climb', name: 'The Climb', img: 'climb', rar: 'uncommon', rl: 'Uncommon', ico: '◆', pow: 88, stats: [['PUMP', 88], ['HODL', 95], ['GRIP', 99], ['WOW', 74]], ab: ['Rope Trick', 'Climbs one candle per turn and never slides back down.'], fl: 'The coins are at the top. Keep climbing.' },
  { id: 'ride', name: 'The Ride', img: 'ride', rar: 'uncommon', rl: 'Uncommon', ico: '◆', pow: 84, stats: [['PUMP', 84], ['HODL', 92], ['CHILL', 99], ['WOW', 80]], ab: ['Free Ride', 'Sits on the trend line and waves at the bears below.'], fl: 'Thumbs up, seatbelts off.' },
  { id: 'rocket', name: 'Liftoff', img: 'rocket', rar: 'rare', rl: 'Rare', ico: '▲', pow: 95, stats: [['PUMP', 98], ['HODL', 80], ['SPEED', 99], ['WOW', 90]], ab: ['Ignition', 'The chart goes vertical. Holding on is optional, but recommended.'], fl: 'Next stop: higher.' },
  { id: 'surf', name: 'Catch the Wave', img: 'surf', rar: 'rare', rl: 'Rare', ico: '▲', pow: 93, stats: [['PUMP', 93], ['HODL', 86], ['BALANCE', 97], ['WOW', 92]], ab: ['Stack Surf', 'Four boards, one green wave, zero wipeouts.'], fl: 'Doge rides the top of every wave.' },
  { id: 'moon', name: 'Moon Plant', img: 'moon', rar: 'holo', rl: 'Holo Rare', ico: '★', pow: 99, stats: [['PUMP', 99], ['HODL', 99], ['ALTITUDE', 99], ['WOW', 96]], ab: ['Flag? Arrow.', 'Plants the chart on the moon and calls it home.'], fl: 'One small step for a frog.' },
  { id: 'selfie', name: 'Crew Selfie', img: 'selfie', rar: 'holo', rl: 'Holo Rare', ico: '★', pow: 97, stats: [['PUMP', 94], ['HODL', 97], ['VIBES', 99], ['WOW', 99]], ab: ['Proof of Crew', 'A snapshot taken at the all-time high. Everyone made it into frame.'], fl: 'Say "pump"!' },
];
const SECRET = { id: 'full', name: 'Full Crew', img: 'pumpmeme', rar: 'ultra', rl: 'Ultra Rare', ico: '✦', pow: 99, stats: [['PUMP', 99], ['HODL', 99], ['TEAMWORK', 99], ['WOW', 99]], ab: ['We Pump Together', 'Only shows up when the whole set is collected. Every stat maxed, nobody left behind.'], fl: 'Four memes. One chart. Full set.', secret: true };
const ALL = CARDS.concat([SECRET]);
const num = i => i === 7 ? '008/007' : String(i + 1).padStart(3, '0') + '/007';

function frontHTML(c, i) {
  return `<div class="face front"><div class="c-top"><span class="c-name">${c.name}</span><span class="c-pow"><small>PUMP</small>${c.pow}</span></div>
    <div class="c-art"><img src="assets/cards/${c.img}.jpg" alt="${c.name}: PumpMeme crew art" draggable="false"></div>
    <span class="c-type">Crew card · ${c.rl}</span><p class="c-flav">${c.fl}</p>
    <div class="c-foot"><span>${num(i)}</span><span class="c-rar"><i>${c.ico}</i>${c.rl}</span></div><i class="foil"></i><i class="glare"></i></div>`;
}
function statsHTML(c, i) {
  return `<div class="face face-b stats"><span class="st-k">${num(i)} · ${c.rl}</span><h3>${c.name}</h3>
    <div class="bars">${c.stats.map(([k, v]) => `<div class="bar"><span>${k}</span><i style="--v:${v}%"></i><b>${v}</b></div>`).join('')}</div>
    <div class="ability"><b>${c.ab[0]}</b>${c.ab[1]}</div><p class="st-f">“${c.fl}”</p>
    <div class="st-foot"><span>Series 1 · PumpMeme</span><span>Fan card · NFA</span></div><i class="foil"></i></div>`;
}
const backHTML = () => `<div class="face face-b cardback"><span>PUMP<br>COLLECTION<small>SERIES 1</small></span></div>`;

const grid = $('#grid');
ALL.forEach((c, i) => {
  const slot = document.createElement('div'); slot.className = 'slot' + (c.secret ? ' slot-secret' : '');
  if (c.secret) slot.innerHTML = `<div class="secret-lock"><b>?</b><span>Secret card<br>Collect all 7 to unlock</span></div>`;
  const b = document.createElement('button'); b.className = 'card r-' + c.rar + (c.secret ? '' : ' down'); b.dataset.card = i;
  b.setAttribute('aria-label', 'Inspect card ' + num(i) + ': ' + c.name);
  if (c.secret) b.tabIndex = -1;
  b.innerHTML = `<span class="seen-tag">Collected</span><div class="card-in">${frontHTML(c, i)}${backHTML()}</div>`;
  slot.appendChild(b); grid.appendChild(slot);
});
const gridCards = $$('.grid .card');
// checklist
$('#checkRows').innerHTML = ALL.map((c, i) => `<tr data-row="${i}" class="${c.secret ? 'locked' : ''}"><td>${c.secret ? '???' : num(i).slice(0, 3)}</td><td><b>${c.secret ? 'Secret card' : c.name}</b></td><td><span class="rb" style="background:${{ common: '#33a447', uncommon: '#3b82f6', rare: '#f2891d', holo: '#9b6bff', ultra: '#c8901a' }[c.rar]}">${c.secret ? '???' : c.rl}</span></td><td class="ck">✓</td></tr>`).join('');

// size card text to card width
const ro = 'ResizeObserver' in window ? new ResizeObserver(es => es.forEach(e => { e.target.style.fontSize = (e.contentRect.width * .062).toFixed(2) + 'px'; })) : null;
function sizeCard(el) { if (ro) ro.observe(el); else el.style.fontSize = (el.offsetWidth * .062) + 'px'; }
gridCards.forEach(sizeCard);

// ---------- booster pack: rip and deal ----------
const pack = $('#pack');
let dealt = false, dealing = false;
function deal() {
  if (dealing) return; dealing = true;
  const toDeal = gridCards.slice(0, 7);
  const pr = pack.getBoundingClientRect(); const pcx = pr.left + pr.width / 2, pcy = pr.top + pr.height / 2;
  pack.classList.add('torn');
  const go = () => {
    toDeal.forEach((c, k) => {
      const r = c.getBoundingClientRect(); const dx = pcx - (r.left + r.width / 2), dy = pcy - (r.top + r.height / 2);
      c.classList.remove('flying'); c.classList.add('down');
      c.style.transform = `translate(${dx}px,${dy}px) rotate(${(k - 3) * 6}deg) scale(.45)`; c.style.opacity = '0';
    });
    void grid.offsetWidth;
    toDeal.forEach((c, k) => {
      setTimeout(() => { c.classList.add('flying'); c.style.opacity = ''; c.style.transform = ''; }, reduced ? 0 : 120 + k * 110);
      setTimeout(() => { c.classList.remove('down'); }, reduced ? 0 : 620 + k * 110);
    });
    setTimeout(() => {
      toDeal.forEach(c => c.classList.remove('flying')); dealing = false; dealt = true; body.classList.add('dealt');
      $('#packLabel').textContent = 'Deal again'; $('#packHint').textContent = 'Tap the pack to shuffle and deal a fresh round.';
      setTimeout(() => pack.classList.remove('torn'), 600);
    }, reduced ? 50 : 1500);
  };
  setTimeout(go, reduced ? 0 : 380);
}

// ---------- complete-the-set tracker ----------
const got = new Set(); let unlocked = false, pendingReveal = false;
function collect(i) {
  if (i > 6 || got.has(i)) return;
  got.add(i); gridCards[i].classList.add('got');
  $$('#pips li').forEach((li, k) => li.classList.toggle('on', k < got.size));
  $('#countN').textContent = got.size;
  $('#progFill').style.width = (got.size / 7 * 100) + '%';
  $(`[data-row="${i}"]`).classList.add('got');
  $('#progText').textContent = got.size < 7 ? `${got.size}/7 inspected. ${7 - got.size} to go for the secret card.` : 'Set complete! The secret card is in your binder.';
  if (got.size === 7 && !unlocked) pendingReveal = true;
}
function reveal() {
  pendingReveal = false; unlocked = true;
  const slot = $('.slot-secret'); slot.classList.add('unlocked'); gridCards[7].tabIndex = 0;
  $('.tracker').classList.add('done');
  const row = $('[data-row="7"]'); row.classList.remove('locked'); row.classList.add('got'); row.cells[0].textContent = '008'; row.cells[1].innerHTML = '<b>Full Crew</b>'; row.cells[2].innerHTML = '<span class="rb" style="background:#c8901a">Ultra Rare</span>';
  toast('Set complete! Ultra-rare "Full Crew" card unlocked.', 1);
  slot.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
  setTimeout(() => openInspect(7), reduced ? 100 : 1300);
}

// ---------- inspect view ----------
const ins = $('#inspect'), stage = $('#insStage');
let cur = -1, big = null;
const navList = () => unlocked ? [0, 1, 2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 4, 5, 6];
function renderBig(i) {
  const c = ALL[i]; stage.innerHTML = '';
  big = document.createElement('div'); big.className = 'card big enter r-' + c.rar; big.setAttribute('role', 'img'); big.setAttribute('aria-label', c.name + ' card');
  big.innerHTML = `<div class="card-in">${frontHTML(c, i)}${statsHTML(c, i)}</div>`;
  stage.appendChild(big); sizeCard(big);
  $('#insMeta').textContent = num(i) + ' · ' + c.rl;
}
function openInspect(i) {
  if (i === 7 && !unlocked) return;
  cur = i; renderBig(i); ins.hidden = false; body.classList.add('inspecting'); collect(i);
}
function closeInspect() {
  ins.hidden = true; body.classList.remove('inspecting'); stage.innerHTML = ''; big = null;
  const last = gridCards[cur]; if (last) last.focus({ preventScroll: true });
  if (pendingReveal) setTimeout(reveal, 250);
}
function step(d) {
  const L = navList(); let k = L.indexOf(cur); k = (k + d + L.length) % L.length; cur = L[k]; renderBig(cur); collect(cur);
}
const flip = () => { if (big) big.classList.toggle('flipped'); };

// tilt + foil
function tilt(e) {
  if (!big) return; const r = stage.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
  big.style.setProperty('--ry', ((x - .5) * 22).toFixed(2) + 'deg'); big.style.setProperty('--rx', ((.5 - y) * 18).toFixed(2) + 'deg');
  $$('.foil,.glare', big).forEach(f => { f.style.setProperty('--px', (x * 100).toFixed(1) + '%'); f.style.setProperty('--py', (y * 100).toFixed(1) + '%'); f.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); f.style.setProperty('--gy', (y * 100).toFixed(1) + '%'); if (!f.closest('.stats')) f.style.setProperty('--fo', '.45'); });
}
function untilt() { if (!big) return; big.style.setProperty('--rx', '0deg'); big.style.setProperty('--ry', '0deg'); }
let sw = null;
stage.addEventListener('pointermove', tilt);
stage.addEventListener('pointerleave', untilt);
stage.addEventListener('pointerdown', e => { sw = { x: e.clientX, y: e.clientY }; });
stage.addEventListener('pointerup', e => {
  if (!sw) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1); else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) flip();
  if (e.pointerType !== 'mouse') untilt();
});
ins.addEventListener('click', e => { if (e.target === ins) closeInspect(); });
// grid hover foil
gridCards.forEach(c => c.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return; const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100;
  const f = $('.front .glare', c); f.style.setProperty('--gx', x.toFixed(1) + '%'); f.style.setProperty('--gy', y.toFixed(1) + '%');
}));

// ---------- actions ----------
const acts = {
  buy: () => BUY ? open(BUY) : toast('CA TBA. The Buy button goes live once the CA is in config.js.'),
  copy: b => copyCA(b),
  x: () => X ? open(X) : toast('X link coming soon.'),
  chart: () => CHART ? open(CHART) : toast('Chart TBA. DexScreener opens once the CA is set.'),
  pack: () => deal(),
  close: () => closeInspect(),
  prev: () => step(-1), next: () => step(1), flip: () => flip(),
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (b && acts[b.dataset.act]) { acts[b.dataset.act](b); return; }
  const c = e.target.closest('.grid .card'); if (c) {
    const i = +c.dataset.card; if (i === 7 && !unlocked) return;
    if (!dealt) { deal(); return; }
    if (dealing) return;
    openInspect(i);
  }
});
addEventListener('keydown', e => {
  if (ins.hidden) return;
  if (e.key === 'Escape') closeInspect();
  else if (e.key === 'ArrowRight') step(1);
  else if (e.key === 'ArrowLeft') step(-1);
  else if (e.key === ' ' || e.key === 'Enter') { if (!e.target.closest('button')) { e.preventDefault(); flip(); } }
});

// ---------- boot: shuffle, then rip the first pack ----------
let booted = false;
function boot() {
  if (booted) return; booted = true; body.classList.remove('loading');
  setTimeout(() => { if (!dealt && !dealing) deal(); }, reduced ? 100 : 900);
}
const t0 = performance.now(); const minT = reduced ? 200 : 1400;
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(boot, Math.max(0, minT - (performance.now() - t0))));
setTimeout(boot, 3000);

window.__pm = { get got() { return got.size; }, get unlocked() { return unlocked; }, get dealt() { return dealt; }, get cur() { return cur; }, openInspect, closeInspect, CA, X };
