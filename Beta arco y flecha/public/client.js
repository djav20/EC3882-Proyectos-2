//p5.disableFriendlyErrors = true;
const columns = 31;
const rows = 31;
const frames = 50;
const targetNumber = 5;

var bow;
var diana;

var gridColumns;
var gridRows;
var w;

var cells = new Array();
var player = new Player(Math.floor(columns / 2), Math.floor(rows / 2), 3);
var targets = new Array();

var xAngle = 0;
var radious = 100;

function preload(){
  bow = loadImage('assets/bow.png');
  diana = loadImage('assets/target.jpg');
}

function setup() {
  createCanvas(682, 682);
  frameRate(frames);
  pixelDensity(1);
  angleMode(DEGREES);

  w = Math.floor(width / rows);
  bow.resize(w, w);
  diana.resize(w, w);
  //imageMode(CENTER)
  
  initiateCells();
  randomTargets(targets);
  setInterval(changeTargets, 1000);
}

function draw() {
  refreshScreen();
  printTargets(diana, targets);
  player.show(bow, 360 - xAngle);
  showAim(player, xAngle + 28, radious);
  if(++xAngle > 360) xAngle = 0;
}

function refreshScreen(){
  background(0, 180, 0);
  grid();
}

function grid(){
  stroke(255,255,255,20); // Lineas blancas.
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < columns; j++){
      var x = j * w;
      var y = i * w;
      line(x, y, x + w, y);
      line(x + w, y, x + w, y + w);
      line(x + w, y + w, x, y + w);
      line(x, y + w, x, y);
    }
  }
}

function checkCoordinates(array, x, y){
  //console.log(array)
  for(var i = 0; i < array.length; i++){
    if(array[i].x == x && array[i].y == y){
      return false;
    }
  }
  if(player.x == x && player.y == y){
    return false;
  }
  return true;
}

function showAim(player, angle, localRadious){
  var point = aim(angle, localRadious);
  stroke(0, 0, 0, 150);
  line((player.x * w) + w / 2, (player.y * w) + w / 2, point.x, point.y);
}

function aim(angle, localRadious){
  var x;
  var y;

  if(angle > 315) angle -= 360;
  
  if(angle > -45 && angle <= 45) {
    // x = width / 2 + localRadious;
    x = width;
    y = height / 2 + map(angle, -45, 45, height/2, -height/2);  
  } else if(angle > 45 && angle <= 135) {
    x = width / 2 + map(angle, 45, 135, width/2, -width/2); ;
    // y = height / 2 - localRadious;
    y = 0;
  } else if(angle > 135 && angle <= 225) {
    // x = width / 2 - localRadious;
    x = 0;
    y = height / 2 + map(angle, 135, 225, -height/2, height/2);
    
  } else if(angle > 225 && angle <= 315) {
    x = width / 2 + map(angle, 225, 315, -width/2, width/2); ;
    // y = height / 2 + localRadious;
    y = height;
  }
  return {x: x, y: y};
}