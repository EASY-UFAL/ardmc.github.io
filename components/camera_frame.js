class CameraFrame {
    
    constructor(child) {
        this.child = child
        this.canvasRect = null;
        this.enableToClick = false;
        sessionStorage.removeItem('previousPalmBaseX');
        sessionStorage.removeItem('previousButtonIndex');
    }

    draw() {
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'input_video';
        this.videoElement.style = 'opacity: 100%';

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
        const canvasCtx = this.outputCanvas.getContext('2d');

        this.outputCanvas.width = window.screen.width*window.devicePixelRatio;
        this.outputCanvas.height = window.screen.height*window.devicePixelRatio;

        const hands = new Hands({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }});
        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        hands.onResults((results)=>{this.onCameraResult(results, canvasCtx)});

        const camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await hands.send({image: this.videoElement});
            },
            width: 640,
            height: 340
        });
        camera.start();
    }

    onCameraResult(results, canvasCtx) {
        this.detectHandMovement(results)
        let HAND;  
        
        if(this.canvasRect == null)
            this.canvasRect = this.outputCanvas.getBoundingClientRect();

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);

        this.child.clearButtons();

        if (results.multiHandLandmarks.length>0) {
            HAND = results.multiHandLandmarks;

            for (let i = 0; i<HAND[0].length; i++) {
        
                let landmarks = HAND[0][i];
            
                let x = landmarks.x*this.outputCanvas.width;
                let y = landmarks.y*this.outputCanvas.height;
                let z = Math.abs(landmarks.z);
                let markColor = 'black';

                if(i === 8){  // POINTER FINGER
                    let rect = this.canvasRect;
                    let xM = landmarks.x*(rect.right - rect.left) + rect.left;
                    let yM = landmarks.y*(rect.bottom - rect.top) + rect.top;

                    const elements = document.elementsFromPoint(xM, yM);

                    let buttonElement = null;

                    for (const element of elements) {
                        if (element.tagName === 'BUTTON') {
                            buttonElement = element;
                            break;
                        }
                    }
                    if(z > 0.2){
                        markColor = 'blue';
                    }else{
                        markColor = 'red';
                        if(z < 0.1)
                            this.enableToClick = true;
                    }
                    if (buttonElement != null) {
                        buttonElement.style.borderColor = 'red';
                    
                        if(z > 0.2 && this.enableToClick){
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
                canvasCtx.arc(x, y, 100*z, 0, 2 * Math.PI);
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
        const handClosed = this.isHandClosed(handLandmarks);

        if (previousPalmBaseX && handClosed) {
            const deltaX = palmBaseX - previousPalmBaseX;
            const buttonIndexAdd = -parseInt(deltaX * 7);
            const movementThreshold = 0.001;

            if (Math.abs(deltaX) > movementThreshold) {
                console.log(buttonIndexAdd, previousButtonIndex,  buttonIndexAdd - previousButtonIndex);
                this.child.slideToIndex(previousButtonIndex + buttonIndexAdd)
            }
        }

        if(handClosed && previousPalmBaseX === null){
            sessionStorage.setItem('previousPalmBaseX', palmBaseX);
            sessionStorage.setItem('previousButtonIndex', this.child.currentSlide);
        }else if(!handClosed){
            sessionStorage.removeItem('previousPalmBaseX');
            sessionStorage.removeItem('previousButtonIndex');
        }
    }


    isHandClosed(handLandmarks) {
        // Reference points for each finger
        const fingerIndices = [8, 12, 16, 20];

        // Threshold x to consider hand closed
        const xProximityThreshold = 0.15; 

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

}

export default CameraFrame;