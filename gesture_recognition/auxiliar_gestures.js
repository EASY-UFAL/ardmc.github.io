function isPeaceAndLove(HAND) {
  const isThumbFolded = HAND[0][4].x < HAND[0][2].x;
  const isIndexExtended = HAND[0][8].y < HAND[0][6].y;
  const isMiddleExtended = HAND[0][12].y < HAND[0][10].y;
  const isRingFolded = HAND[0][16].y > HAND[0][14].y;
  const isPinkyFoldded = HAND[0][20].x > HAND[0][18].x;
  let result =
    isThumbFolded &&
    isIndexExtended &&
    isMiddleExtended &&
    isRingFolded &&
    isPinkyFoldded;
  return result;
}

function isFingerUp(HAND, indexes, isThumbFinger) {
  if (isThumbFinger) {
    var result =
      HAND[indexes[0]].x < HAND[indexes[1]].x &&
      HAND[indexes[1]].x < HAND[indexes[2]].x &&
      HAND[indexes[2]].x < HAND[indexes[3]].x;
  } else {
    var result =
      HAND[indexes[0]].y > HAND[indexes[1]].y &&
      HAND[indexes[1]].y > HAND[indexes[2]].y &&
      HAND[indexes[2]].y > HAND[indexes[3]].y;
  }
  return result;
}

function isHandOpen(HAND) {
  return (
    HAND[4].y < HAND[2].y &&
    HAND[8].y < HAND[6].y &&
    HAND[12].y < HAND[10].y &&
    HAND[16].y < HAND[14].y &&
    HAND[20].y < HAND[18].y
  );
}

function isHandClosed(handLandmarks) {
  // Reference points for each finger
  const fingerIndices = [8, 12, 16, 20];

  // Threshold x to consider hand closed
  const xProximityThreshold = 0.1;

  // X reference coordinate, using first finger
  const referenceX = handLandmarks[fingerIndices[0]].x;

  // Check if x coordinates of another fingers are close enough
  for (let i = 1; i < fingerIndices.length; i++) {
    const currentX = handLandmarks[fingerIndices[i]].x;
    if (Math.abs(currentX - referenceX) > xProximityThreshold) {
      return false; // Coordinates X are not close enough, so hand is not closed
    }
  }

  return true; // Coordinates X are close enough, so hand is closed
}
