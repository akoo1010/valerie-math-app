/* ===== STORY & CHARACTERS ===== */
/* Each world has a guide who talks to Valerie, a villain, and one boss per unit.
   Beating a unit's boss earns that world's collectible and unlocks a story chapter. */

const Story = (() => {
    /** @type {Record<'3rd'|'4th', WorldStory>} */
    const WORLDS = {
        '3rd': {
            title: 'The Muddled Reef',
            guide: { name: 'Coral', emoji: '🧜‍♀️' },
            villain: { name: 'Captain Muddle', emoji: '🐙' },
            item: { name: 'Star Shell', plural: 'Star Shells', emoji: '🐚' },
            prologue: [
                "Hi Valerie! I'm Coral, keeper of the Number Lighthouse. 🧜‍♀️",
                "Last night, grumpy Captain Muddle 🐙 swirled his ink through the reef, the dash tracks AND the craft studio. Now all the numbers are scrambled!",
                "He gave the 12 glowing Star Shells 🐚 to his sneaky helpers. Without them, the lighthouse is dark.",
                "Here's the plan: play a round in a unit to wake up its boss, then beat the boss in a ⚔️ Boss Battle to win back a Star Shell. Answer FAST for ⚡ critical hits!",
                "Ready? Let's dive in!"
            ],
            finale: [
                "You did it, Valerie! All 12 Star Shells are back! 🐚✨",
                "The Number Lighthouse is shining brighter than ever — every fish, cube and paintbrush can count again.",
                "Even Captain Muddle 🐙 is smiling. He says he's going to take up knitting instead of scrambling. 🧶",
                "You're a true Reef Hero. I'll keep your Star Shells safe. Come back any time to beat your best boss times! 🏆"
            ]
        },
        '4th': {
            title: 'The Silent Festival',
            guide: { name: 'Fizz', emoji: '🐲' },
            villain: { name: 'The Grumble King', emoji: '👹' },
            item: { name: 'Rhythm Gem', plural: 'Rhythm Gems', emoji: '💎' },
            prologue: [
                "Yo, Valerie! I'm Fizz — the smallest dragon with the biggest dance moves. 🐲",
                "The Monster Dance Festival is TONIGHT, but the Grumble King 👹 hates music. He stole all 14 Rhythm Gems 💎 and now nobody can dance!",
                "His monster crew is guarding the gems all over Monster & Dance World.",
                "Play a round in a unit to find its boss, then beat it in a ⚔️ Boss Battle. Fast answers = ⚡ critical hits!",
                "Let's bring the beat back! 🎶"
            ],
            finale: [
                "ALL 14 RHYTHM GEMS! 💎 The festival lights are ON! 🪩",
                "Wait… who's that on the dance floor? It's the Grumble King 👹 — and he's actually… dancing?!",
                "\"I only grumbled because nobody ever taught me the steps,\" he says. Turns out math makes great choreography. 🕺",
                "You saved the festival, Valerie! Come back any time to beat your best boss times! 🏆"
            ]
        }
    };

    /** One boss per unit. `chapter` is the story text unlocked by its first defeat. */
    const BOSSES = {
        // --- 3rd grade: The Muddled Reef ---
        'mult-intro': {
            name: 'Snappy the Copy Crab', emoji: '🦀',
            intro: 'Snap snap! I copy my claws in equal groups. You can\'t count them all!',
            win: 'Snap… you multiplied right past my claws!',
            chapter: { title: 'The First Glow', text: 'Snappy drops the first Star Shell and scuttles away. Coral places it in the lighthouse — a tiny beam flickers on! "One down," she grins. "I can hear more of Muddle\'s helpers out there."' }
        },
        'mult-1digit': {
            name: 'Glitch the Pixel Bot', emoji: '👾',
            intro: 'BEEP! My times tables run at TURBO speed. Can your brain keep up?',
            win: 'ERROR… ERROR… you are… too fast!',
            chapter: { title: 'Turbo Track', text: 'Glitch powers down and a Star Shell pops out of its screen. "Whoa, you were faster than a robot!" Coral laughs. Down on the dash track, the numbers line back up in neat rows.' }
        },
        'add-sub': {
            name: 'Rascal the Supply Raccoon', emoji: '🦝',
            intro: 'I\'ve been stealing beads and buttons all day. Bet you can\'t keep track!',
            win: 'Okay, okay! I\'ll put the supplies back… all of them.',
            chapter: { title: 'The Craft Studio', text: 'Rascal returns every bead, button and pom-pom — plus the third Star Shell he hid in the glitter jar. The craft studio sparkles again. "Rascal says sorry," Coral whispers. "He just really likes shiny things."' }
        },
        'division': {
            name: 'Sir Squiggles the Squid', emoji: '🦑',
            intro: 'Share? SHARE? I never share equally! These snacks are all mine!',
            win: 'Fine… everyone gets the same amount. That\'s… actually fair.',
            chapter: { title: 'Fair Shares', text: 'Sir Squiggles learns that equal sharing means everyone gets a turn — and hands over the Star Shell. "Four shells!" says Coral. "The lighthouse can see all the way to the Paper Caves now."' }
        },
        'fractions': {
            name: 'Nibbles the Paper Worm', emoji: '🐛',
            intro: 'Munch munch! I nibble paper strips into pieces. Which part did I eat?',
            win: 'You know your parts AND your wholes. I\'m stuffed!',
            chapter: { title: 'The Paper Caves', text: 'Deep in the Paper Caves, Nibbles coughs up a slightly chewed Star Shell. "Ew. But also YAY!" Coral cheers. Every paper strip in the cave is cut into perfectly equal parts again.' }
        },
        'patterns': {
            name: 'Remix the Robot DJ', emoji: '🤖',
            intro: 'I scrambled every pattern in the level! Nothing repeats anymore… or does it?',
            win: 'You found the rule every time. Nice beat!',
            chapter: { title: 'The Pattern Party', text: 'Remix puts the patterns back in order and starts a dance party on the dash track. The sixth Star Shell glows on the turntable. "Halfway there!" Coral shouts over the music.' }
        },
        'geometry': {
            name: 'Twist the Shapeshifter Fox', emoji: '🦊',
            intro: 'Now I\'m a square! Now I\'m a rhombus! You\'ll never know which shape is which!',
            win: 'You can spot every shape I turn into. I give up!',
            chapter: { title: 'Shape Shifting', text: 'Twist turns into a seventh Star Shell — then back into a fox, who bows politely. "Fun trick," says Coral, "but we\'ll take the real shell, thanks." The craft studio\'s shapes stop wiggling.' }
        },
        'area': {
            name: 'Puff the Pufferfish', emoji: '🐡',
            intro: 'I puff up and take ALL the space in the pool! How much room am I hogging?',
            win: 'Pfffft… you measured every square. I\'ll scoot over.',
            chapter: { title: 'Room to Swim', text: 'Puff deflates and gives back the eighth Star Shell. Now there\'s room for everyone in the pool! "You tiled that whole lagoon in your head," Coral says. "Amazing."' }
        },
        'perimeter': {
            name: 'Zig the Laser Snake', emoji: '🐍',
            intro: 'Ssssso you want to go around the edge? I guard EVERY side!',
            win: 'Ssssside after side… you added them all.',
            chapter: { title: 'Around the Edges', text: 'Zig slithers off the edge of the level, leaving the ninth Star Shell behind. The lighthouse beam sweeps all the way around the reef. "Only three left!" says Coral.' }
        },
        'time': {
            name: 'Captain Clockfin', emoji: '🦈',
            intro: 'I swapped every clock hand in the ocean! Nobody knows what time it is!',
            win: 'You read every clock right. Time\'s up for me!',
            chapter: { title: 'Right on Time', text: 'Captain Clockfin sets the clocks straight and hands over the tenth Star Shell. "Perfect timing," Coral giggles. Far away, Captain Muddle\'s ink cloud starts to shrink.' }
        },
        'measurement': {
            name: 'Lanky the Stretchy Lizard', emoji: '🦎',
            intro: 'I stretch and shrink so no ruler can measure me! How long am I NOW?',
            win: 'You measured me exactly. No more stretching!',
            chapter: { title: 'Measuring Up', text: 'Lanky curls up and gives back the eleventh Star Shell. "Just one more," Coral says quietly. "And it\'s guarded by Captain Muddle himself in the Chart Chamber."' }
        },
        'data-graphs': {
            name: 'Captain Muddle', emoji: '🐙',
            intro: 'So YOU\'re the one fixing my mess! I scrambled ALL the charts. You\'ll never read them!',
            win: 'Eight arms and I still couldn\'t stop you… Fine. The last shell is yours.',
            chapter: { title: 'The Chart Chamber', text: 'Captain Muddle drops the final Star Shell and his ink cloud vanishes. The bars and pictures on every graph stand up straight again. Coral swims a happy loop-the-loop. "Valerie… we have all twelve!"' }
        },

        // --- 4th grade: The Silent Festival ---
        '4-place-value': {
            name: 'Gobbledigit', emoji: '👺',
            intro: 'Heh heh! I swap the digits around. A 4 in the thousands place? Now it\'s in the ones!',
            win: 'You know every place a digit can live. Gah!',
            chapter: { title: 'The First Beat', text: 'Gobbledigit drops the first Rhythm Gem. Fizz holds it up and — BOOM — a single drum beat echoes across the festival grounds. "Did you HEAR that?!" Fizz spins in a circle. "Thirteen more!"' }
        },
        '4-add-sub-estimation': {
            name: 'DJ Static', emoji: '👻',
            intro: 'Bzzzt! I fuzz up the big numbers until nobody can add them. Can you even estimate?',
            win: 'Your numbers came in loud and clear. Bzzz… off I go.',
            chapter: { title: 'Clear Signal', text: 'DJ Static fades out and the second Rhythm Gem crackles to life. The festival speakers start humming. "Static is gone!" Fizz shouts. "Now people can hear the countdown!"' }
        },
        '4-multiply-1digit': {
            name: 'Grizzlor the Multi-Bear', emoji: '🐻',
            intro: 'RAWR! Every swipe I take hits TIMES as hard! Can you multiply my power?',
            win: 'Rawr… you multiplied faster than I can swipe.',
            chapter: { title: 'Bear Necessities', text: 'Grizzlor hands over the third Rhythm Gem and asks if there will be honey at the festival. "There will now!" says Fizz. The monster bakery starts making honey cakes for the party.' }
        },
        '4-multiply-2digit': {
            name: 'Stompy the Disco Elephant', emoji: '🐘',
            intro: 'Two-digit stomps! Each of my stomps shakes the floor in rows AND columns!',
            win: 'You broke my stomps into parts and solved them all!',
            chapter: { title: 'The Big Stomp', text: 'Stompy stops stomping and starts dancing — very carefully. The fourth Rhythm Gem rolls out from under a giant shoe. "The dance floor survived!" Fizz laughs.' }
        },
        '4-division': {
            name: 'Splitzy the Slime', emoji: '🦠',
            intro: 'Blorp! I split into equal blobs… and some bits are LEFT OVER. Bet you can\'t handle remainders!',
            win: 'Blorp… you divided me perfectly. Even the leftovers!',
            chapter: { title: 'Slime Time', text: 'Splitzy splats into a puddle and the fifth Rhythm Gem floats to the top. "Gross," says Fizz, wiping it off. "But AWESOME." The festival lanterns flicker on, one by one.' }
        },
        '4-factors-multiples': {
            name: 'Factor Fang', emoji: '🐺',
            intro: 'Aroooo! I only howl on multiples. Do you know which numbers are my factors?',
            win: 'You found all my factors. Aroo… you win.',
            chapter: { title: 'Howl in Harmony', text: 'Factor Fang gives back the sixth Rhythm Gem and joins the festival choir. He howls every 4th beat — right on rhythm. Fizz gives him a thumbs up. 🎶' }
        },
        '4-equiv-fractions': {
            name: 'Madame Mirror', emoji: '🧙‍♀️',
            intro: 'My magic mirror makes fractions that LOOK different but are the same. Can you tell?',
            win: 'You saw through every reflection. Impressive.',
            chapter: { title: 'Through the Mirror', text: 'Madame Mirror bows and hands over the seventh Rhythm Gem — and its twin reflection, which vanishes. "Halfway!" Fizz cheers. "Or should I say… seven fourteenths?"' }
        },
        '4-add-sub-fractions': {
            name: 'Flamenca the Flamingo', emoji: '🦩',
            intro: 'I dance in parts — a fourth here, two fourths there! Can you add up my steps?',
            win: 'You counted every fraction of my dance. Bravo!',
            chapter: { title: 'Fancy Footwork', text: 'Flamenca twirls and the eighth Rhythm Gem spins out of her feathers. She offers to teach dance lessons at the festival. Fizz signs up immediately.' }
        },
        '4-multiply-fractions': {
            name: 'Hydra Hex', emoji: '🐉',
            intro: 'Each of my heads has a fraction of the power… but I have SO many heads!',
            win: 'You multiplied all my heads\' power. I surrender!',
            chapter: { title: 'Many Heads', text: 'Hydra Hex\'s heads argue about whose fault it was, then hand over the ninth Rhythm Gem together. "Cousin!" Fizz waves. Hydra Hex waves back with all five heads.' }
        },
        '4-decimals': {
            name: 'Pointy the Peacock', emoji: '🦚',
            intro: 'My tail feathers hide tiny decimal points. Tenths? Hundredths? You\'ll mix them up!',
            win: 'You put every point in the right place. My tail is impressed.',
            chapter: { title: 'Fine Feathers', text: 'Pointy fans out his tail and the tenth Rhythm Gem drops like a sparkly feather. The festival costumes light up with tiny sequins. "Only four more!" says Fizz.' }
        },
        '4-angles': {
            name: 'Scorch the Angle Scorpion', emoji: '🦂',
            intro: 'My tail bends at sneaky angles. Acute? Obtuse? You\'ll never measure me!',
            win: 'Every angle, measured. My tail is tied in a knot!',
            chapter: { title: 'Sharp Turns', text: 'Scorch uncurls his tail and gives back the eleventh Rhythm Gem. The spotlights swing into place at perfect angles. "Three to go," Fizz whispers. "I can almost hear the music."' }
        },
        '4-area-perimeter': {
            name: 'Shellby the Turtle', emoji: '🐢',
            intro: 'This is MY dance floor. Every square foot of it — and every foot of the edge!',
            win: 'Okay, you measured it all. I\'ll share the floor.',
            chapter: { title: 'Room to Dance', text: 'Shellby slowly scoots aside and leaves the twelfth Rhythm Gem in the middle of the dance floor. Now there\'s room for everyone. Fizz practices a spin.' }
        },
        '4-measurement': {
            name: 'Sasquatch Stomper', emoji: '🦍',
            intro: 'Feet! Inches! Pounds! Ounces! I mix up all the measurements!',
            win: 'You converted every one. Even my shoe size!',
            chapter: { title: 'Measuring the Stage', text: 'Sasquatch Stomper gives back the thirteenth Rhythm Gem and helps build the stage — measured perfectly. "One left," Fizz says, looking at the castle on the hill. "The Grumble King has it."' }
        },
        '4-plane-figures': {
            name: 'The Grumble King', emoji: '👹',
            intro: 'GRUMBLE! Nobody dances in MY kingdom! Answer my shape riddles if you dare!',
            win: 'Grumble… grumble… fine. Take the last gem.',
            chapter: { title: 'The Grumble King', text: 'The Grumble King drops the final Rhythm Gem. Fizz places it in the festival stage — and the music EXPLODES across Monster & Dance World. Everyone is dancing. Even… is that the Grumble King tapping his foot?' }
        }
    };

    /** The Fact Dash boss: fights with her weakest single-digit facts. */
    const FACT_BOSS = {
        name: 'Chompy the Fact-a-saurus', emoji: '🦖',
        intro: 'ROAR! I chomped up your trickiest facts — all those 6s, 7s and 8s! Zap them back, FAST!',
        win: 'Roar… you zap facts faster than I can chomp!'
    };

    /** Lines bosses shout mid-battle. */
    const BOSS_HIT_LINES = ['Ouch!', 'Hey, that stung!', 'Lucky guess!', 'Grr… not bad!', 'No fair!', 'Whoa!'];
    const BOSS_ATTACK_LINES = ['Ha! Missed me!', 'Too slow!', 'My turn!', 'Is that all you\'ve got?', 'Hee hee!'];
    const GUIDE_CHEERS = ['You\'ve got this!', 'Keep going!', 'Great hit!', 'Use your strategies!', 'Breathe — you know this!'];
    const GUIDE_CRIT = ['CRITICAL HIT! ⚡', 'Lightning fast! ⚡', 'WOW, so quick! ⚡'];

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function escape(text) {
        return String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }

    /**
     * Full-screen dialogue: the speaker says each line in turn. Enter/Space or the
     * button advances. Resolves when the last line is dismissed.
     *
     * @param {{speaker: {name: string, emoji: string}, title?: string, lines: string[], doneLabel?: string}} opts
     * @returns {Promise<void>}
     */
    function showDialog({ speaker, title, lines, doneLabel = "Let's go! 🚀" }) {
        return new Promise(resolve => {
            document.getElementById('story-overlay')?.remove();
            const overlay = document.createElement('div');
            overlay.id = 'story-overlay';
            overlay.className = 'story-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.innerHTML = `
                <div class="story-card">
                    ${title ? `<div class="story-title">${escape(title)}</div>` : ''}
                    <div class="story-body">
                        <div class="story-speaker" aria-hidden="true">${speaker.emoji}</div>
                        <div class="story-bubble">
                            <div class="story-name">${escape(speaker.name)}</div>
                            <p class="story-line" aria-live="polite"></p>
                        </div>
                    </div>
                    <div class="story-footer">
                        <span class="story-dots"></span>
                        <button type="button" class="btn btn-primary story-next"></button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);

            const lineEl = overlay.querySelector('.story-line');
            const btn = overlay.querySelector('.story-next');
            const dots = overlay.querySelector('.story-dots');
            let i = 0;
            const render = () => {
                lineEl.textContent = lines[i];
                lineEl.classList.remove('story-line-in');
                void lineEl.offsetWidth;
                lineEl.classList.add('story-line-in');
                btn.textContent = i < lines.length - 1 ? 'Next ▶' : doneLabel;
                dots.innerHTML = lines.length > 1
                    ? lines.map((_, j) => `<span class="story-dot${j === i ? ' on' : ''}"></span>`).join('')
                    : '';
            };
            btn.addEventListener('click', () => {
                if (typeof AudioManager !== 'undefined') AudioManager.click();
                if (i < lines.length - 1) { i++; render(); return; }
                overlay.remove();
                resolve();
            });
            render();
            setTimeout(() => btn.focus({ preventScroll: true }), 50);
        });
    }

    return {
        WORLDS,
        FACT_BOSS,

        /** @param {'3rd'|'4th'} grade */
        world(grade) { return WORLDS[grade] || WORLDS['3rd']; },

        /** @param {string} unitId */
        boss(unitId) { return BOSSES[unitId] || null; },

        /** @param {string} unitId @returns {'3rd'|'4th'} */
        gradeOf(unitId) { return unitId.startsWith('4-') ? '4th' : '3rd'; },

        bossHitLine() { return pick(BOSS_HIT_LINES); },
        bossAttackLine() { return pick(BOSS_ATTACK_LINES); },
        guideCheer() { return pick(GUIDE_CHEERS); },
        guideCrit() { return pick(GUIDE_CRIT); },

        showDialog,

        /** Show the world's opening story the first time she visits that map. */
        async maybeShowPrologue(grade) {
            const key = `prologue-${grade}`;
            // Wait for real progress: the placeholder state would replay a seen prologue
            if (!Adaptive.isLoaded() || Adaptive.hasSeenStory(key)) return;
            Adaptive.markStorySeen(key);
            const w = this.world(grade);
            await showDialog({ speaker: w.guide, title: `📖 ${w.title}`, lines: w.prologue });
        },

        /**
         * Story log for a world: prologue, a chapter per beaten boss, and the
         * finale once every boss is beaten.
         *
         * @param {'3rd'|'4th'} grade
         * @param {MathUnit[]} units the world's units, in map order
         */
        showLog(grade, units) {
            const w = this.world(grade);
            const beaten = units.filter(u => Adaptive.getBoss(u.id).wins > 0).length;
            document.getElementById('story-overlay')?.remove();
            const overlay = document.createElement('div');
            overlay.id = 'story-overlay';
            overlay.className = 'story-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            const chapters = units.map((u, i) => {
                const b = BOSSES[u.id];
                const won = Adaptive.getBoss(u.id).wins > 0;
                if (!b) return '';
                return won
                    ? `<li class="log-chapter">
                            <div class="log-chapter-head"><span class="log-emoji" aria-hidden="true">${b.emoji}</span><span><b>Chapter ${i + 1}: ${escape(b.chapter.title)}</b><br><small>${escape(u.title)} · ${w.item.emoji} won from ${escape(b.name)}</small></span></div>
                            <p>${escape(b.chapter.text)}</p>
                       </li>`
                    : `<li class="log-chapter locked">
                            <div class="log-chapter-head"><span class="log-emoji" aria-hidden="true">❓</span><span><b>Chapter ${i + 1}: ???</b><br><small>Beat the ${escape(u.title)} boss to unlock</small></span></div>
                       </li>`;
            }).join('');
            const done = beaten === units.length;
            overlay.innerHTML = `
                <div class="story-card story-log">
                    <div class="story-title">📖 ${escape(w.title)}</div>
                    <div class="log-progress">${w.item.emoji} ${beaten} / ${units.length} ${escape(w.item.plural)} recovered</div>
                    <div class="log-progress-bar"><div style="width:${Math.round(beaten / units.length * 100)}%"></div></div>
                    <ol class="log-list">
                        <li class="log-chapter">
                            <div class="log-chapter-head"><span class="log-emoji" aria-hidden="true">${w.guide.emoji}</span><span><b>Prologue</b><br><small>told by ${escape(w.guide.name)}</small></span></div>
                            ${w.prologue.slice(0, 3).map(l => `<p>${escape(l)}</p>`).join('')}
                        </li>
                        ${chapters}
                        ${done ? `<li class="log-chapter finale">
                            <div class="log-chapter-head"><span class="log-emoji" aria-hidden="true">🏆</span><span><b>The End</b></span></div>
                            ${w.finale.map(l => `<p>${escape(l)}</p>`).join('')}
                        </li>` : ''}
                    </ol>
                    <div class="story-footer"><span></span><button type="button" class="btn btn-primary story-next">Close</button></div>
                </div>`;
            document.body.appendChild(overlay);
            const btn = overlay.querySelector('.story-next');
            btn.addEventListener('click', () => { AudioManager.click(); overlay.remove(); });
            overlay.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.remove(); });
            // Focus Close without scrolling the log to the bottom
            setTimeout(() => btn.focus({ preventScroll: true }), 50);
        },

        /**
         * What the guide says on the map: points her at the next boss to fight
         * (or the next unit to play to wake one up).
         *
         * @param {'3rd'|'4th'} grade
         * @param {MathUnit[]} units
         */
        guideLine(grade, units) {
            const w = this.world(grade);
            if (typeof Facts !== 'undefined' && !Facts.goalReachedToday()) {
                const left = Math.max(1, Math.ceil((Facts.DAILY_GOAL_MS - Facts.msToday()) / 60000));
                return Facts.msToday() === 0
                    ? `First, let's warm up with ⚡ <b>Fact Dash</b> — 10 minutes of quick + − × facts makes everything else easier!`
                    : `Keep going in ⚡ <b>Fact Dash</b> — ${left} more minute${left === 1 ? '' : 's'} of facts today, then on to the bosses!`;
            }
            const ready = units.find(u => Adaptive.isUnitUnlocked(u.id) && Adaptive.isBossUnlocked(u.id) && Adaptive.getBoss(u.id).wins === 0);
            if (ready) {
                const b = BOSSES[ready.id];
                return `${b.emoji} ${b.name} is guarding a ${w.item.name} in <b>${escape(ready.title)}</b>! Tap it and press ⚔️ Boss Battle!`;
            }
            const sleeping = units.find(u => Adaptive.isUnitUnlocked(u.id) && !Adaptive.isBossUnlocked(u.id));
            if (sleeping) {
                return `Play a round of <b>${escape(sleeping.title)}</b> to wake up its boss and win a ${w.item.name}! ${w.item.emoji}`;
            }
            const beaten = units.filter(u => Adaptive.getBoss(u.id).wins > 0).length;
            if (beaten === units.length) {
                return `You saved the whole world, Valerie! 🏆 Try to beat your best boss times!`;
            }
            return `Keep exploring to unlock more units and bosses! ${w.item.emoji} ${beaten}/${units.length}`;
        }
    };
})();
