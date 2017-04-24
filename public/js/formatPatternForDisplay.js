// returns html string
formatPattern = function(pattern) {
  var rows = pattern.rows;
  var htmlTable = "<div id='pattern-table'><table class='pattern table'>";
  rows.forEach(function(row, i) {
    var htmlRow = "<tr id='"+getIdOfRow(i)+"'>";
    var stitches = row.stitches;
    stitches.forEach(function(stitch, j){
      var topTag = "<td id='"+getIdOfStitch(i,j)+"'>";
      var contents = stitch.symbol;
      var botTag = "</td>";
      htmlRow = htmlRow + topTag + contents + botTag;
    });
    htmlRow += "</tr>";
    htmlTable += htmlRow;
  });
  return htmlTable+"</table></div>";
};

getIdOfStitch = function(row, col) {
  return "stitch-"+row+"-"+col;
};

getIdOfRow = function(row) {
  return "pattern-row-"+row;
};
