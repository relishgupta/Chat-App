const express=require('express');
const cors=require("cors");
const mongoose=require("mongoose");
const userRoutes=require("./routes/userRoutes");
const messageRoutes=require("./routes/messagesRoute");
const app=express();
const socket=require("socket.io");
require("dotenv").config();

const corsOptions = {
    origin: 'https://chat-app-j744.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

app.options('*', cors()); 
app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoutes);

mongoose.connect(process.env.MONGO_URL,{}).then(()=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log(err.message);
});

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server started on port ${process.env.PORT}`);
});

const io=socket(server,{
    cors:{
       origin:"https://chat-app-j744.vercel.app",
       credentials :true,
    },
});

global.onlineUsers=new Map();

io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });

    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.msg);
        }
    });
});