"""
pixeldsl.preview - one self-contained HTML page to look at assets while prototyping.

Embeds the exported sheets as data URIs and plays them: pick model / view /
animation, switch directions (buttons, arrow keys or auto-turn), zoom, fps,
background. Tiles are shown repeated 3x3. Works from file:// with no server.
"""
import base64
import io
import json

from PIL import Image


def _uri(rgba):
    buf = io.BytesIO()
    Image.fromarray(rgba, "RGBA").save(buf, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def entry_from_render(model, view, raw, dirs, origin, size, sheet_fn):
    from .model import DIR_NAMES
    return {
        "model": model.name, "kind": model.kind, "view": view,
        "frame": list(size), "origin": list(origin),
        "dirs": [DIR_NAMES.get(d, str(d)) for d in dirs],
        "anims": {a: {"src": _uri(sheet_fn(v["frames"])), "frames": len(v["frames"][0]),
                      "fps": model.fps(a), "loop": model.loops(a)} for a, v in raw.items()},
    }


def tile_entry(material, seed, frames, fps):
    from .export import sheet
    return {"tile": material, "seed": seed, "frame": [frames[0].shape[1], frames[0].shape[0]],
            "src": _uri(sheet([frames])), "frames": len(frames), "fps": fps}


PAGE = r"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PixelDSL Preview</title>
<style>
:root{--bg:#1d1f26;--panel:#272a33;--ink:#e8e8ee;--mute:#9a9cab;--acc:#7aa7ff;--line:#383c48}
:root[data-theme="light"]{--bg:#f2f2f5;--panel:#ffffff;--ink:#1b1c22;--mute:#5d606c;--acc:#2f63d6;--line:#dcdde3}
@media (prefers-color-scheme: light){:root:not([data-theme="dark"]){--bg:#f2f2f5;--panel:#ffffff;--ink:#1b1c22;--mute:#5d606c;--acc:#2f63d6;--line:#dcdde3}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.4 system-ui,sans-serif}
header{display:flex;gap:12px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line);flex-wrap:wrap}
h1{font-size:16px;margin:0 12px 0 0}
select,button,input{font:inherit;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:5px 8px}
button.on{border-color:var(--acc);color:var(--acc)}
main{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:16px;padding:16px}
@media (max-width:760px){main{grid-template-columns:1fr}}
.stage{background:var(--panel);border:1px solid var(--line);border-radius:10px;display:flex;align-items:center;justify-content:center;min-height:420px;overflow:auto}
canvas{image-rendering:pixelated}
aside{display:flex;flex-direction:column;gap:12px}
.box{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px}
.box h2{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute);margin:0 0 8px}
.dirs{display:flex;flex-wrap:wrap;gap:6px}.row{display:flex;gap:8px;align-items:center;margin:6px 0}
.mute{color:var(--mute);font-size:12px}
.strip{display:flex;gap:4px;flex-wrap:wrap;margin-top:8px}.strip canvas{background:var(--bg);border-radius:4px;cursor:pointer}
.tiles{display:flex;flex-wrap:wrap;gap:12px;padding:0 16px 24px}.tiles figure{margin:0}.tiles figcaption{font-size:12px;color:var(--mute)}
</style></head><body>
<header><h1>PixelDSL Preview</h1>
<select id="model"></select><select id="view"></select><select id="anim"></select>
<button id="play" class="on">Pause</button>
<label class="mute">bg <select id="bg"><option value="dark">dark</option><option value="light">light</option><option value="checker">checker</option><option value="ground">ground</option></select></label>
</header>
<main><div class="stage"><canvas id="cv"></canvas></div>
<aside>
<div class="box"><h2>Direction</h2><div class="dirs" id="dirs"></div>
<div class="row"><label><input type="checkbox" id="turn"> auto-turn</label></div><div class="mute">arrow keys switch direction, space = pause</div></div>
<div class="box"><h2>Playback</h2>
<div class="row">zoom <input type="range" id="zoom" min="1" max="8" value="4"><span id="zv"></span></div>
<div class="row">speed <input type="range" id="spd" min="10" max="300" value="100"><span id="sv"></span></div>
<div class="mute" id="info"></div><div class="strip" id="strip"></div></div>
</aside></main>
<div class="tiles" id="tiles"></div>
<script>
const DATA = __DATA__;
const $ = id => document.getElementById(id);
const imgs = {};
function img(src){ if(!imgs[src]){ const i=new Image(); i.src=src; imgs[src]=i; } return imgs[src]; }
const entries = DATA.entries, models = [...new Set(entries.map(e=>e.model))];
let cur=null, anim=null, dir=0, frame=0, acc=0, playing=true, last=performance.now(), turnT=0;
function fill(sel, items, keep){ const v=sel.value; sel.innerHTML=items.map(x=>`<option>${x}</option>`).join(''); if(keep&&items.includes(v)) sel.value=v; }
fill($('model'), models);
function pick(){
  const vs = entries.filter(e=>e.model===$('model').value).map(e=>e.view); fill($('view'), vs, true);
  cur = entries.find(e=>e.model===$('model').value && e.view===$('view').value);
  fill($('anim'), Object.keys(cur.anims), true); anim=$('anim').value; dir=Math.min(dir,cur.dirs.length-1); frame=0;
  $('dirs').innerHTML = cur.dirs.map((d,i)=>`<button data-i="${i}">${d.replace('_','-')}</button>`).join('');
  [...$('dirs').children].forEach(b=>b.onclick=()=>{dir=+b.dataset.i; ui();});
  ui();
}
function ui(){
  [...$('dirs').children].forEach((b,i)=>b.classList.toggle('on', i===dir));
  const a=cur.anims[anim]; $('zv').textContent=$('zoom').value+'x'; $('sv').textContent=$('spd').value+'%';
  $('info').textContent=`${cur.model} · ${cur.view} · ${anim}: ${a.frames} frames @ ${a.fps} fps · frame ${cur.frame[0]}×${cur.frame[1]} · origin ${cur.origin}`;
  const s=$('strip'); s.innerHTML='';
  for(let f=0; f<a.frames; f++){ const c=document.createElement('canvas'); c.width=cur.frame[0]; c.height=cur.frame[1];
    c.style.width=(cur.frame[0]*1.2)+'px'; const g=c.getContext('2d'); const im=img(a.src);
    const draw=()=>g.drawImage(im, f*cur.frame[0], dir*cur.frame[1], cur.frame[0], cur.frame[1], 0,0,cur.frame[0],cur.frame[1]);
    im.complete?draw():im.addEventListener('load',draw,{once:true}); c.onclick=()=>{frame=f; playing=false; $('play').textContent='Play'; $('play').classList.remove('on');}; s.appendChild(c); }
}
$('model').onchange=pick; $('view').onchange=pick; $('anim').onchange=()=>{anim=$('anim').value; frame=0; ui();};
$('zoom').oninput=ui; $('spd').oninput=ui;
$('play').onclick=()=>{playing=!playing; $('play').textContent=playing?'Pause':'Play'; $('play').classList.toggle('on',playing);};
document.addEventListener('keydown',e=>{ if(!cur) return; const n=cur.dirs.length;
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){dir=(dir+1)%n; ui();} if(e.key==='ArrowLeft'||e.key==='ArrowUp'){dir=(dir+n-1)%n; ui();}
  if(e.key===' '){e.preventDefault(); $('play').click();} });
function bg(g,w,h,z){ const m=$('bg').value, dark=getComputedStyle(document.body).backgroundColor;
  if(m==='checker'){ for(let y=0;y<h;y+=8*z)for(let x=0;x<w;x+=8*z){g.fillStyle=((x/(8*z)+y/(8*z))%2)?'#3a3d48':'#2c2f38';g.fillRect(x,y,8*z,8*z);} }
  else if(m==='ground'){ g.fillStyle='#24262c'; g.fillRect(0,0,w,h); g.strokeStyle='#30333b'; for(let x=0;x<w;x+=16*z){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();} for(let y=0;y<h;y+=16*z){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();} }
  else { g.fillStyle = m==='light' ? '#e9e9ee' : '#1a1c22'; g.fillRect(0,0,w,h); } }
function tick(now){
  const dt=(now-last)/1000; last=now; const cv=$('cv'), g=cv.getContext('2d');
  if(cur){ const a=cur.anims[anim], z=+$('zoom').value, sp=$('spd').value/100;
    if(playing){ acc+=dt*a.fps*sp; while(acc>=1){acc-=1; frame = a.loop ? (frame+1)%a.frames : Math.min(frame+1, a.frames-1); if(!a.loop && frame===a.frames-1 && acc>0) {acc=-a.fps*0.6;} } if(!a.loop && acc<0 && acc+dt*a.fps*sp>=0){frame=0;} }
    if($('turn').checked){ turnT+=dt; if(turnT>0.8){turnT=0; dir=(dir+1)%cur.dirs.length; ui();} }
    const W=cur.frame[0]*z+64*z/2, H=cur.frame[1]*z+16*z;
    if(cv.width!==W||cv.height!==H){cv.width=W; cv.height=H;} g.imageSmoothingEnabled=false; bg(g,W,H,z);
    const ox=(W-cur.frame[0]*z)/2, oy=(H-cur.frame[1]*z)/2;
    g.fillStyle='rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(ox+cur.origin[0]*z, oy+cur.origin[1]*z, 10*z, 3.5*z, 0, 0, 7); g.fill();
    const im=img(a.src); if(im.complete) g.drawImage(im, frame*cur.frame[0], dir*cur.frame[1], cur.frame[0], cur.frame[1], ox, oy, cur.frame[0]*z, cur.frame[1]*z);
  }
  requestAnimationFrame(tick);
}
const T=$('tiles'); (DATA.tiles||[]).forEach(t=>{ const f=document.createElement('figure'); const c=document.createElement('canvas');
  const s=3, w=t.frame[0], h=t.frame[1]; c.width=w*3*s; c.height=h*3*s; const g=c.getContext('2d'); g.imageSmoothingEnabled=false; const im=img(t.src); let k=0;
  const draw=()=>{ for(let y=0;y<3;y++)for(let x=0;x<3;x++) g.drawImage(im,(k%t.frames)*w,0,w,h,x*w*s,y*h*s,w*s,h*s); };
  im.complete?draw():im.addEventListener('load',draw,{once:true}); if(t.frames>1) setInterval(()=>{k++;draw();},1000/t.fps);
  f.appendChild(c); const cap=document.createElement('figcaption'); cap.textContent=`${t.tile} · seed ${t.seed} · ${w}×${h}`; f.appendChild(cap); T.appendChild(f); });
if(entries.length){ pick(); } requestAnimationFrame(tick);
__LIVE__
</script></body></html>
"""


def write_page(path, entries, tiles=None, live=False):
    data = json.dumps({"entries": entries, "tiles": tiles or []})
    live_js = "setTimeout(()=>location.reload(), 2500);" if live else ""
    html = PAGE.replace("__DATA__", data).replace("__LIVE__", live_js)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    return path
