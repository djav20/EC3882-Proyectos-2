var SerialPort = require('serialport');
var port = new SerialPort('COM3', {
  baudRate: 115200,
  highWaterMark: 5
});

var NanoTimer = require('nanotimer');

var timer = new NanoTimer();

var i = 0;
var j = 0;

function readSerial(){
  var x = port.read();
  if(x != null){
    console.log(x);
    if(++j == 2){
      timer.setTimeout(end, [timer], '5s');
    }
    if(x.length > 4){
      i++;
    }
  }
}

port.on('open', function(){
  //timer.setInterval(testTimer, '', '500u');
  timer.setInterval(readSerial, '', '500u');
});

function end(asd){
  asd.clearInterval();
  console.log('Completas: ' + i);
  console.log('Totales: ' + j);
}

function hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function testTimer(){
  var x = port.read();
  if(x != null){
    console.log(x);
    if(++j == 4){
      timer.setTimeout(end, [timer], '10s');
    }
    if(x.length > 4){
      i++;
    }
  }
}