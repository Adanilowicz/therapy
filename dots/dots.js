// JavaScript Document
/*
 * @name EMDR
 * @description Eye Movement Desensitization and Reprocessing
 * @author Forrest Oliphant, Alex Danilowicz
 */

const ballSize = 50;

let x, y, width, height;
let button, slider;
let speed = 1;
let playing = false;
let playTime = 0;

let leftSound = false;
let rightSound = false;

/* 
  Our functions
*/

function togglePlay() {
  playTime = millis();
  // Reset position
  x = width / 2;
  // Reset sounds
  leftSound = false;
  rightSound = false;
}

function dotsPlay (newSpeed) {
  playing = true;
  if (newSpeed != null) {
    speed = newSpeed;
  }
  togglePlay();
}

function dotsPause () {
  playing = false;
  togglePlay();
}

function dotsSpeed (newSpeed) {
  speed = newSpeed;
}

/* 
  p5's special functions
*/

function preload() {
  soundFormats('ogg', 'mp3', 'wav');
  soundFile = loadSound('boop.wav');
}

// Responsiveness: fits canvas to window
function windowResized() {
  width = windowWidth;
  height = windowHeight - 175;
  y = height / 2;
  resizeCanvas(width, height);
}

function setup() {
  windowResized();
  createCanvas(width, height);
  x = width / 2;
}

// Runs once per frame of animation
function draw() {
  background(220);

  if (!playing) {
    x = width / 2;
  }

  // Draw a circle
  stroke(50);
  fill(200);
  ellipse(x, y, ballSize);

  if (playing) {
    const timeElapsed = millis() - playTime;
    const wave = sin(timeElapsed / 1000 * speed);
    // Boop left
    if (!leftSound && wave < -0.9) {
      soundFile.pan(-1);
      soundFile.play();
      leftSound = true;
      rightSound = false;
    }
    // Boop right
    if (!rightSound && wave > 0.9) {
      soundFile.pan(1);
      soundFile.play();
      rightSound = true;
      leftSound = false;
    }
    // Map -1 to 1 (the sin range) to the ball position
    x = map(wave, -1, 1, ballSize, width - ballSize);
    y = y;
  }
}