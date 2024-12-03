import {Server} from 'socket.io'
import express from 'express'
import http from 'http'

const app = express();

const server = http.createServer(app);

const io = new Server (server, {
    cors :{
        origin : ['http://localhost:5173']
    }
})

const onlineUsers = {};

export function getReceiverSocketId (userId) {
    return onlineUsers[userId];
}

io.on('connection', (socket) => {
    console.log("A client has been connected!", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId)
        onlineUsers[userId] = socket.id;

    
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
    
    console.log(onlineUsers);

    socket.on('disconnect', () => {
        console.log('A client has been disconnected!', socket.id);
        delete onlineUsers[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });
});

export {io, server, app};