// Author: Laura
var assert = require('chai').assert;
//var request = require('supertest');
var mongoose = require('mongoose');
var app = require('../../../server.js');
var Stitch = require('../../../models/Stitch.js');

// Reset our mongoose collections so that the tests can run successfully.
//for (var i in mongoose.connection.collections) {
//    mongoose.connection.collections[i].remove();
//}

describe('Row API', function() {

    this.timeout(5000);

    // info for testing
    var kid;
    var pid;

    describe('get', function() {

        it('Get Knit', function(done) {
            // this test primarily exists such that we have two different users to test collisions
            Stitch.getKnit(function(err, knit) {
              assert.isNotNull(knit);
              assert.equal(knit.name, "knit");
              assert.isNull(err);
              kid = knit._id;
              done();
            });
        });

        it('Get Purl', function(done) {
            // this test primarily exists such that we have two different users to test collisions
            Stitch.getPurl(function(err, purl) {
              assert.isNotNull(purl);
              assert.equal(purl.name, "purl");
              assert.isNull(err);
              pid = purl._id;
              done();
            });
        });

        it("Get All", function(done) {
          Stitch.getAll(function(err, sts) {
            assert.equal(sts.length, 2);
            assert.include([kid, pid], sts[0]._id);
            assert.include([kid, pid], sts[1]._id);
            assert.notEqual(sts[0]._id, sts[1]._id);
            done();
          });
        });

        it("by name", function(done) {
          Stitch.getByName("knit", function(err, k) {
            assert.isNotNull(k);
            assert.equal(kid.toString(), k._id.toString());
            done();
          });
        });

        it("by ID", function(done) {
          Stitch.getById(pid, function(err, p) {
            assert.isNotNull(p);
            assert.equal("purl", p.name);
            done();
          });
        });

    });
});
