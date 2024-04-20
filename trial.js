// const express = require("express");
// const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*", methods: ["GET", "POST"] },
// });
// app.get("/", (req, res) => {
//   res.status(404).send("Sorry, cant find that");
// });

// io.on("connection", (socket) => {
//   socket.join("some room"); // Join a channel
//   console.log(`a user connected ${socket.id} to some room`);

//   socket.on("send_message", (data) => {
//     socket.to("some room").emit("foo", data);
//     // socket.emit("foo", data);

//     // socket.broadcast.emit("receive_message", data);
//     console.log("this is the message from client side");
//   });

//   socket.on("disconnect", () => {
//     console.log(`user disconnected ${socket.id}`);
//   });
// });

// server.listen(4000, () => {
//   console.log("listening on *:4000");
// });

const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log(socket.id, "yo");
	socket.emit("me", socket.id);

  let currentRoom = null;
  
 	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, from, name }) => {
		console.log(userToCall, from, name)
    io.to(userToCall).emit("callUser", { userToCall, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
 	// socket.on("disconnect", () => {
	// 	socket.broadcast.emit("callEnded")
	// });

	// socket.on("callUser", ({ userToCall, signalData, from, name }) => {
	// 	console.log(userToCall, signalData, from, name)
  //   io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	// });

	// socket.on("answerCall", (data) => {
	// 	io.to(data.to).emit("callAccepted", data.signal)
	// });

 
 
 
 
  function leaveRoom() {
    if (currentRoom) {
      socket.leave(currentRoom);
      socket.to(currentRoom).emit("user_left_room", socket.id);
      delete rooms[socket.id];
    }
  }

  socket.on("join", ({ name, room }) => {
    joinRoom(name, room);
  });

  function joinRoom(room) {
    leaveRoom();
    currentRoom = room;
    socket.join(room);
    socket.to(room).emit("user_joined_room", socket.id);
    // socket.broadcast.to(room).emit("user_connected", name);
  }

  // User Joining/Leaving Room
  socket.on("join", joinRoom);
  socket.on("leave", leaveRoom);

  // Disconnection handling
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
    leaveRoom();
  });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	});

// 	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
// 		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
// 	});

// 	socket.on("answerCall", (data) => {
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	});
// });

// server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Initialization of user's room and messages list

// socket.on("init", function({ username }) {
// 	users[socket.id] = username;
// 	socket.join("lobby");
// 	socket.broadcast.to("lobby").emit("user_joined", socket.id, username);
// 	socket.emit("update_users", users);
// 	socket.emit("update_rooms", rooms);
// });

// Message Handling
// socket.on("msg", onMessage);

// socket.on("join", (data) => {
//     const { username, password } = data;
//     if (usernames[username]) {
//       socket.emit("failure", "Username already taken");
//     } else if (passwords[username] !== password) {
//       socket.emit("failure", "Invalid password");
//     } else {
//       usernames[username] = true;
//       passwords[username] = undefined;
//       socket.broadcast.emit("user_joined", username);
//       socket.emit("success", "Joined successfully");
//       socket.join("global");
//       socket.emit("update_rooms", io.sockets.adapter.rooms);
//       socket.emit("update_users", getUsers());
//       currentRoom = false;
//     }
//   });

//   socket.on("send_pass", (data) => {
//     let { username, pass } = data;
//     if (!usernames[username]) {
//       usernames[username] = false;
//       passwords[username] = pass;
//       socket.emit("success", "Password set successfully");
//     } else {
//       socket.emit("failure", "Username already exists");
//     }
//   });

// function sendMessage(message, to) {
//     if (typeof to === "undefined") {
//       // Send message to everyone in the same room as us
//       socket.to(currentRoom).emit("new_msg", message);
//     } else if (to === "all") {
//       // Send message to everyone in the entire app
//       io.emit("new_msg", message);
//     } else {
//       // Send message to one person: their socket ID
//       socket.to(to).emit("private_msg", message);
//     }
//   }

// function leaveRoom() {
//     if (!currentRoom) return;
//     var room = currentRoom;
//     currentRoom = null;
//     socket.leave(room);
//     socket.to(room).emit("left_room", `You left room ${room}`);
//     socket.emit("update_users_in_room", []);
//   }
