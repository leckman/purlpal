console.log("Ready to Detect Leap Motion Data");

var calibrationPeriod = 50; // time to calibrate to tool location before detection starts
var sampleFrequency = 5; // to reduce noise, only sample every 5 frames

// TODO make sure stitches aren't registered too close in time (eliminate duplicates)
var t_since_last_stitch = 0;
var t_since_armed = 0;
var t_threshold = 2;

var y_threshold = 8; // boundary around middle calibration point
var v_max_threshold = 40; // velocity constraint on detection
var v_min_threshold = 15;

var tipPosition = 0;
var tipVelocity = 40;
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
      var newTipVelocity = Math.abs(frame.tools[0].tipVelocity[tipCoordinate]);
      tipVelocity = (newTipVelocity + tipVelocity)/2;

      if (t % 1000 === 0) {
        console.log("     Timestep Update");
        console.log("         min_v: " + v_min_threshold);
        console.log("          velo: " + tipVelocity);
        console.log("         max_v: " + v_max_threshold);
        console.log("      y_thresh: " + (tipAvg - y_threshold));
        console.log("             y: " + tipPosition);
        console.log("      y_thresh: " + tipAvg + y_threshold);
      }

      if ((tipPosition - y_threshold > tipAvg) && !inStitchSequence) {
        console.log("######Beginning Stitch Sequence######");
        console.log("    min_v: " + v_min_threshold);
        console.log("     velo: " + tipVelocity);
        console.log("    max_v: " + v_max_threshold);
        console.log("        y: " + tipPosition);
        console.log(" y_thresh: " + tipAvg + y_threshold);
        inStitchSequence = true;
      }

      if ((tipPosition < tipAvg - y_threshold) && inStitchSequence) {
        console.log("######Stitch Counted######");
        console.log("     min_v: " + v_min_threshold);
        console.log("      velo: " + tipVelocity);
        console.log("     max_v: " + v_max_threshold);
        console.log("  y_thresh: " + (tipAvg - y_threshold));
        console.log("         y: " + tipPosition);
        inStitchSequence = false;
      }
    }
    t+=1; // only increment if tool is present
  }
}});
