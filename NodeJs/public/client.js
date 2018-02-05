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

var bottomMapLimit = 50;
var topMapLimit = 400;
var digital1 = 0;

function setup(){
  createCanvas(1280,500);
  frameRate(frames);
  // Colocar grid.
  pixelDensity(1);
  background(255);
  var xResolution = 20;
  var yResolution = 20;
  cols = Math.floor(width / xResolution);
  rows = Math.floor(height / yResolution);

  socket = io.connect('http://localhost:3000');

  socket.on('data', function(data){
    
    //console.log(data);
    array.push(Math.floor(map(data.analogic, 0, 4096, bottomMapLimit, topMapLimit))); // Guardamos todo lo que venga en esta variable.
    digital1 = data.digital1;
  });

  socket.on('done', function(){
    start = true; // Cuando estemos listos empezamos a dibujar.
  });
}

function draw(){
  if(clearScreen){
    background(255);
    grid();
    clearScreen = false;
  }
  /*if(start){
    if(array.length != 0){
      paintPixel(array.splice(0,1));
    }
  }*/
  /*if(array.length > packetSize){
    var tempArray = array;
    array.splice(0,packetSize);
    paintPackets(tempArray);
  }*/
  // Funciona para tiempo real. Falta voltear eje Y. Esto para realTime luego.
  
  if(array.length > packetSize){
    var tempArray = array.splice(0,packetSize);
    console.log(array.length);
    //paintPackets(tempArray);
    paintLines(tempArray);
  }
}

function paintLines(arrayToPaint){
  /*stroke(0);
  line((x - 1), lastY, x, array[0]);
  x++;

  for(var i = 1; i < array.length; i++){
    line((x - 1), array[i-1], x, array[i]);
    x += xFactor;
    if(x == width){
      x = 4;
      clearScreen = true;
    }
  }
  lastY = array[array.length - 1];*/
  
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
  //packetSize -= 10;
  console.log(xFactor);
}

function subXFactor(){
  if(xFactor >= 3){
    xFactor -= 2;
  }
  console.log(xFactor);
}

function grid(){
	// Dibujamos las lineas guia en todo el laberinto (las paredes blancas).
  stroke(50); // Lineas grises.
}