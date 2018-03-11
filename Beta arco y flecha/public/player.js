class Player{
  constructor(x, y, hp){
    this.x = x;
    this.y = y;
    this.hp = hp;
  }
  show(img, angle){
    //noStroke();
    //fill(255,0,0);
    push();
    imageMode(CENTER);
    translate(this.x * w + w/2, this.y * w + w/2);
    rotate(angle);
    image(bow, 0, 0);
    pop();
    //image(img, this.x * w, this.y * w);
  }
}