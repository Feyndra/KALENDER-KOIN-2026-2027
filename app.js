(function(){
var CFG=(typeof window!=='undefined'&&window.KOIN_CONFIG)||{};
var SRC={KPA:['#8B1E1A','#fff'],DIKYANMAS:['#F2B705','#3B2A00'],KAMINFO:['#0E7C86','#fff'],KADERISASI:['#D93B3B','#fff'],HUBLU:['#2F6DB5','#fff'],DAURIS:['#F1B6C4','#5C1830'],KABINET:['#6A3FA0','#fff']};
var MON={jan:0,januari:0,feb:1,februari:1,mar:2,maret:2,apr:3,april:3,mei:4,may:4,jun:5,juni:5,jul:6,juli:6,agu:7,agt:7,agustus:7,aug:7,august:7,sep:8,sept:8,september:8,okt:9,oktober:9,oct:9,october:9,nov:10,november:10,des:11,desember:11,dec:11,december:11};
var BLN=['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'];
var BLNF=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
var HARI=['MINGGU','SENIN','SELASA','RABU','KAMIS','JUMAT','SABTU'];
function pad(n){return n<10?'0'+n:''+n}
function mk(y,m,d){var t=new Date(y,m,d);return t.getFullYear()===y&&t.getMonth()===m&&t.getDate()===d?t:null}
function ymd(t){return t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate())}
function parseDate(s){
  s=String(s||'').trim();if(!s)return null;var m;
  if(m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))return mk(+m[1],+m[2]-1,+m[3]);
  if(m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/))return mk(+m[3],+m[2]-1,+m[1]);
  if(m=s.match(/(\d{1,2})\s+([A-Za-z]+)\.?,?\s+(\d{4})/)){var mo=MON[m[2].toLowerCase()];if(mo!==undefined)return mk(+m[3],mo,+m[1])}
  return null}
function parseCSV(t){
  var rows=[],r=[],f='',q=false,i,c;
  for(i=0;i<t.length;i++){c=t[i];
    if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true;
    else if(c===','){r.push(f);f=''}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;r.push(f);rows.push(r);r=[];f=''}
    else f+=c}
  if(f!==''||r.length){r.push(f);rows.push(r)}
  return rows}
function toEvents(rows){
  var head=(rows[0]||[]).map(function(h){return String(h).trim().toLowerCase()});
  function col(names,def){for(var i=0;i<names.length;i++){var k=head.indexOf(names[i]);if(k>=0)return k}return def}
  var ix={s:col(['sumber','bidang/biro','bidang'],0),t:col(['tanggal'],1),n:col(['nama kegiatan','kegiatan'],2),a:col(['jam mulai','mulai'],3),b:col(['jam selesai','selesai'],4),l:col(['lokasi'],5),p:col(['peserta'],6),k:col(['keterangan'],7)};
  var ev=[],skipped=0;
  rows.slice(1).forEach(function(r){
    function g(k){return String(r[k]==null?'':r[k]).trim()}
    var nm=g(ix.n),ds=g(ix.t),sr=g(ix.s);
    if(!nm&&!ds&&!sr)return;
    var d=parseDate(ds);
    if(!d||!nm){skipped++;return}
    ev.push({src:sr.toUpperCase(),date:d,key:ymd(d),name:nm,start:g(ix.a),end:g(ix.b),loc:g(ix.l),who:g(ix.p),note:g(ix.k)})});
  return{events:ev,skipped:skipped}}
if(typeof module!=='undefined')module.exports={parseCSV:parseCSV,parseDate:parseDate,toEvents:toEvents};
if(typeof document==='undefined')return;

var $=function(id){return document.getElementById(id)};
var state={events:[],hidden:{},y:0,m:0,label:''};
var rs=(CFG.startMonth||'2026-10').split('-'),re=(CFG.endMonth||'2027-01').split('-');
var startIdx=+rs[0]*12+(+rs[1]-1),endIdx=+re[0]*12+(+re[1]-1);
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function curIdx(){return state.y*12+state.m}
function setIdx(i){i=Math.max(startIdx,Math.min(endIdx,i));state.y=Math.floor(i/12);state.m=i%12;$('msel').value=i;render()}

function buildNav(){
  var sel=$('msel');
  for(var i=startIdx;i<=endIdx;i++){var o=el('option',null,BLNF[i%12].toUpperCase()+' '+Math.floor(i/12));o.value=i;sel.appendChild(o)}
  sel.onchange=function(){setIdx(+sel.value)};
  $('prev').onclick=function(){setIdx(curIdx()-1)};
  $('next').onclick=function(){setIdx(curIdx()+1)};
  var lg=$('legend');
  Object.keys(SRC).forEach(function(k){
    var b=el('button','chip');b.type='button';b.setAttribute('aria-pressed','true');
    var d=el('i');d.style.background=SRC[k][0];b.appendChild(d);b.appendChild(document.createTextNode(k));
    b.onclick=function(){state.hidden[k]=!state.hidden[k];b.setAttribute('aria-pressed',state.hidden[k]?'false':'true');render()};
    lg.appendChild(b)});
  $('refresh').onclick=load}

function card(e){
  var c=el('div','card'),col=SRC[e.src]||['#8a8470','#fff'];
  var h=el('div','bd',e.src||'TBA');h.style.background=col[0];h.style.color=col[1];c.appendChild(h);
  c.appendChild(el('div','nm',e.name));
  var w=e.start?(e.end?e.start+' - '+e.end:e.start):'TBA',p=(e.who||'TBA').toUpperCase();
  [['Jam',w,''],['Lokasi',e.loc||'TBA',''],['Peserta',p,p==='TERBUKA'?'p-terbuka':'']].forEach(function(x){
    var r=el('div','r');r.appendChild(el('div','lb',x[0]));
    var v=el('div','vl'+(x[1]==='TBA'?' tba':'')+(x[2]?' '+x[2]:''),x[1]);r.appendChild(v);c.appendChild(r)});
  if(e.note)c.appendChild(el('div','ket',e.note));
  return c}

function render(){
  var y=state.y,m=state.m,cal=$('cal');cal.replaceChildren();
  $('prev').disabled=curIdx()<=startIdx;$('next').disabled=curIdx()>=endIdx;
  var by={};state.events.forEach(function(e){if(state.hidden[e.src])return;(by[e.key]=by[e.key]||[]).push(e)});
  var wd=el('div','wd');HARI.forEach(function(h){wd.appendChild(el('div',null,h))});cal.appendChild(wd);
  var first=new Date(y,m,1),last=new Date(y,m+1,0),today=ymd(new Date()),inMonth=0;
  var start=new Date(y,m,1-first.getDay());
  for(var w=0;;w++){
    var ws=new Date(start.getFullYear(),start.getMonth(),start.getDate()+7*w);
    if(ws>last)break;
    var wk=el('div','week');
    for(var i=0;i<7;i++){
      var d=new Date(ws.getFullYear(),ws.getMonth(),ws.getDate()+i),k=ymd(d),list=by[k]||[];
      var out=d.getMonth()!==m;if(!out)inMonth+=list.length;
      var day=el('div','day'+(out?' out':'')+(k===today?' today':'')+(list.length?'':' empty'));
      var dd=el('div','dd');var sm=el('small',null,HARI[d.getDay()].charAt(0)+HARI[d.getDay()].slice(1).toLowerCase()+',');
      dd.appendChild(sm);dd.appendChild(document.createTextNode(d.getDate()+' '+BLN[d.getMonth()]));
      day.appendChild(dd);list.forEach(function(e){day.appendChild(card(e))});wk.appendChild(day)}
    cal.appendChild(wk)}
  if(!inMonth){var n=el('div','noev','Belum ada kegiatan yang ditampilkan di bulan ini.');cal.appendChild(n)}}

function setStatus(txt,warn){
  $('status').textContent=txt;var w=$('warn');
  if(warn){w.textContent=warn;w.hidden=false}else w.hidden=true}
function done(ev,skipped,label){
  state.events=ev;
  var t=new Date();
  setStatus(label+' | diperbarui '+pad(t.getHours())+'.'+pad(t.getMinutes()),skipped?skipped+' baris dilewati karena tanggal atau nama kegiatan tidak terbaca. Periksa kolom Tanggal di Google Sheets.':'');
  render()}
function sample(){
  var rows=[['Sumber','Tanggal','Nama kegiatan','Jam mulai','Jam selesai','Lokasi','Peserta','Keterangan']].concat(window.KOIN_SAMPLE||[]);
  var r=toEvents(rows);done(r.events,r.skipped,'Data contoh (belum terhubung ke Google Sheets)')}
function load(){
  if(!CFG.sheetUrl){sample();return}
  setStatus('Memuat data...','');
  var u=CFG.sheetUrl+(CFG.sheetUrl.indexOf('?')>=0?'&':'?')+'t='+Date.now();
  fetch(u).then(function(r){if(!r.ok)throw new Error(r.status);return r.text()}).then(function(t){
    var r=toEvents(parseCSV(t));done(r.events,r.skipped,'Data dari Google Sheets')
  }).catch(function(){
    sample();setStatus('Data contoh (gagal memuat Google Sheets)','Data dari Google Sheets tidak bisa dimuat. Periksa link di config.js dan pastikan tab DATA sudah dipublikasikan ke web.')})}

buildNav();
var now=new Date(),ni=now.getFullYear()*12+now.getMonth();
setIdx(ni>=startIdx&&ni<=endIdx?ni:startIdx);
load();
})();
