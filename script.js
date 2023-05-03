// Select all slides
const slides = document.querySelectorAll(".slide");

// loop through slides and set each slides translateX
slides.forEach((slide, indx) => {
  slide.style.transform = `translateX(${indx * 100}%)`;
});

// select next slide button
const nextSlide = document.querySelector(".btn-next");

// current slide counter
let curSlide = 0;
// maximum number of slides
let maxSlide = slides.length - 1;

// add event listener and navigation functionality
nextSlide.addEventListener("click", function () {
  // check if current slide is the last and reset current slide
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  //   move slide by -100%
  slides.forEach((slide, indx) => {
    slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
  });
});

// select prev slide button
const prevSlide = document.querySelector(".btn-prev");

// add event listener and navigation functionality
prevSlide.addEventListener("click", function () {
  // check if current slide is the first and reset current slide to last
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }

  //   move slide by 100%
  slides.forEach((slide, indx) => {
    slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
  });
});

var HAND;  

var STATE = 'depressed';

const b1 = document.getElementById('b1');
const b2 = document.getElementById('b2');
const b3 = document.getElementById('b3');
const b4 = document.getElementById('b4');


const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

canvasElement.width = window.screen.width*window.devicePixelRatio;
canvasElement.height = window.screen.height*window.devicePixelRatio;

function clearButtons() {
  b1.style.borderColor = 'gray';
  b2.style.borderColor = 'gray';
  b3.style.borderColor = 'gray';
  b4.style.borderColor = 'gray';
}

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  clearButtons();

  if (results.multiHandLandmarks.length>0) {
    HAND = results.multiHandLandmarks;
    thumb = HAND[0][4];
    littleFinger = HAND[0][20];

    for (let i = 0; i<HAND[0].length; i++) {
  
      let landmarks = HAND[0][i];

      console.log(thumb, littleFinger);

      // Calcular a distância entre os dedos
      const distance = Math.sqrt(
          Math.pow(littleFinger.x - thumb.x, 2) +
          Math.pow(littleFinger.y - thumb.y, 2) +
          Math.pow(littleFinger.z - thumb.z, 2)
      );

      // Verificar se os dedos estão colados
      const areFingersClose = distance < 0.085;

      let x = landmarks.x*canvasElement.width;
      let y = landmarks.y*canvasElement.height;
      let z = Math.abs(landmarks.z);
      let elem = document.elementFromPoint(x, y);

      var color = 'black';

      if (i==20) color = 'red';

      if ((i==20) && z>0.1) {
        color = 'blue';
        if (elem != null) {
          elem.style.borderColor = 'red';
          
          if (STATE == 'depressed') {
            STATE = 'pressed';
          }
        }
      } 
      if ( (i==20) && (z<0.01) || (i==4) && (z<0.1)) {
        STATE = 'depressed';
      }
      let elemClass = 'undefined'
      if(elem != null){
        elemClass = elem.classList[0]
      } 
      if(STATE == 'pressed' && (i==4) && (z>0.1)){
        color = 'blue'
        if(areFingersClose){
          alert(`Você pressionou o botão ${elem.innerText}`)
          click(elem);
        }
      }

      canvasCtx.beginPath();
      canvasCtx.arc(x, y, 100*z, 0, 2 * Math.PI);
      canvasCtx.fillStyle = color;
      canvasCtx.fill();
      canvasCtx.stroke();
    }
  }
  canvasCtx.restore();
}



const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);




const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 340
});
camera.start();





function click(bt) {
  console.log(bt.id);

  var b = '0';
  if (bt.id == 'b2')
    b = '1';



    fetch('https://192.168.0.59/'+b, {
      method: 'GET',
      headers: {
          'Accept': 'application/html',
          'Access-Control-Allow-Origin': '*'
      },
  })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))


}