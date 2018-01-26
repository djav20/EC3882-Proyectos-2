const SerialPort = require('serialport');
const NanoTimer = require('nanotimer');

var timer = new NanoTimer();
var port = new SerialPort('COM3', {
  baudRate: 115200,
  highWaterMark: 5
});

var i = 0;
var j = 0;
var header = 'f';

var buffer = new Array();
var bufferLeft = 0;
var bufferSize;

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
        }
        buffer = new Array(); // Vaciamos nuestro array.
      }
    }
    else{
    }
  }
}

port.on('open', function(){
  //timer.setInterval(testTimer, '', '1007u');
  timer.setInterval(readSerial, '', '200u'); // Ejecutamos readSerial() cada 200 microsegundos.
});

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

  //result = map(d, 0, 4096, 1, windowHeight);
  return d;
}

// Con esta probamos la lectura del buffer completo cada X segundos. Se consideran paquetes buenos los que empiecen con F1.
// Esta funcion no se usa.
function testTimer(){
  var x = port.read();
  if(x != null){
    console.log(x);
    if(++j == 3){
      timer.setTimeout(end, [timer], '5s');
    }
    if(x[0] == 241){ // Mandar F1 para esto.
      i++;
    }
  }
}