import React, { useState } from "react";
import axios from "axios";

async function loginUser(credentials) {
  return axios.post('http://localhost:8000/users/login/', credentials)
    .then(data => data.data)
 }


export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMessage] = useState("");

  const handleLogin = async e => {
    e.preventDefault();
    const {token, msg} = await loginUser({
      username,
      password
    });
    setToken(token);
    setMessage(msg)
  }

  return (
    <div>
      <h1>Please log in</h1>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col mt-4 relative">
          <label>Username</label>
          <label className="text-red-500 absolute right-0">{msg}</label>
          <input
            type="text"
            placeholder="Enter username..."
            required
            onChange={(e) => setUsername(e.target.value)}
            className="border my-3 p-1 hover:ring-2 "
          />
           <label>Password</label>
          <input
            type="password"
            placeholder="Enter password..."
            required
            onChange={(e) => setPassword(e.target.value)}
            className="border my-3 p-1 hover:ring-2 "
          />
        </div>
        <button type="submit" className="bg-blue-300 rounded-3xl px-3 py-1 text-white text-bold">
          Login
        </button>
      </form>
    </div>
  );
}
