import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import Chess from "chess.js";
import mqtt from "mqtt/dist/mqtt";
import { useParams } from "react-router-dom";
const websocketUrl = "ws://broker.emqx.io:8083/mqtt";

function timeToMinutes(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${seconds}`;
}

export default function PlayVsPlay({ roomUsers, token, socket, room }) {
  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [time1, setTime1] = useState(0);
  const [time2, setTime2] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    if (room && room.minPerSide) {
      console.log(room);
      setTime1(parseInt(room.minPerSide) * 60);
      setTime2(parseInt(room.minPerSide) * 60);
    }
  }, [room]);

  useEffect(() => {
    const client = mqtt.connect(websocketUrl);
    client.stream.on("error", (err) => {
      console.log(`Connection to ${websocketUrl} failed`);
      client.end();
    });
    client.subscribe("time1", (m) => console.log("Subcribed to time1"));
    client.subscribe("time2", (m) => console.log("Subcribed to time2"));
    client.on("message", (topic, message, packet) => {
      if (topic === "time1") {
        if (JSON.parse(message).room === id) {
          setTime1(JSON.parse(message).time1);
        }
      }
      if (topic === "time2") {
        if (JSON.parse(message).room === id) {
          setTime2(JSON.parse(message).time2);
        }
      }
      // console.log(topic, JSON.parse(message), id);
    });
    return () => client.end();
  }, []);

  useEffect(() => {
    socket.on("board", (msg) => {
      const gameCopy = { ...game };
      gameCopy.load(msg);
      setGame(gameCopy);
    });
  }, [socket]);

  useEffect(() => {
    if (game.game_over() && token === roomUsers[0].username) {
      console.log("game ober");
      socket.emit("game_over", { loser: game.turn(), users: roomUsers });
    }
  }, [socket, roomUsers]);

  function surrender(modify) {
    setTime1(parseInt(room.minPerSide) * 60);
    setTime2(parseInt(room.minPerSide) * 60);
    if (roomUsers.length > 1) {
      socket.emit("surrender", { token });
      setGame((g) => {
        const update = { ...g };
        modify(update);
        return update;
      });
    }
  }

  function undo() {
    socket.emit("undo", { token });
  }

  function onDrop(sourceSquare, targetSquare) {
    if (roomUsers.length > 1) {
      socket.emit("move", { sourceSquare, targetSquare })
      const gameCopy = { ...game };
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
      setGame(gameCopy);
      return move;
    }
  }

  return (
    <div>
      <div className="bg-white w-1/4 h-12 border text-3xl flex justify-center items-center mb-2">
        {roomUsers.length > 1
          ? roomUsers[0].username === token
            ? timeToMinutes(time1)
            : timeToMinutes(time2)
          : timeToMinutes(time2)}
      </div>
      <Chessboard
        id="PlayVsPlay"
        animationDuration={200}
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={
          roomUsers.length > 1
            ? roomUsers[0].username === token
              ? "white"
              : "black"
            : "white"
        }
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
        }}
        ref={chessboardRef}
      />
      <div className="flex mt-2">
        <div className="bg-white w-1/4 h-12 border text-3xl flex justify-center items-center z-20 relative">
          {roomUsers.length > 1
            ? roomUsers[0].username === token
              ? timeToMinutes(time2)
              : timeToMinutes(time1)
            : timeToMinutes(time1)}
        </div>
        <button
          className="px-4 py-2 border bg-white m-2"
          onClick={() => {
            surrender((game) => {
              game.reset();
            });
            chessboardRef.current.clearPremoves();
          }}
        >
          surrender
        </button>
        <button
          className="px-4 py-2 border bg-white m-2"
          onClick={() => {
            undo((game) => {
              game.undo();
            });
            chessboardRef.current.clearPremoves();
          }}
        >
          undo
        </button>
        <button
          className="px-4 py-2 border bg-white m-2"
          onClick={() => socket.emit("showAscii")}
        >
          show
        </button>
      </div>
    </div>
  );
}
