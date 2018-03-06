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

const header = 'f';
const buffersToSend = 10000000;
var buffer = new Array();
var bufferLeft = 0;
var bufferSize;
var sentBuffers = 0;

port.on('open', function(){
  //timer.setInterval(readSerial, '', '100u'); // Ejecutamos readSerial() cada 200 microsegundos.
});

// Funciones de socket.

function newConnection(socket){
  console.log('conectado')
  timer.setInterval(readSerial, '', '100u'); // Ejecutamos readSerial() cada 200 microsegundos.
}

// Con 10 segundos de test el 0.01% de los buffers viene con un byte adicional. La funcion lo desecha y se autosincroniza sin perder datos.

function readSerial(){
  var hexaInt = port.read(1); // Retorna array con el dato en decimal.
  if(hexaInt != null){ // Si lee algo.
    var hexaChar = hexaInt[0].toString(16); // Convertimos el dato a hexadecimal (dos caracteres).
    var hexaFirst = hexaChar[0]; // Asignamos el primer caracter.
    if(hexaFirst == header){ // Revisamos si es el header (f).
      buffer = new Array();
      bufferLeft = 2 * parseInt(hexaChar[1]); // El segundo caracter es el numero de canales, y dos bytes por canal es el tamaño del array total.
      bufferSize = bufferLeft;
    }
    else if(bufferLeft > 0){ // Si aun no se llena el array.
      buffer.push(hexaInt[0]); // Añadimos el byte al array.
      if(--bufferLeft == 0){ // Si se lleno el array en este momento.
        var tempArray = buffer;
        var channel1 = bluffConvertion(tempArray[0], tempArray[1]); // Revertimos el protocolo canal 1.
        var channel2 = bluffConvertion(tempArray[2], tempArray[3]); // Revertimos el protocolo canal 2.
        // -40 a 40
        // 
        
        //console.log('Canal 1: ');
        //console.log(channel1.analogic);
        console.log(channel1.digital1);
        //console.log('Canal 2: ');
        //console.log(channel2.analogic);

        io.sockets.emit('data', channel1, channel2);

        if(++sentBuffers > buffersToSend){
          stopMeasure();
          console.log('done');
        }
      }
    }
  }
}

function stopMeasure(){
  timer.clearInterval();
  //io.sockets.emit('done');
}

function end(func){
  func.clearInterval(); // Dejamos de ejectuar readSerial().
  //console.log('Paquetes correctos: ' + i/j*100 + '%');
}

function bluffConvertion(a, b){ // a: bits mas significativos, b: bits menos significativos
  var c = 0;
  var e = 0;
  var d = 0;
  var digital1 = 0;
  var digital2 = 0;

  var result ={
    digital1: 0,
    digital2: 0,
    analogic: 0
  };

  //0XX1 1111 // to 1111 1100 1100
  //0100 1100
  digital1 = a & 0x40;
  digital1 = digital1 >> 6;
  digital2 = a & 0x20;
  digital2 = digital2 >> 5;

  a = a & 0x1F;
  b = b << 1;
  c = (a << 8);
  e = b;
  e = e & 0x00FF;
  d = c | e;
  d = d >> 1; // Resultado analogico.

  result.digital1 = digital1;
  result.digital2 = digital2;
  result.analogic = d;
  //result = map(d, 0, 4096, 1, 500);
  return result;
}

function map(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};