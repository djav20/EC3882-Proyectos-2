
var socket = io.connect('http://localhost:3000');

socket.on('data', function(data){
  dataa = data;
});

var dataa = 0;

function setup(){
  createCanvas(720,720);
  frameRate(frames);
  background(255);
}


function draw(){
  if(dataa != 0){
    console.log(dataa);
    dataa = 0;
  }
}