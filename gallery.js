const playIcon = document.querySelector("#play img");
const galleryImg = document.querySelector(".gallery__img");

let i = 1; // 001 - 029
let row = 1; // 01 - 03

// play action variables
let isPlaying = false;
let intervalId;

let zoomValue = 1;

let xChange = 0; // when it is below zero user have dragged to the left

function changeImg() {
  galleryImg.src = `images/lowres/jelonek-glowa-row-0${row}_${
    i < 10 ? "00" : "0"
  }${i}.jpg`;
}

function rotateLeft(value = 1) {
  i -= value;
  if (i <= 0) i = 29;
  changeImg();
}

function rotateRight(value = 1) {
  i += value;
  if (i >= 30) i = 1;
  changeImg();
}

function rotateUp() {
  if (row < 3) row++;
  changeImg();
}

function rotateDown() {
  if (row > 1) row--;
  changeImg();
}

function play() {
  if (!isPlaying) {
    isPlaying = true;
    playIcon.src = "images/buttons/pause.svg";
    playIcon.title = "zatrzymaj automatyczne obracanie";
    intervalId = setInterval(() => {
      rotateRight();
    }, 150);
  } else {
    isPlaying = false;
    playIcon.src = "images/buttons/play.svg";
    playIcon.title = "uruchom automatyczne obracanie";
    clearInterval(intervalId);
  }
}

function zoomIn() {
  if (zoomValue < 2.5) zoomValue += 0.25;
  else return;
  galleryImg.style.webkitTransform = `scale(${zoomValue})`;
}

function zoomOut() {
  if (zoomValue > 1) zoomValue -= 0.25;
  else return;
  galleryImg.style.webkitTransform = `scale(${zoomValue})`;
}

galleryImg.addEventListener("mousedown", function (e) {
  e.preventDefault();
  const x = e.clientX;

  function rotateImg(e) {
    const xChange = e.clientX - x;
    // limit changing img
    if (xChange % 6 === 0) {
      const isToTheLeft = xChange < 0 ? true : false;
      if (isToTheLeft) rotateLeft();
      else rotateRight();
    } else return;
  }

  galleryImg.addEventListener("mousemove", rotateImg);

  galleryImg.addEventListener("mouseup", function () {
    galleryImg.removeEventListener("mousemove", rotateImg);
  });
});

document.getElementById("left").addEventListener("click", () => rotateLeft());
document.getElementById("right").addEventListener("click", () => rotateRight());
document.getElementById("up").addEventListener("click", rotateUp);
document.getElementById("down").addEventListener("click", rotateDown);
document.getElementById("zoomIn").addEventListener("click", zoomIn);
document.getElementById("zoomOut").addEventListener("click", zoomOut);
document.getElementById("play").addEventListener("click", play);
