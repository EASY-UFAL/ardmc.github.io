import RepetitionConfigPage from "../pages/repetition_config_page.js";

const thumbFingerIndexes = [1, 2, 3, 4];
const indexFingerIndexes = [5, 6, 7, 8];
const middleFingerIndexes = [9, 10, 11, 12];
const ringFingerIndexes = [13, 14, 15, 16];
const pinkyFingerIndexes = [17, 18, 19, 20];
let increaseTimeOut = 0;
let decreaseTimeOut = 0;
let canEditValue = 0;

class CountFingersGesture {
  constructor(child, id, outputCanvas, min, max, value, step, unit) {
    this.child = child;
    this.id = id;
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
    var progressBar = document.getElementById("dynamicProgressBar");
    let pageContent = document.getElementById(this.id);
    console.log(pageContent, pageContent.value);

    if (results.multiHandLandmarks.length > 0) {
      HAND = results.multiHandLandmarks;
      this.draw(HAND[0], canvasCtx);

      let quantityFingersUp = this.quantityFingersUp(HAND[0]);
      console.log(quantityFingersUp);

      if (canEditValue) {
        progressBar.value = pageContent.value;
        switch (quantityFingersUp) {
          case 1:
            this.increaseValue();
            break;
          case 2:
            this.decreaseValue();
            break;
          case 4:
            canEditValue = 0;
            break;
          case 5:
            break;
          default:
            break;
        }
      } else if (quantityFingersUp == 0) {
        canEditValue = 1;
      }
    }
  }

  draw(HAND, canvasCtx) {
    for (let i = 0; i < HAND.length; i++) {
      let landmarks = HAND[i];

      let x = landmarks.x * this.outputCanvas.width;
      let y = landmarks.y * this.outputCanvas.height;
      let z = Math.abs(landmarks.z);
      let markColor = "black";

      if (
        (this.isFingerUp(HAND, thumbFingerIndexes, true) && i == 4) ||
        (this.isFingerUp(HAND, indexFingerIndexes) && i == 8) ||
        (this.isFingerUp(HAND, middleFingerIndexes) && i == 12) ||
        (this.isFingerUp(HAND, ringFingerIndexes) && i == 16) ||
        (this.isFingerUp(HAND, pinkyFingerIndexes) && i == 20)
      ) {
        markColor = "blue";
      }
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, 100 * z, 0, 2 * Math.PI);
      canvasCtx.fillStyle = markColor;
      canvasCtx.fill();
      canvasCtx.stroke();
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

  increaseValue() {
    let pageContent = document.getElementById(this.id);
    if (pageContent.value <= this.max) {
      if (increaseTimeOut == 3) {
        pageContent.value += this.step;
        pageContent.innerHTML = pageContent.value.toFixed(1) + this.unit;
        increaseTimeOut = 0;
      } else {
        increaseTimeOut++;
      }
    }
  }

  decreaseValue() {
    let pageContent = document.getElementById(this.id);
    if (pageContent.value >= this.min) {
      if (decreaseTimeOut == 3) {
        pageContent.value -= this.step;
        pageContent.innerHTML = pageContent.value.toFixed(1) + this.unit;
        decreaseTimeOut = 0;
      } else {
        decreaseTimeOut++;
      }
    }
  }
}

export default CountFingersGesture;
