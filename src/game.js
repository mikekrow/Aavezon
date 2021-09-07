var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "gameContainer",
  zoom: 1,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: [
    {
      preload: preload,
      create: create,
      update: update,
    },
    GameGUI,
    Title_One,
    Restart_Gui,
    Midgame_one,
  ],
  audio: {
    disableWebAudio: true,
  },
};

function hideLoginScreen() {
  let loginBtn = document.getElementById("buttonContainerLogin");
  loginBtn.style.display = "none";
  let logotoutBtn = document.getElementById("buttonContainerLogout");
  logotoutBtn.style.display = "block";
  let aLogo = document.getElementById("aavezonLogo");
  aLogo.style.opacity = 0;
  aLogo.style.height = "0%";

  let slCon = document.getElementById("selectionContainer");

  slCon.style.opacity = 1;
  slCon.style.height = "auto";
  slCon.style.display = "block";
}
function showLoginScreen() {
  let logotoutBtn = document.getElementById("buttonContainerLogout");
  logotoutBtn.style.display = "none";
  let loginBtn = document.getElementById("buttonContainerLogin");
  loginBtn.style.display = "block";
  let aLogo = document.getElementById("aavezonLogo");
  aLogo.style.opacity = 1;
  aLogo.style.height = "auto";

  let slCon = document.getElementById("selectionContainer");

  slCon.style.opacity = 0;
  slCon.style.height = "0%";
  slCon.style.display = "none";
}
async function launch() {
  //just show game
  hideLoginScreen();
}
async function startGame() {
  let user = Moralis.User.current();
  allPlayersData = await getAllPlayersData();
  console.log(user.get("ethAddress") + " " + "logged in");
  if (allPlayersData[user.get("ethAddress")] == undefined) {
    let obj = {};
    obj[user.get("ethAddress")] = {};
    obj[user.get("ethAddress")].svg = userCreatedSVG;
    obj[user.get("ethAddress")].x = 100;
    obj[user.get("ethAddress")].y = 100;
    await savePlayerStats(obj[user.get("ethAddress")]);
  } else {
    allPlayersData[user.get("ethAddress")].svg = userCreatedSVG;
    await updatePlayerStats(allPlayersData[user.get("ethAddress")]);
  }
  let logotoutBtn = document.getElementById("buttonContainerLogout");
  logotoutBtn.style.display = "none";
  let slCon = document.getElementById("selectionContainer");

  slCon.style.opacity = 0;
  slCon.style.height = "0%";
  slCon.style.display = "none";

  game = new Phaser.Game(config);
}

async function preload() {
  cam = this.cameras.main;
  that = this;
  let user = Moralis.User.current();
  let counter = 0;

  for (var i in allPlayersData) {
    if (allPlayersData[i] !== undefined) {
      let pObj = allPlayersData[i];
      const svgBlob = new Blob([pObj.svg], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      /////////////////////
      let id = i;
      let imageRef = i;

      this.load.image(imageRef, url);

      await this.load.on(
        "complete",
        function () {
          if (id === user.get("ethAddress")) {
            competitors[id] = that.physics.add
              .sprite(pObj.x, pObj.y, imageRef)

              .setScale(0.5)
              .refreshBody();

            competitors[id].setDamping(true);
            competitors[id].setDrag(150);
            competitors[id].setMaxVelocity(300);
            competitors[id].setDepth(1);
            competitors[id].body.offset.y = competitors[id].body.height / 2;
            competitors[id].body.height = competitors[id].body.height / 3;
            competitors[id].body.width = competitors[id].body.width / 2;
            competitors[id].body.offset.y = 95;
            competitors[id].body.offset.x = competitors[id].body.width;
            //sprite.setScale(2);
            //  competitors[id].setBounce(1);
            //

            cam.startFollow(competitors[id], true);
          }
        },
        this
      );
    }

    counter++;
  }

  //this.load.image("background", "assets/tile-set.png");

  this.load.image("box", "assets/boxes/box.png");
  this.load.image("box_alpha", "assets/boxes/box_alpha.png");
  this.load.image("box_fomo", "assets/boxes/box_fomo.png");
  this.load.image("box_fud", "assets/boxes/box_fud.png");
  this.load.image("box_kek", "assets/boxes/box_kek.png");
  this.load.image("box_med_double", "assets/boxes/box_med_double.png");
  this.load.image("box_tall_double", "assets/boxes/box_tall_double.png");
  this.load.image("box_tall_single", "assets/boxes/box_tall_single.png");
  this.load.image(
    "box_tall_single_lick_1",
    "assets/boxes/box_tall_single_lick_1.png"
  );
  this.load.image(
    "box_tall_single_lick_2",
    "assets/boxes/box_tall_single_lick_2.png"
  );

  this.load.image("farground", "assets/level/background.png");
  this.load.image("background", "assets/level/tile-set-new.png");
  this.load.image("dumpster", "assets/level/dumpster.png");
  this.load.spritesheet("portal", "assets/level/portal-spritesheet.png", {
    frameWidth: 924,
    frameHeight: 878,
  });

  //this.load.start();
}
async function create() {
  ///////////////
  texticles = this.add.group();
  box = this.add.group();

  this.add.image(0, 0, "farground").setDepth(-1).setScale(5);
  // When loading from an array, make sure to specify the tileWidth and tileHeight
  var map = this.make.tilemap({ data: level, tileWidth: 48, tileHeight: 48 });
  var tiles = map.addTilesetImage("background");
  layer = map.createDynamicLayer(0, tiles, 0, 0);
  // layer.setTileLocationCallback(2, 8, 48, 48, addscore);

  map.setCollision(0);

  /////////////////////////////////

  let user = Moralis.User.current();

  // Animation set
  this.anims.create({
    key: "rest",
    frames: this.anims.generateFrameNumbers("portal", {
      frames: [0, 1, 2, 3, 4],
    }),
    frameRate: 8,
    repeat: -1,
  });

  goal = this.physics.add
    .sprite(430, -48 - 48 / 2, "portal")
    .setScale(0.3)
    .play("rest");
  dumpster = this.physics.add.sprite(
    -48 - 48 / 2,
    layer.height - 48 * 3,
    "dumpster"
  );
  goal.setMaxVelocity(0);
  dumpster.setMaxVelocity(0);

  //////////////////

  cursors = this.input.keyboard.createCursorKeys();
  layer.setDepth(-1);
}
async function update() {
  let user = Moralis.User.current();
  let player = competitors[user.get("ethAddress")];
  if (!player) return;

  if (overAllGameActive) {
    if (!setup) {
      setup = true;
      player.player = true;
      this.physics.add.collider(player, layer);

      this.physics.add.collider(player, competitors);
      this.physics.add.collider(player, goal);
      this.physics.add.collider(player, dumpster);
      this.physics.add.collider(player, box, moveDepthUpPlayer);

      competitors[user.get("ethAddress")].movementRate = 400;
      competitors[user.get("ethAddress")].setMaxVelocity(400);
      console.log(competitors[user.get("ethAddress")]);
    }

    player.depth = player.y + player.height / 4;

    updateMovement(cursors, competitors[user.get("ethAddress")]);

    saveCounter++;
    if (saveCounter > 120) {
      // console.log(competitors);
      await savePlayerPosition(
        competitors[user.get("ethAddress")],
        allPlayersData[user.get("ethAddress")]
      );
      // console.log("got here");
      saveCounter = 0;
    }
    if (box !== undefined && boxGameActive !== undefined) {
      if (!boxGameActive) {
        boxDrop(player, box);
      }
    }
  }
}
function moveDepthUpPlayer(ply, bx) {
  ply.depth = ply.y + ply.height / 4;

  bx.depth = bx.y + bx.height / 2;
}
