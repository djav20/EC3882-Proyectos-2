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
let accelerationFactor = 150;
let velocitySlider;
let accelerationSlider;

let scoreText;
let score = 0;

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
    console.log('BREAKS');
  });
  
  // Images resizing.
  carImage.resize(carImage.width / 3, carImage.height / 3);
  toolImage.resize(toolImage.width / 5, toolImage.height / 5);
  
  // Objects.
  car = new Car(50, height / 2, carImage);
  tool = new Tool(floor(random(toolImage.width, width - toolImage.width)), floor(random(toolImage.height, height - toolImage.height)), toolImage);
}

function draw() {
  background(155, 184, 114);

  if(accelerationSlider.value() > 20 && !carIsOn){
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
  if(car.acceleration > 0.2){
    globalAngle += velocitySlider.value() / angleFactor;
  }

  if(globalAngle >= 360) globalAngle -= 360;
  if(globalAngle < 0) globalAngle += 360;

  let acceleration = accelerationSlider.value();

  if(!breaks){
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


// function keyCheck(key){
//   if(key.key === 'a'){
//     angle -= 1;
//   }
//   else if(key.key === 'd'){
//     angle += 1;
//   }
// }