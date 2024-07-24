const socket = io();

let playerNumber = null;

socket.on("connect", () => {
  console.log("Connected to server");

  // Prompt for player number and join game
  playerNumber = prompt("Enter your player number (1 or 2):");
  if (playerNumber === "1" || playerNumber === "2") {
    socket.emit("joinGame", parseInt(playerNumber));
  } else {
    alert("Invalid player number");
  }
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("move", (data) => {
  const box = document.getElementById(`box${data.index}`);
  box.innerHTML = data.value;
  box.style.backgroundColor = data.color;
  if (data.message) {
    alert(data.message);
  }
});

socket.on("updatePlayer", (player) => {
  currentPlayer = player;
  document.getElementById("player1").style.color =
    currentPlayer === 1 ? "black" : "gray";
  document.getElementById("player2").style.color =
    currentPlayer === 2 ? "black" : "gray";
});

socket.on("resetGame", () => {
  for (let i = 0; i < 10; i++) {
    const box = document.getElementById(`box${i}`);
    box.innerHTML = "";
    box.style.backgroundColor = "lightgray";
  }
  document.getElementById("player1").style.color = "black";
  document.getElementById("player2").style.color = "gray";
  gameActive = true;
});

function play(index) {
  if (playerNumber && currentPlayer === parseInt(playerNumber)) {
    socket.emit("move", index);
  }
}

function resetGame() {
  socket.emit("resetGame");
}

function exitGame() {
  alert("Exiting the game room...");
  window.location.href = "about:blank";
}
