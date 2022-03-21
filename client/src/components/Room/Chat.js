import { useEffect, useState } from "react";
import axios from "axios";
import mqtt from "mqtt/dist/mqtt";
const websocketUrl = "ws://broker.emqx.io:8083/mqtt";

export default function Chat({ token, roomUsers, room, result, socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    socket.on("message", (msg) => {
      console.log(msg);
      setMessages(messages => [...messages, msg]);
    });
  }, []);

  useEffect(() => {
    socket.on("undoReq", () => {
      setShowUndo(true);
    });
  }, []);

  const handleSentMessage = (msg) => {
    console.log(msg);
    if (msg.length > 0) {
      socket.emit("chatMessage", { token, message: msg });
      axios
        .post(`http://localhost:8000/messages`, {
          text: msg,
          room: room,
          username: token,
        })
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }
    setMessage("");
  };

  const handleUndo = (odp) => {
    if (odp) {
      socket.emit("undoYes", { token });
      setShowUndo(false);
    } else {
      setShowUndo(false);
      socket.emit("chatMessage", {
        token: "Admin",
        message: `${token} disagreed`,
      });
    }
  };

  return (
    <div className="border h-screen">
      <div className="bg-white p-4">
        <h1 className="text-xl mb-4">{room && room.name}</h1>
        {roomUsers.map((user) => (
          <div className="inline-flex items-center" key={user.username}>
            <span className="flex h-3 w-3 relative mx-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p>{user.username}</p>
          </div>
        ))}
        <div className="border-t text-center mt-6">
          <h1 className="mt-4 text-gray-600 text-xl">{result}</h1>
        </div>
      </div>
      {showUndo && (
        <div className="my-2 bg-white py-2 text-center">
          <h1>Cofniecie ruchu przez przeciwnika</h1>
          <button
            className="w-1/2 border h-8 mt-4"
            onClick={() => handleUndo(1)}
          >
            Tak
          </button>
          <button className="w-1/2 border h-8" onClick={() => handleUndo(0)}>
            Nie
          </button>
        </div>
      )}
      <div className="bg-white mt-4 h-64">
        <h1 className="text-gray-400 text-center">Chat</h1>
        <div className="h-64 bg-white overflow-scroll px-1">
          {messages.map((x, i) => (
            <div
              className={`w-full text-gray-400 border-b py-2 max-h-full ${
                x.username === token
                  ? "text-left"
                  : x.username === "Admin"
                  ? "text-center"
                  : "text-right"
              }`}
              key={i}
            >
              <p className="text-xs">{x.username}</p>
              <p className="text-xs">{x.time}</p>
              <p>{x.msg}</p>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          className="w-full bg-gray-200 py-2"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="w-full" onClick={() => handleSentMessage(message)}>
          Send
        </button>
        <div className="border grid grid-cols-4 text-gray-400 bg-white">
          <button onClick={() => handleSentMessage("HI")}>HI</button>
          <button onClick={() => handleSentMessage("GL")}>GL</button>
          <button onClick={() => handleSentMessage("HF")}>HF</button>
          <button onClick={() => handleSentMessage("U2")}>U2</button>
        </div>
      </div>
    </div>
  );
}
