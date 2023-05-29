import {
        GestureRecognizer,
        FilesetResolver
    } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
class CameraFrame {

    constructor(child) {
        this.child = child
        this.canvasRect = null;
        this.enableToClick = false;
        sessionStorage.removeItem('previousPalmBaseX');
        sessionStorage.removeItem('previousButtonIndex');
        this.lastVideoTime = -1;
        this.isHandOpen = true;
    }

    draw() {
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'input_video';
        this.videoElement.style = 'display: none';

        this.outputCanvas = document.createElement('canvas');
        this.outputCanvas.className = 'output_canvas';

        const frame = document.createElement('div');
        frame.className = 'screen';
        frame.appendChild(this.videoElement);
        frame.appendChild(this.outputCanvas);
        frame.appendChild(this.child.draw());

        this.init();

        return frame
    }

    init() {
        this.canvasCtx = this.outputCanvas.getContext('2d');

        this.outputCanvas.width = window.screen.width * window.devicePixelRatio;
        this.outputCanvas.height = window.screen.height * window.devicePixelRatio;

        this.initMediaPipe();
        
    }

    async initMediaPipe(){
        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        hands.onResults((results) => {
            if (this.isAnalogicPage()) {
                this.analogicGesture(results, this.canvasCtx)
            } else {
                this.onHandsResult(results, this.canvasCtx)
            }
        });

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
            },
            runningMode: "VIDEO"
        });

        const camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await hands.send({ image: this.videoElement });
                let nowInMs = Date.now();
                if (this.videoElement.currentTime !== this.lastVideoTime) {
                    this.lastVideoTime = this.videoElement.currentTime;
                    let results = gestureRecognizer.recognizeForVideo(this.videoElement, nowInMs);
                    this.onGestureRecognizerResult(results);
                }
            },
            width: 640,
            height: 340
        });

        camera.start();
    }

    onGestureRecognizerResult(results){
        if (results.gestures.length > 0) {
            const categoryName = results.gestures[0][0].categoryName;
            const categoryScore = parseFloat(
                results.gestures[0][0].score * 100
            ).toFixed(2);
            // console.log(`GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %`);
            if(categoryName === 'Closed_Fist'){
                this.isHandOpen = false;
            }else if(categoryName === 'Open_Palm'){
                this.isHandOpen = true;
            }
        }
    }

    onHandsResult(results, canvasCtx) {

        this.detectHandMovement(results);
        let HAND;

        if (this.canvasRect == null)
            this.canvasRect = this.outputCanvas.getBoundingClientRect();

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);

        this.child.clearButtons();

        if (results.multiHandLandmarks.length > 0) {
            HAND = results.multiHandLandmarks;

            for (let i = 0; i < HAND[0].length; i++) {

                let landmarks = HAND[0][i];

                let x = landmarks.x * this.outputCanvas.width;
                let y = landmarks.y * this.outputCanvas.height;
                let z = Math.abs(landmarks.z);
                let markColor = 'black';

                if (i === 8) {  // POINTER FINGER
                    let rect = this.canvasRect;
                    let xM = landmarks.x * (rect.right - rect.left) + rect.left;
                    let yM = landmarks.y * (rect.bottom - rect.top) + rect.top;

                    const elements = document.elementsFromPoint(xM, yM);


                    // IDENTIFICANDO BOTÃO SELECIONADO PELO DEDO INDICADOR
                    let buttonElement = null;

                    for (const element of elements) {
                        if (element.tagName === 'BUTTON') {
                            buttonElement = element;
                            break;
                        }
                    }
                    // console.log(z)
                    
                    if (z > 0.1) {
                        markColor = 'red';
                    } else {
                        markColor = 'blue';
                        if (z < 0.005)
                            this.enableToClick = true;
                    }
                    if (buttonElement != null) {
                        buttonElement.style.borderColor = 'red';

                        if (z < 0.005 && this.enableToClick && this.isHandOpen) {
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

        const previousPalmBaseX = sessionStorage.getItem('previousPalmBaseX');
        const previousButtonIndex = parseInt(sessionStorage.getItem('previousButtonIndex'));
        // const handClosed = this.isHandClosed(handLandmarks);
        const handClosed = !this.isHandOpen;

        if (previousPalmBaseX && handClosed) {
            const deltaX = palmBaseX - previousPalmBaseX;
            const buttonIndexAdd = -parseInt(deltaX * 7);
            const movementThreshold = 0.001;

            if (Math.abs(deltaX) > movementThreshold) {
                // console.log(buttonIndexAdd, previousButtonIndex, buttonIndexAdd - previousButtonIndex);
                this.child.slideToIndex(previousButtonIndex + buttonIndexAdd)
            }
        }

        if (handClosed && previousPalmBaseX === null) {
            sessionStorage.setItem('previousPalmBaseX', palmBaseX);
            sessionStorage.setItem('previousButtonIndex', this.child.currentSlide);
        } else if (!handClosed) {
            sessionStorage.removeItem('previousPalmBaseX');
            sessionStorage.removeItem('previousButtonIndex');
        }
    }


    // isHandClosed(handLandmarks) {
        // Reference points for each finger
        // const fingerIndices = [8, 12, 16, 20];

        // // Threshold x to consider hand closed
        // const xProximityThreshold = 0.1;

        // // X reference coordinate, using first finger
        // const referenceX = handLandmarks[fingerIndices[0]].x;

        // // Check if x coordinates of another fingers are close enough
        // for (let i = 1; i < fingerIndices.length; i++) {
        //     const currentX = handLandmarks[fingerIndices[i]].x;
        //     if (Math.abs(currentX - referenceX) > xProximityThreshold) {
        //         return false; // Coordinates X are not close enough, so hand is not closed
        //     }
        // }

        // return true; // Coordinates X are close enough, so hand is closed
    // }

    analogicGesture(results, canvasCtx) {
        let HAND;

        if (this.canvasRect == null)
            this.canvasRect = this.outputCanvas.getBoundingClientRect();

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);

        this.child.clearButtons();

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

                    // Range das Mãos 23 -> 190
                    // Range Equipamento 0 - 100
                    // Conversão dos ranges
                    let hip = Math.hypot((X2 - X1) / ((Z1 + Z2) / 2), (Y2 - Y1) / ((Z1 + Z2 / 2)));

                    hip = this.clamp(hip, 800, 3000);
                    let vol = this.interpolate(hip, 800, 3000, 0, 100) / 100;

                    canvasCtx.beginPath();
                    const lw = 4;
                    canvasCtx.lineWidth = lw;
                    canvasCtx.rect(50, 0, 85, 400)
                    canvasCtx.fillStyle = 'red';
                    canvasCtx.fillRect(50 + (lw / 2), 0 + (lw / 2), 85 - (lw / 2), 400 - (lw / 2));
                    canvasCtx.stroke();

                    canvasCtx.fillStyle = 'white';
                    canvasCtx.fillRect(50 + (lw / 2), 0 + (lw / 2), 85 - (lw / 2), ((1 - vol) * 400) - (lw / 2));
                    canvasCtx.stroke();

                    canvasCtx.fillStyle = 'black';
                    canvasCtx.font = '70px serif';
                    canvasCtx.fillText(Math.trunc(vol * 100) + '%', 150, 50);
                    canvasCtx.stroke();
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

    isAnalogicPage() {
        let pageContent = document.getElementsByClassName('analogic-page');
        if (pageContent.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}

export default CameraFrame;