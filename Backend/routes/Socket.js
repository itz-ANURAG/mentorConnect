const { Server } = require('socket.io');

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "*",  // Allow all origins (adjust as needed)
      methods: ["GET", "POST"]
    }
  });

  const emailToSocket = new Map();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("join-room", (data) => {
      const { roomId, emailId } = data;
      console.log("User", emailId, "joined room", roomId);
      emailToSocket.set(emailId, socket.id);
      socket.join(roomId);
      socket.emit("joined-room",{roomId});
      socket.broadcast.to(roomId).emit("user-joined", { emailId });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  console.log("Socket.IO server is running");
};
