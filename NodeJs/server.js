// Importamos librerias.

const SerialPort = require('serialport');
const NanoTimer = require('nanotimer');
const express = require('express');
const socket = require('socket.io');

// Configuracion del servidor.

var app = express();
var server = app.listen(3000);
var io = socket(server);
app.use(express.static('public'));
io.sockets.on('connection', newConnection);

// Configuracion del serial.

var timer = new NanoTimer();
var port = new SerialPort('COM3', {
  baudRate: 115200,
  highWaterMark: 5
});

var header = 'f';
var buffer = new Array();
var bufferLeft = 0;
var bufferSize;

port.on('open', function(){
  timer.setInterval(readSerial, '', '10m'); // Ejecutamos readSerial() cada 200 microsegundos.
});

// Funciones de socket.

function newConnection(socket){
}

// Con 10 segundos de test el 0.01% de los buffers viene con un byte adicional. La funcion lo desecha y se autosincroniza sin perder datos.

function readSerial(){
  var hexaInt = port.read(1); // Retorna array con el dato en decimal.
  if(hexaInt != null){ // Si lee algo se cumple.
    var hexaChar = hexaInt[0].toString(16); // Convertimos el dato a hexadecimal (dos caracteres).
    var hexaFirst = hexaChar[0]; // Asignamos el primer caracter.
    if(hexaFirst == header){ // Revisamos si es el header (f).
      bufferLeft = 2 * parseInt(hexaChar[1]); // El segundo caracter es el numero de canales, y dos bytes por canal es el tamaño del array total.
      bufferSize = bufferLeft;
    }
    else if(bufferLeft > 0){ // Si aun no se llena el array.
      buffer.push(hexaInt[0]); // Añadimos el byte al array.
      if(--bufferLeft == 0){ // Si se lleno el array en este momento.
        console.log(buffer);
        if(buffer.length == bufferSize){ // Si el array tiene el tamaño correcto. 
          var channel1 = bluffConvertion(buffer[0], buffer[1]); // Revertimos el protocolo.
          console.log(channel1);
          io.sockets.emit('data', channel1);
        }
        buffer = new Array(); // Vaciamos nuestro array.
      }
    }
    else{
    }
  }
  else{
    console.log('null')
  }
}

function end(func){
  func.clearInterval(); // Dejamos de ejectuar readSerial().
  console.log('Paquetes correctos: ' + i/j*100 + '%');
}

function bluffConvertion(a, b){
  var c = 0;
  var e = 0;
  var d = 0;
  var result;

  //0XX1 1111 // to 1111 1100 1100
  //0100 1100
  
  a = a & 0x1F;
  b = b << 1;
  c = (a << 8);
  e = b;
  e = e & 0x00FF;
  d = c | e;
  d = d >> 1;

  //result = map(d, 0, 4096, 1, 500);
  return d;
}