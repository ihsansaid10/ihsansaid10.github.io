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
                "heart", "link", "folder"), ATAU emoji (misal "🎮"),
                ATAU kode <svg ...>...</svg> sendiri
       color  : (opsional) warna latar icon, contoh "#3b82f6" atau
                "linear-gradient(180deg,#ff8a00,#e52e71)"
       url    : link yang dibuka di tab baru
       action : (pengganti url) "message"  = buka popup pesan,
                                "spotify"  = buka popup Spotify,
                                "explorer" = buka App Explorer

     Contoh nambah tombol:
       { label: "My YouTube", icon: "▶️", color: "#d93025", url: "https://youtube.com/@kamu" },
  */
  buttons: [
    { label: "App Explorer",              icon: "folder",    color: "linear-gradient(180deg,#4fb3ff,#1f6fe0)", action: "explorer" },
    { label: "Send me a private message", icon: "mail",      color: "linear-gradient(180deg,#3f8fe0,#1f5fc4)", action: "message" },
    { label: "My Insta",                  icon: "instagram", color: "linear-gradient(45deg,#e8b84d,#e0671c 30%,#b8235f 60%,#4452b8)", url: "https://www.instagram.com/hsn_said2410/" },
    { label: "My GitHub",                 icon: "github",    color: "linear-gradient(180deg,#3a3f4d,#14161e)", url: "https://github.com/ihsansaid10" },
    { label: "My Spotify Playlist",       icon: "spotify",   color: "linear-gradient(180deg,#1fb85a,#0e8038)", action: "spotify" }
  ],

  /* Aplikasi di App Explorer. Mau nambah app? Tinggal tambah satu baris di bawah.

     Isi tiap app:
       name     : nama yang tampil
       url      : link app (dibuka di tab baru)
       icon     : sama kayak di dock (nama icon bawaan / emoji / kode <svg>)
       color    : (opsional) warna latar icon
       category : (opsional) kalau diisi, otomatis muncul jadi folder di sidebar
  */
  apps: [
    { name: "Mi Musica Favorita", url: "https://ihsansaid10.github.io/music-playlist", icon: "🎵", color: "linear-gradient(180deg,#ff7a9c,#d6336c)" },
    { name: "Font To PNG",        url: "https://ihsansaid10.github.io/fonttopng",      icon: "🔤", color: "linear-gradient(180deg,#9b8cff,#5b4bd6)" },
    { name: "Canon Zombie",       url: "https://ihsansaid10.github.io/canonzombie",    icon: "🧟", color: "linear-gradient(180deg,#6fcf7f,#2f8f4a)" },
    { name: "HTMLRacers",         url: "https://ihsansaid10.github.io/htmlracers",            icon: "🏎️", color: "linear-gradient(180deg,#ff8a5c,#d9402a)" },
    { name: "TriDy",              url: "https://ihsansaid10.github.io/tridy",                icon: "tridy", color: "linear-gradient(180deg,#ff8a5c,#d9402a)" }
  ]
};
