import express from 'express';
const app =express();
const port=3000;
app.get('/',(req,res)=>{
    res.send("eneter the value")
})
app.listen(port,()=>{

    console.log("server start")
})