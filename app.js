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
  socket.join("some room"); // Join a channel
  console.log(`a user connected ${socket.id} to some room`);

 
  socket.on("send_message", (data) => {
    socket.to("some room").emit("foo", data);
    // socket.emit("foo", data);

    // socket.broadcast.emit("receive_message", data);
    // console.log("this is the message from client side");
  });
 socket.on("chat_message", (data) => {
   console.log('chat message',data)
   socket.to("some room").emit("chat", data);
  });
  // socket.on
  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});

// const app = require("express")();
// const server = require("http").createServer(app);
// const cors = require("cors");

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// app.use(cors());

// const PORT = process.env.PORT || 5000;

// io.on("connection", (socket) => {
//   console.log(socket.id, "yo");
// 	socket.emit("me", socket.id);

//   let currentRoom = null;
  

//   // changed
//  	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	});

// 	socket.on("callUser", ({ userToCall, from, name }) => {
// 		console.log(userToCall, from, name)
//     io.to(userToCall).emit("callUser", { userToCall, from, name });
// 	});

// 	socket.on("answerCall", (data) => {
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	});



// // unchanged

//  	// socket.on("disconnect", () => {
// 	// 	socket.broadcast.emit("callEnded")
// 	// });

// 	// socket.on("callUser", ({ userToCall, signalData, from, name }) => {
// 	// 	console.log(userToCall, signalData, from, name)
//   //   io.to(userToCall).emit("callUser", { signal: signalData, from, name });
// 	// });

// 	// socket.on("answerCall", (data) => {
// 	// 	io.to(data.to).emit("callAccepted", data.signal)
// 	// });
 
//   function leaveRoom() {
//     if (currentRoom) {
//       socket.leave(currentRoom);
//       socket.to(currentRoom).emit("user_left_room", socket.id);
//       delete rooms[socket.id];
//     }
//   }

//   socket.on("join", ({ name, room }) => {
//     joinRoom(name, room);
//   });

//   function joinRoom(room) {
//     leaveRoom();
//     currentRoom = room;
//     socket.join(room);
//     socket.to(room).emit("user_joined_room", socket.id);
//     // socket.broadcast.to(room).emit("user_connected", name);
//   }

//   // User Joining/Leaving Room
//   socket.on("join", joinRoom);
//   socket.on("leave", leaveRoom);

//   // Disconnection handling
//   socket.on("disconnect", () => {
//     console.log(`User ${socket.id} disconnected`);
//     leaveRoom();
//   });
// });

// server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

