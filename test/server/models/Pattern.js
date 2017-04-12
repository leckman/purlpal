var assert = require('chai').assert;
//var request = require('supertest');
var mongoose = require('mongoose');
var app = require('../../../server.js');
var Pattern = require('../../../models/Pattern.js');

// Reset our mongoose collections so that the tests can run successfully.
mongoose.connection.collections.patterns.remove();
mongoose.connection.collections.rows.remove();
mongoose.connection.collections.projects.remove();

describe('Pattern API', function() {

    this.timeout(5000);

    // info for testing
    var description = "Garter Stitch Square";
    var notes = "8 stitches across, 8 rows, all knit";
    var stitches = ["knit", "knit", "knit", "knit", "knit", "knit", "knit", "knit"];
    var multiRows = [stitches, stitches, stitches, stitches, stitches, stitches, stitches, stitches];
    var c1 = "58ebeb54575bc4ae45bd81b6"; // bogus
    var c2 = "58ebeb54575bc4ae45bd81b5"; // bogus
    var pid;

    describe('Create', function() {

          // {
          //        description: String,
          //        public: Boolean
          //        notes: String,
          //        rows: [row], where each row is ["knit", "purl"]+
          // }

        it('Create One - Private', function(done) {
            // this test primarily exists such that we have two different users to test collisions
            Pattern.create({
              'description': description,
              'notes': "1",
              'rows': multiRows,
              'creator': c1,
              'public': false
            }, function(err, pat) {
              assert.isNotNull(pat);
              assert.equal(pat.rows.length, 8);
              assert.isNull(err);
              pid = pat._id;
              done();
            });
        });

        it('Create One - Public', function(done) {
            // this test primarily exists such that we have two different users to test collisions
            Pattern.create({
              'description': description,
              'notes': "2",
              'rows': multiRows,
              'creator': c2,
              'public': true
            }, function(err, pat) {
              assert.isNotNull(pat);
              assert.equal(pat.rows.length, 8);
              assert.isNull(err);
              done();
            });
        });

    });

    describe("Get", function() {

      it("public patterns", function(done) {
        Pattern.getAllPublic(function(err, pats) {
          assert.isNotNull(pats);
          assert.equal(1, pats.length);
          assert.equal("2", pats[0].notes);
          done();
        });
      });

      it("by creator", function(done) {
        Pattern.getAllForCreator(c1, function(err, pats) {
          assert.isNotNull(pats);
          assert.equal(1, pats.length);
          assert.equal("1", pats[0].notes);
          done();
        });
      });

      it("fully populated pattern", function(done) {
        Pattern.fullyPopulate(pid, function(err, res) {
          assert.isNull(err);
          assert.isDefined(res.rows[0].stitches);
          assert.equal(res.rows[0].stitches.length, stitches.length);
          done();
        });
      });

    });

});
