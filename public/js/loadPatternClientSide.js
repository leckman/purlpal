console.log("Loading Pattern");
$(function(){
  console.log("DOM loaded");

  pattern = {}; // global
  patternLoaded = false;

  $.get(
    "patterns",
    function(response) {
      var pid = response.patterns[0]._id;
      $.get(
        "patterns/"+pid,
        function(res) {
          pattern = res.pattern;
          pattern.current_row = 0;
          pattern.current_stitch = 0;
          $("#heading").text("Pattern: Stockinette Square");
          console.log($("#pattern-container"));
          $("#pattern-container").append("<h5>"+pattern.notes+"</h5");
          $("#pattern-container").append(formatPattern(pattern));
          $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
          $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
          patternLoaded = true;
          $("#pattern-container").append("<button id='advance-stitch-button' type='button' class='btn'>Advance Stitch</button>");
          $( "#advance-stitch-button" ).click(function() {
            advanceStitch();
          });
        }
      );
    }
);

advanceStitch = function(){
  if (!patternLoaded) {
    console.log("Hold on! Still setting up.");
    return;
  }

  var current_row_length= $("#" + getIdOfRow(pattern.current_row) + " td").length;
  if (pattern.current_stitch + 1 < current_row_length) {
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    pattern.current_stitch += 1;
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
  } else {
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    pattern.current_row += 1;
    pattern.current_stitch = 0;
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
  }

};

advanceRow = function(){
  if (!patternLoaded) {
    console.log("Hold on! Still setting up.");
    return;
  }

  $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
  $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
  pattern.current_row += 1;
  pattern.current_stitch = 0;
  $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
  $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
};

});
