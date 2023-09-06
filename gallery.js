const playIcon = document.querySelector("#play img");
const img = document.querySelector(".gallery__img");
const imgWrapper = document.querySelector(".gallery__img-wrapper");

let i = 1; // 001 - 029
let row = 1; // 01 - 03

// play action variables
let isPlaying = false;
let intervalId;

// zoom
let zoomValue = 1.5;
let isZooming = false;

let xStart;
let xChange = 0; // when it is below zero, the user dragged to the left

function changeImg() {
  img.src = `images/lowres/jelonek-glowa-row-0${row}_${
    i < 10 ? "00" : "0"
  }${i}.jpg`;
}

function rotateLeft() {
  i--;
  if (i === 0) i = 29;
  changeImg();
}

function rotateRight() {
  i++;
  if (i > 29) i = 1;
  changeImg();
}

function rotateUp() {
  if (row < 3) {
    row++;
    changeImg();
  } else return;
}

function rotateDown() {
  if (row > 1) {
    row--;
    changeImg();
  } else return;
}

function startPlaying() {
  isPlaying = true;
  playIcon.src = "images/buttons/pause.svg";
  playIcon.title = "zatrzymaj automatyczne obracanie";
  intervalId = setInterval(() => {
    rotateRight();
  }, 150);
}

function stopPlaying() {
  isPlaying = false;
  playIcon.src = "images/buttons/play.svg";
  playIcon.title = "uruchom automatyczne obracanie";
  clearInterval(intervalId);
}

function play() {
  if (isPlaying === false) startPlaying();
  else stopPlaying();
}

// Actions for left and right btns

function handleRotateLeft() {
  if (isPlaying) stopPlaying();
  rotateLeft();
}

function handleRotateRight() {
  if (isPlaying) stopPlaying();
  rotateRight();
}

function centerImage() {
  img.style.transformOrigin = `50% 50%`;
}

function scaleImage() {
  img.style.transform = `scale(${zoomValue})`;
}

function zooming(e) {
  const rect = imgWrapper.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  img.style.transformOrigin = `${x}px ${y}px`;
}

function mobileZooming(e) {
  e.preventDefault();
  const rect = imgWrapper.getBoundingClientRect();

  const x = e.touches[0].clientX - rect.left;
  const y = e.touches[0].clientY - rect.top;

  if (x > 0 && x < rect.width && y > 0 && y < rect.height)
    img.style.transformOrigin = `${x}px ${y}px`;
  else centerImage();
}

function zoomIn() {
  if (!isZooming) {
    isZooming = true;
    imgWrapper.addEventListener("mousemove", zooming);
    imgWrapper.addEventListener("mouseleave", centerImage);
    imgWrapper.addEventListener(
      "touchmove",
      (e) => {
        mobileZooming(e);
      },
      { passive: false }
    );
    scaleImage();
  } else if (isZooming && zoomValue < 2.5) {
    zoomValue += 0.5;
    scaleImage();
  }
}

function zoomOut() {
  if (isZooming) {
    isZooming = false;
    img.style.transform = "none";
    imgWrapper.removeEventListener("mousemove", zooming);
    imgWrapper.removeEventListener("mouseleave", centerImage);
    imgWrapper.removeEventListener("touchmove", mobileZooming);
  }
}

img.addEventListener("dragstart", function (e) {
  e.preventDefault();
});

function handleImgRotate() {
  // limit changing img
  if (xChange % 2 === 0) {
    const isToTheLeft = xChange < 0 ? true : false;
    if (isToTheLeft) rotateLeft();
    else rotateRight();
  } else return;
}

// Mouse events

function rotateImgOnMouse(e) {
  xChange = e.clientX - xStart;
  handleImgRotate();
}

img.addEventListener("mousedown", function (e) {
  if (isPlaying) stopPlaying();
  xStart = e.clientX;
  img.addEventListener("mousemove", rotateImgOnMouse);
});

img.addEventListener("mouseup", function () {
  img.removeEventListener("mousemove", rotateImgOnMouse);
});

img.addEventListener("mouseleave", function () {
  img.removeEventListener("mousemove", rotateImgOnMouse);
});

// Touch events (mobile)

function rotateImgOnTouch(e) {
  xChange = e.touches[0].clientX - xStart;
  handleImgRotate();
}

img.addEventListener("touchstart", function (e) {
  //if (isPlaying) stopPlaying();
  xStart = e.touches[0].clientX;
  if (!isZooming) img.addEventListener("touchmove", rotateImgOnTouch);
});

img.addEventListener("touchend", function () {
  img.removeEventListener("touchmove", rotateImgOnTouch);
});

img.addEventListener("touchcancel", function () {
  img.removeEventListener("touchmove", rotateImgOnTouch);
});

document.getElementById("left").addEventListener("click", handleRotateLeft);
document.getElementById("right").addEventListener("click", handleRotateRight);
document.getElementById("up").addEventListener("click", rotateUp);
document.getElementById("down").addEventListener("click", rotateDown);
document.getElementById("zoomIn").addEventListener("click", zoomIn);
document.getElementById("zoomOut").addEventListener("click", zoomOut);
document.getElementById("play").addEventListener("click", play);
