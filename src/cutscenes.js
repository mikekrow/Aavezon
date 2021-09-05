let gotchiText_1;
var moveUpActivated = false;
var isoBox;
var isoBox2;
var isoBox3;
var isoBox4;
var cutsceneThis;
var narrator1;
var narrator1Tween;
var buttonTextTween;
var narTextRestart;
var leaderBoardEntries = [];
var resetDialogue = [
  [["Dont worry. I hear"], ["Aarby'z is hiring."]],
  [["This is Competitive"], ["Box PUSHIN!!"], ["Get CReSHED!!"]],
  [["These boxes are really"], ["starting to look like"], ["Captain Crunch."]],
  [["This box pushing,"], ["is really giving you"], ["a licking."]],
];
var leaderBoardGroup;
var restartButton;
var highscores = [];

function moveupText(t) {
  t.y -= 1;
}

function showEverything() {
  moveUpActivated = true;
}

function createButtons() {
  game.scene.start("restart_gui");
  game.scene.stop("game_gui");
}
class Title_One extends Phaser.Scene {
  constructor() {
    super({ key: "title_one", active: false });
  }

  async preload() {
    cutsceneThis = this;
    this.load.image("narrator", "assets/level/Narrator.png");

    leaderBoardInfo = await getLeaderBoard();
    leaderBoardGroup = await loadSVGImages(leaderBoardInfo, this);

    this.load.start();
  }

  async create() {
    isoBox4 = this.add.isobox(800, 900, 500, 10, 0xb5754d, 0xd68c60, 0xeaba69);
    isoBox3 = this.add.isobox(500, 1000, 500, 10, 0xb5754d, 0xd68c60, 0xeaba69);
    isoBox2 = this.add.isobox(200, 950, 400, 10, 0xb5754d, 0xd68c60, 0xeaba69);
    isoBox = this.add.isobox(150, 1200, 200, 10, 0xb5754d, 0xd68c60, 0xeaba69);

    /* leaderBoardImage = this.add.isobox(
      150,
      700,
      450,
      600,
      0x00b9f2,
      0x016fce,
      0x028fdf
    ); */

    this.tweens.add({
      targets: [isoBox, isoBox2, isoBox3, isoBox4],
      height: 1000,
      ease: "Power2",
      delay: 1000,
      repeat: 0,
      onComplete: createButtons,
    });
    gotchiText_1 = this.add.text(60, 1100, "Top Box Pushers!", {
      font: "30px Arial Black",
      fill: "#fff",
    });
    // gotchiText_1 = this.add.text(32, 700, "Ill show you to the door.");
    gotchiText_1.setStroke("#00f", 16);
    gotchiText_1.setShadow(2, 2, "#333333", 2, true, true);

    var textTimer = this.time.addEvent({
      delay: 1500,
      callback: showEverything,
      callbackScope: this,
      loop: this,
    });

    narrator1 = this.add.image(650, 1000, "narrator");
    narrator1.rotation -= 0.2;

    narrator1Tween = this.tweens.add({
      targets: narrator1,
      y: 400,
      duration: 1000,
      ease: "Power2",
      repeat: 0,
      delay: 1500,
    });

    //add the info
  }

  update() {
    if (leaderBoardGroup !== undefined) {
      var arr = [
        { name: "ashley", boxTotal: 5 },
        { name: "jason", boxTotal: 9 },
        { name: "ben", boxTotal: 1 },
        { name: "jordan", boxTotal: 4 },
      ];

      leaderBoardGroup.sort(function (a, b) {
        return b.boxTotal - a.boxTotal;
      });

      for (var i = 0; i < leaderBoardGroup.length; ++i) {
        let obj = leaderBoardGroup[i];

        if (obj.x !== 100) {
          obj.y = 800 + i * 100;
          obj.x = 100;

          let address = obj.player;

          let score = leaderBoardInfo[address].boxTotal;

          let scoreText = this.add.text(10, 5, score, {
            font: "45px Arial Black",
            fill: "#fff",
          });
          scoreText.setStroke("#00f", 16);
          scoreText.setShadow(2, 2, "#333333", 2, true, true);
          scoreText.y = 1000 + i * 100;
          scoreText.x = 300;

          highscores.push(scoreText);
        } else {
          obj.y -= 1;
          let scoreObj = highscores[i];
          scoreObj.y = obj.y - scoreObj.height / 2;
        }
      }
      //gotchiText_1.y = leaderBoardGroup[0].y - 50;
      if (leaderBoardGroup[0] !== undefined) {
        gotchiText_1.y = leaderBoardGroup[0].y - 100;
      }
    }
  }
}

class Restart_Gui extends Phaser.Scene {
  constructor() {
    super({ key: "restart_gui", active: false });
  }

  preload() {}

  create() {
    let ran = ranNumb(0, resetDialogue.length);
    narTextRestart = this.add.text(30, 50, resetDialogue[ran], {
      font: "32px Arial Black",
      fill: "#fff",
    });
    narTextRestart.alpha = 0;
    narTextRestart.setStroke("#693fba", 10);
    narTextRestart.setShadow(2, 2, "#333333", 2, true, true);
    narTextRestart.setDepth(3);
    restartButton = this.add.text(50, 400, "Restart", {
      font: "70px Arial Black",
      fill: "#fff",
    });
    restartButton.setDepth(3);

    restartButton.setInteractive().on("pointerdown", () => {
      game.scene.start("game_gui");
      removeAllGui();
    });

    restartButton.setStroke("#fff", 16);
    restartButton.setShadow(2, 2, "#333333", 2, true, true);

    restartButton.setInteractive().on("pointerover", () => {
      restartButton.setColor("#693fba");
    });

    restartButton.setInteractive().on("pointerout", () => {
      restartButton.setColor("#fff");
    });

    restartButton.setStroke("#fff", 16);
    restartButton.setShadow(2, 2, "#333333", 2, true, true);

    restartButton.alpha = 0;

    buttonTextTween = this.tweens.add({
      targets: [restartButton, narTextRestart],
      alpha: 1,
      onComplete: hideResetText,
      duration: 1000,
    });
  }

  update() {}
}

function hideResetText() {
  cutsceneThis.tweens.add({
    targets: [narTextRestart],
    alpha: 0,

    delay: 4500,
    duration: 1000,
  });
}
function restartGame() {
  //game.scene.start("default")
  gotchiText_1.destroy(true);
  for (var i in highscores) {
    highscores[i].destroy(true);
    highscores.splice(i, 0);
  }
  highscores = [];
  for (var p = 0; p < leaderBoardGroup.length; p++) {
    leaderBoardGroup[p].destroy(true);
    leaderBoardGroup.splice(i, 0);
    //that.physics.add.overlap(layer, box, remove);
  }
  leaderBoardGroup = [];

  removeAllBoxes();
  narrator1Tween.stop();
  timerCount = intialTimerCount;
  boxCount = 10;
  levelCount = 1;
  boxCountRequired = 8;
  boxShippedCount = 0;
  updateShippedBoxCount();
  timerNumber.setText(formatTime(timerCount));
}
function removeAllGui() {
  restartGame();
  buttonTextTween.stop();
  cutsceneThis.tweens.add({
    targets: [isoBox, isoBox2, isoBox3, isoBox4],
    height: 0,
    ease: "Power2",

    repeat: 0,
    //  onComplete: createButtons,
  });

  cutsceneThis.tweens.add({
    targets: narrator1,
    y: 1000,
    duration: 1000,
    ease: "Power2",
    repeat: 0,
    //onComplete: restartGame,
  });

  cutsceneThis.tweens.add({
    targets: [restartButton, narTextRestart],
    alpha: 0,

    duration: 250,
  });
}
