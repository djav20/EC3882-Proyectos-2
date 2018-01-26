const SerialPort = require('serialport');
const NanoTimer = require('nanotimer');

var port = new SerialPort('COM3', {
  baudRate: 115200,
  highWaterMark: 5
});

var timer = new NanoTimer();

var i = 0;
var j = 0;
var header = 'f';
//console.log(header.toString(16)[0]);
var buffer = new Array();
var bufferLeft = 0;
var bufferSize;

var x = true;

function readSerial(){
  var hexaInt = port.read(1);
  if(hexaInt != null){
    var hexaChar = hexaInt[0].toString(16);
    var hexaFirst = hexaChar[0];
    if(hexaFirst == header){
      var bufferLeft = 2 * parseInt(hexaChar[1]);
      //console.log(bufferLeft);
    }
  }
}

function test2(){
  var hexaInt = port.read(1);
  if(hexaInt != null){
    var hexaChar = hexaInt[0].toString(16);
    var hexaFirst = hexaChar[0];
    if(hexaFirst == header){
      if(x){
        timer.setTimeout(end, [timer], '10s');
        x = false;
      }
      bufferLeft = 2 * parseInt(hexaChar[1]);
      bufferSize = bufferLeft;
    }
    else if(bufferLeft > 0){
      buffer.push(hexaInt[0]);
      if(--bufferLeft == 0){
        console.log(buffer);
        if(buffer.length == bufferSize){
          var result = bluffConvertion(buffer[0], buffer[1]);
          console.log(result);
        }
        buffer = new Array();
      }
    }
    else{
    }
  }
}

port.on('open', function(){
  //timer.setInterval(testTimer, '', '1007u');
  //timer.setInterval(readSerial, '', '1007u');
  timer.setInterval(test2, '', '200u');
});

function end(asd){
  asd.clearInterval();
  //console.log('Completas: ' + i);
  //console.log('Totales: ' + j);
  console.log('Paquetes correctos: ' + i/j*100 + '%');
}

function hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function testTimer(){
  var x = port.read();
  if(x != null){
    console.log(x);
    if(++j == 4){
      timer.setTimeout(end, [timer], '5s');
    }
    if(x[0] == 241){
      i++;
    }
  }
}

function bluffConvertion(a, b){
  var c = 0;
  var e = 0;
  var d = 0;
  var result;

  //0XX1 1111 // necesito 1111 1100 1100
  //0100 1100
  
  a = a & 0x1F; //0001 1111
  b = b << 1;
  
  // a = 0001 1111
  // b = 1001 1000
  
  c = (a << 8);
  /// c = 0001 1111 0000 0000
  
  e = b;
  
  // e = 1111 1111 1001 1000
  e = e & 0x00FF;
  // e = 0000 0000 1001 1000
  
  d = c | e;
  d = d >> 1;

  //result = map(d, 0, 4096, 1, windowHeight);
  return d;
}