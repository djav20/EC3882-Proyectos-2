//p5.disableFriendlyErrors = true;
// document.onkeydown = keyCheck;

const frames = 60;
const carMaxSpeed = 7;
const pixelsToCrash = 40;
const airDesacceleration = 0.985;
const breaksDesacceleration = 0.965;

let carImage;
let toolImage;

let car;
let acceleration;
let breaks = false;
let carIsOn = false;

let globalAngle = 0;
let angleFactor = 50;
let velocitySlider;
let accelerationSlider;

let scoreText;
let score = 0;

let sensorVariables = {
  acceleration: 0,
  angle: 0,
  carBreak: 0,
  beep: 0
}

function preload(){
  carImage = loadImage('assets/car.png');
  toolImage = loadImage('assets/tool.png');
}

function setup() {
  // Settings.
  createCanvas(1200, 600);
  frameRate(frames);
  pixelDensity(1);
  angleMode(DEGREES);
  
  // DOM Elements.
  velocitySlider = createSlider(-45, 45, 0);
  velocitySlider.position(20, 20);

  accelerationSlider = createSlider(0, 100, 0);
  accelerationSlider.position(20, 50);

  scoreText = createP('').html('Score: ' + score);
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
  noLoop();
}

function draw() {
  background(155, 184, 114);

  // if(accelerationSlider.value() > 20 && !carIsOn){
  if(sensorVariables.acceleration >= 20 && !carIsOn){
    carIsOn = true;
    car.acceleration = 1;
  }

  if(carIsOn){
    carRun();
  }

  tool.show();
  car.show();
}

function carRun(){
  if(car.acceleration >= 0.2){
    // globalAngle += velocitySlider.value() / angleFactor;
    globalAngle += sensorVariables.angle / angleFactor;
  }

  if(globalAngle >= 360) globalAngle -= 360;
  if(globalAngle < 0) globalAngle += 360;

  // let acceleration = accelerationSlider.value();
  let acceleration = sensorVariables.acceleration;
  // if(!breaks){
  if(!sensorVariables.carBreak){
    if(acceleration <= 15){
      car.acceleration *= airDesacceleration;
    } else if (acceleration > 15 && acceleration < 20){
      car.acceleration *= 1;
    } else {
      car.acceleration *= 1 + map(acceleration, 20, 100, 0.005, 0.01);
    }
  } else {
    car.acceleration *= breaksDesacceleration;
  }

  car.trayectory = angleToVector(globalAngle);
  
  car.applyForces();
  
  if(car.checkCrash(tool)){
    scoreText.html('Score: ' + ++score);
    tool = new Tool(floor(random(toolImage.width, width - toolImage.width)), floor(random(toolImage.height, height - toolImage.height)), toolImage);
  }

  scoreText.html('Score: ' + accelerationSlider.value());
  
  if(car.acceleration < 0.1) carIsOn = false;
}

function angleToVector(localAngle){
  return createVector(cos(localAngle), sin(localAngle));
}

function updateVariables(params){
  console.log(params)
  sensorVariables = params;
  redraw();
}