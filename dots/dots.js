// JavaScript Document
/*
 * @name EMDR
 * @description Eye Movement Desensitization and Reprocessing
 */

const ballSize = 50;

let x, y, width, height;
let button, slider;
let speed = 1;
let playing = true;
let playTime = 0;

let leftSound = false;
let rightSound = false;

/* 
  Our functions
*/

function togglePlay() {
  playing = !playing;
  playTime = millis();
  // Toggle button label
  button.html(playing ? "Pause" : "Play");
  // Reset position
  x = width / 2;
  // Reset sounds
  leftSound = false;
  rightSound = false;
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
  width = windowWidth - 1;
  height = windowHeight - 51;
  resizeCanvas(width, height);
}

function setup() {
  windowResized();
  createCanvas(width, height);
  slider = createSlider(0, 5, speed, 0.1);
  button = createButton('Pause');
  button.mousePressed(togglePlay);
  x = ballSize;
  y = height / 2;
}

// Runs once per frame of animation
function draw() {
  background(220);

  // Draw a circle
  stroke(50);
  fill(200);
  ellipse(x, y, ballSize, ballSize);

  if (playing) {
    speed = slider.value();
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