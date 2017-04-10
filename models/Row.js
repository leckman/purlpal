var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var rowSchema = new mongoose.Schema({
  description: String,
  notes: String,
  stitches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stitch'}]
}, schemaOptions);


var rowModel = mongoose.model('Row', rowSchema);

var Row = (function(rowModel) {

  var that = {};

  /**
   * Creates a new user.
   * @param {Object} json - form
   *    {
   *      description: String,
   *      notes: String,
   *      stitches: [Stitch]
   *    }
   * @param {Function} callback - a function of form callback(err, newRow)
   */
  that.create = function(json, callback) {
    var row = new rowModel(json);
    row.save(function(err) {
      callback(err, row);
    });
  };

  /**
   * @param {String} rowId - The mongo id associated with the given row.
   * @param {Function} callback - A function of form callback(err, description)
   */
  that.getDescription = function(rowId, callback) {
    rowModel.findById(rowId).exec(function(err, row){
      if (err) {
        callback(err, None);
      } else {
        callback(None, row.description);
      }
    });
  };

  /**
   * @param {String} rowId - The mongo id associated with the given row.
   * @param {Function} callback - A function of form callback(err, notes)
   */
  that.getNotes = function(rowId, callback) {
    rowModel.findById(rowId).exec(function(err, row){
      if (err) {
        callback(err, null);
      } else {
        callback(null, row.notes);
      }
    });
  };

  that.getStitches = function(rowId, callback) {

    rowModel.findById(rowId).exec(function(err, row){
      if (err){
        callback(err, null);
      } else {
        rowModel.populate(
          row,
          {path:"stitches"},
          function(err, populatedRow) {
            if (err) {
              callback(err, null);
            } else {
              callback(null, populatedRow.stitches);
            }
          }
        );
      }
    });
  };

  Object.freeze(that);

  return that;

}(rowModel));

module.exports = Row;
