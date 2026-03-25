let curTheme='dark', namingMode='sharp', linkedNav=true, labelMode='notes';

function toggleCollapse(headerEl){headerEl.classList.toggle('open');const body=headerEl.nextElementSibling;if(body)body.classList.toggle('open')}
function isMobile(){return window.innerWidth<=768}
function initMobileCollapse(){if(!isMobile())return;document.querySelectorAll('.collapse-body-target').forEach(el=>{el.classList.add('collapse-body');el.classList.remove('open')})}
window.addEventListener('resize',()=>{document.querySelectorAll('.collapse-body-target').forEach(el=>{if(!isMobile()){el.classList.remove('collapse-body','open');el.style.display=''}else if(!el.classList.contains('collapse-body')){el.classList.add('collapse-body')}})})
document.addEventListener('DOMContentLoaded',initMobileCollapse);

const DARK_THEMES={dark:1,warm:1,ocean:1,gold:1,mint:1,rose:1,vapor:1,midnight:1,ember:1,slate:1};
const THEME_VARS={
warm:{bg:'#1C1410',card:'#28201A',cardB:'#5C4838',muted:'#342A22',txt:'#F0E0D0',txt2:'#C8A888',txt3:'#907060',accent:'#D87040',green:'#40B878',btnBg:'#342A22',btnHvr:'#443830',sgBg:'#342A22',sgB:'#5C4838',tagBg:'#342A22',tagC:'#C8A888'},
ocean:{bg:'#0C1520',card:'#142030',cardB:'#2A4060',muted:'#1A2840',txt:'#D8E8F8',txt2:'#88A8C8',txt3:'#587898',accent:'#40A0E0',green:'#40C890',btnBg:'#1A2840',btnHvr:'#2A3850',sgBg:'#1A2840',sgB:'#2A4060',tagBg:'#1A2840',tagC:'#88A8C8'},
gold:{bg:'#18140C',card:'#24201A',cardB:'#584828',muted:'#302818',txt:'#F0E8D0',txt2:'#C8B080',txt3:'#908060',accent:'#E8A830',green:'#50C080',btnBg:'#302818',btnHvr:'#403828',sgBg:'#302818',sgB:'#584828',tagBg:'#302818',tagC:'#C8B080'},
mint:{bg:'#0A1410',card:'#142420',cardB:'#285040',muted:'#1A2C28',txt:'#D0F0E8',txt2:'#80C8A8',txt3:'#509078',accent:'#40D898',green:'#40D898',btnBg:'#1A2C28',btnHvr:'#283C38',sgBg:'#1A2C28',sgB:'#285040',tagBg:'#1A2C28',tagC:'#80C8A8'},
rose:{bg:'#1A1018',card:'#281C26',cardB:'#503848',muted:'#30202C',txt:'#F0E0EC',txt2:'#C898B8',txt3:'#906880',accent:'#E87AAE',green:'#50C890',btnBg:'#30202C',btnHvr:'#40303C',sgBg:'#30202C',sgB:'#503848',tagBg:'#30202C',tagC:'#C898B8'},
vapor:{bg:'#120E1C',card:'#1E1830',cardB:'#3C3060',muted:'#281E40',txt:'#E8E0F8',txt2:'#A898D0',txt3:'#706090',accent:'#B060F0',green:'#50D0A0',btnBg:'#281E40',btnHvr:'#383050',sgBg:'#281E40',sgB:'#3C3060',tagBg:'#281E40',tagC:'#A898D0'},
midnight:{bg:'#0A0E1C',card:'#141828',cardB:'#2A3460',muted:'#1A2040',txt:'#D8E0F8',txt2:'#8898C8',txt3:'#586898',accent:'#4870E0',green:'#50C0A0',btnBg:'#1A2040',btnHvr:'#2A3050',sgBg:'#1A2040',sgB:'#2A3460',tagBg:'#1A2040',tagC:'#8898C8'},
ember:{bg:'#1C0E0A',card:'#281814',cardB:'#5C3028',muted:'#342018',txt:'#F0D8D0',txt2:'#C89080',txt3:'#906050',accent:'#E05030',green:'#50C080',btnBg:'#342018',btnHvr:'#443028',sgBg:'#342018',sgB:'#5C3028',tagBg:'#342018',tagC:'#C89080'},
slate:{bg:'#14161A',card:'#1E2228',cardB:'#3A4048',muted:'#262A30',txt:'#E0E4E8',txt2:'#98A0A8',txt3:'#687078',accent:'#7090B0',green:'#50C090',btnBg:'#262A30',btnHvr:'#343840',sgBg:'#262A30',sgB:'#3A4048',tagBg:'#262A30',tagC:'#98A0A8'}
};
function applyThemeVars(t){const el=document.documentElement.style;if(t==='light'||t==='dark'){el.cssText='';return}const v=THEME_VARS[t];if(!v){el.cssText='';return}el.setProperty('--bg',v.bg);el.setProperty('--card',v.card);el.setProperty('--card-b','1px solid '+v.cardB);el.setProperty('--muted',v.muted);el.setProperty('--muted-b','1px solid '+v.cardB);el.setProperty('--txt',v.txt);el.setProperty('--txt2',v.txt2);el.setProperty('--txt3',v.txt3);el.setProperty('--accent',v.accent);el.setProperty('--green',v.green);el.setProperty('--btn-bg',v.btnBg);el.setProperty('--btn-hvr',v.btnHvr);el.setProperty('--inv-bg',v.txt);el.setProperty('--inv-fg',v.bg);el.setProperty('--sg-bg',v.sgBg);el.setProperty('--sg-b',v.sgB);el.setProperty('--tag-bg',v.tagBg);el.setProperty('--tag-c',v.tagC)}

function setLabels(m,el){labelMode=m;document.querySelectorAll('#lblNotes, #lblDegrees').forEach(b=>b.classList.remove('on'));el.classList.add('on');if(cur){buildPiano();renderSGs()}}
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
const TRIAD_TYPES={'maj':{name:'Major',abbr:'maj',iv:[0,4,7],roles:['R','3','5']},'min':{name:'Minor',abbr:'min',iv:[0,3,7],roles:['R','3','5']},'aug':{name:'Aug',abbr:'aug',iv:[0,4,8],roles:['R','3','5']},'dim':{name:'Dim',abbr:'dim',iv:[0,3,6],roles:['R','3','5']},'sus4':{name:'Sus4',abbr:'sus4',iv:[0,5,7],roles:['R','4','5']},'sus2':{name:'Sus2',abbr:'sus2',iv:[0,2,7],roles:['R','2','5']}};

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
function genTV(td,trs,sg,pr){const v=[],invs=[{name:'Root pos',order:[0,1,2]},{name:'1st inv',order:[1,2,0]},{name:'2nd inv',order:[2,0,1]}];for(const inv of invs){const notes=inv.order.map(i=>td.iv[i]),roles=inv.order.map(i=>td.roles[i]),pR=inv.order.map(i=>pr[i]),frets=[];for(let si=0;si<3;si++){const idx=sg.indices[si],os=GS[idx],ts=(trs+notes[si])%12;frets.push({fret:((ts-os)%12+12)%12,role:roles[si],parentRole:pR[si],stringIdx:idx})}const best=findSpan(frets);if(best){const fv=Array(6).fill(null);best.forEach(f=>{fv[f.stringIdx]={fret:f.fret,deg:f.parentRole,finger:0}});v.push({name:inv.name,voicing:fv,br:null})}}return v}
function findSpan(frets){const c=[];for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let d=0;d<3;d++){const s=[a,b,d],adj=frets.map((f,i)=>{let fr=f.fret;if(s[i]===1)fr+=12;if(s[i]===2)fr-=12;return{...f,fret:fr}});if(adj.some(f=>f.fret<0||f.fret>19))continue;const ft=adj.filter(f=>f.fret>0);const allFrets=adj.map(f=>f.fret);const hasOpen=allFrets.some(f=>f===0);const maxFret=Math.max(...allFrets);if(hasOpen&&maxFret>5)continue;if(!ft.length){c.push({v:adj,span:0,min:0});continue}const mn=Math.min(...ft.map(f=>f.fret)),mx=Math.max(...ft.map(f=>f.fret));
if(mx-mn<=4)c.push({v:adj,span:mx-mn,min:mn})}if(!c.length)return null;

c.sort((a,b)=>{const aOpen=a.v.some(f=>f.fret===0)?1:0,bOpen=b.v.some(f=>f.fret===0)?1:0;if(aOpen!==bOpen)return aOpen-bOpen;return a.span!==b.span?a.span-b.span:a.min-b.min});return c[0].v}
function buildGT(ct,rs){const at=findTriads(ct);return STRING_GROUPS.map(sg=>{const v=[];for(const t of at){const trs=(rs+t.triadRootInterval)%12;genTV(t.triadDef,trs,sg,t.parentRoles).forEach(vv=>{const ch2=CH[ct];const roleIvMap={};ch2.r.forEach((r,i)=>{roleIvMap[r]=ch2.iv[i]});vv.voicing.forEach(vn=>{if(vn)vn.civ=roleIvMap[vn.deg]||0});v.push({...vv,triadAbbr:t.triadAbbr,triadRootRole:t.triadRootRole,triadRootSemi:trs})})}
  if(v.length>1){function tDist(a,b){let d=0;for(let s=0;s<6;s++){const an=a.voicing[s],bn=b.voicing[s];if(an&&bn)d+=Math.abs(an.fret-bn.fret);else if(an||bn)d+=5}return d}
  const rootIdx=v.findIndex(x=>x.name==='Root pos'&&x.triadRootRole==='root');const order=[rootIdx>=0?rootIdx:0];const used=new Set(order);while(order.length<v.length){let bestI=-1,bestD=Infinity;for(let i=0;i<v.length;i++){if(used.has(i))continue;const d=tDist(v[order[order.length-1]],v[i]);if(d<bestD){bestD=d;bestI=i}}if(bestI===-1)break;order.push(bestI);used.add(bestI)}
  const sorted=order.map(i=>v[i]);return{group:sg,voicings:sorted}}
  return{group:sg,voicings:v}})}

const SHELL_BASS_GROUPS=[{label:'Low E Root',bassString:0,otherStrings:[[1,2],[1,3],[2,3],[2,4],[3,4],[3,5]]},{label:'A Root',bassString:1,otherStrings:[[2,3],[2,4],[3,4],[3,5],[4,5]]}];
function getShellNotes(ct){const ch=CH[ct];if(!ch||ch.iv.length<4)return null;const ri=ch.r.indexOf('root');if(ri===-1)return null;const others=[];ch.r.forEach((r,i)=>{if(r!=='root'&&r!=='5th')others.push(i)});if(others.length<2)return null;const shells=[];for(let a=0;a<others.length;a++){for(let b=a+1;b<others.length;b++){const ai=others[a],bi=others[b];const rA=ch.r[ai],rB=ch.r[bi];const sA=RS2[rA]||rA,sB=RS2[rB]||rB;shells.push({iv:[ch.iv[ri],ch.iv[ai],ch.iv[bi]],roles:['R',sA,sB],parentRoles:['root',rA,rB],label:'R-'+sA+'-'+sB})}}return shells}
function genShellV(shellDef,rootSemi,bassString,otherStrings,ct){const v=[],ch=CH[ct],roleIvMap={};ch.r.forEach((r,i)=>{roleIvMap[r]=ch.iv[i]});
  const bassOpen=GS[bassString],rootPC=rootSemi%12,rootFret=((rootPC-bassOpen)%12+12)%12;
  const noteA_PC=(rootSemi+shellDef.iv[1])%12,noteB_PC=(rootSemi+shellDef.iv[2])%12;
  const orderings=[{mid:noteA_PC,hi:noteB_PC,midRole:shellDef.parentRoles[1],hiRole:shellDef.parentRoles[2],name:shellDef.label},{mid:noteB_PC,hi:noteA_PC,midRole:shellDef.parentRoles[2],hiRole:shellDef.parentRoles[1],name:'R-'+(RS2[shellDef.parentRoles[2]]||shellDef.parentRoles[2])+'-'+(RS2[shellDef.parentRoles[1]]||shellDef.parentRoles[1])}];
  for(const pair of otherStrings){for(const ord of orderings){const midIdx=pair[0],hiIdx=pair[1];const midOpen=GS[midIdx],hiOpen=GS[hiIdx];
    const midFret=((ord.mid-midOpen)%12+12)%12,hiFret=((ord.hi-hiOpen)%12+12)%12;
    const frets=[{fret:rootFret,parentRole:'root',stringIdx:bassString},{fret:midFret,parentRole:ord.midRole,stringIdx:hiIdx},{fret:hiFret,parentRole:ord.hiRole,stringIdx:hiIdx}];
    const best=findSpan(frets);if(best){const fv=Array(6).fill(null);best.forEach(f=>{fv[f.stringIdx]={fret:f.fret,deg:f.parentRole,civ:roleIvMap[f.parentRole]||0,finger:0}});
      const strNums=best.map(f=>6-f.stringIdx).sort((a,b)=>a-b).join('-');
      v.push({name:ord.name+' ('+strNums+')',voicing:fv,br:null,triadAbbr:'shell',triadRootRole:'root',triadRootSemi:rootSemi,shellLabel:shellDef.label})}}}
  return v}
function buildGS(ct,rs){const shells=getShellNotes(ct);if(!shells)return[{group:{label:'Low E Root',name:''},voicings:[]},{group:{label:'A Root',name:''},voicings:[]}];
  const eAll=[],aAll=[];
  for(const shellDef of shells){
    for(const bg of SHELL_BASS_GROUPS){const vv=genShellV(shellDef,rs,bg.bassString,bg.otherStrings,ct);if(bg.bassString===0)eAll.push(...vv);else aAll.push(...vv)}}
  const eFinal=[],aFinal=[],usedA=new Set();
  const vOrder=v=>v.name.replace(/\s*\(.*\)/,'');
  const flipOrder=o=>{const p=o.split('-');return p.length===3?p[0]+'-'+p[2]+'-'+p[1]:o};
  for(const ev of eAll){const eo=vOrder(ev);const ai=aAll.findIndex((av,i)=>!usedA.has(i)&&av.shellLabel===ev.shellLabel&&vOrder(av)===flipOrder(eo));if(ai!==-1){eFinal.push(ev);aFinal.push(aAll[ai]);usedA.add(ai)}}
  function vDist(a,b){let d=0,sameStr=true;for(let s=0;s<6;s++){const an=a.voicing[s],bn=b.voicing[s];if(an&&bn){d+=Math.abs(an.fret-bn.fret)}else if(an||bn){sameStr=false;d+=5}}if(!sameStr)d+=10;return d}
  function proxSort(arr,seedIdx){if(arr.length<=1)return arr.map((_,i)=>i);const order=[seedIdx>=0?seedIdx:0];const used=new Set(order);while(order.length<arr.length){let bestI=-1,bestD=Infinity;for(let i=0;i<arr.length;i++){if(used.has(i))continue;const d=vDist(arr[order[order.length-1]],arr[i]);if(d<bestD){bestD=d;bestI=i}}if(bestI===-1)break;order.push(bestI);used.add(bestI)}return order}
  
// determine ideal seed order based on chord's color tones
  const chRoles=CH[ct]?CH[ct].r:[];
  const has7=chRoles.includes('7th');
  const has3=chRoles.includes('3rd');
  const has13=chRoles.includes('13th');
  const has4=chRoles.includes('4th');
  // pick the two main color tones for seeding: 7+3, 13+3, 7+4, etc.
  let eTarget,aTarget;
  if(has7&&has3){eTarget='R-7-3';aTarget='R-3-7'}
  else if(has13&&has3){eTarget='R-13-3';aTarget='R-3-13'}
  else if(has7&&has4){eTarget='R-7-4';aTarget='R-4-7'}
  else{eTarget='R-7-3';aTarget='R-3-7'}
  let eSeed=eFinal.findIndex((v,i)=>vOrder(v)===eTarget&&v.name.includes('6-4-3')&&vOrder(aFinal[i])===aTarget&&aFinal[i].name.includes('5-4-3'));
  if(eSeed===-1)eSeed=eFinal.findIndex(v=>vOrder(v)===eTarget&&v.name.includes('6-4-3'));
  if(eSeed===-1)eSeed=eFinal.findIndex(v=>vOrder(v)===eTarget);
  if(eSeed===-1)eSeed=0;
  const idxOrder=proxSort(eFinal,eSeed);

  const sortedE=idxOrder.map(i=>eFinal[i]),sortedA=idxOrder.map(i=>aFinal[i]);
  return[{group:{label:'Low E Root',name:''},voicings:sortedE},{group:{label:'A Root',name:''},voicings:sortedA}]}

const DROP2_STRING_GROUPS=[{label:'STR 4-3-2-1',indices:[2,3,4,5],name:'D G B E'},{label:'STR 5-4-3-2',indices:[1,2,3,4],name:'A D G B'}];
const DROP2_INV_NAMES=['Root pos','1st inv','2nd inv','3rd inv'];
function isDrop2Chord(ct){const ch=CH[ct];return ch&&ch.iv.length>=4}
function findSpan4(frets){const c=[];const n=frets.length;const octs=new Array(n).fill(0);function recurse(idx){if(idx===n){const adj=frets.map((f,i)=>{let fr=f.fret;if(octs[i]===1)fr+=12;if(octs[i]===2)fr-=12;return{...f,fret:fr}});if(adj.some(f=>f.fret<0||f.fret>19))return;const ft=adj.filter(f=>f.fret>0);const allFrets=adj.map(f=>f.fret);const hasOpen=allFrets.some(f=>f===0);const maxFret=Math.max(...allFrets);if(hasOpen&&maxFret>5)return;if(!ft.length){c.push({v:adj,span:0,min:0});return}const mn=Math.min(...ft.map(f=>f.fret)),mx=Math.max(...ft.map(f=>f.fret));if(mx-mn<=4)c.push({v:adj,span:mx-mn,min:mn});return}for(let o=0;o<3;o++){octs[idx]=o;recurse(idx+1)}}recurse(0);if(!c.length)return null;c.sort((a,b)=>{const aOpen=a.v.some(f=>f.fret===0)?1:0,bOpen=b.v.some(f=>f.fret===0)?1:0;if(aOpen!==bOpen)return aOpen-bOpen;return a.span!==b.span?a.span-b.span:a.min-b.min});return c[0].v}

const DROP2_BASE_MAP={'0,4,7,11':'Δ7','0,3,7,10':'m7','0,4,7,10':'7','0,3,6,10':'ø7','0,3,6,9':'°7','0,4,7,9':'6','0,3,7,9':'m6','0,3,7,11':'m(Δ7)','0,5,7,10':'7sus4','0,4,6,10':'7♭5','0,3,6,11':'°(Δ7)'};

function genDrop2Voicings(ct,rs,sg,targetRoles,d2Name,d2Label){const ch=CH[ct];const ivs=[],roles=[];targetRoles.forEach(tr=>{const idx=ch.r.indexOf(tr);if(idx!==-1){ivs.push(ch.iv[idx]);roles.push(ch.r[idx])}});if(ivs.length!==4)return[];const v=[];const roleIvMap={};ch.r.forEach((r,i)=>{roleIvMap[r]=ch.iv[i]});for(let inv=0;inv<4;inv++){const closeIvs=[],closeRoles=[];for(let i=0;i<4;i++){closeIvs.push(ivs[(inv+2+i)%4]);closeRoles.push(roles[(inv+2+i)%4])}const dropIvs=[closeIvs[2],closeIvs[0],closeIvs[1],closeIvs[3]];const dropRoles=[closeRoles[2],closeRoles[0],closeRoles[1],closeRoles[3]];const bottomIv=dropIvs[0];const rebasedIvs=dropIvs.map(iv=>{let d=iv-bottomIv;while(d<0)d+=12;return d});for(let i=1;i<rebasedIvs.length;i++){while(rebasedIvs[i]<=rebasedIvs[i-1])rebasedIvs[i]+=12}const frets=[];for(let si=0;si<4;si++){const idx=sg.indices[si],os=GS[idx],target=(rs+rebasedIvs[si]+bottomIv)%12;const fret=((target-os)%12+12)%12;frets.push({fret,role:dropRoles[si],parentRole:dropRoles[si],stringIdx:idx})}const best=findSpan4(frets);if(best){const fv=Array(6).fill(null);best.forEach(f=>{fv[f.stringIdx]={fret:f.fret,deg:f.parentRole,civ:roleIvMap[f.parentRole]||0,finger:0}});v.push({name:DROP2_INV_NAMES[inv],voicing:fv,br:null,triadAbbr:'drop2',triadRootRole:'root',triadRootSemi:rs,drop2Inv:inv,d2Name:d2Name,d2Label:d2Label})}}return v}

function buildDrop2Groups(ct,rs){if(!isDrop2Chord(ct))return[];const ch=CH[ct];return DROP2_STRING_GROUPS.map(sg=>{let v=[];const baseRoles=ch.r.slice(0,4);const baseIvs=baseRoles.map(r=>ch.iv[ch.r.indexOf(r)]);const baseNorm=baseIvs.map(iv=>(iv-baseIvs[0]+12)%12).join(',');const baseLbl=spellNote(rs,0,'root',namingMode==='flat')+(DROP2_BASE_MAP[baseNorm]||ch.s)+' (root)';v.push(...genDrop2Voicings(ct,rs,sg,baseRoles,'base',baseLbl));if(ch.r.includes('9th')){const r9Roles=['3rd','5th','7th','9th'];const r9Ivs=r9Roles.map(r=>ch.iv[ch.r.indexOf(r)]);if(r9Ivs.every(x=>x!==undefined)){const r9Norm=r9Ivs.map(iv=>(iv-r9Ivs[0]+12)%12).join(',');const r9Lbl=spellNote(rs,r9Ivs[0],'3rd',namingMode==='flat')+(DROP2_BASE_MAP[r9Norm]||'m7')+' (3rd)';v.push(...genDrop2Voicings(ct,rs,sg,r9Roles,'rootless9',r9Lbl))}}if(v.length>1){function dDist(a,b){let d=0;for(let s=0;s<6;s++){const an=a.voicing[s],bn=b.voicing[s];if(an&&bn)d+=Math.abs(an.fret-bn.fret);else if(an||bn)d+=5}return d}const seedIdx=v.findIndex(x=>x.name==='Root pos'&&x.d2Name==='base');const order=[seedIdx>=0?seedIdx:0];const used=new Set(order);while(order.length<v.length){let bestI=-1,bestD=Infinity;for(let i=0;i<v.length;i++){if(used.has(i))continue;const d=dDist(v[order[order.length-1]],v[i]);if(d<bestD){bestD=d;bestI=i}}if(bestI===-1)break;order.push(bestI);used.add(bestI)}const sorted=order.map(i=>v[i]);return{group:sg,voicings:sorted}}return{group:sg,voicings:v}})}

let guitarDiagMode='triads';

function setGuitarDiagMode(m){guitarDiagMode=m;document.getElementById('gTabTriads').classList.toggle('on',m==='triads');document.getElementById('gTabShells').classList.toggle('on',m==='shells');document.getElementById('gTabDrop2').classList.toggle('on',m==='drop2');if(cur)buildGuitar(cur.type,cur.rootSemi)}
const DEG_COLORS={'R':{bg:'#D85A30'},'3':{bg:'#378ADD'},'5':{bg:'#639922'},'7':{bg:'#BA7517'},'9':{bg:'#7F77DD'},'11':{bg:'#1D9E75'},'13':{bg:'#D4537E'},'4':{bg:'#1D9E75'},'2':{bg:'#7F77DD'},root:{bg:'#D85A30'},'3rd':{bg:'#378ADD'},'5th':{bg:'#639922'},'7th':{bg:'#BA7517'},'9th':{bg:'#7F77DD'},'11th':{bg:'#1D9E75'},'13th':{bg:'#D4537E'},'4th':{bg:'#1D9E75'},'2nd':{bg:'#7F77DD'}};

const RS2={root:'R','3rd':'3','5th':'5','7th':'7','9th':'9','11th':'11','13th':'13','4th':'4','2nd':'2'};
let ctd=[],sgi=[0,0,0];

function aK(semis,isA){const keys=document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk');semis.forEach((m,i)=>{const d=isA?i*150:i*8;setTimeout(()=>{keys.forEach(k=>{if(parseInt(k.dataset.midi)===m){k.classList.add('key-flash');setTimeout(()=>k.classList.remove('key-flash'),300)}})},d)})}
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
  const keyW=window.innerWidth<=768?52:42,bkW=window.innerWidth<=768?32:26,totalW=whiteNotes.length*keyW;
  const inner=document.createElement('div');
  inner.className='piano-inner';
  inner.style.width=totalW+'px';
  whiteNotes.forEach((n,i)=>{
    const k=document.createElement('div');k.className='wk';
    k.dataset.semi=n.semi;k.dataset.midi=n.midi;
    k.style.left=(i*keyW)+'px';k.style.width=keyW+'px';
    let lblTxt = ND_name(n.semi);
    if(labelMode==='degrees'){lblTxt=(n.isActive&&ch&&n.chordIdx!==-1)?qualDeg(ch.r[n.chordIdx],ch.iv[n.chordIdx]):qualDeg('generic',(n.midi-rootMidi+144)%12);}
    if(n.isActive&&ch&&n.chordIdx!==-1){k.classList.add(LC[ch.r[n.chordIdx]]||'lroot');}
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
    k.style.left=((wIdx+1)*keyW-Math.round(bkW/2))+'px';k.style.width=bkW+'px';
    let lblTxt = ND_name(n.semi);
    if(labelMode==='degrees'){lblTxt=(n.isActive&&ch&&n.chordIdx!==-1)?qualDeg(ch.r[n.chordIdx],ch.iv[n.chordIdx]):qualDeg('generic',(n.midi-rootMidi+144)%12);}
    if(n.isActive&&ch&&n.chordIdx!==-1){k.classList.add(LC[ch.r[n.chordIdx]]||'lroot');}
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
  const highlighted=wrap.querySelectorAll('.lroot,.l3,.l5,.l7,.l9,.l11,.l13,.ld');
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
function getShellDropped(){if(voiceMode!=='shell'||!cur||!cur.ch||cur.iv.length<=3)return new Set();
const ivs=cur.iv,roles=cur.roles;const altered=new Set();ivs.forEach((iv,i)=>{const pc=iv%12;const r=roles[i];if(r==='5th'&&(pc===6||pc===8))altered.add(i);if(r==='9th'&&(pc===1||pc===3))altered.add(i);if(r==='11th'&&pc===6)altered.add(i);if(r==='13th'&&(pc===8||pc===10))altered.add(i)});const keep=new Set();ivs.forEach((iv,i)=>{const r=roles[i];if(r==='root'||r==='3rd'||r==='4th'||r==='2nd'||r==='7th')keep.add(i)});const ext=['13th','11th','9th'];for(const e of ext){const idx=roles.indexOf(e);if(idx!==-1){keep.add(idx);break}}altered.forEach(i=>keep.add(i));const dropped=new Set();ivs.forEach((iv,i)=>{if(!keep.has(i))dropped.add(i)});return dropped}
function getShellKeptRoles(){
if(voiceMode!=='shell'||!cur||!cur.ch||cur.iv.length<=3)return null;
const dropped=getShellDropped();const kept=new Set();cur.roles.forEach((r,i)=>{if(!dropped.has(i))kept.add(r)});return kept}
function buildPills(names,roles){const r=document.getElementById('notePills');r.innerHTML='';const dropped=getShellDropped();names.forEach((n,i)=>{const p=document.createElement('div');p.className='npill';if(dropped.has(i))p.style.opacity='0.3';const m=60+cur.rootSemi+cur.iv[i];p.onclick=()=>{pSN(m);p.querySelector('.npill-name').classList.add('ring');setTimeout(()=>p.querySelector('.npill-name').classList.remove('ring'),400)};p.innerHTML=`<div class="npill-name ${RC[roles[i]]||''}">${n}</div><div class="npill-role">${roles[i]}</div>`;r.appendChild(p)})}
function buildTriadList(ct,rs){
  const sec=document.getElementById('triadListSec'),tags=document.getElementById('triadListTags');
  const triads=findTriads(ct);
  if(!triads.length){sec.style.display='none';return}
  tags.innerHTML='';
  const keptRoles=getShellKeptRoles();
  triads.forEach(t=>{
    const rootName=spellNote(rs,t.triadRootInterval,t.triadRootRole,namingMode==='flat');
    const sp=document.createElement('span');
    sp.className='triad-list-tag '+(RC[t.triadRootRole]||'');
    sp.textContent=rootName+' '+t.triadAbbr+' ('+t.triadRootRole+')';
    if(keptRoles&&!t.parentRoles.every(r=>keptRoles.has(r)))sp.style.opacity='0.3';
    sp.onclick=()=>{
      if(guitarDiagMode!=='triads'){setGuitarDiagMode('triads')}
      jumpToTriadVoicing(t.triadAbbr, t.triadRootRole, 'Root pos');
      const ac=initAudio(),now=ac.currentTime;
      const semis = playSrc === 'guitar' ? guitarMidi() : t.triadDef.iv.map(iv=>12*(3+octShift)+rs+t.triadRootInterval+iv);
      if(semis && semis.length){
        stopAll();aK(semis,false);
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
  tags.innerHTML='';
  shells.forEach(sh=>{
    const sp=document.createElement('span');
    sp.className='triad-list-tag';
    const lastRole=sh.parentRoles[sh.parentRoles.length-1];
    const cls=RC[lastRole]||'';
    if(cls)sp.classList.add(cls);
    sp.textContent=sh.label;
    sp.title=sh.parentRoles.join(' + ');
    sp.onclick=()=>{
      if(guitarDiagMode!=='shells'){setGuitarDiagMode('shells')}
      jumpToShellVoicing(sh.label);
      const ac=initAudio(),now=ac.currentTime;
      const semis = playSrc === 'guitar' ? guitarMidi() : sh.iv.map(iv=>12*(3+octShift)+rs+iv);
      if(semis && semis.length){
        stopAll();aK(semis,false);
        semis.forEach((s,i)=>pT(s,now+i*.008,2.5,ac));
      }
    };
    tags.appendChild(sp);

  });
  sec.style.display='flex';
}

function buildDrop2List(ct,rs){
  const sec=document.getElementById('drop2ListSec'),tags=document.getElementById('drop2ListTags');
  if(!isDrop2Chord(ct)){sec.style.display='none';return}
  const ch=CH[ct];
  tags.innerHTML='';
  const makeBtn=(lbl,d2Name,roles,cls)=>{
    const sp=document.createElement('span');
    sp.className='triad-list-tag '+cls;
    sp.textContent=lbl;
    sp.onclick=()=>{
      if(guitarDiagMode!=='drop2'){setGuitarDiagMode('drop2')}
      jumpToDrop2Voicing('Root pos',d2Name);
      const ac=initAudio(),now=ac.currentTime;
      const ivsToPlay=[];
      roles.forEach(tr=>{
        const idx=ch.r.indexOf(tr);
        if(idx!==-1)ivsToPlay.push(ch.iv[idx])
      });
      const semis=playSrc==='guitar'?guitarMidi():ivsToPlay.map(iv=>12*(3+octShift)+rs+iv);
      if(semis&&semis.length){
        stopAll();aK(semis,false);
        semis.forEach((s,si)=>pT(s,now+si*.008,2.5,ac))
      }
    };
    tags.appendChild(sp)
  };
  const baseRoles=ch.r.slice(0,4);
  const baseIvs=baseRoles.map(r=>ch.iv[ch.r.indexOf(r)]);
  const baseNorm=baseIvs.map(iv=>(iv-baseIvs[0]+12)%12).join(',');
  const baseLbl=spellNote(rs,0,'root',namingMode==='flat')+(DROP2_BASE_MAP[baseNorm]||ch.s)+' (root)';
  makeBtn(baseLbl,'base',baseRoles,'pr');
  if(ch.r.includes('9th')){
    const r9Roles=['3rd','5th','7th','9th'];
    const r9Ivs=r9Roles.map(r=>ch.iv[ch.r.indexOf(r)]);
    if(r9Ivs.every(x=>x!==undefined)){
      const r9Norm=r9Ivs.map(iv=>(iv-r9Ivs[0]+12)%12).join(',');
      const r9Lbl=spellNote(rs,r9Ivs[0],'3rd',namingMode==='flat')+(DROP2_BASE_MAP[r9Norm]||'m7')+' (3rd)';
      makeBtn(r9Lbl,'rootless9',r9Roles,'p3')
    }
  }
  sec.style.display='flex'
}

function jumpToDrop2Voicing(invName,d2Name='base'){
  ctd.forEach((sg,gi)=>{
    const idx=sg.voicings.findIndex(v=>v.name===invName&&v.d2Name===d2Name);
    if(idx!==-1){
      sgi[gi]=idx;
      const ct=document.getElementById('sgC-'+gi);
      if(ct)ct.textContent=(sgi[gi]+1)+'/'+sg.voicings.length;
      const v=sg.voicings[sgi[gi]],info=document.getElementById('sgI-'+gi);
      if(info){info.innerHTML=sgInfoHtml(v)}
      drawSG(gi)
    }
  });
  bGL()
}

let progTimer=null,activeProg=null,activeProgRoot=null,progChordPreviewTimer=null;
function stopProg(){if(progChordPreviewTimer){clearTimeout(progChordPreviewTimer);progChordPreviewTimer=null}if(progTimer){clearInterval(progTimer);progTimer=null}activeProg=null;activeProgRoot=null;document.querySelectorAll('.prog-tag').forEach(t=>{t.classList.remove('prog-playing')});progClearPiano();if(cur)buildPiano()}

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
  // check if any chord in progression has 4+ notes — if so, all chords use bass separation
  const hasBigChord=prog.chords.some(ch=>{const cd=CH[ch.t];return cd&&cd.iv.length>=4});
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
  keys.forEach(k=>{if(k.dataset.mainFaded){k.style.transition='background 0.4s, border-color 0.4s';if(k.dataset.origClass){k.className=k.dataset.origClass;delete k.dataset.origClass}delete k.dataset.mainFaded;const lbl=k.querySelector('.piano-note-label');if(lbl){lbl.style.transition='color 0.4s';if(k.dataset.origLblColor){lbl.style.color=k.dataset.origLblColor;delete k.dataset.origLblColor}else{lbl.style.removeProperty('color')}}}})}
const DEG_BG={root:['#D85A30','#B84420'],'3rd':['#378ADD','#2070C0'],'5th':['#639922','#4D7A15'],'7th':['#BA7517','#9A6010'],'9th':['#7F77DD','#6560C0'],'11th':['#1D9E75','#158060'],'13th':['#D4537E','#B84065'],'4th':['#1D9E75','#158060'],'2nd':['#7F77DD','#6560C0'],dim:['#D4537E','#B84065']};
function progHighlightPiano(semis,chD,isMainChord,cRoot,chDef){
  progClearPiano();
  progFadeOutMain();
  const keys=document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk');
  const col=progFuncColor(chD);
  semis.forEach(m=>{keys.forEach(k=>{if(parseInt(k.dataset.midi)===m){k.style.transition='none';k.style.background=col[0];k.style.borderColor=col[1];k.dataset.progHl='1';const lbl=k.querySelector('.piano-note-label');if(lbl){lbl.style.transition='none';lbl.style.color='rgba(255,255,255,.95)'}}})});}

function progClearPiano(){const keys=document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk');keys.forEach(k=>{k.style.transition='none';if(k.dataset.progHl){k.style.removeProperty('background');k.style.removeProperty('border-color');delete k.dataset.progHl;const lbl=k.querySelector('.piano-note-label');if(lbl){lbl.style.transition='none';lbl.style.removeProperty('color')}}if(k.dataset.mainFaded){if(k.dataset.origClass){k.className=k.dataset.origClass;delete k.dataset.origClass}delete k.dataset.mainFaded;const lbl=k.querySelector('.piano-note-label');if(lbl){lbl.style.transition='none';if(k.dataset.origLblColor){lbl.style.color=k.dataset.origLblColor;delete k.dataset.origLblColor}else{lbl.style.removeProperty('color')}}}});document.getElementById('pianoKeys').offsetHeight;}
function playProg(prog,rootSemi){if(progChordPreviewTimer){clearTimeout(progChordPreviewTimer);progChordPreviewTimer=null}stopAll();stopProg();activeProg=prog;activeProgRoot=rootSemi;const ac=initAudio();const beatDur=60/bpm;const chordDur=beatDur*2;let ci=0;
  const allVoicings=planProgVoicings(prog,rootSemi);
  const play1=()=>{if(ci>=prog.chords.length){stopProg();progClearPiano();if(cur)buildPiano();return}
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
  play1();progTimer=setInterval(play1,chordDur*1000)}


function progKeyD(prog){const re=/^I(?![VvIi])|^i(?![VvIi])/;for(const ch of prog.chords){if(re.test(ch.n))return ch.d}return 0}

function buildProgs(ty){const s=document.getElementById('progSec'),l=document.getElementById('progList');const p=PR[ty];

if(!p){s.style.display='none';return}l.innerHTML='';const rootSemi=cur?cur.rootSemi:0;p.forEach((prog,pi)=>{prog._idx=pi;const keyD=progKeyD(prog);const row=document.createElement('div');row.className='prog-row';const playBtn=document.createElement('span');playBtn.className='prog-row-label';playBtn.textContent='▶';playBtn.title='Play progression';playBtn.onclick=()=>playProg(prog,rootSemi);row.appendChild(playBtn);
const allVoicings=planProgVoicings(prog,rootSemi);
prog.chords.forEach((ch,ci)=>{if(ci>0){const arr=document.createElement('span');arr.className='prog-arrow';arr.textContent='→';row.appendChild(arr)}const chDef=CH[ch.t];const cRoot=(rootSemi+ch.d)%12;const realName=noteName(cRoot)+' '+(chDef?chDef.s:ch.n);const tag=document.createElement('span');tag.className='prog-tag';tag.dataset.progIdx=pi;const fc=progFuncColor((ch.d-keyD+12)%12);tag.style.background=fc[0];tag.style.color='white';tag.style.borderColor=fc[1];if(ci===prog.cur)tag.classList.add('prog-current');tag.innerHTML='<span style="font-size:9px;color:inherit;opacity:.6;margin-right:3px">'+ch.n+'</span>'+realName;


tag.onclick=()=>{const ac2=initAudio();stopAll();stopProg();buildPiano();const cr=(rootSemi+ch.d)%12;const cd=CH[ch.t];if(!cd)return;
const rawSm=allVoicings[ci];if(!rawSm)return;const sm=rawSm.map(m=>m+(pianoOct-1)*12);
sm.forEach((ss,i)=>pT(ss,ac2.currentTime+i*.008,2.5,ac2));aK(sm,false);progHighlightPiano(sm,(ch.d-keyD+12)%12,(ci===prog.cur),cr,cd);

document.querySelectorAll('.prog-tag').forEach(t=>{t.classList.remove('prog-playing')});
    const tags=document.querySelectorAll('.prog-tag[data-prog-idx="'+prog._idx+'"]');
    if(tags[ci]){tags[ci].classList.add('prog-playing')}
    progChordPreviewTimer=setTimeout(()=>{progChordPreviewTimer=null;progClearPiano();if(cur)buildPiano();document.querySelectorAll('.prog-tag').forEach(t=>t.classList.remove('prog-playing'))},2500);
};row.appendChild(tag)});l.appendChild(row)});s.style.display='flex'}


function updateStats(){document.getElementById('statsInline').style.display='flex';document.getElementById('statC').textContent=chordCount;document.getElementById('statS').textContent=streak;if(quizTotal>0){document.getElementById('statQ').style.display='inline';document.getElementById('statSc').textContent=quizScore+'/'+quizTotal}}

function addHist(rn,lab,ty,rs,fl){histList.push({rn,lab,type:ty,rs,fl});if(histList.length>20)histList.shift();renderHist()}
function renderHist(){const st=document.getElementById('hist');st.style.display=histList.length?'flex':'none';st.innerHTML='';histList.forEach((h,i)=>{const c=document.createElement('div');c.className='hist-chip'+(i===histList.length-1?' current':'');c.textContent=spellRoot(h.rs)+' '+h.lab;c.onclick=()=>{const ch=CH[h.type];cur={type:h.type,rootSemi:h.rs,flat:namingMode==='flat',iv:ch.iv,roles:ch.r,ch};display();setTimeout(playChord,100)};st.appendChild(c)});st.scrollLeft=st.scrollWidth}function display(){if(!cur)return;const ch=cur.ch,ri=cur.rootSemi,fl=namingMode==='flat',names=ch.iv.map((iv,i)=>spellNote(ri,iv,ch.r[i],fl));

document.getElementById('cRoot').textContent=spellRoot(ri);document.getElementById('cType').textContent=ch.l;document.getElementById('cFormula').textContent=ch.f;const i3=document.getElementById('inv3btn');if(i3){const effLen=voiceMode==='shell'?shellFilter(ch.iv,ch.r).ivs.length:ch.iv.length;if(effLen<4){i3.style.display='none';if(inv==='3rd')setInv('root',document.querySelector('button[data-inv="root"]'));}else{i3.style.display='inline-block';}}buildPills(names,ch.r);

buildTriadList(cur.type,ri);buildShellList(cur.type,ri);buildDrop2List(cur.type,ri);buildPiano();buildGuitar(cur.type,ri);buildProgs(cur.type);

document.getElementById('chordView').style.display='block';document.getElementById('quizView').style.display='none';document.getElementById('guitarSection').style.display='block'}
function generate(){stopAll();const t=[...act];if(!t.length)return;const ty=t[Math.floor(Math.random()*t.length)],ch=CH[ty],rp=ROOT_POOL[Math.floor(Math.random()*ROOT_POOL.length)],ri=rp.semi,fl=rp.flat;namingMode=Math.random()<0.5?'sharp':'flat';document.getElementById('nameSharp').classList.toggle('on',namingMode==='sharp');document.getElementById('nameFlat').classList.toggle('on',namingMode==='flat');cur={type:ty,rootSemi:ri,flat:fl,iv:ch.iv,roles:ch.r,ch};chordCount++;streak++;updateStats();const rootName=spellRoot(ri);addHist(rootName,ch.s,ty,ri,fl);const h=document.getElementById('chordHero');h.classList.add('anim-out');setTimeout(()=>{if(quiz){showQuiz(ri,fl,ty)}else{display();h.classList.remove('anim-out');setTimeout(playChord,120)}},150)}

function showQuiz(ri,fl,co){document.getElementById('chordView').style.display='none';document.getElementById('quizView').style.display='block';document.getElementById('guitarSection').style.display='none';document.querySelectorAll('#pianoKeys .wk, #pianoKeys .bk').forEach(k=>{HL.forEach(cls=>k.classList.remove(cls));const lbl=k.querySelector('.piano-note-label');if(lbl)lbl.style.removeProperty('color')});document.getElementById('qRoot').textContent=spellRoot(ri);


const ak=Object.keys(CH),wr=ak.filter(k=>k!==co),opts=[co];while(opts.length<4){const p=wr[Math.floor(Math.random()*wr.length)];if(!opts.includes(p))opts.push(p)}opts.sort(()=>Math.random()-.5);const c=document.getElementById('qOpts');c.innerHTML='';opts.forEach(k=>{const b=document.createElement('button');b.className='qopt';b.textContent=CH[k].l+' ('+CH[k].s+')';b.onclick=()=>ansQuiz(k,co,b);c.appendChild(b)});document.getElementById('revBtn').style.display='block';setTimeout(playChord,200)}
let quizTimeout=null;
function skipQuizWait(){if(quizTimeout){clearTimeout(quizTimeout);quizTimeout=null;document.getElementById('skipHint').style.display='none';display();document.getElementById('chordHero').classList.remove('anim-out')}}
function ansQuiz(ch,co,btn){quizTotal++;document.querySelectorAll('.qopt').forEach(b=>{b.onclick=null;b.style.cursor='default'});document.getElementById('revBtn').style.display='none';if(ch===co){btn.classList.add('correct');quizScore++}else{btn.classList.add('wrong');streak=0;document.querySelectorAll('.qopt').forEach(b=>{if(b.textContent.startsWith(CH[co].l))b.classList.add('correct')})}document.getElementById('scoreTx').textContent=quizScore+' / '+quizTotal;document.getElementById('scoreSt').style.display='block';document.getElementById('skipHint').style.display='block';updateStats();quizTimeout=setTimeout(()=>{quizTimeout=null;document.getElementById('skipHint').style.display='none';display();document.getElementById('chordHero').classList.remove('anim-out')},1800)}
function revealQuiz(){document.getElementById('revBtn').style.display='none';display();document.getElementById('chordHero').classList.remove('anim-out')}
function toggleArp(){arp=!arp;document.getElementById('arpLbl').textContent=arp?'on':'off';document.getElementById('arpBtn').classList.toggle('btn-active',arp);updateRhythmVis();if(!arp)stopAll()}
function toggleQuiz(){quiz=!quiz;document.getElementById('quizLbl').textContent=quiz?'on':'off';document.getElementById('quizBtn').classList.toggle('btn-active',quiz);if(!quiz){quizScore=0;quizTotal=0;document.getElementById('scoreSt').style.display='none';if(quizTimeout){clearTimeout(quizTimeout);quizTimeout=null}document.getElementById('skipHint').style.display='none';document.getElementById('chordHero').classList.remove('anim-out');if(cur)display()}else{if(inputMode==='manual')setInputMode('random');if(playSrc==='guitar')setSrc('piano');generate()}updateStats()}
function setRhythm(r){arpRhythm=r;
document.getElementById('rhStraight').classList.toggle('on',r==='straight');document.getElementById('rhTriplet').classList.toggle('on',r==='triplet');if(isContinuous()){stopAll();playChord()}}
function updateRhythmVis(){document.getElementById('rhythmRow').style.display=(arp&&playMode==='hold')?'':'none'}
function setInv(v,el){inv=v;document.querySelectorAll('.opt-btn[data-inv]').forEach(b=>b.classList.remove('on'));if(el)el.classList.add('on');if(cur)buildPiano();if(activeProg){const p=activeProg,r=activeProgRoot;stopAll();stopProg();playProg(p,r)}else if(isContinuous()){stopAll();playChord()}}
function shiftOct(dir){const maxO=playSrc==='guitar'?-1:4;octShift=Math.max(-2,Math.min(maxO,octShift+dir));if(playSrc==='guitar')guitarOct=octShift;else pianoOct=octShift;document.getElementById('octDisplay').textContent=octShift+3;if(cur){buildPiano();renderSGs()}if(activeProg){const p=activeProg,r=activeProgRoot;stopAll();stopProg();playProg(p,r)}else if(isContinuous()){stopAll();playChord()}}

function setMode(m,el){stopAll();playMode=m;document.querySelectorAll('.opt-btn[data-mode]').forEach(b=>b.classList.remove('on'));el.classList.add('on');updateRhythmVis()}
function setBpm(v){bpm=Number(v);if(isContinuous()){stopAll();playChord()}}
let pianoOct=1,guitarOct=-2;
function setSrc(s){if(playSrc==='piano')pianoOct=octShift;else guitarOct=octShift;playSrc=s;document.getElementById('srcPiano').classList.toggle('on',s==='piano');document.getElementById('srcGuitar').classList.toggle('on',s==='guitar');updateGuitarSrcHighlight();octShift=s==='guitar'?guitarOct:pianoOct;document.getElementById('octDisplay').textContent=octShift+3;if(cur){buildPiano();renderSGs()}if(isContinuous()){stopAll();playChord()}}
function selectAll(){
Object.keys(CH).forEach(k=>act.add(k));document.querySelectorAll('.chip[data-key]').forEach(c=>c.classList.add('on'))}
function selectNone(){const f=Object.keys(CH)[0];act.clear();act.add(f);document.querySelectorAll('.chip[data-key]').forEach(c=>{c.dataset.key===f?c.classList.add('on'):c.classList.remove('on')})}
function toggleGrp(keys){const on=keys.every(k=>act.has(k));if(on){const rem=new Set([...act].filter(k=>!keys.includes(k)));if(!rem.size)return;keys.forEach(k=>{act.delete(k);const c=document.querySelector(`.chip[data-key="${k}"]`);if(c)c.classList.remove('on')})}else{keys.forEach(k=>{act.add(k);const c=document.querySelector(`.chip[data-key="${k}"]`);if(c)c.classList.add('on')})}}
function buildFilters(){const g=document.getElementById('fGrid');g.innerHTML='';FG.forEach(([grp,keys])=>{const row=document.createElement('div');row.className='chord-type-row';const l=document.createElement('span');l.className='grp-lbl';l.textContent=grp;l.onclick=()=>toggleGrp(keys);row.appendChild(l);const cw=document.createElement('div');cw.className='chord-type-chips';keys.forEach(k=>{const c=document.createElement('div');c.className='chip '+(act.has(k)?'on':'');c.dataset.key=k;c.textContent=CH[k].s;c.title=CH[k].l;c.onclick=()=>{if(inputMode==='manual'){manualQuality=k;document.querySelectorAll('.chip[data-key]').forEach(x=>x.classList.remove('on'));c.classList.add('on');act.clear();act.add(k);applyManual()}else{if(act.has(k)&&act.size===1)return;if(act.has(k)){act.delete(k);c.classList.remove('on')}else{act.add(k);c.classList.add('on')}}};cw.appendChild(c)});row.appendChild(cw);g.appendChild(row)})}

/* Guitar */
function buildGuitar(ct,rs){const hasShells=!!getShellNotes(ct);const hasDrop2=isDrop2Chord(ct);document.getElementById('gTabShells').style.display=hasShells?'':'none';document.getElementById('gTabDrop2').style.display=hasDrop2?'':'none';if(guitarDiagMode==='shells'&&!hasShells){guitarDiagMode='triads';document.getElementById('gTabTriads').classList.add('on');document.getElementById('gTabShells').classList.remove('on');document.getElementById('gTabDrop2').classList.remove('on')}if(guitarDiagMode==='drop2'&&!hasDrop2){guitarDiagMode='triads';document.getElementById('gTabTriads').classList.add('on');document.getElementById('gTabShells').classList.remove('on');document.getElementById('gTabDrop2').classList.remove('on')}const grid=document.getElementById('guitarStringGroups');grid.classList.remove('shell-mode','drop2-mode');if(guitarDiagMode==='shells')grid.classList.add('shell-mode');if(guitarDiagMode==='drop2')grid.classList.add('drop2-mode');if(guitarDiagMode==='shells'){ctd=buildGS(ct,rs);sgi=[0,0]}else if(guitarDiagMode==='drop2'){ctd=buildDrop2Groups(ct,rs);sgi=[0,0]}else{ctd=buildGT(ct,rs);sgi=[0,0,0]}renderSGs()}
function toggleLink(){linkedNav=!linkedNav;const b=document.getElementById('linkBtn');b.classList.toggle('on',linkedNav);b.textContent=linkedNav?'Linked':'Unlinked'}

function jumpToShellVoicing(shellLabel){
  ctd.forEach((sg,gi)=>{
    const idx=sg.voicings.findIndex(v=>v.shellLabel===shellLabel);
    if(idx!==-1){
      sgi[gi]=idx;
      const ct=document.getElementById('sgC-'+gi);
      if(ct)ct.textContent=(sgi[gi]+1)+'/'+sg.voicings.length;
      const v=sg.voicings[sgi[gi]],info=document.getElementById('sgI-'+gi);
      if(info){
        const sRoot=spellRoot(cur.rootSemi);const sQual=cur.ch.s;
        info.innerHTML=`<span class="triad-tag">${sRoot} ${sQual} shell</span><span class="triad-name">${v.name}</span>`;
      }
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
    h.innerHTML=`<span class="string-group-label">${sg.group.label} <span style="font-weight:400;color:var(--txt3);font-size:9px">${sg.group.name}</span></span><div class="string-group-nav"><button class="sg-arrow" onclick="sgN(${gi},-1)">‹</button><span class="sg-counter" id="sgC-${gi}">${sgi[gi]+1}/${vc}</span><button class="sg-arrow" onclick="sgN(${gi},1)">›</button></div>`;
    d.appendChild(h);
    const v=sg.voicings[sgi[gi]],info=document.createElement('div');
    info.className='triad-info';
    info.id='sgI-'+gi;
    info.innerHTML=sgInfoHtml(v);
    const sw=document.createElement('div');
    sw.id='sgS-'+gi;
    d.appendChild(info);
    d.appendChild(sw);
    c.appendChild(d);
    drawSG(gi);
  });
  bGL()
}


function setGuitarSrc(gi){guitarSrcGroup=gi;updateGuitarSrcHighlight()}
function updateGuitarSrcHighlight(){document.querySelectorAll('.string-group').forEach((el,i)=>{el.classList.toggle('sg-active',i===guitarSrcGroup&&playSrc==='guitar')});}

function jumpToTriadVoicing(tAbbr, tRole, invName = 'Root pos') {
  ctd.forEach((sg, gi) => {
    const idx = sg.voicings.findIndex(v => v.triadAbbr === tAbbr && v.triadRootRole === tRole && v.name === invName);
    if (idx !== -1) {
      sgi[gi] = idx;
      const ct = document.getElementById('sgC-'+gi);
      if(ct) ct.textContent = (sgi[gi]+1) + '/' + sg.voicings.length;
      const v = sg.voicings[sgi[gi]], info = document.getElementById('sgI-'+gi);
      if(info){
        const rootName = spellNote(cur.rootSemi, (v.triadRootSemi-cur.rootSemi+12)%12, v.triadRootRole, namingMode==='flat');
        info.innerHTML = `<span class="triad-tag">${rootName} ${v.triadAbbr}</span><span class="triad-name">${v.name}</span><span class="triad-role">from ${v.triadRootRole}</span>`;
      }
      drawSG(gi);
            }
          });
          bGL();
        }

function sgInfoHtml(v){
  if(guitarDiagMode==='shells'){
    const sRoot=spellRoot(cur.rootSemi);
    const sQual=cur.ch.s;
    return `<span class="triad-tag">${sRoot} ${sQual} shell</span><span class="triad-name">${v.name}</span>`
  } else if(guitarDiagMode==='drop2'){
    return `<span class="triad-tag">${v.d2Label} drop 2</span><span class="triad-name">${v.name}</span>`
  } else {
    const rootName=spellNote(cur.rootSemi,(v.triadRootSemi-cur.rootSemi+12)%12,v.triadRootRole,namingMode==='flat');
    return `<span class="triad-tag">${rootName} ${v.triadAbbr}</span><span class="triad-name">${v.name}</span><span class="triad-role">from ${v.triadRootRole}</span>`
  }
}
function sgN(gi,dir){

  if(linkedNav){
    for(let g=0;g<ctd.length;g++){const vc=ctd[g].voicings.length;if(!vc)continue;sgi[g]=(sgi[g]+dir+vc)%vc;const ct=document.getElementById('sgC-'+g);if(ct)ct.textContent=(sgi[g]+1)+'/'+vc;const v=ctd[g].voicings[sgi[g]],info=document.getElementById('sgI-'+g);if(info){info.innerHTML=sgInfoHtml(v)}drawSG(g)}
  } else {

const vc=ctd[gi].voicings.length;if(!vc)return;sgi[gi]=(sgi[gi]+dir+vc)%vc;const ct=document.getElementById('sgC-'+gi);if(ct)ct.textContent=(sgi[gi]+1)+'/'+vc;const v=ctd[gi].voicings[sgi[gi]],info=document.getElementById('sgI-'+gi);if(info){info.innerHTML=sgInfoHtml(v)}drawSG(gi);
  }
  bGL();   



updateGuitarSrcHighlight();
if(playSrc==='guitar'){stopAll();const semis=guitarMidi();if(semis.length){const ac=initAudio(),now=ac.currentTime;semis.forEach((s,i)=>pT(s,now+i*.008,2.5,ac));aK(semis,false);document.getElementById('pdot').classList.add('on');setTimeout(()=>document.getElementById('pdot').classList.remove('on'),2000)}}
}
function isLt(){return curTheme==='light'}
const OPEN_STRING_MIDI=[40,45,50,55,59,64];
function drawSG(gi){
  const w=document.getElementById('sgS-'+gi);if(!w)return;
  const sg=ctd[gi];if(!sg||!sg.voicings.length)return;
  const v=sg.voicings[sgi[gi]].voicing;
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
    const col=(DEG_COLORS[deg]||DEG_COLORS['root']).bg;
    const df=vn.fret-dO;
    const noteMidi=OPEN_STRING_MIDI[s]+vn.fret;
    const lblTxt=labelMode==='notes'?ND_name(noteMidi%12):sd;
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','guitar-note-hit');g.setAttribute('data-midi',noteMidi);
    g.addEventListener('click',function(){playGuitarNote(noteMidi,this)});
    if(vn.fret===0||df<=0){
      const ci=document.createElementNS('http://www.w3.org/2000/svg','circle');ci.setAttribute('cx',cx);ci.setAttribute('cy',mt-8);ci.setAttribute('r','9');ci.setAttribute('fill',col);ci.setAttribute('opacity','.9');g.appendChild(ci);
      const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',cx);t.setAttribute('y',mt-4);t.setAttribute('text-anchor','middle');t.setAttribute('font-size',lblTxt.length>1?'8':'10');t.setAttribute('font-family','Fira Code,monospace');t.setAttribute('fill','white');t.setAttribute('font-weight','700');t.textContent=lblTxt;t.style.pointerEvents='none';g.appendChild(t);
    }else{
      const cy=mt+df*fg-fg/2;
      const ci=document.createElementNS('http://www.w3.org/2000/svg','circle');ci.setAttribute('cx',cx);ci.setAttribute('cy',cy);ci.setAttribute('r','12');ci.setAttribute('fill',col);g.appendChild(ci);
      const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',cx);t.setAttribute('y',cy+4);t.setAttribute('text-anchor','middle');t.setAttribute('font-size',lblTxt.length>1?'9':'12');t.setAttribute('font-family','Fira Code,monospace');t.setAttribute('fill','white');t.setAttribute('font-weight','600');t.textContent=lblTxt;t.style.pointerEvents='none';g.appendChild(t);
    }
    svg.appendChild(g);
  }
  w.innerHTML='';w.appendChild(svg);
}
function playGuitarNote(midi,el){pSN(midi+guitarOctShift());const ci=el.querySelector('circle');if(ci){const orig=ci.getAttribute('r');ci.setAttribute('r',String(parseFloat(orig)*1.4));setTimeout(()=>ci.setAttribute('r',orig),200)}}


function bGL(){const el=document.getElementById('guitarLegend');if(!el)return;el.innerHTML='';const seen=new Set();ctd.forEach((sg,gi)=>{if(!sg.voicings.length)return;sg.voicings[sgi[gi]].voicing.forEach(vn=>{if(vn&&vn.deg)seen.add(vn.deg)})});['root','3rd','5th','7th','9th','11th','13th','4th','2nd'].forEach(d=>{if(!seen.has(d))return;const col=(DEG_COLORS[d]||DEG_COLORS['root']).bg,s=document.createElement('span');s.innerHTML=`<div class="gfl" style="background:${col}"></div>${RS2[d]||d} = ${d}`;el.appendChild(s)})}
function guitarOctShift(){return Math.max(0,Math.min(1,guitarOct+2))*12}
function guitarMidi(){const gOct=guitarOctShift();const om=[40,45,50,55,59,64];const gi=guitarSrcGroup;if(gi<ctd.length){const sg=ctd[gi];if(sg.voicings.length){const v=sg.voicings[sgi[gi]],m=[];v.voicing.forEach((x,s)=>{if(x)m.push(om[s]+x.fret+gOct)});if(m.length)return m.sort((a,b)=>a-b)}}return[]}


let act=new Set(Object.keys(CH)),cur=null,arp=false,quiz=false,quizScore=0,quizTotal=0,audioCtx=null,masterGain=null,arpRhythm='straight',inv='root',playMode='once',bpm=120,octShift=1,inputMode='random',manualRoot=7,manualQuality='maj',histList=[],chordCount=0,streak=0,loopTimer=null,holdOscs=[],playSrc='piano',activeNodes=[],guitarSrcGroup=0,voiceMode='full';
let randomAct = new Set(Object.keys(CH));
function setInputMode(m){inputMode=m;document.getElementById('modeRandom').classList.toggle('on',m==='random');document.getElementById('modeManual').classList.toggle('on',m==='manual');document.getElementById('randomBtns').style.display=m==='random'?'grid':'none';document.getElementById('manualBtns').style.display=m==='manual'?'grid':'none';document.getElementById('rootSection').style.display=m==='manual'?'block':'none';document.getElementById('saRow').style.display=m==='manual'?'none':'flex';if(m==='manual'){if(quiz)toggleQuiz();randomAct=new Set(act);manualQuality=[...act][0]||'maj';document.querySelectorAll('.chip[data-key]').forEach(c=>{c.classList.remove('on');if(c.dataset.key===manualQuality)c.classList.add('on')});applyManual()}else{act=new Set(randomAct);document.querySelectorAll('.chip[data-key]').forEach(c=>{c.classList.toggle('on',act.has(c.dataset.key))})}}

function buildManualSelectors(){const rg=document.getElementById('rootGrid');rg.innerHTML='';for(let i=0;i<12;i++){const b=document.createElement('button');b.className='root-btn'+(i===manualRoot?' on':'');b.textContent=rootDisplayName(i);b.onclick=()=>{manualRoot=i;rg.querySelectorAll('.root-btn').forEach(x=>x.classList.remove('on'));b.classList.add('on');applyManual()};rg.appendChild(b)}}
function applyManual(){stopAll();const ch=CH[manualQuality];if(!ch)return;cur={type:manualQuality,rootSemi:manualRoot,flat:namingMode==='flat',iv:ch.iv,roles:ch.r,ch};display();setTimeout(playChord,100)}
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
function shellFilter(ivs,roles){if(ivs.length<=3)return{ivs,roles};
const altered=new Set();ivs.forEach((iv,i)=>{const pc=iv%12;const r=roles[i];if(r==='5th'&&(pc===6||pc===8))altered.add(i);if(r==='9th'&&(pc===1||pc===3))altered.add(i);if(r==='11th'&&pc===6)altered.add(i);if(r==='13th'&&(pc===8||pc===10))altered.add(i)});const keep=new Set();ivs.forEach((iv,i)=>{const r=roles[i];if(r==='root'||r==='3rd'||r==='4th'||r==='2nd'||r==='7th')keep.add(i)});const ext=['13th','11th','9th'];for(const e of ext){const idx=roles.indexOf(e);if(idx!==-1){keep.add(idx);break}}altered.forEach(i=>keep.add(i));const fi=[],fr=[];ivs.forEach((iv,i)=>{if(keep.has(i)){fi.push(iv);fr.push(roles[i])}});return{ivs:fi,roles:fr}}
function pianoV(rs,ivs){let useIvs=ivs,useRoles=cur?cur.roles:[];if(voiceMode==='shell'&&cur){const sf=shellFilter(ivs,cur.roles);useIvs=sf.ivs;useRoles=sf.roles}const base=12*(3+pianoOct),root=base+rs;let s=useIvs.map(iv=>root+iv);if(inv==='1st'&&s.length>=2){s[0]+=12;s.sort((a,b)=>a-b)}else if(inv==='2nd'&&s.length>=3){s[0]+=12;s[1]+=12;s.sort((a,b)=>a-b)}else if(inv==='3rd'&&s.length>=4){s[0]+=12;s[1]+=12;s[2]+=12;s.sort((a,b)=>a-b)}return s}

function gPS(){if(!cur)return[];return playSrc==='guitar'?guitarMidi():pianoV(cur.rootSemi,cur.iv)}
function stopAll(){if(progTimer){clearInterval(progTimer);progTimer=null;document.querySelectorAll('.prog-tag').forEach(t=>{t.classList.remove('prog-playing')});progClearPiano();if(cur)buildPiano()}if(loopTimer){
clearInterval(loopTimer);loopTimer=null}holdOscs.forEach(h=>{

try{h.gain.gain.cancelScheduledValues(audioCtx.currentTime);h.gain.gain.setValueAtTime(h.gain.gain.value,audioCtx.currentTime);h.gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.1);h.osc.stop(audioCtx.currentTime+.15);setTimeout(()=>{try{h.gain.disconnect()}catch(e){}},200)}catch(e){}});holdOscs=[];activeNodes.forEach(n=>{try{n.osc.stop(audioCtx?audioCtx.currentTime+.05:0);n.gain.disconnect()}catch(e){}});activeNodes=[];document.getElementById('pdot').classList.remove('on');document.getElementById('stopBtn').style.display='none'}
function playChord(){if(!cur)return;stopAll();const ac=initAudio(),now=ac.currentTime,semis=gPS();if(!semis.length)return;const pd=document.getElementById('pdot');pd.classList.add('on');
if(playMode==='hold'&&!arp){document.getElementById('stopBtn').style.display='block';semis.forEach(s=>{holdOscs.push(pH(s,ac))});return}
if(arp&&playMode==='hold'){
  document.getElementById('stopBtn').style.display='block';
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
  aK(semis,true);setTimeout(()=>pd.classList.remove('on'),semis.length*noteInterval*1000+400);return;
}
aK(semis,false);semis.forEach((s,i)=>pT(s,now+i*.008,2.5,ac));setTimeout(()=>pd.classList.remove('on'),2000)}

function isContinuous(){return loopTimer||holdOscs.length}

document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;if(quizTimeout&&(e.code==='Space'||e.code==='Enter')){e.preventDefault();skipQuizWait();return}switch(e.code){case'KeyR':e.preventDefault();if(inputMode==='random'){generate()}break;case'Space':
e.preventDefault();if(isContinuous()){stopAll()}else{playChord()}break;case'KeyS':e.preventDefault();stopAll();break;case'KeyA':e.preventDefault();toggleArp();break;case'KeyQ':e.preventDefault();toggleQuiz();break;case'Digit1':case'Digit2':case'Digit3':case'Digit4':if(quiz&&document.getElementById('quizView').style.display!=='none'){e.preventDefault();const i=parseInt(e.code.replace('Digit',''));const o=document.querySelectorAll('.qopt');if(o[i-1]&&o[i-1].onclick)o[i-1].click()}break}});

// Default: load G Major 9
buildFilters();buildManualSelectors();
const defCh=CH['maj9'];
cur={type:'maj9',rootSemi:7,flat:false,iv:defCh.iv,roles:defCh.r,ch:defCh};
document.getElementById('bpmSlider').value=120;
document.getElementById('volSlider').value=60;
display();
centerPianoOnChord();