import Card from "./Card";
import axios from "axios";
import { useEffect, useState } from "react";
import mqtt from "mqtt/dist/mqtt";
const websocketUrl = "ws://broker.emqx.io:8083/mqtt";

export default function Leaderboard({token }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    const client = mqtt.connect(websocketUrl);
    client.stream.on("error", (err) => {
      console.log(`Connection to ${websocketUrl} failed`);
      client.end();
    });
    client.subscribe("onlineUsers", (m) => console.log("Subcribed to onlineUsers"));
    client.on("message", (topic, message, packet) => {
      if(topic === "onlineUsers") {
        setOnlineUsers(JSON.parse(message));
      }
      // console.log(topic, JSON.parse(message));
    });
    return () => client.end();
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/users/`)
      .then((data) => setUsers(data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white mx-24 flex justify-between mt-4">
      <div className="w-1/3 mx-8 py-8">
        <h1 className="text-2xl text-gray-500 mb-4">Online Players</h1>
        {onlineUsers.map(
          (user) =>
            user !== null && (
              <div
                className="flex items-center justify-between mt-2"
                key={user.username}
              >
                <div className="flex items-center">
                  {/* {user.role === "admin" && (
              <span className="text-sm text-yellow-400 mr-2">GM</span>
            )} */}
                  <span className="mr-2">{user.username}</span>
                </div>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            )
        )}
      </div>
      <div className="w-2/3 border-l-2 mx-8 py-8">
        <h1 className="text-2xl text-gray-500 px-8">Leaderboard</h1>
        <div className="min-w-full ml-8">
          {users
            .sort((a, b) => b.rank - a.rank)
            .map((user, index) => (
              <Card index={index} user={user} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
}
