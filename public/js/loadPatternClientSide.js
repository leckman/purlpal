$(function(){
  console.log("DOM loaded");

  pattern = {}; // global
  patternLoaded = false;

  var rs_pattern;
  var ws_pattern;

  if (!pattern.name){
    $.get(
      "patterns",
      function(response) {
        console.log("Loading Pattern");
        var pid = response.patterns[2]._id;
        $.get(
          "patterns/"+pid,
          function(res) {
            pattern = res.pattern;
            rs_pattern = formatRSPattern(pattern);
            ws_pattern = formatWSPattern(pattern);
            pattern.current_row = 0;
            pattern.current_stitch = 0;
            $("#heading").text("Pattern: " + pattern.name);
            $("#pattern-container").append("<h5>"+pattern.notes+"</h5");
            $("#pattern-container").append("<div id='pattern-table'>"+rs_pattern+"</div>");
            $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
            $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
            patternLoaded = true;
            $("#pattern-container").append("<button id='advance-stitch-button' type='button' class='btn'>Advance Stitch</button>");
            $("#pattern-container").append("<button id='advance-row-button' type='button' class='btn'>Advance Row</button>");
            $( "#advance-stitch-button" ).click(function() {
              advanceStitch();
            });
            $( "#advance-row-button" ).click(function() {
              advanceRow();
            });
          }
        );
      }
    );
  }

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
    advanceRow();
  }

};

advanceRow = function(){
  if (!patternLoaded) {
    console.log("Hold on! Still setting up.");
    return;
  }

  //$("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
  //$("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

  pattern.current_row += 1;
  pattern.current_stitch = 0;

  $("#pattern-table").empty();
  if (pattern.current_row % 2 === 0) { // rs row
    $("#pattern-table").append(rs_pattern);
  } else {
    $("#pattern-table").append(ws_pattern);
  }

  $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
  $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
};

helpStitch = function(){
  var r = pattern.rows[pattern.current_row];
  var st = r.stitches[pattern.current_stitch];
  return "This is a " + st.name + " stitch. " + st.description;
};

helpRow = function(){
  var r = pattern.rows[pattern.current_row];
  return r.description;
};

});
