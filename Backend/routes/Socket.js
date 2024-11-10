const { Server } = require('socket.io');

module.exports = function(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const emailToSocket = new Map();

  io.on("connection", (socket) => {
    console.log("New user joined:", socket.id);

    socket.on("joined-room", (data) => {
      const { roomId, emailId } = data;
      console.log("User", emailId, "joined room:", roomId);
      emailToSocket.set(emailId, socket.id);
      socket.join(roomId);
      socket.emit("me", socket.id);
      socket.broadcast.to(roomId).emit("user-joined", { emailId, socketId: socket.id });
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", (data) => {
      console.log(`Incoming call from ${data.from}`);
      io.to(data.userToCall).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });


    socket.on("msg", (data) => {
      const { message, roomId, emailId } = data;
      io.to(roomId).emit("newMessage", { message,  emailId ,senderId: socket.id });
    });


    socket.on("answerCall", (data) => {
      console.log(`Answering call for ${data.to}`);
      io.to(data.to).emit("callAccepted", data.signal);
    });
  });
};
