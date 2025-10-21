export function chatSockets(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log("Socket " + socket.id + " joined room " + chatId);
    });

    socket.on("sendMessage", (msg) => {
      io.to(msg.chatId).emit("newMessage", msg);
      console.log("Message sent ", msg);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
