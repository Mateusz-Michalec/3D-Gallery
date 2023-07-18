document.getElementById("left").addEventListener("click", rotateLeft);
document.getElementById("right").addEventListener("click", rotateRight);
document.getElementById("up").addEventListener("click", rotateUp);
document.getElementById("down").addEventListener("click", rotateDown);
document.getElementById("zoomIn").addEventListener("click", zoomIn);
document.getElementById("zoomOut").addEventListener("click", zoomOut);
document.getElementById("play").addEventListener("click", play);

const playIcon = document.querySelector("#play img");

const galleryImg = document.querySelector(".gallery__img");
const horizontalInputRange = document.getElementById("horizontalRange");
horizontalInputRange.addEventListener("input", handleHorizonalInputRange);

let startingIndex = 2726;
let i = startingIndex;

// 3384 r658
// 4665 r1281

let isPlaying = false;
let intervalId;

let multipler = 1;

function changeImg(i) {
  galleryImg.src = `/images/small/IMG_${i}.jpg`;
}

function rotateLeft() {
  if (i === 2726) i = 2755;
  else if (i === 3384) i = 3413;
  else if (i === 4665) i = 4694;
  else i--;
  changeImg(i);
}

function rotateRight() {
  if (i === 2755) i = 2726;
  else if (i === 3413) i = 3384;
  else if (i === 4694) i = 4665;
  else i++;
  changeImg(i);
}

function rotateUp() {
  if (i < 3000) {
    i += 658;
    startingIndex += 658;
  } else if (i < 4000) {
    i += 1281;
    startingIndex += 1281;
  } else return;
  changeImg(i);
}

function rotateDown() {
  if (i > 4000) {
    i -= 1281;
    startingIndex -= 1281;
  } else if (i > 3000) {
    i -= 658;
    startingIndex -= 658;
  } else return;
  changeImg(i);
}

function play() {
  if (!isPlaying) {
    isPlaying = true;
    playIcon.src = "/images/buttons/pause.svg";
    playIcon.title = "zatrzymaj automatyczne obracanie";
    intervalId = setInterval(() => {
      rotateRight();
    }, 200);
  } else {
    isPlaying = false;
    playIcon.src = "/images/buttons/play.svg";
    playIcon.title = "uruchom automatyczne obracanie";
    clearInterval(intervalId);
  }
}

function handleHorizonalInputRange() {
  i = startingIndex + Number(horizontalInputRange.value);
  changeImg(i);
}

function zoomIn() {
  if (multipler < 2.5) multipler += 0.25;
  else return;
  galleryImg.style.webkitTransform = `scale(${multipler})`;
}

function zoomOut() {
  if (multipler > 1) multipler -= 0.25;
  else return;
  galleryImg.style.webkitTransform = `scale(${multipler})`;
}
