/*****************************************************************/
/******** SPEECH RECOGNITION SETUP YOU CAN IGNORE ****************/
/*****************************************************************/
var debouncedProcessSpeech = _.debounce(processSpeech, 500);
var OFF = false;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onresult = function(event) {
  // Build the interim transcript, so we can process speech faster
  var transcript = '';
  var hasFinal = false;
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal)
      hasFinal = true;
    else
      transcript += event.results[i][0].transcript;
  }

  var processed = debouncedProcessSpeech(transcript);

  // If we reacted to speech, kill recognition and restart
  if (processed) {
    recognition.stop();
  }
};
// Restart recognition if it has stopped
recognition.onend = function(event) {
  setTimeout(function() {
    if (!OFF) {
      recognition.start();
    }
  }, 1000);
};
recognition.start();

var turnOffMic = (function(r) {
  return function(){
    OFF = true;
    r.stop();
  };
})(recognition);

var turnOnMic = function() {
  OFF = false;
  recognition.start();
};

$("#pattern-container").append("<div><button id='mic-off' type='button' class='btn'>Turn Off Voice Recognition</button></div>");
$("#mic-off").click(function(){
  turnOffMic();
  console.log("Voice recognition is now off");
});
/*****************************************************************/
/******** END OF SPEECH RECOG SETUP ******************************/
/*****************************************************************/
