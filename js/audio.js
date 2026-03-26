/* ===== AUDIO MANAGER ===== */
/* Uses Web Audio API to generate sound effects procedurally */

const AudioManager = (() => {
    let ctx = null;
    let enabled = true;

    function getCtx() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function playTone(freq, duration, type = 'sine', volume = 0.3, delay = 0) {
        if (!enabled) return;
        try {
            const ac = getCtx();
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
            gain.gain.setValueAtTime(volume, ac.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.start(ac.currentTime + delay);
            osc.stop(ac.currentTime + delay + duration);
        } catch (e) { /* silent fail */ }
    }

    function playNoise(duration, volume = 0.1) {
        if (!enabled) return;
        try {
            const ac = getCtx();
            const bufferSize = ac.sampleRate * duration;
            const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const src = ac.createBufferSource();
            src.buffer = buffer;
            const gain = ac.createGain();
            const filter = ac.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            gain.gain.setValueAtTime(volume, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
            src.connect(filter);
            filter.connect(gain);
            gain.connect(ac.destination);
            src.start();
        } catch (e) { /* silent fail */ }
    }

    return {
        toggle() { enabled = !enabled; return enabled; },
        isEnabled() { return enabled; },
        init() { getCtx(); },

        // Correct answer: happy ascending arpeggio
        correct() {
            playTone(523, 0.15, 'sine', 0.3, 0);      // C5
            playTone(659, 0.15, 'sine', 0.3, 0.1);     // E5
            playTone(784, 0.2, 'sine', 0.35, 0.2);     // G5
            playTone(1047, 0.3, 'sine', 0.3, 0.3);     // C6
        },

        // Wrong answer: gentle descending
        incorrect() {
            playTone(400, 0.2, 'triangle', 0.2, 0);
            playTone(350, 0.3, 'triangle', 0.2, 0.15);
        },

        // Click / select
        click() {
            playTone(800, 0.08, 'sine', 0.15);
        },

        // Splash sound (swimming theme)
        splash() {
            playNoise(0.3, 0.15);
            playTone(200, 0.2, 'sine', 0.1);
        },

        // Level complete fanfare
        fanfare() {
            playTone(523, 0.15, 'square', 0.15, 0);
            playTone(659, 0.15, 'square', 0.15, 0.12);
            playTone(784, 0.15, 'square', 0.15, 0.24);
            playTone(1047, 0.25, 'square', 0.2, 0.36);
            playTone(784, 0.1, 'square', 0.1, 0.5);
            playTone(1047, 0.4, 'square', 0.25, 0.58);
        },

        // Star earned
        star() {
            playTone(880, 0.1, 'sine', 0.25, 0);
            playTone(1100, 0.15, 'sine', 0.3, 0.08);
            playTone(1320, 0.2, 'sine', 0.2, 0.18);
        },

        // GD-style jump
        jump() {
            const ac = getCtx();
            if (!enabled || !ac) return;
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, ac.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.1);
            gain.gain.setValueAtTime(0.12, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.start();
            osc.stop(ac.currentTime + 0.15);
        },

        // GD-style coin
        coin() {
            playTone(988, 0.08, 'square', 0.15, 0);
            playTone(1319, 0.12, 'square', 0.15, 0.06);
        },

        // Hint reveal
        hint() {
            playTone(600, 0.15, 'triangle', 0.15, 0);
            playTone(700, 0.2, 'triangle', 0.15, 0.12);
        },

        // Button hover
        hover() {
            playTone(1200, 0.04, 'sine', 0.05);
        },

        // Pop (for bubbles, beads, etc.)
        pop() {
            playTone(1000, 0.06, 'sine', 0.2);
            playNoise(0.05, 0.05);
        },

        // Whoosh (page transitions)
        whoosh() {
            playNoise(0.15, 0.08);
            playTone(400, 0.15, 'sine', 0.05);
        }
    };
})();
