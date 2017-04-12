console.log("Ready to Detect Speech Input");

// processSpeech(transcript)
//  Is called anytime speech is recognized by the Web Speech API
// Input:
//    transcript, a string of possibly multiple words that were recognized
var processSpeech = function(transcript) {

  console.log("I heard...");
  console.log(transcript);

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

  if (userSaid(transcript, ["next", "advance", "move"])) {
    if (userSaid(transcript, ["stitch", "ditch"])) {
      console.log("User wants to advance to next stitch");
      advanceStitch();
      return true;
    }
    if (userSaid(transcript, ["row"])) {
      console.log("User wants to advance to next row");
      advanceRow();
      return true;
    }
  }

  if (userSaid(transcript, ["help", "what", "how"])) {
    if (userSaid(transcript, ["stitch", "ditch"])) {
      console.log("User wants help on this stitch");
      helpStitch();
      return true;
    }
    if (userSaid(transcript, ["row"])) {
      console.log("User wants help on this row");
      helpRow();
      return true;
    }
  }

  return false; // no action taken
};
