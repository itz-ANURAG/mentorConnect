const { Server } = require('socket.io');

module.exports = function(server) {
  // Initialize the Socket.io server with CORS settings to allow cross-origin requests
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow any origin
      methods: ["GET", "POST"] // Allowed HTTP methods
    }
  });

  // Maps to store email-to-socket and room-user relationships
  const emailToSocket = new Map();
  const roomUsers = new Map();

  // Listen for new connections
  io.on("connection", (socket) => {
    console.log("New user joined:", socket.id);

    // Event when a user joins a room
    socket.on("joined-room", (data) => {
      const { roomId, emailId } = data;
      console.log("User", emailId, "joined room:", roomId);

      // Map the email ID to the socket ID
      emailToSocket.set(emailId, socket.id);

      // Join the room
      socket.join(roomId);

      // If no users are in the room, initialize the user list
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, []);
      }

      // Get the list of users in the room
      const users = roomUsers.get(roomId);

      // If there are already users in the room, notify them about the new user
      if (users.length > 0) io.to(roomId).emit("room-users", users);

      // Add the new user to the room
      users.push({ emailId, socketId: socket.id });

      // Update the room's users list
      roomUsers.set(roomId, users);

      // Emit the socket's ID back to the user
      socket.emit("me", socket.id);

      // Notify others in the room that a new user has joined
      socket.broadcast.to(roomId).emit("user-joined", { emailId, socketId: socket.id });
    });

    // Event when a user disconnects
    socket.on("disconnect", () => {
      // Remove the user from the email-to-socket map
      emailToSocket.forEach((socketId, emailId) => {
        if (socketId === socket.id) {
          emailToSocket.delete(emailId);
        }
      });

      // Remove the user from the room's user list and notify others in the room
      roomUsers.forEach((users, roomId) => {
        const updatedUsers = users.filter(user => user.socketId !== socket.id);
        roomUsers.set(roomId, updatedUsers);
        io.to(roomId).emit("room-users", updatedUsers);
      });

      // Broadcast to all users that the call has ended
      socket.broadcast.emit("callEnded");
    });

    // Event when one user calls another
    socket.on("callUser", (data) => {
      console.log(`Incoming call from ${data.from}`);
      console.log(`Calling ${data.userToCall}`);
      // Emit a call to the user being called
      io.to(data.userToCall).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });

    // Event when a user sends a message
    socket.on("msg", (data) => {
      const { message, roomId, emailId } = data;
      // Broadcast the message to all users in the room
      io.to(roomId).emit("newMessage", { message, emailId, senderId: socket.id });
    });

    // Event when a user answers a call
    socket.on("answerCall", (data) => {
      console.log(`Answering call for ${data.to}`);
      // Notify the caller that the call has been accepted
      io.to(data.to).emit("callAccepted", data.signal);
    });
  });
};
