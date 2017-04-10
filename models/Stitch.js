var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

function typeValidator (val) {
  var types = ["INC", "DEC", "STITCH"];
  return types.indexOf(val) > -1;
}

var stitchSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true },
  description: {
    type: String,
    required: true },
  type: {
    type: String,
    required: true,
    validate: typeValidator },
  symbol: String
}, schemaOptions);

var stitchModel = mongoose.model('Stitch', stitchSchema);

var Stitch = (function(stitchModel) {

  var that = {};

  that.getKnit = function(callback){
    stitchModel.findOne({name: "knit"}).exec(callback);
  };

  that.getPurl = function(callback){
    stitchModel.findOne({name: "knit"}).exec(callback);
  };

  Object.freeze(that);

  return that;

}(rowModel));

module.exports = Row;
