/* GENIE — efek window tersedot ke icon dock (dan keluar lagi) ala macOS.
   Cara kerja: window difoto jadi N potongan horizontal. Tiap potongan
   dipersempit (scaleX), digeser ke arah icon, dan ditarik/ditekan vertikal
   (scaleY) sehingga seluruhnya menyambung jadi bentuk corong yang mulus.
   Bagian bawah duluan masuk ke icon, bagian atas nyusul. */

const GENIE = {
  duration: 620,  // ms
  lean: 0.55      // makin besar, bagian atas makin telat ngikut bagian bawah
};

const genieReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const genieCoarse = window.matchMedia("(pointer: coarse)");
const genieBusy = new WeakSet();

const isGenieBusy = el => genieBusy.has(el);
const clamp01 = v => Math.min(1, Math.max(0, v));
const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;

/* Titik tujuan = tengah icon di dock (dockButtons diisi dock.js) */
function genieTarget(action) {
  const btn = typeof dockButtons !== "undefined" ? dockButtons[action] : null;
  const icon = btn && btn.querySelector(".icon");
  if (icon) {
    const r = icon.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight - 40, w: 52 };
}

/* Salinan window untuk dipotong-potong. Iframe diganti placeholder
   (iframe lintas-domain gak bisa diklon tanpa reload). */
function genieBuildClone(el, w, h) {
  const base = el.cloneNode(true);

  const origFrames = el.querySelectorAll("iframe");
  base.querySelectorAll("iframe").forEach((f, i) => {
    const ph = document.createElement("div");
    ph.style.cssText = "height:" + origFrames[i].offsetHeight + "px;padding:10px";
    const inner = document.createElement("div");
    inner.style.cssText = "height:100%;border-radius:12px;background:#121212";
    ph.appendChild(inner);
    f.replaceWith(ph);
  });

  const origFields = el.querySelectorAll("input, textarea");
  base.querySelectorAll("input, textarea").forEach((f, i) => { f.value = origFields[i].value; });

  /* solid + tanpa blur, supaya sambungan antar potongan gak kelihatan */
  Object.assign(base.style, {
    position: "absolute", left: "0", top: "0", margin: "0",
    width: w + "px", height: h + "px", minHeight: "0", maxHeight: "none",
    transform: "none", animation: "none", visibility: "visible", opacity: "1",
    background: "#171a35", boxShadow: "none",
    backdropFilter: "none", webkitBackdropFilter: "none"
  });
  return base;
}

/* mode "in"  : window tersedot masuk icon (window asli tetap disembunyikan, caller yang menyembunyikan permanen)
   mode "out" : window keluar dari icon, lalu window asli ditampilkan */
function genie(el, target, mode) {
  return new Promise(resolve => {
    if (!target || genieReduced.matches || genieBusy.has(el)) { resolve(); return; }
    genieBusy.add(el);

    const rect = el.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    const N = genieCoarse.matches ? 16 : 28;
    const rows = h / N;
    const sMin = Math.max((target.w * 0.9) / w, 0.03);
    const K = GENIE.lean;
    const cx0 = rect.left + w / 2;

    const layer = document.createElement("div");
    layer.className = "genie-layer";
    layer.inert = true;

    const base = genieBuildClone(el, w, h);
    const strips = [];
    for (let i = 0; i < N; i++) {
      const s = document.createElement("div");
      s.className = "genie-strip";
      const top = i * rows;
      const bottom = Math.max(0, h - (i + 1) * rows - 1); // +1px tumpang tindih biar gak ada garis celah
      s.style.cssText =
        "left:" + rect.left + "px;top:" + rect.top + "px;width:" + w + "px;height:" + h + "px;" +
        "clip-path:inset(" + top + "px 0 " + bottom + "px 0)";
      s.appendChild(base.cloneNode(true));
      layer.appendChild(s);
      strips.push(s);
    }

    const ys = new Array(N + 1);

    /* p: 0 = window utuh, 1 = sudah habis masuk icon */
    function frame(p) {
      for (let b = 0; b <= N; b++) {
        const q = clamp01(p * (1 + K) - (1 - b / N) * K);
        const y0 = rect.top + b * rows;
        ys[b] = y0 + (target.y - y0) * easeInOutSine(q);
        if (b > 0 && ys[b] < ys[b - 1]) ys[b] = ys[b - 1];
      }
      for (let i = 0; i < N; i++) {
        const qm = clamp01(p * (1 + K) - (1 - (i + 0.5) / N) * K);
        const ex = easeInOutSine(qm);
        const sx = 1 + (sMin - 1) * ex;
        const cx = cx0 + (target.x - cx0) * ex;
        const sy = Math.max((ys[i + 1] - ys[i]) / rows, 0.0001);
        const e = cx - rect.left - (w / 2) * sx;
        const f = ys[i] - rect.top - i * rows * sy;
        strips[i].style.transform = "matrix(" + sx + ",0,0," + sy + "," + e + "," + f + ")";
      }
      layer.style.opacity = String(1 - clamp01((p - 0.86) / 0.14));
    }

    frame(mode === "in" ? 0 : 1);
    document.body.appendChild(layer);
    el.style.visibility = "hidden";

    const start = performance.now();
    function tick(now) {
      const t = clamp01((now - start) / GENIE.duration);
      const e = easeInOutCubic(t);
      frame(mode === "in" ? e : 1 - e);

      if (t < 1) { requestAnimationFrame(tick); return; }

      layer.remove();
      genieBusy.delete(el);
      if (mode === "out") el.style.visibility = "";
      resolve();
    }
    requestAnimationFrame(tick);
  });
}

/* show() dipanggil dulu supaya window punya ukuran, lalu animasi keluar dari icon */
async function genieOpen(el, action, show) {
  show();
  await genie(el, genieTarget(action), "out");
}

/* animasi tersedot dulu, baru hide() dipanggil */
async function genieClose(el, action, hide) {
  await genie(el, genieTarget(action), "in");
  hide();
  el.style.visibility = "";
}