const thumbFingerIndexes = [1, 2, 3, 4];
const indexFingerIndexes = [5, 6, 7, 8];
const middleFingerIndexes = [9, 10, 11, 12];
const ringFingerIndexes = [13, 14, 15, 16];
const pinkyFingerIndexes = [17, 18, 19, 20];

class CountFingersGesture {
  constructor(child, outputCanvas, min, max, value, step, unit) {
    this.child = child;
    this.outputCanvas = outputCanvas;
    this.min = min;
    this.max = max;
    this.value = value;
    this.step = step;
    this.unit = unit;
  }

  init(results, canvasCtx) {
    let HAND;

    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      this.outputCanvas.width,
      this.outputCanvas.height
    );

    this.child.clearButtons();

    if (results.multiHandLandmarks.length > 0) {
      HAND = results.multiHandLandmarks;

      let quantityFingersUp = this.quantityFingersUp(HAND[0]);

      switch (quantityFingersUp) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          break;
        case 5:
          break;

        default:
          break;
      }
    }
  }

  isFingerUp(HAND, indexes, isThumbFinger) {
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

  quantityFingersUp(HAND) {
    let count = 0;
    this.isFingerUp(HAND, thumbFingerIndexes, true) ? count++ : count;
    this.isFingerUp(HAND, indexFingerIndexes) ? count++ : count;
    this.isFingerUp(HAND, middleFingerIndexes) ? count++ : count;
    this.isFingerUp(HAND, ringFingerIndexes) ? count++ : count;
    this.isFingerUp(HAND, pinkyFingerIndexes) ? count++ : count;

    return count;
  }
}

export default CountFingersGesture;
