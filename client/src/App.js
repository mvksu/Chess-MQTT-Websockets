import React, { useState, useEffect, useLayoutEffect } from "react";
import Lobby from "./components/Lobby/Lobby";
import Login from "./components/Form/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import useToken from "./useToken";
import GameRoom from "./components/Room/GameRoom";
import Layout from "./components/Layout/Layout";
import Navbar from "./components/Layout/Navbar";
import Leaderboard from "./components/Community/Leaderboard";
import RegisterForm from "./components/Form/RegisterForm";
import ProfileDetails from "./components/Profile/ProfileDetail";
import Cookies from "js-cookie";
import io from "socket.io-client";
const socket = io("http://localhost:5000", { transports: ["websocket"] });

function App() {
  const { token, setToken } = useToken(null);

  useEffect(() => {
    if (token) {
      console.log("user is logged")
      socket.emit("userHasLoggedIn", { username: token });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      if (!Cookies.get(token)) {
        Cookies.set(token, 1);
      } else {
        Cookies.set(token, parseInt(Cookies.get(token)) + 1);
      }
    }
  }, []);

  if (!token) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="border p-5 w-1/4">
          <Login setToken={setToken} />
          <RegisterForm />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />
      <Layout>
        <Routes>
          <Route path="*" element={<Lobby token={token} />} />
          <Route
            path="/community"
            element={<Leaderboard token={token} socket={socket} />}
          />
          <Route
            path="/profile/details/:username"
            element={<ProfileDetails token={token} setToken={setToken} />}
          />
          <Route
            path="/game/:id"
            element={<GameRoom token={token} socket={socket} />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
