var tempoLimite = 2000;
var tempoLimite2 = 3000;
var tempoDecorrido = 0;
var intervaloVerificacao = 100; // Intervalo de verificação (1ms)

function getDistanceBetweenTwoPoints(point1, point2) {
  return Math.sqrt(
    (point2.x - point1.x) ** 2 +
      (point2.y - point1.y) ** 2 +
      (point2.z - point1.z) ** 2
  );
}

function getDegreeBetweenTwoPoints(X1, X2, Y1, Y2) {
  var dy = Y2 - Y1;
  var dx = X2 - X1;
  var theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI;
  return theta;
}

function showMessage(mensagem, position = "50%", color = "yellow") {
  const alerta = document.createElement("div");
  alerta.textContent = mensagem;
  alerta.style.position = "fixed";
  alerta.style.top = position;
  alerta.style.left = "50%";
  alerta.style.transform = "translate(-50%, -50%)";
  alerta.style.padding = "10px";
  alerta.style.background = color;
  alerta.style.border = "1px solid black";
  alerta.style.fontSize = "16px";

  document.body.appendChild(alerta);
  setTimeout(() => {
    alerta.style.display = "none";
  }, 2000);
}

function clamp(x, min_clamp, max_clamp) {
  try {
    let val = parseFloat(x);

    if (val < min_clamp) return min_clamp;
    if (val > max_clamp) return max_clamp;

    return val;
  } catch (e) {
    console.log(e);
  }
  return;
}

function interpolate(x, step, min_value, max_value, min_clamp, max_clamp) {
  try {
    let val = parseFloat(x);
    let numIntervals = (max_value - min_value) / step;
    let range = (max_clamp - min_clamp) / numIntervals;

    let index = parseInt((val - min_clamp) / range);
    let res = min_value + step * index;

    return res;
  } catch (e) {
    console.log(e);
  }
  return;
}

function filterMeasurement(f, oldValue, currentVal) {
  let newVal = f * currentVal + (1.0 - f) * oldValue;
  return newVal;
}

function calculateTime(val, min_val, max_val, values) {
  var updatedValue = -1;
  if (tempoDecorrido == 0) {
    values.push(val);
    tempoDecorrido += intervaloVerificacao;
  } else if (
    (val != min_val && val != max_val && tempoDecorrido == tempoLimite) ||
    ((val == min_val || val == max_val) && tempoDecorrido == tempoLimite2)
  ) {
    updatedValue = val;
    tempoDecorrido = 0;
    values.pop();
  } else if (val == values[0]) {
    tempoDecorrido += intervaloVerificacao;
  } else {
    values.pop();
    tempoDecorrido = 0;
  }
  return values, updatedValue;
}

function normalizeHand(results) {
  let HAND = results.multiHandLandmarks;
  if (HAND[0] != undefined) {
    let distance = getDistanceBetweenTwoPoints(HAND[0][0], HAND[0][9]);
    for (let i = 0; i < HAND[0].length; i++) {
      let landmarks = HAND[0][i];

      results.multiHandLandmarks[0][i].x =
        0.5 * ((landmarks.x - 0.5) / distance) + 0.5;
      results.multiHandLandmarks[0][i].y =
        0.5 * ((landmarks.y - 0.5) / distance) + 0.5;
      results.multiHandLandmarks[0][i].z =
        0.5 * ((landmarks.z - 0.5) / distance);
    }
  }

  return results;
}

function isAnalogicPage() {
  let pageContent = document.getElementsByClassName("analogic-page");
  if (pageContent.length > 0) {
    return true;
  } else {
    return false;
  }
}

function isDigitalPage() {
  let pageContent = document.getElementsByClassName("digital-page");
  if (pageContent.length > 0) {
    return true;
  } else {
    return false;
  }
}
