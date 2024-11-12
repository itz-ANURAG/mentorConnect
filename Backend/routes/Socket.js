const { Server } = require('socket.io');

module.exports = function(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const emailToSocket = new Map();
  const roomUsers = new Map();

  io.on("connection", (socket) => {
    console.log("New user joined:", socket.id);

    socket.on("joined-room", (data) => {
      const { roomId, emailId } = data;
      console.log("User", emailId, "joined room:", roomId);
      emailToSocket.set(emailId, socket.id);
      socket.join(roomId);

      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, []);
      }
      const users = roomUsers.get(roomId);
      if(users.length>0) io.to(roomId).emit("room-users", users);
      users.push({ emailId, socketId: socket.id });
      roomUsers.set(roomId, users);

      socket.emit("me", socket.id);
      socket.broadcast.to(roomId).emit("user-joined", { emailId, socketId: socket.id });
    });

    socket.on("disconnect", () => {
      emailToSocket.forEach((socketId, emailId) => {
        if (socketId === socket.id) {
          emailToSocket.delete(emailId);
        }
      });

      roomUsers.forEach((users, roomId) => {
        const updatedUsers = users.filter(user => user.socketId !== socket.id);
        roomUsers.set(roomId, updatedUsers);
        io.to(roomId).emit("room-users", updatedUsers);
      });

      socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", (data) => {
      console.log(`Incoming call from ${data.from}`);
      console.log(`Calling ${data.userToCall}`);
      io.to(data.userToCall).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });

    socket.on("msg", (data) => {
      const { message, roomId, emailId } = data;
      io.to(roomId).emit("newMessage", { message, emailId, senderId: socket.id });
    });

    socket.on("answerCall", (data) => {
      console.log(`Answering call for ${data.to}`);
      io.to(data.to).emit("callAccepted", data.signal);
    });
  });
};