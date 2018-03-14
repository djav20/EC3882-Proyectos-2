class Car {
  constructor(x, y, image) {
    this.position = createVector(x, y);
    this.centerPosition = createVector(x + image.width / 2, y + image.height / 2);
    this.velocity = createVector(0, 0);
    this.trayectory = createVector(0, 0);
    this.acceleration;
    this.image = image;
  }

  applyForces() {
    if(this.acceleration > carMaxSpeed) this.acceleration = carMaxSpeed;
    this.velocity = this.trayectory.mult(this.acceleration);
    this.position.add(this.velocity);
    this.centerPosition.add(this.velocity);
  }

  checkCrash(item) {
    return (abs(item.xCenter - this.centerPosition.x) < pixelsToCrash && abs(item.yCenter - this.centerPosition.y) < pixelsToCrash);
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