import { useState } from "react";
import axios from "axios";

export default function Match({ match, rooms, matches, setMessages, token }) {

  const handleDeleteMessage = (id) => {
    axios
      .delete(`http://localhost:8000/history/${id}`)
      .then((data) => setMessages(matches.filter((x) => x.id !== id)))
      .catch((err) => console.error(err));
  };
  return (
    <div key={match._id} className="py-4 border-b">
      <div className="flex justify-between">
        <h1>
          {rooms && rooms.length > 0
            ? rooms.filter((x) => x._id === match.room)[0]
              ? rooms.filter((x) => x._id === match.room)[0].name
              : "Room Deleted"
            : "Room deleted"}
        </h1>
        <h2 className={`${token === match.winner.username ? "text-green-400" : "text-red-500"}`}>{match.winner.username}</h2>
        <h3 className={`${token === match.winner.username ? "text-red-500" : "text-green-400"}`}>{match.loser.username}</h3>
      </div>
      <div>
      </div>
      {(token === "admin") && (
        <>
          <button
            className="border px-4 py-2"
            onClick={() => handleDeleteMessage(match.id)}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
