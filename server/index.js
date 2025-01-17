const express=require('express');
const cors=require("cors");
const mongoose=require("mongoose");
const userRoutes=require("./routes/userRoutes");
const messageRoutes=require("./routes/messagesRoute");
const app=express();
const socket=require("socket.io");
require("dotenv").config();

const corsOptions = {
    // origin: 'https://chat-app-j744.vercel.app',
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

app.options('*', cors()); 
app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://chat-app-j744.vercel.app');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Max-Age', '86400'); 
//     next();
//   });

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