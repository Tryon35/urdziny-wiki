let confettiInterval = null;

function startGame(n) {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";

  // zatrzymanie konfetti jeśli działa
  if (confettiInterval) {
    clearInterval(confettiInterval);
    confettiInterval = null;
  }

  if (n === 1) { startPuzzle(); }
  if (n === 2) { startHearts(); }
  if (n === 3) { startQuiz(); }
  if (n === 4) { startWishes(); }
  if (n === 5) { startReaction(); }
  if (n === 6) { startLabirynt(); }
  if (n === 7) { startBalloons(); }
}

/* --- Gra 1: Puzzle --- */
function startPuzzle() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>🧩 Puzzle</h2><p>Ułóż obrazek!</p>";
  const puzzle = document.createElement("div");
  puzzle.className = "puzzle";

  const positions = ["0px 0px", "-150px 0px", "0px -150px", "-150px -150px"];
  const pieces = [];
  positions.forEach((pos, i) => {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.style.backgroundImage = "url('Nowy projekt.jpg')";
    piece.style.backgroundPosition = pos;
    piece.draggable = true;
    piece.dataset.correct = i;
    pieces.push(piece);
  });

  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  pieces.forEach(p => puzzle.appendChild(p));
  gameArea.appendChild(puzzle);

  initPuzzle();
}
function initPuzzle() {
  const pieces = document.querySelectorAll(".piece");
  let dragged;
  pieces.forEach(piece => {
    piece.addEventListener("dragstart", () => { dragged = piece; });
    piece.addEventListener("dragover", e => e.preventDefault());
    piece.addEventListener("drop", e => {
      e.preventDefault();
      const tempBg = dragged.style.backgroundPosition;
      const tempCorrect = dragged.dataset.correct;
      dragged.style.backgroundPosition = piece.style.backgroundPosition;
      dragged.dataset.correct = piece.dataset.correct;
      piece.style.backgroundPosition = tempBg;
      piece.dataset.correct = tempCorrect;
      checkWin();
    });
  });
}
function checkWin() {
  const pieces = document.querySelectorAll(".piece");
  let ok = true;
  pieces.forEach((p, i) => { if (parseInt(p.dataset.correct) !== i) ok = false; });
  if (ok) {
    setTimeout(() => {
      alert("🎉 Brawo Kochanie! Ułożyłaś obrazek 💖");
      unlockNext(2);
    }, 200);
  }
}

/* --- Gra 2: Serduszka --- */
function startHearts() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>💖 Złap serduszka!</h2><p>Klikaj na serduszka zanim znikną!</p>";
  let count = 0;
  const interval = setInterval(() => {
    const heart = document.createElement("div");
    heart.textContent = "💖";
    heart.className = "heart";
    heart.style.left = Math.random() * 80 + "%";
    heart.style.top = "300px";
    heart.onclick = () => { heart.remove(); count++; if(count>=5){clearInterval(interval); alert('Świetnie!'); unlockNext(3);} };
    gameArea.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }, 1000);
}

/* --- Gra 3: Quiz --- */
function startQuiz() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>❓ Mini Quiz</h2>";
  const quiz = document.createElement("div");
  quiz.className = "quiz";
  quiz.innerHTML = `
    <div class="quiz-question">💘 Jak bardzo mnie kochasz? 😍</div>
    <button onclick="alert('Prawidłowa odpowiedź! Kochasz NAJBARDZIEJ ❤️'); unlockNext(4);">Bardzo!</button>
    <button onclick="alert('Spróbuj jeszcze raz 😘')">Średnio</button>
    <button onclick="alert('Na pewno więcej niż myślisz! 💕')">Malutko</button>
  `;
  gameArea.appendChild(quiz);
}

/* --- Gra 4: Życzenia + konfetti --- */
function startWishes() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2 class='wishes'>🎂 Wszystkiego najlepszego Kochanie! 💖</h2>";
  startConfetti();
  setTimeout(()=>{ unlockNext(5); }, 4000);
}
function startConfetti() {
  const gameArea = document.getElementById("game-area");
  confettiInterval = setInterval(() => {
    const symbols = ["🎊", "🎉", "💖", "✨"];
    const conf = document.createElement("div");
    conf.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    conf.style.position = "absolute";
    conf.style.left = Math.random() * window.innerWidth + "px";
    conf.style.top = "-20px";
    conf.style.fontSize = "24px";
    conf.style.animation = `fall ${3 + Math.random() * 2}s linear forwards`;
    gameArea.appendChild(conf);
    setTimeout(() => conf.remove(), 5000);
  }, 300);
}

/* --- Gra 5: Reakcja --- */
function startReaction() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>⚡ Test reakcji</h2><p>Kliknij przycisk gdy się pojawi!</p>";
  const btn = document.createElement("button");
  btn.textContent = "Czekaj...";
  btn.disabled = true;
  gameArea.appendChild(btn);

  const time = 2000 + Math.random()*3000;
  setTimeout(() => {
    btn.textContent = "Kliknij!";
    btn.disabled = false;
    const start = Date.now();
    btn.onclick = () => {
      const ms = Date.now()-start;
      alert("Twój czas reakcji: " + ms + " ms ⏱️");
      unlockNext(6);
    };
  }, time);
}

/* --- Gra 6: Labirynt (rysowanie linii) --- */
function startLabirynt() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>🔑 Labirynt</h2><p>Przeciągnij linię od klucza do serca!</p>";

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  gameArea.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  ctx.font = "40px Arial";
  ctx.fillText("🔑", 30, 60);
  ctx.fillText("❤️", 330, 360);

  let drawing = false;

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = "#ff3399";
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  canvas.addEventListener("mouseup", (e) => {
    drawing = false;
    if (e.offsetX > 300 && e.offsetY > 300) {
      alert("🎉 Udało się! Dotarłaś do serca 💖");
      unlockNext(7);
    }
  });
}


(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let DPR = window.devicePixelRatio || 1;

  function startBalloons() {
    DPR = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // przykładowe życzenia (możesz dodać/zmienić)
  const wishes = [
    "Wszystkiego najlepszego!",
    "Sto lat!",
    "Spełnienia marzeń!",
    "Szczęścia i zdrowia!",
    "Dużo miłości!",
    "Radości każdego dnia!",
    "Powodzenia!",
    "Niech się spełni!",
    "Uśmiechu na twarzy!",
    "Cudownego dnia!"
  ];

  // konfiguracja
  const MAX_BALLOONS = 120;
  const SPAWN_INTERVAL = 450; // ms między próbami stworzenia nowego balonika
  const COLORS = ["#ff6b6b","#ff8fab","#ffb86b","#ffd56b","#ff6bd7","#9b7bff","#6bd7ff"];

  class Balloon {
    constructor() {
      // losuj start X na CAŁEJ szerokości ekranu (precise)
      this.x = Math.random() * window.innerWidth;
      // start poniżej ekranu (możemy też losować z niewielkim ujemnym y żeby pojawiały się od razu)
      this.y = window.innerHeight + 30 + Math.random()*100;
      // prędkość unoszenia - losowa, by różniły się czasy lotu
      this.vy = 0.3 + Math.random() * 1.0; // piksele na klatkę przy DPR=1
      // delikatne boczne kołysanie
      this.swayAmp = 10 + Math.random() * 30; // amplituda kołysania w px
      this.swayFreq = 0.002 + Math.random() * 0.005; // częstotliwość
      this.swayPhase = Math.random() * Math.PI * 2;

      this.r = 18 + Math.random() * 22; // rozmiar balonika
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];

      // rotacja dla bardziej naturalnego wyglądu
      this.rotation = (Math.random() - 0.5) * 0.3;

      // tekst (życzenie)
      this.text = wishes[Math.floor(Math.random() * wishes.length)];

      // delikatna zmiana rozmiaru (jak pulsu)
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.01 + Math.random() * 0.02;

      // przezroczystość - baloniki stopniowo pojawiają się
      this.alpha = 0;
      this.alphaSpeed = 0.01 + Math.random() * 0.02;
    }

    update(dt) {
      // dt w ms
      // unoszenie - zależy od prędkości i od delta time (skalujemy do klatek)
      this.y -= this.vy * (dt / 16.67); // 16.67 ~ 60FPS baseline

      // boczne kołysanie
      const sway = Math.sin((performance.now() * this.swayFreq) + this.swayPhase) * this.swayAmp;
      this.currentX = this.x + sway;

      // pulsowanie rozmiaru
      this.pulsePhase += this.pulseSpeed * (dt / 16.67);
      const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.03;

      this.drawR = this.r * pulseScale;

      // pojawianie się
      if (this.alpha < 1) this.alpha = Math.min(1, this.alpha + this.alphaSpeed * (dt / 16.67));
    }

    isOffScreen() {
      return this.y + this.drawR < -50;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;

      // cienisty sznurek
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.currentX, this.y + this.drawR);
      ctx.lineTo(this.currentX, this.y + this.drawR + 30);
      ctx.stroke();

      // balon (elipsa)
      ctx.translate(this.currentX, this.y);
      ctx.rotate(this.rotation);
      // ciało balona
      ctx.beginPath();
      ctx.ellipse(0, 0, this.drawR * 0.85, this.drawR, 0, 0, Math.PI * 2);
      // gradient wypełnienia
      const g = ctx.createLinearGradient(-this.drawR, -this.drawR, this.drawR, this.drawR);
      g.addColorStop(0, lighten(this.color, 0.15));
      g.addColorStop(0.5, this.color);
      g.addColorStop(1, darken(this.color, 0.06));
      ctx.fillStyle = g;
      ctx.fill();

      // highlight
      ctx.beginPath();
      ctx.ellipse(-this.drawR*0.3, -this.drawR*0.45, this.drawR*0.18, this.drawR*0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fill();

      // "węzeł" u dołu balona
      ctx.beginPath();
      ctx.moveTo(-6, this.drawR*0.9);
      ctx.lineTo(0, this.drawR*1.25);
      ctx.lineTo(6, this.drawR*0.9);
      ctx.closePath();
      ctx.fillStyle = darken(this.color, 0.08);
      ctx.fill();

      // tekst życzenia - centrowany
      ctx.rotate(-this.rotation); // tekst nieco mniej obrócony
      ctx.font = `${Math.max(10, Math.floor(this.drawR * 0.4))}px Roboto, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // delikatny cień tekstu
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillText(this.text, 2, 2);
      ctx.fillStyle = "white";
      ctx.fillText(this.text, 0, 0);

      ctx.restore();
    }
  }

  // pomocnicze: przyciemnianie / rozjaśnianie kolorów hex
  function hexToRgb(hex) {
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(s => s+s).join('');
    const n = parseInt(hex,16);
    return { r: (n>>16)&255, g: (n>>8)&255, b: n&255 };
  }
  function rgbToHex(r,g,b) {
    return '#' + [r,g,b].map(v => ('0'+Math.round(v).toString(16)).slice(-2)).join('');
  }
  function lighten(hex, amt) {
    const c = hexToRgb(hex);
    return rgbToHex(
      Math.min(255, c.r + 255*amt),
      Math.min(255, c.g + 255*amt),
      Math.min(255, c.b + 255*amt)
    );
  }
  function darken(hex, amt) {
    const c = hexToRgb(hex);
    return rgbToHex(
      Math.max(0, c.r - 255*amt),
      Math.max(0, c.g - 255*amt),
      Math.max(0, c.b - 255*amt)
    );
  }

  // kontener balonów
  const balloons = [];
  let lastSpawn = 0;
  let lastTime = performance.now();

  function spawnOne() {
    if (balloons.length >= MAX_BALLOONS) return;
    // spawn losowo na CAŁEJ szerokości (to jest kluczowa zmiana)
    const b = new Balloon();
    balloons.push(b);
  }

  function loop(now) {
    const dt = Math.min(40, now - lastTime); // ogranicz dt, żeby uniknąć skoków
    lastTime = now;

    // czyszczenie tła delikatnym przyciemnieniem (efekt trail można uzyskać mniejszym alpha)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // tło gradientowe
    const grad = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    grad.addColorStop(0, "#02111a");
    grad.addColorStop(1, "#052033");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // spawn zgodnie z interwałem
    if (now - lastSpawn > SPAWN_INTERVAL) {
      // losowa liczba balonów co spawn, by dać naturalność
      const toSpawn = 1 + Math.floor(Math.random() * 2);
      for (let i=0;i<toSpawn;i++) spawnOne();
      lastSpawn = now;
    }

    // aktualizacja i rysowanie
    for (let i = balloons.length - 1; i >= 0; i--) {
      const b = balloons[i];
      b.update(dt);
      b.draw(ctx);
      if (b.isOffScreen()) {
        balloons.splice(i, 1);
      }
    }

    // opcjonalnie: pokaż licznik (debug)
    // ctx.fillStyle = "rgba(255,255,255,0.2)";
    // ctx.fillText(`balonów: ${balloons.length}`, 10, 20);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // Dla wygody: kliknięcie dodaje kilka balonów tam gdzie klikniesz
  window.addEventListener('click', (e) => {
    for (let i=0;i<6;i++) {
      // utwórz balon i ustaw jego x blisko kliknięcia (ale nadal mogą pochodzić z całej szerokości)
      const b = new Balloon();
      b.x = e.clientX + (Math.random()-0.5)*80;
      b.y = window.innerHeight + Math.random()*60;
      balloons.push(b);
    }
  });

  // responsywne uaktualnianie po zmianie wielkości okna
  window.addEventListener('orientationchange', () => setTimeout(resize, 300));

/* --- Odblokowywanie kolejnych gier --- */
function unlockNext(n) {
  const btn = document.getElementById("btn" + n);
  if (btn) btn.disabled = false;
}
