const express = require('express');
const http = require('http');
const path=require('path');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',  
    methods: ['GET', 'POST'],
  }
});

app.use(express.static('build'));
app.use((req,res,next)=>
{
  res.sendFile(path.join(__dirname, 'build','index.html'));
})

const rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', ({ roomId, username }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId].push({ id: socket.id, username });
    socket.join(roomId);

    socket.to(roomId).emit('userJoined', { username });
    
    console.log(`${username} joined room ${roomId}`);
    io.to(roomId).emit('roomUsers', rooms[roomId]); 
  });

  socket.on('codeChange', ({ roomId, code }) => {
    socket.to(roomId).emit('codeUpdate', code);
  });

socket.on('inputChange', ({ roomId, input }) => {
  socket.to(roomId).emit('inputUpdate', input); 
});

socket.on('outputChange', ({ roomId, output }) => {
  socket.to(roomId).emit('outputUpdate', output); 
});


  socket.on('disconnect', () => {
    let roomId;
    let username;

    for (let room in rooms) {
      const userIndex = rooms[room].findIndex(user => user.id === socket.id);
      if (userIndex !== -1) {
        username = rooms[room][userIndex].username;
        roomId = room;
        rooms[room].splice(userIndex, 1);
        break;
      }
    }

    if (roomId) {
      io.to(roomId).emit('userLeft', { username });
      io.to(roomId).emit('roomUsers', rooms[roomId]);

      console.log(`${username} left room ${roomId}`);
    }
  });

  socket.on('leaveRoom', ({ roomId }) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
    socket.emit('errorMessage', { message: 'An error occurred' });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
