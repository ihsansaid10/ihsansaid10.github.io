emailjs.init("yt_2tMSGDfmCDqOxi");

const texts = [
  "Hello!",
  "Nice to meet you!",
  "my name is Ihsan Said",
  "Lahir di Jakarta, 21 Mei 2010",
  "pelajar yang nyasar di YAPIDH, Bekasi",
  "born to love technology, not biology",
  "Manchester is Red, and always will be, GGMU"
];

const intro = document.getElementById("intro");
const main = document.getElementById("main-content");
const typingText = document.getElementById("typing-text");
const logo = document.getElementById("manutd-logo");
const music = document.getElementById("bg-music");

let i = 0, j = 0, del = false, started = false;

intro.onclick = () => {
  if (started) return;
  started = true;

  intro.classList.add("hide");
  document.body.classList.add("grid");
  main.classList.add("show");

  music.volume = 0.4;
  music.play().catch(()=>{});

  typeLoop();
};

function typeLoop() {
  const isMU = i === texts.length - 1;

  if (isMU) {
    typingText.classList.add("red-mode");
    logo.classList.add("show");
  } else {
    typingText.classList.remove("red-mode");
    logo.classList.remove("show");
  }

  if (!del) {
    typingText.textContent = texts[i].slice(0, ++j);
    if (j === texts[i].length) setTimeout(() => del = true, 1200);
  } else {
    typingText.textContent = texts[i].slice(0, --j);
    if (j === 0) {
      del = false;
      i = (i + 1) % texts.length;
    }
  }

  setTimeout(typeLoop, del ? 40 : 70);
}

/* MESSAGE POPUP */
const pmBtn = document.getElementById("pm-btn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");

pmBtn.onclick = () => popup.classList.add("show");
closePopup.onclick = () => popup.classList.remove("show");

/* EMAIL */
document.getElementById("email-form").addEventListener("submit", e => {
  e.preventDefault();

  emailjs.send("service_ryt27zf", "template_7g723co", {
    from_name: e.target.from_name.value,
    reply_to: e.target.reply_to.value,
    message: e.target.message.value
  })
  .then(() => {
    alert("Message sent!");
    e.target.reset();
    popup.classList.remove("show");
  })
  .catch(() => alert("Failed to send message"));
});

/* REDIRECTS */
document.getElementById("insta-btn").onclick = () =>
  window.open("https://www.instagram.com/hsn_said2410/", "_blank");

document.getElementById("github-btn").onclick = () =>
  window.open("https://github.com/ihsansaid10", "_blank");

/* SPOTIFY POPUP */
const spotifyPopup = document.getElementById("spotify-popup");
document.getElementById("spotify-btn").onclick = () =>
  spotifyPopup.classList.add("show");

document.getElementById("close-spotify").onclick = () =>
  spotifyPopup.classList.remove("show");

document.getElementById("snake-btn").onclick = () =>
  window.open("https://ihsansaid10.github.io/snake.html", "_blank");

document.getElementById("petsim-btn").onclick = () =>
  window.open("https://ihsansaid10.github.io/html-petsim/index.html", "_blank");


