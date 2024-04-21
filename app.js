const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
app.get("/", (req, res) => {
  res.status(404).send("Sorry, cant find that");
});

io.on("connection", (socket) => {
  
console.log('a user connected')
  // socket.join(id); // Join a channel
  // console.log(`a user connected ${socket.id} to ${room}`);
  let Room = null;

  socket.on("request-to-join", (room) => {
    // Add the socket to the specified room
    // console.log('join room',room)
    socket.join(room);

    // Send a confirmation message to the client
  Room=room;
    socket.emit("joined-room", room);
  });
 
  socket.on("send_message", (data) => {
    socket.to(Room).emit("foo", data);
    // socket.emit("foo", data);

    // socket.broadcast.emit("receive_message", data);
    // console.log("this is the message from client side");
  });
 socket.on("chat_message", (data) => {
  //  console.log('chat message',data)
   socket.to(Room).emit("chat", data);
  });
  // socket.on
  socket.on("disconnect", () => {
    // console.log(`user disconnected ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});


