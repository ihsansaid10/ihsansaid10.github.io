/* APP EXPLORER — jendela ala Finder, isinya dari CONFIG.apps */
const explorer = document.getElementById("explorer");
const xpBar = explorer.querySelector(".xp-titlebar");
const xpGrid = document.getElementById("xp-grid");
const xpSidebar = document.getElementById("xp-sidebar-list");
const xpSearch = document.getElementById("xp-search");
const xpPath = document.getElementById("xp-path");
const xpStatus = document.getElementById("xp-status");
const xpOpenBtn = document.getElementById("xp-open");
const xpViewBtns = explorer.querySelectorAll("[data-view]");

const xp = {
  apps: CONFIG.apps || [],
  category: "All",
  query: "",
  selected: null,
  minimized: false,
  els: new Map()   // app -> elemen tombolnya
};

const xpTouch = window.matchMedia("(pointer: coarse)");

function hostOf(url) {
  try { return new URL(url).host; } catch { return url; }
}

function visibleApps() {
  const q = xp.query.trim().toLowerCase();
  return xp.apps.filter(app =>
    (xp.category === "All" || app.category === xp.category) &&
    (!q || app.name.toLowerCase().includes(q))
  );
}

/* SIDEBAR — "All Apps" + folder dari field category (kalau ada) */
function renderSidebar() {
  const categories = [...new Set(xp.apps.map(a => a.category).filter(Boolean))];
  const entries = [{ key: "All", label: "All Apps" }, ...categories.map(c => ({ key: c, label: c }))];

  xpSidebar.replaceChildren();
  entries.forEach(entry => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "xp-side-item";
    btn.classList.toggle("active", entry.key === xp.category);

    const ico = document.createElement("span");
    ico.className = "xp-side-ico";
    ico.innerHTML = ICONS.folder;

    btn.append(ico, entry.label);
    btn.onclick = () => {
      xp.category = entry.key;
      renderSidebar();
      renderItems();
    };
    xpSidebar.appendChild(btn);
  });
}

/* ITEMS */
function renderItems() {
  const list = visibleApps();
  if (xp.selected && !list.includes(xp.selected)) xp.selected = null;

  xp.els.clear();
  xpGrid.replaceChildren();

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "xp-empty";
    empty.textContent = xp.query ? "No apps match your search." : "No apps yet. Add one in config.js.";
    xpGrid.appendChild(empty);
  }

  list.forEach(app => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "xp-item";
    item.classList.toggle("selected", app === xp.selected);

    const name = document.createElement("span");
    name.className = "xp-name";
    name.textContent = app.name;

    const meta = document.createElement("span");
    meta.className = "xp-meta";
    meta.textContent = hostOf(app.url);

    item.append(createIcon(app.icon, app.color), name, meta);

    item.onclick = () => {
      selectApp(app);
      if (xpTouch.matches) launchApp(app);   // di HP: sekali tap langsung buka
    };
    item.ondblclick = () => launchApp(app);
    item.onkeydown = e => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      launchApp(app);
    };

    xp.els.set(app, item);
    xpGrid.appendChild(item);
  });

  updateFooter(list.length);
}

/* Ganti seleksi tanpa render ulang, supaya double-click tetap kebaca */
function selectApp(app) {
  xp.selected = app;
  xp.els.forEach((el, a) => el.classList.toggle("selected", a === app));
  updateFooter(xp.els.size);
}

function updateFooter(count) {
  xpPath.textContent = xp.category === "All" ? "Apps" : "Apps › " + xp.category;
  xpStatus.textContent = xp.selected
    ? xp.selected.name + " — " + hostOf(xp.selected.url)
    : count + (count === 1 ? " item" : " items");
  xpOpenBtn.disabled = !xp.selected;
}

function launchApp(app) {
  if (app && app.url) openLink(app.url);
}

/* VIEW (grid / list) */
function setView(view) {
  xpGrid.classList.toggle("list", view === "list");
  xpViewBtns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
}

xpViewBtns.forEach(b => { b.onclick = () => setView(b.dataset.view); });

/* SEARCH, OPEN BUTTON, KLIK AREA KOSONG */
xpSearch.addEventListener("input", () => {
  xp.query = xpSearch.value;
  renderItems();
});
xpOpenBtn.onclick = () => launchApp(xp.selected);
xpGrid.addEventListener("click", e => {
  if (e.target === xpGrid) {
    xp.selected = null;
    xp.els.forEach(el => el.classList.remove("selected"));
    updateFooter(xp.els.size);
  }
});

/* GESER JENDELA lewat title bar (desktop saja) */
let dx = 0, dy = 0, dragStart = null;

function moveWindow() {
  explorer.style.setProperty("--dx", dx + "px");
  explorer.style.setProperty("--dy", dy + "px");
}

xpBar.addEventListener("pointerdown", e => {
  if (e.target.closest("button, input") || window.innerWidth <= 600) return;
  dragStart = { x: e.clientX - dx, y: e.clientY - dy };
  xpBar.setPointerCapture(e.pointerId);
});
xpBar.addEventListener("pointermove", e => {
  if (!dragStart) return;
  dx = e.clientX - dragStart.x;
  dy = e.clientY - dragStart.y;
  moveWindow();
});
xpBar.addEventListener("pointerup", () => { dragStart = null; });
xpBar.addEventListener("pointercancel", () => { dragStart = null; });

/* OPEN / MINIMIZE / CLOSE */
const explorerShown = () => explorer.classList.contains("show");

function hideExplorer() {
  explorer.classList.remove("show", "closing");
  explorer.setAttribute("aria-hidden", "true");
}

function openExplorer() {
  if (explorerShown() || isGenieBusy(explorer)) return;

  // buka baru = isi direset. Kalau balik dari minimize = persis seperti terakhir
  if (!xp.minimized) {
    xp.category = "All";
    xp.query = "";
    xp.selected = null;
    xpSearch.value = "";
    dx = 0; dy = 0;
    moveWindow();

    renderSidebar();
    renderItems();
    setView("grid");
  }
  xp.minimized = false;

  genieOpen(explorer, "explorer", () => {
    explorer.classList.add("show");
    explorer.setAttribute("aria-hidden", "false");
  });
}

function minimizeExplorer() {
  if (!explorerShown() || isGenieBusy(explorer) || explorer.classList.contains("closing")) return;
  xp.minimized = true;
  genieClose(explorer, "explorer", hideExplorer);
}

function closeExplorer(instant = false) {
  if (instant) xp.minimized = false;
  if (!explorerShown() || isGenieBusy(explorer) || explorer.classList.contains("closing")) return;
  xp.minimized = false;

  if (instant) { hideExplorer(); return; }
  explorer.classList.add("closing");
  setTimeout(hideExplorer, 180);
}

document.getElementById("xp-close").onclick = () => closeExplorer();
document.getElementById("xp-min").onclick = () => minimizeExplorer();

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeExplorer();
});