const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const {
  userHasLoggedIn,
  userHasLoggedOut,
  getOnlineUsers,
  userHasJoinedRoom,
  getRoomUsers,
  userExit,
} = require("./utils/users");
const {
  newBoard,
  move,
  getCurrentBoard,
  newGame,
  undoMove,
  addPoints,
  oddPoints
} = require("./utils/boards");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(express.json());

const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");
const rooms = require("./routes/rooms");

//Routes
app.use("/users", users);
app.use("/comments", comments);
app.use("/rooms", rooms);
app.use("/messages", messages);

//SSE
const SseChannel = require("sse-channel");
const dateChannel = new SseChannel();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  next();
});

app.use(function (req, res) {
  if (req.url.indexOf("/events/adverts") === 0) {
    dateChannel.addClient(req, res);
  } else {
    res.writeHead(404);
    res.end();
  }
});

const adverts = [
  { text: "SSE Advert#1" },
  { text: "SSE Advert#2" },
  { text: "SSE Advert#3" },
];
let index = 0;
setInterval(function broadcastDate() {
  dateChannel.send(JSON.stringify(adverts[index]));
  index = (index + 1) % adverts.length;
}, 5000);

//MongoBB
require("dotenv").config();
const dbConnData = {
  host: process.env.MONGO_HOST || "127.0.0.1",
  port: process.env.MONGO_PORT || 27017,
  database: process.env.MONGO_DATABASE || "projekt100",
};

const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));


//WS
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT"],
  },
});
io.on("connection", (socket) => {
  socket.on("onlineUsers", () => {
    const onlineUsers = getOnlineUsers();
    io.emit("onlineUsers", onlineUsers);
  });
  socket.on("userHasLoggedIn", async ({ username }) => {
    console.log("user logged in", username);
    const onlineUsers = await userHasLoggedIn(username, socket.id);
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("joinRoom", (msg) => {
    console.log(`${msg.token} joined room ${msg.room.name}`);
    const room = msg.room._id;
    const user = msg.token;
    socket.join(room);
    userHasJoinedRoom({
      username: user,
      room,
      socketid: socket.id,
    });
    socket.broadcast
      .to(room)
      .emit(
        "message",
        formatMessage("Admin", `${user} has joined to the chat`)
      );
    io.to(room).emit("roomUsers", {
      room: room,
      users: getRoomUsers(room),
    });
    newBoard(room)
    io.to(room).emit("board", getCurrentBoard(room).board.fen());
    socket.on("userExit", (msg) => {
      console.log(`${msg.token} exited room`);
      socket.leave(room)
      userExit(socket.id);
      io.to(room).emit("roomUsers", {
        room: room,
        users: getRoomUsers(room),
      });
      io.to(room).emit(
        "message",
        formatMessage("Admin", `${msg.token} has left the chat`)
      );
    });
    socket.emit("message", formatMessage("Admin", "Welcome to room"));
    socket.on("chatMessage", (msg) => {
      console.log(msg);
      io.to(room).emit("message", formatMessage(msg.token, msg.message));
    });

    //Game Logic
    socket.on("game_started", () => {
      io.to(room).emit("result", "Game Started!");
    });
    socket.on("move", (msg) => {
      move(msg, room);
      const fen = getCurrentBoard(room).board.fen();
      io.to(room).emit("board", fen);
    });

    socket.on("surrender", (msg) => {
      console.log("surrender", msg);
      io.to(room).emit("result", `${msg.token} has surrender`);
      newGame(room);
    });

    socket.on("undo", (msg) => {
      socket.broadcast.to(room).emit("undoReq");
    });
    socket.on("undoYes", (msg) => {
      console.log("undotes");
      undoMove(room);
      const fen = getCurrentBoard(room).board.fen();
      io.to(room).emit("board", fen);
    });
    socket.on("showAscii", (msg) => {
      console.log(getCurrentBoard(room).board.ascii());
    });

    socket.on("game_over", (msg) => {
      if (msg.loser === "b") {
        io.to(room).emit("result", "Game Over! Black is n00b");
        addPoints(msg.users[0])
        oddPoints(msg.users[1])
      } else {
        io.to(room).emit("result", "Game Over! White is n00b");
        oddPoints(msg.users[0])
        addPoints(msg.users[1])
      }
    });
  });

  socket.on("disconnect", async () => {
    console.log("disconnect");
    const users = await userHasLoggedOut(socket.id);
    io.emit("onlineUsers", users);
  });
});

const port = 5000 || process.env.PORT;
server.listen(port, () => console.log("listening on port ", port));
