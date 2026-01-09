// ==== Page navigation with flip animation ====
const pageIds = ['gamePage', 'cakePage', 'notePage', 'giftPage'];

// Preload after image
new Image().src = 'cake_after.jpg';
new Image().src = 'surprise.png';

function showPage(id) {
    pageIds.forEach(pid => {
        const el = document.getElementById(pid);
        if (!el) return;
        if (pid === id) {
            el.classList.remove('hidden');
            el.classList.remove('flip-leave');
            el.classList.add('flip-enter');
        } else if (!el.classList.contains('hidden')) {
            el.classList.remove('flip-enter');
            el.classList.add('flip-leave');
            setTimeout(() => el.classList.add('hidden'), 700);
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextPage(nextId) {
    showPage(nextId);
}

document.getElementById('homeBtn').addEventListener('click', () => showPage('gamePage'));

// ==== Floating hearts and sparkles ====
const floatWrap = document.getElementById('floatWrap');
function spawnFloat() {
    const el = document.createElement('div');
    el.className = 'float flower';
    const size = Math.random() * 28 + 18;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = Math.random() * 100 + '%';
    el.style.top = Math.random() * 80 + '%';
    el.style.animationDelay = (Math.random() * 2) + 's';
    floatWrap.appendChild(el);
    setTimeout(() => floatWrap.removeChild(el), 8000);
}
setInterval(spawnFloat, 400);

// ==== Confetti canvas ====
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class ConfettiPiece {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
        this.size = Math.random() * 8 + 8;
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        // Chocolate/Gold/Bronze hues
        const hues = [30, 40, 45, 10, 5];
        const hue = hues[Math.floor(Math.random() * hues.length)];
        this.color = `hsl(${hue}, ${70 + Math.random() * 30}%, ${40 + Math.random() * 40}%)`;
        this.tilt = Math.random() * 10 - 5;
    }
    update() {
        this.y += this.speed;
        this.angle += this.rotationSpeed;
        if (this.y > confettiCanvas.height) {
            this.y = -this.size;
            this.x = Math.random() * confettiCanvas.width;
        }
    }
    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.angle);
        confettiCtx.fillStyle = this.color;
        confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 3);
        confettiCtx.restore();
    }
}

function startConfetti() {
    if (confettiRunning) return;
    confettiRunning = true;
    confettiPieces = [];
    for (let i = 0; i < 150; i++) confettiPieces.push(new ConfettiPiece());
    requestAnimationFrame(confettiLoop);
    setTimeout(() => confettiRunning = false, 6000);
}
function confettiLoop() {
    if (!confettiRunning) {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        return;
    }
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(confettiLoop);
}

// ==== Balloon Pop Game ====
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

const targetPopped = 6;
let poppedCount = 0;
let gameActive = false;
let spawnInterval;

const balloonColors = [
    'radial-gradient(circle at 30% 30%, #a0522d, #8b4513)', // SaddleBrown / Chocolate
    'radial-gradient(circle at 30% 30%, #d2691e, #a0522d)', // Chocolate / Bronze
    'radial-gradient(circle at 30% 30%, #cd853f, #8b4513)', // Peru / SaddleBrown
    'radial-gradient(circle at 30% 30%, #d4af37, #b8860b)', // Gold / DarkGoldenRod
    'radial-gradient(circle at 30% 30%, #8b4513, #5d4037)', // SaddleBrown / DarkChocolate
    'radial-gradient(circle at 30% 30%, #deb887, #cd853f)'  // Burlywood / Peru
];

function createBalloon() {
    if (!gameActive) return;

    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.width = '60px';
    balloon.style.height = '80px';
    balloon.style.left = (Math.random() * 80 + 10) + '%';
    balloon.style.bottom = '-90px';
    balloon.style.animationDuration = (4 + Math.random() * 3) + 's'; // Slightly faster
    balloon.title = 'Pop me!';

    balloon.addEventListener('click', () => popBalloon(balloon));

    // Cleanup if missed
    balloon.addEventListener('animationend', () => {
        if (balloon.parentNode === gameArea) {
            balloon.remove();
        }
    });

    gameArea.appendChild(balloon);
}

function popBalloon(balloon) {
    if (balloon.dataset.popped || !gameActive) return;
    balloon.dataset.popped = 'true';
    poppedCount++;
    scoreEl.textContent = `Popped: ${poppedCount} / ${targetPopped}`;

    // Pop animation
    balloon.style.transform = 'scale(1.7) rotate(20deg)';
    balloon.style.opacity = '0';
    balloon.style.pointerEvents = 'none';
    setTimeout(() => balloon.remove(), 350);

    if (poppedCount >= targetPopped) {
        endGame();
    }
}

function startGame() {
    poppedCount = 0;
    gameActive = true;
    scoreEl.textContent = `Popped: 0 / ${targetPopped}`;
    gameArea.innerHTML = '';

    // Start spawning
    spawnInterval = setInterval(createBalloon, 800);
}

function endGame() {
    gameActive = false;
    clearInterval(spawnInterval);
    startConfetti();
    setTimeout(() => nextPage('cakePage'), 1500);
}

restartBtn.addEventListener('click', () => {
    clearInterval(spawnInterval);
    startGame();
});

// Start initially
startGame();

// ==== Cake candle blow ====
const flame = document.getElementById('flame');
const nextAfterCake = document.getElementById('nextAfterCake');
const micBtn = document.getElementById('micBtn');

let candleBlown = false;
function extinguishFlame() {
    if (candleBlown) return;
    candleBlown = true;
    flame.classList.add('extinguished');
    document.getElementById('cakeImg').src = 'cake_after.jpg';
    startConfetti();
    nextAfterCake.disabled = false;
}

flame.addEventListener('click', extinguishFlame);
document.getElementById('cakeImg').addEventListener('click', extinguishFlame);
nextAfterCake.addEventListener('click', () => nextPage('notePage'));

// Mic blow detection - Web Audio API
let audioContext;
let analyser;
let microphone;
let javascriptNode;
let listening = false;

micBtn.addEventListener('click', async () => {
    if (listening) {
        stopListening();
        micBtn.textContent = 'Use Mic';
    } else {
        await startListening();
        micBtn.textContent = 'Stop Mic';
    }
});

async function startListening() {
    if (listening) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        microphone.connect(analyser);
        javascriptNode = audioContext.createScriptProcessor(512, 1, 1);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;
            for (let i = 0; i < array.length; i++) {
                values += array[i];
            }
            const average = values / array.length;

            if (average > 60) { // threshold for blow
                extinguishFlame();
                stopListening();
                micBtn.textContent = 'Use Mic';
            }
        };
        listening = true;
    } catch (e) {
        alert('Could not access microphone.');
    }
}

function stopListening() {
    if (!listening) return;
    javascriptNode.disconnect();
    analyser.disconnect();
    microphone.disconnect();
    audioContext.close();
    listening = false;
}



// ==== Background music ====
const bgAudio = document.getElementById('bgAudio');
const musicBtn = document.getElementById('musicBtn');

musicBtn.addEventListener('click', () => {
    if (bgAudio.paused) {
        if (bgAudio.currentTime < 58) {
            bgAudio.currentTime = 58;
        }
        bgAudio.play();
        musicBtn.textContent = 'Pause Music';
    } else {
        bgAudio.pause();
        musicBtn.textContent = 'Play Music';
    }
});

// Custom loop behavior: Restart from 58s
bgAudio.loop = false; // Disable default loop
bgAudio.addEventListener('ended', () => {
    bgAudio.currentTime = 58;
    bgAudio.play();
});

// ==== Gift Box Surprise ====
const giftBox = document.getElementById('giftBox');
const surprisePhoto = document.getElementById('surprisePhoto');

if (giftBox) {
    giftBox.addEventListener('click', () => {
        giftBox.classList.add('opened');
        surprisePhoto.classList.add('revealed');
        startConfetti();
    });
}

// Show first page initially
showPage('gamePage');
