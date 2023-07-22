const playIcon = document.querySelector("#play img");
const galleryImg = document.querySelector(".gallery__img");

let i = 1; // 001 - 029
let row = 1; // 01 - 03

// play action variables
let isPlaying = false;
let intervalId;

let zoomValue = 1;

let xChange = 0; // when it is below zero, the user dragged to the left

function changeImg() {
  galleryImg.src = `images/lowres/jelonek-glowa-row-0${row}_${
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

function zoomIn() {
  if (zoomValue < 2.5) {
    zoomValue += 0.25;
    galleryImg.style.webkitTransform = `scale(${zoomValue})`;
  } else return;
}

function zoomOut() {
  if (zoomValue > 1) {
    zoomValue -= 0.25;
    galleryImg.style.webkitTransform = `scale(${zoomValue})`;
  } else return;
}

galleryImg.addEventListener("mousedown", function (e) {
  if (isPlaying) stopPlaying();
  e.preventDefault();
  const x = e.clientX;

  function rotateImg(e) {
    const xChange = e.clientX - x;
    // limit changing img
    if (xChange % 2 === 0) {
      const isToTheLeft = xChange < 0 ? true : false;
      if (isToTheLeft) rotateLeft();
      else rotateRight();
    } else return;
  }

  galleryImg.addEventListener("mousemove", rotateImg);

  galleryImg.addEventListener("mouseup", function () {
    galleryImg.removeEventListener("mousemove", rotateImg);
  });

  galleryImg.addEventListener("mouseleave", function () {
    galleryImg.removeEventListener("mousemove", rotateImg);
  });
});

document.getElementById("left").addEventListener("click", rotateLeft);
document.getElementById("right").addEventListener("click", rotateRight);
document.getElementById("up").addEventListener("click", rotateUp);
document.getElementById("down").addEventListener("click", rotateDown);
document.getElementById("zoomIn").addEventListener("click", zoomIn);
document.getElementById("zoomOut").addEventListener("click", zoomOut);
document.getElementById("play").addEventListener("click", play);
