let increaseTimeOut = 0;
let decreaseTimeOut = 0;
let canEditValue = 0;
class FingerCountingGesture {
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

    showMessage(
      "Feche a mão para entrar no modo de edição. \n 1 dedo:  incrementar; 2 dedos: decrementar, 4: confirmar; 5: voltar página.",
      "60%"
    );
    if (results.multiHandLandmarks.length > 0) {
      HAND = results.multiHandLandmarks;
      this.draw(HAND[0], canvasCtx);

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
            showMessage("Valor atualizado com sucesso!", "20%", "green");
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
        (isFingerUp(HAND, thumbFingerIndexes, true) && i == 4) ||
        (isFingerUp(HAND, indexFingerIndexes) && i == 8) ||
        (isFingerUp(HAND, middleFingerIndexes) && i == 12) ||
        (isFingerUp(HAND, ringFingerIndexes) && i == 16) ||
        (isFingerUp(HAND, pinkyFingerIndexes) && i == 20)
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

  increaseValue() {
    let pageContent = document.getElementById(this.id);
    if (pageContent.value <= this.max) {
      if (increaseTimeOut == 10) {
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
      if (decreaseTimeOut == 10) {
        pageContent.value -= this.step;
        pageContent.innerHTML = pageContent.value.toFixed(1) + this.unit;
        decreaseTimeOut = 0;
      } else {
        decreaseTimeOut++;
      }
    }
  }
}

export default FingerCountingGesture;
