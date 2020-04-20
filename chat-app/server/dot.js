  io.sockets.once('connection', function(socket){
    socket.on('room', function(room){     // take room variable from client side
      socket.join(room) // and join it

      io.sockets.in(room).emit('message', {      // Emits a status message to the connect room when a socket client is connected
        type: 'status',
        text: 'Is now connected',
        created: Date.now(),
        username: socket.request.user.username
      });

      socket.on('disconnect', function () {   // Emits a status message to the connected room when a socket client is disconnected
        io.sockets.in(room).emit({ 
          type: 'status',
          text: 'disconnected',
          created: Date.now(),
          username: socket.request.user.username
        });  
      })
  });