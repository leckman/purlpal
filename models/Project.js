var Row = require("./Row");
var Pattern = require("./Pattern");
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var projSchema = new mongoose.Schema({
  current_row: {
    type: Number,
    default: 0
  },
  current_stitch: {
    type: Number,
    default: 0
  },
  notes: String,
  pattern: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern'}
}, schemaOptions);


var projModel = mongoose.model('Project', projSchema);

var Project = (function(projModel) {

  var that = {};

  /**
   * Creates a new project.
   * @param {Object} json - form
   *    {
   *      notes: String,
   *      project: projectID
   *    }
   * @param {Function} callback - a function of form callback(err, newProject)
   */
  that.create = function(json, callback) {
    projModel.create(json, callback);
  };


  /**
   * @param {String} projId - The mongo id associated with the given project.
   * @param {Function} callback - A function of form callback(err, notes)
   */
  that.getNotes = function(projId, callback) {
    projModel.findById(projId).exec(function(err, proj){
      if (err) {
        callback(err, null);
      } else {
        callback(null, proj.notes);
      }
    });
  };

  that.getById = function(id, callback) {
    projModel.findById(id, callback);
  };

  that.advanceStitch = function(id, callback) {
    projModel.find({'_id': id}).populate('pattern').exec(function(err, res) {
      var pop_proj;
      if (err === null) {
        pop_proj = res[0];
      }
      var current_row = pop_proj.pattern.rows[pop_proj.current_row];
      Row.getRowLength(current_row, function(err, len) {
        if (pop_proj.current_stitch + 1 < len) {
          pop_proj.current_stitch = pop_proj.current_stitch + 1;
          pop_proj.save(callback);
        } else if (pop_proj.current_row + 1 < pop_proj.pattern.rows.length) {
          pop_proj.current_stitch = 0;
          pop_proj.current_row = pop_proj.current_row + 1;
          pop_proj.save(callback);
        } else {
          callback("Pattern Complete: Cannot Advance", null);
        }
      });
    });
  };

  that.advanceRow = function(id, callback) {

    projModel.find({'_id': id}).populate('pattern').exec(function(err, res) {
      var pop_proj;
      if (err === null) {
        pop_proj = res[0];
      }
      if (pop_proj.current_row + 1 < pop_proj.pattern.rows.length) {
        pop_proj.current_stitch = 0;
        pop_proj.current_row = pop_proj.current_row + 1;
        pop_proj.save(callback);
      } else {
        callback("On Last Row: Cannot Advance Pattern", null);
      }
    });
  };

  Object.freeze(that);

  return that;

}(projModel));

module.exports = Project;
