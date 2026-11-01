/* CORE — state bersama, musik, dan label yang diambil dari config.js */
emailjs.init("yt_2tMSGDfmCDqOxi");

const state = {
  started: false,       // sudah login atau belum
  shuttingDown: false   // lagi proses shut down atau tidak
};

const music = document.getElementById("bg-music");
const openLink = url => window.open(url, "_blank", "noopener");

/* APPLY CONFIG */
document.getElementById("login-label").textContent = CONFIG.loginLabel;
document.getElementById("support-cta").href = CONFIG.support.url;
document.getElementById("support-label").textContent = CONFIG.support.label;
