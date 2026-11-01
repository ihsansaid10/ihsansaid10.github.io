/* CLOCK — jam di menu bar dan lock screen */
function updateClock() {
  const now = new Date();
  const time = now
    .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false })
    .replace(".", ":");
  const date = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

  document.getElementById("lock-time").textContent = time;
  document.getElementById("lock-date").textContent = date;
  document.getElementById("menu-clock").textContent =
    now.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" }) + "  " + time;
}

updateClock();
setInterval(updateClock, 1000);
