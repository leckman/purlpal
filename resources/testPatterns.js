
var knitRow = ["knit", "knit", "knit", "knit", "knit", "knit", "knit", "knit", "knit", "knit"];
var purlRow = ["purl", "purl", "purl", "purl", "purl", "purl", "purl", "purl", "purl", "purl"];
var knitRib = ["knit", "knit", "purl", "purl", "knit", "knit", "purl", "purl", "knit", "knit"];
var purlRib = ["purl", "purl", "knit", "knit", "purl", "purl", "knit", "knit", "purl", "purl"];

var stockinette = {
  description: "Stockinette Square: 10 Rows, 10 Stitches Per Row",
  notes: "Stockinette is worked in knit stitches on right side (RS) rows and purl stitches on wrong side (WS) rows.",
  rows: [knitRow, purlRow, knitRow, purlRow, knitRow, purlRow, knitRow, purlRow, knitRow, purlRow]
};

var garter = {
  description: "Garter Square: 10 Rows, 10 Stitches Per Row",
  notes: "Garter is worked in knit stitches every row, both sides.",
  rows: [knitRow, knitRow, knitRow, knitRow, knitRow, knitRow, knitRow, knitRow, knitRow, knitRow]
};

var rib = {
  description: "2x2 Ribbing",
  notes: "A 2x2 rib alternates 2 knit stiches and two purl stitches. Right side (RS) rows start with knit stitches, and wrong side (WS) rows start with purl stitches.",
  rows: [knitRib, purlRib, knitRib, purlRib, knitRib, purlRib, knitRib, purlRib, knitRib, purlRib]
};

var testPatterns = [stockinette, garter, rib];

module.exports = testPatterns;
