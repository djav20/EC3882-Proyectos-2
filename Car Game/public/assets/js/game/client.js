//p5.disableFriendlyErrors = true;

const frames = 200;
const carMaxSpeed = 5;
const pixelsToCrash = 40;
const airDesacceleration = 0.988;
const breaksDesacceleration = 0.963;

let carImage;
let toolImage;

let car;
let breaks = false;
let honkBoolean = true;
let honk;

let globalAngle = 0;
let angleFactor = 80;
let angleSlider;
let velocitySlider;
let lastHighestSpeed = 0;

let scoreText;
let score = 0;

let sensorVariables = {
  speed: 0,
  angle: 0,
  carBreak: 0,
  honk: 0,
  score: 0
}

function preload() {
  carImage = loadImage('./public/assets/images/car.png');
  toolImage = loadImage('./public/assets/images/tool.png');
  soundFormats('mp3');
  honk = loadSound('./public/assets/sounds/honk.mp3');
}

function setup() {
  // Settings.
  createCanvas(1200, 600);
  frameRate(frames);
  pixelDensity(1);
  angleMode(DEGREES);
  
  // DOM Elements.
  angleSlider = createSlider(-45, 45, 0);
  angleSlider.position(20, 20);

  velocitySlider = createSlider(0, 100, 0);
  velocitySlider.position(20, 50);

  breakButton = createButton('Break');
  breakButton.mousePressed(() => {
    breaks = !breaks;
  });
  
  // Images resizing.
  carImage.resize(carImage.width / 3, carImage.height / 3);
  toolImage.resize(toolImage.width / 5, toolImage.height / 5);
  
  // Objects.
  car = new Car(50, height / 2, carImage);
  tool = new Tool(floor(random(toolImage.width, width - toolImage.width)), floor(random(toolImage.height, height - toolImage.height)), toolImage);

  socket = io.connect('http://localhost:3000');
  socket.on('gameVariables', updateVariables);
  //noLoop();
}

function draw() {
  background(155);
  carPhysics();
  carCheck();
  carHonk();
  tool.show();
  car.show();
}

function carPhysics(){
  if(car.speed > 0.1){ // Evitar girar sobre si mismo.
    // globalAngle += angleSlider.value() / angleFactor;
    globalAngle += sensorVariables.angle / angleFactor;
  }

  if(globalAngle >= 360) globalAngle -= 360;
  if(globalAngle < 0) globalAngle += 360;
  car.trayectory = angleToVector(globalAngle);
  
  // if(!breaks){
  if(!sensorVariables.carBreak){
    // let currentSpeed = map(velocitySlider.value(), 0, 100, 0, carMaxSpeed);
    let currentSpeed = map(sensorVariables.speed, 0, 100, 0, carMaxSpeed);
    if(car.speed > currentSpeed) { // Si desacelere.
      car.speed *= airDesacceleration;
    }
    else if(car.speed < currentSpeed) {
      if(car.speed < 0.1) car.speed = 0.8;
      car.speed /= airDesacceleration;
    }
    else {
      car.speed = currentSpeed;
    }
  }
  else {
    car.speed *= breaksDesacceleration;
  }
  
  car.applyForces();
}

function carCheck(){
  if(car.checkCrash(tool)){
    socket.emit('score', score);
    tool = new Tool(floor(random(toolImage.width, width - toolImage.width)), floor(random(toolImage.height, height - toolImage.height)), toolImage);
  }
  car.checkBorders();
}

function carHonk(){
  if(sensorVariables.honk && !honk.isPlaying()){
  // if(breaks && !honk.isPlaying()){
    honk.play();
  }
  else {
  }
}

function angleToVector(localAngle){
  return createVector(cos(localAngle), sin(localAngle));
}

function updateVariables(params){
  sensorVariables = params;
}