var game;
var cam;
var allPlayersData = {};
var userCreatedSVG;
var competitors = {};
var saveCounter = 0;
var layer;

var box;

var dumpster;
var addedMoreBoxes = false;
var setup = false;
var boxCount = 10;
var maxBoxOnScreen = 400; //absolute max
var boxCountRequired = 8;
var boxShippedCount = 0;
var boxShippedTotal = 0;
var goal;
var timer = 0;
var textCounter = 0;
var timerCount = 60;
var intialTimerCount = 60;
var timertitle;
var timerNumber;
var timedEvent;
var intialTime = 60;
var text;
var boxGameActive = false;
var gameoverTitle;
var leaderBoardInfo;
var overAllGameActive = true;
var playSound = false;
var levelCount = 0;
function ranNumb(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

var soundEffectsArray;
