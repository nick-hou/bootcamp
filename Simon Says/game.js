var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var gameInProgress = 0;
var level = 0;
var highScore = 0;


$(".btn").click(function() {
  var userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);
  playSound(userChosenColor);
  animatePress(userChosenColor);
  if(!checkAnswer()) {
    endGame();
  }
  else if(userClickedPattern.length == level) {
    setTimeout(function() {
      {
        userClickedPattern = [];
        nextSequence();
      }
    }, 1000);
  }
});

function nextSequence() {
  level += 1;
  $("h1").text("Level " + level);
  var randomNumber = Math.floor(4*Math.random());
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  animatePress(randomChosenColor);
  playSound(randomChosenColor);
}

function playSound(name) {
    var buttonSound = new Audio("sounds/" + name + ".mp3")
    buttonSound.play();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 200);
}

function checkAnswer() {
  currClick = userClickedPattern.length - 1;
  return(userClickedPattern[currClick] == gamePattern[currClick]);
}

function startOver() {
  gamePattern = [];
  userClickedPattern = [];
  gameInProgress = 0;
  level = 0;
}

function endGame() {
  playSound("wrong");
  $("body").addClass("game-over");
  setTimeout(function() {
    $("body").removeClass("game-over");
  }, 100);
  $("h1").text("Game Over, Press Any Key to Restart");
  highScore = Math.max(highScore, level-1);
  startOver();
  $("#high-score").text("Your highest score: " + highScore);
}

$(document).keypress(function(event) {
  if(!gameInProgress) {
    gameInProgress = 1;
    setTimeout(function() {
      nextSequence()
    }, 500);
    $("h1").text("Level 1");
  }
});
