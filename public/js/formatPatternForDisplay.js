/**
 * HTML Chart interpretation of pattern object from database
 */
formatChartPattern = function(pattern) {
  var rows = pattern.rows.slice(0);
  rows.reverse(); // iterate backwards
  var numRows = rows.length;

  var htmlTable = "<table class='pattern table table-bordered' id='pat-table'>";
  rows.forEach(function(row, ii) {
    var i = numRows - ii;
    var htmlRow = "<tr id='"+getIdOfRow(i-1)+"'>";
    var stitches = row.stitches;
    var whichSymb = "r_symbol";
    if (i % 2 === 0) {
      // odd rows, iterate backwards
      stitches.reverse();
      whichSymb = "w_symbol";
      htmlRow += "<td class='rowNum''>" + String(i) + "</td>";
    }  else {
      htmlRow += "<td class='rowNum''></td>";
    }
    var numStitches = stitches.length - 1;
    stitches.forEach(function(stitch, j){
      var topTag = "<td class='st' id='"+getIdOfStitch(i-1,j)+"'>";
      if (i % 2 === 1) {
        topTag = "<td class='st' id='"+getIdOfStitch(i-1,numStitches - j)+"'>";
      }
      var contents = stitch[whichSymb];
      var botTag = "</td>";
      htmlRow = htmlRow + topTag + contents + botTag;
    });
    if (i % 2 === 1) {
      htmlRow += "<td class='rowNum''>" + String(i) + "</td>";
    } else {
      htmlRow += "<td class='rowNum''></td>";
    }
    htmlRow += "</tr>";
    htmlTable += htmlRow;
  });
  return htmlTable+"</table>";
};

/**
 * HTML Written interpretation of pattern from database
 */
formatWrittenPattern = function(pattern) {
  var table = "<table class='pattern charted table table-bordered' id='pat-table'>";
  pattern.rows.forEach(function(row, ii) {
    var i = i+1;
    var stitches = [];
    row.stitches.forEach(function(stitch){
      var last = stitches.length > 0 ? stitches[stitches.length-1][0] : "undefined";
      var name = stitch.name.slice(0,1);
      if (name == last) {
        stitches[stitches.length-1][1] += 1;
      } else {
        stitches.push([name, 1]);
      }
    });
    var instr = "";
    stitches.forEach(function(st) {
      instr += st[0];
      instr += st[1];
      instr += ", ";
    });
    instr = instr.slice(0,-2);
    var tr= "<tr id='"+getIdOfRow(ii)+"'><td class=rowNum>"+String(ii+1)+"</td><td class='rw'>"+instr+"</td></tr>";
    table += tr;
  });
  return table + "</table>";
};

/**
 * Key for the chart
 * Will eventually be dynamic to include only those symbols used in the chart
 */
getKey = function(rows) {

  var htmlTable = "<table class='key table table-bordered'>";
  htmlTable += "<tr><th>Symbol</th><th>Right Side (Odd Rows)</th><th>Wrong Side (Even Rows)</th></tr>";
  htmlTable += "<tr><td>V</td><td>Knit</td><td>Purl</td></tr>"; // V
  htmlTable += "<tr><td>-</td><td>Purl</td><td>Knit</td></tr>"; // -
  htmlTable += "</table>";
  return htmlTable;
};


// Original Plan Chart, DEPRECATED
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

// Original Plan chart option, DEPRECATED
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

// Original Plan Chart Option, DEPRECATED
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

// helper method for uniform stitch ids
getIdOfStitch = function(row, col) {
  return "stitch-"+row+"-"+col;
};

// helper method for uniform row ids
getIdOfRow = function(row) {
  return "pattern-row-"+row;
};
