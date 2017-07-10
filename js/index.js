"use strict";

var generatedPattern = [];
var playerPattern = [];
var patternLength = 1;
var redRef = 1;
var greenRef = 2;
var blueRef = 3;
var yellowRef = 4;
var colors = [{
  audio: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"), // this also caches the audio file, more on that later
  element: $("#1"),
  animateClass: "animateRed"
}, {
  audio: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  element: $("#2"),
  animateClass: "animateGreen"
}, {
  audio: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  element: $("#3"),
  animateClass: "animateBlue"
}, {
  audio: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
  element: $("#4"),
  animateClass: "animateYellow"
}];

function generateNextPatternValue() {

  if (patternLength == 20) {
    gameReset();
  } else {
    var next = getRandomNum(1, 4);
    if (next === generatedPattern[generatedPattern.length - 1]) next = getNextIndex(4, next);
    generatedPattern.push(next);
    animateGeneratedPattern();
  }
}

function getNextIndex(arrayLength, lastIndex) {
  var nextIndex = lastIndex + getRandomNum(1, arrayLength - 1);
  return nextIndex % 4;
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animateColor(color) {
  // your lightup boolean controls the sound?
  color.audio.play();
  color.element.toggleClass(color.animateClass);
}

function stopAnimation(color) {
  color.element.toggleClass(color.animateClass);
}

function animateGeneratedPattern() {

  //alert(generatedPattern);
  var i = 0;
  function animateNextPattern(lightup) {

    if (!generatedPattern || generatedPattern.length === i) {
      return;
    }

    if (lightup) {
      // Long delay before turning light off
      animateColor(colors[generatedPattern[i] - 1]);
      setTimeout(function () {
        stopAnimation(colors[generatedPattern[i] - 1]);
        animateNextPattern(false);
      }, 1000);
    } else {
      // Small delay before turning on next light

      i++;
      animateNextPattern(true);
    }
  }
  animateNextPattern(true);
}

function gameReset() {

  if (patternLength == 20) alert("You Have Won");
  document.getElementById("start").disabled = false;
  playerPattern = [];
  generatedPattern = [];
  patternLength = 1;
  updateLength();
  restoreColors();
}

function restoreColors() {

  $("#1").removeClass("animateRed");
  $("#2").removeClass("animateGreen");
  $("#3").removeClass("animateBlue");
  $("#4").removeClass("animateYellow");
}

function updateLength() {

  $("#length").empty();
  var txtNode = document.createTextNode(patternLength);
  document.getElementById("length").appendChild(txtNode);
}

function animateScreen(turnOn) {

  if (turnOn) {
    var audio = new Audio("http://www.sounds.beachware.com/2illionzayp3may/illwavul/CLNKBEEP.mp3");
    audio.play();
  }
  $("body").toggleClass("wrongSeries");
}

function wrongChoice() {

  animateScreen(true);
  setTimeout(function () {
    animateScreen(false);
  }, 100);
}

function unbind() {
  colors.forEach(function (color) {
    color.element.unbind("click");
  });
}

function bind() {
  colors.forEach(function (color, index) {
    color.element.bind("click", function () {
      if (document.getElementById("start").disabled) {
        playerPattern.push(index + 1);

        if (checkSeries()) {
          animateColor(color);
          setTimeout(function () {
            stopAnimation(color);
          }, 500);
        }
      }
    });
  });
}

function checkSeries() {

  //alert(playerPattern[playerPattern.length - 1]);
  //alert(generatedPattern[playerPattern.length - 1]);
  if (playerPattern[playerPattern.length - 1] !== generatedPattern[playerPattern.length - 1]) {
    if (document.getElementById("strict").checked) {
      wrongChoice();
      gameReset();
      document.getElementById("start").disabled = true;
      setTimeout(generateNextPatternValue, 1000);
    } else {
      unbind();
      wrongChoice();
      playerPattern = [];
      setTimeout(animateGeneratedPattern, 1000);
      setTimeout(bind, 1500 * patternLength);
    }
    return false;
  } else if (playerPattern.length == patternLength) {
    unbind();
    patternLength++;
    updateLength();
    playerPattern = [];
    setTimeout(generateNextPatternValue, 1000);
    setTimeout(bind, 1500 * patternLength);
    return true;
  }

  return true;
}

window.addEventListener("load", updateLength);
window.addEventListener("load", bind);

$("#start").on("click", function () {

  document.getElementById("start").disabled = true;
  generateNextPatternValue();
});

$("#reset").on("click", gameReset);