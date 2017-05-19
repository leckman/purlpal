console.log("Ready to Detect Speech Input");

// setup slider with speech commands

$().ready(function(){

  var speechCommands = "<h4>Speech Commands</h4>" + "<p>Next Stitch<br>Next Row<br>What is this stitch/row?</p>";

  // add sidebar
  $("#app-body").append('<div id="sidebar"><div id="toggle-div"></div><div id="info" >'+speechCommands+'</div></div>');
  $("#info").append(getKey([]));
  $("#toggle-div").append("<br><button id='toggle-info' type='button' class='btn'><i class='fa fa-cog fa-lg' aria-hidden='true'></i></button>");
  $("#info").append("<button id='toggle-leap' type='button' class='btn'>Turn Off Motion Recognition</button>");
  $("#toggle-leap").click(toggleTracking);
  $("#info").append("<button id='calibrate-leap' type='button' class='btn'>Re-Calibrate Leap Motion</button>");
  $("#calibrate-leap").click(recalibrate);
  $("#info").append("<button id='mic-off' type='button' class='btn'>Turn Off Voice Recognition</button>");
  $("#info").append("<button id='switch-pat' type='button' class='btn'>View Written Pattern</button>");
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

  $("#switch-pat").click(function(){
    var but = $(this);
    if (but.html() == "View Written Pattern") {
      written(); // switch to written pattern
      but.html("View Chart");

      // set up doubleclick functionality on written pattern
      $(".rw").dblclick(function(){
        selectRow(this);
      });
    } else {
      chart(); // switch to charted pattern
      but.html("View Written Pattern");
    }
  });
});


// keywords, their alternates, and homophones
var keyWords = {
  stitch: ["stitch", "ditch", "forward", "step", "state", "stick"],
  row: ["row", "roll", "room", "route", "road", "line"],
  move: ["next", "advance", "move", "go"],
  help: ["help", "what", "how"],
  reset: ["reset", "set", "back", "recette"],
  pattern: ["pattern", "project"]
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
    if (userSaid(transcript, keyWords.stitch)) { // next stitch
      advanceStitch();
      return true;
    }
    if (userSaid(transcript, keyWords.row)) { // next row
      advanceRow();
      return true;
    }
    if (userSaid(transcript, ["back"])) { // move back
      backStitch();
      return true;
    }
    if (userSaid(transcript, ["up"])) { // move up
      if (WRITTEN) {
        // written pattern is displayed, user wants to go back a row
        decrementRow();
      }
      advanceRow(); // charted pattern is displayed
      return true;
    }
    if (userSaid(transcript, ["down"])) { // move down
      if (WRITTEN) {
        // written pattern is displayed, user wants to go to next row
        advanceRow();
      }
      decrementRow(); // charted pattern is displayed
      return true;
    }

    smartForward(); // Forward or Next
    return true;
  }

  // Assistance
  if (userSaid(transcript, ["what"])) { // what is this stitch? query
    var info = helpStitch().split(".")[0];
    lastSaid = info;
    generateSpeech(info);
    return true;
  }

  if (userSaid(transcript, ["how", "help"])) { // how is it done? query
    var info = helpStitch().split(".").slice(1).join(".");
    lastSaid = info;
    generateSpeech(info);
    return true;
  }

  // Leap Motion Tracking
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

  // Navigating backwards / resetting
  if (userSaid(transcript, keyWords.reset)) {
    if (userSaid(transcript, keyWords.row)) {
      // reset row
      resetRow();
    } else if (userSaid(transcript, keyWords.stitch.concat(["one", "move"]))){
      // allows for commands like "back one stitch", "back one", and "move back"
      backStitch();
    } else if (userSaid(transcript, keyWords.pattern)){
      // reset to beginning
      selectId(getIdOfStitch(0,0));
    } else {
      smartReset(); // just "Reset" or "Back"
    }
    return true;
  }

  // repeated instructions
  // not yet fully supported
  if (userSaid(transcript, ["repeat"])) {
    generateSpeech(lastSaid);
  }

  // Politeness
  if (userSaid(transcript, ['thank', 'thanks', 'pal'])) {
    lastSaid = "You're welcome, Laura"; // will be generated from user accounts in the future
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

/**
 * Dynamically figure out how to respond to "Back" based on current pattern information
 */
var smartReset = function() {
  if (pattern.current_stitch < 3) {
    // 0-indexed, so do this for first three stitches
    resetRow();
  } else {
    backStitch();
  }
};

/**
 * Dynamically figure out how to respond to "Next" based on current pattern information
 */
var smartForward = function() {
  row_length = pattern.rows[pattern.current_row].stitches.length;
  if (pattern.current_stitch + 3 > row_length) {
    advanceRow();
  } else {
    advanceStitch();
  }
};
