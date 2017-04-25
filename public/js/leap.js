console.log("Ready to Detect Leap Motion Data");

var calibrationPeriod = 50; // time to calibrate to tool location before detection starts
var sampleFrequency = 5; // to reduce noise, only sample every 5 frames

// TODO make sure stitches aren't registered too close in time (eliminate duplicates)
var t_since_last_stitch = 0;
var t_since_armed = 0;
var t_threshold = 2;

var y_threshold = 2; // boundary around middle calibration point
var v_threshold = 40; // velocity constraint on detection

var tipPosition = 0;
var tipCoordinate = 2; // vertical if leap is pointed at you
var tipSum = 0;
var tipAvg = 0;
var inStitchSequence = false;
var t = 0;

var controller = Leap.loop({frame: function(frame) {
  if (frame.tools.length > 0) {
    if (t < calibrationPeriod) {
      tipSum += frame.tools[0].tipPosition[tipCoordinate];
      tipAvg = tipSum/t;
      tipPosition = tipAvg;
    } else if ((t % sampleFrequency) === 0) {
      // looking at y coordinate
      var newTipPosition = frame.tools[0].tipPosition[tipCoordinate];
      tipPosition = (newTipPosition + tipPosition)/2; // to further reduce noise, average samples
      var newTipVelocity = frame.tools[0].tipVelocity[tipCoordinate];

      if ((tipPosition + y_threshold > tipAvg) && !inStitchSequence) {
        console.log("Beginning Stitch Sequence");
        inStitchSequence = true;
      } else if ((t % 100) === 0) {
        console.log("Y: " + tipPosition + " avg: " + tipAvg);
        //console.log(frame.tools[0].tipPosition);
      }

      if ((tipPosition < tipAvg + y_threshold) && inStitchSequence) {
        console.log("######Stitch Counted######");
        console.log("      velo: " + newTipVelocity);
        console.log("      y: " + tipPosition);
        inStitchSequence = false;
      }
    }
    t+=1; // only increment if tool is present
  }
}});
