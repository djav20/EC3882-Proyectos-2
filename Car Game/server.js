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
var buffer = new Array();
var bufferLeft = 0;
var bufferSize;
var sentBuffers = 0;

port.on('open', function(){
  timer.setInterval(readSerial, '', '100u'); // Ejecutamos readSerial() cada 200 microsegundos.
});

// Funciones de socket.
let clients = new Array();

function newConnection(socket){
  socket.on('disconnect', function(){
    clients.splice(clients.indexOf(socket, 1));
  });
  clients.push(socket);
  timer.setInterval(testing, '', '100m');
}

function testing(){
  console.log(clients.length);
  broadcastData('gameVariables');
}

// Game variables

var gameVariables= {
  acceleration: 0,
  angle: 0,
  carBreak: 0,
  beep: 0
}

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

        assignVariables(channel1, channel2);
        
        broadcastData('gameVariables', gameVariables);
        console.log(gameVariables);
      }
    }
  }
}

// Funcion que recibe los canales y los asigna a las variables del juego.
function assignVariables(channel1, channel2){
  if(channel1.analogic > 90) channel1.analogic -= 360;
  if(channel1.analogic == -1) channel1.analogic = 0;
  channel2.analogic = Math.floor(map(channel2.analogic, 0, 1950, 0, 100)) // reales: de 20 a 1910
  
  gameVariables.angle = channel1.analogic;
  gameVariables.acceleration = channel2.analogic;
  gameVariables.carBreak = channel1.digital1;
  gameVariables.beep = channel1.digital2;
}

// Envia a todos los sockets conectados el parametro params.
function broadcastData(tag, params){
  //io.sockets.emit(tag, params);
  for(let i = 0; i < clients.length; i++){
    clients[i].emit('gameVariables', {hola: i+1});
  }
}

// Funcion que decodifica el protolo de comunicacion.
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
  return result;
}

function map(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};