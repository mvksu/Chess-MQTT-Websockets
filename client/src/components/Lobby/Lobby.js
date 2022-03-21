import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./NewRoom";
import Cookies from "js-cookie";
import Search from "./Search";

export default function Lobby({ token }) {
  const [showModal, setShowModal] = useState(false);
  const [usersRooms, setUsersRooms] = useState([]);
  const [joinRoom, setJoinRoom] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/rooms/`)
      .then((data) => setUsersRooms(data.data))
      .catch((err) => console.error(err));
  }, [showModal, setShowModal]);

  const handleJoinRoom = () => {
    if (joinRoom) {
      console.log(joinRoom);
      axios
        .get(`http://localhost:8000/rooms/name/${joinRoom.name}`)
        .then((data) =>
          data.data
            ? navigate(`/game/${data.data._id}`)
            : setMsg("Nie ma takiego room")
        )
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <div className="flex justify-center items-center flex-wrap">
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          token={token}
        />
        <div className="flex flex-col w-full items-center justify-center">
          {!Cookies.get(token) ? (
            <h1 className="text-3xl text-center m-6">
              Hi! {token}, odwiedziłeś naszą stronę pierwszy raz
            </h1>
          ) : (
            <h1 className="text-3xl text-center m-6">
              Hi! {token}, odwiedziłeś naszą stronę {Cookies.get(token)} razy
            </h1>
          )}
          <label className="text-center my-4">Podaj nazwe pokoju:</label>
          <Search setJoinRoom={setJoinRoom} />
          <button
            className="border w-64 py-3 mb-4 bg-white mt-4 hover:scale-105"
            onClick={handleJoinRoom}
          >
            Join
          </button>
          <p className="text-red-400 text-center">{msg}</p>
          <button
            className="border px-14 py-3 mb-4 bg-white hover:scale-105"
            onClick={() => setShowModal(true)}
          >
            New Room
          </button>
        </div>
        {/* <div className="">
          <div className="min-w-full border-b-4 border-blue-400 text-center text-blue-400 py-1">
            Room
          </div>
          <div className="grid grid-cols-3 gap-2 bg-white p-2">
            <Link
              to="game/1+0"
              className="w-48 h-48 border flex justify-center items-center hover:scale-105 text-3xl text-gray-500"
            >
              1+0
            </Link>
            <Link
              to="game/2+1"
              className="w-48 h-48 border flex justify-center items-center hover:scale-105 text-3xl text-gray-500"
            >
              2+1
            </Link>
            <Link
              to="game/3+0"
              className="w-48 h-48 border flex justify-center items-center hover:scale-105 text-3xl text-gray-500"
            >
              3+0
            </Link>
            <Link
              to="game/3+2"
              className="w-48 h-48 border flex justify-center items-center hover:scale-105 text-3xl text-gray-500"
            >
              3+2
            </Link>
            <Link
              to="game/5+0"
              className="w-48 h-48 border flex justify-center items-center hover:scale-105 text-3xl text-gray-500"
            >
              5+0
            </Link>
            <Link
              to="game/5+3"
              className="w-48 h-48 border flex justify-center items-center hover:scale-105 text-3xl text-gray-500"
            >
              5+3
            </Link>
            <Link
              to="game/10+0"
              className="w-48 h-48 border flex justify-center items-center hover:scale-105 text-3xl text-gray-500"
            >
              10+0
            </Link>
            <Link
              to="game/10+5"
              className="w-48 h-48 border flex justify-center items-center hover:scale-105 text-3xl text-gray-500"
            >
              10+5
            </Link>
            <Link
              to="game/10+5"
              className="w-48 h-48 border flex justify-center items-center hover:scale-105 text-3xl text-gray-500"
            >
              10+5
            </Link>
          </div>
        </div> */}
      </div>
      <div className="flex justify-center flex-col items-center mt-16">
        <h1 className="text-3xl">Users Rooms</h1>
        {usersRooms.map((room) => (
          <Link
            to={`game/${room._id}`}
            className="w-3/4 mx-24 my-4 hover:ring-2"
            key={room._id}
          >
            <div className="h-16 bg-white w-full flex items-center justify-between px-12 rounded border text-gray-400 text-center">
              <h1 className="text-sm w-1/3">Name</h1>
              <h1 className="text-sm w-1/3">Min per side</h1>
              <h1 className="text-sm w-1/3">Increment</h1>
            </div>
            <div className="h-16 bg-white w-full flex items-center justify-between px-12 rounded text-center">
              <h1 className="text-xl w-1/3">{room.name}</h1>
              <h1 className="text-xl w-1/3">{room.minPerSide}</h1>
              <h1 className="text-xl w-1/3">{room.increment}</h1>
            </div>
            {room.owner === token}
          </Link>
        ))}
      </div>
    </>
  );
}
