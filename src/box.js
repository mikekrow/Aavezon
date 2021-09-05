function checkIfMaxOnScreen() {
  //need to check and see how many boxes are on the playing field vs how many still need to be dispersed
  let currentCount = countOnScreenBoxes(box);

  if (boxCount > maxBoxOnScreen) {
    if (currentCount < maxBoxOnScreen - 10) {
      boxGameActive = false;
      createBoxes(maxBoxOnScreen - currentCount);
      currentCount = countOnScreenBoxes(box);
    }
  }
}

function createTexticle(bx, scr) {
  let txt = that.add.text(bx.x, bx.y - 50, scr, {
    font: "45px Arial Black",
    fill: "#fff",
  });
  txt.setDepth(3);
  txt.setStroke("#00f", 16);
  txt.setShadow(2, 2, "#333333", 2, true, true);
  const top = thatTimer.hsv[ranNumb(1, 359)].color;
  const bottom = thatTimer.hsv[ranNumb(1, 359)].color;
  txt.setTint(top, top, bottom, bottom);

  that.tweens.add(
    {
      targets: txt,
      x: bx.x + 50,
      y: bx.y - 250,
      alpha: 0,
      duration: 3000,
      ease: "Power2",
    },
    that
  );
  that.time.delayedCall(2000, function () {
    txt.destroy(true);
  });
}

function removeBoxDumpster(gl, bx) {
  let time = bx.timeAdd;
  if (bx.lick) {
    time = time * -1;
    timerCount += time;
    time = "+" + time;
  } else {
    timerCount -= 10;
    time = "-10";
  }
  time = time + " Sec";
  createTexticle(bx, time);
  bx.destroy(true);
  if (timerCount < 0) {
    timerCount = 0;
  }
  if (time.indexOf("-") > -1) {
    soundEffectsArray[0].play();
  } else {
    soundEffectsArray[1].play();
  }
  checkIfMaxOnScreen();
  timerNumber.setText(formatTime(timerCount));
}

function removeBox(gl, bx) {
  /* let frame = swg.anims.getProgress();
    if (frame > 0) { */

  let score = bx.scoreValue;

  if (bx.timeAdd === undefined) {
    if (score < 0) {
      score = "-" + score;
    } else {
      score = "+" + score;
    }
  } else {
    score = bx.timeAdd;
    if (score < 0) {
    } else {
      score = "+" + score;
    }
    score = score + " Sec";

    timerCount += bx.timeAdd;
    if (timerCount < 0) {
      timerCount = 0;
    }
    timerNumber.setText(formatTime(timerCount));
  }

  createTexticle(bx, score);

  bx.destroy(true);
  boxShippedCount += bx.scoreValue;

  updateShippedBoxCount();

  checkIfMaxOnScreen();

  timerNumber.setText(formatTime(timerCount));
  ///play sound here!

  if (score <= 0 || bx.timeAdd <= 0) {
    soundEffectsArray[0].play();
  } else {
    soundEffectsArray[1].play();
  }
  //}
}
function countOnScreenBoxes(b) {
  let count = 0;

  let child = b.children.entries;
  for (var i in child) {
    count++;
  }

  return count;
}
function createBoxes(bxAmnt) {
  let cnt = 0;
  while (cnt <= bxAmnt) {
    let b;
    if (levelCount > 1) {
      let ran = ranNumb(1, 10);
      if (ran === 4) {
        b = that.physics.add.sprite(0, 0, "box_tall_single");
        b.tall = true;
        b.double = false;
      }
    }

    if (levelCount > 2 && b === undefined) {
      let ran = ranNumb(1, 20);
      if (ran === 4) {
        b = that.physics.add.sprite(0, 0, "box_tall_double");
        b.tall = true;
        b.double = true;
      }
    }

    if (levelCount > 2 && b === undefined) {
      let ran = ranNumb(1, 20);
      if (ran === 4) {
        let ranSprite = ranNumb(1, 3);
        b = that.physics.add.sprite(0, 0, "box_tall_single_lick_" + ranSprite);
        b.tall = true;
        b.double = false;
        b.lick = true;
      }
    }

    if (levelCount > 3 && b === undefined) {
      let ran = ranNumb(1, 20);
      if (ran === 4) {
        let ranSprite = ranNumb(0, 4);
        let spriteArray = ["alpha", "fomo", "fud", "kek"];

        b = that.physics.add.sprite(0, 0, "box_" + spriteArray[ranSprite]);
        b.timeAdd = 30;
      }
    }

    if (b === undefined) {
      b = that.physics.add.sprite(0, 0, "box");
    }

    b.new = true;
    box.add(b);
    cnt++;
  }

  let boxes = box.children.entries;

  let boxDistance = 250;

  //900max
  if (levelCount >= 1 && levelCount <= 6) {
    boxDistance = 300;
  } else if (levelCount >= 3 && levelCount <= 4) {
    boxDistance = 400;
  } else if (levelCount >= 5 && levelCount <= 6) {
    boxDistance = 500;
  } else if (levelCount >= 7 && levelCount <= 8) {
    boxDistance = 600;
  } else if (levelCount >= 9) {
    boxDistance = 900;
  }

  ///its moving all boxes thats why!!!
  for (var b in boxes) {
    if (boxes[b].new) {
      Math.floor(Math.random() * 500) + 100;

      boxes[b].x = Math.floor(Math.random() * 550) + 200;

      boxes[b].y = Math.floor(Math.random() * boxDistance) + 300;

      boxes[b].originX = boxes[b].x;
      boxes[b].originY = boxes[b].y;

      boxes[b].y = boxes[b].y - 100;

      boxes[b].body.offset.y = boxes[b].body.height / 2;
      boxes[b].body.height = boxes[b].body.height / 2;
      boxes[b].body.width = boxes[b].body.width;
      boxes[b].scoreValue = 1;

      if (boxes[b].tall) {
        boxes[b].body.offset.y = 40;
        boxes[b].setDrag(1200);
        boxes[b].setBounce(0.5, 0.5);
      } else {
        boxes[b].body.offset.y = 20;
        boxes[b].setDrag(700);
        boxes[b].setBounce(1, 1);
      }

      if (boxes[b].tall && boxes[b].double) {
        boxes[b].body.maxVelocity.x = 5;
        boxes[b].body.maxVelocity.y = 5;
        boxes[b].scoreValue = 4;
      } else if (boxes[b].tall && !boxes[b].double) {
        boxes[b].body.maxVelocity.x = 20;
        boxes[b].body.maxVelocity.y = 20;
        boxes[b].scoreValue = 2;
      }
      if (boxes[b].lick) {
        boxes[b].scoreValue = 0;
        boxes[b].timeAdd = -30;
      }
      boxes[b].depth = boxes[b].y + boxes[b].height / 2;
    }
  }

  that.physics.add.collider(box, box, moveDepthUpBox);
  that.physics.add.overlap(goal, box, removeBox);
  that.physics.add.overlap(dumpster, box, removeBoxDumpster);
  that.physics.add.collider(box, layer);
}

function moveDepthUpBox(bx1, bx2) {
  bx1.depth = bx1.y + bx1.height / 4;
  bx2.depth = bx2.y + bx2.height / 2;
}

function boxDrop(plyr, bx) {
  let boxes = bx.children.entries;
  let complete = false;
  for (var b in boxes) {
    if (boxes[b].new) {
      if (boxes[b].y < boxes[b].originY) {
        boxes[b].y += 10;
      } else if (boxes[b].y === boxes[b].originY) {
        boxGameActive = true;
        boxes[b].new = false;
        complete = true;
      }
    }
  }
  if (complete) {
    soundEffectsArray[5].play();
  }
}

function removeAllBoxes() {
  box.clear(false, true);
}
