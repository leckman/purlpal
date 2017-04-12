var Pattern = require('../models/Pattern');
var testPatterns = require('../resources/testPatterns');

exports.getAllPublic = function(req, res) {
  Pattern.getAllPublic(function(err, pats) {
    if (pats.length === 0) {
      console.log("Saving in Test Patterns");
      Pattern.create(testPatterns[0], function(err, stockinette) {
        Pattern.create(testPatterns[1], function(err, garter) {
          Pattern.create(testPatterns[2], function(err, rib) {
            res.send({patterns: [stockinette, garter, rib]});
          });
        });
      });
    } else {
      res.send({patterns: pats});
    }
  });
};

exports.getExpanded = function(req, res) {
  console.log(req);
  Pattern.fullyPopulate(req.params.patternId, function(err, pat) {
    res.send({pattern: pat});
  });
};

exports.getAllCreated = function(req, res) {
  res.send({msg: 'Not Yet Implemented'});
};
