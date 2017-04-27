console.log("Ready to Detect Speech Input");

// setup slider with speech commands

$().ready(function(){

  var speechCommands = "<h3>Speech Commands</h2>" + "<h4>Navigation</h4><p>Next Stitch</p><p>Next Row</p>" + "<h4>Help</h4><p>What is this stitch/row?</p>";

  $("#app-body").append('<div id="sidebar"><div id="toggle-div"></div><div id="info" >'+speechCommands+'</div></div>');
  $("#toggle-div").append("<br><button id='toggle-info' type='button' class='btn'><i class='fa fa-cog fa-lg' aria-hidden='true'></i></button>");
  $("#info").append("<button id='mic-off' type='button' class='btn'>Turn Off Voice Recognition</button>");
  $("#info").hide();
  $("#toggle-info").click(function () {
  		if ($(this).data('name') == 'show') {
          $("#sidebar").animate({
            width: '8%'
          });
  		    $("#info").animate({
  		        width: '0%'  		    }).hide();
  		    $("#pattern-container").animate({
  		        width: '90%'
  		    });
  		    $(this).data('name', 'hide');
  		 } else {
            $("#sidebar").animate({
              width: '23%'
            });
  		     $("#info").animate({
  		         width: '80%'  		     }).show();
  		     $("#pattern-container").animate({
  		        width: '75%'
  		     });
  		     $(this).data('name', 'show');
  		 }
  });
});



var keyWords = {
  stitch: ["stitch", "ditch", "forward", "step", "state", "stick"],
  row: ["row", "roll", "room", "down", "route"],
  move: ["next", "advance", "move", "go"],
  help: ["help", "what", "how"]
};

// processSpeech(transcript)
//  Is called anytime speech is recognized by the Web Speech API
// Input:
//    transcript, a string of possibly multiple words that were recognized
var processSpeech = function(transcript) {

  console.log("I heard...");
  console.log(transcript);

  lastSaid = "Welcome to Pearl Pal";

  // Helper function to detect if any commands appear in a string
  var userSaid = function(str, commands) {
    str = str.toLowerCase();
    for (var i = 0; i < commands.length; i++) {
      var testWord = commands[i].toLowerCase();
      if (str.indexOf(testWord) > -1)
        return true;
    }
    return false;
  };

  // don't worry about detection before pattern is ready
  if (!patternLoaded) {
    return false;
  }

  // Pattern Navigation
  if (userSaid(transcript, keyWords.move)) {
    if (userSaid(transcript, keyWords.stitch)) {
      console.log("User wants to advance to next stitch");
      advanceStitch();
      return true;
    }
    if (userSaid(transcript, keyWords.row)) {
      console.log("User wants to advance to next row");
      advanceRow();
      return true;
    }
  }

  if (userSaid(transcript, ["what"])) {
    var info = helpStitch().split(".")[0];
    console.log(info);
    lastSaid = info;
    generateSpeech(info);
    return true;
  }

  if (userSaid(transcript, ["how"])) {
    var info = helpStitch().split(".").slice(1).join(".");
    console.log(info);
    lastSaid = info;
    generateSpeech(info);
    return true;
  }

  // Assistance
  if (userSaid(transcript, keyWords.help)) {
    if (userSaid(transcript, keyWords.stitch)) {
      var info = helpStitch();
      console.log(info);
      lastSaid = info;
      generateSpeech(info);
      return true;
    }
    if (userSaid(transcript, keyWords.row)) {
      console.log("User wants help on this row");
      var info = helpRow();
      console.log(info);
      lastSaid = info;
      generateSpeech(info);
      return true;
    }
  }

  // Tracking
  if (userSaid(transcript, ["pause", "paws", "stop"])) {
    toggleTracking();
    return true;
  }
  if (userSaid(transcript, ["start", "resume"])) {
    toggleTracking();
    return true;
  }
  if (userSaid(transcript, ['calibrate', 'recalibrate'])) {
    recalibrate();
    return true;
  }
  if (userSaid(transcript, ['reset'])) {
    selectId("stitch-0-0");
  }
  if (userSaid(transcript, ["repeat"])) {
    generateSpeech(lastSaid);
  }

  // Politeness
  if (userSaid(transcript, ['thank', 'thanks', 'pal'])) {
    lastSaid = "You're welcome, Laura";
    generateSpeech(lastSaid);
  }

  return false; // no action taken
};

var voicesReady = false;
window.speechSynthesis.onvoiceschanged = function() {
  voicesReady = true;
};

var generateSpeech = function(message, callback) {
  var VOICEINDEX = 49; // google british female
  if (voicesReady) {
    var msg = new SpeechSynthesisUtterance();
    msg.voice = window.speechSynthesis.getVoices()[VOICEINDEX];
    msg.text = message;
    msg.rate = 1.0;
    if (typeof callback !== "undefined")
      msg.onend = callback;
    speechSynthesis.speak(msg);
  }
};
