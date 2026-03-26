/* ===== ANIMATIONS MANAGER ===== */
/* Canvas-based particle effects and celebrations */

const Animations = (() => {
    let canvas, ctxC;
    let particles = [];
    let animFrame = null;
    let bubbles = [];

    function init() {
        canvas = document.getElementById('celebration-canvas');
        if (!canvas) return;
        ctxC = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function loop() {
        if (!ctxC) return;
        ctxC.clearRect(0, 0, canvas.width, canvas.height);

        // Update & draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity || 0.1;
            p.life -= p.decay || 0.015;
            p.rotation += p.spin || 0;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctxC.save();
            ctxC.translate(p.x, p.y);
            ctxC.rotate(p.rotation);
            ctxC.globalAlpha = Math.min(p.life, 1);

            if (p.type === 'confetti') {
                ctxC.fillStyle = p.color;
                ctxC.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else if (p.type === 'star') {
                drawStar(ctxC, 0, 0, 5, p.size, p.size / 2, p.color);
            } else if (p.type === 'bubble') {
                ctxC.beginPath();
                ctxC.arc(0, 0, p.size, 0, Math.PI * 2);
                ctxC.strokeStyle = p.color;
                ctxC.lineWidth = 1.5;
                ctxC.stroke();
                ctxC.beginPath();
                ctxC.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
                ctxC.fillStyle = 'rgba(255,255,255,0.4)';
                ctxC.fill();
            } else if (p.type === 'paint') {
                ctxC.beginPath();
                ctxC.arc(0, 0, p.size, 0, Math.PI * 2);
                ctxC.fillStyle = p.color;
                ctxC.fill();
            } else if (p.type === 'emoji') {
                ctxC.font = `${p.size}px serif`;
                ctxC.textAlign = 'center';
                ctxC.textBaseline = 'middle';
                ctxC.fillText(p.emoji, 0, 0);
            }

            ctxC.restore();
        }

        if (particles.length > 0) {
            animFrame = requestAnimationFrame(loop);
        } else {
            animFrame = null;
        }
    }

    function startLoop() {
        if (!animFrame) {
            animFrame = requestAnimationFrame(loop);
        }
    }

    function drawStar(ctx, cx, cy, spikes, outerR, innerR, color) {
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerR);
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
            rot += step;
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    const COLORS = {
        confetti: ['#ff2d7b', '#00f0ff', '#39ff14', '#ffe600', '#a855f7', '#ff6f00', '#ff8fab', '#45b7d1'],
        swim: ['#45b7d1', '#2d7dd2', '#a8e6cf', '#ffffff', '#00f0ff'],
        craft: ['#ff8fab', '#cdb4db', '#b8f2e6', '#fde68a', '#ff7f7f', '#fefae0'],
        gd: ['#ff2d7b', '#00f0ff', '#39ff14', '#ffe600', '#a855f7']
    };

    return {
        init,

        // Big celebration burst (end of exercise, all correct)
        celebrate(x, y) {
            if (!ctxC) init();
            x = x || canvas.width / 2;
            y = y || canvas.height / 2;

            for (let i = 0; i < 60; i++) {
                const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.3;
                const speed = 3 + Math.random() * 6;
                particles.push({
                    type: 'confetti',
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2,
                    size: 6 + Math.random() * 6,
                    color: COLORS.confetti[Math.floor(Math.random() * COLORS.confetti.length)],
                    life: 1,
                    decay: 0.01 + Math.random() * 0.01,
                    gravity: 0.12,
                    rotation: Math.random() * Math.PI * 2,
                    spin: (Math.random() - 0.5) * 0.2
                });
            }

            // Add some stars
            for (let i = 0; i < 15; i++) {
                particles.push({
                    type: 'star',
                    x: x + (Math.random() - 0.5) * 200,
                    y: y + (Math.random() - 0.5) * 100,
                    vx: (Math.random() - 0.5) * 3,
                    vy: -2 - Math.random() * 4,
                    size: 8 + Math.random() * 8,
                    color: '#fbbf24',
                    life: 1,
                    decay: 0.012,
                    gravity: 0.05,
                    rotation: 0,
                    spin: (Math.random() - 0.5) * 0.1
                });
            }
            startLoop();
        },

        // Small correct-answer burst
        correctBurst(x, y) {
            if (!ctxC) init();
            for (let i = 0; i < 20; i++) {
                const angle = (Math.PI * 2 * i) / 20;
                const speed = 2 + Math.random() * 3;
                particles.push({
                    type: 'star',
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 4 + Math.random() * 5,
                    color: COLORS.confetti[Math.floor(Math.random() * COLORS.confetti.length)],
                    life: 1,
                    decay: 0.025,
                    gravity: 0.05,
                    rotation: 0,
                    spin: 0.05
                });
            }
            startLoop();
        },

        // Swimming bubbles
        bubbleBurst(x, y) {
            if (!ctxC) init();
            for (let i = 0; i < 15; i++) {
                particles.push({
                    type: 'bubble',
                    x: x + (Math.random() - 0.5) * 60,
                    y: y + Math.random() * 30,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: -1.5 - Math.random() * 3,
                    size: 5 + Math.random() * 12,
                    color: COLORS.swim[Math.floor(Math.random() * COLORS.swim.length)],
                    life: 1,
                    decay: 0.015,
                    gravity: -0.02,
                    rotation: 0,
                    spin: 0
                });
            }
            startLoop();
        },

        // Paint splatter (arts & crafts theme)
        paintSplatter(x, y) {
            if (!ctxC) init();
            for (let i = 0; i < 25; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 5;
                particles.push({
                    type: 'paint',
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 3 + Math.random() * 8,
                    color: COLORS.craft[Math.floor(Math.random() * COLORS.craft.length)],
                    life: 1,
                    decay: 0.02,
                    gravity: 0.15,
                    rotation: 0,
                    spin: 0
                });
            }
            startLoop();
        },

        // GD-style neon burst
        gdBurst(x, y) {
            if (!ctxC) init();
            for (let i = 0; i < 20; i++) {
                const angle = (Math.PI * 2 * i) / 20;
                const speed = 3 + Math.random() * 4;
                particles.push({
                    type: 'confetti',
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 4 + Math.random() * 4,
                    color: COLORS.gd[Math.floor(Math.random() * COLORS.gd.length)],
                    life: 1,
                    decay: 0.02,
                    gravity: 0.02,
                    rotation: Math.random() * Math.PI * 2,
                    spin: (Math.random() - 0.5) * 0.3
                });
            }
            startLoop();
        },

        // Emoji rain for big celebrations
        emojiRain(emojis = ['⭐', '🎉', '🏊', '🎨', '🎮']) {
            if (!ctxC) init();
            for (let i = 0; i < 30; i++) {
                particles.push({
                    type: 'emoji',
                    emoji: emojis[Math.floor(Math.random() * emojis.length)],
                    x: Math.random() * canvas.width,
                    y: -20 - Math.random() * 200,
                    vx: (Math.random() - 0.5) * 2,
                    vy: 1.5 + Math.random() * 3,
                    size: 20 + Math.random() * 16,
                    color: '',
                    life: 1,
                    decay: 0.005 + Math.random() * 0.005,
                    gravity: 0.02,
                    rotation: Math.random() * 0.5,
                    spin: (Math.random() - 0.5) * 0.05
                });
            }
            startLoop();
        },

        // Create splash screen bubbles (DOM-based, continuous)
        createSplashBubbles() {
            const container = document.getElementById('splash-bubbles');
            if (!container) return;
            container.innerHTML = '';
            for (let i = 0; i < 25; i++) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                const size = 10 + Math.random() * 40;
                bubble.style.width = size + 'px';
                bubble.style.height = size + 'px';
                bubble.style.left = Math.random() * 100 + '%';
                bubble.style.animationDuration = (5 + Math.random() * 10) + 's';
                bubble.style.animationDelay = Math.random() * 5 + 's';
                container.appendChild(bubble);
            }
        },

        // Stop all animations
        clear() {
            particles = [];
            if (animFrame) {
                cancelAnimationFrame(animFrame);
                animFrame = null;
            }
            if (ctxC) ctxC.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
})();
