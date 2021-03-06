var mongoose = require('mongoose');
var Stitch = require('./Stitch');

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

var Row = (function(rowModel, Stitch) {

  var stitches = {};

  var that = {};

  /**
   * Creates a new user.
   * @param {Object} json - form
   *    {
   *      description: String,
   *      notes: String,
   *      stitches: ["knit" or "purl"]
   *    }
   * @param {Function} callback - a function of form callback(err, newRow)
   */
  that.create = function(json, callback) {

    parseRow(json.stitches, function(stitch_ids){
      json.stitches = stitch_ids;
      rowModel.create(json, function(err, row) {
        callback(err, row);
      });
    });
  };

  var parseRow = function(row, callback){
    if (stitches.knit === undefined) {
      // load stitches, TODO change to get all
      Stitch.getAll(function(err, sts) {
        for (var st of sts) {
          stitches[st.name] = st._id;
        }
        callback(parse(row))
      }) ;
    } else {
      callback(parse(row));
    }
  };

  var parseRows = function(rows, callback){
    if (stitches.knit === undefined) {
      // load stitches
      Stitch.getAll(function(err, sts) {
        for (var st of sts) {
          stitches[st.name] = st._id;
        }
        var rs = [];
        for (var i = 0; i < rows.length; i++) {
          rs.push(parse(rows[i]));
        }
        callback(rs);
      });
    } else {
      var rs = [];
      for (var i = 0; i < rows.length; i++) {
        rs.push(parse(rows[i]));
      }
      callback(rs);
    }
  };

  var parse = function(row) {
    var stitch_ids = [];
    for (var i = 0; i< row.length; i++) {
      var s = row[i].toLowerCase();
      if (stitches.hasOwnProperty(s)) {
        stitch_ids.push(stitches[s]);  // TODO make safe from xss
      }
    }
    return stitch_ids;
  };

  that.createMany = function(rows, callback) {

    parseRows(rows, function(rs) {
      var corrected_rows = [];
      for (var i = 0; i < rows.length; i++) {
        corrected_rows[i] = {'stitches': rs[i]};
      }

      rowModel.insertMany(corrected_rows, function(err, docs) {
        callback(err, docs);
      });
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

  /**
   * @param {String} rowId - The mongo id associated with the given row.
   * @param {Function} callback - A function of form callback(err, [stitches])
   */
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

  /**
   * @param {String} rowId - The mongo id associated with the given row.
   * @param {Function} callback - A function of form callback(err, length)
   */
  that.getRowLength = function(rowId, callback){
    rowModel.findById(rowId, function(err, r) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, r.stitches.length);
      }
    });
  };

  Object.freeze(that);

  return that;

}(rowModel, Stitch));

module.exports = Row;
