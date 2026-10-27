const CONFIG = {
  // Tulisan tombol di layar awal
  loginLabel: "Log In →",

  // Tombol di atas taskbar
  support: {
    label: "Support My Work",
    url: "https://saweria.co/ihsansaid10"
  },

  /* Tombol di taskbar (dock), urutannya sesuai urutan di bawah.

     Isi tiap tombol:
       label  : teks tooltip saat di-hover
       icon   : nama icon bawaan ("mail", "instagram", "github", "spotify",
                "heart", "link"), ATAU emoji (misal "🎮"),
                ATAU kode <svg ...>...</svg> sendiri
       color  : (opsional) warna latar icon, contoh "#3b82f6" atau
                "linear-gradient(180deg,#ff8a00,#e52e71)"
       url    : link yang dibuka di tab baru
       action : (pengganti url) "message" = buka popup pesan,
                "spotify" = buka popup Spotify

     Contoh nambah tombol:
       { label: "My YouTube", icon: "▶️", color: "#d93025", url: "https://youtube.com/@kamu" },
  */
  buttons: [
    { label: "Send me a private message", icon: "mail",      color: "linear-gradient(180deg,#3f8fe0,#1f5fc4)", action: "message" },
    { label: "My Insta",                  icon: "instagram", color: "linear-gradient(45deg,#e8b84d,#e0671c 30%,#b8235f 60%,#4452b8)", url: "https://www.instagram.com/hsn_said2410/" },
    { label: "My GitHub",                 icon: "github",    color: "linear-gradient(180deg,#3a3f4d,#14161e)", url: "https://github.com/ihsansaid10" },
    { label: "My Spotify Playlist",       icon: "spotify",   color: "linear-gradient(180deg,#1fb85a,#0e8038)", action: "spotify" }
  ]
};