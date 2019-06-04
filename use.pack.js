/*
 //script(src="https://gnjo.github.io/interceptor/interceptor.js?v=11") 
 // script(src="https://gnjo.github.io/keyCmd.js")
 // script(src="https://gnjo.github.io/filter.js?v=2")
 // script(src="https://gnjo.github.io/imgc.js") 
 // script(src="https://gnjo.github.io/imageReader.js")
 // script(src="https://gnjo.github.io/CyPk/dropandpop.js?v=1")
 // script(src="https://gnjo.github.io/getTogist.js")
 //script(src="https://gnjo.github.io/jplex/jplex.js?v=8") 
 //script(src="https://gnjo.github.io/editable/editableEx.js?v=1")


*/
/*history
 v1.0 start
 v1.1 fin bugfix
*/
;(function(root){
 let is={}
 is.promise=function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
 }
 is.function = function(obj){return toString.call(obj) === '[object Function]'}
 ;

 function entry(obj,caller,steprate){
  if(!obj)return console.log('need obj')
  if(!caller)return console.log('need caller')
  var o={}
  o.steprate=steprate||50
  o.caller=caller
  o.bootstep=0;
  o.funccount=0
  ;
  setInterval(()=>{o.bootstep++},o.steprate)
  o.I= function f(_symbol,_func){return function x(){
   let endflg=false
   ,symbol=_symbol
   ,count=o.funccount
   ,w=o.caller(symbol,0,endflg,o.bootstep,count)
   ,step=1
   ,ci=setInterval(()=>{
    o.caller(symbol,step,endflg,o.bootstep,count)
    if(endflg) clearInterval(ci);
    step++;
   },o.steprate)
   ,func=_func   
   ,result=func.apply(this,arguments)
   ,fin=(d)=>{endflg=true; o.funccount++ ;return d}
   ;
   return is.promise(result)?result.finally(fin):fin(result)
  }}
  o.keys=Object.keys(obj.__proto__).concat(Object.keys(obj)).filter(d=>is.function(obj[d]))
  o.keys.map(key=>{ obj[key]=o.I(key,obj[key]) })
  return obj;
 }
 root.interceptor=root.intercepter=entry;
})(this);

/*****/
/*history
 v2.0 bugfix able the preventDefault
*/
//https://codepen.io/gnjo/pen/XQEpad
;(function(root){
  'use strict'
  /*lent*/
  let isElement = function(obj){return !!(obj && obj.nodeType === 1)}
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
        if( (ev.ctrlKey || ev.metaKey) && ctrl[k]){ctrl[k].call(el,ev);return}
        else if( ev.shiftKey && shift[k]){shift[k].call(el,ev);return}
        else if( ev.altKey && alt[k]){alt[k].call(el,ev);return}
        if( input[k] ){input[k].call(el,ev);return}
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

/*****/
(function(root){ 
//----------------------------------------------
  // フィルタ関数
  //----------------------------------------------

  /**
   * フィルタなし
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
function _nofilter(data,w,h) {
    /* nop */
    return data;
  }

  /**
   * グレースケール
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
function _grayscale(data,w,h) {
    for (let i = 0; i < data.length; i += 4) {
      // (r+g+b)/3
      const color = (data[i] + data[i+1] + data[i+2]) / 3;
      data[i] = data[i+1] = data[i+2] = color;
    }

    return data;
  }

  /**
   * 階調反転
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
function _inversion(data,w,h) {
    for (let i = 0; i < data.length; i += 4) {
      // 255-(r|g|b)
      data[i]   = Math.abs(255 - data[i])  ;
      data[i+1] = Math.abs(255 - data[i+1]);
      data[i+2] = Math.abs(255 - data[i+2]);
    }

    return data;
  }

  /**
   * 二値化
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
 function _binarization(data,w,h) {
    const threshold = 255 / 2;

    const getColor = (data, i) => {
      // threshold < rgbの平均
      const avg = (data[i] + data[i+1] + data[i+2]) / 3;
      if (threshold < avg) {
        // white
        return 255;
      } else {
        // black
        return 0;
      }
    };

    for (let i = 0; i < data.length; i += 4) {
      const color = getColor(data, i);
      data[i] = data[i+1] = data[i+2] = color;
    }

    return data;
  }

  /**
   * ガンマ補正
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
function _gamma(data,w,h) {
    // 補正値（1より小さい:暗くなる、1より大きい明るくなる）
    const gamma = 2.0;
    // 補正式
    const correctify = val => 255 * Math.pow(val / 255, 1 / gamma);

    for (let i = 0; i < data.length; i += 4) {
      data[i]   = correctify(data[i]);
      data[i+1] = correctify(data[i+1]);
      data[i+2] = correctify(data[i+2]);
    }

    return data;
  }

  /**
   * ぼかし(3x3)
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
function _blur(data,w,h) {
    const _data = data.slice();
    const avgColor = (color, i) => {
      const prevLine = i - (w/*this.canvasWidth*/ * 4);
      const nextLine = i + (w/*this.canvasWidth*/ * 4);

      const sumPrevLineColor = _data[prevLine-4+color] + _data[prevLine+color] + _data[prevLine+4+color];
      const sumCurrLineColor = _data[i       -4+color] + _data[i       +color] + _data[i       +4+color];
      const sumNextLineColor = _data[nextLine-4+color] + _data[nextLine+color] + _data[nextLine+4+color];

      return (sumPrevLineColor + sumCurrLineColor + sumNextLineColor) / 9
    };

    // 2行目〜n-1行目
    for (let i = w/*this.canvasWidth*/ * 4; i < data.length - (w/*this.canvasWidth*/ * 4); i += 4) {
      // 2列目〜n-1列目
      if (i % (w/*this.canvasWidth*/ * 4) === 0 || i % ((w/*this.canvasWidth*/ * 4) + 300) === 0) {
        // nop
      } else {
        data[i]   = avgColor(0, i);
        data[i+1] = avgColor(1, i);
        data[i+2] = avgColor(2, i);
      }
    }

    return data;
  }

  /**
   * シャープ化
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
function _sharpen(data,w,h) {
    const _data = data.slice();
    const sharpedColor = (color, i) => {
      // 係数
      //  -1, -1, -1
      //  -1, 10, -1
      //  -1, -1, -1
      const sub = -1;
      const main = 10;

      const prevLine = i - (w/*this.canvasWidth*/ * 4);
      const nextLine = i + (w/*this.canvasWidth*/ * 4);

      const sumPrevLineColor = (_data[prevLine-4+color] * sub)  +  (_data[prevLine+color] * sub )  +  (_data[prevLine+4+color] * sub);
      const sumCurrLineColor = (_data[i       -4+color] * sub)  +  (_data[i       +color] * main)  +  (_data[i       +4+color] * sub);
      const sumNextLineColor = (_data[nextLine-4+color] * sub)  +  (_data[nextLine+color] * sub )  +  (_data[nextLine+4+color] * sub);

      return (sumPrevLineColor + sumCurrLineColor + sumNextLineColor) / 2
    };

    // 2行目〜n-1行目
    for (let i = w/*this.canvasWidth*/ * 4; i < data.length - (w/*this.canvasWidth*/ * 4); i += 4) {
      // 2列目〜n-1列目
      if (i % (w/*this.canvasWidth*/ * 4) === 0 || i % ((w/*this.canvasWidth*/ * 4) + 300) === 0) {
        // nop
      } else {
        data[i]   = sharpedColor(0, i);
        data[i+1] = sharpedColor(1, i);
        data[i+2] = sharpedColor(2, i);
      }
    }

    return data;
  }

  /**
   * メディアンフィルタ
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
 function _median(data,w,h) {
    const _data = data.slice();
    const getMedian = (color, i) => {
      // 3x3の中央値を取得
      const prevLine = i - (w/*this.canvasWidth*/ * 4);
      const nextLine = i + (w/*this.canvasWidth*/ * 4);

      const colors = [
        _data[prevLine-4+color], _data[prevLine+color], _data[prevLine+4+color],
        _data[i       -4+color], _data[i       +color], _data[i       +4+color],
        _data[nextLine-4+color], _data[nextLine+color], _data[nextLine+4+color],
      ];

      colors.sort((a, b) => a - b);
      return colors[Math.floor(colors.length / 2)];
    };

    // 2行目〜n-1行目
    for (let i = w/*this.canvasWidth*/ * 4; i < data.length - (w/*this.canvasWidth*/ * 4); i += 4) {
      // 2列目〜n-1列目
      if (i % (w/*this.canvasWidth*/ * 4) === 0 || i % ((w/*this.canvasWidth*/ * 4) + 300) === 0) {
        // nop
      } else {
        data[i]   = getMedian(0, i);
        data[i+1] = getMedian(1, i);
        data[i+2] = getMedian(2, i);
      }
    }

    return data;
  }

  /**
   * エンボス
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
 function _emboss(data,w,h) {
    const _data = data.slice();
    const embossColor = (color, i) => {
      // 係数
      //  -1,  0,  0
      //   0,  1,  0
      //   0,  0,  0
      // → + (255 / 2)

      const prevLine = i - (w/*this.canvasWidth*/ * 4);
      return ((_data[prevLine-4+color] * -1) + _data[i+color]) + (255 / 2);
    };

    // 2行目〜n-1行目
    for (let i = w/*this.canvasWidth*/ * 4; i < data.length - (w/*this.canvasWidth*/ * 4); i += 4) {
      // 2列目〜n-1列目
      if (i % (w/*this.canvasWidth*/ * 4) === 0 || i % ((w/*this.canvasWidth*/ * 4) + 300) === 0) {
        // nop
      } else {
        data[i]   = embossColor(0, i);
        data[i+1] = embossColor(1, i);
        data[i+2] = embossColor(2, i);
      }
    }

    return data;
  }

  /**
   * モザイク
   * @param {Array<Number>} data ImageData.dataの配列（dataを書き換える）
   */
function _mosaic(data,w,h) {
    const _data = data.slice();

    const avgColor = (i, j, color) => {
      // 3x3の平均値
      const prev = (((i - 1) * w/*this.canvasWidth*/) + j) * 4;
      const curr = (( i      * w/*this.canvasWidth*/) + j) * 4;
      const next = (((i + 1) * w/*this.canvasWidth*/) + j) * 4;

      const sumPrevLineColor = _data[prev-4+color] + _data[prev+color] + _data[prev+4+color];
      const sumCurrLineColor = _data[curr-4+color] + _data[curr+color] + _data[curr+4+color];
      const sumNextLineColor = _data[next-4+color] + _data[next+color] + _data[next+4+color];

      return (sumPrevLineColor + sumCurrLineColor + sumNextLineColor) / 9;
    };

    // 3x3ブロックずつ色をぬる
    for (let i = 1; i < w/*this.canvasWidth*/; i += 3) {
      for (let j = 1; j < h/*this.canvasHeight*/; j += 3) {

        const prev = (((i - 1) * w/*this.canvasWidth*/) + j) * 4;
        const curr = (( i      * w/*this.canvasWidth*/) + j) * 4;
        const next = (((i + 1) * w/*this.canvasWidth*/) + j) * 4;

        ['r', 'g', 'b'].forEach((_, color) => {
          data[prev-4+color] = data[prev+color] = data[prev+4+color] = avgColor(i, j, color);
          data[curr-4+color] = data[curr+color] = data[curr+4+color] = avgColor(i, j, color);
          data[next-4+color] = data[next+color] = data[next+4+color] = avgColor(i, j, color);
        });
      }
    }

    return data;
  }
function _green(data,w,h) {
    let f=d=>Math.min(Math.floor(d),255)
    for (let i = 0; i < data.length; i += 4) {
      // (r+g+b)/3
      const color = (data[i] + data[i+1] + data[i+2]) / 3;
      data[i] = color;
      data[i+1] =f(color+color*0.5) 
      data[i+2] =f(color+color*0.25) 
    }
    return data;
  }

function _blue(data,w,h) {
    let f=d=>Math.min(Math.floor(d),255)
    for (let i = 0; i < data.length; i += 4) {
      // (r+g+b)/3
      const color = (data[i] + data[i+1] + data[i+2]) / 3;
      data[i] = color;
      data[i+1] =f(color+color*0.25) 
      data[i+2] =f(color+color*0.5) 
    }
    return data;
  }

function _sobel(data,w,h) {
 var width=w;
 var height=h;

 var kernelX = [
  [-1,0,1],
  [-2,0,2],
  [-1,0,1]
 ];

 var kernelY = [
  [-1,-2,-1],
  [0,0,0],
  [1,2,1]
 ];

 var sobelData = [];
 var grayscaleData = [];

 function bindPixelAt(data) {
  return function(x, y, i) {
   i = i || 0;
   return data[((width * y) + x) * 4 + i];
  };
 }

 //var data = _data //
 var pixelAt = bindPixelAt(data);
 var x, y;

 for (y = 0; y < height; y++) {
  for (x = 0; x < width; x++) {
   var r = pixelAt(x, y, 0);
   var g = pixelAt(x, y, 1);
   var b = pixelAt(x, y, 2);

   var avg = (r + g + b) / 3;
   grayscaleData.push(avg, avg, avg, 255);
  }
 }

 pixelAt = bindPixelAt(grayscaleData);

 for (y = 0; y < height; y++) {
  for (x = 0; x < width; x++) {
   var pixelX = (
    (kernelX[0][0] * pixelAt(x - 1, y - 1)) +
    (kernelX[0][1] * pixelAt(x, y - 1)) +
    (kernelX[0][2] * pixelAt(x + 1, y - 1)) +
    (kernelX[1][0] * pixelAt(x - 1, y)) +
    (kernelX[1][1] * pixelAt(x, y)) +
    (kernelX[1][2] * pixelAt(x + 1, y)) +
    (kernelX[2][0] * pixelAt(x - 1, y + 1)) +
    (kernelX[2][1] * pixelAt(x, y + 1)) +
    (kernelX[2][2] * pixelAt(x + 1, y + 1))
   );

   var pixelY = (
    (kernelY[0][0] * pixelAt(x - 1, y - 1)) +
    (kernelY[0][1] * pixelAt(x, y - 1)) +
    (kernelY[0][2] * pixelAt(x + 1, y - 1)) +
    (kernelY[1][0] * pixelAt(x - 1, y)) +
    (kernelY[1][1] * pixelAt(x, y)) +
    (kernelY[1][2] * pixelAt(x + 1, y)) +
    (kernelY[2][0] * pixelAt(x - 1, y + 1)) +
    (kernelY[2][1] * pixelAt(x, y + 1)) +
    (kernelY[2][2] * pixelAt(x + 1, y + 1))
   );

   var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY))>>>0;

   sobelData.push(magnitude, magnitude, magnitude, 255);
  }
 }
 //hard write 
 sobelData.map((d,i)=>{data[i]=d})
 return data
}
  
  
 //pack
 var o ={};
o._nofilter =_nofilter;
o._grayscale=_grayscale;
o._inversion=_inversion;
o._binarization=_binarization;
o._gamma=_gamma;
o._blur =_blur;
o._sharpen=_sharpen;
o._median=_median;
o._emboss=_emboss;
o._mosaic=_mosaic;
//add
o._blue=_blue
o._green=_green
//add
o._sobel=_sobel  
 
 root.filter =o;
 
 })(this);

/*****/
(function(root){
/*
v1.0 filter is or not OK 
v1.1 filter not bug
v1.2 ctx memmory reflesh
*/
 let filter=root.filter||{}
// ,isFilter=(d)=>{
//  return (Object.keys(filter).filter(k=>d===k||d===k.slice(1)).length===0)?false:true
//}
 ,fits=(ow,oh,tw,th,fa=1)=>{
    // calc scale and calc clip
    let scale = (ow/oh > tw/th)? th/oh :tw/ow
    ,faceupRate =(fa<=0)?1 :fa
    ,clipW = tw / scale
    ,clipH = th / scale
    ,clipX = (ow - clipW) / 2
    ,clipY = (oh - clipH) / (2*faceupRate)
    ;
    
    return {clipX:clipX, clipY:clipY, clipW:clipW, clipH:clipH, tw:tw, th:th }
   //context.drawImage(img, s.clipX, s.clipY, s.clipW, s.clipH, 0, 0, s.tw, s.th);
}
,toCanvas=(url,opt)=>{return new Promise((sol)=>{ 
  let img =new Image()
  ,caller =function(){
    let canvas = document.createElement('canvas')
    ,context = canvas.getContext('2d')
    ,size = opt['fit']
    ,fil =opt['filter']
    ,s
    ;
    if(!size.w && size.h)
     s=fits(img.width,img.height,img.width*size.h/img.height ,size.h,size.fa||1)
    else if(size.w && !size.h)
     s=fits(img.width,img.height,size.w,img.height*size.w/img.width,size.fa||1)
    else //if(size.w && size.h)
     s=fits(img.width,img.height,size.w||img.width,size.h||img.height,size.fa||1)
    ;
    canvas.width = s.tw;
    canvas.height = s.th;
    context.drawImage(img, s.clipX, s.clipY, s.clipW, s.clipH, 0, 0, s.tw, s.th);
    
    let srcData = context.getImageData(0,0,s.tw,s.th);
     //filters
     fil.forEach(d=>filter[d](srcData.data,s.tw,s.th))
//      filter._grayscale(srcData.data,s.tw,s.th);
//      filter._median(srcData.data,s.tw,s.th);    
      context.putImageData(srcData,0,0);
      sol(canvas.toDataURL()) //
     setTimeout(()=>{img=void 0;canvas=void 0;context=void 0;srcData=void 0},0)//memory reflesh
    }
  ;
  
    img.onload =caller;
    img.src=url;   
  })
}

 function entry(base64){
  let o={};
  
  o._={filter:[],base64:base64};
  o.filter =(obj)=>{ /*if(isFilter(obj))*/ o._['filter'].push('_'+obj.replace('_','')); return o}
  o.fit=(obj)=>{ o._['fit']=obj; return o}
  o._calc=toCanvas;
  o.then=function(obj){return o._calc(o._['base64'],o._).then(obj) }
  
  
  return o;
 }
 
 root.imgc =entry;
})(this);

/*****/

//image reader
;(function(root){
  //need
  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }
  function handleFileSelect(caller) {return function(evt){
    evt.stopPropagation();
    evt.preventDefault();
    //both ondrop and input type=file
    var files = evt.target.files||evt.dataTransfer.files;
    // Loop through the FileList and render image files as thumbnails.
    readFile(files,caller);
  }}
  function readFile(files,caller){
    if(files.length==0) return;
    if(files.length>5) console.log('max 5files ');
    ;[].slice.call(files)
      .filter(f=>f.type.match('image.*'))
      .slice(0,5)
      .map(file=>{
      var reader = new FileReader();
      reader.onload = (function (thefile,thecaller) {
        return function(e) {		        		
          var text = e.target.result;
          thecaller(text,thefile);
        };
      })(file,caller); 
      reader.readAsDataURL(file);
    })    
    }  
  function imageReader(el,caller){
    var o={};
    o.el=el;
    o.caller=caller||function(ev){/**/};
    o.el.ondragover =handleDragOver;//
    o.el.ondrop=handleFileSelect(o.caller);//
  }
  root.imageReader=imageReader;
 /*usage
 imageReader(document.body,(d,f)=>{
 console.log(f)
 //f.name f.size ...
 //d is base64 ...
 
})
 */
})(this);

/*****/
//https://codepen.io/gnjo/pen/JVadma.js?doropandpop=3
/*history
 v1.0 writed
 v1.0 document.body=>document.documentElement
*/
;(function(root){ 
 var imageReader=root.imageReader||{}
 ,imgc=root.imgc
 ,fn=root.fn||{}
 ,sp=root.sp||void 0
 ;
 let sign='dropandpop'
 //dropsetting
 if(document.body.dataset[sign]) return console.log('double load block',sign)
 ;
 imageReader(/*document.body*/document.documentElement,(d,file)=>{
  let style=`
position: fixed;
width: 200px;
height: 100px;
outline: none;
object-fit: cover;
z-index:1000;
top: 50%;
right: 0%;
transform: translateY(-50%);
`.replace(/\n/g,' ');
  let frame=(url)=>{
   return`
<img class="pop" src="${url}" onclick="fn.copy('${url}');this.remove();" tabindex="-1" style="${style}">
`
  }
  if(sp) sp.run();
  let o=imgc(d).fit({w:300})
 .filter('blue')
  .then(fn.upi).then(d=>{
   let url=d.data.link
   ,html=frame(url)
   ,img=fn.i3(html).a2(document.body)
   ;
   if(sp) sp.run(-1)
  })
  //f.name f.size ...
  //d is base64 ...
 })
 document.body.dataset[sign]=true

})(this);

/*****/
;(function(root){
 /*history
 v1.0 multiple user 
 v1.1 to.togistdebug

 */

 function entry(u,a){
  'use strict';
  ;
  var to={}
  var gists={}
  gists.user=u
  gists.authstring=a //basic ...........
  gists.headers={
   "Authorization":gists.authstring
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

  to.togistdebug=false;

  //ary=[[c,f],[c,f]]... c is content, f is filename
  to.togist2=(async (_ary,gistid,desc)=>{

   //let fname= filename||'anonymous'
   let ary =_ary
   ,data={"files": { } }
   if(desc) data.description=desc; //bug fix desc
   data.public=false
   ary.map(d=>{
    let content=d[0],fname=d[1];
    if(to.togistdebug){
     console.log('content length',content.length)
     console.log('fname',fname)
    }

    data.files[fname] = {"content": content}
   })
   ;
   var ret =(gistid)?await gists.update(gistid,data) :await gists.create(data)
   ;
   if(to.togistdebug){
    console.log('gistid',ret.id)
    console.log('gist url',ret.html_url)
   }
   return ret;
  });


  to.togist=(async (content,gistid,filename,desc)=>{

   let fname= filename||'anonymous'
   ,data={"files": { } }
   if(desc) data.description=desc; //bug fix desc
   data.public=false
   data.files[fname] = {"content": content}
   ;
   var ret =(gistid)?await gists.update(gistid,data) :await gists.create(data)
   ;
   if(to.togistdebug){
    console.log('gistid',ret.id)
    console.log('filename',fname)
    console.log('gist url',ret.html_url)
   }
   return ret;
  });

  to.togistsearch=(async (gistid,file)=>{
   //search id
   let url ="https://api.github.com/gists/" + gistid
   ,o={method:'GET',mode:'cors',headers:gists.headers}
   var ret =await gists.searchid(url,o)
   ;
   if(to.togistdebug) console.log('url',url);
   if(!file) return ret;
   return ret.files[file].raw_url 
  })
  to.togistpage=(async (num)=>{
   let _num=num||'1'
   ,user=gists.user
   ,url =`https://api.github.com/users/${user}/gists?page=${_num}`
   ,o={method:'GET',mode:'cors',headers:gists.headers}
   ;
   var ret =await gists.search(url,o)
   ;
   if(to.togistdebug) console.log('url',url)
   return ret;

  });

  return Object.assign({},to,gists)
 }

 root.getTogist=entry;
})(this);

/*****/
/*histroy

*/
;(function(root){

 function entry(_data,_opt){
  if(!_data)return console.log('data null')
  ;
  let debug=root.jplexDebug
  ,t=(debug)?performance.now():void 0  
  ,opt=_opt||[{cls:'kata',re:'[\u30a0-\u30ff]{1,20}'}]
  ,data=_data
  ,re=new RegExp(opt.map(d=>`(${d.re})`).join('|'),'g')  
  ,calc=function(){
   let ary=Array.from(arguments)
   ,word=ary.slice(0,1).pop()
   ,i=ary.slice(1).findIndex((d)=>d===word)
   ,cls=opt[i].cls
   ;
   return `<span class="${cls}">${word}</span>`
  }
  ,ret=data.replace(re,calc)
  ;
  if(debug) console.log(`calc time=${performance.now()-t}[ms]`)
  return ret;
  }
  root.jplexDebug=false
  root.jplex=entry;
 /*usage
let data=`
片仮名に対して、検索する。コーヒー牛乳。末尾代入はラストテイルだが。
複数のカタカナにマッチするように。漢字を含む途中語、明日ノ明日は、のを検索する。
`
let m=[
 {cls:'kata',re:'[\u30a0-\u30ff]{1,20}'}
 ,{cls:'keyword',re:'明日ノ明日'}
]
jplexDebug=true;
let a=jplex(data,m)
document.body.innerHTML=a;
//css
//span.kata{color:orange;}
//span.keyword{color:red;}
 */
})(this);

/*****/
/*history
v1.0 create
v1.1 data-length map
v1.2 bugfix add remove wrote element
v1.3 callback
v1.4 input > keyup
v1.45 debounce def 70
v1.5 * wildcard
v1.6 data-head data-headline data-lines data-timestamp data-crcnew data-crcold data-text
v1.7 editableEx flg
v1.8 data-lines2 nihongo count line
v1.9 editableLex
*/
;(function(root){
 //'use strict'; 
 //debounce
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
})(this)
 ;
 let fn={}
fn.crcTable=(function(){
  var c,crcTable = [];
  for(var n =0; n < 256; n++){
    c = n;
    for(var k =0; k < 8; k++){
      c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
  }
  return crcTable;
})();//early gen
fn.crc32 = function(str,hex=true) {
  var crcTable = fn.crcTable,pad=( (d,l)=>('000000000000000000'+d).slice(-1*l))
  ,crc = 0 ^ (-1)
  ;
  for (var i = 0; i < str.length; i++ ) crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF]
  ;
  crc = (crc ^ (-1)) >>> 0
  ;
  return (hex)?pad(crc.toString(16),8):crc
}
 
 let is={}
 is.function = function(obj){return toString.call(obj) === '[object Function]'}
 is.element=function(o){return !!(o && o.nodeType === 1)}
 ;
 
function _lmap(e){ 
 let el=is.element(e)?e:e.target
 ,text=el.textContent
 ,ary=text.split('\n')
 ,headline=ary.slice(0,1).pop()
 ,crcnew=fn.crc32(text)
 ,crcold=el.dataset.crcnew||crcnew
 el.dataset.head=text.charAt(0)
 el.dataset.headline=headline
 el.dataset.lines=ary.length
 el.dataset.lines2=ary.map(d=>Math.ceil((d.length+0.1)/44)).reduce((a,b)=>a+b,1)
 el.dataset.timestamp=Date.now()
 el.dataset.crcold=crcold 
 el.dataset.crcnew=crcnew
 el.dataset.text=text    
 el.dataset.length=el.textContent.length;
 }
  
 function entry(_target,_flg=false,time=70){
  if(!_target)return console.log('target empty')
  let target =_target.replace(/\./g,'').split(',')
  ,wild=(_target==='*')?true:false
  ,caller=is.function(_flg)?_.debounce(_flg,time):void 0
  ,hasClass=function(el){
    if(wild) return true;
    return !(target.filter(d=>el.classList.contains(d)).length===0)
  }
  ,lmap=_lmap
  ,remove=function(e){
   let el=e.target
   el.removeAttribute('contenteditable')
   el.removeEventListener('keyup'/*'input'*/,lmap)
   if(caller)el.removeEventListener('keyup'/*'input'*/,caller)
   el.dataset.editable=false
   el=void 0
  }  
  ,add=function(e){
   if(!hasClass(e.target))return
   let el=e.target
   el.setAttribute('contenteditable','plaintext-only')
   el.focus()
   //if(el.dataset.editable)return
   el.addEventListener('blur',remove,{once:true})
   el.addEventListener('keyup'/*'input'*/,lmap)
   if(caller)el.addEventListener('keyup'/*'input'*/,caller)
   el.dataset.editable=true
   el=void 0
   ;
  }
  ;
  document.documentElement.addEventListener('click',add)///
 }
 root.editableLex=_lmap; //editableLex({target:el}) 
 root.editableEx=entry;
 root.editable=entry;
 /*usage
 editable('.xyz,.eeee',true) //target,data-length write flg
 //
[data-editable]{
 white-space:pre-wrap;
 word-break:break-all;
} 
 */
})(this);
