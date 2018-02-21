class Cell {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.hasMonster = false;
  }
}

function adjustCells(){
  var wx = Math.floor(width / columns);
  var wy = Math.floor(height / rows);
  if(wx<wy) return wx;
  else return wy;
}

function initiateCells(){
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < columns; j++){
      var x = j * w;
      var y = i * w;
      cells.push(new Cell(x,y));
    }
  }
}