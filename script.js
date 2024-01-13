let data = [];
let timerId;
let time = 100;
let imgIndex = 0;
let loadingCount = 5;

function updateTimer() {
  time -= 0.5;
  if (time <= 0) {
    enlarge(imgIndex + 1);
    time = 100;
  }
  document.querySelector(".progress").style.width = time + "%";
  startTimer();
}
function stopTimer() {
  time = 100;
  document.querySelector(".progress").style.width = time + "%";
  clearTimeout(timerId);
}
function startTimer() {
  timerId = setTimeout(updateTimer, 25);
}
function loaded(event) {
  loadingCount -= 1;
  if (
    loadingCount === 0 &&
    document.querySelector(".play").textContent === "STOP"
  ) {
    startTimer();
  }
  event.target.classList.remove("loading");
}
/*Выше все, что касается полоски progress*/

function enlarge(index) {
  imgIndex = Number(index);
  if (imgIndex === data.length) {
    loadImgs();
  }
  document.querySelectorAll(".pictures div").forEach((item, i) => {
    if (i === imgIndex) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
  document.querySelector(".oneBigPicture img").src =
    data[imgIndex].download_url;
  document.querySelector(".oneBigPicture .authorName").textContent =
    data[imgIndex].author;
  document.querySelector(".oneBigPicture img").classList.add("loading");
}

function doImgs() {
  const images = document.querySelectorAll(".pictures img");
  data.forEach((item, i) => {
    images[i].classList.add("loading");
    images[i].src = item.download_url;
  });
  enlarge(0);
}

function loadImgs() {
  loadingCount = 5;
  stopTimer();
  clearTimeout(timerId);
  const page = Math.floor(Math.random() * (800 / 4));
  const url = "https://picsum.photos/v2/list?page=" + page + "&limit=4";
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      data = json;
      doImgs();
    });
}

function bigImgMaker(event) {
  if (event.target.tagName !== "IMG") return;
  stopTimer();
  enlarge(event.target.dataset.index);
  document.querySelector(".play").textContent = "PLAY";
}

function knopki(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "PLAY";
    stopTimer();
  } else {
    event.target.textContent = "STOP";
    startTimer();
  }
}

function init() {
  loadImgs();
  document.querySelector(".pictures").addEventListener("click", bigImgMaker);
  document.querySelector(".new").addEventListener("click", loadImgs);
  document.querySelectorAll("img").forEach((image) => {
    image.onload = loaded;
  });
  document.querySelector(".play").addEventListener("click", knopki);
}

window.addEventListener("DOMContentLoaded", init);
