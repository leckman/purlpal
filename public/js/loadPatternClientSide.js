$(function(){
  console.log("DOM loaded");

  pattern = {}; // global
  patternLoaded = false;

  var chart_pattern;
  var writ_pattern;
  WRITTEN = false;

  if (!pattern.name){
    $.get(
      "patterns",
      function(response) {
        console.log("Loading Pattern");
        console.log("PATTERNS");
        console.log(response.patterns);
        // change index to load a different pattern from the database - this loads pattern "User Study Pattern A"
        var pid = response.patterns[3]._id;
        $.get(
          "patterns/"+pid,
          function(res) {
            console.log("PATTERN");
            console.log(res.pattern);
            pattern = res.pattern;
            chart_pattern = formatChartPattern(pattern);
            writ_pattern = formatWrittenPattern(pattern);
            keyTable = getKey(pattern.rows);
            pattern.current_row = 0;
            pattern.current_stitch = 0;
            $("#heading").text("Pattern: " + pattern.name);
            $("#pattern-container").append("<audio id=sound src='http://www.freesfx.co.uk/rx2/mp3s/5/16987_1461335348.mp3' hidden=true>"); // "heavy throw switch" sound
            $("#pattern-container").append("<audio id=changeSound src='http://www.freesfx.co.uk/rx2/mp3s/6/18654_1464810668.mp3' hidden=true>"); // "close lighter" sound
            $("#pattern-container").append("<h5>"+pattern.notes+"</h5");
            $("#pattern-container").append("<div id='pattern-table'>"+chart_pattern+"</div>");
            $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
            $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
            updateTdBindings();
            patternLoaded = true;
            $("#pattern-container").append("<div id='movement-buttons'></div>");
            $("#movement-buttons").append("<button id='advance-stitch-button' type='button' class='btn'>Advance Stitch</button>");
            $("#movement-buttons").append("<button id='advance-row-button' type='button' class='btn'>Advance Row</button>");
            $( "#advance-stitch-button" ).click(advanceStitch);
            $( "#advance-row-button" ).click(advanceRow);
          }
        );
      }
    );
  }

  chart = function(){
    $("#pattern-table").empty();
    $("#pattern-table").append(chart_pattern);
    updateTdBindings();
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    WRITTEN = false;
  };

  written = function() {
    $("#pattern-table").empty();
    $("#pattern-table").append(writ_pattern);
    updateTdBindings();
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    WRITTEN = true;
  };

  register = function(lastStitch, nextStitch){
    // changeSound is higher pitched, played when the next stitch is different
    whichSound = lastStitch == nextStitch ? 'sound' : 'changeSound';
    var s = document.getElementById(whichSound);
    s.volume = 0.1;
    s.play();
  };

  resetRow = function() {
    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);

    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    pattern.current_stitch = 0;
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));
  };

  selectId = function(id){
    // remove old styling
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);

    // add new styling
    var breakdown = id.split("-");
    pattern.current_row = Number(breakdown[1]);
    pattern.current_stitch = Number(breakdown[2]);
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));
  };

  advanceStitch = function(){
    if (!patternLoaded) {
      console.log("Hold on! Still setting up.");
      return;
    }

    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);
    var current_row_length= pattern.rows[pattern.current_row].stitches.length;

    if (pattern.current_stitch + 1 < current_row_length) {
      if (WRITTEN) {
        pattern.current_stitch += 1;
      } else {
        $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
        pattern.current_stitch += 1;
        $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
        register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));
      }
    } else {
      advanceRow();
    }
  };

  advanceRow = function(){
    if (!patternLoaded) {
      console.log("Hold on! Still setting up.");
      return;
    }
    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);
    var current_pat_length = $(".pattern tr").length - 1;
    if (pattern.current_row < current_pat_length){

      $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

      pattern.current_row += 1;
      pattern.current_stitch = 0;

      $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

      register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));

    }
  };

  backStitch = function(){
    if (!patternLoaded) {
      console.log("Hold on! Still setting up.");
      return;
    }

    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);

    if (pattern.current_stitch > 0) {
      if (WRITTEN) {
        pattern.current_stitch -= 1;
      } else {
        $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
        pattern.current_stitch -= 1;
        $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
        register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));
      }
    } else {
      decrementRow();
    }
  };

  decrementRow = function(){
    if (!patternLoaded) {
      console.log("Hold on! Still setting up.");
      return;
    }
    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);
    var current_pat_length = $(".pattern tr").length - 1;
    if (pattern.current_row > 0){

      $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

      pattern.current_row -= 1;
      pattern.current_stitch = pattern.rows[pattern.current_row].stitches.length - 1;

      $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

      register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));

    }
  };

  selectRow = function(k) {
    var desired_row = $(k).parent().attr('id').split("-")[2];
    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    pattern.current_row = Number(desired_row);
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));
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

  updateTdBindings = function() {
    $(".st").dblclick(function() {
      selectId($(this).attr("id"));
    });
    $(".st").attr('title', 'Double click to move here');
  };

  getStitchType = function(row, stitch) {
    var r = pattern.rows[row];
    var st = r.stitches[stitch];
    return st.name;
  };
});
