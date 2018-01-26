var socket;

p5.disableFriendlyErrors = true;

var variables = 0;
var array = new Array();
var windowWidth = 800;
var windowHeight = 500;
var lastX = 0;
var lastY = -1;
var x = 0;
var y;

function setup(){
  createCanvas(800,500);
  frameRate(100);
  pixelDensity(1);
  background(0);
  

  socket = io.connect('http://localhost:3000');
  socket.on('data', function(data){
    console.log("data arrived");
    data = map(data, 0, 4096, 1, 500);
    array.push(data);
  });
}

function draw(){
  /*if(array.length != 0){
    //paint(array[0]);
    //paint(200);
    paint2(300);
    array.splice(0,1);
    console.log("data drawn");
  }*/

  if(array.length > 500){
    var tempArray = array;
    array.splice(0,500);
    for(var i = 0; i < tempArray.length; i++){
      paint(tempArray[i]);
    }
    console.log('drawn');
    //paint3(tempArray);
  }
}


function paint2(result){
  loadPixels();
  index = (windowWidth*(windowHeight-result)) + x;
  pixels[index] = 255;
  pixels[index + 1] = 255;
  pixels[index + 2] = 255;
  pixels[index + 3] = 255;
  updatePixels(x, windowHeight-result, 1, 1);
  if(++x == windowWidth){
    //background(100);
    x = 0;
  }
}

function paint3(array){
  loadPixels();
  for(var i = 0; i < array.length; i++){
    //index = (windowWidth*(array[i])) + x;
    index = (x + array[i] * windowWidth) * 4;
    pixels[index] = 255;
    pixels[index + 1] = 255;
    pixels[index + 2] = 255;
    pixels[index + 3] = 255;
    if(++x == windowWidth){
      //background(100);
      x = 0;
    }
  }
  updatePixels();
}

function paint(result){
  if(lastY == -1){
    stroke(255); 
  }
  else{
    stroke(0);
  }
  fill(255);
  rect(x, windowHeight - result,1,1);
  //line(lastX, lastY, x, windowHeight - result);
  
  lastX = x;
  lastY = windowHeight - result;
  
  if(++x == windowWidth){
    //background(100);
    lastX = 0;
    lastY = -1;
    x = 0;
  }
}