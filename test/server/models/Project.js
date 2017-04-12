var assert = require('chai').assert;
//var request = require('supertest');
var mongoose = require('mongoose');
var app = require('../../../server.js');
var Pattern = require('../../../models/Pattern.js');
var Project = require('../../../models/Project.js');

// Reset our mongoose collections so that the tests can run successfully.
mongoose.connection.collections.patterns.remove();

describe('Project API', function() {

    this.timeout(5000);

    // info for testing
    var description = "Garter Stitch Square";
    var notes = "2 stitches across, 3 rows, all knit";
    var stitches = ["knit", "knit"];
    var multiRows = [stitches, stitches, stitches];
    var creator = "58ebeb54575bc4ae45bd81b6"; // bogus
    var pattern;
    var project;

    describe('Create', function() {

          // {
          //        description: String,
          //        public: Boolean
          //        notes: String,
          //        rows: [row], where each row is ["knit", "purl"]+
          // }

        it('Create', function(done) {
            // first, pattern
            Pattern.create({
              'description': description,
              'notes': "1",
              'rows': multiRows,
              'creator': creator,
              'public': true
            }, function(err, pat) {
              assert.isNotNull(pat);
              assert.equal(pat.rows.length, 3);
              assert.isNull(err);
              pattern = pat;
              Project.create({
                'pattern': pat._id
              }, function(err, proj){
                assert.isNotNull(proj);
                assert.isNull(err);
                project = proj;
                done();
              });
            });
        });

    });

    describe("Advance", function() {

      it("to next stitch within row", function(done){
        assert.equal(project.current_row, 0);
        assert.equal(project.current_stitch, 0);
        Project.advanceStitch(project._id, function(err, update) {
          assert.equal(update.current_row, 0);
          assert.equal(update.current_stitch, 1);
          done();
        });
      });

      it("to next stitch in next row", function(done){
        Project.advanceStitch(project._id, function(err, update) {
          assert.equal(update.current_row, 1);
          assert.equal(update.current_stitch, 0);
          done();
        });
      });

      it("to next row", function(done){
        Project.advanceRow(project._id, function(err, update) {
          assert.equal(update.current_row, 2);
          assert.equal(update.current_stitch, 0);
          done();
        });
      });

    });

});
