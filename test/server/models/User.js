var assert = require('chai').assert;
//var request = require('supertest');
var mongoose = require('mongoose');
var app = require('../../../server.js');
var User = require('../../../models/User.js');
var Pattern = require('../../../models/Pattern.js');
var testPatterns = require('../../../resources/testPatterns.js');

// Reset our mongoose collections so that the tests can run successfully.
mongoose.connection.collections.patterns.remove();
mongoose.connection.collections.rows.remove();
mongoose.connection.collections.projects.remove();
mongoose.connection.collections.users.remove();

describe('User API', function() {

    this.timeout(5000);

    // info for testing
    var uid;

    describe('Create', function() {

        it('Create', function(done) {
            // first, pattern
            User.create({
              'name': 'testUser',
              'email': "eckman+developer@gmail.com",
              'password': "testUserPASSw0rd",
            }, function(err, user) {
              assert.isNotNull(user);
              assert.equal(user.name, 'testUser');
              assert.isNull(err);
              uid = user._id;
              done();
            });
        });

    });

    describe("Projects", function() {

      it("create", function(done){
        // first make basic pattern
        Pattern.create(testPatterns[0], function(err, pat) {
          User.startProjectForUser(uid, pat._id, function(err, proj) {
            assert.isNull(err);
            assert.isNotNull(proj);
            assert.equal(pat._id.toString(), proj.pattern.toString());
            done();
          });
        });
      });

      it("get all projects", function(done){
        User.getAllProjects(uid, function(err, projs) {
          assert.isNull(err);
          assert.isNotNull(projs);
          assert.equal(projs.length, 1);
          done();
        });
      });


    });

});
