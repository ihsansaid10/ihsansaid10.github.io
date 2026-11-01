/* SHUTDOWN — hanya aktif kalau tombol Power ditekan */
const shutdown = document.getElementById("shutdown");
const powerBtn = document.getElementById("power-btn");
const powerOn = document.getElementById("power-on");

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

powerBtn.onclick = () => {
  if (state.shuttingDown) return;
  state.shuttingDown = true;

  closeMessage(true);
  closeSpotify(true);
  closeExplorer(true);
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
    state.shuttingDown = false;
    intro.focus();
  }, 700);
};