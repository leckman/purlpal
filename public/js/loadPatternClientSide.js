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
            updateTdBindings();
            patternLoaded = true;
            $("#pattern-container").append("<div id='movement-buttons'></div>");
            $("#movement-buttons").append("<button id='advance-stitch-button' type='button' class='btn'>Advance Stitch</button>");
            $("#movement-buttons").append("<button id='advance-row-button' type='button' class='btn'>Advance Row</button>");
            $( "#advance-stitch-button" ).click(advanceStitch);
            $( "#advance-row-button" ).click(advanceRow);
            $("#pattern-container").append("<div id='view-buttons'></div>");
            $("#view-buttons").append("<button id='rs-only-button' type='button' class='btn'>Display Right Side Only</button>");
            $("#view-buttons").append("<button id='ws-only-button' type='button' class='btn'>Display Wrong Side Only</button>");
            $("#view-buttons").append("<button id='view-toggle-button' type='button' class='btn'>Display Active Side of Pattern</button>");
            $("#rs-only-button").click(rs_only);
            $("#ws-only-button").click(ws_only);
            $("#view-toggle-button").click(toggle_view);
          }
        );
      }
    );
  }

  var toggle = false;

  rs_only = function(){
    $("#pattern-table").empty();
    $("#pattern-table").append(rs_pattern);
    updateTdBindings();
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    toggle = false;
  };

  ws_only = function(){
    $("#pattern-table").empty();
    $("#pattern-table").append(ws_pattern);
    updateTdBindings();
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    toggle = false;
  };

  toggle_view = function(){
    $("#pattern-table").empty();
    if (pattern.current_row % 2 === 0) { // rs row
      $("#pattern-table").append(rs_pattern);
    } else {
      $("#pattern-table").append(ws_pattern);
    }
    updateTdBindings();
    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");
    toggle = true;
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
  };

  advanceStitch = function(){
    if (!patternLoaded) {
      console.log("Hold on! Still setting up.");
      return;
    }
    console.log("attempting advance");

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

    $("#" + getIdOfRow(pattern.current_row)).toggleClass("selectedRow");
    $("#" + getIdOfStitch(pattern.current_row, pattern.current_stitch)).toggleClass("selectedStitch");

    pattern.current_row += 1;
    pattern.current_stitch = 0;

    if(toggle){
      $("#pattern-table").empty();
      if (pattern.current_row % 2 === 0) { // rs row
        $("#pattern-table").append(rs_pattern);
      } else {
        $("#pattern-table").append(ws_pattern);
      }
      $(".pattern td").dblclick(function() {
        selectId($(this).attr("id"));
      });
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

  updateTdBindings = function() {
    $(".pattern td").dblclick(function() {
      selectId($(this).attr("id"));
    });
    $(".pattern td").attr('title', 'Double click to move here');
  };
});
