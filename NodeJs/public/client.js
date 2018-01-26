
var socket = io.connect('http://localhost:3000');

socket.on('data', function(data){
  console.log("data arrived");
  array.push(data);
});
p5.disableFriendlyErrors = true;

var variables = 0;
var array = new Array();
var windowWidth = 1280;
var windowHeight = 480;
var lastX = 0;
var lastY = -1;
var x = 0;
var y;

function setup(){
  createCanvas(1280,480);
  frameRate(1000);
  background(100);
}

function draw(){
  if(array.length != 0){
    //paint(array[0]);
    //paint(200);
    paint2(300);
    array.splice(0,1);
    console.log("data drawn");
  }

  /*if(array.length > 20){
    //paint(array[0]);
    //paint(200);
    var tempArray = array;
    array.splice(0,20);
    paint3(tempArray);
    
    console.log("data drawn");
  }*/
}


function paint2(result){
  loadPixels();
  index = (windowWidth*(windowHeight-result)) + x;
  pixels[index] = 0;
  updatePixels();
  if(++x == windowWidth){
    background(100);
    x = 0;
  }
}

function paint3(array){
  loadPixels();
  for(var i = 0; i < array.length; i++){
    index = (windowWidth*(windowHeight-result)) + x;
    pixels[index] = 0;
    if(++x == windowWidth){
      background(100);
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
  fill(0);
  rect(x, windowHeight - result,1,1);
  //line(lastX, lastY, x, windowHeight - result);
  
  lastX = x;
  lastY = windowHeight - result;
  
  if(++x == windowWidth){
    background(100);
    lastX = 0;
    lastY = -1;
    x = 0;
  }
}