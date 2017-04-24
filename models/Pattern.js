var Row = require("./Row");
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var patSchema = new mongoose.Schema({
  description: String,
  public: {
    type: Boolean,
    default: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  name: String,
  rows: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Row'}]
}, schemaOptions);


var patModel = mongoose.model('Pattern', patSchema);

var Pattern = (function(patModel) {

  var that = {};

  /**
   * Creates a new pattern.
   * @param {Object} json - form
   *    {
   *      description: String,
   *      public: Boolean
   *      notes: String,
   *      rows: [row], where each row is ["knit", "purl"]+
   *    }
   * @param {Function} callback - a function of form callback(err, newPattern)
   */
  that.create = function(json, callback) {
    // first create rows
    Row.createMany(json.rows, function(err, rows){
      for (var i = 0; i < json.rows.length; i++) {
        json.rows[i] = rows[i]._id;
      }
      patModel.create(json, callback);
    });
  };


  /**
   * @param {String} patId - The mongo id associated with the given pat.
   * @param {Function} callback - A function of form callback(err, description)
   */
  that.getDescription = function(patId, callback) {
    patModel.findById(patId).exec(function(err, pat){
      if (err) {
        callback(err, null);
      } else {
        callback(null, pat.description);
      }
    });
  };

  /**
   * @param {String} patId - The mongo id associated with the given pattern.
   * @param {Function} callback - A function of form callback(err, notes)
   */
  that.getNotes = function(patId, callback) {
    patModel.findById(patId).exec(function(err, pat){
      if (err) {
        callback(err, null);
      } else {
        callback(null, pat.notes);
      }
    });
  };

  that.getAllForCreator = function(userId, callback) {
    patModel.find({creator: userId}, callback);
  };

  that.getAllPublic = function(callback) {
    patModel.find({public: true}, callback);
  };

  that.getById = function(id, callback) {
    patModel.findById(id, callback);
  };

  that.fullyPopulate = function(id, callback) {
    patModel.find({_id: id}).populate({path : 'rows', populate : {path : 'stitches'}}).exec(function (err, res) {
      callback(err, res[0]);
    });
  };

  Object.freeze(that);

  return that;

}(patModel));

module.exports = Pattern;
