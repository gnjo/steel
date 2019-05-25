/*
  <script src="https://gnjo.github.io/use.js"></script>
  <script src="https://gnjo.github.io/e.js"></script>
  <script src="https://gnjo.github.io/togist.js"></script>
  <script src="https://gnjo.github.io/CyPk/plainList.js"></script>
  <script src="https://gnjo.github.io/keyCmd.js"></script>
  <script src="https://codepen.io/gnjo/pen/oRNjPR.js?main=1"></script>
*/
/* script onload="use(this)" src="//gnjo.github.io/use.js?q=monocc.css"> */
/*history
v0 start
v1 add some...
v2 add fn.cmd
v3 usage change
v4 isWideImage
v4.1 changeAttr
v5 including the deth
v5.1 changeAttr changeDom diff; updateAttr updateDom short fn.ua fn.ud
v6 fn.upi imgur
v6.1 fn.scv2 offset version
v7 able the prepack
v8 fn.empty fn.base64type
v9 fn.interval option the random delay
*/
;(function(root){
  if(root._) return;
  var _={}; 
/*original by underscore.js*/
//line 1457
  _.now = Date.now || function() {
    return new Date().getTime();
   };
//line 850
 _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
 //line 883
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  root._ =_;
})(this);
/**/

function use(el){
 var v=el.src;
 var data= v.match(/(.+)\?.+=(.+)$/)||v.match(/(.+)\?(.+)$/);
 if(data){data=data.slice(1);}
 else{console.error('adds file not'); return}
 var baseurl =data[0].slice(0, data[0].lastIndexOf('/')+1 );

 var target =document.createElement('span');
 target.style.display='none';
 el.parentNode.insertBefore( target , el.parentNode.firstElementChild); 

 var ary = data[1].trim().split('|');
 ary.forEach((d)=>{
  var url=d.split('?')[0];

  if(~url.indexOf('.js')){
   var el= target.appendChild( document.createElement('script') );
   el.src=baseurl+d;
  }else if(~url.indexOf('.css')){
   var el = target.appendChild( document.createElement('link') );
   el.setAttribute('rel','stylesheet');
   el.setAttribute('href',baseurl+d);  
  }
 })
}
/**/

var localStorage=this.localStorage||window.localStorage
;
var fn=this.fn||{},is=this.is||{}
/*fn.i3=(d)=>{
 if(typeof d !=='string') return d
 var el=document.createElement('table'); el.innerHTML=d.trim();
 return el.childNodes[0];
}*/
fn.i3=(d)=>{
 if(typeof d !=='string') return d
 var el=document.createElement('table'); el.innerHTML=d.trim();
 var me=el.childNodes[0]
 el=void 0;
 return me
}
fn.empty=(el)=>{
  while( el.firstChild ){el.removeChild( el.firstChild )}
  return el
}
fn.g=(s)=>{return document.getElementById(s)};
fn.q=(s,doc=document)=>{return doc.querySelector(s)};
fn.qa=(s,doc=document)=>{return [].slice.call(doc.querySelectorAll(s))}
fn.r=(d=>d.parentNode.removeChild(d))
fn.ce=(d=>document.createElement(d))
fn.range=(l=0)=>{return Array.from({length:l})}
fn.urlcnk=(u)=>{
 let cep = /.+\?/.test(u)? '&' :'?',v =`__${performance.now()}__=`.replace('.','')
 return u + cep + v + Date.now()
}
fn.choiceone=(o,name,v=true)=>{ Object.keys(o).map(d=>{ o[d]=(d===name)?v:!v });return o}

fn.rhash=()=>{return Math.random().toString(36).slice(-8)}
fn.timeToOrder=(time)=>{return 2147483647 - parseInt( time/1000 )}
fn.hashCode =(s)=>{var h=0;for(var i=0;i < s.length; i++) h = h * 31 + s.charCodeAt(i)|0;return h}
fn.mic12 =(s)=>{var d= fn.hashCode('GGGGGG'+s),a =d.toString(16).slice(-6);return a+a}
fn.hash12=(s)=>{
  let rec=((k,v)=>(toString.call(v)==="[object Function]")?v.toString():v)
  ,a=fn.hashCode(toString.call(s)+JSON.stringify(s,rec)).toString(16).slice(-6);
  return a+a;
}
fn.gistdesc =(u)=>{return new Date().toISOString().slice(0,"YYYY-MM".length) +'-'+fn.mic12(u)}
fn.gistinfo=(r)=>{
 let ma =/https:\/\/gist.githubusercontent.com\/(.+)\/(.+)\/raw\/(.+)\/(.+)$/
 ,a=r.match(ma)
 ;
 return {url:r,user:a[1],id:a[2],filename:a[4]}  
}
fn.scv=(el,type='top')=>{
 if(type=='top') return el.scrollIntoView({ behavior: 'smooth',block: "start", inline: "nearest" })
 if(type=='bottom') return el.scrollIntoView({ behavior: 'smooth',block: "end", inline: "nearest" })
 /*if(type=='center')*/ return el.scrollIntoView({ behavior: 'smooth'}) 
}
//offset version px
fn.scv2=(el,_offset)=>{
 if(!el) return console.log('element empty fn.scv2')
 const element = el
 ,offset = parseInt(_offset)||0
 ,bodyRect = document.body.getBoundingClientRect().top
 ,elementRect = element.getBoundingClientRect().top
 ,elementPosition = elementRect - bodyRect
 ;
 const offsetPosition = elementPosition - offset;
 window.scrollTo({top: offsetPosition,behavior: 'smooth'});
}

fn.menum=(me,q)=>{let num=-1;[].slice.call(document.querySelectorAll(q)).forEach((d,i)=>{if(d === me) num = i});return num}

fn.cmd=function(imap){return function(ev){
 if(!((ev.ctrlKey||ev.metaKey)&&imap[ev.keyCode])) return
 ev.preventDefault();return imap[ev.keyCode].call(this,ev);
}};

fn.lay=(q,flg)=>{
  var o={},t='lay',qt='[lay]',el=(!!(q && q.nodeType === 1))?q:document.querySelector(q)
  o.el =(flg)?el.cloneNode(true):el;
  ;[].slice.call(o.el.querySelectorAll(qt)).forEach(d=>{o[d.getAttribute(t)]=d});
  return o;
 }

fn.sq=(d,opt=2)=>{
 let f=(d)=>{return (d)?[
   d.tagName.toLowerCase()
   ,(d.classList.length!=0)?'.'+[].slice.call(d.classList).join('.'):''
   ,(d.id&&d.id!='')?('#'+d.id):''
   ,(d.name)?`[name="${d.name}"]`:''
  ].join(''):null;
 }
 ,now=d
 ;return Array.from({length:opt})
  .map((d,i)=>{now= (now)?(i===0)?now:now.parentElement:null;return now})
  .map(d=>f(d)).filter(d=>d).reverse().join('>')
 ;
}
 is.imgurl=(d)=>{return /(.+:\/\/.+\.jpeg)|(.+:\/\/.+\.png)|(.+:\/\/.+\.jpg)/i.test(d)}
 
 fn.biglex=(d)=>{
  return d.split('\n＃').map((d,i)=>(i===0)?d:'＃'+d)
 } 
 
 fn.lex=(str)=>{
  let title='',url='',line=0,c=44;
  let a =str.split('\n').forEach((d)=>{
   if( d.charAt(0) === '＃' ) title = d;
   else if(d.charAt(0) === '＠' && is.imgurl(d.slice(1))) url =d.slice(1);
   line += Math.ceil((d.length+0.1)/c)
  });
  return {t:title,u:url,l:line,s:str}
 }
 
fn.i=function(html,f,doc=document){
 var _f =(f)?f:(el)=>{return el};
 if(typeof html !=='string') return _f(html);
 //
 var el=doc.createElement('table');
 el.innerHTML=html.trim();
 var me=el.childNodes[0];
 return _f(me);
}

fn.i2=function(html,attr,style,doc=document){
 var f=(s)=>{var el=doc.createElement('table');el.innerHTML=html;return el.childNodes[0]}
 var me = (typeof html !=='string')? html:f(html);

 if(attr){
  Object.keys(attr).forEach((d)=>{ 
   if(typeof attr[d] !=='string'|| d in me) me[d]=attr[d];
   else me.setAttribute(d,attr[d]) 
  });
 }
 if(style){
  var st=doc.createElement('style');
  st.innerHTML = style;
  me.appendChild(st);
 }
 console.log(me)
 return me;
}

fn.rnum=(l=8)=>{
 var c = "123456789";//0を含めない方が都合が良い
 var cl=c.length;
 var r = "";
 for(var i=0; i<l; i++){
  r += c[Math.floor(Math.random()*cl)];
 } 
 return r;
};
fn.rword=(l=8)=>{
 var c = "abcdefghijklmnopqrstuvwxyz0123456789",cl=c.length,r = "";
 for(var i=0; i<l; i++) r += c[Math.floor(Math.random()*cl)];
 return r;
}
fn.rkana=(l=8)=>{
 var c = "bcdfghjklmnpqrstvwxyz",cl=c.length,b ="aiueo",bl=b.length,r=""
 ,mf=Math.floor,mr=Math.random
 ;for(var i=0;i<l;i++) r+=(i%2)? b[mf(mr()*bl)]:c[mf(mr()*cl)].toUpperCase();
 return r;
}
fn.aoimport=(d)=>{return d.replace(/［＃改ページ］\n　/g,'＃').replace(/［.+］/g,'');}

if(this.md5){ 
 var hashColor=((s)=>{ return '#'+md5(s).slice(0,6) });
 fn.hashColor=hashColor;
}
if(this.invert) fn.invertColor=invert;

fn.isJSON =function(d){ try{JSON.parse(d);return true}catch(e){return false} }

if(localStorage){
 fn.loId ='__loId__'; //project every change
 fn.loSave=(d,i=null)=>{var id=i||fn.loId;localStorage.setItem(id, JSON.stringify(d) ); return id}
 fn.loLoad =(i)=>{var id=i||fn.loId;var d=localStorage.getItem(id); return JSON.parse(d) }
 fn.loRemove=(i)=>{var id=i||fn.loId;localStorage.removeItem(id)}
}

//createDocument
fn.cd= function(markup, type='text/html') {
 //if (/^\s*text\/html\s*(?:;|$)/i.test(type)) 
 var doc = document.implementation.createHTMLDocument("");
 if (~markup.toLowerCase().indexOf('<!doctype') ) doc.documentElement.innerHTML = markup;
 else doc.body.innerHTML = markup;
 return doc;
};

fn.fragment =function(u,tt='body'){
 return new Promise((sol)=>{
  var f=fn.cd;
  //"Access-Control-Allow-Headers":"*","Access-Control-Allow-Origin":"*",
  var h={'content-type':'text/plain'};
  fetch(u,{method:'get',mode:'cors',headers:h})
   .then(d=>d.text())
   .then(text=>f(text))
   .then(doc=>doc.querySelector(tt))
   .then(el=> sol(el) )
 })
};

fn.debug=(o)=>{return Object.getOwnPropertyNames(o).concat(Object.getOwnPropertyNames(o.__proto__))}
//console.log(fn.debug(Math))
fn.check=(s)=>{try{return{s:s,o:new Function(';return '+s)()} }catch(e){return{s:s,o:null,error:e.message} }}

fn.pad=( (d,l)=>('000000000000000000'+d).slice(-1*l));
fn.rotation=(a,v,l)=>{a.unshift(v);a.splice(l);return a};

fn.hash =function(str){return str.split('').map(d=> d.charCodeAt(0).toString(16) ).join('')}
fn.fr=function(html=''){
 let flg = (typeof 'html' === 'string')
 ,e= (flg)?document.createElement('table'): html||document.createElement('table')
 ,fr=document.createDocumentFragment()
 ;
 if(flg) e.innerHTML= html||'';
 ;[].slice.call(e.childNodes).forEach(d=>fr.appendChild(d))
 return fr;
}

fn.rename =function(name,count=1){
 var join =`_${count}`;
 return (~name.indexOf('.'))? name.replace(/(.*)(\.)/,`$1${join}$2`) : `${name}${join}`;
}

fn.jpTime=(timestamp=Date.now())=>{
 return new Date(timestamp+1000*60*60*9)
  .toISOString()
  .replace(/-/g,'/')
  .replace('T',' ')
  .slice(0,'YYYY/MM/DD hh:mm'.length)
 ;
} 
fn.now =function(time){
 /*add local time jp*/	 
 if(time=='jp'||time=='jpn') return new Date( Date.now()+ 1000*60*60*9  ).toISOString().split('.')[0] +'Z'
 if(time) return new Date(time).toISOString().split('.')[0] +'Z';
 else return new Date( Date.now() ).toISOString().split('.')[0] +'Z';
}

fn.toBlob =function(base64) {
 let ma = /^data:(.*);base64,(.*)$/
 ;
 if(!ma.test(base64)){ console.log('error base64 data'); return null}

 let ary = base64.match(ma)  //[0] base64, [1] type, [2] body
 ,type = ary[1]
 ,bin = atob(ary[2])
 ,buffer = new Uint8Array(bin.length).map( (d,i)=>{return bin.charCodeAt(i)})
 ,blob = new Blob([buffer.buffer], {type: type})
 ;
 return blob;
 //var debug = {hello: "world"};
 //var blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});
 //data:image/png;base64,... 
}

fn.base64type=(base64)=>{
 let re=/^data:(.+);base64,/
 ,dummy="data:application/shockwave-flash;base64,/9j/4A"
 ,dump=base64.trim().slice(0,dummy.length)
 ;
 if(!re.test(dump)) return void 0;
 return dump.match(re).slice(1,2).join('')
}

fn.copy=function(textVal){
 var copyFrom = document.createElement("textarea");
 copyFrom.textContent = textVal;
 var bodyElm = document.getElementsByTagName("body")[0];
 bodyElm.appendChild(copyFrom);
 copyFrom.select();
 var retVal = document.execCommand('copy');
 bodyElm.removeChild(copyFrom);
 return retVal;
}

fn.gsl=(()=>window.getSelection().toString())
fn.gsl2=(el=>{
 let data = (el.value)?el.value:el.textContent;
 return data.slice(el.selectionStart,el.selectionEnd)
})
fn.pnt2=(str)=>{document.execCommand('inserthtml',false,str)}
fn.pnt=(str)=>{document.execCommand('inserttext',false,str)}
fn.paste=function(target, str){
 //if target have textarea or input, to focus and paste the str.
 let obj = target;
 obj.focus();
 if(navigator.userAgent.match(/MSIE/)){
  let r = document.selection.createRange();
  r.text = str;
  r.select();
 }else{
  let s = obj.value
  ,p = obj.selectionStart
  ,np = p + str.length
  ;
  obj.value= (s.substr(0, p) + str + s.substr(p));
  obj.setSelectionRange(np, np);
 }
}

fn.mes = (q,limit=15)=>{
 var el =document.querySelector(q)
 ,now = (time)=>{
  if(time) return new Date(time).toISOString().split('.')[0] +'Z';
  else return new Date( Date.now() ).toISOString().split('.')[0] +'Z';
 }
 ,rotation =(a,v,l)=>{a.unshift(v);a.splice(l);return a}
 ,stock =[]
 ;
 return function(str){
  let time = now().match(/T.*:(.*:.*)Z$/).slice(1)[0]
  ,mes = `${time}=>${str}`
  rotation(stock,mes,limit);
  el.innerText =stock[0];
  el.setAttribute('title',stock.join('\n'));
 }
 //usage:
 //var mes =fn.mes('#cm');
 //mes('xyz')
 //3e1105122428b873252c5cb4f05772b67a1f8077
}

;
fn.dragger=(el,caller)=>{

 var dnd=(caller=>function(ev){
  let type=ev.type,mark ='drag'  //mark is .drag the custom class
  ;
  if(type!='paste'){
   ev.stopPropagation();
   ev.preventDefault();
  }
  if(type==='drop'||type==='paste'){
   //this paste hack, allow the chrome only.
   const flg= (type==='paste')
   ,files=(flg)?ev.clipboardData.items:ev.target.files||ev.dataTransfer.files
   ;
   ;[].slice.call(files)
   //.filter(f=>f.type.match('*.*')) 
   //.slice(0,10) //10 is limit
    .map((f)=>{
    let r=new FileReader(); 
    r.onloadend=(function(f){return function(ev){
     ev.target.file=f/**/ ;
     caller(ev)
    };
                            })(f);

    if(flg&&f.kind ==='string'){
     var _f=JSON.parse(JSON.stringify({kind:f.kind,type:f.type}))
     return f.getAsString(function(str) {
      ev.target.result=str; ev.target.file=_f; caller(ev);
     });
    }    
    r.readAsDataURL((flg)?f.getAsFile():f); 
   })
   ;
   this.classList.remove(mark)
   return;
  }     
  if(type==='dragover'){ this.classList.add(mark);ev.dataTransfer.dropEffect = 'copy';return}
  if(type==='dragleave'){ this.classList.remove(mark);return}
 })

 var _dnd=dnd(caller)
 ;['onpaste','ondragover','ondrop','ondragleave'].forEach(d=>el[d]=_dnd)
 return el; 
 /*usage
document.body.set({'contenteditable':'plaintext-only'})
fn.dragger(document.body,(ev)=>{
 console.log(ev,ev.target.result,ev.target.file)
}) 
 */

}

fn.shuffle=(a)=>{
 for(let i = a.length - 1; i > 0; i--){
  let r = Math.floor(Math.random() * (i + 1)),t = a[i]
  ; a[i] = a[r]; a[r] = t;
 }
 return a;
}

fn.isWideImage=(img)=>{
 let w=img.naturalWidth
 ,h=img.naturalHeight
 return (w>h)?true:false;
}
fn.isBoxImage=(img)=>{
 let w=img.naturalWidth
 ,h=img.naturalHeight
 ,x=Math.max(w,h)
 ,r=(1-0.619)/2,flg=Math.abs(w-h)<x*r
 return (flg)?true:false
}

fn.updateAttr=function(el,attr,caller,time,flg){
 if(!el) return
 let target=el
 ,_caller=_.debounce(caller,time||70)
 ,def={attributes: true,attributeOldValue:true,attributeFilter:[attr]}
 ,config=(flg)?Object.assign({},def,{subtree:true}) :def
 ,calc=(ev)=>{
 if(ev.attributeName===attr){
  let newValue=ev.target.getAttribute(attr),oldValue=ev.oldValue
  if(ev.oldValue!=newValue)
    _caller({target:ev.target,newValue:newValue,oldValue:oldValue,attr:attr})
  }
 }
 ,ob=new MutationObserver(mu=>{ mu.map(calc)})
 ob.observe(target,config)
 ;
 return ob;
 /*usage
let s=fn.q('.story')
fn.changeAttr(s,'data-length',(e)=>{
 console.log(e)
},700,false)
//true is watch the subtree
//textContent value tips
div.story(contenteditable="plaintext-only" onkeydown="this.dataset.length=this.textContent.length")
input.x(onkeyup="this.setAttribute('value',this.value)")
input.y(type="range",onchange="this.setAttribute('value',this.value)")
*/
}
fn.ua=fn.changeAttr=fn.updateAttr
;

fn.updateDom=function(el,caller,time,flg){
 let target=el
 ,_caller=_.debounce(caller,time||70)
 ,def={childList:true}
 ,config=(flg)?Object.assign({},def,{subtree:true}) :def
 ,calc=(ev)=>{
    _caller(ev)
 }
 ,ob=new MutationObserver(mu=>{ mu.map(calc)})
 ob.observe(target,config)
 ;
 return ob;
 /*usage
fn.changeDom(document.body,(e)=>{
 console.log(e)
},70)

function x(){
 let el=s.cloneNode(true)
 el.a2(document.body)
} 
//true is watch the subtree
*/
}
fn.ud=fn.changeDom=fn.updateDom
;
fn.diff=(arr1, arr2)=>{
   return arr1.concat(arr2)
    .filter(item => !arr1.includes(item) || !arr2.includes(item));
}

fn.upImgurNum=0
fn.upImgur=function(base64,cid){
 //base64 is data:image/jpeg...,....
 let cidary=['c552bf3081f0790','59412b24cbb03ea','62b4efa067f48c6','e52d5cb6956574f']
 ,num=fn.upImgurNum
 let blob = fn.toBlob(base64)
 ,c = cid||cidary[num]
 ,formData = new FormData()
  formData.append('type', 'file')
  formData.append('image', blob)

  return fetch('https://api.imgur.com/3/upload.json', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Client-ID ${c}` // imgur specific
    },
    body: formData
  })
   .then(d=>d.json())
   .catch(d=>{
    num++;
    fn.upImgurNum= num%cidary.length
    console.log('new cid>',cidary[fn.upImgurNum])
    return d;
  })
}
/*
fn.upImgur=function(base64,cid){
 //base64 is data:image/jpeg...,....
 let blob = fn.toBlob(base64)
 ,c = cid||'c552bf3081f0790'
 ,formData = new FormData()
  formData.append('type', 'file')
  formData.append('image', blob)

  return fetch('https://api.imgur.com/3/upload.json', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Client-ID ${c}` // imgur specific
    },
    body: formData
  })
   .then(d=>d.json())
}
*/
fn.upi=fn.upimage=fn.upImage=fn.upimgur=fn.upImgur;

fn.deleteMe=function(el){
 let is={}; 
 is.element=function(o){return !!(o && o.nodeType === 1)}
 ;
 if(!is.element(el)){
  console.log('delemteMe not element',el)
  return el;
 }
 el.setAttribute('tabindex','-1') //interactive-able
 el.style.outline='none'
 el.onkeydown=(e)=>{
  if(e.which===46) e.target.remove();//46 delete
 }
 return el;
} 
;
fn.num=(s,_def)=>{
// if(!_def) console.warn('not default value(fn.num)')
 let def=_def||0
 return isNaN(parseInt(s,10))?def:parseInt(s,10)
 /*usage
let s='eeeeee'
let a=fn.num(s,0) //0 
 */
}

fn.interval=(t,caller,range)=>{ 
 let clearid=setInterval(()=>{
  let r=Math.ceil(Math.random()*(range||0))
  setTimeout(()=>{caller(clearid)},r)
 },t||0);
 /*usage
fn.interval(2000,(id)=>{
 //clearInterval(id)
},100) 
 */
}

;
;/*history
v1 reverse back
*/
;(function(root){
 'use strict';
 var Element=root.Element||window.Element;
 var fn=root.fn||{}
 fn.effect=(el,o,time)=>{el.classList.add(o);setTimeout(()=>{el.classList.remove(o)},time||0)}
 fn.ef=fn.effect;
 fn.r=(d=>d.parentNode.removeChild(d))
 fn.q=(s,doc=document)=>{return doc.querySelector(s)}
 fn.qa=(s,doc=document)=>{return [].slice.call(doc.querySelectorAll(s))}
 fn.ce=(d=>document.createElement(d))
 fn.fra=(()=>document.createDocumentFragment())
 ;
 fn.i3=(d)=>{
  if(typeof d !=='string') return d
  var el=document.createElement('table'); el.innerHTML=d.trim();
  var me=el.childNodes[0]
  el=void 0;
  return me
 } 
 ;
 /**/
 //console.log(Element.prototype)
 var e=Element.prototype
 e.aTo =function(p){p.appendChild(this);return this}
 e.pTo =function(p){p.insertBefore(e.el,p.firstChild); return this}
 e.asTo =function(p){p.parentNode.insertBefore(this,p.nextElementSibling/*nextSibling*/);return this}
 e.psTo =function(p){p.parentNode.insertBefore(this,p);return this}
 e.effect=function(o,t){fn.effect(this,o,t);return this}
 e.remove=function(){return fn.r(this)}
 e.q=function(s){return fn.q(s,this)}
 e.qa=function(s){return fn.qa(s,this)}
 /*same*/
 e.a2=e.aTo; e.p2=e.pTo; e.as2=e.asTo; e.ps2=e.psTo;
 e.ef=e.effect; e.r=e.remove;

 root.fn=fn;
})(this);
;
;/*history
v1 togist
v2 togistsearch
v3 bugfix desc
v4 optimize
v4.1 optimize bugfix
*/
;(function(root){
 'use strict';
 ;
 const am=9
 const caesar = function(str, amount) {
  const a= (amount < 0)? amount + 26:amount
  ,fc=String.fromCharCode
  ,fn=( d=>((d >= 65) && (d <= 90))?fc(((d - 65 + a) % 26) + 65):fc(((d - 97 + a) % 26) + 97) )
  ;
  return str.split('').map( d=>(d.match(/[a-z]/i) )?fn(d.charCodeAt(0)):d ).join('')
 }
 ;
 var gists={}

 gists.authstring='I25zkiyWHGWqIwEcjCNhViZ='
 gists.headers={
  "Authorization":"Basic " + caesar(gists.authstring,-1*am)
  ,'Accept': 'application/json'
  ,'Content-Type': 'application/json'
 }
 gists.jsy=JSON.stringify
 gists.f=function(url,o){return fetch(url,o).then((d)=>{
  if(d.ok) return Promise.resolve(d).then(d=>d.json())
  else return Promise.reject(d.status)
 })}
 gists.create=function(data){
  let url="https://api.github.com/gists"
  ,o={
   method:'POST'
   ,headers: gists.headers
   ,body: gists.jsy(data)
  }
  ;   
  return gists.f(url,o)  
 }
 gists.update=function(id,data){
  let url="https://api.github.com/gists/" + id
  ,o={
   method:'PATCH'
   ,headers: gists.headers
   ,body: gists.jsy(data)
  }
  ;   
  return gists.f(url,o)  
 }
 gists.searchid=function(url,o){return gists.f(url,o) }
 gists.search=gists.searchid;
 
 root.togistdebug=false;
 root.togist=(async (content,gistid,filename,desc)=>{

  let fname= filename||'anonymous'
  ,data={"files": { } }
  if(desc) data.description=desc; //bug fix desc
  data.public=false
  data.files[fname] = {"content": content}
  ;
  var ret =(gistid)?await gists.update(gistid,data) :await gists.create(data)
  ;
  if(root.togistdebug){
   console.log('gistid',ret.id)
   console.log('filename',fname)
   console.log('gist url',ret.html_url)
  }
  return ret;
 });
 root.togistsearch=(async (gistid,file)=>{
  //search id
  let url ="https://api.github.com/gists/" + gistid
  ,o={method:'GET',mode:'cors',headers:gists.headers}
  var ret =await gists.searchid(url,o)
  ;
  if(root.togistdebug) console.log('url',url);
  if(!file) return ret;
  return ret.files[file].raw_url 
 })
 root.togistpage=(async (num)=>{
  let _num=num||'1'
  ,user='gnjo'
  ,url =`https://api.github.com/users/${user}/gists?page=${_num}`
  ,o={method:'GET',mode:'cors',headers:gists.headers}
  ;
  var ret =await gists.search(url,o)
  ;
  if(root.togistdebug) console.log('url',url)
  return ret;

 });

})(this); 
;
;//https://codepen.io/gnjo/pen/mgpPEB.js?plainList=8
/*history
v0.1 lunched
v1 bugfix new root
*/
;(function(root){
 `use strict`;
 var fn=root.fn||{}
 fn.empty=(el)=>{
  while( el.firstChild ){el.removeChild( el.firstChild )}
  return el
 }
 fn.escape=(str)=>{
  return str
   .replace(/\\/g, '\\\\')
   .replace(/'/g, "\\'")
   .replace(/"/g, '\\"')
   .replace(/\//g, '\\/');
 };
 /*
 async function optimize(){
  //緊急時用
  let max=50,ary=[]
  for(let i=1;i<max;i++){
   let a =await togistpage(i);
   if(a.length===0) break;
   ary.push(a);
  }
  let mar=ary.reduce((a,b)=>{return a.concat(b)},[])
  mar=mar.filter(d=>d.files['story.txt'])
  for(let j=0;j<mar.length;j++){
   let obj=mar[j]
   let el=fn.i3(lay(obj))
   el.a2( fn.q('.index') )
   let raw=obj.files['story.txt'].raw_url
   let text=await fetch(raw).then(d=>d.text())
   obj.text=text;
   obj.desc=text.slice(0,32)
   el.q('.desc').textContent=text.slice(0,32);
   //await togist('data optimize',obj.id,'optimize.txt',obj.desc)
   if(j%10===0){ await new Promise(r => setTimeout(r, 1000)) }
  }

 }
*/
 //
 //await new Promise(r => setTimeout(r, 1000));
 function lay(obj){
  let fu=Date.now() + 25*3600
  let order =fu - new Date(obj.updated_at).getTime()
  ,size=fn.pad(obj.files['story.txt'].size,7)
  ,line=fn.pad(Math.ceil(parseInt(size)/(3*42*0.5)),4)
  ,title=fn.lex(obj.description).t
  ,updated=fn.jpTime( new Date(obj.updated_at).getTime() )
  ,id=obj.id
  ;
  return`
<li style="order:${order}" class="gistid" id="${id}" line="${line}" updated="${updated}" >
${title}</li>
`.trim()
 }
 function entry(plane,caller){
  let board=fn.i3('<ol class="index"></ol>')
  ,n=fn.i3(`<li style="order:1" ><label class="new">NEW </label><label class="upd">UPDATE</label></li>`)
  ,ne=async()=>{
   let str='＃＊新規ストーリー',nos='＃＊新規ノート'
   let a=await togist(str,void 0,'story.txt',str)
   let b=await togist(str,a.id,'note.txt',nos)
   let c=await togistsearch(a.id)
   let el=fn.i3(lay(c))
   ;el.onclick=caller//bug fix
   el.a2(board)
   ;a=b=c=void 0;
  }
  ,upd=async()=>{
   init();//
   let max=50,ary=[]
   for(let i=1;i<max;i++){
    let a =await togistpage(i);
    if(a.length===0) break;
    let mar =a
    mar=mar.filter(d=>d.files['story.txt'])
    for(let j=0;j<mar.length;j++){
     let obj=mar[j]
     ,el=fn.i3(lay(obj))
     ,raw=obj.files['story.txt'].raw_url
     ;el.onclick=caller
     el.a2( board )
     //el.q('.desc').textContent=obj.description
     //if(j%10===0){ await new Promise(r => setTimeout(r, 1000)) }   
    }
   }
   ;ary=void 0;
  }
  ,init=()=>{
   //board.innerHTML=''
   fn.empty(board)
   n.q('.new').onclick=ne;
   n.q('.upd').onclick=upd;
   n.a2(board)   
  }
  init();
  board.a2(plane)
 }

 root.planeList=entry
})(this);

/*
planeList(document.body,(e)=>{
 console.log(e.target.parentElement.id) 
})
;
*/
;
;//https://codepen.io/gnjo/pen/XQEpad
;(function(root){
  'use strict'
  /*lent*/
  let sol =(d=>Promise.resolve(d))
  ,isElement = function(obj){return !!(obj && obj.nodeType === 1)}
  ;
  function entry(target){
    let o={};
    /*gather*/
    o._={};
    o._['target']=target;
    ['input','ctrl','meta','shift','alt'].forEach((d)=>{
      o[d] =(obj)=>{o._[d]=Object.assign({},o._[d],obj);return o}
    })

    /*main*/
    o._done=()=>{
      let el= isElement(o._['target'])?o._['target']:document.querySelector(o._['target'])
      ,input =o._['input']||{}
      ,ctrl=Object.assign({},o._['ctrl'],o._['meta'])
      ,shift=o._['shift']||{}
      ,alt=o._['alt']||{}
      ;
      if(input['input']||input['default']){
        //el.oninput= input['input']||input['default'];
        el.addEventListener('input',input['input']||input['default'])       
      }
      let calc =function(ev){
        let k=ev.keyCode.toString();
        if( (ev.ctrlKey || ev.metaKey) && ctrl[k]){sol(k).then(d=>{ctrl[d].call(el,ev)});return}
        else if( ev.shiftKey && shift[k]){sol(k).then(d=>{shift[d].call(el,ev)});return}
        else if( ev.altKey && alt[k]){sol(k).then(d=>{alt[d].call(el,ev)});return}
        if( input[k] ){sol(k).then(d=>{input[d].call(el,ev)});return}
      }
        el.addEventListener('keydown',calc)
      //something...
      return el;
    }    
    /*emit*/
    o.end=(log)=>{
      if(log) console.log(log);
      return o._done();
    }
    o.then=(caller)=>{return new Promise((sol)=>{
      let ret =o._done();
      sol(caller(ret))
     })      
    }
    return o;
  }
  ;
  root.keyCmd=entry;
  /*
let in1=function(ev){ console.log('in') }
,in2=function(ev){ ev.preventDefault() }
keyCmd(document.querySelector('textarea'))
 .input({'default':in1})
 .input({13:in1})
 .ctrl({83:in2}) //'S'
 .ctrl({13:in2}) //'enter'
 .shift({13:in2})
 .end();
  */
})(this);

;
;
;(function(root){
  function entry(){
    if(document.body.dataset.loaded)return;
      document.body.dataset.loaded=true;
    let el=fn.i3('<div class="modal"></div>').a2(document.body)
    planeList(el,(e)=>{
      let id=e.target.id
      let base=location.href + 'freenote.html'//'https://gnjo.github.io/freenote/freenote.html'
      ,p='?id='+id
      window.open(base+p,'_blank');
      })
 }
 root.init=entry;
})(this);

keyCmd(document.documentElement)
 .ctrl({13:init})
 .end();
