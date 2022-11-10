const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const { Document, findOrCreateDocument } = require('./Document');
const { setUserAndDocId, deleteUser } = require('./Users');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: '*',
    methods: ['GET','POST']
  }
});


const PORT = process.env.PORT || 3001;
const DbConnection = async () => {
    try{
        await mongoose.connect(process.env.MOG_URI);
    }catch(err){
        process.exit(1)
    }
};

DbConnection();
server.listen(PORT,()=> console.log(`Server is running: ${PORT}`));
io.on('connection', socket => {
    socket.on('join-socket', (docId) => {
        socket.join(docId);
    })

    socket.on('get-user',(user,docId) => {
        const users = setUserAndDocId(user,docId,socket.id)
        io.to(docId).emit('load-users', users)
    })

    socket.on('get-document', async(docId) => {
        const document = await findOrCreateDocument(docId);
        socket.emit('load-document', document.data);
    })

    socket.on('send-changes', (docId,delta) => {
        socket.broadcast.to(docId).emit('receive-change',delta);
    })

    socket.on('save-document', async(docId, data) => {
        await Document.findByIdAndUpdate(docId, { data });
    })

    socket.on('disconnect', () => {
        const {docId, updatedUsers} = deleteUser(socket.id);
        io.to(docId).emit('load-users', updatedUsers);
    })
})



