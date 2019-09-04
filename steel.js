/*hisotry
v1.0 make
v1.x ...
v2.0 app.opt add
*/
let app=lcr("auto",/*'54rem'*/'44rem',/*'20rem'*/'15rem')
//calc ...
;(function(app){
 app.name='steel'
 app.id=''
 //app.save=(d)=>{return fn.save(app.name,d)}
 //app.load=(d)=>{return fn.load(app.name)}
 app.dict={}
 app.lexdict=(_text,_id)=>{
  let text=_text
  ,id=_id
  ,lex=(text)=>{
   let re1=/^＊(.+?)：(.+?)＠(.+)/
   ,re2=/^＊(.+?)：(.+)/
   ,re=re1.test(text)?re1:re2.test(text)?re2:void 0
   return (re)?text.match(re):void 0
  }
  ,set=(d)=>{return app.dict[d[1]]={key:d[1],str:d[2],img:d[3],link:id }}
  Object.keys(app.dict).map(d=>{ if(app.dict[d].link===id) delete app.dict[d]}) //range reflesh
  return text.split('\n').map(lex).filter(d=>d).map(set)
 }
 app.makedict=(e)=>{
  if(e)return app.lexdict(e.target.textContent,e.target.dataset.id);
  return fn.qa('#left .ed[data-type="note"]')
   .map(el=>{
   let d=app.lexdict(el.textContent,el.dataset.id)
   ,frame=el.parentElement
   ,urlary=d.filter(d=>d.img)//.map(d=>d.img)
   ;
   app.addimage(fn.q('.items',frame),urlary)
   return d;
  })
 }  
 app.makeid=()=>{return fn.rkana(8)}
 app.iscenter=(el)=>{
  try{
   let x=el.parentElement.parentElement.parentElement.id
   return (x==='center')?true:false
  }catch(e){
   return true;
  }
 }
 app.add=(_text,isnote)=>{
  let is={}
  is.string = function(obj){return toString.call(obj) === '[object String]'}
  let act=document.activeElement
  ,text=is.string(_text)?_text:"＃新"
  ,flg=act.classList.contains('ed')
  ,flg2=(flg)?app.iscenter(act):(isnote)?false:true
  ,body=(flg2)?fn.q('#center .wrap'):fn.q('#left .wrap')
  ,id=app.makeid()
  ,temp=`<div class="frame">
<div class="ed" data-id="${id}">${text}</div>
<div class="items"></div>
</div>`.trim()
  ,el=fn.fr(temp)
  ;
  let w=(flg)?fn.as2(el,act.parentElement):fn.a2(el,body)
  ,ed=(flg2)?fn.q(`#center .wrap .ed[data-id=${id}]`):fn.q(`#left .wrap .ed[data-id=${id}]`)
  ,frame=ed.parentElement
  ed.dataset.type=(flg2)?'story':'note'
  //lexer.lex(frame,ed)
  editableLex(ed)
  //Object.assign(el.dataset,fn.lex(el.textContent))
  return ed;
 }
 app.del=()=>{
  let act=document.activeElement
  ;
  if(!act.classList.contains('ed'))return;
  let query=app.iscenter(act)?'#center .ed':"#left .ed"
  if(query===act)return;
  if(!(act.textContent.length===0))return;
  ;
  return fn.r(act.parentElement)
 }
 ;
 app.addimage=(el,urlary)=>{  
  let items=el
  ,ary=fn.setary(urlary,'key')
  ,html=ary.filter(d=>is.imgurl(d.img)).map(d=>`
<div class="pop" data-key="${d.key}"><img src="${d.img}"></div>
`.trim()).join('')
  fn.empty(items)
  fn.a2(fn.fr(html),items)
 }
 app.calc=(e)=>{
  if(!e.target.classList.contains('ed'))return;
  let ed=e.target
  ,frame=e.target.parentElement
  ;
  if(ed.dataset.type==='story')return;
  let d=app.makedict(e);
  let urlary=d.filter(d=>d.img)
  app.addimage(fn.q('.items',frame),urlary)
  //lexer.lex(frame,ed)
 }
})(app);
//total
;(function(app){
 document.body.appendChild(fn.i3('<div class="total"></div>'))
 let total=fn.q('.total')
 //
 total.dataset.total="000"
 total.dataset.lv="0"
 app.totalcalc=()=>{
  let ary=fn.qa('#center .ed[data-type="story"]')
  total.dataset.total=ary.map(d=>parseInt(d.dataset.lines2,10)).reduce((a,b)=>a+b,0)
  total.dataset.lv=ary.length  
 }
 ;
})(app);
//right makemenu
;(function(app){
 app.scv2=(id)=>{
  let tar=fn.q(`#center .ed[data-id="${id}"]`)
  fn.scv2(tar,'28px')
 }
 app.makemenu=(id)=>{
  let html=fn.qa('#center .ed[data-type="story"]').map((d,i)=>{
   let num=fn.pad(i,3)
   ,id=d.dataset.id
   ,title=d.dataset.headline
   let layout=`
<div class="list" data-num="${fn.pad(i,3)}" data-id="${id}" data-headline="${title}" onclick="app.scv2('${id}')"></div>
`.trim()
   return layout
  }).join('\n')
  ;
  fn.empty(app.r);
  fn.a2(fn.fr(html),app.r);
 }
})(app);
//left
;(function(app){

 app.searchInit=async ()=>{
  let url="https://gnjo.github.io/steel/nihongo.txt"
  let helptext=await fetch(url).then(d=>d.text())
  let layout=`<div class="frame"><div class="suptext search">${helptext}</div></div>`
  ;
  fn.p2(fn.fr(layout),app.l)
  let se=fn.q('.search',app.l)
  ;
  let wsrc=await fetch('https://gnjo.github.io/wordnetWorker.js').then(d=>d.text())
  let w=fn.worker(wsrc);
  w.onmessage=function(ev){ 
   se.textContent += '/'+ev.data.map(d=>d[2]).join('/') 
  }
  ;
  let wsrc2=await fetch('https://gnjo.github.io/edictWorker.js').then(d=>d.text())
  let w2=fn.worker(wsrc2)
  w2.onmessage=function(ev){
   se.textContent += '/'+ev.data.map(d=>d.split("/").slice(0,1).pop().trim()).join('/')
  }
  ;
  app.helptext=helptext
  app.w=w
  app.w2=w2
  app.se=se
  //console.log(app.se)
 }
 app.search=(e)=>{
  let word=fn.gsl()//e.target.textContent;
  //console.log(word,word.length)
  if(!word)return app.se.textContent=app.helptext||'';
  app.se.textContent=word
  app.w.postMessage(word);
  app.w2.postMessage(word);
 }
})(app);
//save load
;(function(app){
 
 app.opt=JSON.parse(fn.getparam('opt',location.href))
 var //basefile='steel.txt'
 notefile=app.opt.sub//'note.txt'
 ,storyfile=app.opt.main//'story.txt'
 ,to=getTogist(app.opt.u,localStorage.getItem(app.opt.p))
 ;
 function serialize(){
  let data=fn.qa('#center .ed').map(d=>fn.clone(d.dataset))
  return data;
 }
 function notetext(){
  return fn.qa('#left .ed[data-type="note"]').map(d=>d.textContent.trim())
   .map(d=>d.replace(/^＊/,'＃'))
   .join('\n')
 } 
 function storytext(){
  return fn.qa('#center .ed[data-type="story"]').map(d=>d.textContent.trim()).join('\n')
 }
 app.id=fn.getparam('id',location.href)//
 if(app.id){
  app.save=()=>{
   /*let se=JSON.stringify(serialize())
   ,*/let st=storytext()||'＃新'
   ,nt=notetext()||'＃新ノート'
   ,title=fn.q('#center .ed').dataset.headline||st.slice(0,36)
   return to.togist2([ /*[se,basefile],*/[st,storyfile],[nt,notefile] ],app.id,title)
  }
  app.load=async ()=>{
   /*
   try{
    let raw_url=await to.togistsearch(app.id,basefile)
    ,ary=await fetch(raw_url).then(d=>d.json())
    ary.map(d=>{ app.add(d.s) })
   }catch(e){
   */
   let raw_url=await to.togistsearch(app.id,storyfile)
   ,text=await fetch(raw_url).then(d=>d.text())||'＃新ストーリ'
   ,ary=fn.biglex(text)
   ary.map(d=>{ app.add(d) })
   ;
   raw_url=await to.togistsearch(app.id,notefile)
   text=await fetch(raw_url).then(d=>d.text())||'＃新ノート'
   ary=fn.biglex(text)
   ary.map(d=>{ app.add(d,true) })
   //}
  }
 }else{
  app.save=()=>{
   fn.save(notefile,notetext())
   fn.save(storyfile,storytext())
  }
  app.load=()=>{
   let s=fn.load(storyfile)||'＃新ストーリ'
   let n=fn.load(notefile)||'＃新ノート'
   fn.biglex(s).map(d=>{ app.add(d) })
   fn.biglex(n).map(d=>{ app.add(d,true) })
   return Promise.resolve()
  }
 }
 ;
})(app);
//jplex
;(function(app){
 //jplexDebug=true;
 app.makekeyword=()=>{
  let dict=app.dict||{}
  ,f=(a,b)=>(a.length<b.length)?1:-1
  ,data=Object.keys(dict).sort(f).join('|')||'っっってっっってっ'//initialize empty danger
  return {cls:'keyword',re:data}
 }
 app.jplexopt=[
  {cls:'keyword',re:''} 
  ,{cls:'sijigo',re:`これ,ここ,こっち,こちら,こいつ,こなた,この,こう,こんな
それ,そこ,そっち,そちら,そいつ,そなた,その,そう,そんな
あれ,あそこ,あっち,あちら,あいつ,あなた,あの,ああ,あんな
どれ,どこ,どっち,どちら,どいつ,どなた,どの,どう,どんな`.replace(/\n|,/g,'|')}  
  ,{cls:'setuzokusi',re:`だから,そこで,従って,故に,それ故,すると,それなら,それでは,したがって,ゆえに,それゆえ
しかし,けれども,処が,にも関わらず,それでも,ところが,にもかかわらず
また,および,かつ,ならびに,同じく,又,おなじく
そして,それに,それから,しかも,その上,そればかりか,そればかりでなく
一方,他方,逆に,反対に,反面,いっぽう,たほう,ぎゃくに,はんたいに,はんめん
または,それとも,あるいは,もしくは,又は
なぜなら,というのは,何故なら
なお,但し,ただ,尤も,ちなみに,そもそも,その割,ただし,もっとも,そのわり
つまり,すなわち,要するに,例えば,いわば,ようするに,たとえば
特に,とりわけ,中でも,とくに,なかでも
さて,処で,ところで`.replace(/\n|,/g,'|')}
  ,{cls:'tu',re:'っ'} 
  ,{cls:'kata',re:'[\u30a0-\u30ff]{1,20}'}
  ,{cls:'hira',re:'[\u3040-\u309f]{4,20}'}
 ]
 ;
 app.jplexoff=function calc(e){
  e.preventDefault()
  if(!(e.target.classList.contains('ed')))return;
  if(e.target.dataset.type==="note")return;
  e.target.dataset.jplex =void 0;
  e.target.textContent=e.target.textContent;
  fn.setCaret(e.target,-1)  
 }

 let hover=(el)=>{
  let key=el.textContent
  ,col=app.dict[key]
  ;
  Object.assign(el.dataset,col)
  el.onclick=()=>{ fn.scv2(fn.q(`[data-id="${col.link}"]`),'28px') }
  return el;
 }
 app.jplex=function calc(e){
  e.preventDefault()
  if(!(e.target.classList.contains('ed')))return;
  if(e.target.dataset.type==="note")return;

  app.jplexopt[0]=app.makekeyword();
  let html=jplex(e.target.textContent,app.jplexopt)
  fn.empty(e.target)
  fn.a2(fn.fr(html),e.target)
  fn.setCaret(e.target,-1)
  let urlary=fn.qa('.keyword',e.target).map(d=>{
   hover(d);
   return (d.dataset.img==='undefined')?void 0:fn.clone(d.dataset);
  }).filter(d=>d)
  ,frame=e.target.parentElement
  ;
  //console.log(urlary)
  app.addimage(fn.q('.items',frame),urlary)
 }

})(app); 
//dropimage
;(function(app){ 
 //dropsetting
 app.dropimage=(d,file)=>{
  let calc=(d)=>{
   let url=d.data.link
   ,text=`＃新イメージ\n＊用語：説明＠${url}`
   ,el=app.add(text,true)
   ;
   fn.copy(url)
   fn.scv(el)
  }
  return imgc(d).fit({w:300}).filter('blue').then(fn.upi).then(calc)
 }
 ;
})(app);

//init
;(function(app){

 app.init=async ()=>{
  await app.searchInit()
  await app.load()
  ;
  editable('.ed',true)
  fn.ua(app.c,'data-length',app.calc,70,true)
  fn.ua(app.l,'data-length',app.calc,70,true)  
  ;
  keyCmd(document.documentElement)
   .input({33:app.jplexoff})
   .input({34:app.jplex})
   .ctrl({13:app.add})
   .ctrl({8:app.del})
   .ctrl({32:app.search}) //
   .end('');  

  fn.ua(app.c,'data-headline',app.makemenu,300,true)
  fn.ua(app.c,'data-length',app.save,3000,true)
  fn.ua(app.l,'data-length',app.save,3000,true)  
  fn.ud(app.c,app.save,2000)
  fn.ud(app.l,app.save,2000)  
  fn.ua(app.c,'data-length',app.totalcalc,500,true) 
  app.makemenu();
  app.totalcalc();
  app.makedict();

  imageReader(document.documentElement,app.dropimage)  
 }

})(app);

////call init
;(function(app){
 let spinner=(flg)=>{
  if(flg)return fn.q('.total').classList.add('mark')
  else fn.q('.total').classList.remove('mark')
 }
 let anim=(symbol,step,endflg,total,count)=>{
  //console.log(symbol,step,endflg,total,count) 
  if(!( symbol==='save'||symbol==='load'||symbol==='dropimage'))return;
  return (endflg)?spinner(false):spinner(true)
 }
 app=interceptor(app,anim,1000/200)
 ;
 app.init()/////////////////////////////////////////////////////////////////////////
 ;  
})(app);
