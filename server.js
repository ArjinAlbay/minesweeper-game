const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public")); // Serve static files from "public" directory

let mineIndex = Math.floor(Math.random() * 10);
let currentPlayer = 1;
let gameActive = true;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("move", (index) => {
    if (!gameActive) return;

    if (currentPlayer === 1 && socket.currentPlayer !== 1) return;
    if (currentPlayer === 2 && socket.currentPlayer !== 2) return;

    if (index === mineIndex) {
      io.emit("move", {
        index,
        value: "💣",
        color: "red",
        message: `Player ${currentPlayer} loses!`,
      });
      gameActive = false;
    } else {
      const value = currentPlayer === 1 ? "X" : "O";
      io.emit("move", { index, value, color: "lightgray" });
      currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    io.emit("updatePlayer", currentPlayer);
  });

  socket.on("resetGame", () => {
    mineIndex = Math.floor(Math.random() * 10);
    currentPlayer = 1;
    gameActive = true;
    io.emit("resetGame");
  });

  socket.on("joinGame", (playerNumber) => {
    socket.currentPlayer = playerNumber;
    console.log(`Player ${playerNumber} joined the game`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
