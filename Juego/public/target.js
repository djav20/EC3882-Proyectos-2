class Target{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.alive = true;
  }
  move(img, x, y){
    this.x = x;
    this.y = y;
    this.show(img);
  }
  show(img){
    fill(0);
    image(img, this.x * w, this.y * w);
    //rect(this.x * w, this.y * w, w, w);
  }
}

function randomTargets(array){
  var randomX;
  var randomY;
  for(var i = 0; i < targetNumber; i++){
    do{
      randomX = Math.floor(random(columns));
      randomY = Math.floor(random(rows));
      //console.log(randomX, randomY)
    } while(!checkCoordinates(targets, randomX, randomY));
    array.push(new Target(randomX, randomY));
  }
}

function printTargets(img, targetsArray){
  for(var i = 0; i < targetsArray.length; i++){
    targetsArray[i].show(img);
  }
}

function changeTargets(){
  targets = new Array();
  randomTargets(targets);
}