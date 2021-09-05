var dialogue = [
  [""],
  [
    ["Oh wow, you did it... "],
    ["Do you really think"],
    ["you are done?"],
    ["The work at"],
    ["Aavezon"],
    ["waits for no one!!"],
  ],
  [
    ["Not too bad."],
    ["But lets see"],
    ["how you do with"],
    ["the heavy stuff."],
    ["Takes 2 to carry,"],
    ["good thing we don't"],
    ["have a back bone."],
  ],
  [
    ["I guess you're getting better"],
    ["Oh hei fren, if you"],
    ["see any boxes for those"],
    ["Lickquidators, kick that"],
    ["licker to the dumpster."],
    ["I don't know keeps"],
    ["ordering those..."],
  ],
  [
    ["You are doing pretty good."],
    ["But not the best in the"],
    ["Citaadel, that's me!"],
  ],
  [["Gotem! I mean Gotchim!"]],

  [["I got nothing else to say.."], ["It was only five days!"]],
];

var midNarrator;
var nextButton;
let firstRow = [];
let midRow = [];
let backRow;
let midgameThat;
var narText;

function setupButton(btnArry) {
  for (var i = 0; i < btnArry.length; ++i) {
    let btn = btnArry[i];

    btn.setStroke("#fff", 16);
    btn.setShadow(2, 2, "#333333", 2, true, true);
    btn.setDepth(3);
  }
}

function removeBackground() {
  let bkArray = [[backRow], midRow, firstRow];

  for (var i = 0; i < bkArray.length; ++i) {
    midgameThat.tweens.add({
      targets: bkArray[i],
      height: 0,
      delay: 500 + i * 100,
      y: 900,

      ease: "Power2",

      repeat: 0,
    });
  }

  midgameThat.tweens.add(
    {
      targets: [nextButton, narText],
      delay: 500,
      alpha: 0,
      duration: 1000,
      ease: "Power2",
    },
    this
  );

  midgameThat.tweens.add({
    targets: midNarrator,
    y: 1000,
    delay: 500,
    duration: 1000,
    ease: "Power2",
    repeat: 0,
    //onComplete: restartGame,
  });

  continueGame();
}
///
function setupButton(btnArry) {
  for (var i = 0; i < btnArry.length; ++i) {
    let btn = btnArry[i];

    btn.setStroke("#fff", 16);
    btn.setShadow(2, 2, "#333333", 2, true, true);
    btn.setDepth(3);
  }
}
class Midgame_one extends Phaser.Scene {
  constructor() {
    super({ key: "midgame_one", active: false });
  }

  async preload() {
    this.load.image("narrator", "assets/level/Narrator.png");
  }

  async create() {
    //play success sound
    let txtN = dialogue[levelCount];
    if (txtN === undefined) {
      dialogue[dialogue.length];
    }
    narText = this.add.text(30, 50, txtN, {
      font: "32px Arial Black",
      fill: "#fff",
    });
    narText.alpha = 0;
    narText.setStroke("#693fba", 10);
    narText.setShadow(2, 2, "#333333", 2, true, true);
    narText.setDepth(3);
    soundEffectsArray[2].play();
    midgameThat = this;
    nextButton = this.add.text(30, 400, "Next", {
      font: "70px Arial Black",
      fill: "0x693fba",
    });
    nextButton.setAlpha(0);
    let buttons = [nextButton];
    setupButton(buttons);
    this.tweens.add(
      {
        targets: [nextButton, narText],
        delay: 500,
        alpha: 1,
        duration: 1000,
        ease: "Power2",
      },
      this
    );

    nextButton.setInteractive().on("pointerdown", () => {
      removeBackground();
    });

    nextButton.setInteractive().on("pointerover", () => {
      nextButton.setColor("#693fba");
    });

    nextButton.setInteractive().on("pointerout", () => {
      nextButton.setColor("#fff");
    });

    backRow = this.add.isobox(300, 800, 800, 0, 0xb5754d, 0xb5754d, 0xb5754d);
    this.tweens.add({
      targets: backRow,
      height: 800,
      delay: 1000,
      ease: "Power2",

      repeat: 0,
    });

    let row = 0;
    while (row < 3) {
      for (var i = 0; i < 6; ++i) {
        let isobox = this.add.isobox(
          i * 150,
          800 - row * 100,
          50 + ranNumb(50, 100),
          0,
          0xb5754d,
          0xd68c60,
          0xeaba69
        );
        midRow.push(isobox);
      }
      this.tweens.add({
        delay: 500,
        targets: midRow,
        height: 600,
        ease: "Power2",

        repeat: 0,
      });
      row++;
    }

    row = 0;

    while (row < 3) {
      for (var i = 0; i < 20; ++i) {
        let isobox = this.add.isobox(
          i * 50,
          800 - row * 100,
          100 + ranNumb(50, 100),
          0,
          0x693fba,
          0xdcacfb,
          0xdcacfb
        );
        firstRow.push(isobox);
      }
      this.tweens.add({
        targets: firstRow,
        height: 100,
        delay: 500,
        ease: "Power2",

        repeat: 0,
      });
      row++;
    }

    midNarrator = this.add.image(650, 1000, "narrator");
    midNarrator.rotation -= 0.2;

    this.tweens.add({
      targets: midNarrator,
      y: 400,
      duration: 1000,
      ease: "Power2",
      repeat: 0,
      delay: 1500,
    });
  }

  update() {}
}
