const particleCanvas = document.getElementById('particle-canvas');
const visualizerCanvas = document.getElementById('visualizer-canvas');
const newsContent = document.getElementById('news-content');
const statsBar = document.getElementById('stats-bar');

let audioCtx, analyser, dataArray, source;
let isInitialized = false;

window.addEventListener('load', () => {
    applyConfig();
    BusyspinnerOff();
    initParticles();
    if (Config.VideoBackground) toggleVideo(true);

    document.getElementById('start-game-btn').addEventListener('click', () => {
        startMiniGame();
        document.getElementById('game-activation-container').classList.add('hidden');
    });
});

function applyConfig() {
    document.getElementById('server-name').innerText = Config.ServerName;
    document.getElementById('server-tagline').innerText = Config.Tagline;
    if (Config.Locales) {
        document.getElementById('start-game-btn').innerText = Config.Locales.PlayGameBtn;
        document.querySelector('.news-header span').innerText = Config.Locales.NewsHeader;
        document.getElementById('load-status').innerText = Config.Locales.LoadingStatus;
        document.querySelector('.game-header').innerText = Config.Locales.GameHeader;
        document.getElementById('game-prompt').innerText = Config.Locales.GamePrompt;
        const closeBtn = document.getElementById('close-game-btn');
        if (closeBtn) closeBtn.innerText = Config.Locales.GameBtnExit;

        const settingsTitle = document.querySelector('#settings-panel h3');
        if (settingsTitle) settingsTitle.innerText = Config.Locales.SettingsHeader;

        const setSpan = document.querySelectorAll('.setting-item span');
        if (setSpan.length >= 3) {
            setSpan[0].innerText = Config.Locales.SettingVideo;
            setSpan[1].innerText = Config.Locales.SettingFX;
            setSpan[2].innerText = Config.Locales.SettingSmooth;
        }
    }
    if (Config.Playlist && Config.Playlist.length > 0) {
        document.getElementById('track-name').innerText = Config.Playlist[0].name;
    }
    if (Config.EnableStatsBar) statsBar.classList.remove('hidden');

    if (window.nuiHandoverData) {
        updateStats(window.nuiHandoverData);
    } else {
        updateStats(Config.DefaultStats);
    }
}

window.addEventListener('click', () => {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
});

window.addEventListener('mousemove', () => {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

window.addEventListener('keydown', () => {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

function initAudio() {
    try {
        if (Config.VideoBackground && Config.VideoOverridesMusic) {
            console.log("Video active, music disabled.");
            return;
        }

        if (audioCtx) return;

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;

        const music = document.getElementById('loading-music');
        if (!music) return;

        source = audioCtx.createMediaElementSource(music);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
        drawVisualizer();
        music.volume = Config.DefaultMusicVolume;

        const attemptPlay = () => {
            music.play().then(() => {
                console.log("Music started successfully");
                if (audioCtx.state === 'suspended') audioCtx.resume();
            }).catch((e) => {
                console.log("Autoplay blocked, waiting for interaction...");
                setTimeout(attemptPlay, 1000);
            });
        };
        attemptPlay();
    } catch (e) { console.error("Audio Init Error:", e); }
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!analyser || !Config.EnableVisualizer) return;

    analyser.getByteFrequencyData(dataArray);
    const ctx = visualizerCanvas.getContext('2d');
    const { width, height } = visualizerCanvas;
    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / dataArray.length) * 2;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, '#c084fc');
        grad.addColorStop(1, '#2dd4bf');
        ctx.fillStyle = grad;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
    }
}

const gamePanel = document.getElementById('minigame');
const canvas = document.getElementById('flappy-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let gameLoop, gameActive = false, gameStarted = false, isSpacePressed = false;
let bird, pipes, score, frames;

function startMiniGame() {
    if (!Config.EnableHackingGame || !canvas) return;
    gamePanel.classList.remove('hidden');
    resetGame();
    gameActive = true;
    gameStarted = false;
    document.getElementById('game-status').innerText = Config.Locales ? Config.Locales.GameStartPrompt : "PRESS SPACE TO START!";
    document.getElementById('game-status').style.color = "var(--primary)";
    gameLoop = requestAnimationFrame(updateGame);
}

document.getElementById('close-game-btn')?.addEventListener('click', () => {
    gamePanel.classList.add('hidden');
    gameActive = false;
    gameStarted = false;
    cancelAnimationFrame(gameLoop);
    document.getElementById('game-activation-container').classList.remove('hidden');
});

function resetGame() {
    bird = { x: 50, y: 150, width: 22, height: 22, velocity: 0, gravity: 0.4, thrust: 0.6 };
    pipes = [];
    score = 0;
    frames = 0;
}

function updateGame() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#c084fc";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#c084fc";

    if (gameStarted) {
        if (isSpacePressed) {
            bird.velocity -= bird.thrust;
        } else {
            bird.velocity += bird.gravity;
        }

        if (bird.velocity > 7) bird.velocity = 7;
        if (bird.velocity < -6) bird.velocity = -6;

        bird.y += bird.velocity;

        if (bird.y + bird.height >= canvas.height || bird.y <= 0) gameOver();
    } else {
        bird.y = 150 + Math.sin(Date.now() / 200) * 5;
    }

    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    ctx.shadowBlur = 0;

    if (gameStarted) {
        if (frames % 90 === 0) {
            let gap = 110;
            let pipeHeight = Math.floor(Math.random() * (canvas.height - gap - 40)) + 20;
            pipes.push({ x: canvas.width, y: 0, width: 40, height: pipeHeight });
            pipes.push({ x: canvas.width, y: pipeHeight + gap, width: 40, height: canvas.height - pipeHeight - gap });
        }

        ctx.fillStyle = "#2dd4bf";
        for (let i = 0; i < pipes.length; i++) {
            let p = pipes[i];
            p.x -= 3;
            ctx.shadowBlur = 5;
            ctx.shadowColor = "#2dd4bf";
            ctx.fillRect(p.x, p.y, p.width, p.height);
            ctx.shadowBlur = 0;

            if (bird.x < p.x + p.width && bird.x + bird.width > p.x &&
                bird.y < p.y + p.height && bird.y + bird.height > p.y) {
                gameOver();
            }

            if (p.x === bird.x) {
                score += 0.5;
                if (score % 1 === 0) {
                    const label = Config.Locales ? Config.Locales.ScoreLabel : "SCORE:";
                    document.getElementById('game-status').innerText = `${label} ${score}`;
                }
            }
        }

        pipes = pipes.filter(p => p.x + p.width > 0);
        frames++;
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Outfit";
    const canvasLabel = Config.Locales ? Config.Locales.ScoreLabel : "Score:";
    ctx.fillText(`${canvasLabel} ${Math.floor(score)}`, 10, 30);

    if (gameActive) gameLoop = requestAnimationFrame(updateGame);
}

function gameOver() {
    gameStarted = false;
    gameActive = false;
    isSpacePressed = false;
    const overLabel = Config.Locales ? Config.Locales.GameOver : "GAME OVER! Score:";
    document.getElementById('game-status').innerText = `${overLabel} ${Math.floor(score)}`;
    document.getElementById('game-status').style.color = "#ef4444";
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameActive) {
        if (!gameStarted) {
            gameStarted = true;
            const slabel = Config.Locales ? Config.Locales.ScoreLabel : "SCORE:";
            document.getElementById('game-status').innerText = `${slabel} 0`;
            document.getElementById('game-status').style.color = "var(--primary)";
        }
        isSpacePressed = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        isSpacePressed = false;
    }
});
const settingsPanel = document.getElementById('settings-panel');
document.getElementById('settings-toggle').addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
});

document.getElementById('toggle-video').addEventListener('change', (e) => toggleVideo(e.target.checked));
document.getElementById('toggle-fx').addEventListener('change', (e) => {
    particleCanvas.style.display = e.target.checked ? 'block' : 'none';
});

function toggleVideo(show) {
    const videoElem = document.getElementById('video-bg');
    const ytElem = document.getElementById('youtube-bg');

    if (Config.YoutubeVideoId && Config.YoutubeVideoId !== "") {
        if (show) {
            ytElem.src = `https://www.youtube.com/embed/${Config.YoutubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${Config.YoutubeVideoId}`;
            ytElem.style.opacity = '0.6';
        } else {
            ytElem.src = '';
            ytElem.style.opacity = '0';
        }
    } else {
        if (show) {
            videoElem.classList.add('active');
            videoElem.play();
        } else {
            videoElem.classList.remove('active');
            videoElem.pause();
        }
    }
}

function updateStats(data) {
    if (data.players !== undefined) document.getElementById('player-count').innerText = `${data.players} / ${data.maxPlayers || 256}`;
    if (data.time !== undefined) document.getElementById('server-time').innerText = data.time;
    if (data.weather !== undefined) document.getElementById('server-weather').innerText = data.weather;
}

class Particle {
    constructor(canvas) { this.canvas = canvas; this.reset(); }
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height) this.reset();
    }
    draw(ctx) {
        ctx.fillStyle = `rgba(192, 132, 252, ${this.opacity})`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}

function initParticles() {
    const ctx = particleCanvas.getContext('2d');
    const resize = () => { particleCanvas.width = window.innerWidth; particleCanvas.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    const particles = Array.from({ length: Config.ParticleDensity }, () => new Particle(particleCanvas));
    function animate() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => { p.update(); p.draw(ctx); });
        requestAnimationFrame(animate);
    }
    animate();
}

let currentProgress = 0;
const handlers = {
    startInitFunctionOrder(data) { document.getElementById('load-status').innerText = `SYSTEMS: ${data.type}...`; },
    initFunctionInvoking(data) { updateProgress((data.idx / data.count) * 100); },
    startDataFileEntries(data) { document.getElementById('load-status').innerText = Config.Locales ? Config.Locales.LoadingStatus : `READING FILES...`; }
};

window.addEventListener('message', (e) => {
    if (handlers[e.data.eventName]) handlers[e.data.eventName](e.data);
    if (e.data.eventName === 'onLogLine') console.log(e.data.message);
});

function updateProgress(percent) {
    currentProgress = Math.min(Math.round(percent), 100);
    document.getElementById('progress-bar').style.width = currentProgress + '%';
    document.getElementById('load-percent').innerText = currentProgress + '%';
}

if (window.nuiHandoverData) updateStats(window.nuiHandoverData);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        let p = 0;
        const interval = setInterval(() => {
            p += 2; updateProgress(p);
            if (p >= 100) clearInterval(interval);
        }, 80);
    }
});
