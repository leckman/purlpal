
var TRACKING = true;
var DEBUG =  true;

var calibrationPeriod = 50; // time to calibrate to tool location before detection starts
var sampleFrequency = 4; // to reduce noise, only sample every 5 frames

// make sure stitches aren't registered too close in time (eliminate duplicates)
// all values in terms of sampled frames
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
  if (frame.tools.length > 0 && TRACKING) {
    if (t < calibrationPeriod) {
      if (t === 0) {
        console.log("Calibrating...");
      }
      tipSum += frame.tools[0].tipPosition[tipCoordinate];
      tipAvg = tipSum/t;
      tipPosition = tipAvg;
    } else if ((t % sampleFrequency) === 0) {
      // looking at y coordinate
      var newTipPosition = frame.tools[0].tipPosition[tipCoordinate];
      tipPosition = (newTipPosition + tipPosition)/2; // to further reduce noise, average samples

      if ((t - calibrationPeriod == sampleFrequency) && DEBUG) {
        console.log("## ## ## Calibration Updated");
        console.log("      y_thresh: " + (tipAvg - y_threshold));
        console.log("             y: " + tipPosition);
        console.log("      y_thresh: " + tipAvg + y_threshold);
      } else if ((t % (200 * sampleFrequency) === 0) && DEBUG) {
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
        t_since_armed = 0;
        inStitchSequence = true;
      } else {
        t_since_armed += 1;
      }

      if ((tipPosition < tipAvg - y_threshold) && inStitchSequence && (t_since_armed > t_threshold)) {
        console.log("######Stitch Counted######");
        console.log("    y_thresh: " + (tipAvg - y_threshold));
        console.log("           y: " + tipPosition);
        console.log("Elapsed Time: " + t_since_armed);

        inStitchSequence = false;
        t_since_last_stitch = 0;
        advanceStitch();
      } else {
        t_since_last_stitch += 1;
      }
    }
    t+=1; // only increment if tool is present
  }
}});

var recalibrate = (function(time) {
  return function() {
    console.log("Recalibrating Leap Motion");
    time = 0;
  };
})(t);

var toggleTracking = (function(track) {
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

var startTracking = (function(track) {
  return function() {
    console.log("Leap Motion Recognition Resumed");
    track = true;
  };
})(TRACKING);

$().ready(function() {

  console.log("Ready to Detect Leap Motion Data");

  $("#info").append("<h3>Gesture Information</h3>");

  $("#info").append("<button id='toggle-leap' type='button' class='btn'>Turn Off Motion Recognition</button>");
  $("#toggle-leap").click(toggleTracking);

  $("#info").append("<button id='calibrate-leap' type='button' class='btn'>Re-Calibrate Leap Motion</button>");
  $("#calibrate-leap").click(recalibrate);

});
