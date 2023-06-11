var tempoLimite = 1000; // 1 segundo
var tempoLimite2 = 3000; // 2 segundos
var tempoDecorrido = 0;
var intervaloVerificacao = 100; // Intervalo de verificação (1ms)
var values = []
var updatedValue = -1
var canEditValue = -1
var alerta1 = 1
var alerta2 = 1

class AnalogicGesture {

    constructor(child, outputCanvas, min, max, value, step, unit) {
        this.child = child
        this.outputCanvas = outputCanvas;
        this.min = min
        this.max = max
        this.value = value
        this.step = step
        this.unit = unit
    }

    init(results, canvasCtx) {
        let HAND;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);

        this.child.clearButtons();

        var progressBar = document.getElementById('dynamicProgressBar');
        var propertyValue = document.getElementsByClassName('property-value')[0];
        if (alerta1 == 1) this.exibirAlerta("Faça um gesto de 'paz e amor' para entrar na tela de edição.");

        if (results.multiHandLandmarks.length > 0) {
            HAND = results.multiHandLandmarks;
            if (updatedValue == -1) {
                this.isPeaceAndLove(HAND)
                if (canEditValue != -1) {
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
                            let val = this.interpolate(hip, 800, 3000);
                            progressBar.value = val

                            propertyValue.innerHTML = val.toFixed(1) + this.unit

                            this.calculateTime(val)

                        }

                        canvasCtx.beginPath();
                        canvasCtx.arc(x, y, 100 * z, 0, 2 * Math.PI);
                        canvasCtx.fillStyle = markColor;
                        canvasCtx.fill();
                        canvasCtx.stroke();
                    }
                } else {
                    this.draw(HAND, canvasCtx)
                }
            } else {
                propertyValue.innerHTML = updatedValue + this.unit
                this.draw(HAND, canvasCtx)
                updatedValue = -1
                canEditValue = -1
                if (alerta2 == 1) this.exibirAlerta("O valor foi alterado com sucesso!");
            }
        }
        canvasCtx.restore();
    }
    isHandOpen(HAND) {
        return (
            HAND[0][4].y < HAND[0][2].y &&
            HAND[0][8].y < HAND[0][6].y &&
            HAND[0][12].y < HAND[0][10].y &&
            HAND[0][16].y < HAND[0][14].y &&
            HAND[0][20].y < HAND[0][18].y
        );
    }

    isPeaceAndLove(HAND) {
        const isThumbFolded = HAND[0][4].x < HAND[0][2].x
        const isIndexExtended = HAND[0][8].y < HAND[0][6].y;
        const isMiddleExtended = HAND[0][12].y < HAND[0][10].y;
        const isRingFolded = HAND[0][16].y > HAND[0][14].y;
        const isPinkyFoldded = HAND[0][20].x > HAND[0][18].x;
        let result = (isThumbFolded && isIndexExtended && isMiddleExtended && isRingFolded && isPinkyFoldded)
        if (result) {
            canEditValue = 1
        }
        return result;
    }

    draw(HAND, canvasCtx) {
        for (let i = 0; i < HAND[0].length; i++) {

            let landmarks = HAND[0][i];

            let x = landmarks.x * this.outputCanvas.width;
            let y = landmarks.y * this.outputCanvas.height;
            let z = Math.abs(landmarks.z);
            let markColor = 'black';

            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 100 * z, 0, 2 * Math.PI);
            canvasCtx.fillStyle = markColor;
            canvasCtx.fill();
            canvasCtx.stroke();
        }
    }

    calculateTime(val) {
        if (tempoDecorrido == 0) {
            values.push(val)
            tempoDecorrido += intervaloVerificacao;
        } else if (((val != this.min && val != this.max) && tempoDecorrido == tempoLimite) || ((val == this.min || val == this.max) && tempoDecorrido == tempoLimite2)) {
            updatedValue = val
            tempoDecorrido = 0
            values.pop()
        } else if (val == values[0]) {
            tempoDecorrido += intervaloVerificacao;
        } else {
            values.pop()
            tempoDecorrido = 0
        }

    }

    interpolate(x, min_clamp, max_clamp) {
        try {
            let val = parseFloat(x);
            let numIntervals = (this.max - this.min) / this.step;
            let range = (max_clamp - min_clamp) / numIntervals

            let index = parseInt((val - min_clamp) / range)
            let res = this.min + (this.step * index)

            return res;
        }
        catch (e) {
            console.log(e);
        }
        return
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

    exibirAlerta(mensagem) {
        const alerta = document.createElement('div');
        alerta.textContent = mensagem;
        alerta.style.position = 'fixed';
        alerta.style.top = '50%';
        alerta.style.left = '50%';
        alerta.style.transform = 'translate(-50%, -50%)';
        alerta.style.padding = '10px';
        alerta.style.background = 'yellow';
        alerta.style.border = '1px solid black';
        alerta.style.fontSize = '16px';

        document.body.appendChild(alerta);
        alerta1 = -1
        setTimeout(() => {
            alerta.style.display = 'none';
        }, 2000);
    }

}

export default AnalogicGesture;
