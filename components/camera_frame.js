import { FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

import AnalogicGesture from "../components/analogic_gesture.js";

class CameraFrame {
  constructor(child, min, max, value, step, unit) {
    this.child = child;
    this.canvasRect = null;
    this.enableToClick = false;
    sessionStorage.removeItem("previousPalmBaseX");
    sessionStorage.removeItem("previousButtonIndex");
    this.lastVideoTime = -1;
    this.isHandOpen = true;
    this.min = min;
    this.max = max;
    this.value = value;
    this.step = step;
    this.unit = unit;
  }

  draw() {
    this.videoElement = document.createElement("video");
    this.videoElement.className = "input_video";
    this.videoElement.style = "display: none";

    this.outputCanvas = document.createElement("canvas");
    this.outputCanvas.className = "output_canvas";

    const frame = document.createElement("div");
    frame.className = "screen";
    frame.appendChild(this.videoElement);
    frame.appendChild(this.outputCanvas);
    frame.appendChild(this.child.draw());

    this.init();

    return frame;
  }

  init() {
    this.canvasCtx = this.outputCanvas.getContext("2d");

    this.outputCanvas.width = window.screen.width * window.devicePixelRatio;
    this.outputCanvas.height = window.screen.height * window.devicePixelRatio;

    this.initMediaPipe();
  }

  async initMediaPipe() {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    hands.onResults((results) => {
      results = this.normalizeHand(results);
      if (this.isAnalogicPage()) {
        const analogicGesture = new AnalogicGesture(
          this.child,
          this.outputCanvas,
          this.min,
          this.max,
          this.value,
          this.step,
          this.unit
        );
        analogicGesture.init(results, this.canvasCtx);
      } else {
        this.onHandsResult(results, this.canvasCtx);
      }
    });

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );

    const camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await hands.send({ image: this.videoElement });
      },
      width: 640,
      height: 340,
    });

    camera.start();
  }

  onHandsResult(results, canvasCtx) {
    this.detectHandMovement(results);
    let HAND;

    if (this.canvasRect == null)
      this.canvasRect = this.outputCanvas.getBoundingClientRect();

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

      for (let i = 0; i < HAND[0].length; i++) {
        let landmarks = HAND[0][i];

        let x = landmarks.x * this.outputCanvas.width;
        let y = landmarks.y * this.outputCanvas.height;
        let z = Math.abs(landmarks.z);
        let markColor = "black";

        if (i === 8) {
          // POINTER FINGER
          let rect = this.canvasRect;
          let xM = landmarks.x * (rect.right - rect.left) + rect.left;
          let yM = landmarks.y * (rect.bottom - rect.top) + rect.top;

          const elements = document.elementsFromPoint(xM, yM);

          // IDENTIFICANDO BOTÃO SELECIONADO PELO DEDO INDICADOR
          let buttonElement = null;

          for (const element of elements) {
            if (element.tagName === "BUTTON") {
              buttonElement = element;
              break;
            }
          }
          // console.log(z)

          if (z > 0.1) {
            markColor = "red";
          } else {
            markColor = "blue";
            if (z < 0.005) this.enableToClick = true;
          }
          if (buttonElement != null) {
            buttonElement.style.borderColor = "red";

            if (z < 0.005 && this.enableToClick) {
              // console.log(buttonElement.id, this.child.currentSlide);
              // if(buttonElement.id == this.child.currentSlide){
              buttonElement.click();
              // }else{
              // this.child.slideTo(buttonElement);
              // }
              this.enableToClick = false;
            }
          }
        }

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 100 * z, 0, 2 * Math.PI);
        canvasCtx.fillStyle = markColor;
        canvasCtx.fill();
        canvasCtx.stroke();
      }
    }
    canvasCtx.restore();
  }

  detectHandMovement(results) {
    if (!results.multiHandLandmarks[0]) {
      return;
    }

    const handLandmarks = results.multiHandLandmarks[0];

    const palmBaseX = handLandmarks[0].x;

    const previousPalmBaseX = sessionStorage.getItem("previousPalmBaseX");
    const previousButtonIndex = parseInt(
      sessionStorage.getItem("previousButtonIndex")
    );
    const handClosed = this.isHandClosed(handLandmarks);

    if (previousPalmBaseX && handClosed) {
      const deltaX = palmBaseX - previousPalmBaseX;
      const buttonIndexAdd = -parseInt(deltaX * 7);
      const movementThreshold = 0.001;

      if (Math.abs(deltaX) > movementThreshold) {
        // console.log(buttonIndexAdd, previousButtonIndex, buttonIndexAdd - previousButtonIndex);
        this.child.slideToIndex(previousButtonIndex + buttonIndexAdd);
      }
    }

    if (handClosed && previousPalmBaseX === null) {
      sessionStorage.setItem("previousPalmBaseX", palmBaseX);
      sessionStorage.setItem("previousButtonIndex", this.child.currentSlide);
    } else if (!handClosed) {
      sessionStorage.removeItem("previousPalmBaseX");
      sessionStorage.removeItem("previousButtonIndex");
    }
  }

  isHandClosed(handLandmarks) {
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

  isAnalogicPage() {
    let pageContent = document.getElementsByClassName("analogic-page");
    if (pageContent.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  calculateDistance(point1, point2) {
    return Math.sqrt(
      (point2.x - point1.x) ** 2 +
        (point2.y - point1.y) ** 2 +
        (point2.z - point1.z) ** 2
    );
  }

  calculateHandCentroid(HAND) {
    let handCentroid = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < HAND[0].length; i++) {
      handCentroid.x += HAND[0][i].x;
      handCentroid.y += HAND[0][i].y;
      handCentroid.z += HAND[0][i].z;
    }
    handCentroid.x /= HAND[0].length;
    handCentroid.y /= HAND[0].length;
    handCentroid.z /= HAND[0].length;

    return handCentroid;
  }

  normalizeHand(results) {
    let HAND = results.multiHandLandmarks;
    if (HAND[0] != undefined) {
      let distance = this.calculateDistance(HAND[0][0], HAND[0][9]);
      let handCentroid = this.calculateHandCentroid(HAND);
      for (let i = 0; i < HAND[0].length; i++) {
        let landmarks = HAND[0][i];

        results.multiHandLandmarks[0][i].x =
          0.5 * ((landmarks.x - handCentroid.x) / distance) + 0.5;
        results.multiHandLandmarks[0][i].y =
          0.5 * ((landmarks.y - handCentroid.y) / distance) + 0.5;
        results.multiHandLandmarks[0][i].z =
          0.5 * ((landmarks.z - Math.abs(handCentroid.z)) / distance);
      }
    }

    return results;
  }
}

export default CameraFrame;
