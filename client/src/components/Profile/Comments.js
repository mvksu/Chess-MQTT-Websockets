import img from "../assets/pobrane.png";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Comment from "./Comment";

export default function Comments({ user, token }) {
  const [comments, setComments] = useState([]);
  const [msg, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/comments/${user}`)
      .then((data) => setComments(data.data))
      .catch((err) => console.error(err));
  }, [user, msg]);

  const handlePostComment = () => {
    axios
      .post(`http://localhost:8000/comments/author/${token}/receiver/${user}`, {
        text: msg,
      })
      .then((data) => setMessage(""))
      .catch((err) => console.error(err));
  };

  const handleDeleteComment = (id) => {
    axios
      .delete(`http://localhost:8000/comments/${id}`)
      .then((data) => setComments(comments.filter((x) => x._id !== id)))
      .catch((err) => console.error(err));
  };

  const handleEdit = (id, newText) => {
    console.log(id, newText);
    axios
      .put(`http://localhost:8000/comments/${id}`, { text: newText })
      .then((data) =>
        setComments(
          comments.map((x) => (x._id === id ? {...x, text: data.data.text} : x))
        )
      )
      .catch((err) => console.error(err));
  };

  return (
    <div className="mt-6 border-t">
      <h1 className="text-xl font-bold px-8 py-8">Comments</h1>
      {comments.length > 0 &&
        comments.map((comment) => (
          <Comment
            key={comment._id}
            token={token}
            comment={comment}
            handleDeleteComment={handleDeleteComment}
            handleEdit={handleEdit}
          />
        ))}
      <div className="w-full bg-white px-8 py-8">
        <h1 className="text-xl font-bold">Add Comment</h1>
        <div className="flex items-center">
          <h1>{token}</h1>
          <div className="w-12 h-12 rounded-full overflow-hidden border mx-8">
            <img src={img} alt="" />
          </div>
          <textarea
            cols="30"
            rows="5"
            className="mt-4 bg-gray-100 w-full"
            value={msg}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button
          className="border px-8 py-4 float-right mx-2 my-6"
          onClick={handlePostComment}
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}
