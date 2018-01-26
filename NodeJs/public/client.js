var socket;

p5.disableFriendlyErrors = true;

var array = new Array();
var x = 0;
var clearScreen = false;
var start = false;

// Configuracion del osciloscopio.

const packetSize = 40;
const frames = 60; // 1000 para tiempo real
var xFactor = 1;
var bottomMapLimit = 200;
var topMapLimit = 400;


function setup(){
  createCanvas(1280,500);
  frameRate(frames);
  // Colocar grid.
  pixelDensity(1);
  background(255);

  socket = io.connect('http://localhost:3000');

  socket.on('data', function(data){
    array.push(map(d, 0, 4096, bottomMapLimit, topMapLimit)); // Guardamos todo lo que venga en esta variable.
  });

  socket.on('done', function(){
    start = true; // Cuando estemos listos empezamos a dibujar.
  });
}

function draw(){
  if(clearScreen){
    background(255);
    clearScreen = false;
  }
  if(start){
    if(array.length != 0){
      paintPixel(array.splice(0,1));
    }
  }

  // Funciona para tiempo real. Falta voltear eje Y. Esto para realTime luego.
  /*
  if(array.length > packetSize){
    var tempArray = array;
    array.splice(0,packetSize);
    paintPackets(tempArray);
  }*/
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