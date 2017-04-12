var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Project = require('./Project');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true},
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  gender: String,
  location: String,
  website: String,
  picture: String,
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  vk: String,
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, schemaOptions);

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.virtual('gravatar').get(function() {
  if (!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
});

userSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
  }
};

var userModel = mongoose.model('User', userSchema);

var User = (function(userModel){

  var that = {};

  /**
   * Creates a new user.
   * @param {Object} json - form
   *    {
   *      username: String,
   *      email: String,
   *      password: String
   *    }
   * @param {Function} callback - a function of form callback(err, newUser)
   */
  that.create = function(json, callback) {
    var user = new userModel(json);
    user.save(function(err) {
      callback(err, user);
    });
  };

  /**
   * @param userId
   * @param patternId
   * @param callback - function(err, newProject)
   */
  that.startProjectForUser = function(userId, patternId, callback) {
    Project.create({pattern: patternId}, function(err, proj) {
      userModel.findById(userId, function(err, user) {
        user.projects.push(proj._id);
        user.save(function(err) {
          callback(err, proj);
        });
      });
    });
  };

  that.getAllProjects = function(userId, callback) {
    userModel.findById(userId, function(err, user) {
      callback(err, user.projects);
    });
  };

  /**
   * Finds a user with the given email
   * @param {String} email
   * @param {Function} callback - a function of  the form callback(error, user)
   */
  that.findByEmail = function(email, callback) {

    userModel.findOne({ 'email': email }, callback);
  };

  /**
   * Copy of findById
   */
  that.findById = function(userid, callback) {
    userModel.findById(userid, callback);
  };

  /**
   * Copy of remove function to delete documents
   */
  that.removeById = function(id, callback) {
    userModel.remove({_id: id}, callback);
  };

  Object.freeze(that);
  return that;

})(userModel);

module.exports = User;
