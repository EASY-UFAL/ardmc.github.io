class CameraFrame {
    
    constructor(child) {
        this.child = child
        this.canvasRect = null;
        this.enableToClick = false;
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
                            console.log(buttonElement.id, this.child.currentSlide);
                            if(buttonElement.id == this.child.currentSlide){
                                buttonElement.click();
                            }else{
                                this.child.slideTo(buttonElement);
                            }
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
}

export default CameraFrame;