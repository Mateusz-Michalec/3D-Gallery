const galleries = document.querySelectorAll("[data-artwork]");

galleries.forEach((gallery, artworkNumber) => {
  const artwork = gallery.getAttribute("data-artwork");
  const artworkDesc = gallery.getAttribute("data-artwork-desc");

  // Img and image wrapper
  gallery.classList.add("gallery-3d", "gallery-3d--loading");

  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("gallery-3d__img-wrapper");

  const loader = document.createElement("div");
  loader.classList.add("gallery-3d__loader");
  imgWrapper.appendChild(loader);

  const img = document.createElement("img");
  img.classList.add("gallery-3d__img");

  imgWrapper.appendChild(img);

  gallery.appendChild(imgWrapper);

  // Gallery buttons

  function createGalleryBtn(iconSrc, iconAlt) {
    const btn = document.createElement("button");
    const icon = document.createElement("img");

    icon.src = iconSrc;
    icon.alt = iconAlt;
    icon.title = iconAlt;

    btn.appendChild(icon);

    return btn;
  }

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.classList.add("gallery-3d__buttons");

  const rotateLeftBtn = createGalleryBtn("buttons/left.svg", "obróć w lewo");
  const rotateRightBtn = createGalleryBtn("buttons/right.svg", "obróć w prawo");
  const rotateUpBtn = createGalleryBtn("buttons/up.svg", "obróć do góry");
  const rotateDownBtn = createGalleryBtn("buttons/down.svg", "obróć w dół");
  const zoomInBtn = createGalleryBtn("buttons/zoomin.svg", "powiększ");
  const zoomOutBtn = createGalleryBtn("buttons/zoomout.svg", "pomniejsz");
  const playAnimationBtn = createGalleryBtn(
    "buttons/play.svg",
    "uruchom automatyczne obracanie"
  );
  const fullscreenBtn = createGalleryBtn(
    "buttons/fullscreenon.svg",
    "uruchom w pełnym ekranie"
  );

  buttonsWrapper.append(
    rotateLeftBtn,
    rotateRightBtn,
    rotateUpBtn,
    rotateDownBtn,
    zoomInBtn,
    zoomOutBtn,
    playAnimationBtn,
    fullscreenBtn
  );

  gallery.appendChild(buttonsWrapper);

  // Gallery desc

  const desc = document.createElement("p");
  desc.textContent = `${artworkNumber + 1}. ${artworkDesc}`;
  gallery.appendChild(desc);

  // Loading images

  let imagesInRow = [];
  let errorState = -1;
  let rows = 1;

  let currentIndex = 1;
  let row = 1;

  function loadImage(i) {
    if (errorState === 2) {
      imgWrapper.removeChild(loader);
      gallery.classList.remove("gallery-3d--loading");
      rows -= 1;
      return;
    }

    const img = new Image();
    img.onerror = function () {
      rows++;
      errorState += 1;
      loadImage(1);
      //console.clear(); Without it console will throw 404 errors, but we don't need to specify new attribute (number of images in each row)
    };
    img.src = `/obrotowe/${artwork}/${artwork}-row-0${rows}_${
      i < 10 ? "00" : "0"
    }${i}.jpg`;
    img.onload = function () {
      imagesInRow[rows - 1] = i;
      loadImage(i + 1);
    };
  }

  loadImage(1);

  const playIcon = playAnimationBtn.querySelector("img");
  const fullScreenIcon = fullscreenBtn.querySelector("img");

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
    img.src = `/obrotowe/${artwork}${
      isFullScreen ? "/highres" : ""
    }/${artwork}-row-0${row}_${
      currentIndex < 10 ? "00" : "0"
    }${currentIndex}.jpg`;
  }

  changeImg();

  function rotateLeft() {
    currentIndex--;
    if (currentIndex === 0) currentIndex = 29;
    changeImg();
  }

  function rotateRight() {
    currentIndex++;
    if (currentIndex > 29) currentIndex = 1;
    changeImg();
  }

  function rotateUp() {
    if (row < rows) {
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
    playIcon.src = "buttons/pause.svg";
    playIcon.title = "zatrzymaj automatyczne obracanie";
    intervalId = setInterval(() => {
      rotateRight();
    }, 150);
  }

  function stopPlaying() {
    isPlaying = false;
    playIcon.src = "buttons/play.svg";
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
    } else if (isZooming && zoomValue < 4) {
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
    fullScreenIcon.src = `buttons/${
      isFullScreen ? "fullscreenoff" : "fullscreenon"
    }.svg`;
    fullScreenIcon.title = `${
      isFullScreen ? "wyłącz" : "włącz"
    } tryb pełnego ekranu`;
    changeImg();
  }

  rotateLeftBtn.addEventListener("click", handleRotateLeft);
  rotateRightBtn.addEventListener("click", handleRotateRight);
  rotateUpBtn.addEventListener("click", rotateUp);
  rotateDownBtn.addEventListener("click", rotateDown);
  zoomInBtn.addEventListener("click", zoomIn);
  zoomOutBtn.addEventListener("click", zoomOut);
  playAnimationBtn.addEventListener("click", play);
  fullscreenBtn.addEventListener("click", toggleFullscreen);
});
