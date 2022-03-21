import axios from "axios";
import React, { useState, useEffect } from "react";
import img from "../assets/pobrane.png";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import Activity from "./Activity";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ProfileDetail({ token, setToken }) {
  const [user, setUser] = useState({});
  const [newPassword, setnewPassword] = useState("");
  const [alert, setAlert] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/users/${username}`)
      .then((data) => setUser(data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/users/${username}`)
      .then((data) => {
        navigate("/");
        if (token === username) {
          setToken(null);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = () => {
    axios
      .put(`http://localhost:8000/users/${username}/${newPassword}`)
      .then(() => {
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 1500);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      {(username === token || token === "admin") && (
        <div className="my-4 h-40 bg-white px-12 mx-24 relative flex flex-col">
          <label className="mt-4">New Password (min. 5 characters)</label>
          <input
            type="password"
            className="border"
            value={newPassword}
            onChange={(e) => setnewPassword(e.target.value)}
          />
          {alert && <h1 className="text-green-400">Successfully changed</h1>}
          <button
            className="border px-14 py-3 bg-white my-4 hover:ring-1 absolute right-4 bottom-1"
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
      )}
      <div className="flex flex-col mx-24 mt-14 bg-white px-12">
        <div className="flex mt-12">
          <img src={img} alt="" />
          {user.registeredAt && (
            <div className="mx-12">
              <h1 className="text-3xl my-4">{user.username}</h1>
              <h2 className="mt-4">
                Registered at: {user.registeredAt.slice(8, 10)}
                {", "}
                {monthNames[parseInt(user.registeredAt.slice(4, 6))]}{" "}
                {user.registeredAt.slice(0, 4)}
              </h2>
              <h2>Last seen: 6 minutes ago</h2>
              <h2>Zagranych partii: {user.matchPlayed}</h2>
              {(user.username === token || token === "admin") && (
                <button
                  className="border px-14 py-3 bg-white w-full hover:ring-1 ring-red-500"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
        <div>
          <Comments user={user.username} token={token} />
          <Activity user={user.username} token={token} />
        </div>
      </div>
    </>
  );
}
