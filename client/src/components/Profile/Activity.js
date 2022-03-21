import img from "../assets/pobrane.png";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Message from "./Message";
import Match from "./Match";

export default function Activity({ user, token }) {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/messages/${user}`)
      .then((data) => setMessages(data.data))
      .catch((err) => console.error(err));

    axios
      .get(`http://localhost:8000/rooms`)
      .then((data) => setRooms(data.data))
      .catch((err) => console.error(err));
    axios
      .get(`http://localhost:8000/history`)
      .then((data) => setMatches(data.data))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="mt-20 border-t mx-10">
      <h1 className="text-xl font-bold py-8 mt-6">Activity</h1>
      <div className="grid grid-cols-3 text-black font-bold mb-4">
        <h1>Room:</h1>
        <h2>Text</h2>
        <h3>Time</h3>
      </div>
      {messages.length > 0 &&
        messages.map((msg) => (
          <Message
            msg={msg}
            messages={messages}
            setMessages={setMessages}
            token={token}
            rooms={rooms}
            key={msg._id}
          />
        ))}
      <h1 className="text-xl font-bold py-4 mb-4 mt-12">Matches</h1>
      <div className="flex justify-between text-black font-bold mb-4">
        <h1>Room:</h1>
        <h2>Winner</h2>
        <h3>Loser</h3>
      </div>
      <div className="my-6">
      {matches.length > 0 &&
        matches.map((match, i) => (
          <Match
            match={match}
            setMatches={setMatches}
            matches={matches}
            token={token}
            rooms={rooms}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
