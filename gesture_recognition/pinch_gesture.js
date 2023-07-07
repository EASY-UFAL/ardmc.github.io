var updatedValue = -1;
var alerta1 = 1;
var alerta2 = 1;
var oldValuesArray = [0.5];
let lineColor = "black";
let values = [];
var canEditValue = false;

const min_clamp = 0.0;
const max_clamp = 1.0;

class PinchGesture {
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

    var progressBar = document.getElementById("dynamicProgressBar");
    var propertyValue = document.getElementsByClassName("property-value")[0];
    if (alerta1 == 1) {
      showMessage(
        "Levante apenas o dedo mindinho para liberar a tela de edição."
      );
      alerta1 = -1;
    }

    if (results.multiHandLandmarks.length > 0) {
      HAND = results.multiHandLandmarks;
      HAND = normalizeHand(results).multiHandLandmarks;

      let quantityFingersUp = getRaisedFingersCount(HAND[0]);

      // draw hands
      // calc distance
      if (updatedValue == -1) {
        if (isLiberationGesture(HAND)) {
          canEditValue = true;
        }
        if (canEditValue) {
          const fingerIndices = [4, 8];

          for (let i = 0; i < HAND[0].length; i++) {
            let landmarks = HAND[0][i];
            let coords1 = HAND[0][fingerIndices[0]];
            let coords2 = HAND[0][fingerIndices[1]];

            let x = landmarks.x * this.outputCanvas.width;
            let y = landmarks.y * this.outputCanvas.height;
            let z = Math.abs(landmarks.z);
            let markColor = "black";

            if (i === fingerIndices[0] || i === fingerIndices[1]) {
              var X1 = coords1.x * this.outputCanvas.width;
              var Y1 = coords1.y * this.outputCanvas.height;
              var Z1 = Math.abs(coords1.z);
              var X2 = coords2.x * this.outputCanvas.width;
              var Y2 = coords2.y * this.outputCanvas.height;
              var Z2 = Math.abs(coords2.z);

              if (z > 0.2) {
                markColor = "blue";
              } else {
                markColor = "red";
              }
              canvasCtx.beginPath();
              canvasCtx.strokeStyle = lineColor;
              canvasCtx.stroke();
              canvasCtx.lineWidth = 5;
              canvasCtx.moveTo(X1, Y1);
              canvasCtx.lineTo(X2, Y2);

              canvasCtx.stroke();
              canvasCtx.moveTo((X1 + X2) / 2, (Y1 + Y2) / 2);
              canvasCtx.arc(
                (X1 + X2) / 2,
                (Y1 + Y2) / 2,
                (Z1 + Z2) / 2,
                0,
                2 * Math.PI
              );
              canvasCtx.fillStyle = "green";
              canvasCtx.fill();

              let dist = Math.sqrt(
                Math.pow(coords1.x - coords2.x, 2) +
                  Math.pow(coords1.y - coords2.y, 2)
              );
              console.log(dist);

              dist = clamp(dist, min_clamp, max_clamp);

              oldValuesArray.push(dist);
              let val = filterMeasurement(0.05, oldValuesArray[0], dist);
              oldValuesArray.shift();

              val = interpolate(
                val,
                this.step,
                this.min,
                this.max,
                min_clamp,
                max_clamp
              );
              progressBar.value = val;

              propertyValue.innerHTML = val.toFixed(1) + this.unit;

              let isReadyToSave = this.isReadyToSave(X1, X2, Y1, Y2);
              if (isReadyToSave == true) {
                lineColor = "red";
                values,
                  (updatedValue = calculateTime(
                    val,
                    this.min,
                    this.max,
                    values
                  ));
              } else {
                lineColor = "black";
              }
            }

            canvasCtx.beginPath();
            canvasCtx.arc(x, y, z, 0, 2 * Math.PI);
            canvasCtx.fillStyle = markColor;
            canvasCtx.fill();
            canvasCtx.stroke();
          }
        } else {
          this.draw(HAND, canvasCtx);
        }
      } else {
        propertyValue.innerHTML = updatedValue + this.unit;
        this.draw(HAND, canvasCtx);
        updatedValue = -1;
        canEditValue = false;
        values = [];
        showMessage("O valor foi alterado com sucesso!");
      }
    }
    canvasCtx.restore();
  }

  draw(HAND, canvasCtx) {
    for (let i = 0; i < HAND[0].length; i++) {
      let landmarks = HAND[0][i];

      let x = landmarks.x * this.outputCanvas.width;
      let y = landmarks.y * this.outputCanvas.height;
      let z = Math.abs(landmarks.z);
      let markColor = "black";

      canvasCtx.beginPath();
      canvasCtx.arc(x, y, 15 * z, 0, 2 * Math.PI);
      canvasCtx.fillStyle = markColor;
      canvasCtx.fill();
      canvasCtx.stroke();
    }
  }

  isReadyToSave(X1, X2, Y1, Y2) {
    let theta = getDegreeBetweenTwoPoints(X1, X2, Y1, Y2);
    return Math.abs(theta) >= 88 && Math.abs(theta) <= 92 ? true : false;
  }
}

export default PinchGesture;
