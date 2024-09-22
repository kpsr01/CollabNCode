const express=require('express');
const app=express();
const http=require('http');
const {Server}=require('socket.io');
const cors=require('cors');
const { Socket } = require('socket.io-client');
app.use(cors());
const server=http.createServer(app);

const io=new Server(server)


io.on('connection',(socket)=>{
  console.log(`user connected ${socket.id}`)
})


const PORT=process.env.PORT||3001;
server.listen(PORT,()=> console.log(`listening on PORT ${PORT}`));