class Tool{
  constructor(x, y, image){
    this.x = x;
    this.y = y;
    this.xCenter = x + image.width / 2;
    this.yCenter = y + image.height / 2;
    this.image = image;
  }

  show(){
    push();
    translate(this.x, this.y);
    imageMode(CENTER);
    image(this.image, 0, 0);
    pop();
  }
}