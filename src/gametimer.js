var readysetgo = false;
var readyTitle;
var readyTimer;
var readyIntialTime;
var readyArray = ["Ready", "Set", "Ship!"];
var readyCount = 0;
var thatTimer;
var titles;

var shippedBoxText;
var boxInGui;

function formatTime(seconds) {
  // Minutes
  var minutes = Math.floor(seconds / 60);
  // Seconds
  var partInSeconds = seconds % 60;
  // Adds left zeros to seconds
  partInSeconds = partInSeconds.toString().padStart(2, "0");
  // Returns formated time
  return `${minutes}:${partInSeconds}`;
}
function formatTimeReadySetGo(seconds) {
  // Minutes
  var minutes = Math.floor(seconds / 60);
  // Seconds
  var partInSeconds = seconds % 60;
  // Adds left zeros to seconds
  partInSeconds = partInSeconds.toString().padStart(2, "0");
  // Returns formated time
  return `${partInSeconds}`;
}
async function onEvent() {
  timerCount -= 1; // One second
  if (timerCount < 0) {
    timedEvent.remove(false);
    if (boxShippedCount >= boxCountRequired) {
      continueGame();
    } else {
      soundEffectsArray[0].play();
      readyCount = 0;
      showGameOverText();
      //shut off all movement of player and update of default scene
      overAllGameActive = false;
      //update leaderboard

      (async () => {
        await updateLeaderBoard();
        leaderBoardInfo = await getLeaderBoard();
      })();
    }
  } else {
    timerNumber.setText(formatTime(timerCount));
  }
}

function updateShippedBoxCount() {
  shippedBoxText.setText(boxShippedCount + "/" + boxCountRequired);
}

function showGameOverText() {
  gameoverTitle.setText("Game Over");

  game.scene.start("title_one");
}

function newGameStart() {
  overAllGameActive = true;
  setup = false;
  readyTimer.remove(false);
  //add box drop here
  boxGameActive = false;
  addedMoreBoxes = false;
  if (boxCount <= maxBoxOnScreen) {
    createBoxes(boxCount);
  } else {
    createBoxes(maxBoxOnScreen);
  }

  timedEvent = thatTimer.time.addEvent({
    delay: 1000,
    callback: onEvent,
    callbackScope: this,
    loop: this,
  });
}
function createReadyText() {
  let txt = thatTimer.add.text(50, 100, readyArray[readyCount], {
    font: "45px Arial Black",
    fill: "#fff",
  });

  txt.setStroke("#00f", 16);
  txt.setShadow(2, 2, "#333333", 2, true, true);
  txt.setDepth(2);

  const top = thatTimer.hsv[textCounter].color;
  const bottom = thatTimer.hsv[359 - textCounter].color;
  txt.setTint(top, top, bottom, bottom);

  thatTimer.tweens.add(
    {
      targets: txt,
      scale: 7,
      alpha: 0,
      duration: 1000,
      ease: "Power2",
    },
    that
  );
  if (readyCount < 2) {
    soundEffectsArray[3].play();
  } else if (readyCount === 2) {
    soundEffectsArray[4].play();
  }
  readyCount++;
  if (readyCount > 3) {
    readysetgo = true;
  }
}

function addFormating(arr) {
  for (var i = 0; i < arr.length; ++i) {
    arr[i].setStroke("#00f", 16);
    arr[i].setShadow(2, 2, "#333333", 2, true, true);
    arr[i].setDepth(2);
  }
}

class GameGUI extends Phaser.Scene {
  constructor() {
    super({ key: "game_gui", active: true });
  }

  preload() {
    thatTimer = this;
    this.load.image("box", "assets/boxes/box.png");

    this.load.audio("readyset_sound", "assets/sounds/bell.mp3");
    this.load.audio("ship_sound", "assets/sounds/ding.mp3");
    this.load.audio("oops", "assets/sounds/oops.mp3");
    this.load.audio("success", "assets/sounds/success.mp3");
    this.load.audio("sendBox", "assets/sounds/send.mp3");
    this.load.audio("pushing", "assets/sounds/pop.mp3");
  }

  create() {
    soundEffectsArray = [
      this.sound.add("oops"),
      this.sound.add("sendBox"),
      this.sound.add("success"),
      this.sound.add("readyset_sound"),
      this.sound.add("ship_sound"),
      this.sound.add("pushing"),
    ];

    this.hsv = Phaser.Display.Color.HSVColorWheel();

    createReadyText();

    readyTimer = this.time.addEvent({
      delay: 1000,
      duration: 1000,
      callback: createReadyText,
      callbackScope: this,

      repeat: 3,
    });

    //  Rainbow Text
    timertitle = this.add.text(10, 5, "Time: ", {
      font: "45px Arial Black",
      fill: "#fff",
    });

    //  Rainbow Stroke
    timerNumber = this.add.text(175, 5, formatTime(timerCount), {
      font: "45px Arial Black",
      fill: "#fff",
    });

    boxInGui = thatTimer.add.image(630, 35, "box");

    shippedBoxText = thatTimer.add.text(
      650,
      5,
      boxShippedCount + "/" + boxCountRequired,
      {
        font: "45px Arial Black",
        fill: "#fff",
      }
    );

    gameoverTitle = this.add.text(200, 200, "", {
      font: "70px Arial Black",
      fill: "#fff",
    });

    titles = [timertitle, timerNumber, gameoverTitle, shippedBoxText];
    addFormating(titles);
  }

  update() {
    if (readysetgo) {
      newGameStart();
      readysetgo = false;
    }

    if (timertitle !== undefined) {
      const top = this.hsv[textCounter].color;
      const bottom = this.hsv[359 - textCounter].color;
      for (var i = 0; i < titles.length; ++i) {
        titles[i].setTint(top, top, bottom, bottom);
      }

      //
      textCounter++;

      if (textCounter === 360) {
        textCounter = 0;
      }
    }
    ///if you get past the required
    if (boxShippedCount >= boxCountRequired) {
      timedEvent.remove(false);
      overAllGameActive = false;
      boxShippedCount = 0;
      updateShippedBoxCount();
      levelCount++;
      game.scene.start("midgame_one");
    }
  }
}

function continueGame() {
  removeAllBoxes();

  boxShippedCount = 0;
  boxCount += 11;
  boxCountRequired = Math.floor(boxCount * 0.8);

  updateShippedBoxCount();
  readyCount = 0;
  readyArray.unshift("");
  if (levelCount < 4 && levelCount % 2 === 0) {
    intialTime += 15;
  }

  timerCount = intialTime;
  timerNumber.setText(formatTime(timerCount));
  if (readyTimer !== undefined) {
    readyTimer = thatTimer.time.addEvent({
      delay: 1000,
      duration: 1000,
      callback: createReadyText,
      callbackScope: this,

      repeat: 3,
    });
  }
}
