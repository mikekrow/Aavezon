//Aavegotchi-Gaame-Jaam-1
async function loadSVGImages(obj, scn) {
  let newData = [];
  let counter = 0;
  for (var i in obj) {
    if (obj[i] !== undefined) {
      let pObj = obj[i];

      const svgBlob = new Blob([pObj.svg], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      /////////////////////
      let id = "A" + counter;
      let imageRef = i;

      scn.load.image(imageRef, url);

      await scn.load.on(
        "complete",
        function () {
          let p = scn.physics.add
            .sprite(1000, 1000, imageRef)
            .setScale(0.5)
            .refreshBody();
          p.player = pObj.player;
          p.boxTotal = pObj.boxTotal;
          newData.push(p);
        },
        scn
      );
      counter++;
    }
  }

  return newData;
}

async function getAllPlayersData() {
  let newData = {};
  let user = Moralis.User.current();
  const PlayerStats = Moralis.Object.extend("PlayerStats");
  const query = new Moralis.Query(PlayerStats);

  const results = await query.find();
  for (let i = 0; i < results.length; i++) {
    const object = results[i];

    newData[object.get("player")] = {};
    newData[object.get("player")].svg = object.get("imageSVG");
    newData[object.get("player")].x = object.get("x");
    newData[object.get("player")].y = object.get("y");
    newData[object.get("player")].id = object.id;
  }
  return newData;
}
async function savePlayerStats(playersObj) {
  let user = Moralis.User.current();
  const PlayerStats = Moralis.Object.extend("PlayerStats");
  const playerStats = new PlayerStats();

  playerStats.set("player", user.get("ethAddress"));
  playerStats.set("x", parseFloat(playersObj.x));
  playerStats.set("y", parseFloat(playersObj.y));
  playerStats.set("imageSVG", playersObj.svg);

  await playerStats.save().then(
    (playerStats) => {
      // Execute any logic that should take place after the object is saved.
      console.log("New object created with objectId: " + playerStats.id);
    },
    (error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Moralis.Error with an error code and message.
      alert("Failed to create new object, with error code: " + error.message);
    }
  );
}

async function updatePlayerStats(playerObj) {
  let user = Moralis.User.current();
  const PlayerStats = Moralis.Object.extend("PlayerStats");
  const query = new Moralis.Query(PlayerStats);
  // console.log(user.get("ethAddress"));
  // console.log(playerObj.id);

  query.get(playerObj.id).then(
    (playerstats) => {
      console.log(playerstats);
      // The object was retrieved successfully.

      playerstats.save().then((playerstats) => {
        // Now let's update it with some new data. In this case, only cheatMode and score
        // will get sent to the cloud. playerName hasn't changed.
        playerstats.set("x", playerObj.x);
        playerstats.set("y", playerObj.y);
        playerstats.set("imageSVG", playerObj.svg);
        if (playerstats.get("boxTotal") < boxShippedCount) {
          playerstats.set("boxTotal", boxShippedCount);
        }
        console.log("save successsfull");
        return playerstats.save();
      });
    },
    (error) => {
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
    }
  );
}

async function updateOtherPlayerPosition(cmp) {
  let user = Moralis.User.current();
  let query = new Moralis.Query("PlayerStats");
  let subscription = await query.subscribe();

  subscription.on("update", (plocation) => {
    //  console.log("got to update");

    if (plocation.get("player") != user.get("ethAddress")) {
      //  } else {
      cmp[plocation.get("player")].x = plocation.get("x");
      cmp[plocation.get("player")].y = plocation.get("y");
      // }
    }
  });
}
async function savePlayerPosition(player, playerObj) {
  if (player.lastX != player.x || player.lastY != player.y) {
    let user = Moralis.User.current();

    const PlayerStats = Moralis.Object.extend("PlayerStats");
    const query = new Moralis.Query(PlayerStats);

    query.get(playerObj.id).then(
      (playerstats) => {
        // The object was retrieved successfully.

        playerstats.save().then((playerstats) => {
          // Now let's update it with some new data. In this case, only cheatMode and score
          // will get sent to the cloud. playerName hasn't changed.
          playerstats.set("x", player.x);
          playerstats.set("y", player.y);
          return playerstats.save();
        });
      },
      (error) => {
        // The object was not retrieved successfully.
        // error is a Moralis.Error with an error code and message.
      }
    );
  }
}

async function updateLeaderBoard() {
  let user = Moralis.User.current();
  const PlayerStats = Moralis.Object.extend("PlayerStats");
  const query = new Moralis.Query(PlayerStats);
  // console.log(user.get("ethAddress"));
  // console.log(playerObj.id);
  let playerObj = allPlayersData[user.get("ethAddress")];
  let playerId = allPlayersData[user.get("ethAddress")].id;
  console.log(playerId);

  query.get(playerId).then(
    (playerstats) => {
      console.log(playerstats);
      // The object was retrieved successfully.

      playerstats.save().then((playerstats) => {
        // Now let's update it with some new data. In this case, only cheatMode and score
        // will get sent to the cloud. playerName hasn't changed.
        playerstats.set("x", playerObj.x);
        playerstats.set("y", playerObj.y);
        playerstats.set("imageSVG", playerObj.svg);

        if (playerstats.get("boxTotal") < boxShippedCount) {
          playerstats.set("boxTotal", boxShippedCount);
          console.log("updated Boxtotal");
        }
        console.log("save successsfull");
        return playerstats.save();
      });
    },
    (error) => {
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
    }
  );
}
async function getLeaderBoard() {
  let newData = {};
  let user = Moralis.User.current();
  const PlayerStats = Moralis.Object.extend("PlayerStats");
  const query = new Moralis.Query(PlayerStats);

  const results = await query.find();

  for (let i = 0; i < results.length; i++) {
    const object = results[i];

    newData[object.get("player")] = {};
    newData[object.get("player")].svg = object.get("imageSVG");
    newData[object.get("player")].player = object.get("player");
    newData[object.get("player")].x = object.get("x");
    newData[object.get("player")].y = object.get("y");
    newData[object.get("player")].id = object.id;
    newData[object.get("player")].boxTotal = object.get("boxTotal");
  }

  return newData;
}
