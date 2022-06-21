// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);

let chessboard = [
  ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
];

var soundEfx;
var soundGameOver = "sounds/game-over.wav";
var soundCrash = "sounds/crash.wav";
var soundCaught = "sounds/caught.wav";
var soundWon = "sounds/won.wav";

soundEfx = document.getElementById("soundEfx");

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "images/background1.png";

// Left/Right border image
var blReady = false;
var blImage = new Image();
blImage.onload = function () {
  blReady = true;
};
blImage.src = "images/metalLeft.jpg";

// Top/Bottom border image
var btReady = false;
var btImage = new Image();
btImage.onload = function () {
  btReady = true;
};
btImage.src = "images/metalTop.jpg";

// Police image
var policeReady = false;
var policeImage = new Image();
policeImage.onload = function () {
  policeReady = true;
};

policeImage.src = "images/police-car.png";

// Crimnal image
var criminalReady = false;
var criminalImage = new Image();
criminalImage.onload = function () {
  criminalReady = true;
};

criminalImage.src = "images/criminal.png";

// barrier Image
var barrierReady = false;
var barrierImage = new Image();
barrierImage.onload = function () {
  barrierReady = true;
};

barrierImage.src = "images/c.png";

// Game objects
var hero = {
  speed: 700, // movement speed in pixels per second
  x: 0,
  y: 0,
};
var criminal = {
  x: 0,
  y: 0,
};

var barrier1 = {
  x: 0,
  y: 0,
};

var barrier2 = {
  x: 0,
  y: 0,
};

var barrier3 = {
  x: 0,
  y: 0,
};

var barrier4 = {
  x: 0,
  y: 0,
};

var barrier5 = {
  x: 0,
  y: 0,
};

var barrier6 = {
  x: 0,
  y: 0,
};

var criminalsCaught = 0;
let crashed = false;

var keysDown = {};

addEventListener(
  "keydown",
  function (e) {
    console.log(e.keyCode + " down");
    keysDown[e.keyCode] = true;
  },
  false
);

addEventListener(
  "keyup",
  function (e) {
    console.log(e.keyCode + " up");
    delete keysDown[e.keyCode];
  },
  false
);

var reset = function () {
  if (crashed == true) {
    soundEfx.src = soundCrash;
    soundEfx.play();
    placeItem(hero);
    placeItem(criminal);
    placeItem(barrier1);
    placeItem(barrier2);
    keysDown = {};
    requestAnimationFrame(main);
  } else {
    placeItem(hero);
    placeItem(criminal);
    placeItem(barrier1);
    placeItem(barrier2);
    if (criminalsCaught > 1) {
      placeItem(barrier3);
    }
    if (criminalsCaught > 3) {
      placeItem(barrier4);
    }
    if (criminalsCaught > 5) {
      placeItem(barrier5);
    }
    if (criminalsCaught > 7) {
      placeItem(barrier6);
    }

    if (criminalsCaught === 10) {
      alert("You Win!");
      soundEfx.src = soundWon;
      soundEfx.play();
    }
  }
};

let gameOver = function () {
  alert("You crashed into a barrier, game over");
  crashed = true;
  reset();
};

let placeItem = function (character) {
  let X = 5;
  let Y = 6;
  let success = false;
  while (!success) {
    X = Math.floor(Math.random() * 9);

    Y = Math.floor(Math.random() * 9);

    if (chessboard[X][Y] === "x") {
      success = true;
    }
  }
  chessboard[X][Y] = "O";
  character.x = X * 100 + 32;
  character.y = Y * 100 + 32;
  criminal.x = 32 + Math.random() * (canvas.width - 150);
  criminal.y = 32 + Math.random() * (canvas.height - 148);
};

var update = function (modifier) {
  if (38 in keysDown) {
    // up arrow key
    hero.y -= hero.speed * modifier;
    if (hero.y < 29) {
      gameOver();
      hero.y = 29;
    }
  }
  if (40 in keysDown) {
    // down arrow key
    hero.y += hero.speed * modifier;
    if (hero.y > 1000 - 78) {
      gameOver();
      hero.y = 1000 - 78;
    }
  }
  if (37 in keysDown) {
    // left arrow key
    hero.x -= hero.speed * modifier;
    if (hero.x < 27) {
      gameOver();
      hero.x = 27;
    }
  }
  if (39 in keysDown) {
    // right arrow key
    hero.x += hero.speed * modifier;
    if (hero.x > 1000 - (32 + 25)) {
      gameOver();
      hero.x = 1000 - (32 + 25);
    }
  }

  // Are they touching?
  if (
    hero.x + 5 <= criminal.x + 10 &&
    criminal.x <= hero.x + 20 &&
    hero.y <= criminal.y + 32 &&
    criminal.y <= hero.y + 42
  ) {
    // criminal caught
    soundEfx.src = soundCaught; // sound caught
    soundEfx.play();
    ++criminalsCaught;
    reset();
  }

  if (
    hero.x + 5 <= barrier1.x + 25 &&
    barrier1.x <= hero.x + 20 &&
    hero.y <= barrier1.y + 25 &&
    barrier1.y <= hero.y + 45
  ) {
    gameOver();
  }
  if (
    hero.x + 5 <= barrier2.x + 25 &&
    barrier2.x <= hero.x + 20 &&
    hero.y <= barrier2.y + 25 &&
    barrier2.y <= hero.y + 45
  ) {
    gameOver();
  }
  if (
    hero.x + 5 <= barrier3.x + 25 &&
    barrier3.x <= hero.x + 20 &&
    hero.y <= barrier3.y + 25 &&
    barrier3.y <= hero.y + 45
  ) {
    gameOver();
  }
  if (
    hero.x + 5 <= barrier4.x + 25 &&
    barrier4.x <= hero.x + 20 &&
    hero.y <= barrier4.y + 25 &&
    barrier4.y <= hero.y + 45
  ) {
    gameOver();
  }
  if (
    hero.x + 5 <= barrier5.x + 25 &&
    barrier5.x <= hero.x + 20 &&
    hero.y <= barrier5.y + 25 &&
    barrier5.y <= hero.y + 45
  ) {
    gameOver();
  }
  if (
    hero.x + 5 <= barrier6.x + 25 &&
    barrier6.x <= hero.x + 20 &&
    hero.y <= barrier6.y + 25 &&
    barrier6.y <= hero.y + 45
  ) {
    gameOver();
  }
};

// Draw everything
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (btReady) {
    ctx.drawImage(btImage, 0, 0);
    ctx.drawImage(btImage, 0, 1000 - 32);
  }

  if (blReady) {
    ctx.drawImage(blImage, 0, 0);
    ctx.drawImage(blImage, 1000 - 32, 0);
  }

  if (barrierReady) {
    ctx.drawImage(barrierImage, barrier1.x, barrier1.y);
    ctx.drawImage(barrierImage, barrier2.x, barrier2.y);
    ctx.drawImage(barrierImage, barrier3.x, barrier3.y);
    ctx.drawImage(barrierImage, barrier4.x, barrier4.y);
    ctx.drawImage(barrierImage, barrier5.x, barrier5.y);
    ctx.drawImage(barrierImage, barrier6.x, barrier6.y);
  }

  if (policeReady) {
    ctx.drawImage(policeImage, hero.x, hero.y);
  }

  if (criminalReady) {
    ctx.drawImage(criminalImage, criminal.x, criminal.y);
  }

  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Criminals Arrested: " + criminalsCaught, 32, 32);
};

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;
  update(delta / 1000);
  render();
  then = now;

  if (criminalsCaught < 10) {
    requestAnimationFrame(main);
  }
};

// Play
var then = Date.now();
reset();
main();
