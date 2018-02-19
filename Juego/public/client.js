//p5.disableFriendlyErrors = true;

var gridColumns;
var gridRows;
var w;

const columns = 40;
const rows = 40;

function setup() {
  createCanvas(800,800);
  frameRate(frames);
  pixelDensity(1);
  background(0,180,0);

  w = Math.floor(width / rows);
  grid();
}

function draw() {

}


function grid(){
	// Dibujamos las lineas guia en todo el laberinto (las paredes blancas).
    stroke(255,255,255,20); // Lineas blancas.
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < columns; j++){
            var x = j * w;
            var y = i * w;
            line(x, y, x + w, y);
            line(x + w, y, x + w, y + w);
            line(x + w, y + w, x, y + w);
            line(x, y + w, x, y);
        }
    }
}