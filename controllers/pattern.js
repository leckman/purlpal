var Pattern = require('../models/Pattern');
var testPatterns = require('../public/resources/testPatterns');

exports.getAllPublic = function(req, res) {
  Pattern.getAllPublic(function(err, pats) {
    if (pats.length === 0) {
      console.log("Saving in Test Patterns");
      Pattern.create(testPatterns[0], function(err, stockinette) {
        Pattern.create(testPatterns[1], function(err, garter) {
          Pattern.create(testPatterns[2], function(err, rib) {
            Pattern.create(testPatterns[3], function(err, testA) {
              Pattern.create(testPatterns[4], function(err, testB) {
                res.send({patterns: [stockinette, garter, rib, testA, testB]});
              });
            });
          });
        });
      });
    } else {
      res.send({patterns: pats});
    }
  });
};

exports.getExpanded = function(req, res) {
  Pattern.fullyPopulate(req.params.patternId, function(err, pat) {
    res.send({pattern: pat});
  });
};

exports.getAllCreated = function(req, res) {
  res.send({msg: 'Not Yet Implemented'});
};
