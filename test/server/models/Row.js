var assert = require('chai').assert;
//var request = require('supertest');
var mongoose = require('mongoose');
var app = require('../../../server.js');
var Row = require('../../../models/Row.js');

mongoose.connection.collections.patterns.remove();
mongoose.connection.collections.rows.remove();
mongoose.connection.collections.projects.remove();

describe('Row API', function() {

    this.timeout(5000);

    // info for testing
    var description = "2x2 Ribbing";
    var notes = "";
    var stitches = ["knit", "knit", "purl", "purl", "knit", "knit", "purl", "purl"];
    var stitches2 = ["purl", "purl", "knit", "knit", "purl", "purl", "knit", "knit"];
    var multiRows = [stitches, stitches2];
    var rid;

    describe('Create', function() {

        it('Create One', function(done) {
            // this test primarily exists such that we have two different users to test collisions
            Row.create({
              'description': description,
              'notes': notes,
              'stitches': stitches
            }, function(err, row) {
              assert.isNotNull(row);
              assert.equal(row.stitches[0], row.stitches[1]);
              assert.isNull(err);
              rid = row._id;
              done();
            });
        });

        it("Create Many", function(done) {
          Row.createMany(multiRows, function(err, rows) {
            assert.equal(rows.length, multiRows.length);
            assert.equal(rows[0].stitches[0], rows[0].stitches[1]);
            done();
          });
        });

    });

    describe("Get", function() {

      it("Row Length", function(done) {
        Row.getRowLength(rid, function(err, len) {
          assert.equal(len, stitches.length);
          done();
        });
      });
    });
});
