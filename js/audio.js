/* ===== AUDIO MANAGER ===== */
/* Uses Kenney interface sound samples, with procedural Web Audio fallbacks. */

const AudioManager = (() => {
    let ctx = null;
    let available = true;
    let sampleLoadStarted = false;
    const sampleBuffers = {};

    let muted = false;
    try { muted = localStorage.getItem('valerie_muted') === '1'; } catch (e) { /* private mode */ }

    const SAMPLE_BASE = 'kenney_interface-sounds/Audio/';
    const SAMPLE_FILES = {
        // Chosen by decoding the pack and comparing duration/loudness/brightness:
        // confirmation_001 is short and warm, error_008 is gentle, click_001 is crisp.
        // tick_001 is a tiny, quiet transition cue so screen changes do not chirp twice.
        correct: 'confirmation_001.ogg',
        incorrect: 'error_008.ogg',
        click: 'click_001.ogg',
        fanfare: 'confirmation_004.ogg',
        star: 'confirmation_003.ogg',
        pop: 'pluck_001.ogg',
        whoosh: 'tick_001.ogg'
    };

    function getCtx() {
        if (!available) return null;

        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) {
            available = false;
            return null;
        }

        if (!ctx) {
            try {
                ctx = new AudioContextCtor();
            } catch (e) {
                available = false;
                return null;
            }
        }

        if (ctx.state === 'suspended') {
            const resume = ctx.resume();
            if (resume && typeof resume.catch === 'function') {
                resume.catch(() => {});
            }
        }
        preloadSamples(ctx);
        return ctx;
    }

    function preloadSamples(ac) {
        if (sampleLoadStarted || !ac || typeof fetch !== 'function') return;
        sampleLoadStarted = true;

        Object.entries(SAMPLE_FILES).forEach(([name, file]) => {
            fetch(SAMPLE_BASE + file)
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to load ${file}`);
                    return res.arrayBuffer();
                })
                .then(data => ac.decodeAudioData(data))
                .then(buffer => {
                    sampleBuffers[name] = buffer;
                })
                .catch(() => {
                    // Opening index.html directly or an older browser may block OGG/fetch.
                    // In that case the procedural fallback below still keeps the app audible.
                });
        });
    }

    function playSample(name, volume = 0.4, playbackRate = 1) {
        if (muted) return false;
        const ac = getCtx();
        const buffer = sampleBuffers[name];
        if (!ac || !buffer) return false;

        const src = ac.createBufferSource();
        const gain = ac.createGain();
        src.buffer = buffer;
        src.playbackRate.value = playbackRate;
        gain.gain.value = volume;
        src.connect(gain);
        gain.connect(ac.destination);
        src.start();
        return true;
    }

    function playTone(freq, duration, type = 'sine', volume = 0.3, delay = 0) {
        if (muted) return;
        const ac = getCtx();
        if (!ac) return;

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
    }

    function playNoise(duration, volume = 0.1) {
        if (muted) return;
        const ac = getCtx();
        if (!ac) return;

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
    }

    return {
        init() { getCtx(); },

        // Mute toggle — persisted so it survives reloads.
        toggleMute() {
            muted = !muted;
            try { localStorage.setItem('valerie_muted', muted ? '1' : '0'); } catch (e) { /* private mode */ }
            return muted;
        },
        isMuted() { return muted; },

        // Correct answer: short positive confirmation
        correct() {
            if (playSample('correct', 0.42)) return;
            playTone(523, 0.15, 'sine', 0.3, 0);      // C5
            playTone(659, 0.15, 'sine', 0.3, 0.1);     // E5
            playTone(784, 0.2, 'sine', 0.35, 0.2);     // G5
            playTone(1047, 0.3, 'sine', 0.3, 0.3);     // C6
        },

        // Wrong answer: gentle low error cue
        incorrect() {
            if (playSample('incorrect', 0.4)) return;
            playTone(400, 0.2, 'triangle', 0.2, 0);
            playTone(350, 0.3, 'triangle', 0.2, 0.15);
        },

        // Click / select
        click() {
            if (playSample('click', 0.32)) return;
            playTone(800, 0.08, 'sine', 0.15);
        },

        // Level complete fanfare
        fanfare() {
            if (playSample('fanfare', 0.48)) return;
            playTone(523, 0.15, 'square', 0.15, 0);
            playTone(659, 0.15, 'square', 0.15, 0.12);
            playTone(784, 0.15, 'square', 0.15, 0.24);
            playTone(1047, 0.25, 'square', 0.2, 0.36);
            playTone(784, 0.1, 'square', 0.1, 0.5);
            playTone(1047, 0.4, 'square', 0.25, 0.58);
        },

        // Star earned
        star() {
            if (playSample('star', 0.42)) return;
            playTone(880, 0.1, 'sine', 0.25, 0);
            playTone(1100, 0.15, 'sine', 0.3, 0.08);
            playTone(1320, 0.2, 'sine', 0.2, 0.18);
        },

        // Pop (for bubbles, beads, etc.)
        pop() {
            if (playSample('pop', 0.3)) return;
            playTone(1000, 0.06, 'sine', 0.2);
            playNoise(0.05, 0.05);
        },

        // Whoosh (page transitions)
        whoosh() {
            if (playSample('whoosh', 0.12)) return;
            playTone(540, 0.04, 'sine', 0.04);
        }
    };
})();
