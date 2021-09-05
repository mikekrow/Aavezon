function updateMovement(c, p) {
  if (c.left.isDown) {
    p.direction = "left";
    //  console.log(p);
    p.setVelocityX(-p.movementRate);
  } else if (c.right.isDown) {
    p.direction = "right";
    p.setVelocityX(p.movementRate);
  } else if (c.up.isDown) {
    p.direction = "up";
    p.setVelocityY(-p.movementRate);
  } else if (c.down.isDown) {
    p.direction = "down";
    p.setVelocityY(p.movementRate);
  } else {
    p.setVelocityX(0);
    p.setVelocityY(0);
  }
}
