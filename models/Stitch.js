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

  // initialize DB
  var setUp = (function(){
    // make sure knit stitch is in database
    stitchModel.findOne({name: "knit"}).exec(function(err, stitch){
      if (stitch === null) {
        var kJSON = {
          name: "knit",
          description: "Insert right needle from front to back into stitch. Wrap yarn around the right needle counterclockwise.",
          type: "STITCH",
          symbol: "V"
        };

        var knitStitch = new stitchModel(kJSON);
        knitStitch.save(function(err, st){
          console.log("Saving Knit Stitch");
          if (err) {
            console.log("WARNING: Knit Stitch Failed to Save");
          }
        });
      }
    });

    stitchModel.findOne({name: "purl"}).exec(function(err, stitch){
      if (stitch===null) {
        var pJSON = {
          name: "purl",
          description: "Insert right needle from back to front into stitch. Wrap yarn around the right needle counterclockwise.",
          type: "STITCH",
          symbol: "-"
        };

        var purlStitch = new stitchModel(pJSON);
        purlStitch.save(function(err, st) {
          console.log("Saving Purl Stitch");
          if (err) {
            console.log("WARNING: Purl Stitch failed to save to database.");
          }
        });
      }
    });
  })();

  /**
   * @param callback: function(err, knitStitch)
   *    knitStich has fields description, name, type, and symbol
   */
  that.getKnit = function(callback){
    stitchModel.findOne({name: "knit"}).exec(callback);
  };

  /**
   * @param callback: function(err, purlStitch)
   *    purlStitch has fields description, name, type, and symbol
   */
  that.getPurl = function(callback){
    stitchModel.findOne({name: "purl"}).exec(callback);
  };

  that.getAll = function(callback) {
    stitchModel.find({}).exec(callback);
  };

  that.getByName = function(name, callback) {
    stitchModel.findOne({'name': name}, callback);
  };

  that.getById = function(id, callback) {
    stitchModel.findById(id, callback);
  };

  Object.freeze(that);

  return that;

}(stitchModel));

module.exports = Stitch;
