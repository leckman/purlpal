console.log("Ready to Detect Leap Motion Data");
var t_since_last_stitch = 0;
var t_since_armed = 0;
var last_left = 100000;
var last_right = 0;
var potential_stitch = false;
var t_threshold = 2;
var y_threshold = 2;

var controller = Leap.loop({ hand: function(hand) {

  // TODO probably some smoothing
  if (hand.type == "left") {
    last_left = hand.thumb.bones[2].prevJoint[1];
  }
  if (hand.type == "right") {
    last_right = hand.thumb.bones[2].prevJoint[1];
  }

  t_since_last_stitch += 1;
  t_since_armed += 1;

  //console.log(hand.thumb.dipPosition);

  if ((last_right - last_left > y_threshold) && (t_since_last_stitch > t_threshold) && !potential_stitch) {
    // right hand above left
    potential_stitch = true;
    t_since_armed = 0;
    console.log("ARMING STITCH");
  }

  if ((y_threshold < last_left - last_right) && (t_since_armed > t_threshold) && potential_stitch) {
    // right hand below left ->> STITCH
    potential_stitch = false;
    t_since_last_stitch = 0;
    console.log("STITCH DETECTED");
    //console.log(hand);
    //console.log("WRIST");
    //console.log(hand.thumb.bones[2].prevJoint[1]); // y coordinate of intermediate phalanx in thumb
    advanceStitch();
  }

}});
