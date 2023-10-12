const galleries = document.querySelectorAll(".gallery");

galleries.forEach((gallery) => {
  const artwok = gallery.getAttribute("data-artwork");
  const img = gallery.querySelector(".gallery__img");

  const playIcon = gallery.querySelector(".gallery__play-btn img");
  const fullScreenIcon = gallery.querySelector(".gallery__fullscreen-btn");
  const imgWrapper = gallery.querySelector(".gallery__img-wrapper");

  let i = 1; // 001 - 029
  let row = 1; // 01 - 03

  // play action variables
  let isPlaying = false;
  let intervalId;

  // zoom
  let zoomValue = 1.5;
  let isZooming = false;

  let xStart = 0,
    yStart = 0;

  let maxDx, maxDy;

  let currentImgPosX = 0,
    currentImgPosY = 0;

  //fullscreen variables
  let isFullScreen = false;

  // rotation limiter
  const THRESHOLD_DISTANCE = 10;
  let xChange = 0; // when it is below zero, the user dragged to the left

  function changeImg() {
    img.src = `images/${artwok}/${
      isFullScreen ? "highres" : "lowres"
    }/${artwok}-row-0${row}_${i < 10 ? "00" : "0"}${i}.jpg`;
  }

  changeImg();

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
    playIcon.src = "images/buttons/pause.svg";
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

  // Zooming

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

  function setMobileZoomCords() {
    const rect = imgWrapper.getBoundingClientRect();

    const zoomedImgWidth = rect.width * zoomValue;
    const zoomedImgHeight = rect.height * zoomValue;

    maxDx = (zoomedImgWidth - rect.width) / 2 - 10;
    maxDy = (zoomedImgHeight - rect.height) / 2 - 10;
  }

  function getInitTouchCords(e) {
    imgWrapper.removeEventListener("mousemove", zooming);
    xStart = e.touches[0].clientX;
    yStart = e.touches[0].clientY;
    updateImgPosition(e);
  }

  function mobileZooming(e) {
    e.preventDefault();

    const dx = e.touches[0].clientX - xStart;
    const dy = e.touches[0].clientY - yStart;

    let newPosX = currentImgPosX + dx;
    let newPosY = currentImgPosY + dy;

    if (Math.abs(newPosX) > maxDx) {
      if (newPosX > 0) newPosX = maxDx;
      else newPosX = maxDx * -1;
      currentImgPosX = newPosX;
    }

    if (Math.abs(newPosY) > maxDy) {
      if (newPosY > 0) newPosY = maxDy;
      else newPosY = maxDy * -1;
      currentImgPosY = newPosY;
    }

    img.style.transform = `translate(${newPosX}px, ${newPosY}px) scale(${zoomValue})`;
  }

  function updateImgPosition(e) {
    currentImgPosX += e.changedTouches[0].clientX - xStart;
    currentImgPosY += e.changedTouches[0].clientY - yStart;
  }

  function zoomIn() {
    if (!isZooming) {
      isZooming = true;
      imgWrapper.addEventListener("mousemove", zooming);
      imgWrapper.addEventListener("mouseleave", centerImage);

      // mobile
      imgWrapper.addEventListener("touchstart", getInitTouchCords);
      imgWrapper.addEventListener("touchmove", mobileZooming);
      imgWrapper.addEventListener("touchend", updateImgPosition);
      scaleImage();
      setMobileZoomCords();
    } else if (isZooming && zoomValue < 2.5) {
      zoomValue += 0.5;
      scaleImage();
      setMobileZoomCords();
    }
  }

  function zoomOut() {
    if (isZooming) {
      isZooming = false;
      img.style.transform = "none";
      zoomValue = 1.5;
      imgWrapper.removeEventListener("mousemove", zooming);
      imgWrapper.removeEventListener("mouseleave", centerImage);

      //mobile
      imgWrapper.removeEventListener("touchstart", getInitTouchCords);
      imgWrapper.removeEventListener("touchmove", mobileZooming);
      imgWrapper.removeEventListener("touchend", updateImgPosition);
    }
  }

  img.addEventListener("dragstart", function (e) {
    e.preventDefault();
  });

  function handleImgRotate() {
    const isToTheLeft = xChange < 0 ? true : false;
    if (isToTheLeft) rotateLeft();
    else rotateRight();
  }

  // Mouse events

  function rotateImgOnMouse(e) {
    xChange = e.clientX - xStart;
    if (Math.abs(xChange) >= THRESHOLD_DISTANCE) {
      handleImgRotate(e);
      xStart = e.clientX;
    }
  }

  img.addEventListener("mousedown", function (e) {
    img.style.cursor = "grabbing";
    if (isPlaying) stopPlaying();
    xStart = e.clientX;
    img.addEventListener("mousemove", rotateImgOnMouse);
  });

  img.addEventListener("mouseup", function () {
    img.style.cursor = "grab";
    img.removeEventListener("mousemove", rotateImgOnMouse);
  });

  img.addEventListener("mouseleave", function () {
    img.style.cursor = "grab";
    img.removeEventListener("mousemove", rotateImgOnMouse);
  });

  // Touch events (mobile)

  function rotateImgOnTouch(e) {
    xChange = e.touches[0].clientX - xStart;
    if (Math.abs(xChange) >= THRESHOLD_DISTANCE) {
      handleImgRotate(e);
      xStart = e.touches[0].clientX;
    }
  }

  img.addEventListener("touchstart", function (e) {
    xStart = e.touches[0].clientX;
    if (!isZooming) img.addEventListener("touchmove", rotateImgOnTouch);
  });

  img.addEventListener("touchend", function () {
    img.removeEventListener("touchmove", rotateImgOnTouch);
  });

  img.addEventListener("touchcancel", function () {
    img.removeEventListener("touchmove", rotateImgOnTouch);
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      gallery.requestFullscreen().catch((err) => {
        alert(`Nie można przejść w tryb pełnoekranowy: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    isFullScreen = !isFullScreen;
    fullScreenIcon.src = `images/buttons/${
      isFullScreen ? "fullscreenoff" : "fullscreenon"
    }.svg`;
    fullScreenIcon.title = `${
      isFullScreen ? "wyłącz" : "włącz"
    } tryb pełnego ekranu`;
    changeImg();
  }

  gallery
    .querySelector(".gallery__left-btn")
    .addEventListener("click", handleRotateLeft);
  gallery
    .querySelector(".gallery__right-btn")
    .addEventListener("click", handleRotateRight);
  gallery.querySelector(".gallery__up-btn").addEventListener("click", rotateUp);
  gallery
    .querySelector(".gallery__down-btn")
    .addEventListener("click", rotateDown);
  gallery
    .querySelector(".gallery__zoom-in-btn")
    .addEventListener("click", zoomIn);
  gallery
    .querySelector(".gallery__zoom-out-btn")
    .addEventListener("click", zoomOut);
  playIcon.addEventListener("click", play);
  gallery
    .querySelector(".gallery__fullscreen-btn")
    .addEventListener("click", toggleFullscreen);
});
