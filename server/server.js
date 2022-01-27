const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const { userHasLoggedIn, userHasLoggedOut, getOnlineUsers } = require("./utils/users");
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

//MQTT over Websocke

// const mqtt = require("mqtt");
// const client = mqtt.connect("mqtt://broker.emqx.io:1883");

// client.on("connect", function () {
//   console.log(`Connected to to node`)
//   client.publish('connection', 'loged in')
//   client.subscribe("userLoggedIn");
//   client.subscribe("userLoggedOut");
// });

// client.on("message", async function (topic, message) {
//   console.log(topic)
// if (topic === "userLoggedIn") {
//   const users = await userHasLoggedIn(message);
//   client.publish("onlineUsers", JSON.stringify(users))
//   console.log('user logged in', message.toString())
// }
// if (topic === "userLoggedOut") {
//   const users = await userHasLoggedOut(message);
//   client.publish("onlineUsers", JSON.stringify(users))
//   console.log('user logged out', message.toString())
// }
// });

//WS
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT"],
  },
});
io.on("connection", (socket) => {
  console.log("connection new client");
  socket.on('onlineUsers', () => {
    console.log("req from c")
    const onlineUsers = getOnlineUsers();
    io.emit('onlineUsers', onlineUsers)
  })
  socket.on("userHasLoggedIn", async({ username }) => {
    console.log('user logged in', username)
    const onlineUsers = await userHasLoggedIn(username, socket.id);
    io.emit('onlineUsers', onlineUsers)
    // socket.join(user.room);

    // socket.emit("message", formatMessage("Admin", "Welcome to chat"));

    // socket.broadcast
    //   .to(user.room)
    //   .emit(
    //     "message",
    //     formatMessage("Admin", `${user.username} has joined to the chat`)
    //   );
    // io.to(user.room).emit("roomUsers", {
    //   room: user.room,
    //   users: getRoomUsers(user.room),
    // });
  });

  // socket.on("chatMessage", (msg) => {
  //   const user = getCurrentUser(socket.id);
  //   io.to(user.room).emit("message", formatMessage(user.username, msg));
  // });

  // socket.on("gameStart", (msg) => {
  //   io.to(user.room).emit("message", "Game has started");
  // });

  socket.on("disconnect", async () => {
    console.log("disconnect");
    const users = await userHasLoggedOut(socket.id);
    io.emit('onlineUsers', users)
    // if (user) {
    //   io.to(user.room).emit(
    //     "message",
    //     formatMessage("Admin", `${user.username} has left the chat`)
    //   );
    //   io.to(user.room).emit("roomUsers", {
    //     room: user.room,
    // users: getRoomUsers(user.room),
    // });
    // }
  });
});

const port = 5000 || process.env.PORT;
server.listen(port, () => console.log("listening on port ", port));
