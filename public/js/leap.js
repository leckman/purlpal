console.log("Ready to Detect Leap Motion Data");
var t_since_last_stitch = 0;
var t_since_armed = 0;
var last_left = 100000;
var last_right = 0;
var potential_stitch = false;
var threshold = 2;

var controller = Leap.loop({ hand: function(hand) {

  // TODO probably some smoothing
  if (hand.type == "left") {
    last_left = hand.indexFinger.tipPosition[1];
  }
  if (hand.type == "right") {
    last_right = hand.indexFinger.tipPosition[1];
  }

  t_since_last_stitch += 1;
  t_since_armed += 1;

  console.log(hand.thumb.dipPosition);

  if ((last_right > last_left) && (t_since_last_stitch > threshold) && !potential_stitch) {
    // right hand above left
    potential_stitch = true;
    t_since_armed = 0;
    console.log("ARMING STITCH");
  }

  if ((last_right < last_left) && (t_since_armed > threshold) && potential_stitch) {
    // right hand below left ->> STITCH
    potential_stitch = false;
    t_since_last_stitch = 0;
    console.log("STITCH DETECTED");
    console.log(hand);
    advanceStitch();
  }

}});
