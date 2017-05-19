
var TRACKING = true;
var DEBUG =  true;

var calibrationPeriod = 50; // time to calibrate to tool location before detection starts
var sampleFrequency = 4; // to reduce noise, only sample every 5 frames

// make sure stitches aren't registered too close in time (eliminate duplicates)
// all values in terms of sampled frames (so multiply by sampleFrequency to find values in terms of total frames)
var t_since_last_stitch = 0;
var t_since_armed = 0;
var t_threshold = 5;

var y_threshold = 8; // boundary around middle calibration point

var tipPosition = 0;
var tipCoordinate = 2; // vertical if leap is pointed at you
var tipSum = 0;
var tipAvg = 0;
var inStitchSequence = false;
var t = 0;

var controller = Leap.loop({frame: function(frame) {
  if (frame.tools.length > 0 && TRACKING) { // only count frames where a tool is recognized
    if (t < calibrationPeriod) { // ALL frames, not every sampleFrequency, so calibration runs faster
      if (t === 0) {
        console.log("Calibrating...");
      }
      tipSum += frame.tools[0].tipPosition[tipCoordinate]; // rightmost tool tip (leftmost from Leap perspective)
      tipAvg = tipSum/t;
      tipPosition = tipAvg; // set neutral position to average position over calibration period
    } else if ((t % sampleFrequency) === 0) {
      // looking at y coordinate
      var newTipPosition = frame.tools[0].tipPosition[tipCoordinate];
      tipPosition = (newTipPosition + tipPosition)/2; // to further reduce noise, average samples

      // print positional info every so often
      if ((t % (200 * sampleFrequency) === 0) && DEBUG) {
        console.log("  Timestep Update");
        console.log("      y_thresh: " + (tipAvg - y_threshold));
        console.log("             y: " + tipPosition);
        console.log("      y_thresh: " + tipAvg + y_threshold);
      }

      if ((tipPosition - y_threshold > tipAvg) && !inStitchSequence && (t_since_last_stitch > t_threshold)) {
        console.log("######Beginning Stitch Sequence######");
        console.log("           y: " + tipPosition);
        console.log("    y_thresh: " + tipAvg + y_threshold);
        console.log("Elapsed Time: " + t_since_last_stitch);
        t_since_armed = 0; // reset t_since_armed
        inStitchSequence = true; // beginning of stitch (upward movement) detected
      } else {
        t_since_armed += 1;
      }

      if ((tipPosition < tipAvg - y_threshold) && inStitchSequence && (t_since_armed > t_threshold)) {
        console.log("######Stitch Counted######");
        console.log("    y_thresh: " + (tipAvg - y_threshold));
        console.log("           y: " + tipPosition);
        console.log("Elapsed Time: " + t_since_armed);

        inStitchSequence = false; // stitch detected, no longer in sequence
        t_since_last_stitch = 0; // stitch detected, reset
        advanceStitch();
      } else {
        t_since_last_stitch += 1;
      }
    }
    t+=1; // only increment if tool is present
  }
}});

// reset t to 0 so calibration function re-runs
recalibrate = (function(time, track) {
  return function() {
    console.log("Recalibrating Leap Motion");
    time = 0;
    tipSum = 0;
    tipAvg = 0;
    track = true;
  };
})(t, TRACKING);

// turn on/off leap motion detection
toggleTracking = (function(track) {
  return function() {
    if (track) {
      $("#toggle-leap").html("Turn On Motion Recognition");
      console.log("Leap Motion Recognition Stopped");
      track = false;
    } else {
      $("#toggle-leap").html("Turn Off Motion Recognition");
      console.log("Leap Motion Recognition Resumed");
      track = true;
    }
  };
})(TRACKING);

$().ready(function() {

  console.log("Ready to Detect Leap Motion Data");

});
