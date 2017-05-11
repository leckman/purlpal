// returns html string
formatRSPattern = function(pattern) {
  var rows = pattern.rows;
  var htmlTable = "<table class='pattern table table-bordered'>";
  rows.forEach(function(row, i) {
    var htmlRow = "<tr id='"+getIdOfRow(i)+"'>";
    var stitches = row.stitches;
    var whichSymb = "r_symbol";
    if (i % 2 === 1) {
      // odd rows, iterate backwards
      stitches.reverse();
      whichSymb = "w_symbol";
    }
    var numStitches = stitches.length - 1;
    stitches.forEach(function(stitch, j){
      var topTag = "<td id='"+getIdOfStitch(i,j)+"'>";
      if (i % 2 === 1) {
        topTag = "<td id='"+getIdOfStitch(i,numStitches - j)+"'>";
      }
      var contents = stitch[whichSymb];
      var botTag = "</td>";
      htmlRow = htmlRow + topTag + contents + botTag;
    });
    htmlRow += "</tr>";
    htmlTable += htmlRow;
  });
  return htmlTable+"</table>";
};

formatAlternatingPattern = function(pattern) {
  var rows = pattern.rows;
  var htmlTable = "<table class='pattern table table-bordered'>";
  rows.forEach(function(row, i) {
    var htmlRow = "<tr id='"+getIdOfRow(i)+"'>";
    var stitches = row.stitches;
    stitches.forEach(function(stitch, j){
      var topTag = "<td id='"+getIdOfStitch(i,j)+"'>";
      var contents = stitch.r_symbol;
      var botTag = "</td>";
      htmlRow = htmlRow + topTag + contents + botTag;
    });
    htmlRow += "</tr>";
    htmlTable += htmlRow;
  });
  return htmlTable+"</table>";
};

formatWSPattern = function(pattern) {
  var rows = pattern.rows;
  var htmlTable = "<table class='pattern table table-bordered'>";
  rows.forEach(function(row, i) {
    var htmlRow = "<tr id='"+getIdOfRow(i)+"'>";
    var stitches = row.stitches;
    var whichSymb = "w_symbol";
    if (i % 2 === 1) {
      // even rows, iterate backwards
      stitches.reverse();
      whichSymb = "r_symbol";
    }
    var numStitches = stitches.length - 1;
    stitches.forEach(function(stitch, j){
      var topTag = "<td id='"+getIdOfStitch(i,j)+"'>";
      if (i % 2 === 1) {
        topTag = "<td id='"+getIdOfStitch(i,numStitches - j)+"'>";
      }
      var contents = stitch[whichSymb];
      var botTag = "</td>";
      htmlRow = htmlRow + topTag + contents + botTag;
    });
    htmlRow += "</tr>";
    htmlTable += htmlRow;
  });
  return htmlTable+"</table>";
};

getIdOfStitch = function(row, col) {
  return "stitch-"+row+"-"+col;
};

getIdOfRow = function(row) {
  return "pattern-row-"+row;
};
