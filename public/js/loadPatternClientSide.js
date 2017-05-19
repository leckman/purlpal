$(function(){
  console.log("DOM loaded");

  pattern = {}; // global
  patternLoaded = false;

  var chart_pattern;
  var writ_pattern;
  WRITTEN = false; // indicator for which pattern is displayed

  if (!pattern.name){ // if not already loaded
    $.get(
      "patterns",
      function(response) { // fetch all public patterns
        console.log("Loading Pattern");
        // change index to load a different pattern from the database - this loads pattern "User Study Pattern A"
        var userPatternA = 3; // index within patterns list
        var pid = response.patterns[userPatternA]._id;
        $.get(
          "patterns/"+pid,
          function(res) { // get full-info version of the desired pattern
            pattern = res.pattern;
            // format and save patterns up front to minimize processing time later
            chart_pattern = formatChartPattern(pattern);
            writ_pattern = formatWrittenPattern(pattern);
            keyTable = getKey(pattern.rows);
            pattern.current_row = 0; // in future, initialize from saved progess in database
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

  /**
   * Display pattern in chart form
   */
  chart = function(){
    $("#pattern-table").empty();
    $("#pattern-table").append(chart_pattern);
    updateTdBindings();
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    WRITTEN = false;
  };

  /**
   * Display pattern in written form
   */
  written = function() {
    $("#pattern-table").empty();
    $("#pattern-table").append(writ_pattern);
    updateTdBindings();
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    WRITTEN = true;
  };

  /**
   * Play sound to notify that stitch change has been detected
   * @param lastStitch: string name of stitch just completed
   * @param nextStitch: string name of stitch to be completed
   */
  register = function(lastStitch, nextStitch){
    // changeSound is higher pitched, played when the next stitch is different
    whichSound = lastStitch == nextStitch ? 'sound' : 'changeSound';
    var s = document.getElementById(whichSound);
    s.volume = 0.1; // low volume so it isn't obnoxious
    s.play();
  };

  /**
   * Reset current stitch to beginning of row
   */
  resetRow = function() {
    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);

    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    pattern.current_stitch = 0;
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));
  };

  /**
   * Select stitch by cell id in the pattern table
   */
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

  /**
   * Move one stitch further
   */
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
      }
      register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));
    } else {
      advanceRow();
    }
  };

  /**
   * Move to beginning of next row
   */
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

  /**
   * Move back a stitch
   */
  backStitch = function(){
    if (!patternLoaded) {
      console.log("Hold on! Still setting up.");
      return;
    }

    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);

    if (pattern.current_stitch > 0) {
      if (WRITTEN) {
        pattern.current_stitch -= 1; // no need to change highlighting
      } else {
        $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
        pattern.current_stitch -= 1;
        $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
      }
      register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));
    } else {
      decrementRow();
    }
  };

  /**
   * Move back a row
   */
  decrementRow = function(){
    if (!patternLoaded) {
      console.log("Hold on! Still setting up.");
      return;
    }
    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);
    var current_pat_length = $(".pattern tr").length - 1;
    if (pattern.current_row > 0){ // if you're not already on the first row, go back to the end of the previous row

      $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

      pattern.current_row -= 1;
      pattern.current_stitch = pattern.rows[pattern.current_row].stitches.length - 1; // last stitch

      $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

      register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));

    }
  };

  /**
   * Move selection to the beginning of a particular row
   * Used in written pattern navigation
   */
  selectRow = function(k) {
    var desired_row = $(k).parent().attr('id').split("-")[2];
    var lastStitchType = getStitchType(pattern.current_row, pattern.current_stitch);
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    pattern.current_row = Number(desired_row);
    pattern.current_stitch = 0;
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    register(lastStitchType, getStitchType(pattern.current_row, pattern.current_stitch));
  };

  /**
   * Stitch-based instructions
   */
  helpStitch = function(){
    var r = pattern.rows[pattern.current_row];
    var st = r.stitches[pattern.current_stitch];
    return "This is a " + st.name + " stitch. " + st.description;
  };

  /**
   * Row-based instructions
   * Not currently useful since rows in the test patterns don't have associated written instructions
   */
  helpRow = function(){
    var r = pattern.rows[pattern.current_row];
    return r.description;
  };

  /**
   * Binds table cells to the doubleclick functionality.
   */
  updateTdBindings = function() {
    $(".st").dblclick(function() {
      selectId($(this).attr("id"));
    });
    $(".st").attr('title', 'Double click to move here');
  };

  /**
   * Returns name of stitch at given row, stitch in pattern
   */
  getStitchType = function(row, stitch) {
    var r = pattern.rows[row];
    var st = r.stitches[stitch];
    return st.name;
  };
});
