/* TYPING — teks sisa tetap "dipesan" (transparan) jadi layout gak geser */
const texts = [
  "Hello!",
  "Nice to meet you!",
  "my name is Ihsan Said",
  "Lahir di Jakarta, 21 Mei 2010",
  "pelajar yang nyasar di YAPIDH, Bekasi",
  "born to love technology, not biology",
  "Manchester is Red, 'cuz blue is just for film, GGMU"
];

const typingText = document.getElementById("typing-text");
const typedEl = typingText.querySelector(".typed");
const restEl = typingText.querySelector(".rest");
const logo = document.getElementById("manutd-logo");

let textIndex = 0;
let charIndex = 0;
let deleting = false;
let typeTimer = null;

function renderTyped(text, n) {
  typedEl.textContent = text.slice(0, n);
  restEl.textContent = text.slice(n);
}

function typeLoop() {
  const text = texts[textIndex];
  const isMU = textIndex === texts.length - 1;
  typingText.classList.toggle("red-mode", isMU);
  logo.classList.toggle("show", isMU);

  if (!deleting) {
    renderTyped(text, ++charIndex);
    if (charIndex === text.length) {
      deleting = true;
      typeTimer = setTimeout(typeLoop, 1200);
      return;
    }
    typeTimer = setTimeout(typeLoop, 70);
    return;
  }

  renderTyped(text, --charIndex);
  if (charIndex === 0) {
    deleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }
  typeTimer = setTimeout(typeLoop, 40);
}

function resetTyping() {
  clearTimeout(typeTimer);
  textIndex = 0;
  charIndex = 0;
  deleting = false;
  renderTyped("", 0);
  typingText.classList.remove("red-mode");
  logo.classList.remove("show");
}
