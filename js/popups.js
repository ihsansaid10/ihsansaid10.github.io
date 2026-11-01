/* POPUPS — pesan, kirim email, dan Spotify (buka/tutup pakai efek genie) */
const popup = document.getElementById("popup");
const messageBox = popup.querySelector(".popup-box");
const spotifyPopup = document.getElementById("spotify-popup");
const spotifyBox = spotifyPopup.querySelector(".spotify-box");
const spotifyFrame = spotifyPopup.querySelector("iframe");
const spotifySrc = spotifyFrame.src;

/* MESSAGE */
function openMessage() {
  if (popup.classList.contains("show") || isGenieBusy(messageBox)) return;
  genieOpen(messageBox, "message", () => popup.classList.add("show"));
}

function closeMessage(instant = false) {
  if (!popup.classList.contains("show") || popup.classList.contains("closing") || isGenieBusy(messageBox)) return;
  if (instant) { popup.classList.remove("show"); return; }

  popup.classList.add("closing");
  genieClose(messageBox, "message", () => popup.classList.remove("show", "closing"));
}

document.getElementById("close-popup").onclick = () => closeMessage();
popup.addEventListener("click", e => { if (e.target === popup) closeMessage(); });

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
    closeMessage();
  })
  .catch(() => alert("Failed to send message"))
  .finally(() => {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
  });
});

/* SPOTIFY */
function openSpotify() {
  if (spotifyPopup.classList.contains("show") || isGenieBusy(spotifyBox)) return;
  music.pause();
  spotifyFrame.src = spotifySrc;
  genieOpen(spotifyBox, "spotify", () => spotifyPopup.classList.add("show"));
}

function closeSpotify(instant = false) {
  if (!spotifyPopup.classList.contains("show") || spotifyPopup.classList.contains("closing") || isGenieBusy(spotifyBox)) return;

  // playlist langsung berhenti dan musik latar lanjut, animasi jalan setelahnya
  spotifyFrame.src = "";
  if (state.started) music.play().catch(() => {});

  if (instant) { spotifyPopup.classList.remove("show"); return; }

  spotifyPopup.classList.add("closing");
  genieClose(spotifyBox, "spotify", () => spotifyPopup.classList.remove("show", "closing"));
}

document.getElementById("close-spotify").onclick = () => closeSpotify();
spotifyPopup.addEventListener("click", e => { if (e.target === spotifyPopup) closeSpotify(); });

/* ESC menutup popup */
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  closeMessage();
  closeSpotify();
});