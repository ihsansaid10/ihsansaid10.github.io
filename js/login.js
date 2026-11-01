/* LOGIN — dari lock screen ke jendela utama, dan balik lagi saat reset */
const intro = document.getElementById("intro");
const main = document.getElementById("main-content");

intro.onclick = () => {
  if (state.started) return;
  state.started = true;

  intro.classList.add("hide");
  main.classList.add("show");

  music.currentTime = 0;
  music.volume = 0.4;
  music.play().catch(() => {});

  typeLoop();
};

function resetSession() {
  resetTyping();
  state.started = false;
  main.classList.remove("show");
  intro.classList.remove("hide");
}
