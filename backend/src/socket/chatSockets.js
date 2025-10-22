export function chatSockets(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log("Socket " + socket.id + " joined room " + chatId);
    });

    socket.on("sendMessage", (message) => {
      io.to(message.chatId).emit("newMessage", message);
      console.log("Message sent ", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
