let curTheme='dark', namingMode='sharp', linkedNav=true, labelMode='notes', currentInstrument='piano', guitarSortMode='list';

let currentMobileTab = 'play';
let currentVarTab = 'triads';
let userPreferredTab = 'triads';

function setMobileTab(tab, event) {
  // If clicking the active sheet tab again, close it (return to play)
  if (currentMobileTab === tab && tab !== 'play') {
      tab = 'play'; 
  }
  currentMobileTab = tab;
  document.body.setAttribute('data-active-tab', tab);
  
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  
  let target;
  if (tab === 'play') target = document.getElementById('navPlay');
  else if (tab === 'settings') target = document.getElementById('navSettings');
  else if (tab === 'selector') target = document.getElementById('navSelector');
  
  if(target) target.classList.add('active');
}

function setVariationTab(vTab, isUserClick = true) {
  if (isUserClick) userPreferredTab = vTab;
  currentVarTab = vTab;
  document.querySelectorAll('#varTabs .ui-btn').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.variation-panel').forEach(p => p.classList.remove('active-var'));
  
  const tabMap = { 'triads': 'vtTriads', 'shells': 'vtShells', 'drop2': 'vtDrop2', 'progs': 'vtProgs' };
  const secMap = { 'triads': 'triadListSec', 'shells': 'shellListSec', 'drop2': 'drop2ListSec', 'progs': 'progSec' };
  
  const btn = document.getElementById(tabMap[vTab]);
  const sec = document.getElementById(secMap[vTab]);
  
  if(btn) btn.classList.add('on');
  if(sec) sec.classList.add('active-var');

  if (isUserClick && vTab !== 'progs') {
     if (currentInstrument === 'guitar') {
         setGuitarDiagMode(vTab, true);
     } else if (currentInstrument === 'piano' && sec) {
         const firstTag = sec.querySelector('.triad-list-tag');
         if (firstTag) firstTag.click();
     }
  }
}

function updateFabState(isPlaying) {
  const pBtn = document.getElementById('topPlayBtn');
  const sBtn = document.getElementById('topStopBtn');
  if(!pBtn || !sBtn) return;
  if (isPlaying) {
    pBtn.style.display = 'none';
    sBtn.style.display = 'flex';
  } else {
    pBtn.style.display = 'flex';
    sBtn.style.display = 'none';
  }
}

function setGuitarSort(m){
  guitarSortMode = m;
  document.getElementById('sortListBtn').classList.toggle('on', m === 'list');
  document.getElementById('sortFretBtn').classList.toggle('on', m === 'fretboard');
  if(cur) {
    const oldGi = guitarSrcGroup;
    buildGuitar(cur.type, cur.rootSemi);
    setGuitarSrc(oldGi); 
  }
}

function setLink(b){
  linkedNav = b;
  document.getElementById('linkOnBtn').classList.toggle('on', b);
  document.getElementById('linkOffBtn').classList.toggle('on', !b);
}

function genericProxSortIndices(vArr, seedIdx, keepSeed = false) {
  if(!vArr || vArr.length<=1) return vArr ? vArr.map((_,i)=>i) : [];
  const scores = vArr.map((v, i) => {
    let sumFret = 0, count = 0;
    v.voicing.forEach(n => {
      if (n) { sumFret += n.fret; count++; }
    });
    return { idx: i, avg: count > 0 ? sumFret / count : 0 };
  });

  if (keepSeed && seedIdx >= 0 && seedIdx < vArr.length) {
    const seedScore = scores.splice(seedIdx, 1)[0];
    scores.sort((a, b) => a.avg - b.avg);
    return [seedScore.idx, ...scores.map(s => s.idx)];
  } else {
    scores.sort((a, b) => a.avg - b.avg);
    return scores.map(s => s.idx);
  }
}

function genericProxSort(vArr, seedIdx, keepSeed = false) {
  return genericProxSortIndices(vArr, seedIdx, keepSeed).map(i => vArr[i]);
}

function toggleCollapse(headerEl){headerEl.classList.toggle('open');const body=headerEl.nextElementSibling;if(body)body.classList.toggle('open')}

function toggleInstrument(inst) {
  currentInstrument = inst;
  const isGuitar = inst === 'guitar';
  
  document.getElementById('pianoView').style.display = isGuitar ? 'none' : 'block';
  document.getElementById('guitarView').style.display = isGuitar ? 'block' : 'none';
  document.getElementById('guitarHeaderControls').style.display = isGuitar ? 'flex' : 'none';
  
  const ip = document.getElementById('instPiano'); if(ip) ip.classList.toggle('on', !isGuitar);
  const ig = document.getElementById('instGuitar'); if(ig) ig.classList.toggle('on', isGuitar);
  
  setSrc(inst);
  
  // Fix piano scrollbar if switching back
  if (!isGuitar) {
    requestAnimationFrame(() => {
      syncPianoThumb();
      centerPianoOnChord();
    });
  }
}

function isMobile(){return window.innerWidth<=1000}function initMobileCollapse(){if(!isMobile())return;document.querySelectorAll('.collapse-body-target').forEach(el=>{el.classList.add('collapse-body', 'open');const hdr=el.previousElementSibling;if(hdr&&hdr.classList.contains('collapse-header'))hdr.classList.add('open');})}
window.addEventListener('resize',()=>{document.querySelectorAll('.collapse-body-target').forEach(el=>{if(!isMobile()){el.classList.remove('collapse-body','open');el.style.display='';const hdr=el.previousElementSibling;if(hdr&&hdr.classList.contains('collapse-header'))hdr.classList.remove('open');}else if(!el.classList.contains('collapse-body')){el.classList.add('collapse-body')}})})
document.addEventListener('DOMContentLoaded',initMobileCollapse);

const DARK_THEMES={dark:1,ocean:1,mocha:1,warm:1};
const THEME_VARS={
ocean:{bg:'#0C1520',card:'#142030',cardB:'#2A4060',muted:'#1A2840',txt:'#D8E8F8',txt2:'#88A8C8',txt3:'#587898',accent:'#40A0E0',green:'#40C890',btnBg:'#1A2840',btnHvr:'#2A3850',sgBg:'#1A2840',sgB:'#2A4060',tagBg:'#1A2840',tagC:'#88A8C8'},
mocha:{bg:'#16140F',card:'#1E1C17',cardB:'#4A453C',muted:'#28251D',txt:'#E8E4DC',txt2:'#B0A898',txt3:'#807868',accent:'#D85A30',green:'#2EAE6E',btnBg:'#28251D',btnHvr:'#3A362E',sgBg:'#28251D',sgB:'#4A453C',tagBg:'#28251D',tagC:'#B0A898'},
warm:{bg:'#1C1410',card:'#28201A',cardB:'#5C4838',muted:'#342A22',txt:'#F0E0D0',txt2:'#C8A888',txt3:'#907060',accent:'#D85A30',green:'#40B878',btnBg:'#342A22',btnHvr:'#443830',sgBg:'#342A22',sgB:'#5C4838',tagBg:'#342A22',tagC:'#C8A888'},
frost:{bg:'#C5DCED',card:'#F2F8FC',cardB:'#A2C4DD',muted:'#B2CDE0',txt:'#1A3B5C',txt2:'#4A6B8C',txt3:'#6A8BA8',accent:'#0066CC',green:'#108A6A',btnBg:'#F2F8FC',btnHvr:'#CFE2F0',sgBg:'#CFE2F0',sgB:'#A2C4DD',tagBg:'#CFE2F0',tagC:'#4A6B8C'},
sage:{bg:'#C2D9C6',card:'#F4F9F4',cardB:'#A1C7A5',muted:'#B1CEB5',txt:'#1F4022',txt2:'#4A6B4D',txt3:'#6A8A6D',accent:'#1E8232',green:'#1E8232',btnBg:'#F4F9F4',btnHvr:'#CBE2CE',sgBg:'#CBE2CE',sgB:'#A1C7A5',tagBg:'#CBE2CE',tagC:'#4A6B4D'},
latte:{bg:'#EACAB3',card:'#FCF4ED',cardB:'#D9B193',muted:'#E2BFA4',txt:'#542D15',txt2:'#8C5A3B',txt3:'#AA7A5B',accent:'#D85A30',green:'#2EAE6E',btnBg:'#FCF4ED',btnHvr:'#EDD2C0',sgBg:'#EDD2C0',sgB:'#D9B193',tagBg:'#EDD2C0',tagC:'#8C5A3B'}
};
function applyThemeVars(t){const el=document.documentElement.style;if(t==='light'||t==='dark'){el.cssText='';return}const v=THEME_VARS[t];if(!v){el.cssText='';return}el.setProperty('--bg',v.bg);el.setProperty('--card',v.card);el.setProperty('--card-b','1px solid '+v.cardB);el.setProperty('--muted',v.muted);el.setProperty('--muted-b','1px solid '+v.cardB);el.setProperty('--txt',v.txt);el.setProperty('--txt2',v.txt2);el.setProperty('--txt3',v.txt3);el.setProperty('--accent',v.accent);el.setProperty('--green',v.green);el.setProperty('--btn-bg',v.btnBg);el.setProperty('--btn-hvr',v.btnHvr);el.setProperty('--inv-bg',v.txt);el.setProperty('--inv-fg',v.bg);el.setProperty('--sg-bg',v.sgBg);el.setProperty('--sg-b',v.sgB);el.setProperty('--tag-bg',v.tagBg);el.setProperty('--tag-c',v.tagC)}

function setLabels(m,el){
  labelMode=m;
  document.querySelectorAll('#lblNotes, #lblDegrees').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  if(cur){
    buildTriadList(cur.type, cur.rootSemi);
    buildShellList(cur.type, cur.rootSemi);
    buildDrop2List(cur.type, cur.rootSemi);
    buildPiano();
    renderSGs();
  }
}

function setTheme(t){const isDark=!!DARK_THEMES[t];document.documentElement.setAttribute('data-theme',isDark?'dark':'light');applyThemeVars(t);document.querySelectorAll('.theme-dot').forEach(d=>d.classList.remove('on'));const dot=document.querySelector('.td-'+t);if(dot)dot.classList.add('on');curTheme=t;if(cur){buildPiano();buildGuitar(cur.type,cur.rootSemi)}}

function setNaming(mode){
  namingMode=mode;
  document.getElementById('nameSharp').classList.toggle('on',mode==='sharp');
  document.getElementById('nameFlat').classList.toggle('on',mode==='flat');
  buildManualSelectors();
  if(cur&&!(quiz&&document.getElementById('quizView').style.display!=='none')){display()}
  else if(cur){document.getElementById('qRoot').textContent=spellRoot(cur.rootSemi)}
  renderHist();
}

const NOTE_SHARP=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const NOTE_FLAT=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
function noteName(semi){return namingMode==='flat'?NOTE_FLAT[semi%12]:NOTE_SHARP[semi%12]}
function ND_name(semi){semi=semi%12;if(cur&&cur.ch){const pc=(semi-cur.rootSemi+144)%12;const ci=cur.iv.findIndex(v=>(v%12)===pc);if(ci!==-1)return spellNote(cur.rootSemi,cur.iv[ci],cur.roles[ci],namingMode==='flat');}return noteName(semi);}
function rootDisplayName(i){return namingMode==='flat'?NOTE_FLAT[i]:NOTE_SHARP[i]}
const LN=['C','D','E','F','G','A','B'],LS=[0,2,4,5,7,9,11],RS=[{l:0,a:0},{l:0,a:1},{l:1,a:0},{l:1,a:1},{l:2,a:0},{l:3,a:0},{l:3,a:1},{l:4,a:0},{l:4,a:1},{l:5,a:0},{l:5,a:1},{l:6,a:0}],RS_FLAT={1:{l:1,a:-1},3:{l:2,a:-1},6:{l:4,a:-1},8:{l:5,a:-1},10:{l:6,a:-1}},ROOT_POOL=[];
for(let i=0;i<12;i++){ROOT_POOL.push({semi:i,flat:false});if(RS_FLAT[i])ROOT_POOL.push({semi:i,flat:true})}
function getRootSpelling(rs,flat){return flat&&RS_FLAT[rs]?RS_FLAT[rs]:RS[rs]}
const ID={root:0,'2nd':1,'3rd':2,'4th':3,'5th':4,'7th':6,'9th':1,'11th':3,'13th':5,dim:0};
function spellNote(rs,iv,role,flat){const useFlat=namingMode==='flat';const rsp=getRootSpelling(rs,useFlat);const tS=(rs+iv)%12,tL=(rsp.l+(ID[role]||0))%7,nS=LS[tL];let a=(tS-nS+12)%12;if(a>6)a-=12;return LN[tL]+(a===1?'♯':a===2?'𝄪':a===-1?'♭':a===-2?'𝄫':'')}
function spellRoot(rs){return noteName(rs)}
function qualDeg(role,iv){
  const byRole={
    'root':{0:'R'},'2nd':{1:'♭2',2:'2',3:'♯2'},'3rd':{2:'𝄫3',3:'♭3',4:'3',5:'♯3'},
    '4th':{4:'♭4',5:'4',6:'♯4'},'5th':{5:'𝄫5',6:'♭5',7:'5',8:'♯5'},
    '7th':{9:'𝄫7',10:'♭7',11:'7'},'9th':{12:'♭9',13:'♭9',14:'9',15:'♯9'},
    '11th':{16:'♭11',17:'11',18:'♯11'},'13th':{19:'𝄫13',20:'♭13',21:'13',22:'♯13'},
    'dim':{0:'R',3:'♭3',6:'♭5',9:'𝄫7'}
  };
  if(byRole[role]&&byRole[role][iv]!==undefined)return byRole[role][iv];
  const m={0:'R',1:'♭2',2:'2',3:'♭3',4:'3',5:'4',6:'♭5',7:'5',8:'♯5',9:'6',10:'♭7',11:'7'};
  return m[iv%12]||role;
}

const CH={'maj':{l:'Major',s:'maj',f:'R · M3 · P5',iv:[0,4,7],r:['root','3rd','5th']},'min':{l:'Minor',s:'min',f:'R · m3 · P5',iv:[0,3,7],r:['root','3rd','5th']},'aug':{l:'Aug',s:'aug',f:'R · M3 · A5',iv:[0,4,8],r:['root','3rd','5th']},'dim':{l:'Dim',s:'dim',f:'R · m3 · d5',iv:[0,3,6],r:['root','3rd','5th']},'sus4':{l:'Sus4',s:'sus4',f:'R · P4 · P5',iv:[0,5,7],r:['root','4th','5th']},'sus2':{l:'Sus2',s:'sus2',f:'R · M2 · P5',iv:[0,2,7],r:['root','2nd','5th']},'maj7':{l:'Maj 7',s:'Δ7',f:'R · M3 · P5 · M7',iv:[0,4,7,11],r:['root','3rd','5th','7th']},'min7':{l:'Min 7',s:'m7',f:'R · m3 · P5 · m7',iv:[0,3,7,10],r:['root','3rd','5th','7th']},'dom7':{l:'Dom 7',s:'7',f:'R · M3 · P5 · m7',iv:[0,4,7,10],r:['root','3rd','5th','7th']},'hdim7':{l:'ø7',s:'ø7',f:'R · m3 · d5 · m7',iv:[0,3,6,10],r:['root','3rd','5th','7th']},'fdim7':{l:'°7',s:'°7',f:'R · m3 · d5 · d7',iv:[0,3,6,9],r:['root','3rd','5th','7th']},'maj9':{l:'Maj 9',s:'Δ9',f:'R·M3·P5·M7·M9',iv:[0,4,7,11,14],r:['root','3rd','5th','7th','9th']},'min9':{l:'Min 9',s:'m9',f:'R·m3·P5·m7·M9',iv:[0,3,7,10,14],r:['root','3rd','5th','7th','9th']},'dom9':{l:'Dom 9',s:'9',f:'R·M3·P5·m7·M9',iv:[0,4,7,10,14],r:['root','3rd','5th','7th','9th']},'dom7b9':{l:'7♭9',s:'7♭9',f:'R·M3·P5·m7·m9',iv:[0,4,7,10,13],r:['root','3rd','5th','7th','9th']},'dom7s9':{l:'7♯9',s:'7♯9',f:'R·M3·P5·m7·A9',iv:[0,4,7,10,15],r:['root','3rd','5th','7th','9th']},'maj11':{l:'Maj 11',s:'Δ11',f:'R·M3·P5·M7·M9·P11',iv:[0,4,7,11,14,17],r:['root','3rd','5th','7th','9th','11th']},'min11':{l:'Min 11',s:'m11',f:'R·m3·P5·m7·M9·P11',iv:[0,3,7,10,14,17],r:['root','3rd','5th','7th','9th','11th']},'dom11':{l:'Dom 11',s:'11',f:'R·M3·P5·m7·M9·P11',iv:[0,4,7,10,14,17],r:['root','3rd','5th','7th','9th','11th']},'dom7s11':{l:'7♯11',s:'7♯11',f:'R·M3·P5·m7·M9·A11',iv:[0,4,7,10,14,18],r:['root','3rd','5th','7th','9th','11th']},'maj13':{l:'Maj 13',s:'Δ13',f:'R·M3·P5·M7·M9·M13',iv:[0,4,7,11,14,21],r:['root','3rd','5th','7th','9th','13th']},'min13':{l:'Min 13',s:'m13',f:'R·m3·P5·m7·M9·M13',iv:[0,3,7,10,14,21],r:['root','3rd','5th','7th','9th','13th']},'dom13':{l:'Dom 13',s:'13',f:'R·M3·P5·m7·M9·M13',iv:[0,4,7,10,14,21],r:['root','3rd','5th','7th','9th','13th']},'dom7b13':{l:'7♭13',s:'7♭13',f:'R·M3·P5·m7·M9·m13',iv:[0,4,7,10,14,20],r:['root','3rd','5th','7th','9th','13th']},'dom7s13':{l:'7♯13',s:'7♯13',f:'R·M3·P5·m7·M9·A13',iv:[0,4,7,10,14,22],r:['root','3rd','5th','7th','9th','13th']},'maj6':{l:'Maj 6',s:'6',f:'R · M3 · P5 · M6',iv:[0,4,7,9],r:['root','3rd','5th','13th']},'min6':{l:'Min 6',s:'m6',f:'R · m3 · P5 · M6',iv:[0,3,7,9],r:['root','3rd','5th','13th']},'maj69':{l:'6/9',s:'6/9',f:'R · M3 · P5 · M6 · M9',iv:[0,4,7,9,14],r:['root','3rd','5th','13th','9th']},'min69':{l:'Min 6/9',s:'m6/9',f:'R · m3 · P5 · M6 · M9',iv:[0,3,7,9,14],r:['root','3rd','5th','13th','9th']},'minMaj7':{l:'Min(Maj7)',s:'m(Δ7)',f:'R · m3 · P5 · M7',iv:[0,3,7,11],r:['root','3rd','5th','7th']},'dom7sus4':{l:'7sus4',s:'7sus4',f:'R · P4 · P5 · m7',iv:[0,5,7,10],r:['root','4th','5th','7th']},'dom7alt':{l:'7alt',s:'7alt',f:'R · M3 · ♭5 · m7 · ♭9',iv:[0,4,6,10,13],r:['root','3rd','5th','7th','9th']}};





const PR={
'maj':[
  {name:'I tonic',chords:[{n:'V',d:7,t:'maj'},{n:'I',d:0,t:'maj'}],cur:1},
  {name:'IV subdominant',chords:[{n:'I',d:7,t:'maj'},{n:'IV',d:0,t:'maj'},{n:'V',d:2,t:'maj'},{n:'I',d:7,t:'maj'}],cur:1},
  {name:'V dominant',chords:[{n:'V',d:0,t:'maj'},{n:'I',d:5,t:'maj'}],cur:0},
  {name:'♭III borrowed',chords:[{n:'i',d:9,t:'min'},{n:'♭III',d:0,t:'maj'},{n:'♭VII',d:7,t:'maj'}],cur:1},
  {name:'♭VI borrowed',chords:[{n:'V',d:4,t:'maj'},{n:'♭VI',d:0,t:'maj'}],cur:1},
  {name:'♭VII modal',chords:[{n:'♭VII',d:0,t:'maj'},{n:'I',d:1,t:'maj'}],cur:0}
],
'min':[
  {name:'i minor tonic',chords:[{n:'V7',d:7,t:'dom7'},{n:'i',d:0,t:'min'}],cur:1},
  {name:'ii pre-dominant',chords:[{n:'ii',d:0,t:'min'},{n:'V',d:5,t:'maj'},{n:'I',d:10,t:'maj'}],cur:0},
  {name:'iii mediant',chords:[{n:'I',d:8,t:'maj'},{n:'iii',d:0,t:'min'},{n:'vi',d:5,t:'min'}],cur:1},
  {name:'iv minor plagal',chords:[{n:'I',d:7,t:'maj'},{n:'iv',d:0,t:'min'},{n:'I',d:7,t:'maj'}],cur:1},
  {name:'vi deceptive target',chords:[{n:'V7',d:4,t:'dom7'},{n:'vi',d:0,t:'min'}],cur:1},
  {name:'v in natural minor',chords:[{n:'i',d:5,t:'min'},{n:'♭VII',d:3,t:'maj'},{n:'v',d:0,t:'min'},{n:'i',d:5,t:'min'}],cur:2}
],
'aug':[
  {name:'I+ passing',chords:[{n:'I',d:0,t:'maj'},{n:'I+',d:0,t:'aug'},{n:'IV',d:5,t:'maj'}],cur:1},
  {name:'III+ harmonic minor',chords:[{n:'III+',d:0,t:'aug'},{n:'i',d:9,t:'min'}],cur:0}
],
'dim':[
  {name:'vii° leading tone',chords:[{n:'vii°',d:0,t:'dim'},{n:'I',d:1,t:'maj'}],cur:0},
  {name:'♯iv° passing',chords:[{n:'IV',d:11,t:'maj'},{n:'♯iv°',d:0,t:'dim'},{n:'V',d:1,t:'maj'}],cur:1}
],
'sus4':[
  {name:'Vsus4 suspended dom',chords:[{n:'Vsus4',d:0,t:'sus4'},{n:'V',d:0,t:'maj'},{n:'I',d:5,t:'maj'}],cur:0},
  {name:'Isus4 tonic sus',chords:[{n:'V',d:7,t:'maj'},{n:'Isus4',d:0,t:'sus4'},{n:'I',d:0,t:'maj'}],cur:1}
],
'sus2':[
  {name:'Isus2 tonic color',chords:[{n:'Isus2',d:0,t:'sus2'},{n:'I',d:0,t:'maj'},{n:'V',d:7,t:'maj'}],cur:0},
  {name:'Vsus2 dominant color',chords:[{n:'Vsus2',d:0,t:'sus2'},{n:'I',d:5,t:'maj'}],cur:0}
],
'maj6':[
  {name:'I6 tonic',chords:[{n:'V7',d:7,t:'dom7'},{n:'I6',d:0,t:'maj6'}],cur:1},
  {name:'IV6 subdominant',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'IV6',d:0,t:'maj6'},{n:'V7',d:2,t:'dom7'},{n:'IΔ7',d:7,t:'maj7'}],cur:1},
  {name:'♭VI6 borrowed',chords:[{n:'V7',d:4,t:'dom7'},{n:'♭VI6',d:0,t:'maj6'}],cur:1}
],
'min6':[
  {name:'im6 minor tonic',chords:[{n:'V7♭9',d:7,t:'dom7b9'},{n:'im6',d:0,t:'min6'}],cur:1},
  {name:'iv6 minor plagal',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'iv6',d:0,t:'min6'},{n:'IΔ7',d:7,t:'maj7'}],cur:1},
  {name:'ii6 pre-dominant',chords:[{n:'ii6',d:0,t:'min6'},{n:'V7',d:5,t:'dom7'},{n:'im7',d:10,t:'min7'}],cur:0}
],
'maj69':[
  {name:'I6/9 tonic ending',chords:[{n:'ii7',d:2,t:'min7'},{n:'V7',d:7,t:'dom7'},{n:'I6/9',d:0,t:'maj69'}],cur:2},
  {name:'IV6/9 subdominant',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'IV6/9',d:0,t:'maj69'},{n:'V7',d:2,t:'dom7'}],cur:1}
],
'min69':[
  {name:'im6/9 minor tonic',chords:[{n:'V7♭9',d:7,t:'dom7b9'},{n:'im6/9',d:0,t:'min69'}],cur:1},
  {name:'iv6/9 minor plagal',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'iv6/9',d:0,t:'min69'},{n:'IΔ7',d:7,t:'maj7'}],cur:1}
],
'maj7':[
  {name:'IΔ7 tonic',chords:[{n:'ii7',d:2,t:'min7'},{n:'V7',d:7,t:'dom7'},{n:'IΔ7',d:0,t:'maj7'}],cur:2},
  {name:'IVΔ7 subdominant',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'IVΔ7',d:0,t:'maj7'},{n:'V7',d:2,t:'dom7'},{n:'IΔ7',d:7,t:'maj7'}],cur:1},
  {name:'♭IIIΔ7 borrowed',chords:[{n:'im7',d:9,t:'min7'},{n:'♭IIIΔ7',d:0,t:'maj7'},{n:'♭VII7',d:7,t:'dom7'}],cur:1},
  {name:'♭VIΔ7 borrowed',chords:[{n:'V7',d:4,t:'dom7'},{n:'♭VIΔ7',d:0,t:'maj7'}],cur:1},
  {name:'♭IIΔ7 Neapolitan',chords:[{n:'♭IIΔ7',d:0,t:'maj7'},{n:'V7',d:6,t:'dom7'},{n:'im7',d:11,t:'min7'}],cur:0},
  {name:'♭VIIΔ7 modal',chords:[{n:'♭VIIΔ7',d:0,t:'maj7'},{n:'IΔ7',d:1,t:'maj7'}],cur:0}
],
'min7':[
  {name:'ii7 pre-dominant',chords:[{n:'ii7',d:0,t:'min7'},{n:'V7',d:5,t:'dom7'},{n:'IΔ7',d:10,t:'maj7'}],cur:0},
  {name:'iii7 mediant',chords:[{n:'IΔ7',d:8,t:'maj7'},{n:'iii7',d:0,t:'min7'},{n:'vi7',d:5,t:'min7'}],cur:1},
  {name:'vi7 deceptive target',chords:[{n:'V7',d:4,t:'dom7'},{n:'vi7',d:0,t:'min7'}],cur:1},
  {name:'im7 minor tonic',chords:[{n:'iiø7',d:2,t:'hdim7'},{n:'V7',d:7,t:'dom7'},{n:'im7',d:0,t:'min7'}],cur:2},
  {name:'iv7 minor plagal',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'iv7',d:0,t:'min7'},{n:'IΔ7',d:7,t:'maj7'}],cur:1},
  {name:'iv7 backdoor setup',chords:[{n:'iv7',d:0,t:'min7'},{n:'♭VII7',d:5,t:'dom7'},{n:'IΔ7',d:7,t:'maj7'}],cur:0}
],
'dom7':[
  {name:'V7 primary dominant',chords:[{n:'ii7',d:7,t:'min7'},{n:'V7',d:0,t:'dom7'},{n:'IΔ7',d:5,t:'maj7'}],cur:1},
  {name:'V7/ii secondary dom',chords:[{n:'V7/ii',d:0,t:'dom7'},{n:'ii7',d:5,t:'min7'},{n:'V7',d:10,t:'dom7'},{n:'IΔ7',d:3,t:'maj7'}],cur:0},
  {name:'V7/vi secondary dom',chords:[{n:'V7/vi',d:0,t:'dom7'},{n:'vi7',d:5,t:'min7'}],cur:0},
  {name:'♭VII7 backdoor',chords:[{n:'iv7',d:7,t:'min7'},{n:'♭VII7',d:0,t:'dom7'},{n:'IΔ7',d:2,t:'maj7'}],cur:1},
  {name:'I7 blues tonic',chords:[{n:'I7',d:0,t:'dom7'},{n:'IV7',d:5,t:'dom7'},{n:'I7',d:0,t:'dom7'},{n:'V7',d:7,t:'dom7'}],cur:0},
  {name:'♭II7 tritone sub',chords:[{n:'ii7',d:1,t:'min7'},{n:'♭II7',d:0,t:'dom7'},{n:'IΔ7',d:11,t:'maj7'}],cur:1},
  {name:'V/V extended dom',chords:[{n:'V/V',d:0,t:'dom7'},{n:'V7',d:5,t:'dom7'},{n:'IΔ7',d:10,t:'maj7'}],cur:0}
],
'minMaj7':[
  {name:'im(Δ7) minor tonic',chords:[{n:'V7♭9',d:7,t:'dom7b9'},{n:'im(Δ7)',d:0,t:'minMaj7'}],cur:1},
  {name:'im(Δ7) chromatic line',chords:[{n:'im(Δ7)',d:0,t:'minMaj7'},{n:'im7',d:0,t:'min7'},{n:'im6',d:0,t:'min6'},{n:'V7',d:7,t:'dom7'}],cur:0}
],
'dom7sus4':[
  {name:'V7sus4 resolved',chords:[{n:'V7sus4',d:0,t:'dom7sus4'},{n:'V7',d:0,t:'dom7'},{n:'IΔ7',d:5,t:'maj7'}],cur:0},
  {name:'V7sus4 direct',chords:[{n:'V7sus4',d:0,t:'dom7sus4'},{n:'IΔ7',d:5,t:'maj7'}],cur:0},
  {name:'modal parallel',chords:[{n:'I7sus4',d:0,t:'dom7sus4'},{n:'IV7sus4',d:5,t:'dom7sus4'}],cur:0}
],
'hdim7':[
  {name:'viiø7 in major',chords:[{n:'viiø7',d:0,t:'hdim7'},{n:'IΔ7',d:1,t:'maj7'}],cur:0},
  {name:'iiø7 in minor',chords:[{n:'iiø7',d:0,t:'hdim7'},{n:'V7',d:5,t:'dom7'},{n:'im7',d:10,t:'min7'}],cur:0}
],
'fdim7':[
  {name:'vii°7 leading tone',chords:[{n:'vii°7',d:0,t:'fdim7'},{n:'IΔ7',d:1,t:'maj7'}],cur:0},
  {name:'♯i°7 passing',chords:[{n:'IΔ7',d:11,t:'maj7'},{n:'♯i°7',d:0,t:'fdim7'},{n:'ii7',d:1,t:'min7'}],cur:1},
  {name:'♯ii°7 passing',chords:[{n:'ii7',d:11,t:'min7'},{n:'♯ii°7',d:0,t:'fdim7'},{n:'iii7',d:1,t:'min7'}],cur:1},
  {name:'CT°7 common tone',chords:[{n:'IΔ7',d:11,t:'maj7'},{n:'I°7',d:0,t:'fdim7'},{n:'IΔ7',d:11,t:'maj7'}],cur:1}
],
'dom7alt':[
  {name:'V7alt→I major res',chords:[{n:'ii7',d:7,t:'min7'},{n:'V7alt',d:0,t:'dom7alt'},{n:'IΔ7',d:5,t:'maj7'}],cur:1},
  {name:'V7alt→im minor res',chords:[{n:'iiø7',d:7,t:'hdim7'},{n:'V7alt',d:0,t:'dom7alt'},{n:'im7',d:5,t:'min7'}],cur:1},
  {name:'V7alt deceptive',chords:[{n:'iiø7',d:7,t:'hdim7'},{n:'V7alt',d:0,t:'dom7alt'},{n:'IΔ7',d:5,t:'maj7'}],cur:1}
],
'maj9':[
  {name:'IΔ9 tonic',chords:[{n:'ii9',d:2,t:'min9'},{n:'V9',d:7,t:'dom9'},{n:'IΔ9',d:0,t:'maj9'}],cur:2},
  {name:'IVΔ9 subdominant',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'IVΔ9',d:0,t:'maj9'},{n:'V7',d:2,t:'dom7'}],cur:1}
],
'min9':[
  {name:'ii9 pre-dominant',chords:[{n:'ii9',d:0,t:'min9'},{n:'V7',d:5,t:'dom7'},{n:'IΔ7',d:10,t:'maj7'}],cur:0},
  {name:'im9 minor tonic',chords:[{n:'iiø7',d:2,t:'hdim7'},{n:'V7',d:7,t:'dom7'},{n:'im9',d:0,t:'min9'}],cur:2},
  {name:'vi9 deceptive target',chords:[{n:'V7',d:4,t:'dom7'},{n:'vi9',d:0,t:'min9'}],cur:1}
],
'dom9':[
  {name:'V9 dominant',chords:[{n:'ii7',d:7,t:'min7'},{n:'V9',d:0,t:'dom9'},{n:'IΔ7',d:5,t:'maj7'}],cur:1},
  {name:'V9/ii secondary dom',chords:[{n:'V9/ii',d:0,t:'dom9'},{n:'ii7',d:5,t:'min7'}],cur:0}
],
'dom7b9':[
  {name:'V7♭9→im minor res',chords:[{n:'iiø7',d:7,t:'hdim7'},{n:'V7♭9',d:0,t:'dom7b9'},{n:'im7',d:5,t:'min7'}],cur:1},
  {name:'V7♭9→I deceptive',chords:[{n:'iiø7',d:7,t:'hdim7'},{n:'V7♭9',d:0,t:'dom7b9'},{n:'IΔ7',d:5,t:'maj7'}],cur:1},
  {name:'V7♭9 standalone',chords:[{n:'V7♭9',d:0,t:'dom7b9'},{n:'im7',d:5,t:'min7'}],cur:0},
  {name:'V7♯9→V7♭9→im chromatic',chords:[{n:'V7♯9',d:0,t:'dom7s9'},{n:'V7♭9',d:0,t:'dom7b9'},{n:'im7',d:5,t:'min7'}],cur:1}
],
'dom7s9':[
  {name:'V7♯9 blues dom',chords:[{n:'V7♯9',d:0,t:'dom7s9'},{n:'I7',d:5,t:'dom7'}],cur:0},
  {name:'V7♯9 Hendrix res',chords:[{n:'ii7',d:7,t:'min7'},{n:'V7♯9',d:0,t:'dom7s9'},{n:'I',d:5,t:'maj'}],cur:1},
  {name:'V7♯9→im minor res',chords:[{n:'V7♯9',d:0,t:'dom7s9'},{n:'im7',d:5,t:'min7'}],cur:0}
],
'maj11':[
  {name:'IΔ11 tonic color',chords:[{n:'V7',d:7,t:'dom7'},{n:'IΔ11',d:0,t:'maj11'}],cur:1},
  {name:'IVΔ11 subdominant',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'IVΔ11',d:0,t:'maj11'},{n:'V7',d:2,t:'dom7'}],cur:1}
],
'min11':[
  {name:'ii11 pre-dominant',chords:[{n:'ii11',d:0,t:'min11'},{n:'V7',d:5,t:'dom7'},{n:'IΔ7',d:10,t:'maj7'}],cur:0},
  {name:'im11 minor tonic',chords:[{n:'V7',d:7,t:'dom7'},{n:'im11',d:0,t:'min11'}],cur:1},
  {name:'iv11 minor plagal',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'iv11',d:0,t:'min11'},{n:'IΔ7',d:7,t:'maj7'}],cur:1}
],
'dom11':[
  {name:'V11 dominant',chords:[{n:'ii7',d:7,t:'min7'},{n:'V11',d:0,t:'dom11'},{n:'IΔ7',d:5,t:'maj7'}],cur:1},
  {name:'♭VII11 backdoor',chords:[{n:'iv7',d:7,t:'min7'},{n:'♭VII11',d:0,t:'dom11'},{n:'IΔ7',d:2,t:'maj7'}],cur:1}
],
'dom7s11':[
  {name:'V7♯11 Lydian dom',chords:[{n:'ii7',d:7,t:'min7'},{n:'V7♯11',d:0,t:'dom7s11'},{n:'IΔ7',d:5,t:'maj7'}],cur:1},
  {name:'SubV7♯11 tritone sub',chords:[{n:'ii7',d:1,t:'min7'},{n:'SubV7♯11',d:0,t:'dom7s11'},{n:'IΔ7',d:11,t:'maj7'}],cur:1},
  {name:'♭VII7♯11 backdoor',chords:[{n:'iv7',d:7,t:'min7'},{n:'♭VII7♯11',d:0,t:'dom7s11'},{n:'IΔ7',d:2,t:'maj7'}],cur:1}
],
'maj13':[
  {name:'IΔ13 tonic',chords:[{n:'V7',d:7,t:'dom7'},{n:'IΔ13',d:0,t:'maj13'}],cur:1},
  {name:'IVΔ13 subdominant',chords:[{n:'IΔ7',d:7,t:'maj7'},{n:'IVΔ13',d:0,t:'maj13'},{n:'V7',d:2,t:'dom7'}],cur:1}
],
'min13':[
  {name:'ii13 pre-dominant',chords:[{n:'ii13',d:0,t:'min13'},{n:'V7',d:5,t:'dom7'},{n:'IΔ7',d:10,t:'maj7'}],cur:0},
  {name:'im13 minor tonic',chords:[{n:'V7',d:7,t:'dom7'},{n:'im13',d:0,t:'min13'}],cur:1}
],
'dom13':[
  {name:'V13 dominant',chords:[{n:'ii7',d:7,t:'min7'},{n:'V13',d:0,t:'dom13'},{n:'IΔ7',d:5,t:'maj7'}],cur:1},
  {name:'V13/ii secondary dom',chords:[{n:'V13/ii',d:0,t:'dom13'},{n:'ii7',d:5,t:'min7'}],cur:0}
],
'dom7b13':[
  {name:'V7♭13→im dark minor',chords:[{n:'iiø7',d:7,t:'hdim7'},{n:'V7♭13',d:0,t:'dom7b13'},{n:'im7',d:5,t:'min7'}],cur:1},
  {name:'V7♭13 standalone',chords:[{n:'V7♭13',d:0,t:'dom7b13'},{n:'im7',d:5,t:'min7'}],cur:0}
],
'dom7s13':[
  {name:'V7♯13→I aug color',chords:[{n:'V7♯13',d:0,t:'dom7s13'},{n:'I',d:5,t:'maj'}],cur:0},
  {name:'V7♯13→im ambiguous',chords:[{n:'V7♯13',d:0,t:'dom7s13'},{n:'im7',d:5,t:'min7'}],cur:0}
]
};

const FG=[['TRIADS',['maj','min','aug','dim','sus4','sus2']],['6THS',['maj6','min6','maj69','min69']],['7THS',['maj7','min7','dom7','minMaj7','dom7sus4','hdim7','fdim7','dom7alt']],['9THS',['maj9','min9','dom9','dom7b9','dom7s9']],['11THS',['maj11','min11','dom11','dom7s11']],['13THS',['maj13','min13','dom13','dom7b13','dom7s13']]];
const RC={root:'pr','2nd':'p9','3rd':'p3','4th':'p11','5th':'p5','7th':'p7','9th':'p9','11th':'p11','13th':'p13',dim:'pd'},LC={root:'lroot','2nd':'l9','3rd':'l3','4th':'l11','5th':'l5','7th':'l7','9th':'l9','11th':'l11','13th':'l13',dim:'ld'};
const IS_BLACK=new Set([1,3,6,8,10]);
const GS=[4,9,2,7,11,4];
const TRIAD_TYPES={
  'maj':{name:'Major',abbr:'maj',iv:[0,4,7],roles:['root','3rd','5th']},
  'min':{name:'Minor',abbr:'m',iv:[0,3,7],roles:['root','3rd','5th']},
  'aug':{name:'Aug',abbr:'aug',iv:[0,4,8],roles:['root','3rd','5th']},
  'dim':{name:'Dim',abbr:'dim',iv:[0,3,6],roles:['root','3rd','5th']},
  'sus4':{name:'Sus4',abbr:'sus4',iv:[0,5,7],roles:['root','4th','5th']},
  'sus2':{name:'Sus2',abbr:'sus2',iv:[0,2,7],roles:['root','2nd','5th']}
};

function getExtPill(roles) {
  if (!roles) return '';
  let pills = '';
  if (roles.includes('9th')) pills += `<span class="inner-pill ${RC['9th']}"></span>`;
  if (roles.includes('11th')) pills += `<span class="inner-pill ${RC['11th']}"></span>`;
  if (roles.includes('13th')) pills += `<span class="inner-pill ${RC['13th']}"></span>`;
  return pills;
}

function findTriads(ct){const ch=CH[ct],pcs=new Set(ch.iv.map(iv=>iv%12)),r=[];
  for(let ci=0;ci<ch.iv.length;ci++){
    for(const[k,td]of Object.entries(TRIAD_TYPES)){
      const tr=ch.iv[ci]%12,tpcs=td.iv.map(iv=>(tr+iv)%12);
      if(tpcs.every(pc=>pcs.has(pc))){
        const pr=tpcs.map(pc=>{const idx=ch.iv.findIndex(iv=>iv%12===pc);return ch.r[idx]});
        const dup=r.some(x=>x.triadType===k&&x.triadRootInterval===ch.iv[ci]);
        if(!dup) r.push({triadType:k,triadAbbr:td.abbr,triadRootInterval:ch.iv[ci],triadRootRole:ch.r[ci],triadDef:td,parentRoles:pr});
      }
    }
  }
  const roleOrder={root:0,'2nd':1,'3rd':2,'4th':3,'5th':4,'7th':5,'9th':6,'11th':7,'13th':8};
  r.sort((a,b)=>(roleOrder[a.triadRootRole]??99)-(roleOrder[b.triadRootRole]??99));
  return r}

const STRING_GROUPS=[{label:'STR 3-2-1',indices:[3,4,5],name:'G B E'},{label:'STR 4-3-2',indices:[2,3,4],name:'D G B'},{label:'STR 5-4-3',indices:[1,2,3],name:'A D G'}];
function genTV(td,trs,sg,pr){const v=[],invs=[{name:'Root',order:[0,1,2]},{name:'1st',order:[1,2,0]},{name:'2nd',order:[2,0,1]}];for(const inv of invs){const notes=inv.order.map(i=>td.iv[i]),roles=inv.order.map(i=>td.roles[i]),pR=inv.order.map(i=>pr[i]),frets=[];for(let si=0;si<3;si++){const idx=sg.indices[si],os=GS[idx],ts=(trs+notes[si])%12;frets.push({fret:((ts-os)%12+12)%12,role:roles[si],parentRole:pR[si],stringIdx:idx})}const best=findSpan(frets, false, 4);if(best){const fv=Array(6).fill(null);best.forEach(f=>{fv[f.stringIdx]={fret:f.fret,deg:f.parentRole,finger:0}});v.push({name:inv.name,voicing:fv,br:null})}}return v}

function findSpan(frets, noOpen=false, maxSpan=3){
  const c=[];
  for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let d=0;d<3;d++){
    const s=[a,b,d],adj=frets.map((f,i)=>{
      let fr=f.fret;
      if(s[i]===1)fr+=12;
      if(s[i]===2)fr-=12;
      return{...f,fret:fr}
    });
    if(adj.some(f=>f.fret<0||f.fret>19))continue;
    if(noOpen&&adj.some(f=>f.fret===0))continue;
    const ft=adj.filter(f=>f.fret>0);
    const allFrets=adj.map(f=>f.fret);
    const hasOpen=allFrets.some(f=>f===0);
    const maxFret=Math.max(...allFrets);
    if(hasOpen&&maxFret>5)continue;
    if(!ft.length){c.push({v:adj,span:0,min:0});continue}
    const mn=Math.min(...ft.map(f=>f.fret)),mx=Math.max(...ft.map(f=>f.fret));
    if(mx-mn<=maxSpan)c.push({v:adj,span:mx-mn,min:mn})
  }
  if(!c.length)return null;

  c.sort((a,b)=>{
    const aOpen=a.v.some(f=>f.fret===0)?1:0,bOpen=b.v.some(f=>f.fret===0)?1:0;
    if(aOpen!==bOpen)return aOpen-bOpen;
    return a.span!==b.span?a.span-b.span:a.min-b.min
  });
  return c[0].v;
}

const SHELL_BASS_GROUPS=[{bassString:0,otherStrings:[[2,3],[3,4]]},{bassString:1,otherStrings:[[2,3],[3,4]]}];

function genShellV(shellDef,rootSemi,bassString,otherStrings,ct){const v=[],ch=CH[ct],roleIvMap={};ch.r.forEach((r,i)=>{roleIvMap[r]=ch.iv[i]});
  const bassOpen=GS[bassString],rootPC=rootSemi%12,rootFret=((rootPC-bassOpen)%12+12)%12;
  const noteA_PC=(rootSemi+shellDef.iv[1])%12;
  
  if(shellDef.iv.length === 2) {
     const stringsToTry = new Set();
     otherStrings.forEach(pair => { stringsToTry.add(pair[0]); stringsToTry.add(pair[1]); });
     let r1=RS2[shellDef.parentRoles[1]]||shellDef.parentRoles[1];
     const ordName = 'R-'+r1;
     
     stringsToTry.forEach(midIdx => {
       const midOpen=GS[midIdx];
       const midFret=((noteA_PC-midOpen)%12+12)%12;
       const frets=[{fret:rootFret,parentRole:'root',stringIdx:bassString},{fret:midFret,parentRole:shellDef.parentRoles[1],stringIdx:midIdx}];
       const best=findSpan(frets, true, 4);
       if(best){
         const fv=Array(6).fill(null);
         best.forEach(f=>{fv[f.stringIdx]={fret:f.fret,deg:f.parentRole,civ:roleIvMap[f.parentRole]||0,finger:0}});
         const strNums=best.map(f=>6-f.stringIdx).sort((a,b)=>b-a).join('-');
         v.push({name:ordName+' ('+strNums+')',voicing:fv,br:null,triadAbbr:'shell',triadRootRole:'root',triadRootSemi:rootSemi,shellLabel:shellDef.label,btnRole:shellDef.parentRoles[0]});
       }
     });
     return v;
  }

  const noteB_PC=(rootSemi+shellDef.iv[2])%12;
  let r2=RS2[shellDef.parentRoles[2]]||shellDef.parentRoles[2];
  let r1=RS2[shellDef.parentRoles[1]]||shellDef.parentRoles[1];
  if(!ch.r.includes('7th')){if(r2==='13')r2='6'; if(r1==='13')r1='6';}
  const orderings=[{mid:noteA_PC,hi:noteB_PC,midRole:shellDef.parentRoles[1],hiRole:shellDef.parentRoles[2],name:shellDef.label},{mid:noteB_PC,hi:noteA_PC,midRole:shellDef.parentRoles[2],hiRole:shellDef.parentRoles[1],name:'R-'+r2+'-'+r1}];
  for(const pair of otherStrings){for(const ord of orderings){const midIdx=pair[0],hiIdx=pair[1];const midOpen=GS[midIdx],hiOpen=GS[hiIdx];
    const midFret=((ord.mid-midOpen)%12+12)%12,hiFret=((ord.hi-hiOpen)%12+12)%12;
    const frets=[{fret:rootFret,parentRole:'root',stringIdx:bassString},{fret:midFret,parentRole:ord.midRole,stringIdx:midIdx},{fret:hiFret,parentRole:ord.hiRole,stringIdx:hiIdx}];
    const best=findSpan(frets, true, 4);if(best){const fv=Array(6).fill(null);best.forEach(f=>{fv[f.stringIdx]={fret:f.fret,deg:f.parentRole,civ:roleIvMap[f.parentRole]||0,finger:0}});
      const strNums=best.map(f=>6-f.stringIdx).sort((a,b)=>b-a).join('-');
      v.push({name:ord.name+' ('+strNums+')',voicing:fv,br:null,triadAbbr:'shell',triadRootRole:'root',triadRootSemi:rootSemi,shellLabel:shellDef.label,btnRole:shellDef.parentRoles[0]})}}}
  return v}

function buildGS(ct,rs){
  const shells=getShellNotes(ct);
  if(!shells)return[{group:{label:'Low E Root',name:''},voicings:[]},{group:{label:'A Root',name:''},voicings:[]}];
  try {
    const eAll=[],aAll=[];
    for(const shellDef of shells){
      for(const bg of SHELL_BASS_GROUPS){
        const vv=genShellV(shellDef,rs,bg.bassString,bg.otherStrings,ct);
        if(bg.bassString===0)eAll.push(...vv);else aAll.push(...vv)
      }
    }

    let eSeed = -1;
    if(eAll.length > 0) {
      eSeed = eAll.findIndex(v => v && v.name && v.name.includes('6-4-3'));
      if(eSeed === -1) eSeed = 0;
    }
    let aSeed = -1;
    if(aAll.length > 0) {
      aSeed = aAll.findIndex(v => v && v.name && v.name.includes('5-4-3'));
      if(aSeed === -1) aSeed = 0;
    }

    if (guitarSortMode === 'fretboard') {
      const eOrder = genericProxSortIndices(eAll, eSeed, true);
      const aOrder = genericProxSortIndices(aAll, aSeed, true);
      const sortedE = eOrder.map(i=>eAll[i]);
      const sortedA = aOrder.map(i=>aAll[i]);
      return[{group:{label:'Low E Root',name:''},voicings:sortedE},{group:{label:'A Root',name:''},voicings:sortedA}];
    } else {
      return[{group:{label:'Low E Root',name:''},voicings:eAll},{group:{label:'A Root',name:''},voicings:aAll}];
    }
  } catch (err) {
    console.error('Shell layout failed:', err);
    return[{group:{label:'Low E Root',name:''},voicings:[]},{group:{label:'A Root',name:''},voicings:[]}];
  }
}

const DROP2_STRING_GROUPS=[{label:'STR 4-3-2-1',indices:[2,3,4,5],name:'D G B E'},{label:'STR 5-4-3-2',indices:[1,2,3,4],name:'A D G B'}];
const DROP2_INV_NAMES=['Root','1st','2nd','3rd'];
function isDrop2Chord(ct){const ch=CH[ct];return ch&&ch.iv.length>=4}
function findSpan4(frets){const c=[];const n=frets.length;const octs=new Array(n).fill(0);function recurse(idx){if(idx===n){const adj=frets.map((f,i)=>{let fr=f.fret;if(octs[i]===1)fr+=12;if(octs[i]===2)fr-=12;return{...f,fret:fr}});if(adj.some(f=>f.fret<0||f.fret>19))return;const ft=adj.filter(f=>f.fret>0);const allFrets=adj.map(f=>f.fret);if(allFrets.some(f=>f===0))return;if(!ft.length){c.push({v:adj,span:0,min:0});return}const mn=Math.min(...ft.map(f=>f.fret)),mx=Math.max(...ft.map(f=>f.fret));if(mx-mn<=5)c.push({v:adj,span:mx-mn,min:mn});return}for(let o=0;o<3;o++){octs[idx]=o;recurse(idx+1)}}recurse(0);if(!c.length)return null;c.sort((a,b)=>{return a.span!==b.span?a.span-b.span:a.min-b.min});return c[0].v}
function getDrop2ShapeName(ivsCombo) {
  const pcs = ivsCombo.map(iv => (iv - ivsCombo[0] + 144) % 12).sort((a,b)=>a-b).join(',');
  const drop2Map = {
    '0,4,7,11':'Δ7','0,3,7,10':'m7','0,4,7,10':'7',
    '0,3,6,10':'ø7','0,3,6,9':'°7','0,4,7,9':'6',
    '0,3,7,9':'m6','0,3,7,11':'m(Δ7)','0,5,7,10':'7sus4',
    '0,4,6,10':'7♭5','0,3,6,11':'°(Δ7)',
    '0,2,4,7':'add9', '0,2,3,7':'m(add9)'
  };
  if(drop2Map[pcs]) return drop2Map[pcs];
  for(const v of Object.values(CH)){
    if(v.iv.length === 4) {
      const chPcs = v.iv.map(x => x % 12).sort((a,b)=>a-b).join(',');
      if(chPcs === pcs) return v.s;
    }
  }
  return 'drop2';
}




function getShellShapeName(ivsCombo) {
  const pcs = ivsCombo.map(iv => (iv - ivsCombo[0] + 144) % 12).sort((a,b)=>a-b).join(',');
  const shellMap = {
    '0,4,11':'Δ7', '0,3,10':'m7', '0,4,10':'7',
    '0,3,9':'m6', '0,4,9':'6', '0,7,10':'m7', '0,7,11':'Δ7',
    '0,2,11':'Δ9', '0,2,10':'9', '0,5,10':'11'
  };
  return shellMap[pcs] || '';
}




function getDrop2Combinations(arr, k) {
  const results = [];
  function helper(start, combo) {
    if (combo.length === k) { results.push([...combo]); return; }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  }
  helper(0, []);
  return results;
}

function genDrop2Voicings(ct,rs,sg,targetRoles,d2Name,d2Label){
  const ch=CH[ct];const pairs=[];
  targetRoles.forEach(tr=>{const idx=ch.r.indexOf(tr);if(idx!==-1)pairs.push({iv:ch.iv[idx]%12, role:ch.r[idx]});});
  if(pairs.length!==4)return[];
  pairs.sort((a,b)=>a.iv-b.iv);
  const ivs=pairs.map(p=>p.iv), roles=pairs.map(p=>p.role);
  const v=[];const roleIvMap={};ch.r.forEach((r,i)=>{roleIvMap[r]=ch.iv[i]});
  for(let inv=0;inv<4;inv++){
  const closeIvs=[],closeRoles=[];for(let i=0;i<4;i++){closeIvs.push(ivs[(inv+2+i)%4]);closeRoles.push(roles[(inv+2+i)%4])}const dropIvs=[closeIvs[2],closeIvs[0],closeIvs[1],closeIvs[3]];const dropRoles=[closeRoles[2],closeRoles[0],closeRoles[1],closeRoles[3]];const bottomIv=dropIvs[0];const rebasedIvs=dropIvs.map(iv=>{let d=iv-bottomIv;while(d<0)d+=12;return d});for(let i=1;i<rebasedIvs.length;i++){while(rebasedIvs[i]<=rebasedIvs[i-1])rebasedIvs[i]+=12}const frets=[];for(let si=0;si<4;si++){const idx=sg.indices[si],os=GS[idx],target=(rs+rebasedIvs[si]+bottomIv)%12;const fret=((target-os)%12+12)%12;frets.push({fret,role:dropRoles[si],parentRole:dropRoles[si],stringIdx:idx})}const best=findSpan4(frets);if(best){const fv=Array(6).fill(null);best.forEach(f=>{fv[f.stringIdx]={fret:f.fret,deg:f.parentRole,civ:roleIvMap[f.parentRole]||0,finger:0}});

const baseRole = targetRoles[0];
const topRole = targetRoles[targetRoles.length-1];
v.push({name:DROP2_INV_NAMES[inv],voicing:fv,br:null,triadAbbr:'drop2',triadRootRole:'root',triadRootSemi:rs,drop2Inv:inv,d2Name:d2Name,d2Label:d2Label,btnRole:baseRole,topRole:topRole})
}}return v}

function buildDrop2Groups(ct,rs){if(!isDrop2Chord(ct))return[];const ch=CH[ct];return DROP2_STRING_GROUPS.map(sg=>{let v=[];
const combos = getDrop2Combinations(ch.r, 4);
combos.forEach((rolesCombo, idx) => {
  const ivsCombo = rolesCombo.map(r => ch.iv[ch.r.indexOf(r)]);
  const hasRoot = rolesCombo.includes('root');
  let shapeName = hasRoot ? CH[ct].s : getDrop2ShapeName(ivsCombo);
  if (shapeName === 'drop2') shapeName = ''; 
  
  const d2Name = 'combo' + idx;
  const d2Label = rolesCombo.map(r => qualDeg(r, ch.iv[ch.r.indexOf(r)])).join('-');
  let comboRootName = hasRoot ? spellRoot(rs) : spellNote(rs, ivsCombo[0], rolesCombo[0], namingMode === 'flat');
  
  const fullLabel = shapeName ? `${comboRootName} ${shapeName} (${d2Label})` : `${comboRootName} (${d2Label})`;
  v.push(...genDrop2Voicings(ct, rs, sg, rolesCombo, d2Name, fullLabel));
});
if(v.length>1 && guitarSortMode === 'fretboard'){
  const seedIdx=v.findIndex(x=>x.name==='Root'&&x.d2Name==='combo0');
  v = genericProxSort(v, seedIdx >= 0 ? seedIdx : 0);
}
return{group:sg,voicings:v}})}

function buildDrop2List(ct,rs){
  const sec=document.getElementById('drop2ListSec'),tags=document.getElementById('drop2ListTags');
  if(!isDrop2Chord(ct)){sec.style.display='none';return}
  const ch=CH[ct];
  tags.innerHTML='';
  const keptRoles=getShellKeptRoles();
  const makeBtn=(htmlContent,d2Name,roles,cls)=>{
    const sp=document.createElement('span');
    sp.className='triad-list-tag '+cls;
    sp.innerHTML=htmlContent;
    if(keptRoles&&!roles.every(r=>keptRoles.has(r)))sp.style.opacity='0.3';
    sp.onclick=()=>{
      if(guitarDiagMode!=='drop2'){setGuitarDiagMode('drop2', false)}
      jumpToDrop2Voicing('Root',d2Name);
      const ac=initAudio(),now=ac.currentTime;
      const ivsToPlay=[];
      roles.forEach(tr=>{const idx=ch.r.indexOf(tr);if(idx!==-1&&(!keptRoles||keptRoles.has(tr)))ivsToPlay.push(ch.iv[idx])});
      const semis=playSrc==='guitar'?guitarMidi():ivsToPlay.map(iv=>12*(3+octShift)+rs+iv);
      if(semis&&semis.length){stopAll(true);aK(semis,false);previewVoicingOnPiano(semis, roles[0], rs, ch);semis.forEach((s,si)=>pT(s,now+si*.008,2.5,ac))}
    };
    tags.appendChild(sp);
  };
  const combos = getDrop2Combinations(ch.r, 4);
  combos.forEach((rolesCombo, idx) => {
    const d2Name = 'combo' + idx;
    const d2Label = rolesCombo.map(r => qualDeg(r, ch.iv[ch.r.indexOf(r)])).join('-');
    const baseCls = RC[rolesCombo[0]] || 'pr';
    const pill = getExtPill(rolesCombo);
    
    const ivsCombo = rolesCombo.map(r => ch.iv[ch.r.indexOf(r)]);
    const hasRoot = rolesCombo.includes('root');
    let shapeName = hasRoot ? CH[ct].s : getDrop2ShapeName(ivsCombo);
    if(shapeName === 'drop2') shapeName = ''; 
    
    let comboRootName = hasRoot ? spellRoot(rs) : spellNote(rs, ivsCombo[0], rolesCombo[0], namingMode === 'flat');
    
    const textLabel = labelMode === 'notes' 
        ? (shapeName ? `${comboRootName} ${shapeName} (${d2Label})` : `${comboRootName} (${d2Label})`) 
        : d2Label;
        
    const finalHtml = `${textLabel} ${pill}`;
    makeBtn(finalHtml, d2Name, rolesCombo, baseCls);
  });
  sec.style.display='flex';
}

let guitarDiagMode='triads';

function setGuitarDiagMode(m, autoPlay=true){
  guitarDiagMode=m;
  userPreferredTab=m;
  document.getElementById('gTabTriads')?.classList.toggle('on',m==='triads');
  document.getElementById('gTabShells')?.classList.toggle('on',m==='shells');
  document.getElementById('gTabDrop2')?.classList.toggle('on',m==='drop2');
  document.getElementById('gTabProgs')?.classList.toggle('on',m==='progs');
  if(cur){
    buildGuitar(cur.type,cur.rootSemi);
    if(quiz && document.getElementById('quizView').style.display !== 'none') {
      generate();
      return; 
    }
    if(autoPlay && currentInstrument === 'guitar') {
      stopAll(true);
      const semis = guitarMidi();
      if(semis.length){
        const ac = initAudio(), now = ac.currentTime;
        semis.forEach((s,i)=>pT(s,now+i*.008,2.5,ac));
        aK(semis, false);
        previewVoicingOnPiano(semis, 'root', cur.rootSemi, cur.ch);
      }
    }
  }
}

const DEG_COLORS={'R':{bg:'#D85A30'},'3':{bg:'#378ADD'},'5':{bg:'#639922'},'7':{bg:'#BA7517'},'9':{bg:'#7F77DD'},'11':{bg:'#1D9E75'},'13':{bg:'#D4537E'},'4':{bg:'#1D9E75'},'2':{bg:'#7F77DD'},root:{bg:'#D85A30'},'3rd':{bg:'#378ADD'},'5th':{bg:'#639922'},'7th':{bg:'#BA7517'},'9th':{bg:'#7F77DD'},'11th':{bg:'#1D9E75'},'13th':{bg:'#D4537E'},'4th':{bg:'#1D9E75'},'2nd':{bg:'#7F77DD'}};

const RS2={root:'R','3rd':'3','5th':'5','7th':'7','9th':'9','11th':'11','13th':'13','4th':'4','2nd':'2'};
let ctd=[],sgi=[0,0,0];

const HL=['lroot','l3','l5','l7','l9','l11','l13','ld'];

function buildPiano(){
  const c=document.getElementById('pianoKeys');c.innerHTML='';
  const ch=cur?cur.ch:null;
  const rootSemi=cur?cur.rootSemi:0;
  const baseMidi=12*(3+octShift);
  const rootMidi=cur?baseMidi+rootSemi:60;
  const activeMidis=ch?pianoV(rootSemi,cur.iv):[];
  const PIANO_START=21, PIANO_END=108;
  const allNotes=[];
  for(let m=PIANO_START;m<=PIANO_END;m++){
    const semi=m%12,isBlk=IS_BLACK.has(semi);
    let ci=-1;
    if(ch){
      const pc=(m-rootMidi+144)%12;
      ci=ch.iv.findIndex(v=>(v%12)===pc);
    }
    let isActive = activeMidis.includes(m);
    allNotes.push({midi:m,semi,isBlack:isBlk,chordIdx:ci,isActive});
  }
  const whiteNotes=allNotes.filter(n=>!n.isBlack);
  const blackNotes=allNotes.filter(n=>n.isBlack);
  window.pianoKeyScale = window.pianoKeyScale || 1;
  const baseKW=window.innerWidth<=1000?32:42, baseBKW=window.innerWidth<=1000?20:26;
  const inner=document.createElement('div');
  inner.className='piano-inner';
  inner.style.setProperty('--kw', (baseKW * window.pianoKeyScale) + 'px');
  inner.style.setProperty('--bkw', (baseBKW * window.pianoKeyScale) + 'px');
  inner.style.width = (whiteNotes.length * baseKW * window.pianoKeyScale) + 'px';
  whiteNotes.forEach((n,i)=>{
    const k=document.createElement('div');k.className='wk';
    k.dataset.semi=n.semi;k.dataset.midi=n.midi;
    k.style.left=`calc(var(--kw) * ${i})`; k.style.width='var(--kw)';
    let lblTxt = ND_name(n.semi);
    if(labelMode==='degrees'){lblTxt=(n.isActive&&ch&&n.chordIdx!==-1)?qualDeg(ch.r[n.chordIdx],ch.iv[n.chordIdx]):qualDeg('generic',(n.midi-rootMidi+144)%12);}
    const isQuizActive = quiz && document.getElementById('quizView').style.display !== 'none' && !quizAnswered;
    if (isQuizActive) lblTxt = '';
    if(n.isActive&&ch&&n.chordIdx!==-1){
      if(isQuizActive) { k.classList.add('quiz-hl'); }
      else { k.classList.add(LC[ch.r[n.chordIdx]]||'lroot'); }
    }
    const lbl=document.createElement('div');lbl.className='piano-note-label';
    lbl.textContent=lblTxt;k.appendChild(lbl);
    k.addEventListener('mousedown',e=>{e.preventDefault();pkP(k)});
    k.addEventListener('touchstart',e=>{e.preventDefault();pkP(k)},{passive:false});
    inner.appendChild(k);
  });
  blackNotes.forEach(n=>{
    let wIdx=-1;
    for(let i=0;i<whiteNotes.length;i++){if(whiteNotes[i].midi<n.midi&&(i+1>=whiteNotes.length||whiteNotes[i+1].midi>n.midi)){wIdx=i;break}}
    if(wIdx===-1)return;
    const k=document.createElement('div');k.className='bk';
    k.dataset.semi=n.semi;k.dataset.midi=n.midi;
    k.style.left=`calc(var(--kw) * ${wIdx+1} - (var(--bkw) / 2))`; k.style.width='var(--bkw)';
    let lblTxt = ND_name(n.semi);
    if(labelMode==='degrees'){lblTxt=(n.isActive&&ch&&n.chordIdx!==-1)?qualDeg(ch.r[n.chordIdx],ch.iv[n.chordIdx]):qualDeg('generic',(n.midi-rootMidi+144)%12);}
    const isQuizActive = quiz && document.getElementById('quizView').style.display !== 'none' && !quizAnswered;
    if (isQuizActive) lblTxt = '';
    if(n.isActive&&ch&&n.chordIdx!==-1){
      if(isQuizActive) { k.classList.add('quiz-hl'); }
      else { k.classList.add(LC[ch.r[n.chordIdx]]||'lroot'); }
    }
    const lbl=document.createElement('div');lbl.className='piano-note-label';
    lbl.textContent=lblTxt;k.appendChild(lbl);
    k.addEventListener('mousedown',e=>{e.preventDefault();e.stopPropagation();pkP(k)});
    k.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();pkP(k)},{passive:false});
    inner.appendChild(k);
  });
  c.appendChild(inner);
      requestAnimationFrame(()=>{
        syncPianoThumb();
      });
    }

function centerPianoOnChord(){
  const wrap=document.getElementById('pianoWrap');if(!wrap)return;
  
  // Now includes .quiz-hl so it can find and center on hidden quiz chords!
  const highlighted=wrap.querySelectorAll('.lroot,.l3,.l5,.l7,.l9,.l11,.l13,.ld,.quiz-hl');
  
  if(!highlighted.length)return;
  let minL=Infinity,maxR=0;
  highlighted.forEach(k=>{const l=parseFloat(k.style.left)||0;const w=parseFloat(k.style.width)||42;if(l<minL)minL=l;if(l+w>maxR)maxR=l+w});
  const center=(minL+maxR)/2;
  wrap.scrollLeft=center-wrap.clientWidth/2;
  requestAnimationFrame(syncPianoThumb);
}

    /* Custom scrollbar sync */

function syncPianoThumb(){
  const wrap=document.getElementById('pianoWrap');
  const track=document.getElementById('pianoTrack');
  const thumb=document.getElementById('pianoThumb');
  if(!wrap||!track||!thumb)return;
  const inner=wrap.querySelector('.piano-inner');
  if(!inner)return;
  const contentW=inner.offsetWidth;
  const viewW=wrap.clientWidth;
  if(contentW<=viewW){track.style.display='none';return;}
  track.style.display='block';
  const trackW=track.clientWidth;
  const ratio=viewW/contentW;
  const thumbW=Math.max(40,ratio*trackW);
  thumb.style.width=thumbW+'px';
  const maxScroll=contentW-viewW;
  const scrollRatio=maxScroll>0?wrap.scrollLeft/maxScroll:0;
  const maxThumbLeft=trackW-thumbW;
  thumb.style.left=(scrollRatio*maxThumbLeft)+'px';
}

(function(){
  // Sync thumb when piano scrolls (wheel, touch, etc)
  let ticking=false;
  document.addEventListener('DOMContentLoaded',()=>{
    const wrap=document.getElementById('pianoWrap');
    if(wrap)wrap.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{syncPianoThumb();ticking=false})}});
  });
  // Also bind immediately in case DOM is already loaded
  setTimeout(()=>{
    const wrap=document.getElementById('pianoWrap');
    if(wrap)wrap.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{syncPianoThumb();ticking=false})}});
  },0);

  // Drag thumb
  let dragging=false,dragX=0,dragLeft=0;
  document.addEventListener('mousedown',function(e){
    if(e.target.id==='pianoThumb'){e.preventDefault();dragging=true;dragX=e.clientX;dragLeft=parseFloat(e.target.style.left)||0;e.target.classList.add('dragging');document.body.style.cursor='grabbing';document.body.style.userSelect='none'}
  });
  document.addEventListener('mousemove',function(e){
    if(!dragging)return;e.preventDefault();
    const dx=e.clientX-dragX;
    const track=document.getElementById('pianoTrack');
    const thumb=document.getElementById('pianoThumb');
    const wrap=document.getElementById('pianoWrap');
    const inner=wrap.querySelector('.piano-inner');
    if(!track||!thumb||!inner)return;
    const trackW=track.clientWidth;
    const thumbW=thumb.offsetWidth;
    const maxThumbLeft=trackW-thumbW;
    const newLeft=Math.max(0,Math.min(dragLeft+dx,maxThumbLeft));
    thumb.style.left=newLeft+'px';
    const ratio=maxThumbLeft>0?newLeft/maxThumbLeft:0;
    const maxScroll=inner.offsetWidth-wrap.clientWidth;
    wrap.scrollLeft=ratio*maxScroll;
  });
  document.addEventListener('mouseup',function(){
    if(dragging){dragging=false;const thumb=document.getElementById('pianoThumb');if(thumb)thumb.classList.remove('dragging');document.body.style.cursor='';document.body.style.userSelect=''}
  });

  // Touch drag
  document.addEventListener('touchstart',function(e){
    if(e.target.id==='pianoThumb'){dragging=true;dragX=e.touches[0].clientX;dragLeft=parseFloat(e.target.style.left)||0;e.target.classList.add('dragging')}
  },{passive:true});
  document.addEventListener('touchmove',function(e){
    if(!dragging)return;
    const dx=e.touches[0].clientX-dragX;
    const track=document.getElementById('pianoTrack');
    const thumb=document.getElementById('pianoThumb');
    const wrap=document.getElementById('pianoWrap');
    const inner=wrap.querySelector('.piano-inner');
    if(!track||!thumb||!inner)return;
    const trackW=track.clientWidth;
    const thumbW=thumb.offsetWidth;
    const maxThumbLeft=trackW-thumbW;
    const newLeft=Math.max(0,Math.min(dragLeft+dx,maxThumbLeft));
    thumb.style.left=newLeft+'px';
    const ratio=maxThumbLeft>0?newLeft/maxThumbLeft:0;
    const maxScroll=inner.offsetWidth-wrap.clientWidth;
    wrap.scrollLeft=ratio*maxScroll;
  },{passive:true});
  document.addEventListener('touchend',function(){
    if(dragging){dragging=false;const thumb=document.getElementById('pianoThumb');if(thumb)thumb.classList.remove('dragging')}
  });

  // Click on track to jump
  document.addEventListener('click',function(e){
    if(e.target.id==='pianoTrack'){
      const rect=e.target.getBoundingClientRect();
      const clickX=e.clientX-rect.left;
      const ratio=clickX/rect.width;
      const wrap=document.getElementById('pianoWrap');
      const inner=wrap.querySelector('.piano-inner');
      if(!inner)return;
      const maxScroll=inner.offsetWidth-wrap.clientWidth;
      wrap.scrollLeft=ratio*maxScroll;
      syncPianoThumb();
    }
  });
})();

function pkP(el){pSN(parseInt(el.dataset.midi));el.classList.add('key-flash');setTimeout(()=>el.classList.remove('key-flash'),300)}
function getShellDropped(){if(voiceMode!=='shell'||!cur||!cur.ch)return new Set();
const ivs=cur.iv,roles=cur.roles;const altered=new Set();ivs.forEach((iv,i)=>{const pc=iv%12;const r=roles[i];if(r==='5th'&&(pc===6||pc===8))altered.add(i);if(r==='9th'&&(pc===1||pc===3))altered.add(i);if(r==='11th'&&pc===6)altered.add(i);if(r==='13th'&&(pc===8||pc===10))altered.add(i)});const keep=new Set();ivs.forEach((iv,i)=>{const r=roles[i];if(r==='root'||r==='3rd'||r==='4th'||r==='2nd'||r==='7th')keep.add(i)});const ext=['13th','11th','9th'];for(const e of ext){const idx=roles.indexOf(e);if(idx!==-1){keep.add(idx);break}}altered.forEach(i=>keep.add(i));const dropped=new Set();ivs.forEach((iv,i)=>{if(!keep.has(i))dropped.add(i)});return dropped}

function getShellKeptRoles(){
if(voiceMode!=='shell'||!cur||!cur.ch)return null;
const dropped=getShellDropped();const kept=new Set();cur.roles.forEach((r,i)=>{if(!dropped.has(i))kept.add(r)});return kept}
function buildPills(names,roles){
  const r=document.getElementById('notePills');r.innerHTML='';
  const dropped=getShellDropped();
  let breakAfter = (names.length === 5 || names.length === 6) ? 3 : (names.length === 7 ? 4 : -1);
  names.forEach((n,i)=>{
    const p=document.createElement('div');p.className='npill';
    if(dropped.has(i))p.style.opacity='0.3';
    const m=60+cur.rootSemi+cur.iv[i];
    p.onclick=()=>{pSN(m);p.querySelector('.npill-name').classList.add('ring');setTimeout(()=>p.querySelector('.npill-name').classList.remove('ring'),400)};
    p.innerHTML=`<div class="npill-name ${RC[roles[i]]||''}">${n}</div><div class="npill-role">${roles[i]}</div>`;
    r.appendChild(p);
    if (i + 1 === breakAfter) {
      const brk = document.createElement('div');
      brk.style.flexBasis = '100%'; brk.style.height = '0';
      r.appendChild(brk);
    }
  });
}

function previewVoicingOnPiano(semis, role, rootSemi, chDef) {
  progClearPiano();
  progFadeOutMain();
  const keys=document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk');
  // Grab the correct color based on the role, fallback to root (orange)
  const col = (typeof DEG_BG !== 'undefined' && DEG_BG[role]) ? DEG_BG[role] : ['#D85A30','#B84420'];
  
  semis.forEach(m=>{keys.forEach(k=>{if(parseInt(k.dataset.midi)===m){k.style.transition='none';k.style.background=col[0];k.style.borderColor=col[1];k.dataset.progHl='1';const lbl=k.querySelector('.piano-note-label');if(lbl){lbl.style.transition='none';lbl.style.setProperty('color', '#FFFFFF', 'important');}}})});
  
  if(progChordPreviewTimer) clearTimeout(progChordPreviewTimer);
  progChordPreviewTimer = setTimeout(()=>{
    progChordPreviewTimer=null;
    progClearPiano();
    if(cur) buildPiano();
  }, 2500);
}

function buildTriadList(ct,rs){
  const sec=document.getElementById('triadListSec'),tags=document.getElementById('triadListTags');
  const triads=findTriads(ct);
  if(!triads.length){sec.style.display='none';return}
  tags.innerHTML='';
  const keptRoles=getShellKeptRoles();
  triads.forEach(t=>{
    const rootName=spellNote(rs,t.triadRootInterval,t.triadRootRole,namingMode==='flat');
    const formula = t.triadDef.roles.map((r, i) => qualDeg(r, t.triadDef.iv[i])).join('-');
    const pill = getExtPill(t.parentRoles);
    const btnLabel = labelMode === 'notes' ? `${rootName} ${t.triadAbbr}` : formula;
    const sp=document.createElement('span');
    sp.className='triad-list-tag '+(RC[t.triadRootRole]||'');
    sp.innerHTML=`${btnLabel} ${pill}`;
    if(keptRoles&&!t.parentRoles.every(r=>keptRoles.has(r)))sp.style.opacity='0.3';
    sp.onclick=()=>{
      if(guitarDiagMode!=='triads'){setGuitarDiagMode('triads', false)}
      jumpToTriadVoicing(t.triadAbbr, t.triadRootRole, 'Root');
      const ac=initAudio(),now=ac.currentTime;
      const semis = playSrc === 'guitar' ? guitarMidi() : t.triadDef.iv.map(iv=>12*(3+octShift)+rs+t.triadRootInterval+iv);
      if(semis && semis.length){
        stopAll(true);aK(semis,false);
        previewVoicingOnPiano(semis, t.triadRootRole, rs, CH[ct]);
        semis.forEach((s,i)=>pT(s,now+i*.008,2.5,ac));
      }
    };
    tags.appendChild(sp);
  });
  sec.style.display='flex';
}

function buildShellList(ct,rs){
  const sec=document.getElementById('shellListSec'),tags=document.getElementById('shellListTags');
  const shells=getShellNotes(ct);
  if(!shells||!shells.length){sec.style.display='none';return}
  
  const validShells = new Set();
  buildGS(ct, rs).forEach(group => group.voicings.forEach(v => {
    if (v && v.shellLabel) validShells.add(v.shellLabel);
  }));
  
  const playableShells = shells.filter(sh => validShells.has(sh.label));
  if(!playableShells.length){sec.style.display='none';return}
  
  tags.innerHTML='';
  playableShells.forEach(sh=>{
    const sp=document.createElement('span');
    const baseRole = sh.parentRoles[0];
    sp.className='triad-list-tag '+(RC[baseRole]||'pr');
    const pill = getExtPill(sh.parentRoles);
    
    const ivsCombo = sh.parentRoles.map(r => CH[ct].iv[CH[ct].r.indexOf(r)]);
    const hasRoot = sh.parentRoles.includes('root');
    let shapeName = hasRoot ? '' : getShellShapeName(ivsCombo);
    
    let comboRootName = hasRoot ? (spellRoot(rs) + ' ' + CH[ct].s) : spellNote(rs, ivsCombo[0], baseRole, namingMode === 'flat');
    const d2Label = sh.parentRoles.map(r => qualDeg(r, CH[ct].iv[CH[ct].r.indexOf(r)])).join('-');
    
    const labelText = labelMode === 'notes' 
        ? (shapeName ? `${comboRootName} ${shapeName} (${d2Label})` : `${comboRootName} (${d2Label})`) 
        : d2Label;
        
    sp.innerHTML = `${labelText} ${pill}`;
    sp.title=sh.parentRoles.join(' + ');
    sp.onclick=()=>{
      if(guitarDiagMode!=='shells'){setGuitarDiagMode('shells', false)}
      jumpToShellVoicing(sh.label);
      const ac=initAudio(),now=ac.currentTime;
      const semis = playSrc === 'guitar' ? guitarMidi() : sh.iv.map(iv=>12*(3+octShift)+rs+iv);
      if(semis && semis.length){
        stopAll(true);aK(semis,false);
        const baseRole = sh.parentRoles[0];
        previewVoicingOnPiano(semis, baseRole, rs, CH[ct]);
        semis.forEach((s,i)=>pT(s,now+i*.008,2.5,ac));
      }
    };
    tags.appendChild(sp);
  });
  sec.style.display='flex';
}



function jumpToDrop2Voicing(invName,d2Name='combo0'){
  ctd.forEach((sg,gi)=>{
    let idx=sg.voicings.findIndex(v=>v.name===invName&&v.d2Name===d2Name);
    if(idx===-1) idx = sg.voicings.findIndex(v=>v.d2Name===d2Name);
    if(idx!==-1){
      sgi[gi]=idx;
      const ct=document.getElementById('sgC-'+gi);
      if(ct)ct.textContent=(sgi[gi]+1)+'/'+sg.voicings.length;
      const v=sg.voicings[sgi[gi]],info=document.getElementById('sgI-'+gi);
      if(info){info.innerHTML=sgInfoHtml(v,sg)}
      const sl=document.getElementById('sgL-'+gi);
      if(sl)sl.innerHTML='STR '+_voicingStrNums(v)+' <span style="font-weight:400;color:var(--txt3);font-size:9px">'+_voicingStrNames(v)+'</span>';
      drawSG(gi)
    }
  });
  bGL()
}

let progTimer=null,activeProg=null,activeProgRoot=null,progChordPreviewTimer=null,progHighlightTimer=null;

function stopProg(skipRebuild = false){
  if(progChordPreviewTimer){clearTimeout(progChordPreviewTimer);progChordPreviewTimer=null}
  if(progHighlightTimer){clearTimeout(progHighlightTimer);progHighlightTimer=null}
  if(progTimer){clearInterval(progTimer);progTimer=null}
  activeProg=null;activeProgRoot=null;
  document.querySelectorAll('.prog-tag').forEach(t=>{t.classList.remove('prog-playing')});
  progClearPiano();
  if(cur && !skipRebuild) buildPiano();
  else progRestoreMain(); /* Puts the colors back if rebuild is skipped! */
}

let uiTimer = null;
function stopAll(skipRebuild = false){
  stopProg(skipRebuild);
  if(loopTimer){clearInterval(loopTimer);loopTimer=null}
  if(uiTimer){clearTimeout(uiTimer);uiTimer=null}
  holdOscs.forEach(h=>{try{h.gain.gain.cancelScheduledValues(audioCtx.currentTime);h.gain.gain.setValueAtTime(h.gain.gain.value,audioCtx.currentTime);h.gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.1);h.osc.stop(audioCtx.currentTime+.15);setTimeout(()=>{try{h.gain.disconnect()}catch(e){}},200)}catch(e){}});
  holdOscs=[];
  activeNodes.forEach(n=>{try{n.osc.stop(audioCtx?audioCtx.currentTime+.05:0);n.gain.disconnect()}catch(e){}});
  activeNodes=[];
  const pd = document.getElementById('pdot');
  if(pd) pd.classList.remove('on');
  const tsb = document.getElementById('topStopBtn');
  if(tsb) tsb.style.display='none';
  updateFabState(false);
}
// ── Voice Leading Engine ──
// Jazz piano style: bass (root) separate from upper structure.
// Bass: root in low register, free to leap 4ths/5ths.
// Upper: guide tones voice-led with minimal motion, common tones pinned.
// Rules: no 2nd intervals between adjacent voices, consistent voicing
// width across the progression, low end spread / high end can cluster.

function _vlCands(pc,lo,hi){
  const c=[];
  for(let oct=1;oct<=7;oct++){const m=pc+oct*12;if(m>=lo&&m<=hi)c.push(m)}
  return c;
}

function _vlClosest(cands,target){
  let b=null,bd=Infinity;
  for(const m of cands){const d=Math.abs(m-target);if(d<bd){bd=d;b=m}}
  return{m:b,d:bd};
}


function _vlSpacingCost(notes){
  return 0;
}

function vlStep(prev,newRootSemi,newChDef,prevRootSemi,prevChDef,forceBass){
  let newIvs=newChDef.iv,newRoles=newChDef.r;
  if(voiceMode==='shell'){const sf=shellFilter(newIvs,newRoles);newIvs=sf.ivs;newRoles=sf.roles}
  const noteCount=newIvs.length;

  // ── TRIADS in pure-triad progressions: voice-lead all notes together ──
  if(noteCount<=3&&!forceBass){
    const prevSorted=[...prev].sort((a,b)=>a-b);
    const prevCenter=prevSorted.reduce((a,b)=>a+b,0)/prevSorted.length;
    const prevLo=prevSorted[0],prevHi=prevSorted[prevSorted.length-1];
    const tLo=Math.max(prevLo-5,48);
    const tHi=Math.min(prevHi+5,72);
    const allPCs=newIvs.map(iv=>(newRootSemi+iv)%12);
    const result=[];
    const usedPrev=new Set();
    // pin common tones
    for(let i=0;i<allPCs.length;i++){
      for(let pi=0;pi<prevSorted.length;pi++){
        if(usedPrev.has(pi))continue;
        if(prevSorted[pi]%12===allPCs[i]){
          result[i]=prevSorted[pi];usedPrev.add(pi);break;
        }
      }
    }
    // voice-lead the rest to nearest within tight range
    const freePrev=[];
    for(let pi=0;pi<prevSorted.length;pi++){if(!usedPrev.has(pi))freePrev.push(prevSorted[pi])}
    for(let i=0;i<allPCs.length;i++){
      if(result[i]!==undefined)continue;
      let cands=_vlCands(allPCs[i],tLo,tHi);
      if(!cands.length)cands=_vlCands(allPCs[i],tLo-6,tHi+6);
      if(!cands.length)cands=_vlCands(allPCs[i],48,72);
      if(!cands.length)continue;
      if(freePrev.length){
        let bestM=null,bestD=Infinity;
        for(const fp of freePrev){const c=_vlClosest(cands,fp);if(c.d<bestD){bestD=c.d;bestM=c.m}}
        result[i]=bestM;
        const fpi=freePrev.indexOf(freePrev.find(fp=>Math.abs(fp-bestM)===bestD));
        if(fpi!==-1)freePrev.splice(fpi,1);
      } else {
        result[i]=_vlClosest(cands,prevCenter).m;
      }
    }
    // fallback
    for(let i=0;i<allPCs.length;i++){
      if(result[i]===undefined)result[i]=_vlClosest(_vlCands(allPCs[i],tLo,tHi),prevCenter).m||(allPCs[i]+60);
    }
    result.sort((a,b)=>a-b);
    // fix unisons: try octave down first
    for(let i=1;i<result.length;i++){
      if(result[i]===result[i-1]){
        if(result[i]-12>=48)result[i]-=12;
        else result[i]+=12;
        result.sort((a,b)=>a-b);
      }
    }
    return result;
  }




  // ── 4+ NOTES: bass separated, upper voices voice-led ──
  const prevSorted=[...prev].sort((a,b)=>a-b);
  const prevBass=prevSorted[0];
  const prevUpper=prevSorted.slice(1);
  const prevUpperCenter=prevUpper.length?prevUpper.reduce((a,b)=>a+b,0)/prevUpper.length:60;

  // ── BASS: root closest to previous bass ──
  const rootPC=newRootSemi%12;
  const bassCands=_vlCands(rootPC,36,55);
  const bass=bassCands.length?_vlClosest(bassCands,prevBass).m:(rootPC+48);

  // ── UPPER VOICES: everything exce pt root ──
  const upperIvs=[],upperPCs=[];
  for(let i=0;i<newIvs.length;i++){
    if(newRoles[i]==='root')continue;
    upperIvs.push(newIvs[i]);
  }
  if(!upperIvs.length)return[bass];

  for(const iv of upperIvs) upperPCs.push((newRootSemi+iv)%12);
  const un=upperPCs.length;

  // target range: fixed band
  const upperLo=55;
  const upperHi=72;

  // ── RESOLUTION PINS: force guide tones to resolve correctly ──
  const resPins=new Map();
  if(prevChDef&&prevRootSemi!==undefined){
    let pIvs=prevChDef.iv,pRoles=prevChDef.r;
    if(voiceMode==='shell'){const sf=shellFilter(pIvs,pRoles);pIvs=sf.ivs;pRoles=sf.roles}
    const isDom=prevChDef.r.includes('7th')&&prevChDef.iv[prevChDef.r.indexOf('7th')]%12===10
      &&prevChDef.r.includes('3rd')&&prevChDef.iv[prevChDef.r.indexOf('3rd')]%12===4;
    if(isDom){
      const rootUp=(newRootSemi-prevRootSemi+12)%12;
      if(rootUp===5||rootUp===1){
        const ltPC=(prevRootSemi+4)%12;
        const ltTarget=(ltPC+1)%12;
        const s7PC=(prevRootSemi+10)%12;
        const s7Target=(s7PC+11)%12;
        if(newIvs.some((iv,i)=>newRoles[i]!=='root'&&(newRootSemi+iv)%12===ltTarget))resPins.set(ltPC,ltTarget);
        if(newIvs.some((iv,i)=>newRoles[i]!=='root'&&(newRootSemi+iv)%12===s7Target))resPins.set(s7PC,s7Target);
      }
    }
  }

  const upperCands=upperPCs.map(pc=>{

    let c=_vlCands(pc,upperLo,upperHi);
    // fallback to wider range if nothing fits
    if(!c.length)c=_vlCands(pc,upperLo-5,upperHi+5);
    if(!c.length)c=_vlCands(pc,48,84);
    return c;
  });

  // ── PIN RESOLUTION TONES first, then common tones ──
  const pinned=new Array(un).fill(null);
  const usedPrev=new Set();
  for(const[fromPC,toPC] of resPins){
    // find the new upper voice that needs this target PC
    const ni=upperPCs.indexOf(toPC);
    if(ni===-1||pinned[ni]!==null)continue;
    // find the prev upper voice that has the source PC
    for(let pi=0;pi<prevUpper.length;pi++){
      if(usedPrev.has(pi))continue;
      if(prevUpper[pi]%12===fromPC){
        // resolve by half step from where it was
        const target=fromPC===toPC?prevUpper[pi]:
          toPC===(fromPC+1)%12?prevUpper[pi]+1:prevUpper[pi]-1;
        if(target>=upperLo-3&&target<=upperHi+3){
          pinned[ni]=target;usedPrev.add(pi);break;
        }
      }
    }
  }

  for(let i=0;i<un;i++){
    for(let pi=prevUpper.length-1;pi>=0;pi--){
      if(usedPrev.has(pi))continue;
      if(prevUpper[pi]%12===upperPCs[i]){
        // only pin if it's within our target range
        if(prevUpper[pi]>=upperLo-3&&prevUpper[pi]<=upperHi+3){
          pinned[i]=prevUpper[pi];usedPrev.add(pi);break;
        }
      }
    }
  }

  // ── VOICE-LEAD REMAINING UPPER VOICES ──
  const unpinned=[];
  for(let i=0;i<un;i++){if(pinned[i]===null)unpinned.push(i)}
  const freePrev=[];
  for(let pi=0;pi<prevUpper.length;pi++){if(!usedPrev.has(pi))freePrev.push(prevUpper[pi])}

  const upper=[...pinned];

  if(unpinned.length===1){
    const ni=unpinned[0];
    if(freePrev.length){
      let bestM=null,bestD=Infinity;
      for(const fp of freePrev){const c=_vlClosest(upperCands[ni],fp);if(c.d<bestD){bestD=c.d;bestM=c.m}}
      upper[ni]=bestM;
    } else {
      upper[ni]=_vlClosest(upperCands[ni],prevUpperCenter).m;
    }
  } else if(unpinned.length>1){
    // brute-force with combined cost: voice-leading motion + spacing quality
    let bestCost=Infinity;
    const bestR=new Array(unpinned.length).fill(null);
    const search=(ui,usedT,cur,cost)=>{
      if(cost>=bestCost)return;
      if(ui===unpinned.length){
        const allPlaced=[];
        for(let i=0;i<un;i++){if(pinned[i]!==null)allPlaced.push(pinned[i])}
        for(let j=0;j<unpinned.length;j++){if(cur[j]!==null)allPlaced.push(cur[j])}
        const ctr=allPlaced.length?allPlaced.reduce((a,b)=>a+b,0)/allPlaced.length:prevUpperCenter;
        let extra=0;
        const finals=[...cur];
        for(let j=0;j<unpinned.length;j++){
          if(finals[j]===null){
            const c=_vlClosest(upperCands[unpinned[j]],ctr);
            finals[j]=c.m;extra+=c.d;
          }
        }
        // add spacing penalty
        const testAll=[...finals];
        for(let i=0;i<un;i++){if(pinned[i]!==null)testAll.push(pinned[i])}
        testAll.sort((a,b)=>a-b);
        extra+=_vlSpacingCost(testAll);
        if(cost+extra<bestCost){
          bestCost=cost+extra;
          for(let j=0;j<unpinned.length;j++)bestR[j]=finals[j];
        }
        return;
      }
      const ni=unpinned[ui];
      for(let ti=0;ti<freePrev.length;ti++){
        if(usedT.has(ti))continue;
        const c=_vlClosest(upperCands[ni],freePrev[ti]);
        if(c.m!==null&&cost+c.d<bestCost){
          usedT.add(ti);cur[ui]=c.m;
          search(ui+1,usedT,cur,cost+c.d);
          usedT.delete(ti);cur[ui]=null;
        }
      }
      if(unpinned.length>freePrev.length){
        cur[ui]=null;
        search(ui+1,usedT,cur,cost);
      }
    };
    search(0,new Set(),new Array(unpinned.length).fill(null),0);
    for(let j=0;j<unpinned.length;j++)upper[unpinned[j]]=bestR[j];
  }

  // fallback
  for(let i=0;i<un;i++){
    if(upper[i]===null)upper[i]=_vlClosest(upperCands[i],prevUpperCenter).m||(upperPCs[i]+60);
  }

  // fix unisons
  upper.sort((a,b)=>a-b);
  for(let i=1;i<upper.length;i++){if(upper[i]===upper[i-1])upper[i]+=12}

  // ── ENSURE BASS-TO-UPPER GAP ──


  upper.sort((a,b)=>a-b);
  if(upper.length&&upper[0]-bass<=4){
    // try dropping bass one octave
    if(bass-12>=36){
      return[bass-12,...upper].sort((a,b)=>a-b);
    }
  }



  return[bass,...upper].sort((a,b)=>a-b);
}




// ── Seed voicing for progressions ──
// Builds voicings bottom-up to explicitly force the 7th/extensions to the top voice.
function _progSeed(rootSemi,chDef,forceBass){
  let ivs=chDef.iv,roles=chDef.r;
  if(voiceMode==='shell'){const sf=shellFilter(ivs,roles);ivs=sf.ivs;roles=sf.roles}
  const rootPC=rootSemi%12;
  const noteCount=ivs.length;
  
  if(noteCount<=3&&!forceBass){
    const all=[];
    let currentPitch = rootPC + 60;
    if (currentPitch > 65) currentPitch -= 12;
    for(let i=0;i<ivs.length;i++){
       const pc=(rootSemi+ivs[i])%12;
       let pitch = pc;
       while(pitch < currentPitch && all.length > 0) pitch += 12;
       if(all.length===0) pitch = currentPitch; 
       all.push(pitch);
       currentPitch = pitch + 1;
    }
    return all;
  }
  
  const bassCands=_vlCands(rootPC,36,47);
  const bass=bassCands.length?bassCands[0]:(rootPC+36);
  const upper=[];
  
  let currentPitch = 55; 
  for(let i=0;i<ivs.length;i++){
    if(roles[i]==='root')continue;
    const pc=(rootSemi+ivs[i])%12;
    let pitch = pc;
    while(pitch < currentPitch) pitch += 12;
    upper.push(pitch);
    currentPitch = pitch + 1;
  }
  
  if (upper.length && upper[upper.length-1] > 76) {
     for(let i=0;i<upper.length;i++) upper[i] -= 12;
  }
  
  return [bass, ...upper].sort((a,b)=>a-b);
}



// ── Pre-plan all voicings for a progression ──
// Start from a bass-separated seed, then voice-lead
// outward in both directions so every chord knows context.
function planProgVoicings(prog,rootSemi){
  const voicings=new Array(prog.chords.length);
  // Force bass separation for all progressions, including simple triads
  const hasBigChord=true;
  const mainCh=prog.chords[prog.cur];
  const mainDef=CH[mainCh.t];
  const mainRoot=(rootSemi+mainCh.d)%12;
  voicings[prog.cur]=_progSeed(mainRoot,mainDef,hasBigChord);
  // voice-lead backwards from main chord
  for(let i=prog.cur-1;i>=0;i--){
    const ch=prog.chords[i],cd=CH[ch.t];if(!cd)continue;
    const nextCh=prog.chords[i+1],nextCd=CH[nextCh.t];
    voicings[i]=vlStep(voicings[i+1],(rootSemi+ch.d)%12,cd,(rootSemi+nextCh.d)%12,nextCd,hasBigChord);
  }
  // voice-lead forwards from main chord
  for(let i=prog.cur+1;i<prog.chords.length;i++){
    const ch=prog.chords[i],cd=CH[ch.t];if(!cd)continue;
    const prevCh=prog.chords[i-1],prevCd=CH[prevCh.t];
    voicings[i]=vlStep(voicings[i-1],(rootSemi+ch.d)%12,cd,(rootSemi+prevCh.d)%12,prevCd,hasBigChord);
  }

  return voicings;
}


const PROG_DEG_MAP={0:'root',1:'9th',2:'9th',3:'3rd',4:'3rd',5:'11th',6:'11th',7:'5th',8:'13th',9:'13th',10:'7th',11:'7th'};
const PROG_DEG_COLORS={root:['#D85A30','#B84420'],'3rd':['#378ADD','#2070C0'],'5th':['#639922','#4D7A15'],'7th':['#BA7517','#9A6010'],'9th':['#7F77DD','#6560C0'],'11th':['#1D9E75','#158060'],'13th':['#D4537E','#B84065']};
function progFuncColor(d){const deg=PROG_DEG_MAP[d%12]||'root';return PROG_DEG_COLORS[deg]||PROG_DEG_COLORS.root}




function progFadeOutMain(){
  const keys=document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk');
  keys.forEach(k=>{const hasHL=HL.some(cls=>k.classList.contains(cls));if(hasHL){if(!k.dataset.mainFaded)k.dataset.origClass=k.className;k.style.transition='none';HL.forEach(cls=>k.classList.remove(cls));k.style.background='';k.style.borderColor='';k.dataset.mainFaded='1';const lbl=k.querySelector('.piano-note-label');if(lbl){if(!k.dataset.origLblColor)k.dataset.origLblColor=lbl.style.color||'';lbl.style.transition='none';lbl.style.removeProperty('color')}}})}
function progRestoreMain(){
  const keys=document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk');
  keys.forEach(k=>{if(k.dataset.mainFaded){k.style.transition='none';if(k.dataset.origClass){k.className=k.dataset.origClass;delete k.dataset.origClass}delete k.dataset.mainFaded;const lbl=k.querySelector('.piano-note-label');if(lbl){lbl.style.transition='none';if(k.dataset.origLblColor){lbl.style.color=k.dataset.origLblColor;delete k.dataset.origLblColor}else{lbl.style.removeProperty('color')}}}})}
const DEG_BG={root:['#D85A30','#B84420'],'3rd':['#378ADD','#2070C0'],'5th':['#639922','#4D7A15'],'7th':['#BA7517','#9A6010'],'9th':['#7F77DD','#6560C0'],'11th':['#1D9E75','#158060'],'13th':['#D4537E','#B84065'],'4th':['#1D9E75','#158060'],'2nd':['#7F77DD','#6560C0'],dim:['#D4537E','#B84065']};
function progHighlightPiano(semis,chD,isMainChord,cRoot,chDef){
  progClearPiano();
  progFadeOutMain();
  const keys=document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk');
  const col=progFuncColor(chD);
  semis.forEach(m=>{keys.forEach(k=>{if(parseInt(k.dataset.midi)===m){k.style.transition='none';k.style.background=col[0];k.style.borderColor=col[1];k.dataset.progHl='1';const lbl=k.querySelector('.piano-note-label');if(lbl){lbl.style.transition='none';lbl.style.setProperty('color', '#FFFFFF', 'important');}}})});}

function progClearPiano(){
  progChordPreviewTimer=null;
  const keys=document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk');
  keys.forEach(k=>{
    // Only remove the highlight colors, NOT the positioning!
    k.style.removeProperty('background');
    k.style.removeProperty('border-color');
    k.style.removeProperty('transition');
    k.removeAttribute('data-prog-hl');
    const lbl=k.querySelector('.piano-note-label');
    if(lbl) {
      lbl.style.removeProperty('color');
      lbl.style.removeProperty('transition');
    }
  });
}

// --- REPLACE FROM HERE ---
/* Improved animation for note hit feedback */
function animateGuitarCircle(ci) {
  if(!ci) return;
  ci.style.animation = 'none'; // Forcefully kill the current animation
  ci.classList.remove('pop-anim');
  void ci.offsetWidth; // Trigger DOM reflow to restart instantly on spam
  ci.style.animation = ''; // Re-enable animations
  ci.classList.add('pop-anim');
}

function aK(semis,isA){
  const keys=document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk');
  const gNotes=document.querySelectorAll('.string-group.sg-active .guitar-note-hit');
  if(!isA){
    keys.forEach(k=>{
      k.classList.remove('key-flash');
      if(k.flashTimer)clearTimeout(k.flashTimer);
    });
  }
  if(isA){
    semis.forEach((m,i)=>{
      setTimeout(()=>{
        keys.forEach(k=>{
          if(parseInt(k.dataset.midi)===m){
            k.style.transition='none';k.classList.remove('key-flash');void k.offsetWidth;k.style.transition='';k.classList.add('key-flash');
            if(k.flashTimer)clearTimeout(k.flashTimer);
            k.flashTimer=setTimeout(()=>k.classList.remove('key-flash'),300);
          }
        });
        gNotes.forEach(g=>{
          if(parseInt(g.dataset.midi)%12===m%12)animateGuitarCircle(g.querySelector('circle'));
        });
      },i*150);
    });
  }else{
    const pcs=new Set(semis.map(m=>m%12));
    keys.forEach(k=>{
      if(semis.includes(parseInt(k.dataset.midi))){
        k.style.transition='none';k.classList.remove('key-flash');void k.offsetWidth;k.style.transition='';k.classList.add('key-flash');
        if(k.flashTimer)clearTimeout(k.flashTimer);
        k.flashTimer=setTimeout(()=>k.classList.remove('key-flash'),300);
      }
    });
    gNotes.forEach(g=>{
      if(pcs.has(parseInt(g.dataset.midi)%12))animateGuitarCircle(g.querySelector('circle'));
    });
  }
}

function playGuitarNote(midi,el){
  pSN(midi+guitarOctShift());
  animateGuitarCircle(el.querySelector('circle'));
}

function sgN(gi,dir){
  setGuitarSrc(gi); 
  if(linkedNav){
    for(let g=0;g<ctd.length;g++){const vc=ctd[g].voicings.length;if(!vc)continue;sgi[g]=(sgi[g]+dir+vc)%vc;const ct=document.getElementById('sgC-'+g);if(ct)ct.textContent=(sgi[g]+1)+'/'+vc;const v=ctd[g].voicings[sgi[g]],info=document.getElementById('sgI-'+g);if(info){info.innerHTML=sgInfoHtml(v,ctd[g])}const sl=document.getElementById('sgL-'+g);if(sl)sl.innerHTML='STR '+_voicingStrNums(v)+' <span style="font-weight:400;color:var(--txt3);font-size:9px">'+_voicingStrNames(v)+'</span>';drawSG(g)}
  } else {
    const vc=ctd[gi].voicings.length;if(!vc)return;sgi[gi]=(sgi[gi]+dir+vc)%vc;const ct=document.getElementById('sgC-'+gi);if(ct)ct.textContent=(sgi[gi]+1)+'/'+vc;const v=ctd[gi].voicings[sgi[gi]],info=document.getElementById('sgI-'+gi);if(info){info.innerHTML=sgInfoHtml(v,ctd[gi])}const sl=document.getElementById('sgL-'+gi);if(sl)sl.innerHTML='STR '+_voicingStrNums(v)+' <span style="font-weight:400;color:var(--txt3);font-size:9px">'+_voicingStrNames(v)+'</span>';drawSG(gi);
  }
  bGL();

  updateGuitarSrcHighlight();
  if(playSrc==='guitar'){
    stopAll(true);
    const semis=guitarMidi();
    if(semis.length){
      const ac=initAudio(),now=ac.currentTime;
      semis.forEach((s,i)=>pT(s,now+i*.008,2.5,ac));
      aK(semis,false);
      const pd = document.getElementById('pdot');
      if(pd) pd.classList.add('on');
      updateFabState(true);
      uiTimer = setTimeout(()=>{
        if(pd) pd.classList.remove('on');
        updateFabState(false);
      },2600);
    }
  }
}

function playProg(prog,rootSemi){
  if(playSrc !== 'piano') setSrc('piano');
  stopAll(true);
  activeProg=prog;activeProgRoot=rootSemi;const ac=initAudio();const beatDur=60/bpm;const chordDur=beatDur*2;let ci=0;
  const allVoicings=planProgVoicings(prog,rootSemi);
  const play1=()=>{if(ci>=prog.chords.length){stopProg(false);return}
    const ch=prog.chords[ci];const chDef=CH[ch.t];if(!chDef){ci++;return}
    const cRoot=(rootSemi+ch.d)%12;
    const isMain=(ci===prog.cur);
    const rawSemis=allVoicings[ci];
    if(!rawSemis){ci++;return}
    const semis=rawSemis.map(m=>m+(pianoOct-1)*12);
    const keyD=progKeyD(prog);
    progClearPiano();progHighlightPiano(semis,(ch.d-keyD+12)%12,isMain,cRoot,chDef);
    semis.forEach((s,i)=>pT(s,ac.currentTime+i*.008,Math.max(chordDur*0.9,2.0),ac));aK(semis,false);
    document.querySelectorAll('.prog-tag').forEach(t=>{t.classList.remove('prog-playing')});
    const tags=document.querySelectorAll('.prog-tag[data-prog-idx="'+prog._idx+'"]');
    if(tags[ci]){tags[ci].classList.add('prog-playing')}
    ci++};
  play1();progTimer=setInterval(play1,chordDur*1000)
}

function progKeyD(prog){const re=/^I(?![VvIi])|^i(?![VvIi])/;for(const ch of prog.chords){if(re.test(ch.n))return ch.d}return 0}

function buildProgs(ty){
  const s=document.getElementById('progSec'),l=document.getElementById('progList');const p=PR[ty];
  if(!p){s.style.display='none';return}l.innerHTML='';const rootSemi=cur?cur.rootSemi:0;
  p.forEach((prog,pi)=>{
    prog._idx=pi;const keyD=progKeyD(prog);const row=document.createElement('div');row.className='prog-row';
    const playBtn=document.createElement('span');playBtn.className='prog-row-label';playBtn.textContent='▶';playBtn.title='Play progression';
    playBtn.onclick=()=>playProg(prog,rootSemi);row.appendChild(playBtn);
    const allVoicings=planProgVoicings(prog,rootSemi);
    prog.chords.forEach((ch,ci)=>{
      if(ci>0){const arr=document.createElement('span');arr.className='prog-arrow';arr.textContent='→';row.appendChild(arr)}
      const chDef=CH[ch.t];const cRoot=(rootSemi+ch.d)%12;const realName=noteName(cRoot)+' '+(chDef?chDef.s:ch.n);
      const tag=document.createElement('span');tag.className='prog-tag';tag.dataset.progIdx=pi;
      const fc=progFuncColor((ch.d-keyD+12)%12);tag.style.background=fc[0];tag.style.color='white';tag.style.borderColor=fc[1];
      if(ci===prog.cur)tag.classList.add('prog-current');
      tag.innerHTML='<span style="font-size:9px;color:inherit;opacity:.6;margin-right:3px">'+ch.n+'</span>'+realName;

      tag.onclick=()=>{
        if(playSrc !== 'piano') setSrc('piano');
        const ac2=initAudio();
        stopAll(true);
        const cr=(rootSemi+ch.d)%12;const cd=CH[ch.t];if(!cd)return;
        const rawSm=allVoicings[ci];if(!rawSm)return;const sm=rawSm.map(m=>m+(pianoOct-1)*12);
        sm.forEach((ss,i)=>pT(ss,ac2.currentTime+i*.008,2.5,ac2));aK(sm,false);
        progHighlightPiano(sm,(ch.d-keyD+12)%12,(ci===prog.cur),cr,cd);

        document.querySelectorAll('.prog-tag').forEach(t=>{t.classList.remove('prog-playing')});
        const tags=document.querySelectorAll('.prog-tag[data-prog-idx="'+prog._idx+'"]');
        if(tags[ci]){tags[ci].classList.add('prog-playing')}
        progChordPreviewTimer=setTimeout(()=>{progChordPreviewTimer=null;progClearPiano();if(cur)buildPiano();document.querySelectorAll('.prog-tag').forEach(t=>t.classList.remove('prog-playing'))},2500);
      };
      row.appendChild(tag);
    });
    l.appendChild(row);
  });
  s.style.display='flex';
}


function updateStats(){} /* Emptied to cleanly remove stats functionality */

function addHist(rn,lab,ty,rs,fl){} 
function renderHist(){}

function display(){
  if(!cur) return;
  const ch = cur.ch;
  const ri = cur.rootSemi;
  const names = ch.iv.map((iv, i) => spellNote(ri, iv, ch.r[i], namingMode === 'flat'));

  document.getElementById('cRoot').textContent = spellRoot(ri);
  document.getElementById('cType').textContent = ch.l;
  document.getElementById('cFormula').textContent = ch.f;
  
  // Dynamic Inversion Button Visibility
  const invMap = { 'root': 'Root', '1st': '1st', '2nd': '2nd', '3rd': '3rd' };
  document.querySelectorAll('.opt-btn[data-inv]').forEach(btn => {
    const v = btn.dataset.inv;
    const targetName = invMap[v];
    let show = true;

    if (currentInstrument === 'guitar') {
      // Hide button if the current guitar voicing data (ctd) doesn't contain this inversion
      show = ctd.some(sg => sg.voicings.some(vc => vc.name === targetName));
    } else {
      // Piano logic: show based on number of notes in the chord
      const effLen = voiceMode === 'shell' ? shellFilter(ch.iv, ch.r).ivs.length : ch.iv.length;
      show = ['root', '1st', '2nd', '3rd'].indexOf(v) < effLen;
    }

    btn.style.display = show ? 'inline-block' : 'none';
    
    // Auto-reset to Root if the active inversion was just hidden
    if (!show && inv === v) {
        setInv('root', document.querySelector('.opt-btn[data-inv="root"]'));
    }
  });
  
  buildPills(names, ch.r);
  buildTriadList(cur.type, ri);
  buildShellList(cur.type, ri);
  buildDrop2List(cur.type, ri);
  buildPiano();
  buildGuitar(cur.type, ri);
  buildProgs(cur.type);

  document.getElementById('chordView').style.display = 'block';
  document.getElementById('quizView').style.display = 'none';
  
  if (currentInstrument === 'piano') {
    document.getElementById('pianoView').style.display = 'block';
    document.getElementById('guitarView').style.display = 'none';
    document.getElementById('guitarHeaderControls').style.display = 'none';
    document.getElementById('instrLabel').textContent = "PIANO — scroll to explore";
  } else {
    document.getElementById('pianoView').style.display = 'none';
    document.getElementById('guitarView').style.display = 'block';
    document.getElementById('guitarHeaderControls').style.display = 'flex';
    document.getElementById('instrLabel').textContent = "GUITAR — click to play";
  }
  
  document.getElementById('varTabs').style.display = 'flex';
  
  let hasPlayableShells = false;
  const shellsDef = getShellNotes(cur.type);
  if(shellsDef && shellsDef.length > 0) {
    const tempGS = buildGS(cur.type, cur.rootSemi);
    hasPlayableShells = tempGS.some(sg => sg.voicings.length > 0);
  }
  
  const hasDrop2 = isDrop2Chord(cur.type);
  
  const vtShells = document.getElementById('vtShells');
  const vtDrop2 = document.getElementById('vtDrop2');
  if(vtShells) vtShells.style.display = hasPlayableShells ? '' : 'none';
  if(vtDrop2) vtDrop2.style.display = hasDrop2 ? '' : 'none';
  
  let tabToSet = userPreferredTab;
  if(tabToSet === 'shells' && !hasPlayableShells) tabToSet = 'triads';
  if(tabToSet === 'drop2' && !hasDrop2) tabToSet = 'triads';
  
  setVariationTab(tabToSet, false);
  
  // Snap the piano scroll to the center of the active chord
  requestAnimationFrame(() => {
    if (currentInstrument === 'piano') centerPianoOnChord();
  });
}
function generate(){
  initAudio(); // Force audio resume
  stopAll();
  let t=[...act];
  if(!t.length)return;

  const ty=t[Math.floor(Math.random()*t.length)];
  const rp=ROOT_POOL[Math.floor(Math.random()*ROOT_POOL.length)];
  namingMode = rp.flat ? 'flat' : 'sharp';
  document.getElementById('nameSharp').classList.toggle('on', namingMode === 'sharp');
  document.getElementById('nameFlat').classList.toggle('on', namingMode === 'flat');
  cur={type:ty,rootSemi:rp.semi,flat:rp.flat,iv:CH[ty].iv,roles:CH[ty].r,ch:CH[ty]};
  
  if(quiz){
    showQuiz(cur.rootSemi, cur.flat, ty);
  } else {
    display();
    playChord();
  }
}
function showQuiz(ri,fl,co){
  quizAnswered = false;
  document.getElementById('chordView').style.display='none';
  document.getElementById('quizView').style.display='block';

  // Reset the quiz header text
  const qHear = document.querySelector('.quiz-hear-lbl');
  if (qHear) {
      qHear.textContent = 'IDENTIFY THIS CHORD';
      qHear.style.color = ''; 
  }

  // Generate visuals for the new question so the DOM updates before hiding spoilers
  buildPiano();
  buildGuitar(co, ri);

  const panel = document.getElementById('instrumentPanel');
  if (quizType === 'audio') {
    if(panel) panel.style.display = 'none';
    document.getElementById('qRoot').style.display='block';
    document.getElementById('qRoot').textContent = spellRoot(ri) + ' ???';
  } else {
    if(panel) panel.style.display = 'block';
    document.getElementById('qRoot').style.display='none';
    if (currentInstrument === 'piano') {
      document.getElementById('pianoView').style.display='block';
      document.getElementById('guitarView').style.display='none';
    } else {
      document.getElementById('pianoView').style.display='none';
      document.getElementById('guitarView').style.display='block';
    }
  }

  buildPiano();
  buildGuitar(co, ri);

  if (quizType !== 'audio') {
    if (currentInstrument === 'piano') {
      document.querySelectorAll('.piano-note-label').forEach(lbl => lbl.style.display = 'none');
    } else {
      document.querySelectorAll('.triad-info, .string-group-header').forEach(el => el.style.visibility = 'hidden');
    }
  }

  const targetPCs = CH[co].iv.map(v => (v + ri) % 12).sort((a,b)=>a-b).join(',');
  const ak=Object.keys(CH);
  const opts=[{rt: ri, ty: co, pcs: targetPCs}];

  while(opts.length<4){
    const randType = ak[Math.floor(Math.random()*ak.length)];
    const randRoot = Math.floor(Math.random()*12);
    if (!opts.some(o => o.rt === randRoot && o.ty === randType)) {
      const pcs = CH[randType].iv.map(v => (v + randRoot) % 12).sort((a,b)=>a-b).join(',');
      opts.push({rt: randRoot, ty: randType, pcs: pcs});
    }
  }
  opts.sort(()=>Math.random()-.5);

  const c=document.getElementById('qOpts');c.innerHTML='';
  opts.forEach(opt=>{
    const b=document.createElement('button');
    b.className='qopt';
    b.textContent = quizType === 'audio' ? CH[opt.ty].l + ' (' + CH[opt.ty].s + ')' : spellRoot(opt.rt) + ' ' + CH[opt.ty].l + ' (' + CH[opt.ty].s + ')';
    b.onclick=()=>ansQuiz(opt, opts, targetPCs, b);
    c.appendChild(b);
  });
  const rb = document.getElementById('revBtn');
  if(rb) rb.style.display='block';
  playChord();
  
  requestAnimationFrame(() => {
    if (currentInstrument === 'piano') centerPianoOnChord();
  });
}

let quizTimeout=null;
function skipQuizWait(){if(quizTimeout){clearTimeout(quizTimeout);quizTimeout=null;document.getElementById('skipHint').style.display='none';display();document.getElementById('chordHero').classList.remove('anim-out')}}

function ansQuiz(chosenOpt, allOpts, targetPCs, btn){
  quizTotal++;
  document.querySelectorAll('.qopt').forEach(b=>{b.onclick=null;b.style.cursor='default'});
  const rb = document.getElementById('revBtn');
  if(rb) rb.style.display='none';
  
  const isCorrect = chosenOpt.pcs === targetPCs;
  const qHear = document.querySelector('.quiz-hear-lbl');
  const mainCard = document.getElementById('mainCard');
  
  if (mainCard) {
      mainCard.classList.remove('flash-correct-anim', 'flash-wrong-anim');
      void mainCard.offsetWidth;
  }

  if(isCorrect){
      btn.classList.add('correct');
      quizScore++;
      if (qHear) { qHear.textContent = 'CORRECT!'; qHear.style.color = 'var(--green)'; }
      if (mainCard) mainCard.classList.add('flash-correct-anim');
  } else {
      btn.classList.add('wrong');
      streak=0;
      if (qHear) { qHear.textContent = 'INCORRECT!'; qHear.style.color = '#D4537E'; }
      if (mainCard) mainCard.classList.add('flash-wrong-anim');
  }

  const btns = document.querySelectorAll('.qopt');
  allOpts.forEach((opt, idx) => {
    if (opt.pcs === targetPCs) {
      btns[idx].classList.add('correct');
    }
  });

  const statSc = document.getElementById('statSc');
  if(statSc) statSc.textContent = quizScore + '/' + quizTotal;
  const statQ = document.getElementById('statQ');
  if(statQ) statQ.style.display = 'inline';
  
  quizAnswered = true;
  
  const panel = document.getElementById('instrumentPanel');
  if(panel) panel.style.display = '';
  
  if(currentInstrument === 'piano') {
      document.getElementById('pianoView').style.display = 'block';
      document.getElementById('guitarView').style.display = 'none';
  } else {
      document.getElementById('pianoView').style.display = 'none';
      document.getElementById('guitarView').style.display = 'block';
  }
  
  buildPiano(); // Reveals the true colors and labels for piano
  buildGuitar(cur.type, cur.rootSemi); // Reveals the true colors and labels for guitar
  
  document.getElementById('skipHint').style.display='block';
  updateStats();
  quizTimeout=setTimeout(()=>{
    quizTimeout=null;
    document.getElementById('skipHint').style.display='none';
    display();
    const ch = document.getElementById('chordHero');
    if(ch) ch.classList.remove('anim-out');
  },1800)
}
function revealQuiz(){
  const rb = document.getElementById('revBtn');
  if(rb) rb.style.display='none';
  display();
  const ch = document.getElementById('chordHero');
  if(ch) ch.classList.remove('anim-out');
}
function setArp(val){
  arp = val;
  document.getElementById('arpOff').classList.toggle('on', !arp);
  document.getElementById('arpOn').classList.toggle('on', arp);
  updateRhythmVis();
  if(!arp)stopAll();
}
function toggleQuiz(){
  quiz=!quiz;
  
  const qLbl = document.getElementById('quizLbl');
  if(qLbl) qLbl.textContent=quiz?'ON':'OFF';
  const qBtn = document.getElementById('quizBtn');
  if(qBtn) qBtn.classList.toggle('btn-active',quiz);

  if(!quiz){
    quizScore=0;quizTotal=0;
    const scoreSt = document.getElementById('scoreSt');
    if(scoreSt) scoreSt.style.display='none';
    if(quizTimeout){clearTimeout(quizTimeout);quizTimeout=null}
    const skipHint = document.getElementById('skipHint');
    if(skipHint) skipHint.style.display='none';
    const chordHero = document.getElementById('chordHero');
    if(chordHero) chordHero.classList.remove('anim-out');
    
    // Restore the instrument panel visibility
    const panel = document.getElementById('instrumentPanel');
    if(panel) panel.style.display = '';
    
    // When turning off, spawn a fresh random chord to look at
    if(inputMode === 'random') generate();
    else display();
  } else {
    // Ensure bottom sheets close when starting a quiz
    if (isMobile() && currentMobileTab !== 'play') setMobileTab('play');
    
    // Force random mode if manual, or just generate a new quiz chord
    if(inputMode==='manual') setInputMode('random');
    else generate();
  }
  updateStats();
}
function setRhythm(r){arpRhythm=r;
document.getElementById('rhStraight').classList.toggle('on',r==='straight');document.getElementById('rhTriplet').classList.toggle('on',r==='triplet');if(isContinuous()){stopAll();playChord()}}
function updateRhythmVis(){document.getElementById('rhythmRow').style.display=''}
function setInv(v,el){
  stopAll(true);
  inv=v;
  document.querySelectorAll('.opt-btn[data-inv]').forEach(b=>b.classList.remove('on'));
  if(el)el.classList.add('on');
  if(cur)buildPiano();

  if(cur && currentInstrument === 'guitar'){
    const invMap = { 'root': 'Root', '1st': '1st', '2nd': '2nd', '3rd': '3rd' };
    const targetName = invMap[v];
    sgi = ctd.map(sg => {
      const idx = sg.voicings.findIndex(vc => vc.name === targetName);
      return idx !== -1 ? idx : 0;
    });
    renderSGs();
  }

  if(activeProg){const p=activeProg,r=activeProgRoot;stopProg();playProg(p,r)}
  else { playChord(); }
}
function shiftOct(dir){
  stopAll(true);
  const maxO=playSrc==='guitar'?-1:4;
  octShift=Math.max(-2,Math.min(maxO,octShift+dir));
  if(playSrc==='guitar')guitarOct=octShift;else pianoOct=octShift;
  document.getElementById('octDisplay').textContent=octShift+3;
  if(cur){buildPiano();renderSGs()}
  if(activeProg){const p=activeProg,r=activeProgRoot;stopProg();playProg(p,r)}
  else { playChord(); }
}

function setMode(m,el){stopAll();playMode=m;document.querySelectorAll('.opt-btn[data-mode]').forEach(b=>b.classList.remove('on'));el.classList.add('on');updateRhythmVis()}
function setBpm(v){bpm=Number(v);if(isContinuous()){stopAll();playChord()}}
let pianoOct=1,guitarOct=-2;
function setSrc(s){
  stopAll(true);
  if(playSrc==='piano')pianoOct=octShift;else guitarOct=octShift;
  playSrc=s;
  currentInstrument=s;
  document.getElementById('srcPiano').classList.toggle('on',s==='piano');
  document.getElementById('srcGuitar').classList.toggle('on',s==='guitar');
  
  const ip = document.getElementById('instPiano'); if(ip) ip.classList.toggle('on', s==='piano');
  const ig = document.getElementById('instGuitar'); if(ig) ig.classList.toggle('on', s==='guitar');
  
  if (s === 'guitar') {
    document.getElementById('pianoView').style.display = 'none';
    document.getElementById('guitarView').style.display = 'block';
    document.getElementById('guitarHeaderControls').style.display = 'flex';
    document.getElementById('instrLabel').textContent = "GUITAR — click to play";
  } else {
    document.getElementById('guitarView').style.display = 'none';
    document.getElementById('pianoView').style.display = 'block';
    document.getElementById('guitarHeaderControls').style.display = 'none';
    document.getElementById('instrLabel').textContent = "PIANO — scroll to explore";
  }

  updateGuitarSrcHighlight();
  octShift=s==='guitar'?guitarOct:pianoOct;
  document.getElementById('octDisplay').textContent=octShift+3;
  if(cur){
    buildGuitar(cur.type, cur.rootSemi); // Safely rebuilds guitar logic & updates INV buttons
    buildPiano();
    renderSGs();
  }
  
  if(quiz && document.getElementById('quizView').style.display !== 'none') { generate(); }
  else { playChord(); }
}
function selectAll(){
  Object.keys(CH).forEach(k=>act.add(k));
  document.querySelectorAll('.chip[data-key]').forEach(c=>c.classList.add('on'));
  document.getElementById('saAllBtn')?.classList.add('on');
  document.getElementById('saNoneBtn')?.classList.remove('on');
}
function selectNone(){
  const f=Object.keys(CH)[0];act.clear();act.add(f);
  document.querySelectorAll('.chip[data-key]').forEach(c=>{c.dataset.key===f?c.classList.add('on'):c.classList.remove('on')});
  document.getElementById('saAllBtn')?.classList.remove('on');
  document.getElementById('saNoneBtn')?.classList.add('on');
}
function toggleGrp(keys){
  const on=keys.every(k=>act.has(k));
  if(on){
    const rem=new Set([...act].filter(k=>!keys.includes(k)));
    if(!rem.size)return;
    keys.forEach(k=>{act.delete(k);const c=document.querySelector(`.chip[data-key="${k}"]`);if(c)c.classList.remove('on')});
    document.getElementById('saAllBtn')?.classList.remove('on');
  } else {
    keys.forEach(k=>{act.add(k);const c=document.querySelector(`.chip[data-key="${k}"]`);if(c)c.classList.add('on')});
    if(act.size === Object.keys(CH).length) document.getElementById('saAllBtn')?.classList.add('on');
    document.getElementById('saNoneBtn')?.classList.remove('on');
  }
}

function buildFilters(){const g=document.getElementById('fGrid');g.innerHTML='';FG.forEach(([grp,keys])=>{const row=document.createElement('div');row.className='chord-type-row';const l=document.createElement('span');l.className='grp-lbl';l.textContent=grp;l.onclick=()=>{if(inputMode==='manual')return;toggleGrp(keys);};row.appendChild(l);const cw=document.createElement('div');cw.className='chord-type-chips';keys.forEach(k=>{const c=document.createElement('div');c.className='chip '+(act.has(k)?'on':'');c.dataset.key=k;c.textContent=CH[k].s;c.title=CH[k].l;c.onclick=()=>{if(inputMode==='manual'){manualQuality=k;document.querySelectorAll('.chip[data-key]').forEach(x=>x.classList.remove('on'));c.classList.add('on');act.clear();act.add(k);applyManual()}else{if(act.has(k)&&act.size===1)return;if(act.has(k)){act.delete(k);c.classList.remove('on');document.getElementById('saAllBtn')?.classList.remove('on');}else{act.add(k);c.classList.add('on');if(act.size===Object.keys(CH).length)document.getElementById('saAllBtn')?.classList.add('on');document.getElementById('saNoneBtn')?.classList.remove('on');}}};cw.appendChild(c)});row.appendChild(cw);g.appendChild(row)})}


/* Guitar */
function buildGuitar(ct,rs){
  let tempGS = null;
  let hasShells = false;
  const shellsDef = getShellNotes(ct);
  if (shellsDef) {
    tempGS = buildGS(ct,rs);
    hasShells = tempGS.some(sg => sg.voicings.length > 0);
  }
  const hasDrop2=isDrop2Chord(ct);
  
  let activeGuitarMode = userPreferredTab === 'progs' ? 'triads' : userPreferredTab;
  if(activeGuitarMode==='shells'&&!hasShells) activeGuitarMode='triads';
  if(activeGuitarMode==='drop2'&&!hasDrop2) activeGuitarMode='triads';
  guitarDiagMode = activeGuitarMode;
  
  document.getElementById('gTabTriads')?.classList.toggle('on', guitarDiagMode==='triads');
  document.getElementById('gTabShells')?.classList.toggle('on', guitarDiagMode==='shells');
  document.getElementById('gTabDrop2')?.classList.toggle('on', guitarDiagMode==='drop2');
  document.getElementById('gTabProgs')?.classList.toggle('on', guitarDiagMode==='progs');
  
  const grid=document.getElementById('guitarStringGroups');
  grid.classList.remove('shell-mode','drop2-mode');
  if(guitarDiagMode==='shells')grid.classList.add('shell-mode');
  if(guitarDiagMode==='drop2')grid.classList.add('drop2-mode');
  
  if(guitarDiagMode==='shells') ctd=tempGS;
  else if(guitarDiagMode==='drop2') ctd=buildDrop2Groups(ct,rs);
  else ctd=buildGT(ct,rs);

  // Sync current inversion selection (inv) to the new diagrams
  const invMap = { 'root': 'Root', '1st': '1st', '2nd': '2nd', '3rd': '3rd' };
  const targetName = invMap[inv] || 'Root';

  // Update INV buttons based on instrument and available voicings
  document.querySelectorAll('.opt-btn[data-inv]').forEach(btn => {
    const v = btn.dataset.inv;
    const tName = invMap[v];
    let hasInv = true;
    if (currentInstrument === 'guitar') {
        hasInv = ctd.some(sg => sg.voicings.some(vc => vc.name === tName));
    } else if (cur) {
        const effLen = voiceMode === 'shell' ? shellFilter(cur.ch.iv, cur.ch.r).ivs.length : cur.ch.iv.length;
        hasInv = ['root', '1st', '2nd', '3rd'].indexOf(v) < effLen;
    }
    btn.style.display = hasInv ? 'inline-block' : 'none';
    if (!hasInv && inv === v) {
        setInv('root', document.querySelector('.opt-btn[data-inv="root"]'));
    }
  });

  sgi = ctd.map(sg => {
    const foundIdx = sg.voicings.findIndex(vc => vc.name === targetName);
    return foundIdx !== -1 ? foundIdx : 0;
  });
  
  if (!ctd[guitarSrcGroup] || ctd[guitarSrcGroup].voicings.length === 0) {
    const validGi = ctd.findIndex(sg => sg.voicings.length > 0);
    guitarSrcGroup = validGi !== -1 ? validGi : 0;
  }
  
  renderSGs();
}

function toggleLink(){linkedNav=!linkedNav;const b=document.getElementById('linkBtn');b.classList.toggle('on',linkedNav);b.textContent=linkedNav?'Linked':'Unlinked'}

function jumpToShellVoicing(shellLabel){
  ctd.forEach((sg,gi)=>{
    const idx=sg.voicings.findIndex(v=>v.shellLabel===shellLabel);
    if(idx!==-1){
      sgi[gi]=idx;
      const ct=document.getElementById('sgC-'+gi);
      if(ct)ct.textContent=(sgi[gi]+1)+'/'+sg.voicings.length;
      const v=sg.voicings[sgi[gi]],info=document.getElementById('sgI-'+gi);
      if(info){info.innerHTML=sgInfoHtml(v,sg)}
      const sl=document.getElementById('sgL-'+gi);
      if(sl)sl.innerHTML='STR '+_voicingStrNums(v)+' <span style="font-weight:400;color:var(--txt3);font-size:9px">'+_voicingStrNames(v)+'</span>';
      drawSG(gi);
    }
  });
  bGL();
}

function renderSGs(){
  const c=document.getElementById('guitarStringGroups');c.innerHTML='';
  const lbl=document.getElementById('guitarDiagLabel');
  if(lbl)lbl.textContent=guitarDiagMode==='shells'?'GUITAR SHELLS — click notes to play':guitarDiagMode==='drop2'?'GUITAR DROP 2 — click notes to play':'GUITAR DIAGRAMS — click notes to play';
  ctd.forEach((sg,gi)=>{
    const d=document.createElement('div');
    d.className='string-group'+(gi===guitarSrcGroup&&playSrc==='guitar'?' sg-active':'');
    d.id='sg-'+gi;
    d.onclick=(e)=>{if(!e.target.closest('.sg-arrow')) setGuitarSrc(gi)};
    const vc=sg.voicings.length;
    if(!vc){
      d.innerHTML=`<div class="string-group-header"><span class="string-group-label">${sg.group.label}</span></div><div style="text-align:center;font-size:11px;color:var(--txt3);padding:10px 0">${guitarDiagMode==='shells'?'No shell voicings (needs 7th)':guitarDiagMode==='drop2'?'No drop 2 voicings':'No voicings'}</div>`;
      c.appendChild(d);return
    }
const h=document.createElement('div');
    h.className='string-group-header';
    h.style.marginBottom = '6px'; // Adds a tiny bit of breathing room before the fretboard starts
    const v=sg.voicings[sgi[gi]];
    const strLabel='STR '+_voicingStrNums(v);
    
    // Inject the pill (sgInfoHtml) and the string label into a flex container on the left
    h.innerHTML=`
      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <div id="sgI-${gi}" style="display:flex;">${sgInfoHtml(v,sg)}</div>
        <span class="string-group-label" id="sgL-${gi}" style="display:flex; flex-wrap:wrap; align-items:center; gap:4px;">${strLabel} <span style="white-space:nowrap;font-weight:400;color:var(--txt3);font-size:9px">${_voicingStrNames(v)}</span></span>
      </div>
      <div class="string-group-nav">
        <button class="sg-arrow" onclick="sgN(${gi},-1)">‹</button>
        <span class="sg-counter" id="sgC-${gi}">${sgi[gi]+1}/${vc}</span>
        <button class="sg-arrow" onclick="sgN(${gi},1)">›</button>
      </div>
    `;
    d.appendChild(h);
    
    const sw=document.createElement('div');
    sw.id='sgS-'+gi;
    d.appendChild(sw);
    c.appendChild(d);
    drawSG(gi);
  });
  bGL()
}


function setGuitarSrc(gi){guitarSrcGroup=gi;updateGuitarSrcHighlight()}
function updateGuitarSrcHighlight(){document.querySelectorAll('.string-group').forEach((el,i)=>{el.classList.toggle('sg-active',i===guitarSrcGroup&&playSrc==='guitar')});}

function jumpToTriadVoicing(tAbbr, tRole, invName = 'Root') {
  ctd.forEach((sg, gi) => {
    const idx = sg.voicings.findIndex(v => v.triadAbbr === tAbbr && v.triadRootRole === tRole && v.name === invName);
    if (idx !== -1) {
      sgi[gi] = idx;
      const ct = document.getElementById('sgC-'+gi);
      if(ct) ct.textContent = (sgi[gi]+1) + '/' + sg.voicings.length;
      const v = sg.voicings[sgi[gi]], info = document.getElementById('sgI-'+gi);
      if(info){info.innerHTML=sgInfoHtml(v,sg)}
      const sl=document.getElementById('sgL-'+gi);
      if(sl)sl.innerHTML='STR '+_voicingStrNums(v)+' <span style="font-weight:400;color:var(--txt3);font-size:9px">'+_voicingStrNames(v)+'</span>';
      drawSG(gi);
    }
  });
  bGL();
}

function _voicingStrNums(v){
  const strs=[];
  v.voicing.forEach((x,s)=>{if(x && typeof x.fret === 'number')strs.push(6-s)});
  strs.sort((a,b)=>b-a);
  return strs.join('-');
}

function _voicingStrNames(v){
  const names=['E','A','D','G','B','E'];
  const strs=[];
  v.voicing.forEach((x,s)=>{if(x && typeof x.fret === 'number')strs.push({n:names[s], i:6-s})});
  strs.sort((a,b)=>b.i-a.i);
  return strs.map(x=>x.n).join(' ');
}

function _triadFormula(v){
  if(!v.triadAbbr||v.triadAbbr==='shell'||v.triadAbbr==='drop2')return'';
  const td = Object.values(TRIAD_TYPES).find(t => t.abbr === v.triadAbbr);
  if(!td)return'';
  return td.roles.map((r, i) => qualDeg(r, td.iv[i])).join('-');
}

function _shellFormula(v){
  if(!v.shellLabel)return'';
  // shellLabel is like "R-3-7" — extract just the formula part (before any parenthetical)
  const lbl=v.name||'';
  const pIdx=lbl.indexOf(' (');
  return pIdx!==-1?lbl.substring(0,pIdx):v.shellLabel;
}

function _drop2Formula(v){
  if(!v.d2Label)return'';
  // d2Label is like "G Δ7 (R-3-5-7)" — extract the parenthetical formula
  const m=v.d2Label.match(/\(([^)]+)\)/);
  return m?m[1]:'';
}


function sgInfoHtml(v,sg){
  const isQuizActive = quiz && document.getElementById('quizView').style.display !== 'none' && !quizAnswered;
  if (isQuizActive) {
    // Dynamically sync the main container's border to the quiz color
    const gi = ctd.indexOf(sg);
    if (gi !== -1) {
        setTimeout(() => {
            const el = document.getElementById('sg-' + gi);
            if (el) el.style.border = `2px solid var(--accent)`;
        }, 0);
    }
    return `<span class="triad-list-tag" style="background:var(--accent);color:#FFFFFF;border-color:transparent;" onclick="playSgChord(event)">? ? ?</span>`;
  }

  const sRoot=spellRoot(cur.rootSemi);
  const sQual=cur.ch.s;
  
  const activeRoles = v.voicing.filter(x=>x).map(x=>x.deg);
  const pill = getExtPill(activeRoles);
  const baseCls = RC[v.btnRole] || 'pr';

  // Dynamically sync the main container's border to the parent button color
  const gi = ctd.indexOf(sg);
  if (gi !== -1) {
      setTimeout(() => {
          const el = document.getElementById('sg-' + gi);
          if (el) el.style.border = `2px solid var(--${baseCls})`;
      }, 0);
  }

  if(guitarDiagMode==='shells'){
    const hasRoot = activeRoles.includes('root');
    const ivsCombo = activeRoles.map(r => cur.ch.iv[cur.ch.r.indexOf(r)]);
    let shapeName = hasRoot ? '' : getShellShapeName(ivsCombo);
    let comboRootName = hasRoot ? (sRoot + ' ' + sQual) : spellNote(cur.rootSemi, ivsCombo[0], activeRoles[0], namingMode === 'flat');
    const formula = activeRoles.map(r => qualDeg(r, cur.ch.iv[cur.ch.r.indexOf(r)])).join('-');

    const labelText = labelMode === 'notes' 
        ? (shapeName ? `${comboRootName} ${shapeName} (${formula})` : `${comboRootName} (${formula})`) 
        : formula;

    const html = `${labelText} ${pill}`;
    return `<span class="triad-list-tag ${baseCls}" onclick="playSgChord(event)">${html}</span>`;
  } else if(guitarDiagMode==='drop2'){
    const d2Label = _drop2Formula(v);
    const d2NameOnly = v.d2Label ? v.d2Label.replace(/\s*\([^)]*\)/,'') : '';
    const textLabel = labelMode === 'notes' ? (d2NameOnly ? `${d2NameOnly} (${d2Label})` : `(${d2Label})`) : d2Label;
    const html = `${textLabel} ${pill}`;
    return `<span class="triad-list-tag ${baseCls}" onclick="playSgChord(event)">${html}</span>`;
  } else {
    const rootName=spellNote(cur.rootSemi,(v.triadRootSemi-cur.rootSemi+12)%12,v.triadRootRole,namingMode==='flat');
    const formula=_triadFormula(v);
    const btnLabel = labelMode === 'notes' ? `${rootName} ${v.triadAbbr}` : formula;
    const html = `${btnLabel} ${pill}`;
    return `<span class="triad-list-tag ${baseCls}" onclick="playSgChord(event)">${html}</span>`;
  }
}

function playSgChord(e){
  e.stopPropagation();
  const sgEl=e.target.closest('.string-group');
  if(!sgEl)return;
  const gi=parseInt(sgEl.id.replace('sg-',''));
  if(isNaN(gi)||!ctd[gi]||!ctd[gi].voicings.length)return;
  setGuitarSrc(gi);
  const v=ctd[gi].voicings[sgi[gi]];
  if(!v)return;
  const gOct=guitarOctShift();
  const om=[40,45,50,55,59,64];
  const keptRoles=(guitarDiagMode==='triads')?getShellKeptRoles():null;
  const semis=[];
  v.voicing.forEach((x,s)=>{if(x&&(!keptRoles||keptRoles.has(x.deg)))semis.push(om[s]+x.fret+gOct)});
  if(!semis.length)return;
  semis.sort((a,b)=>a-b);
  stopAll(true);
  const ac=initAudio(),now=ac.currentTime;
  semis.forEach((s,i)=>pT(s,now+i*.008,2.5,ac));
  aK(semis,false);
  previewVoicingOnPiano(semis,v.btnRole||v.voicing.find(x=>x)?.deg||'root',cur.rootSemi,cur.ch);
  
  const pd = document.getElementById('pdot');
  if(pd) pd.classList.add('on');
  updateFabState(true);
  if(uiTimer) clearTimeout(uiTimer);
  uiTimer = setTimeout(()=>{
      if(pd) pd.classList.remove('on');
      updateFabState(false);
  },2600);
}

function isLt(){return curTheme==='light'||curTheme==='frost'||curTheme==='sage'||curTheme==='latte'}
const OPEN_STRING_MIDI=[40,45,50,55,59,64];
function drawSG(gi){
  const w=document.getElementById('sgS-'+gi);if(!w)return;
  const sg=ctd[gi];if(!sg||!sg.voicings.length)return;
  const fullV=sg.voicings[sgi[gi]];
  const v=fullV.voicing;
  
  const isQuizActive = quiz && document.getElementById('quizView').style.display !== 'none' && !quizAnswered;
  let col = isQuizActive ? 'var(--accent)' : (DEG_COLORS[fullV.btnRole]||DEG_COLORS['root']).bg;
  
  const grpEl = document.getElementById('sg-'+gi);
  if(grpEl) grpEl.style.setProperty('--active-sg-color', col);

  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class','guitar-svg');svg.setAttribute('viewBox','0 0 280 180');
  const nF=5,str=6,ml=42,mt=26,fw=185,fh=130,sw2=fw/(str-1),fg=fh/nF;
  const lt=isLt();
  const lC=lt?'rgba(0,0,0,.35)':'rgba(255,255,255,.3)';
  const nutC=lt?'rgba(0,0,0,.7)':'rgba(255,255,255,.6)';
  const ftC=lt?'#444':'#BBB';
  const dimC=lt?'#666':'#999';
  const as=new Set();v.forEach((x,s)=>{if(x)as.add(s)});
  const fn=v.filter(x=>x&&x.fret>0),mnF=fn.length?Math.min(...fn.map(x=>x.fret)):1,mxF=fn.length?Math.max(...fn.map(x=>x.fret)):1;
  let dO=0;if(mxF<=nF)dO=0;else if(mnF>1)dO=mnF-1;if(mxF-dO>nF)dO=mxF-nF;
  for(let f=0;f<=nF;f++){const y=mt+f*fg,l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',ml);l.setAttribute('x2',ml+fw);l.setAttribute('y1',y);l.setAttribute('y2',y);l.setAttribute('stroke',f===0&&dO===0?nutC:lC);l.setAttribute('stroke-width',f===0&&dO===0?'3':'1.5');svg.appendChild(l)}
  for(let s=0;s<str;s++){const cx=ml+s*sw2,l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',cx);l.setAttribute('x2',cx);l.setAttribute('y1',mt);l.setAttribute('y2',mt+nF*fg);l.setAttribute('stroke',lC);l.setAttribute('stroke-width','1.5');svg.appendChild(l)}
  if(dO>0){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',ml-12);t.setAttribute('y',mt+fg/2+4);t.setAttribute('text-anchor','end');t.setAttribute('font-size','11');t.setAttribute('font-weight','600');t.setAttribute('font-family','Fira Code,monospace');t.setAttribute('fill',ftC);t.textContent=(dO+1)+'fr';svg.appendChild(t)}
  for(let s=0;s<str;s++){
    const vn=v[s],cx=ml+s*sw2;
    if(!vn){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',cx);t.setAttribute('y',mt-7);t.setAttribute('text-anchor','middle');t.setAttribute('font-size','14');t.setAttribute('font-weight','600');t.setAttribute('fill',dimC);t.textContent='×';svg.appendChild(t);continue}
    const deg=vn.deg||'R',sd=vn.civ!==undefined?qualDeg(deg,vn.civ):(RS2[deg]||deg);
    const col = isQuizActive ? 'var(--accent)' : (DEG_COLORS[deg]||DEG_COLORS['root']).bg;
    const df=vn.fret-dO;
    const noteMidi=OPEN_STRING_MIDI[s]+vn.fret;
    const lblTxt = isQuizActive ? '' : (labelMode==='notes'?ND_name(noteMidi%12):sd);
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','guitar-note-hit');g.setAttribute('data-midi',noteMidi);
    const keptRoles = getShellKeptRoles();
    if(keptRoles && !keptRoles.has(vn.deg)) g.style.opacity='0.25';
    g.addEventListener('click',function(){playGuitarNote(noteMidi,this)});
    if(vn.fret===0||df<=0){
      const ci=document.createElementNS('http://www.w3.org/2000/svg','circle');ci.setAttribute('cx',cx);ci.setAttribute('cy',mt-8);ci.setAttribute('r','9');ci.setAttribute('fill',col);g.appendChild(ci);
      const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',cx);t.setAttribute('y',mt-4);t.setAttribute('text-anchor','middle');t.setAttribute('font-size',lblTxt.length>1?'8':'10');t.setAttribute('font-family','Fira Code,monospace');t.setAttribute('fill','white');t.setAttribute('font-weight','700');t.textContent=lblTxt;t.style.pointerEvents='none';g.appendChild(t);
    }else{
      const cy=mt+df*fg-fg/2;
      const ci=document.createElementNS('http://www.w3.org/2000/svg','circle');ci.setAttribute('cx',cx);ci.setAttribute('cy',cy);ci.setAttribute('r','12');ci.setAttribute('fill',col);g.appendChild(ci);
      const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',cx);t.setAttribute('y',cy+4);t.setAttribute('text-anchor','middle');t.setAttribute('font-size',lblTxt.length>1?'9':'12');t.setAttribute('font-family','Fira Code,monospace');t.setAttribute('fill','white');t.setAttribute('font-weight','600');t.textContent=lblTxt;t.style.pointerEvents='none';g.appendChild(t);
    }
    svg.appendChild(g);
  }
w.innerHTML='<div class="guitar-scroll-wrap"></div>';
w.firstChild.appendChild(svg);
}

function bGL(){const el=document.getElementById('guitarLegend');if(!el)return;el.innerHTML='';
const isQuizActive = quiz && document.getElementById('quizView').style.display !== 'none' && !quizAnswered;
if(isQuizActive) return;
const seen=new Set();ctd.forEach((sg,gi)=>{if(!sg.voicings.length)return;sg.voicings[sgi[gi]].voicing.forEach(vn=>{if(vn&&vn.deg)seen.add(vn.deg)})});['root','3rd','5th','7th','9th','11th','13th','4th','2nd'].forEach(d=>{if(!seen.has(d))return;const col=(DEG_COLORS[d]||DEG_COLORS['root']).bg,s=document.createElement('span');s.innerHTML=`<div class="gfl" style="background:${col}"></div>${RS2[d]||d} = ${d}`;el.appendChild(s)})}
function guitarOctShift(){return Math.max(0,Math.min(1,guitarOct+2))*12}
function guitarMidi(){const gOct=guitarOctShift();const om=[40,45,50,55,59,64];const gi=guitarSrcGroup;const keptRoles=(guitarDiagMode==='triads')?getShellKeptRoles():null;if(gi<ctd.length){const sg=ctd[gi];if(sg.voicings.length){const v=sg.voicings[sgi[gi]],m=[];v.voicing.forEach((x,s)=>{if(x&&(!keptRoles||keptRoles.has(x.deg)))m.push(om[s]+x.fret+gOct)});if(m.length)return m.sort((a,b)=>a-b)}}return[]}

function getShellNotes(ct){
  const ch=CH[ct],shells=[];if(!ch)return null;
  const rootIv=0,thirdRole=ch.r.includes('3rd')?'3rd':(ch.r.includes('b3')?'b3':(ch.r.includes('sus4')?'4th':null));
  const thirdIv=thirdRole?ch.iv[ch.r.indexOf(thirdRole)]:null;
  const has7=ch.r.includes('7th')||ch.r.includes('b7')||ch.r.includes('bb7');
  let sevRole=null, sevIv=null;

  if(has7){
    sevRole=ch.r.find(r=>r.includes('7'));
    sevIv=ch.iv[ch.r.indexOf(sevRole)];
  } else if(ch.r.includes('13th') || ch.r.includes('6th')){
    sevRole = ch.r.includes('13th') ? '13th' : '6th';
    sevIv = ch.iv[ch.r.indexOf(sevRole)];
  }

  if(thirdRole!==null){
            const s3=qualDeg(thirdRole,thirdIv);
            if(sevRole){
              const s7Lbl=qualDeg(sevRole,sevIv);
              shells.push({label:qualDeg('root',0)+'-'+s3+'-'+s7Lbl,iv:[rootIv,thirdIv,sevIv],parentRoles:['root',thirdRole,sevRole]});
            } else {
              shells.push({label:qualDeg('root',0)+'-'+s3,iv:[rootIv,thirdIv],parentRoles:['root',thirdRole]});
              shells.push({label:qualDeg('root',0)+'-'+s3+'-'+qualDeg('root',0),iv:[rootIv,thirdIv,rootIv],parentRoles:['root',thirdRole,'root']});
            }
          }
  const extRoles=['9th','b9','#9','11th','#11','13th','b13'];
  for(const er of extRoles){
    if(!ch.r.includes(er))continue;
    if(!has7&&er.includes('13'))continue;
    const eIv=ch.iv[ch.r.indexOf(er)];
    const se=qualDeg(er,eIv);
    if(thirdRole!==null){
      const s3=qualDeg(thirdRole,thirdIv);
      shells.push({label:qualDeg('root',0)+'-'+s3+'-'+se,iv:[rootIv,thirdIv,eIv],parentRoles:['root',thirdRole,er]});
    }
    if(sevRole){
      const s7Lbl=qualDeg(sevRole,sevIv);
      shells.push({label:qualDeg('root',0)+'-'+s7Lbl+'-'+se,iv:[rootIv,sevIv,eIv],parentRoles:['root',sevRole,er]});
    }
  }

  const r3=thirdRole, r7=sevRole;
  const r9=ch.r.find(r=>r.includes('9')), r11=ch.r.find(r=>r.includes('11')), r13=ch.r.find(r=>r.includes('13'));

  function addSh(roles){
    if(roles.every(r=>r!==null&&ch.r.includes(r))){
      const ivs=roles.map(r=>ch.iv[ch.r.indexOf(r)]);
      const lbl=roles.map(r=>qualDeg(r,ch.iv[ch.r.indexOf(r)])).join('-');
      shells.push({label:lbl,iv:ivs,parentRoles:roles});
    }
  }
  if(r3&&r7){ addSh([r3,r7,r9]); addSh([r3,r7,r11]); addSh([r3,r7,r13]); }
  if(r3&&r9){ addSh([r3,r9,r11]); }
  if(r7&&r9){ addSh([r7,r9,r11]); addSh([r7,r9,r13]); }

  return shells;
}

function buildGT(ct,rs){
  const triads=findTriads(ct);
  return STRING_GROUPS.map(sg=>{
    let v=[];
    triads.forEach(t=>{
      const tv=genTV(t.triadDef,(rs+t.triadRootInterval)%12,sg,t.parentRoles);
      tv.forEach(vv=>{
        vv.triadAbbr=t.triadAbbr;
        vv.triadRootRole=t.triadRootRole;
        vv.triadRootSemi=(rs+t.triadRootInterval)%12;
        vv.btnRole=t.triadRootRole;
      });
      v.push(...tv);
    });
    if(guitarSortMode === 'fretboard' && v.length > 1) {
        v = genericProxSort(v, 0);
    }
    return{group:sg,voicings:v};
  });
}

let act=new Set(Object.keys(CH)),cur=null,arp=false,quiz=false,quizAnswered=false,quizType='visual',quizScore=0,quizTotal=0,audioCtx=null,masterGain=null,arpRhythm='straight',inv='root',playMode='once',bpm=120,octShift=1,inputMode='random',manualRoot=7,manualQuality='maj',histList=[],chordCount=0,streak=0,loopTimer=null,holdOscs=[],playSrc='piano',activeNodes=[],guitarSrcGroup=0,voiceMode='full';
let randomAct = new Set(Object.keys(CH));

function setQuizType(type) {
  quizType = type;
  document.getElementById('qtVisual').classList.toggle('on', type === 'visual');
  document.getElementById('qtAudio').classList.toggle('on', type === 'audio');
  if (quiz && document.getElementById('quizView').style.display !== 'none') generate();
}
function setInputMode(m){
  const wasManual = (inputMode === 'manual');
  inputMode=m;
  
  const mr = document.getElementById('modeRandom');
  if(mr) mr.classList.toggle('on',m==='random');
  const mm = document.getElementById('modeManual');
  if(mm) mm.classList.toggle('on',m==='manual');
  
  const rs = document.getElementById('rootSection');
  if(rs) rs.style.display=m==='manual'?'block':'none';
  const sr = document.getElementById('saRow');
  if(sr) sr.style.display=m==='manual'?'none':'flex';
  
  const tnb = document.getElementById('topNewBtn');
  if(tnb) tnb.style.display = m==='random' ? 'flex' : 'none';

  if(m==='manual'){
    if(quiz)toggleQuiz();
    randomAct=new Set(act);
    manualQuality=[...act][0]||'maj';
    document.querySelectorAll('.chip[data-key]').forEach(c=>{
      c.classList.remove('on');
      if(c.dataset.key===manualQuality)c.classList.add('on')
    });
    applyManual();
  } else {
    if(wasManual){
        act=new Set(randomAct);
        document.querySelectorAll('.chip[data-key]').forEach(c=>{
          c.classList.toggle('on',act.has(c.dataset.key))
        });
    }
    // Automatically generate & play a chord whenever "Random" is clicked
    generate();
  }
}
function buildManualSelectors(){const rg=document.getElementById('rootGrid');rg.innerHTML='';for(let i=0;i<12;i++){const b=document.createElement('button');b.className='root-btn'+(i===manualRoot?' on':'');b.textContent=rootDisplayName(i);b.onclick=()=>{manualRoot=i;rg.querySelectorAll('.root-btn').forEach(x=>x.classList.remove('on'));b.classList.add('on');applyManual()};rg.appendChild(b)}}
function applyManual(){initAudio();stopAll();const ch=CH[manualQuality];if(!ch)return;cur={type:manualQuality,rootSemi:manualRoot,flat:namingMode==='flat',iv:ch.iv,roles:ch.r,ch};display();playChord()}
function initAudio(){if(!audioCtx){audioCtx=new(window.AudioContext||window.webkitAudioContext)();const c=audioCtx.createDynamicsCompressor();c.threshold.value=-24;c.knee.value=12;c.ratio.value=4;c.attack.value=.01;c.release.value=.15;c.connect(audioCtx.destination);masterGain=audioCtx.createGain();masterGain.gain.value=gV();masterGain.connect(c)}if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}
function gV(){return(document.getElementById('volSlider')?.value||60)/100*.35}
document.addEventListener('input',e=>{if(e.target.id==='volSlider'&&masterGain){masterGain.gain.cancelScheduledValues(audioCtx.currentTime);masterGain.gain.setValueAtTime(gV(),audioCtx.currentTime)}});
function m2f(m){return 440*Math.pow(2,(m-69)/12)}
function trk(o,g,t){const e={osc:o,gain:g};activeNodes.push(e);if(t!==Infinity)setTimeout(()=>{try{g.disconnect()}catch(x){}activeNodes=activeNodes.filter(n=>n!==e)},Math.max((t-audioCtx.currentTime)*1000+200,0))}
function pT(midi,t,dur,ac){const o=masterGain,o1=ac.createOscillator(),g1=ac.createGain();o1.type='sine';o1.frequency.setValueAtTime(m2f(midi),t);g1.gain.setValueAtTime(0,t);g1.gain.linearRampToValueAtTime(.28,t+.008);g1.gain.exponentialRampToValueAtTime(.12,t+dur*.4);g1.gain.exponentialRampToValueAtTime(.001,t+dur);o1.connect(g1);g1.connect(o);o1.start(t);o1.stop(t+dur+.05);trk(o1,g1,t+dur+.05);const o2=ac.createOscillator(),g2=ac.createGain();o2.type='sine';o2.frequency.setValueAtTime(m2f(midi)*2,t);g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(.04,t+.01);g2.gain.exponentialRampToValueAtTime(.001,t+dur*.5);o2.connect(g2);g2.connect(o);o2.start(t);o2.stop(t+dur*.5+.05);trk(o2,g2,t+dur*.5+.05);const o3=ac.createOscillator(),g3=ac.createGain(),fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(2000,t);fl.frequency.exponentialRampToValueAtTime(400,t+dur*.3);fl.Q.value=.7;o3.type='triangle';o3.frequency.setValueAtTime(m2f(midi),t);g3.gain.setValueAtTime(0,t);g3.gain.linearRampToValueAtTime(.06,t+.005);g3.gain.exponentialRampToValueAtTime(.001,t+dur*.6);o3.connect(fl);fl.connect(g3);g3.connect(o);o3.start(t);o3.stop(t+dur*.6+.05);trk(o3,g3,t+dur*.6+.05)}
function pH(midi,ac){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(m2f(midi),ac.currentTime);g.gain.setValueAtTime(.18,ac.currentTime);o.connect(g);g.connect(masterGain);o.start();trk(o,g,Infinity);return{osc:o,gain:g}}
function pSN(m){const ac=initAudio();pT(m,ac.currentTime,1.5,ac)}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(loopTimer||holdOscs.length))stopAll()});
function setVoice(v,el){voiceMode=v;document.querySelectorAll('#voiceFull,#voiceShell').forEach(b=>b.classList.remove('on'));el.classList.add('on');if(cur){display();if(isContinuous()){stopAll();playChord()}}}
function shellFilter(ivs,roles){
  const altered=new Set();ivs.forEach((iv,i)=>{const pc=iv%12;const r=roles[i];if(r==='5th'&&(pc===6||pc===8))altered.add(i);if(r==='9th'&&(pc===1||pc===3))altered.add(i);if(r==='11th'&&pc===6)altered.add(i);if(r==='13th'&&(pc===8||pc===10))altered.add(i)});const keep=new Set();ivs.forEach((iv,i)=>{const r=roles[i];if(r==='root'||r==='3rd'||r==='4th'||r==='2nd'||r==='7th')keep.add(i)});const ext=['13th','11th','9th'];for(const e of ext){const idx=roles.indexOf(e);if(idx!==-1){keep.add(idx);break}}altered.forEach(i=>keep.add(i));const fi=[],fr=[];ivs.forEach((iv,i)=>{if(keep.has(i)){fi.push(iv);fr.push(roles[i])}});
  if (!fr.some(r => r.includes('7') || r.includes('6') || r.includes('13'))) {
     const rootIdx = fr.indexOf('root');
     if(rootIdx !== -1) {
        fi.push(fi[rootIdx] + 12);
        fr.push('root');
     }
  }
  return{ivs:fi,roles:fr}
}
function pianoV(rs,ivs){let useIvs=ivs,useRoles=cur?cur.roles:[];if(voiceMode==='shell'&&cur){const sf=shellFilter(ivs,cur.roles);useIvs=sf.ivs;useRoles=sf.roles}const base=12*(3+pianoOct),root=base+rs;let s=useIvs.map(iv=>root+iv);if(inv==='1st'&&s.length>=2){s[0]+=12;s.sort((a,b)=>a-b)}else if(inv==='2nd'&&s.length>=3){s[0]+=12;s[1]+=12;s.sort((a,b)=>a-b)}else if(inv==='3rd'&&s.length>=4){s[0]+=12;s[1]+=12;s[2]+=12;s.sort((a,b)=>a-b)}return s}
function gPS(){if(!cur)return[];return playSrc==='guitar'?guitarMidi():pianoV(cur.rootSemi,cur.iv)}
function playChord(){
  if(!cur)return;
  stopAll(true);
  
  if(quiz && document.getElementById('quizView').style.display !== 'none' && quizType !== 'audio') {
     if (currentInstrument === 'piano') {
        buildPiano();
        document.querySelectorAll('.piano-note-label').forEach(lbl => lbl.style.display = 'none');
     } else {
        renderSGs();
        document.querySelectorAll('.triad-info, .string-group-header').forEach(el => el.style.visibility = 'hidden');
     }
  }
  
  const ac=initAudio(),now=ac.currentTime,semis=gPS();
  if(!semis.length)return;
  
  const pd=document.getElementById('pdot');
  if(pd) pd.classList.add('on');
  updateFabState(true);
  
  if(playMode==='hold'&&!arp){
    const tsb = document.getElementById('topStopBtn');
    if(tsb) tsb.style.display='flex';
    semis.forEach(s=>{holdOscs.push(pH(s,ac))});
    return;
  }
  if(arp&&playMode==='hold'){
    const tsb = document.getElementById('topStopBtn');
    if(tsb) tsb.style.display='flex';
    const beatDur=60/bpm;let noteInterval;
    if(arpRhythm==='triplet'){noteInterval=beatDur/3}else{noteInterval=beatDur/2}
    const noteDur=Math.max(noteInterval*0.85,0.8);const notesPerMeasure=arpRhythm==='triplet'?12:8;
    const measure=[];for(let i=0;i<notesPerMeasure;i++){measure.push(semis[i%semis.length])}measure[0]=semis[0];
    let ni=0;
    const pN=()=>{const noteIdx=ni%notesPerMeasure;pT(measure[noteIdx],ac.currentTime,noteDur,ac);aK([measure[noteIdx]],false);ni++};
    pN();loopTimer=setInterval(pN,noteInterval*1000);return;
  }
  if(arp&&playMode==='once'){
    const beatDur=60/bpm,noteInterval=arpRhythm==='triplet'?beatDur/3:beatDur/2,noteDur=Math.max(noteInterval*0.85,0.8);
    semis.forEach((s,i)=>{pT(s,now+i*noteInterval,noteDur,ac)});
    aK(semis,true);
    uiTimer=setTimeout(()=>{if(pd) pd.classList.remove('on');updateFabState(false);},semis.length*noteInterval*1000+400);
    return;
  }
  aK(semis,false);semis.forEach((s,i)=>pT(s,now+i*.008,2.5,ac));
  uiTimer=setTimeout(()=>{if(pd) pd.classList.remove('on');updateFabState(false);},2600);
}



function isContinuous(){return loopTimer||holdOscs.length}
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;if(quizTimeout&&(e.code==='Space'||e.code==='Enter')){e.preventDefault();skipQuizWait();return}switch(e.code){case'KeyR':e.preventDefault();if(inputMode==='random'){generate()}else if(inputMode==='manual'){manualRoot=ROOT_POOL[Math.floor(Math.random()*ROOT_POOL.length)].semi;namingMode=Math.random()<0.5?'sharp':'flat';document.getElementById('nameSharp').classList.toggle('on',namingMode==='sharp');document.getElementById('nameFlat').classList.toggle('on',namingMode==='flat');document.querySelectorAll('.root-btn').forEach(x=>x.classList.remove('on'));const rBtns=document.querySelectorAll('.root-btn');if(rBtns[manualRoot])rBtns[manualRoot].classList.add('on');applyManual()}break;case'Space':
e.preventDefault();if(isContinuous()){stopAll()}else{playChord()}break;case'KeyS':e.preventDefault();stopAll();break;case'KeyA':e.preventDefault();toggleArp();break;case'KeyQ':e.preventDefault();toggleQuiz();break;case'Digit1':case'Digit2':case'Digit3':case'Digit4':if(quiz&&document.getElementById('quizView').style.display!=='none'){e.preventDefault();const i=parseInt(e.code.replace('Digit',''));const o=document.querySelectorAll('.qopt');if(o[i-1]&&o[i-1].onclick)o[i-1].click()}break}});
// Default: load G Major 9
buildFilters();buildManualSelectors();
const defCh=CH['maj9'];
cur={type:'maj9',rootSemi:7,flat:false,iv:defCh.iv,roles:defCh.r,ch:defCh};
document.getElementById('bpmSlider').value=120;
document.getElementById('volSlider').value=60;
display();
centerPianoOnChord();





// --- PIANO PINCH ZOOM (MOBILE ONLY) ---
let initialPinchDist = null;
let initialPinchScale = 1;

document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2 && e.target.closest('#pianoWrap')) {
        initialPinchDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        initialPinchScale = window.pianoKeyScale || 1;
    }
}, {passive: false});

document.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialPinchDist && e.target.closest('#pianoWrap')) {
        e.preventDefault(); // Stop native page zoom
        const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        let newScale = initialPinchScale * (dist / initialPinchDist);
        newScale = Math.max(0.6, Math.min(newScale, 2.0)); // Limits zoom (60% to 200%)
        window.pianoKeyScale = newScale;
        
        const inner = document.querySelector('.piano-inner');
        if (inner) {
            const baseKW = window.innerWidth <= 1000 ? 32 : 42;
            const baseBKW = window.innerWidth <= 1000 ? 20 : 26;
            
            // Instantly update the CSS variables
            inner.style.setProperty('--kw', (baseKW * newScale) + 'px');
            inner.style.setProperty('--bkw', (baseBKW * newScale) + 'px');
            
            // Keep the total width updated so scrolling matches the new size
            const wks = inner.querySelectorAll('.wk');
            inner.style.width = (wks.length * baseKW * newScale) + 'px'; 
            syncPianoThumb();
        }
    }
}, {passive: false});

document.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) initialPinchDist = null;
});


