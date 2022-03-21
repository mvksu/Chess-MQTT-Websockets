import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BackButton from "../Elements/BackButton";
// import Game from "./Chess/Game";
import axios from "axios";
import Modal from "./EditRoom";
import Chat from "./Chat";
import PlayVsPlay from "../Chess/PlayVsPlay";

export default function GameRoom({ token, socket }) {
  const [showModal, setShowModal] = useState(false);
  const [room, setRoom] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState("Let's play chess");

  useEffect(() => {
    socket.on("roomUsers", (res) => setRoomUsers(res.users));
  }, [socket]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/rooms/${id}`)
      .then((data) => {
        setRoom(data.data);
      })
      .catch((err) => console.error(err));
  }, [showModal, setShowModal, id]);

  useEffect(() => {
    if (room) {
      console.log("This the room:", room);
      socket.emit("joinRoom", { room: room, token: token });
    }
  }, [room]);

  useLayoutEffect(() => {
    console.log(`Room ${room} exited ${token}`);
    return () => {
      socket.emit("userExit", { token });
    };
  }, [socket, token]);

  const handleDeleteRoom = () => {
    axios
      .delete(`http://localhost:8000/rooms/${id}`)
      .then((data) => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col px-10 py-4 bg-gray-100">
      <BackButton />
      <Modal showModal={showModal} setShowModal={setShowModal} room={room} />
      {((room && room.owner && room.owner.username === token) ||
        token === "admin") && (
        <div>
          <button
            className="border px-6 py-3 bg-white my-4 hover:ring-2"
            onClick={handleDeleteRoom}
          >
            Delete Room
          </button>
          <button
            className="border px-6 py-3 bg-white my-4 hover:ring-2"
            onClick={() => setShowModal(true)}
          >
            Edit Room
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-10 mt-4">
        <Chat
          messages={messages}
          setMessages={setMessages}
          token={token}
          room={room}
          roomUsers={roomUsers}
          result={result}
          socket={socket}
        />
        <PlayVsPlay
          token={token}
          room={room}
          roomUsers={roomUsers}
          socket={socket}
        />
      </div>
    </div>
  );
}
