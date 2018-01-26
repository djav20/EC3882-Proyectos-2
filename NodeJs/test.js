const NanoTimer = require('nanotimer');
const express = require('express');
const socket = require('socket.io');

var app = express();
var server = app.listen(3000);
var io = socket(server);
app.use(express.static('public'));
io.sockets.on('connection', newConnection);

var timer = new NanoTimer();

timer.setInterval(sendData, '', '500u');
var y = 1;
var t = 0;
var start = false;

function sendData(){
  if(start){
    x = Math.floor(40*Math.sin(Math.PI*t)) + 41 + 80;
    t+=(0.01);
    io.sockets.emit('data', x);

    if(++y == 2500){
      start = false;
      io.sockets.emit('done');
      console.log('done');
    }
  }

}

function newConnection(socket){
  start = true;
}