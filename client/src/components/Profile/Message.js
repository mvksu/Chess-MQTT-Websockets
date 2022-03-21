import { useState } from "react";
import axios from "axios";

export default function Message({ msg, rooms, messages, setMessages, token }) {
  const [showEdit, setShowEdit] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleDeleteMessage = (id) => {
    axios
      .delete(`http://localhost:8000/messages/${id}`)
      .then((data) => setMessages(messages.filter((x) => x._id !== id)))
      .catch((err) => console.error(err));
  };

  const handleEditMessage = (id) => {
    axios
      .put(`http://localhost:8000/messages/${id}`, { text: inputValue })
      .then((data) => {
        setMessages(
          messages.map((x) =>
            x._id === id ? { ...x, text: data.data.text } : x
          )
        );
        setShowEdit(false);
      })
      .catch((err) => console.error(err));
  };
  return (
    <div key={msg._id} className="border-b py-2">
      <div className="grid grid-cols-3">
        <h1>
          {rooms && rooms.length > 0
            ? rooms.filter((x) => x._id === msg.room)[0]
              ? rooms.filter((x) => x._id === msg.room)[0].name
              : "Room Deleted"
            : "Room deleted"}
        </h1>
        <h2>{msg.text}</h2>
        <h3>{msg.time}</h3>
      </div>
      <div>
        {showEdit && (
          <>
            <textarea
              className="border border-blue-400 w-full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="border bg-blue-400 px-4 py-2 text-white rounded-full"
              onClick={() => handleEditMessage(msg._id)}
            >
              Edit
            </button>
          </>
        )}
      </div>
      {(msg.username === token || token === "admin") && (
        <>
          <button
            className="border px-4 py-2"
            onClick={() => handleDeleteMessage(msg._id)}
          >
            Delete
          </button>
          <button
            className="border px-4 py-2"
            onClick={() => setShowEdit(!showEdit)}
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}
