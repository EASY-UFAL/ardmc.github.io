import {
    GestureRecognizer,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
class AnalogicGesture {

    constructor(child, outputCanvas) {
        this.child = child
        this.canvasRect = null;
        this.enableToClick = false;
        sessionStorage.removeItem('previousPalmBaseX');
        sessionStorage.removeItem('previousButtonIndex');
        this.lastVideoTime = -1;
        this.isHandOpen = true;
        this.outputCanvas = outputCanvas;
    }

    init(results, canvasCtx) {
        let HAND;

        if (this.canvasRect == null)
            this.canvasRect = this.outputCanvas.getBoundingClientRect();

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);

        this.child.clearButtons();

        var progressBar = document.getElementById('dynamicProgressBar');
        var propertyValue = document.getElementsByClassName('property-value')[0];

        if (results.multiHandLandmarks.length > 0) {
            HAND = results.multiHandLandmarks;
            const fingerIndices = [4, 8];

            for (let i = 0; i < HAND[0].length; i++) {

                let landmarks = HAND[0][i];
                let coords1 = HAND[0][fingerIndices[0]];
                let coords2 = HAND[0][fingerIndices[1]];

                let x = landmarks.x * this.outputCanvas.width;
                let y = landmarks.y * this.outputCanvas.height;
                let z = Math.abs(landmarks.z);
                let markColor = 'black';

                if (i === fingerIndices[0] || i === fingerIndices[1]) {  // THUMB FINGER
                    var X1 = coords1.x * this.outputCanvas.width;
                    var Y1 = coords1.y * this.outputCanvas.height;
                    var Z1 = Math.abs(coords1.z);
                    var X2 = coords2.x * this.outputCanvas.width;
                    var Y2 = coords2.y * this.outputCanvas.height;
                    var Z2 = Math.abs(coords2.z);


                    if (z > 0.2) {
                        markColor = 'blue';
                    } else {
                        markColor = 'red';
                    }
                    canvasCtx.beginPath();
                    canvasCtx.lineWidth = 5;
                    canvasCtx.moveTo(X1, Y1);
                    canvasCtx.lineTo(X2, Y2);

                    canvasCtx.stroke();
                    canvasCtx.moveTo((X1 + X2) / 2, (Y1 + Y2) / 2);
                    canvasCtx.arc((X1 + X2) / 2, (Y1 + Y2) / 2, 100 * (Z1 + Z2) / 2, 0, 2 * Math.PI);
                    canvasCtx.fillStyle = 'green';
                    canvasCtx.fill();

                    let hip = Math.hypot((X2 - X1) / ((Z1 + Z2) / 2), (Y2 - Y1) / ((Z1 + Z2 / 2)));

                    hip = this.clamp(hip, 800, 3000);
                    let val = this.interpolate(hip, 800, 3000, 0, 100);

                    progressBar.value = val

                    propertyValue.innerHTML = val.toFixed(0) + '%'
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
    clamp(x, min_clamp, max_clamp) {
        try {

            let val = parseFloat(x);
            if (val < min_clamp) return min_clamp;
            if (val > max_clamp) return max_clamp;
            return val;
        }
        catch (e) {
            console.log(e);
        }
        return
    }

    interpolate(value, oldMin, oldMax, newMin, newMax) {
        // Faz a interpolação linear
        const oldRange = oldMax - oldMin;
        const newRange = newMax - newMin;
        const newValue = ((value - oldMin) * newRange) / oldRange + newMin;

        return newValue;
    }


}

export default AnalogicGesture;
