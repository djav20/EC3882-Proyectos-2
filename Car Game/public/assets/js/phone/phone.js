const frames = 60;
const radius = 65;
const xBar = 50;
const yBar = 50 - radius / 4;

const barWidth = 30;
const xCircle = 500;
const yCircle1 = 80;
const yCircle2 = 230;
const xScore = 50;
const yScore = 180;

const xTimer = 50;
const yTimer = 300;


const tSize = 38;
let socket;
let interval;

let countdown = 0;

let sensorVariables = {
  speed: 0,
  angle: 0,
  carBreak: 0,
  honk: 0,
  score: 0
}

function setup (){
  createCanvas(600, 400);
  frameRate(frames);
  pixelDensity(1);
  textSize(tSize);
  socket = io.connect('http://localhost:3000');
  socket.on('gameVariables', updateVariables);
  socket.on('timer', timer)
}

function draw() {
  background(210);
  fill(255);
  rect(xBar, yBar, sensorVariables.speed, barWidth);
  if(sensorVariables.carBreak) {
    fill(255, 0, 0);
  }
  else {
    fill(255);
  }
  ellipse(xCircle, yCircle1, radius, radius);

  if(sensorVariables.honk) {
    fill(255, 0, 0);
  }
  else {
    fill(255);
  }
  ellipse(xCircle, yCircle2, radius, radius);

  fill(0);
  text('Score: ' + sensorVariables.score, xScore, yScore);
  text(countdown, xTimer, yTimer);
}

function updateVariables(params) {
  sensorVariables = params;
  sensorVariables.speed = map(params.speed, 0, 100, 20, 400);
  // sensorVariables.speed = map(50, 0, 100, 10, 350);
}

function timer(time){
  countdown = convertSeconds(time);
}

function convertSeconds(s) {
  var min = floor(s / 60);
  var sec = s % 60;
  return nf(min, 2) + ':' + nf(sec, 2);
}