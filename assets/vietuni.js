var supported = (document.all || document.getElementById);
var disabled = false;
var charmapid = 1;
var keymodeid = 0;
var linebreak = 0;
var theTyper = null;
reset = function(){}
initTyper = telexingVietUC;
function setTypingMode(mode) {
  keymodeid = mode;
  if (theTyper) theTyper.keymode= initKeys();
  if (!supported && !disabled) {
    alert("Xin loi, trinh duyet web cua ban khong cho phep ban dung chuong trinh nay .\n");
    disabled = true;
  }
}
initCharMap = function() { return new CVietUniCodeMap(); }
initKeys = function() {
  switch (keymodeid) {
    case 4: return new CTelexKeys();
    case 2: return new CVniKeys();
    case 3: return new CViqrKeys();
    case 1: return new CAllKeys();
    default: return new CVKOff();
  }
}
function telexingVietUC (txtarea) {
  txtarea.vietarea= true;
  txtarea.onkeyup= null;
  if (!supported) return;
  txtarea.onkeypress= vietTyping;
  txtarea.getCurrentWord= getCurrentWord;
  txtarea.replaceWord= replaceWord;
  txtarea.onkeydown= onKeyDown;
  txtarea.onmousedown= onMouseDown;
  if(!theTyper) theTyper = new CVietString("");
}
function getEvt(evt) {
  if (typeof(evt)=='string') return evt.charCodeAt(0);
  return document.all? event.keyCode: (evt && evt.which)? evt.which: 0;
}
function onKeyDown(evt) {
  var c= getEvt(evt);
  if ((c==10) || (c==13)) { reset(1); linebreak= 1; }
  else if ((c<49) && (c!=16) && (c!=20)) { linebreak= 0; reset(c==32); }
  return true;
}
function onMouseDown(evt) { reset(0); linebreak= 0; return true; }
function vietTyping(evt) {
  var c= getEvt(evt);
  theTyper.value= this.getCurrentWord();
  var changed= ((c>32) && theTyper.typing(c));
  if (changed) this.replaceWord(theTyper.value);
  return !changed;
}
function getCurrentWord() {
  if(!document.all) return this.value;
  var caret = this.document.selection.createRange();
  if (caret.text) return null;
  var backward = -10;
  do {
    var caret2 = caret.duplicate();
    caret2.moveStart("character", backward++);
  } while (caret2.parentElement() != this && backward <0);
  this.curword = caret2.duplicate();
  return caret2.text;
}
function replaceWord(newword) {
  if(!document.all) { this.value= newword; return; }
  this.curword.text = newword;
  this.curword.collapse(false);
}
function CVietString(str) {
  this.value= str;
  this.keymode= initKeys();
  this.charmap= initCharMap();
  this.ctrlchar= '-';
  this.changed= 0;
  this.typing= typing;
  this.Compose= Compose;
  this.Correct= Correct;
  this.findCharToChange= findCharToChange;
  return this;
}
function typing(ctrl) {
  this.changed = 0;
  this.ctrlchar = String.fromCharCode(ctrl);
  if (linebreak) linebreak= 0; else this.keymode.getAction(this);
  this.Correct();
  return this.changed;
}
function Compose(type) {
  if(!this.value) return;
  var info = this.findCharToChange(type);
  if (!info || !info[0]) return;
  var telex;
  if (info[0]=='\\') telex= [1,this.ctrlchar,1];
  else if (type>6) telex= this.charmap.getAEOWD(info[0], type, info[3]);
  else telex= this.charmap.getDau(info[0], type);
  if (!(this.changed = telex[0])) return;
  this.value = this.value.replaceAt(info[1],telex[1],info[2]);
  if (!telex[2]) { spellerror= 1; this.value+= this.ctrlchar; }
}
function Correct() {
  if (this.charmap.maxchrlen || !document.all) return 0;
  var tmp= this.value;
  if ('nNcC'.indexOf(this.ctrlchar)>=0) tmp+= this.ctrlchar;
  var er= /[^\x01-\x7f](hn|hc|gn)$/i.exec(tmp);
  if (er) {
    this.value= tmp.substring(0,tmp.length-2)+er[1].charAt(1)+er[1].charAt(0);
    this.changed= 1;
  }
  else if(!this.changed) return 0;
  er= /\w([^\x01-\x7f])(\w*)([^\x01-\x7f])\S*$/.exec(this.value);
  if (!er) return 0;
  var i= this.charmap.isVowel(er[1]);
  var ri= (i-1)%24 + 1, ci= (i-ri)/24;
  var i2= this.charmap.isVowel(er[3]);
  if (!ci || !i2) return 0;
  var ri2= (i2-1)%24 + 1, ci2= (i2-ri2)/24;
  var nc= this.charmap.charAt(ri)+ er[2]+ this.charmap.charAt(ci*24+ri2);
  this.value= this.value.replace(new RegExp(er[1]+er[2]+er[3],'g'), nc);
}

function findCharToChange(type) {
  var lastchars= this.charmap.lastCharsOf(this.value, 5);
  var i= 0, c=lastchars[0][0], chr=0;
  if (c=='\\') return [c,this.value.length-1,1];
  if (type==15) while (!(chr=this.charmap.isVD(c))) {
    if ((c < 'A') || (i>=4) || !(c=lastchars[++i][0])) return null;
  }
  else while( "cghmnptCGHMNPT".indexOf(c)>=0) {
    if ((c < 'A') || (i>=2) || !(c=lastchars[++i][0])) return null;
  }
  c = lastchars[0][0].toLowerCase();
  var pc = lastchars[1][0].toLowerCase();
  var ppc = lastchars[2][0].toLowerCase();
  if (i==0 && type!=15) {
    if ( (chr=this.charmap.isVowel(lastchars[1][0]))
      && ("uyoia".indexOf(c)>=0) && !this.charmap.isUO(pc,c)
      && !((pc=='o' && c=='a') || (pc=='u' && c=='y'))
      && !((ppc=='q' && pc=='u') || (ppc=='g' && pc=='i')) ) ++i;
    if (c=='a' && (type==9 || type==7)) i= 0;
  }
  c= lastchars[i][0];
  if ((i==0 || chr==0) && type!=15) chr= this.charmap.isVowel(c);
  if (!chr) return null;
  var clen= lastchars[i][1], isuo=0;
  if ((i>0) && (type==7 || type==8 || type==11)) {
    isuo=this.charmap.isUO(lastchars[i+1][0],c);
    if (isuo) { chr=isuo; clen+=lastchars[++i][1]; isuo=1; }
  }
  var pos= this.value.length;
  for (var j=0; j<= i; j++) pos -= lastchars[j][1];
  return [chr, pos, clen, isuo];
}
function CVietCharMap(){
  this.vietchars = null;
  this.length = 149;
  this.chr_cache = new Array(20);
  this.ind_cache = new Array(20);
  this.cptr = 0;
  this.caching= function(chr, ind) {
    this.chr_cache[this.cptr] = chr;
    this.ind_cache[this.cptr++] = ind;
    this.cptr %= 20;
  }
  return this;
}
CVietCharMap.prototype.charAt= function(ind){
  var chrcode = this.vietchars[ind];
  return chrcode ? String.fromCharCode(chrcode) : null;
}
CVietCharMap.prototype.isVowel= function(chr){
  var i = 0;
  while ((i<20) && (chr != this.chr_cache[i])) ++i;
  if (i<20) return this.ind_cache[i];
  i = this.length-5;
  while ((chr != this.charAt(i)) && i) --i;
  this.caching(chr, i);
  return i;
}
CVietCharMap.prototype.isVD= function (chr){
  var ind = this.length-5;
  while ((chr != this.charAt(ind)) && (ind < this.length)) ++ind;
  return (ind<this.length)? ind: 0;
}
CVietCharMap.prototype.isUO= function (c1, c2){
  if (!c1 || !c2) return 0;
  var ind1 = this.isVowel(c1);
  var ci = (ind1-1)%12;
  if ((ci!=9) && (ci!=10)) return 0;
  var ind2 = this.isVowel(c2);
  ci = (ind2-1)%12;
  if ((ci!=6) && (ci!=7) && (ci!=8)) return 0;
  return [ind1,ind2];
}
CVietCharMap.prototype.getDau= function (ind, type){
  var accented= (ind < 25)? 0: 1;
  var ind_i= (ind-1) % 24 +1;
  var charset= (type == 6)? 0 : type;
  if ((type== 6) && !accented) return [0];
  var newind= charset*24 + ind_i;
  if (newind == ind) newind= ind_i;
  var chr= this.charAt(newind);
  if (!chr) chr= this.lowerCaseOf(0,newind);
  return [1, chr, newind>24 || type==6];
}
var map=[
[7,7,7,8,8, 8,9,10,11,15],
[0,3,6,0,6, 9,0, 3, 6, 0],
[1,4,7,2,8,10,1, 4, 7, 1]
];
CVietCharMap.prototype.getAEOWD= function(ind, type, isuo) {
  var c=0, i1=isuo? ind[0]: ind;
  var vc1= (type==15)? (i1-1)%2 : (i1-1)%12;
  if (isuo) {
    var base= ind[1]-(ind[1]-1)%12;
    if (type==7 || type==11) c= this.charAt(i1-vc1+9)+this.charAt(base+7);
    else if (type==8) c= this.charAt(i1-vc1+10)+this.charAt(base+8);
    return [c!=0, c, 1];
  }
  var i= -1, shift= 0, del= 0;
  while (shift==0 && ++i<map[0].length) {
    if (map[0][i]==type) {
      if(map[1][i]==vc1) shift= map[2][i]-vc1;
      else if(map[2][i]==vc1) shift= map[1][i]-vc1;
    }
  }
  if (shift==0) {
    if (type==7 && (vc1==2 || vc1==8)) shift=-1;
    else if ((type==9 && vc1==2) || (type==11 && vc1==8)) shift=-1;
    else if (type==8 && (vc1==1 || vc1==7)) shift=1;
    del= 1;
  } else del=(shift>0);
  i1 += shift;
  var chr= this.charAt(i1);
  if (i1<145) this.caching(chr, i1);
  if (!chr) chr= this.lowerCaseOf(0, i1);
  return [shift!=0, chr, del];
}
CVietCharMap.prototype.lastCharsOf= function(str, num){
  if (!num) return [str.charAt(str.length-1),1];
  var vchars = new Array(num);
  for (var i=0; i< num; i++) { vchars[i]= [str.charAt(str.length-i-1),1]; }
  return vchars;
}
String.prototype.replaceAt= function(i,newchr,clen){
  return this.substring(0,i)+ newchr + this.substring(i+clen);
}
function CVietUniCodeMap(){ var map= new CVietCharMap();
map.vietchars = new Array(
"UNICODE",
97, 226, 259, 101, 234, 105, 111, 244, 417, 117, 432, 121,
65, 194, 258, 69, 202, 73, 79, 212, 416, 85, 431, 89,
225, 7845, 7855, 233, 7871, 237, 243, 7889, 7899, 250, 7913, 253,
193, 7844, 7854, 201, 7870, 205, 211, 7888, 7898, 218, 7912, 221,
224, 7847, 7857, 232, 7873, 236, 242, 7891, 7901, 249, 7915, 7923,
192, 7846, 7856, 200, 7872, 204, 210, 7890, 7900, 217, 7914, 7922,
7841, 7853, 7863, 7865, 7879, 7883, 7885, 7897, 7907, 7909, 7921, 7925,
7840, 7852, 7862, 7864, 7878, 7882, 7884, 7896, 7906, 7908, 7920, 7924,
7843, 7849, 7859, 7867, 7875, 7881, 7887, 7893, 7903, 7911, 7917, 7927,
7842, 7848, 7858, 7866, 7874, 7880, 7886, 7892, 7902, 7910, 7916, 7926,
227, 7851, 7861, 7869, 7877, 297, 245, 7895, 7905, 361, 7919, 7929,
195, 7850, 7860, 7868, 7876, 296, 213, 7894, 7904, 360, 7918, 7928,
100, 273, 68, 272);
return map;
}
function CVietKeys() {
  this.getAction= function(typer){
    var i= this.keys.indexOf(typer.ctrlchar.toLowerCase());
    if(i>=0) typer.Compose(this.actions[i]);
  }
  return this;
}
function CVKOff() {
  this.off = true;
  this.getAction= function(){};
  return this;
}
function CTelexKeys() {
  var k= new CVietKeys();
  k.keys= "sfjrxzaeowd";
  k.actions= [1,2,3,4,5,6,9,10,11,8,15];
  k.istelex= true;
  return k;
}
function CVniKeys() {
  var k= new CVietKeys();
  k.keys= "0123456789";
  k.actions= [6,1,2,4,5,3,7,8,8,15];
  return k;
}
function CViqrKeys() {
  var k= new CVietKeys();
  k.keys= "\xB4/'\u2019`.?~-^(*+d";
  k.actions= [1,1,1,1,2,3,4,5,6,7,8,8,8,15];
  return k;
}
function CAllKeys() {
  var k= new CVietKeys();
  k.keys= "sfjrxzaeowd0123456789\xB4/'`.?~-^(*+d";
  k.actions= [1,2,3,4,5,6,9,10,11,8,15,6,1,2,4,5,3,7,8,8,15,1,1,1,2,3,4,5,6,7,8,8,8,15];
  k.istelex= true;
  return k;
}

if (typeof(initCharMap) != 'undefined') {
  initCharMap = selectMap;
  if (theTyper) theTyper.charmap = initCharMap();
  vumaps = 1;
}
function selectMap(id) {
  var map = id? id: charmapid; 
  return maps? maps.getMap(map): new CVietUniCodeMap();
}
function detectFormat (txt, alrt) {
  var enc= maps.detect(txt);
  var id= enc? enc[0]: 0;
  if (!alrt) return id;
  if (!id) alert("Xin loi, khong the nhan dang duoc ma , ban vui long thu lai ...");
  else alert("Bang ma duoc dung trong van ban tren la : "+ enc[1]);
  return id;
}
var maps = new CMaps();
maps.register("CVietUniCodeMap()");
maps.register("CVietCombUCMap()");
maps.register("CVietUTF8Map()");
maps.register("CVietEscUCMap()");
maps.register("CVietVniMap()");
maps.register("CVietTCVNMap()");
maps.register("CVietVISCIIMap()");
maps.register("CVietVPSMap()");
maps.register("CVietViqrMap()");
function CMaps() {                                               
this.length= 1;
this.names= ["_RESERVED_"];
this.constructors= ["_RESERVED_"];
this.patterns= ["_RESERVED_"];
this.register= function (constructor) {
  var map= eval(constructor);
  this.names[this.length] = map.vietchars[0];
  this.constructors[this.length] = constructor;
  var re= (map.pattern)? map.pattern: "\x5b\u1ea0\x2d\u1ef9\x5d";
  var reg= new RegExp();
  reg.compile(re, map.maxchrlen?'gi':'g');
  this.patterns[this.length++]= reg;
}
this.getMap= function(id) {
  var ind= this.length-1;
  if (typeof(id)=='number') { ind= id; }
  else {
    id= id.toUpperCase();
    while((ind>0) && (this.names[ind].toUpperCase()!=id)) { --ind; }
  }
  if(!ind || (ind>=this.length)) { return new CVietUniCodeMap(); }
  return eval(this.constructors[ind]);
}
this.detect= function(txt) {
  for (var i=this.length-1; i>0; --i) {
    if (this.patterns[i].test(txt)) break;
  }
  return i? [i, this.names[i]]: null;
}
return this;
}                    
CVietCharMap.prototype.lowerCaseOf = function (chr, ind) {
  var i = ind? ind: this.isVowel(chr);
  if(i) return ((i-1)%24 >= 12)? this.charAt(i-12): this.charAt(i);
  return 0;
}
CVietCharMap.prototype.indexOf = function (chr,isnumber) {
  var c = isnumber? String.fromcharCode(chr) : chr;
  var ind = this.length-1;
  while ((c != this.charAt(ind)) && (ind > 0)) --ind;
  return ind;
}
CVietCharMap.prototype.regExpAt = function (i) {
  var c=this.charAt(i);
  if(c) c = c.replace(/([\\\*\|\+\-\?\.\(\^\$])/g, "\\$1");
  return c? new RegExp(c,'g') : 0;
}
CVietCharMap.prototype.convertTxtTo = function (txt, newmap) {
  var i, c, regexp, res;
  if (newmap.isVIQR) txt= txt.replace(/([\.\?]+\s)/g, "\\$1");
  for (i= this.length-1; i>0; i--) {
    regexp= this.regExpAt(i);
    if(regexp) txt= txt.replace(regexp, "::"+i+"::");
  }
  for (i=this.length-1; i>0; i--) {
    c = newmap.charAt(i);
    if (!c) c= newmap.lowerCaseOf(0,i);
    txt= txt.replace(new RegExp("::"+i+"::",'g'), c);
  }
  return txt;
}
function CVietMultibyteMap(superior) { 
var map= superior? superior: new CVietCharMap();
map.maxchrlen = 3;
map.charAt = function (ind) { 
  return this.vietchars[ind];
}
map.lastCharsOf = function (str, num) {
  var vchar = null;
  var i= this.maxchrlen;
  var mystr = str;
  while (!vchar && (i > 1)) {
    var c = mystr.substring(mystr.length-i);
    if (this.indexOf(c)) vchar=[c, i]; 
    --i;
  }
  if (!vchar) vchar=[mystr.charAt(mystr.length-1), 1]; 
  if (!num) return vchar;
  var vchars = new Array(num);
  vchars[0]= vchar; 
  for ( i=1; i< num; i++) {
    mystr= mystr.substring(0,mystr.length-vchars[i-1][1]);  
    vchars[i]= this.lastCharsOf(mystr);
  }
  return vchars;
}
return map;
}
function CVietUTF8Map() { var map= new CVietMultibyteMap(new CVietUniCodeMap());
map.vietchars[0] = "UTF-8";
for (var i = 1; i < map.length; i++ ) {
  var c = map.vietchars[i], utf;
  if (c < 128) {
    utf = String.fromCharCode(c);
  }
  else if (c < 2048) {
    utf = String.fromCharCode(192 | c >> 6 );
    utf += String.fromCharCode(128 | c & 63);
  }
  else if (c < 65536) {
    utf = String.fromCharCode(224 | c >> 12);
    utf += String.fromCharCode(128 | c >> 6 & 63);
    utf += String.fromCharCode(128 | c & 63);
  }
  map.vietchars[i] = utf;
}
map.pattern=
"(\xe1\xba|\xe1\xbb)[\xa5\xa4\xa7\xa6\xac\xa9\xa8\xab\xaa\xaf"+
"\xae\xb1\xb0\xb7\xb6\xb3\xb2\xba\xbd\xbc\xbe\xbf\xa1\xa3\xa2]";

return map;
}
function CVietEscUCMap() { var map= new CVietMultibyteMap(new CVietUniCodeMap());
  map.vietchars[0] = "&#Unicode;";
  map.maxchrlen = 7;
  for (var i = 1; i < map.length; i++ ) {
    var c = map.vietchars[i];
    if (c < 256) map.vietchars[i] = String.fromCharCode(c);
    else map.vietchars[i] = "&#"+ c +';';
  }
  map.pattern="\x26\x23\x5c\x64\x5c\x64\x5c\x64\x5c\x64\x3b";
  return map;
}
function CVietCombUCMap() { var map = new CVietMultibyteMap(new CVietUniCodeMap());
  map.vietchars[0] = "Unicode to hop";
  map.maxchrlen = 2;
  var viettm = new Array("UNICODE-C", 769, 768, 803, 777, 771); // ('`.?~)
  for (var i = 1; i < map.length-4; i++ ) {
    var i_char = (i-1)%24;
    var i_tm = (i - i_char - 1)/24;
    var base_c = map.vietchars[i_char+1];
    if (i<25) base_c = String.fromCharCode(base_c);
    var tonmark = String.fromCharCode(viettm[i_tm]);
    map.vietchars[i] = i_tm? base_c + tonmark : base_c;
  }
  for (var i = map.length-4; i < map.length; i++ ) {
    map.vietchars[i] = String.fromCharCode(map.vietchars[i]);
  }
  map.pattern= "\x5b\u0301\u0300\u0323\u0309\u0303\x5d";
  return map;
}  
function CVietVniMap() { var map = new CVietMultibyteMap();
map.maxchrlen = 2;
map.vietchars = new Array(
"VNI-WIN",
"a","a\xe2","a\xea","e","e\xe2","i","o","o\xe2","\xf4","u","\xf6","y",
"A","A\xc2","A\xca","E","E\xc2","I","O","O\xc2","\xd4","U","\xd6","Y",
"a\xf9","a\xe1","a\xe9","e\xf9","e\xe1","\xed","o\xf9","o\xe1","\xf4\xf9","u\xf9","\xf6\xf9","y\xf9",
"A\xd9","A\xc1","A\xc9","E\xd9","E\xc1","\xcd","O\xd9","O\xc1","\xd4\xd9","U\xd9","\xd6\xd9","Y\xd9",
"a\xf8","a\xe0","a\xe8","e\xf8","e\xe0","\xec","o\xf8","o\xe0","\xf4\xf8","u\xf8","\xf6\xf8","y\xf8",
"A\xd8","A\xc0","A\xc8","E\xd8","E\xc0","\xcc","O\xd8","O\xc0","\xd4\xd8","U\xd8","\xd6\xd8","Y\xd8",
"a\xef","a\xe4","a\xeb","e\xef","e\xe4","\xf2","o\xef","o\xe4","\xf4\xef","u\xef","\xf6\xef","\xee",
"A\xcf","A\xc4","A\xcb","E\xcf","E\xc4","\xd2","O\xcf","O\xc4","\xd4\xcf","U\xcf","\xd6\xcf","\xce",
"a\xfb","a\xe5","a\xfa","e\xfb","e\xe5","\xe6","o\xfb","o\xe5","\xf4\xfb","u\xfb","\xf6\xfb","y\xfb",
"A\xdb","A\xc5","A\xda","E\xdb","E\xc5","\xc6","O\xdb","O\xc5","\xd4\xdb","U\xdb","\xd6\xdb","Y\xdb",
"a\xf5","a\xe3","a\xfc","e\xf5","e\xe3","\xf3","o\xf5","o\xe3","\xf4\xf5","u\xf5","\xf6\xf5","y\xf5",
"A\xd5","A\xc3","A\xdc","E\xd5","E\xc3","\xd3","O\xd5","O\xc3","\xd4\xd5","U\xd5","\xd6\xd5","Y\xd5",
"d","\xf1","D","\xd1");
map.pattern=
"\x5b\xf6\xf4\x5d\x5b\xf9\xf8\xef\xfb\xf5\x5d\x7c\x6f\x61\x5b\xeb"+
"\xf9\xf8\xef\xfb\xf5\x5d\x7c\xf1\x5b\x61\x6f\x65\x75\xf4\xf6\x5d"+
"\x5b\xe4\xe0\xe1\xe5\xe3\xf9\xf8\xef\xfb\xf5\x5d";
return map;
}
function CVietViqrMap() { var map = new CVietMultibyteMap();
map.vietchars = new Array(
 "VIQR",
 "a","a^","a(","e","e^","i","o","o^","o+","u","u+","y",
 "A","A^","A(","E","E^","I","O","O^","O+","U","U+", "Y",
 "a'","a^'","a('","e'","e^'","i'","o'","o^'","o+'","u'","u+'","y'", 
 "A'","A^'","A('","E'","E^'","I'","O'","O^'","O+'","U'","U+'","Y'", 
 "a`","a^`","a(`","e`","e^`","i`","o`","o^`","o+`","u`","u+`","y`", 
 "A`","A^`","A(`","E`","E^`","I`","O`","O^`","O+`","U`","U+`","Y`", 
 "a.","a^.","a(.","e.","e^.","i.","o.","o^.","o+.","u.","u+.","y.", 
 "A.","A^.","A(.","E.","E^.","I.","O.","O^.","O+.","U.","U+.","Y.", 
 "a?","a^?","a(?","e?","e^?","i?","o?","o^?","o+?","u?","u+?","y?", 
 "A?","A^?","A(?","E?","E^?","I?","O?","O^?","O+?","U?","U+?","Y?", 
 "a~","a^~","a(~","e~","e^~","i~","o~","o^~","o+~","u~","u+~","y~", 
 "A~","A^~","A(~","E~","E^~","I~","O~","O^~","O+~","U~","U+~","Y~",
 "d","dd","D","DD");
 map.pattern=
"\x75\x5b\x5c\x2b\x5c\x2a\x5d\x6f\x5b\x5c\x2b\x5c\x2a\x5d\x7c\x64\x64"+
"\x5b\x61\x6f\x65\x5d\x5b\x5c\x28\x5c\x5e\x7e\x27\x60\x5d\x7c\x5b\x61"+
"\x6f\x65\x5d\x5c\x5e\x5b\x7e\x60\x27\x5c\x2e\x5c\x3f\x5d\x7c\x5b\x75"+
"\x6f\x5d\x5c\x2b\x5b\x60\x27\x7e\x5c\x2e\x5c\x3f\x5d\x7c\x61\x5c\x28"+
"\x5b\x27\x60\x7e\x5c\x2e\x5c\x3f\x5d";
map.isVIQR= true;
map.regExpAt = function(ind) {
  var c=this.charAt(ind);
  if (!c) return null;
  c = c.replace(/\+/g, "[\\+\\*]");
  c = c.replace(/'/g, "['�]");
  c = c.replace(/([\-\?\.\(\^])/g, "\\$1");
  c = c.replace(/(d)d/gi, "$1$1|\\-$1|$1\\-");
  return new RegExp(c,'g');
}
map.convertTxtTo = function (txt, newmap) {
  var i, c, regexp, res, tmp;
  txt= txt.replace(/(\.\.+|\?\?+)/g, ";;;$1");
  while ((res=/(\.[\w\@\-\.\/\\][\w\@\-\.\/\\][\w\@\-\.\/\\]+\s*)/g.exec(txt))) {
    regexp= res[1].replace(/([\.\?\+\-\(\^\*\@\\)\]\}])/g,"\\$1");
    tmp= res[1].replace(/\./g,";;;.;;;");
    txt= txt.replace(new RegExp(regexp,'g'), tmp);
  }
  for (i=this.length-1; i>0; i--) {
    regexp= this.regExpAt(i);
    if(regexp) txt= txt.replace(regexp, "::"+i+"::");
  }
  for (i=this.length-1; i>0; i--) {
    c = newmap.charAt(i);
    if (!c) c= newmap.lowerCaseOf(0,i);
    txt= txt.replace(new RegExp("::"+i+"::",'g'), c);
  }
  txt= txt.replace(/;;;/g,"");
  txt= txt.replace(/\\([\.\?])/g,"$1");
  return txt;
}
return map;
}
function CVietTCVNMap() { var map = new CVietCharMap();
map.vietchars = new Array(
 "TCVN-3",
 97, 169, 168, 101, 170, 105, 111, 171, 172, 117, 173, 121, 
 65, 162, 161, 69, 163, 73, 79, 164, 165, 85, 166, 89,
 184, 202, 190, 208, 213, 221, 227, 232, 237, 243, 248, 253,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 181, 199, 187, 204, 210, 215, 223, 229, 234, 239, 245, 250,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 185, 203, 198, 209, 214, 222, 228, 233, 238, 244, 249, 254,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 182, 200, 188, 206, 211, 216, 225, 230, 235, 241, 246, 251,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 183, 201, 189, 207, 212, 220, 226, 231, 236, 242, 247, 252,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 100, 174, 68, 167);
map.pattern=
"\x5c\x77\xad[\xac\xed\xea\xee\xeb\xec]|\xae[\xb8\xb5\xb9\xb6\xb7"+
"\xca\xbe\xbb\xc6\xbc\xbd\xcc\xd1\xce\xcf\xaa\xd5\xd2\xd6\xd3\xd4"+
"\xdd\xd7\xde\xd8\xdc\xe3\xdf\xe4\xe1\xe2\xab\xe8\xe5\xe9\xe6\xe7"+
"\xac\xed\xea\xee\xeb\xec\xf3\xef\xf4\xf1\xf2\xf8\xf5\xf9\xf6\x5d";
return map;
}
function CVietVISCIIMap() { var map = new CVietCharMap();
map.vietchars = new Array(
"VISCII",
97, 226, 229, 101, 234, 105, 111, 244, 189, 117, 223, 121,
65, 194, 197, 69, 202, 73, 79, 212, 180, 85, 191, 89,
225, 164, 237, 233, 170, 237, 243, 175, 190, 250, 209, 253,
193, 8222, 129, 201, 352, 205, 211, 143, 8226, 218, 186, 221,
224, 165, 162, 232, 171, 236, 242, 176, 182, 249, 215, 207,
192, 8230, 8218, 200, 8249, 204, 210, 144, 8211, 217, 187, 376,
213, 167, 163, 169, 174, 184, 247, 181, 254, 248, 241, 220,
8364, 8225, 402, 8240, 381, 732, 353, 8220, 8221, 382, 185, 0,
228, 166, 198, 235, 172, 239, 246, 177, 183, 252, 216, 214,
196, 8224, 0, 203, 338, 8250, 8482, 8216, 8212, 339, 188, 0,
227, 231, 199, 168, 173, 238, 245, 178, 222, 251, 230, 219,
195, 0, 0, 710, 141, 206, 0, 8217, 179, 157, 255, 0,
100, 240, 68, 208);
map.pattern=
"\x5c\x77\xdf\x5b\xbd\xbe\xb6\xfe\xb7\xde\x5d\x7c\xf0\x5b\xe1\xe0\xd5"+
"\xe4\xe3\xa4\xed\xa2\xa3\xc6\xc7\xe8\xa9\xeb\xa8\xea\xaa\xab\xae\xac"+
"\xad\xed\xec\xb8\xef\xee\xf3\xf2\xf7\xf6\xf5\xf4\xaf\xb0\xb5\xb1\xb2"+
"\xbd\xbe\xb6\xfe\xb7\xde\xfa\xf9\xf8\xfc\xfb\xd1\xd7\xf1\xd8\x5d";
return map;
}
function CVietVPSMap() { var map = new CVietCharMap();
map.vietchars = new Array(
"VPS-Win",
97, 226, 230, 101, 234, 105, 111, 244, 214, 117, 220, 121,
65, 194, 710, 69, 202, 73, 79, 212, 247, 85, 208, 89,
225, 195, 161, 233, 8240, 237, 243, 211, 167, 250, 217, 353,
193, 402, 141, 201, 144, 180, 185, 8211, 157, 218, 173, 221,
224, 192, 162, 232, 352, 236, 242, 210, 169, 249, 216, 255,
0, 8222, 0, 215, 8220, 181, 188, 8212, 0, 168, 175, 178,
229, 198, 165, 203, 338, 206, 8224, 182, 174, 248, 191, 339,
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
228, 196, 163, 200, 8249, 204, 213, 176, 170, 251, 186, 8250,
129, 8230, 0, 222, 8221, 183, 189, 732, 376, 209, 177, 0,
227, 197, 164, 235, 205, 239, 245, 8225, 171, 219, 187, 207,
8218, 0, 0, 254, 8226, 184, 0, 8482, 166, 172, 0, 0,
100, 199, 68, 241);
map.pattern=
"\x5c\x77\xdc\x5b\xd6\xa7\xa9\xae\xaa\xab\x5d\x7c\xc7\x5b\xe1\xe0\xe5"+
"\xe4\xe3\xc3\xed\xa2\xa5\xa3\xa4\xe8\xcb\xc8\xeb\xea\xcd\xed\xec\xce"+
"\xcc\xef\xf3\xf2\xd5\xf5\xf4\xd3\xd2\xb6\xb0\xd6\xa7\xa9\xae\xaa\xab"+
"\xfa\xf9\xf8\xfb\xdb\xd9\xd8\xbf\xba\x5d";
return map;
}
function convertTo(txt, src, desc) {
  var srcmap = initCharMap(src);                        
        var destmap = initCharMap(desc);
        var txt= srcmap.convertTxtTo(txt, destmap);
  return txt;
}