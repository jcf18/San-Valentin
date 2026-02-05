// ✅ Ajusta si quieres
const fechaBonita = "14 de febrero";

// 15 cocinas/paises típicos (sin español ni indio)
const opciones = [
  "🍣 Japonés (Japón)",
  "🥟 Chino (China)",
  "🍝 Italiano (Italia)",
  "🌮 Mexicano (México)",
  "🧀 Francés (Francia)",
  "🍔 Americano (EE. UU.)",
  "🍜 Coreano (Corea)",
  "🍲 Vietnamita (Vietnam)",
  "🧆 Libanés (Líbano)",
  "🥙 Turco (Turquía)",
  "🍣 Peruano / Nikkei (Perú)",
  "🐟 Portugués (Portugal)",
  "🍛 Tailandés (Tailandia)",
  "🥘 Marroquí (Marruecos)",
  "🥟 Nepalí / Tibetano (Himalaya)"
];

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttons = document.getElementById("buttons");
const result = document.getElementById("result");

const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const spinAgainBtn = document.getElementById("spinAgainBtn");
const confirmBtn = document.getElementById("confirmBtn");

const choiceBox = document.getElementById("choiceBox");
const placeEl = document.getElementById("place");
const finalText = document.getElementById("finalText");

// --- Botón “No” que se escapa ---
function moveNoButton() {
  const container = buttons.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const padding = 10;
  const maxX = Math.max(padding, container.width - btn.width - padding);
  const maxY = Math.max(padding, container.height - btn.height - padding);

  const x = padding + Math.random() * (maxX - padding);
  const y = padding + Math.random() * (maxY - padding);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.right = "auto";
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener(
  "touchstart",
  (e) => { e.preventDefault(); moveNoButton(); },
  { passive: false }
);
noBtn.addEventListener("click", (e) => { e.preventDefault(); moveNoButton(); });

// --- Construir ruleta (fondo con conic-gradient + etiquetas) ---
const n = opciones.length;
const slice = 360 / n;

function buildWheel() {
  const stops = [];
  for (let i = 0; i < n; i++) {
    const a0 = i * slice;
    const a1 = (i + 1) * slice;
    const c = (i % 2 === 0) ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.25)";
    stops.push(`${c} ${a0}deg ${a1}deg`);
  }
  wheel.style.background = `conic-gradient(${stops.join(",")})`;

  wheel.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const label = document.createElement("div");
    label.className = "label";
    const short = opciones[i].replace(/\s*\(.*?\)\s*/g, ""); // quita (país)
    label.textContent = short;

    const angle = (i * slice) + (slice / 2);
    label.style.transform = `rotate(${angle}deg) translate(0, -140px) rotate(90deg)`;
    wheel.appendChild(label);
  }
}
buildWheel();

// --- Lógica “Sí” ---
yesBtn.addEventListener("click", () => {
  buttons.style.display = "none";
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});

// --- Giro único + bloqueo final ---
let currentRotation = 0;
let spinning = false;
let elegidoIdx = null;
let yaDecidido = false;

function setButtonsDuringSpin(isSpinning) {
  spinBtn.disabled = isSpinning;
  confirmBtn.disabled = isSpinning;
}

function bloquearDecision() {
  yaDecidido = true;

  // Quita opciones de reintentar
  spinBtn.disabled = true;
  spinBtn.textContent = "Decisión tomada 😈";
  spinBtn.style.cursor = "not-allowed";

  // Oculta el botón “Girar otra vez” por si estuviera visible
  spinAgainBtn.classList.add("hidden");

  // Deja el confirmar visible y listo
  confirmBtn.classList.remove("hidden");
}

function spinOnce() {
  if (spinning || yaDecidido) return;

  spinning = true;
  setButtonsDuringSpin(true);

  // Elegimos índice objetivo
  elegidoIdx = Math.floor(Math.random() * n);

  // Centro del sector
  const targetAngle = elegidoIdx * slice + slice / 2;

  // Para que ese sector quede arriba (puntero), rotación deseada
  const desiredRotation = 360 - targetAngle;

  // Vueltas extra para que se vea “pro”
  const extraSpins = 7 + Math.floor(Math.random() * 3); // 7-9 vueltas
  const finalRotation = currentRotation + extraSpins * 360 + desiredRotation;

  wheel.style.transition = "transform 4.2s cubic-bezier(.11,.92,.16,1)";
  wheel.style.transform = `rotate(${finalRotation}deg)`;

  window.setTimeout(() => {
    currentRotation = finalRotation % 360;

    // Mostrar resultado
    const elegido = opciones[elegidoIdx];
    placeEl.textContent = elegido;
    choiceBox.classList.remove("hidden");

    // Mensaje y bloqueo
    finalText.textContent = "🔒 Decisión tomada. No hay marcha atrás 😌💘";
    bloquearDecision();

    spinning = false;
    setButtonsDuringSpin(false);
  }, 4300);
}

spinBtn.addEventListener("click", spinOnce);

// Si alguien intenta clicar “girar otra vez” (por si acaso), no hace nada
spinAgainBtn.addEventListener("click", (e) => {
  e.preventDefault();
});

// Confirmar -> frase final con fecha
confirmBtn.addEventListener("click", () => {
  const elegido = opciones[elegidoIdx ?? 0];
  finalText.textContent = `Perfecto 😌💘 Entonces el ${fechaBonita} vamos a comer/cenar ${elegido}.`;
});
