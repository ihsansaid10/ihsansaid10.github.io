emailjs.init("yt_2tMSGDfmCDqOxi");

const texts = [
  "Hello!",
  "Nice to meet you!",
  "my name is Ihsan Said",
  "Lahir di Jakarta, 21 Mei 2010",
  "pelajar yang nyasar di YAPIDH, Bekasi",
  "born to love technology, not biology",
  "Manchester is Red, 'cuz blue is just for film, GGMU"
];

/* ICON BAWAAN (dipakai config.js) */
const ICONS = {
  mail: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 1l8 6 8-6"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.7" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16.8" cy="7.2" r="1.1" fill="currentColor"/></svg>',
  github: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
  spotify: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6.5 9.3c3.8-1.1 8-.8 11.2 1.2"/><path d="M7.3 12.8c3.1-.8 6.3-.5 8.9 1.1"/><path d="M8.1 16c2.4-.6 4.7-.4 6.7.8"/></g></svg>',
  heart: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 2.7 5 6 5c2 0 3.4 1 4.2 2.4h3.6C14.6 6 16 5 18 5c3.3 0 5.2 3.3 3.6 6.8C19.5 16.4 12 21 12 21z"/></svg>',
  link: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1"/><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/></g></svg>'
};

const intro = document.getElementById("intro");
const main = document.getElementById("main-content");
const typingText = document.getElementById("typing-text");
const typedEl = typingText.querySelector(".typed");
const restEl = typingText.querySelector(".rest");
const logo = document.getElementById("manutd-logo");
const music = document.getElementById("bg-music");

/* APPLY CONFIG */
document.getElementById("login-label").textContent = CONFIG.loginLabel;
const supportCta = document.getElementById("support-cta");
supportCta.href = CONFIG.support.url;
document.getElementById("support-label").textContent = CONFIG.support.label;

const popup = document.getElementById("popup");
const spotifyPopup = document.getElementById("spotify-popup");
const spotifyFrame = spotifyPopup.querySelector("iframe");
const spotifySrc = spotifyFrame.src;

const openLink = url => window.open(url, "_blank", "noopener");

function openSpotify() {
  music.pause();
  spotifyFrame.src = spotifySrc;
  spotifyPopup.classList.add("show");
}

function closeSpotify() {
  if (!spotifyPopup.classList.contains("show")) return;
  spotifyFrame.src = "";
  spotifyPopup.classList.remove("show");
  if (started) music.play().catch(() => {});
}

const dock = document.getElementById("dock-apps");
CONFIG.buttons.forEach(b => {
  const btn = document.createElement("button");
  btn.className = "dock-item";
  btn.dataset.label = b.label;
  btn.setAttribute("aria-label", b.label);

  const icon = document.createElement("span");
  icon.className = "icon";
  if (b.color) icon.style.background = b.color;
  const ic = b.icon || "link";
  if (ICONS[ic]) icon.innerHTML = ICONS[ic];
  else if (ic.trim().startsWith("<svg")) icon.innerHTML = ic;
  else icon.textContent = ic;
  btn.appendChild(icon);

  btn.onclick = () => {
    if (b.action === "message") popup.classList.add("show");
    else if (b.action === "spotify") openSpotify();
    else if (b.url) openLink(b.url);
  };
  dock.appendChild(btn);
});

/* CLOCK (menu bar + lock screen) */
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(".", ":");
  const date = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
  document.getElementById("lock-time").textContent = time;
  document.getElementById("lock-date").textContent = date;
  document.getElementById("menu-clock").textContent =
    now.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" }) + "  " + time;
}
updateClock();
setInterval(updateClock, 1000);

/* TYPING — teks sisa tetap "dipesan" (transparan) jadi layout gak geser */
let i = 0, j = 0, del = false, started = false, typeTimer = null;

function render(text, n) {
  typedEl.textContent = text.slice(0, n);
  restEl.textContent = text.slice(n);
}

function typeLoop() {
  const text = texts[i];
  const isMU = i === texts.length - 1;
  typingText.classList.toggle("red-mode", isMU);
  logo.classList.toggle("show", isMU);

  if (!del) {
    render(text, ++j);
    if (j === text.length) {
      del = true;
      typeTimer = setTimeout(typeLoop, 1200);
      return;
    }
    typeTimer = setTimeout(typeLoop, 70);
    return;
  }

  render(text, --j);
  if (j === 0) {
    del = false;
    i = (i + 1) % texts.length;
  }
  typeTimer = setTimeout(typeLoop, 40);
}

/* LOG IN */
intro.onclick = () => {
  if (started) return;
  started = true;

  intro.classList.add("hide");
  main.classList.add("show");

  music.currentTime = 0;
  music.volume = 0.4;
  music.play().catch(() => {});

  typeLoop();
};

/* MESSAGE POPUP */
const closePopup = document.getElementById("close-popup");
closePopup.onclick = () => popup.classList.remove("show");
popup.addEventListener("click", e => { if (e.target === popup) popup.classList.remove("show"); });

/* EMAIL */
document.getElementById("email-form").addEventListener("submit", e => {
  e.preventDefault();
  const sendBtn = e.target.querySelector("button[type=submit]");
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending…";

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
  .catch(() => alert("Failed to send message"))
  .finally(() => {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
  });
});

/* SPOTIFY POPUP */
document.getElementById("close-spotify").onclick = closeSpotify;
spotifyPopup.addEventListener("click", e => { if (e.target === spotifyPopup) closeSpotify(); });

/* ESC closes any popup */
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  popup.classList.remove("show");
  closeSpotify();
});

/* SHUTDOWN — hanya aktif kalau tombol Power ditekan */
const shutdown = document.getElementById("shutdown");
const powerBtn = document.getElementById("power-btn");
const powerOn = document.getElementById("power-on");
let shuttingDown = false;

function fadeOutMusic() {
  const fade = setInterval(() => {
    if (music.volume > 0.05) {
      music.volume = Math.max(0, music.volume - 0.05);
    } else {
      clearInterval(fade);
      music.pause();
      music.currentTime = 0;
      music.volume = 0.4;
    }
  }, 60);
}

function resetSession() {
  clearTimeout(typeTimer);
  started = false;
  i = 0; j = 0; del = false;
  render("", 0);
  typingText.classList.remove("red-mode");
  logo.classList.remove("show");
  main.classList.remove("show");
  intro.classList.remove("hide");
}

powerBtn.onclick = () => {
  if (shuttingDown) return;
  shuttingDown = true;

  popup.classList.remove("show");
  closeSpotify();
  fadeOutMusic();

  shutdown.classList.add("active");
  void shutdown.offsetWidth;
  shutdown.classList.add("show", "loading");

  setTimeout(() => {
    resetSession();
    shutdown.classList.remove("loading");
    shutdown.classList.add("off");
    powerOn.focus();
  }, 2600);
};

powerOn.onclick = () => {
  shutdown.classList.remove("show");
  setTimeout(() => {
    shutdown.classList.remove("active", "off");
    shuttingDown = false;
    intro.focus();
  }, 700);
};
