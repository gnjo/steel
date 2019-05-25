# steel
steel

# 拡張
```
let app={}
app.join=(key,fn)=>{
 app[key]=fn;
 return app;
}
app.log=()=>{
 console.log(Object.keys(app))
 return app;
}
app
 .join(save,fn)
 .join(load,fn)
 .join(id,'')
 .log()
 ;
 ...

```
