class Car {
  constructor(x, y, image) {
    this.position = createVector(x, y);
    this.centerPosition = createVector(x + image.width / 2, y + image.height / 2);
    this.speed;
    this.velocity = createVector(0, 0);
    this.trayectory = createVector(0, 0);
    this.image = image;
  }

  applyForces() {
    //if(this.acceleration > carMaxSpeed) this.acceleration = carMaxSpeed;
    this.velocity = this.trayectory.mult(this.speed);
    
    this.position.add(this.velocity);
    this.centerPosition.add(this.velocity);
  }

  checkCrash(item) {
    return (abs(item.xCenter - this.centerPosition.x) < pixelsToCrash && abs(item.yCenter - this.centerPosition.y) < pixelsToCrash);
  }

  checkBorders() {
    if(this.centerPosition.x - this.image.width > width) {
      this.position.add(-width - this.image.width, 0);
      this.centerPosition.add(-width - this.image.width, 0);
    } 
    else if(this.centerPosition.x - this.image.width < 0){
      this.position.add(width + this.image.width, 0);
      this.centerPosition.add(width + this.image.width, 0);
    }

    if(this.centerPosition.y - this.image.width > height){
      this.position.add(0, -height - this.image.width -20);
      this.centerPosition.add(0, -height - this.image.width -20);
    } 
    else if (this.centerPosition.y + this.image.width < 0){
      this.position.add(0, height + this.image.width + 20);
      this.centerPosition.add(0, height + this.image.width + 20);
    }
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    imageMode(CENTER);
    image(this.image, 0, 0);
    pop();
  }
}