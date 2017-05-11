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
            $("#pattern-container").append("<audio id=sound src='http://www.freesfx.co.uk/rx2/mp3s/5/16987_1461335348.mp3' hidden=true>");
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

  var toggle = false;

  chart = function(){
    $("#pattern-table").empty();
    $("#pattern-table").append(chart_pattern);
    updateTdBindings();
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    toggle = false;
    WRITTEN = false;
  };

  written = function() {
    $("#pattern-table").empty();
    $("#pattern-table").append(writ_pattern);
    updateTdBindings();
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    toggle = false;
    WRITTEN = true;
  };

  register = function(){
   var s = document.getElementById('sound');
   s.volume = 0.1;
   s.play();
  };

  resetRow = function() {
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    pattern.current_stitch = 0;
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    register();
  };

  selectId = function(id){
    // remove old styling
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    // add new styling
    var breakdown = id.split("-");
    pattern.current_row = Number(breakdown[1]);
    pattern.current_stitch = Number(breakdown[2]);
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    register();
  };

  advanceStitch = function(){
    if (!patternLoaded) {
      console.log("Hold on! Still setting up.");
      return;
    }

    if (WRITTEN) {
      return;
    }

    var current_row_length= $("#" + getIdOfRow(pattern.current_row) + " td").length - 2;
    if (pattern.current_stitch + 1 < current_row_length) {
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
      pattern.current_stitch += 1;
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
      register();
    } else {
      advanceRow();
    }
  };

  advanceRow = function(){
    if (!patternLoaded) {
      console.log("Hold on! Still setting up.");
      return;
    }

    var current_pat_length = $(".pattern tr").length - 1;
    if (pattern.current_row < current_pat_length){

      $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

      pattern.current_row += 1;
      pattern.current_stitch = 0;

      $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
      $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

      register();

    }


  };

  selectRow = function(k) {
    var desired_row = $(k).parent().attr('id').split("-")[2];
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    pattern.current_row = Number(desired_row);
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    register();
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
});
