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

var turnOnMic = (function(r) {
  return function(){
    OFF = false;
    r.start();
  };
})(recognition);

$().ready(function() {

  $("#mic-off").click(function(){
    if (OFF) {
      turnOnMic();
      $("#mic-off").html("Turn Off Voice Recognition");
      console.log("Voice recognition is now on");
    } else {
      turnOffMic();
      console.log("Voice recognition is now off");
      $("#mic-off").html("Turn On Voice Recognition");
    }
  });
});
