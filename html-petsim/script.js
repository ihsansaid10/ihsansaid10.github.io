let scene, camera, renderer, controls, model;
let pets = [];
let activePetIndex = 0;
let achievements = new Set();
let spinSpeed = 0.005;
let gameInterval = null;

/* ===== DOM ===== */
const menu = document.getElementById("menu");
const petSelect = document.getElementById("petSelect");
const gameUI = document.getElementById("gameUI");

const hungerEl = hunger;
const funEl = fun;
const healthEl = health;
const energyEl = energy;
const loveEl = love;

const scoreValue = document.getElementById("scoreValue");
const leaderboard = document.getElementById("leaderboard");

/* ===== NOTIFICATION ===== */
function notify(msg){
  const n = document.createElement("div");
  n.className = "notification";
  n.textContent = msg;

  Object.assign(n.style,{
    position:"fixed",
    top:"20px",
    left:"50%",
    transform:"translateX(-50%)",
    background:"rgba(0,0,0,.85)",
    color:"#fff",
    padding:"10px 16px",
    borderRadius:"20px"
  });

  document.body.appendChild(n);
  setTimeout(()=>n.remove(),2000);
}

/* ===== UTIL ===== */
function currentPet(){
  return pets[activePetIndex];
}

function createPet(type){
  const name = prompt("Nama pet?");
  return {
    pet: type,
    name: name || type,
    hunger: 80,
    fun: 70,
    health: 90,
    energy: 80,
    love: 50,
    score: 0,
    aliveTime: 0
  };
}

/* ===== THREE.JS ===== */
scene = new THREE.Scene();
scene.background = new THREE.Color(0x2e2e2e);

camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enabled = false;

scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const d = new THREE.DirectionalLight(0xffffff, 1);
d.position.set(5, 10, 7);
scene.add(d);

function loadPetModel(path){
  const loader = new THREE.GLTFLoader();
  loader.load(path, gltf => {
    if (model) scene.remove(model);
    model = gltf.scene;
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
  });
}

/* ===== MENU FLOW ===== */
playBtn.onclick = () => {
  menu.classList.add("hidden");
  petSelect.classList.remove("hidden");
};

loadBtn.onclick = () => loadInput.click();

/* ===== LOAD GAME (BUG FIXED HERE) ===== */
loadInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);

    pets = data.pets || [];
    activePetIndex = data.activePetIndex || 0;
    achievements = new Set(data.achievements || []);

    /* 🔧 FIX PENTING */
    menu.classList.add("hidden");
    petSelect.classList.add("hidden");

    startGame(currentPet().pet);
    notify("💾 Save loaded");
  };
  reader.readAsText(file);
};

/* ===== PET SELECT ===== */
document.querySelectorAll("[data-pet]").forEach(btn => {
  btn.onclick = () => {
    pets.push(createPet(btn.dataset.pet));
    activePetIndex = pets.length - 1;

    menu.classList.add("hidden");
    petSelect.classList.add("hidden");

    startGame(btn.dataset.pet);
  };
});

/* ===== START GAME ===== */
function startGame(petType){
  gameUI.classList.remove("hidden");
  controls.enabled = true;

  loadPetModel(`assets/${petType}.glb`);
  startGameLoop();
}

/* ===== GAME LOOP ===== */
function startGameLoop(){
  if (gameInterval) clearInterval(gameInterval);

  gameInterval = setInterval(() => {
    pets.forEach(p => {
      p.hunger = Math.max(0, p.hunger - 1);
      p.fun = Math.max(0, p.fun - 1);
      p.energy = Math.max(0, p.energy - 1);

      if (p.hunger < 20 || p.energy < 20) {
        p.health = Math.max(0, p.health - 2);
      }

      if (p.health > 70 && p.fun > 70) {
        p.love = Math.min(100, p.love + 1);
      }

      p.score += Math.floor((p.love + p.health) / 25);
    });

    updateUI();
  }, 3000);
}

/* ===== UI UPDATE ===== */
function updateUI(){
  const p = currentPet();
  if (!p) return;

  hungerEl.textContent = p.hunger;
  funEl.textContent = p.fun;
  healthEl.textContent = p.health;
  energyEl.textContent = p.energy;
  loveEl.textContent = p.love;
  scoreValue.textContent = p.score;

  updateLeaderboard();
}

function updateLeaderboard(){
  leaderboard.innerHTML = "<b>🏆 Top Pets</b><br>";
  [...pets]
    .sort((a,b)=>b.score-a.score)
    .slice(0,3)
    .forEach((p,i)=>{
      leaderboard.innerHTML += `${i+1}. ${p.name} (${p.score})<br>`;
    });
}

/* ===== ACTIONS ===== */
feed.onclick = () => {
  currentPet().hunger = Math.min(100, currentPet().hunger + 20);
  notify("🍖 Pet fed");
};

play.onclick = () => {
  currentPet().fun = Math.min(100, currentPet().fun + 20);
  notify("🎾 Playing");
};

sleep.onclick = () => {
  currentPet().energy = Math.min(100, currentPet().energy + 30);
  notify("💤 Sleeping");
};

heal.onclick = () => {
  currentPet().health = Math.min(100, currentPet().health + 30);
  notify("❤️ Healed");
};

save.onclick = () => {
  const name = currentPet().name.replace(/\s+/g,"_");
  const data = { pets, activePetIndex, achievements:[...achievements] };
  const blob = new Blob([JSON.stringify(data)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pet-${name}.json`;
  a.click();
  notify("💾 Game saved");
};

switchPetBtn.onclick = () => {
  if (pets.length <= 1) return notify("Only one pet");
  activePetIndex = (activePetIndex + 1) % pets.length;
  loadPetModel(`assets/${currentPet().pet}.glb`);
};

/* ===== CAMERA ===== */
zoomIn.onclick = () => camera.position.z -= 0.3;
zoomOut.onclick = () => camera.position.z += 0.3;

/* ===== RENDER LOOP ===== */
function animate(){
  requestAnimationFrame(animate);
  if (model) model.rotation.y += spinSpeed;
  controls.update();
  renderer.render(scene, camera);
}
animate();
