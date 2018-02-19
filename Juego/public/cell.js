class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.hasMonster = false;
    }
}

function adjustCells(){
    var wx = Math.floor(width / m);
    var wy = Math.floor(height / n);
    if(wx<wy) return wx;
    else return wy;
}