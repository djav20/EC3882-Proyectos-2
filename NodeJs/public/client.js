var socket;
var add = document.getElementById("xplus");
var sub = document.getElementById("xminus");


//p5.disableFriendlyErrors = true;

var array = new Array();
//var x = 0;
var clearScreen = false;
var start = false;

// Configuracion del osciloscopio.

var packetSize = 60;
const frames = 1000; // 1000 para tiempo real
var x = 0;
var lastX = 0;
var lastY = -1;

var xFactor = 2;
var cols;
var rows;
var xResolution;
var yResolution;

var bottomMapLimit = 50;
var topMapLimit = 400;
var digital1 = 0;

function setup(){
  createCanvas(1280,500);
  frameRate(frames);
  // Colocar grid.
  pixelDensity(1);
  background(255);
  xResolution = 20;
  yResolution = 160;
  cols = Math.floor(width / xResolution);
  rows = Math.floor(height / yResolution);

  socket = io.connect('http://localhost:3000');

  socket.on('data', function(data){
    
    //console.log(data);
    array.push(Math.floor(map(data.analogic, 0, 4096, height, 0))); // Guardamos todo lo que venga en esta variable.
    digital1 = data.digital1;
  });

  grid();
}

function draw(){
  if(clearScreen){
    background(255);
    grid();
    clearScreen = false;
  }
  
  if(array.length > packetSize){
    var tempArray = array.splice(0,packetSize);
    console.log(array.length);
    //paintPackets(tempArray);
    paintLines(tempArray);
  }
}

function paintLines(arrayToPaint){  
  for(var i = 0; i < arrayToPaint.length; i++){
    if(lastY == -1){
      stroke(255); 
    }
    else{
      if(digital1 == 1){
        stroke(255,0,0);
      }
      else{
        stroke(0);
      }
    }
    
    line(lastX, lastY, x, arrayToPaint[i]);
    
    lastX = x;
    lastY = arrayToPaint[i];
    //x++;
    x += xFactor;

    if(x >= width){
      clearScreen = true;
      lastX = 0;
      lastY = -1;
      x = 0;
    }
  }
}

function paintPackets(array){
  loadPixels();
  for(var i = 0; i < array.length; i++){
    index = (x + array[i] * width) * 4;
    pixels[index] = 0;
    pixels[index + 1] = 0;
    pixels[index + 2] = 0;
    pixels[index + 3] = 255;
    x += xFactor;
    if(x == width){
      x = 0;
      clearScreen = true;
    }
  }
  updatePixels();
}

function paintPixel(result){
  loadPixels();
  index = (x + result * width) * 4;
  pixels[index] = 0;
  pixels[index + 1] = 0;
  pixels[index + 2] = 0;
  pixels[index + 3] = 255;
  updatePixels();

  x+= xFactor;
  if(x == width){
    x = 0;
    clearScreen = true;
  }
}

function addXFactor(){
  xFactor += 2;
  xResolution += 20
  console.log(xFactor);
}

function subXFactor(){
  if(xFactor >= 3){
    xFactor -= 2;
    xResolution -= 20
  }
  console.log(xFactor);
}

function grid(){
  stroke(200); // Lineas grises.
  for(var i = 0; i < cols; i++){
    line(i*xResolution, 0, i*xResolution, height);
  }

  for(var i = 0; i < rows; i++){
    line(0, i*yResolution, width, i*yResolution);
  }
}