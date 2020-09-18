
;(function(root){
/*  
let 
storyfile=app.opt.main//'story.txt'
,to=getTogist(app.opt.u,localStorage.getItem(app.opt.p))
;
to.togistsearch(app.id,storyfile).then(d=>{
root.raw_url=d
fn.q('.total').onclick=()=>{ window.open(d,'_blank'); }
})
*/  
fn.q('.total').onclick=()=>{ window.open(
  'https://gnjo.github.io/fatema/index.html?id='+app.id,
  '_blank' // <- This is what makes it open in a new window.
);  }  

})(this);
