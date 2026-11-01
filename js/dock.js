/* DOCK — tombol dibuat dari CONFIG.buttons */
const DOCK_ACTIONS = {
  message: openMessage,
  spotify: openSpotify,
  explorer: openExplorer
};

const dock = document.getElementById("dock-apps");
const dockButtons = {};   // action -> tombol dock (dipakai genie.js sebagai titik tujuan)

CONFIG.buttons.forEach(b => {
  const btn = document.createElement("button");
  btn.className = "dock-item";
  btn.dataset.label = b.label;
  btn.setAttribute("aria-label", b.label);
  btn.appendChild(createIcon(b.icon, b.color));

  btn.onclick = () => {
    const action = DOCK_ACTIONS[b.action];
    if (action) action();
    else if (b.url) openLink(b.url);
  };

  if (b.action) dockButtons[b.action] = btn;
  dock.appendChild(btn);
});