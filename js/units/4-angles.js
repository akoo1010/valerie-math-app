/* ===== UNIT: ANGLES (4th Grade) — Monster Theme 📐 ===== */

const Angles4 = {
    id: '4-angles',
    title: 'Angles',
    icon: '📐',
    theme: 'monster',
    description: "Measure and classify angles in the monster dojo! Acute, obtuse, right — master them all!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Classify angle as acute, right, or obtuse
            {
                skillId: '4ang-classify',
                generate(diff, modality) {
                    const types = ['acute', 'right', 'obtuse'];
                    const type = pick(types);
                    let degrees;
                    if (type === 'acute') degrees = R(10, 89);
                    else if (type === 'right') degrees = 90;
                    else degrees = R(91, 179);
                    const answer = type;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🐲 A monster's claw makes a ${degrees}° angle! What type of angle is it?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:3rem;font-weight:800;color:var(--monster-purple);">${degrees}°</div>
                            <div style="width:100px;height:100px;margin:10px auto;position:relative;">
                                <div style="position:absolute;bottom:0;left:0;width:90px;height:2px;background:var(--monster-red);"></div>
                                <div style="position:absolute;bottom:0;left:0;width:90px;height:2px;background:var(--monster-blue);transform-origin:left;transform:rotate(-${degrees}deg);"></div>
                            </div>
                        </div>`,
                        answer,
                        options: [
                            {label: 'Acute (< 90°)', value: 'acute'},
                            {label: 'Right (= 90°)', value: 'right'},
                            {label: 'Obtuse (> 90°)', value: 'obtuse'}
                        ],
                        hint1: `Is ${degrees}° less than, equal to, or greater than 90°?`,
                        hint2: `Use the signs in the choices: < 90° means smaller than 90, = 90° means exactly 90, > 90° means bigger. Which sign is true for ${degrees}°?`,
                        hint3: `${degrees}° is ${answer}`,
                        diagnose(userAnswer) {
                            if (type === 'acute' && userAnswer === 'obtuse') return 'confused-acute-obtuse';
                            if (type === 'obtuse' && userAnswer === 'acute') return 'confused-acute-obtuse';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-acute-obtuse': `Remember: Acute angles are SMALL (< 90°), obtuse angles are BIG (> 90°). "A-cute" little angle!`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Angle Types:</strong></p><p>Acute: less than 90° (sharp)</p><p>Right: exactly 90° (square corner)</p><p>Obtuse: more than 90° (wide)</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:10px;padding:10px;background:rgba(139,92,246,0.1);border-radius:8px;font-size:0.9rem;">
                            <div style="font-weight:700;color:var(--monster-purple);margin-bottom:6px;">🐲 Monster Angle Guide:</div>
                            <div>⚡ Acute (&lt; 90°): sharp like a monster's fang</div>
                            <div>🔥 Right (= 90°): perfect corner like a monster's lair door</div>
                            <div>👾 Obtuse (&gt; 90°): wide like a monster's open jaw</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Measure an angle (estimate from visual)
            {
                skillId: '4ang-measure',
                generate(diff, modality) {
                    const angle = R(2, 17) * 10; // 20, 30, ... 170 (multiples of 10)
                    const answer = angle;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `⚡ Estimate the angle! How many degrees?`,
                        visual: `<div style="text-align:center;">
                            <div style="width:120px;height:120px;margin:10px auto;position:relative;">
                                <div style="position:absolute;bottom:0;left:10px;width:100px;height:3px;background:var(--monster-yellow);"></div>
                                <div style="position:absolute;bottom:0;left:10px;width:100px;height:3px;background:var(--monster-red);transform-origin:left;transform:rotate(-${angle}deg);"></div>
                            </div>
                        </div>`,
                        answer,
                        options: (() => {
                            const set = new Set([angle]);
                            // Keep every distractor at least 20° from the answer — this is estimation by eye
                            const candidates = [angle + 20, angle - 20, 180 - angle, angle + 40, angle - 40, angle + 60, angle - 60];
                            for (const c of candidates) {
                                if (c > 0 && c < 180 && Math.abs(c - angle) >= 20 && !set.has(c)) set.add(c);
                                if (set.size === 4) break;
                            }
                            return Engine.Utils.shuffle([...set]).map(v => ({label: `${v}°`, value: v}));
                        })(),
                        hint1: `A right angle is 90° (a square corner). Is this angle smaller, bigger, or a perfect match?`,
                        // Same wording for every angle — "smaller/bigger than 90°" told her the class (and the answer at 90°)
                        hint2: `Use benchmarks: a square corner is 90°, half of one is 45°, and a straight line is 180°. Which benchmark is this angle closest to? Pick the choice nearest your estimate.`,
                        hint3: `The angle is ${angle}°`,
                        diagnose(userAnswer) {
                            if (userAnswer === 180 - angle) return 'picked-supplement';
                            return null;
                        },
                        misconceptionHints: {
                            'picked-supplement': `You picked the supplementary angle — what's left over on a straight line (180°). Look at the opening between the two lines itself: is it smaller or bigger than 90°?`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>How to estimate angles:</strong></p><p>A right angle (90°) looks like an "L" shape.</p><p>Smaller than an L? It's acute (< 90°).</p><p>Wider than an L? It's obtuse (> 90°).</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:2rem;margin-bottom:8px;">🐲 Monster Protractor 🐲</div>
                            <div style="width:160px;height:160px;margin:10px auto;position:relative;border:3px dashed var(--monster-purple);border-radius:50%;">
                                <div style="position:absolute;bottom:50%;left:50%;width:70px;height:3px;background:var(--monster-yellow);"></div>
                                <div style="position:absolute;bottom:50%;left:50%;width:70px;height:3px;background:var(--monster-red);transform-origin:left;transform:rotate(-${angle}deg);"></div>
                            </div>
                            <div style="font-size:0.9rem;color:var(--text-muted);">The monster's protractor shows the angle between its claws!</div>
                            <div class="visual-scaffold" style="margin-top:8px;padding:8px;background:rgba(250,204,21,0.1);border-radius:8px;font-size:0.85rem;">
                                <div style="font-weight:700;color:var(--monster-yellow);">⚡ Tip: Line length doesn't change the angle!</div>
                                <div>A 90° angle is 90° no matter how long the lines are 🦖</div>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Add angles
            {
                skillId: '4ang-add',
                generate(diff, modality) {
                    const a = R(10, diff >= 2 ? 120 : 80);
                    const b = R(10, Math.min(170 - a, diff >= 2 ? 120 : 80));
                    const answer = a + b;

                    const result = {
                        type: 'input',
                        questionText: `🔥 Two monster beams cross! One is ${a}° and the other is ${b}°.<br>What is the total angle?`,
                        visual: `<div style="display:flex;gap:16px;align-items:center;justify-content:center;">
                            <div style="padding:12px;background:rgba(239,68,68,0.15);border:2px solid var(--monster-red);border-radius:10px;font-weight:700;font-size:1.3rem;color:var(--monster-red);">🔥 ${a}°</div>
                            <div style="font-size:1.5rem;font-weight:800;color:var(--monster-yellow);">+</div>
                            <div style="padding:12px;background:rgba(59,130,246,0.15);border:2px solid var(--monster-blue);border-radius:10px;font-weight:700;font-size:1.3rem;color:var(--monster-blue);">⚡ ${b}°</div>
                        </div>`,
                        answer,
                        hint1: `Just add the two angles together!`,
                        hint2: `${a}° + ${b}° = ?`,
                        hint3: `${a}° + ${b}° = ${answer}°`,
                        diagnose(userAnswer) {
                            if (userAnswer === Math.abs(a - b)) return 'subtracted-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'subtracted-instead': `You subtracted the angles instead of adding! When combining angles, add them: ${a}° + ${b}° = ?`
                        }
                    };

                    if (modality === 'worked-example') {
                        const [weA, weB] = answer === 90 ? [40, 60] : [35, 55];
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weA}° + ${weB}° = ?</p><p>${weA} + ${weB} = <strong>${weA + weB}°</strong></p><p>${weA + weB === 90 ? 'That makes a right angle!' : 'Just add the two angles!'}</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <div style="font-size:1rem;font-weight:700;color:var(--monster-green);margin-bottom:6px;">🐲 Monster Beam Combiner 🐲</div>
                            <div style="display:inline-block;padding:8px 16px;background:rgba(74,222,128,0.15);border:2px solid var(--monster-green);border-radius:10px;font-size:1.2rem;font-weight:700;color:var(--monster-green);">
                                ${a}° + ${b}° = 👾 ?°
                            </div>
                            <div style="margin-top:6px;font-size:0.85rem;color:var(--text-muted);">Combine both beams to find the total angle!</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Find the missing angle (supplementary/complementary)
            {
                skillId: '4ang-missing',
                generate(diff, modality) {
                    const isComplementary = diff <= 1 || Math.random() < 0.5;
                    const total = isComplementary ? 90 : 180;
                    const known = R(10, total - 10);
                    const answer = total - known;

                    const result = {
                        type: 'input',
                        questionText: isComplementary
                            ? `🐾 Two angles make a right angle (90°). One is ${known}°.<br>What is the other angle?`
                            : `🐲 Two angles make a straight line (180°). One is ${known}°.<br>What is the other angle?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:1.6rem;font-weight:700;color:var(--monster-purple);">${known}° + ? = ${total}°</div>
                            <div style="margin-top:8px;font-size:1rem;color:var(--text-muted);">${isComplementary ? 'Complementary angles = 90°' : 'Supplementary angles = 180°'}</div>
                        </div>`,
                        answer,
                        hint1: `${total}° - ${known}° = ?`,
                        hint2: `Subtract: ${total} - ${known}`,
                        hint3: `The missing angle is ${answer}°`,
                        diagnose(userAnswer) {
                            if (isComplementary && userAnswer === 180 - known) return 'used-180-not-90';
                            if (!isComplementary && userAnswer === 90 - known) return 'used-90-not-180';
                            return null;
                        },
                        misconceptionHints: {
                            'used-180-not-90': `These are complementary angles — they add to 90°, not 180°!`,
                            'used-90-not-180': `These are supplementary angles — they add to 180°, not 90°!`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Example angle that is neither this question's known angle nor its answer (else it's the same pair)
                        const weK = isComplementary
                            ? ([known, answer].includes(30) ? 40 : 30)
                            : ([known, answer].includes(110) ? 120 : 110);
                        result.workedExample = isComplementary
                            ? `<div style="text-align:center"><p><strong>Complementary Angles:</strong></p><p>Two angles that add to 90°</p><p>Example: ${weK}° + ? = 90°</p><p>90° - ${weK}° = <strong>${90 - weK}°</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Supplementary Angles:</strong></p><p>Two angles that add to 180°</p><p>Example: ${weK}° + ? = 180°</p><p>180° - ${weK}° = <strong>${180 - weK}°</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <div style="font-size:1rem;font-weight:700;color:var(--monster-purple);margin-bottom:6px;">${isComplementary ? '🔥 Complementary Corner' : '👾 Supplementary Straight Line'}</div>
                            <div style="display:flex;gap:10px;justify-content:center;align-items:center;">
                                <div style="padding:8px 14px;background:rgba(239,68,68,0.15);border:2px solid var(--monster-red);border-radius:8px;font-weight:700;color:var(--monster-red);">${known}°</div>
                                <div style="font-size:1.2rem;font-weight:800;">+</div>
                                <div style="padding:8px 14px;background:rgba(250,204,21,0.15);border:2px dashed var(--monster-yellow);border-radius:8px;font-weight:700;color:var(--monster-yellow);">?°</div>
                                <div style="font-size:1.2rem;font-weight:800;">=</div>
                                <div style="padding:8px 14px;background:rgba(139,92,246,0.15);border:2px solid var(--monster-purple);border-radius:8px;font-weight:700;color:var(--monster-purple);">${total}°</div>
                            </div>
                            <div style="margin-top:6px;font-size:0.85rem;color:var(--text-muted);">${isComplementary ? 'Right angle = 90° 🐾' : 'Straight line = 180° 🐲'}</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Angles in a triangle
            {
                skillId: '4ang-triangle',
                generate(diff, modality) {
                    const a1 = R(30, 80);
                    const a2 = R(30, 140 - a1);
                    const answer = 180 - a1 - a2;

                    const result = {
                        type: 'input',
                        questionText: `🦖 A monster triangle has angles of ${a1}° and ${a2}°.<br>What is the third angle?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:1.4rem;font-weight:700;color:var(--monster-green);">Triangle angles add to 180°</div>
                            <div style="margin-top:10px;display:flex;gap:12px;justify-content:center;">
                                <div style="padding:8px 14px;background:rgba(239,68,68,0.15);border-radius:8px;font-weight:700;color:var(--monster-red);">🔺 ${a1}°</div>
                                <div style="padding:8px 14px;background:rgba(59,130,246,0.15);border-radius:8px;font-weight:700;color:var(--monster-blue);">🔺 ${a2}°</div>
                                <div style="padding:8px 14px;background:rgba(250,204,21,0.15);border-radius:8px;font-weight:700;color:var(--monster-yellow);">🔺 ?°</div>
                            </div>
                        </div>`,
                        answer,
                        hint1: `All three angles in a triangle add up to 180°`,
                        hint2: `${a1}° + ${a2}° = ${a1 + a2}°. What's left to reach 180°?`,
                        hint3: `180° - ${a1}° - ${a2}° = ${answer}°`,
                        diagnose(userAnswer) {
                            if (userAnswer === a1 + a2) return 'added-not-subtracted';
                            if (userAnswer === 360 - a1 - a2) return 'used-360-not-180';
                            return null;
                        },
                        misconceptionHints: {
                            'added-not-subtracted': `You added the two known angles (${a1}° + ${a2}° = ${a1 + a2}°), but forgot to subtract from 180°! Triangle angles always add to 180°, so the third angle is 180° - ${a1 + a2}° = ?`,
                            'used-360-not-180': `You used 360° instead of 180°. A full circle is 360°, but triangle angles add to 180°!`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Never the question's own triangle (50°, 60°, 70° in any order) or its answer
                        const same = [a1, a2, answer].sort((x, y) => x - y).join() === '50,60,70';
                        const [weA1, weA2] = same ? [40, 60] : answer === 50 ? [50, 70] : [60, 70];
                        result.workedExample = `<div style="text-align:center"><p><strong>Triangle Angle Rule:</strong></p><p>All 3 angles in a triangle add to 180°</p><p>Example: angles ${weA1}° and ${weA2}°</p><p>${weA1} + ${weA2} = ${weA1 + weA2}°</p><p>180° - ${weA1 + weA2}° = <strong>${180 - weA1 - weA2}°</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.6rem;font-weight:700;color:var(--monster-green);margin-bottom:8px;">🦖 Monster Triangle Challenge 🦖</div>
                            <div style="width:200px;height:160px;margin:0 auto;position:relative;">
                                <svg viewBox="0 0 200 160" style="width:100%;height:100%;">
                                    <polygon points="100,10 20,150 180,150" fill="rgba(74,222,128,0.15)" stroke="var(--monster-green)" stroke-width="3"/>
                                    <text x="100" y="40" text-anchor="middle" fill="var(--monster-red)" font-weight="700" font-size="14">${a1}°</text>
                                    <text x="35" y="145" text-anchor="middle" fill="var(--monster-blue)" font-weight="700" font-size="14">${a2}°</text>
                                    <text x="170" y="145" text-anchor="middle" fill="var(--monster-yellow)" font-weight="700" font-size="14">?°</text>
                                </svg>
                            </div>
                            <div style="font-size:0.9rem;color:var(--text-muted);margin-top:4px;">The monster's three horns form a triangle!</div>
                            <div class="visual-scaffold" style="margin-top:8px;padding:8px;background:rgba(74,222,128,0.1);border-radius:8px;font-size:0.85rem;">
                                <div style="font-weight:700;color:var(--monster-green);">🦖 Monster Math Rule:</div>
                                <div>${a1}° + ${a2}° + ?° = 180°</div>
                                <div>So ?° = 180° − ${a1 + a2}°</div>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Turns and angles (quarter, half, full turn)
            {
                skillId: '4ang-turns',
                generate(diff, modality) {
                    const turns = [
                        {name: 'quarter turn', degrees: 90},
                        {name: 'half turn', degrees: 180},
                        {name: 'three-quarter turn', degrees: 270},
                        {name: 'full turn', degrees: 360}
                    ];
                    const selected = diff >= 2 ? pick(turns) : pick(turns.slice(0, 2));
                    const answer = selected.degrees;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🐲 A monster makes a <strong>${selected.name}</strong>. How many degrees is that?`,
                        visual: `<div style="text-align:center;font-size:3rem;">🐲🔄</div>`,
                        answer,
                        options: Engine.Utils.shuffle([
                            {label: '90°', value: 90},
                            {label: '180°', value: 180},
                            {label: '270°', value: 270},
                            {label: '360°', value: 360}
                        ]),
                        // Set up the math for THIS turn, ending at "?"
                        hint1: {
                            90: `A quarter turn is ¼ of a full 360° turn: 360° ÷ 4 = ?`,
                            180: `A full turn is 360°. A half turn is half of that.`,
                            270: `A three-quarter turn is 3 quarter turns, and a quarter turn is 360° ÷ 4. So 3 × (360° ÷ 4) = ?`,
                            360: `A full turn is 4 quarter turns, and a quarter turn is a square corner (90°). 4 × 90° = ?`
                        }[selected.degrees],
                        hint2: {
                            90: `On a clock, a quarter turn moves the hand from 12 to 3 — one square corner. How many degrees is a square corner?`,
                            180: `On a clock, a half turn moves the hand from 12 to 6 — 2 square corners. 2 × 90° = ?`,
                            270: `On a clock, a three-quarter turn moves the hand from 12 to 9 — 3 square corners. 3 × 90° = ?`,
                            360: `On a clock, a full turn takes the hand from 12 all the way back to 12 — 2 half turns. 180° + 180° = ?`
                        }[selected.degrees],
                        hint3: `A ${selected.name} = ${answer}°`,
                        diagnose(userAnswer) {
                            if (selected.degrees === 90 && userAnswer === 180) return 'confused-quarter-half';
                            if (selected.degrees === 180 && userAnswer === 90) return 'confused-quarter-half';
                            if (selected.degrees === 270 && userAnswer === 90) return 'confused-quarter-threequarter';
                            if (selected.degrees === 360 && userAnswer === 180) return 'confused-full-half';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-quarter-half': `Quarter and half turns are easy to mix up! A full turn is 360°. A quarter turn is ¼ of it (a clock hand moving from 12 to 3): 360° ÷ 4. A half turn is ½ of it (from 12 to 6): 360° ÷ 2. So a ${selected.name} = ?`,
                            'confused-quarter-threequarter': `90° is just ONE quarter turn! A three-quarter turn is 3 quarter turns: 3 × 90° = ?`,
                            'confused-full-half': `180° is only a half turn — halfway around! A full turn goes all the way back to the start, so it's 2 half turns: 2 × 180° = ?`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Solve turns that are NOT among the options — listing the other three turns would leave only the answer.
                        // For the full turn, don't state "full turn = 360°"; build from square corners instead.
                        const facts = selected.degrees === 360
                            ? ['A quarter turn is a square corner (90°).', 'Example: a half turn is 2 quarter turns: 2 × 90° = <strong>180°</strong>']
                            : ['A full turn is 360°.', 'Example: a one-third turn is ⅓ of it: 360° ÷ 3 = <strong>120°</strong>', 'A two-thirds turn is 2 of those: 2 × 120° = <strong>240°</strong>'];
                        result.workedExample = `<div style="text-align:center"><p><strong>Turns and Degrees:</strong></p>${facts.map(f => `<p>${f}</p>`).join('')}</div>`;
                    } else if (modality === 'visual') {
                        const rotation = selected.degrees;
                        // Set up the spin math for THIS turn only — a full ¼/½/¾/full table would just be an answer key
                        const spinMath = {
                            90: '¼ of a full 360° turn: 360° ÷ 4 = ?°',
                            180: '½ of a full 360° turn: 360° ÷ 2 = ?°',
                            270: '¾ turn = 3 quarter turns, and a quarter turn is 360° ÷ 4. So 3 × (360° ÷ 4) = ?°',
                            360: 'Full turn = 4 quarter turns, and a quarter turn is a square corner (90°). So 4 × 90° = ?°'
                        }[rotation];
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.4rem;font-weight:700;color:var(--monster-purple);margin-bottom:8px;">🐲 Monster Spin Tracker 🐲</div>
                            <div style="width:140px;height:140px;margin:0 auto;position:relative;border:3px solid var(--monster-purple);border-radius:50%;background:conic-gradient(rgba(74,222,128,0.3) 0deg ${rotation}deg, rgba(139,92,246,0.08) ${rotation}deg);">
                                <div style="position:absolute;top:50%;left:50%;width:60px;height:3px;background:var(--monster-green);transform-origin:left;transform:rotate(${rotation - 90}deg);"></div>
                                <div style="position:absolute;top:50%;left:50%;width:60px;height:3px;background:var(--monster-red);transform-origin:left;transform:rotate(-90deg);"></div>
                                <div style="position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:0.7rem;font-weight:700;color:var(--monster-purple);">Start</div>
                            </div>
                            <div style="font-size:0.9rem;color:var(--text-muted);margin-top:6px;">The monster spun a ${selected.name}!</div>
                            <div class="visual-scaffold" style="margin-top:8px;padding:8px;background:rgba(139,92,246,0.1);border-radius:8px;font-size:0.85rem;">
                                <div style="font-weight:700;color:var(--monster-purple);">🐲 Spin Guide:</div>
                                <div>${spinMath}</div>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Angle Boss Battle
            {
                skillId: '4ang-boss',
                generate(diff, modality) {
                    const type = pick(['classify', 'missing', 'add']);

                    if (type === 'classify') {
                        const deg = pick([R(10, 89), 90, R(91, 179)]);
                        const answer = deg < 90 ? 'acute' : deg === 90 ? 'right' : 'obtuse';

                        const result = {
                            type: 'multiple-choice',
                            questionText: `👾 DOJO BOSS! Classify ${deg}°`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">📐⚔️🐲</div>`,
                            answer,
                            options: [{label: 'Acute', value: 'acute'}, {label: 'Right', value: 'right'}, {label: 'Obtuse', value: 'obtuse'}],
                            hint1: `Is ${deg}° less than, equal to, or greater than 90°?`,
                            hint2: `Acute is less than 90°, right is exactly 90°, obtuse is more than 90°. Which one fits ${deg}°?`,
                            hint3: `${deg}° is ${answer}`,
                            diagnose(userAnswer) {
                                if (answer === 'acute' && userAnswer === 'obtuse') return 'confused-acute-obtuse';
                                if (answer === 'obtuse' && userAnswer === 'acute') return 'confused-acute-obtuse';
                                if ((answer === 'acute' || answer === 'obtuse') && userAnswer === 'right') return 'confused-with-right';
                                if (answer === 'right' && (userAnswer === 'acute' || userAnswer === 'obtuse')) return 'confused-with-right';
                                return null;
                            },
                            misconceptionHints: {
                                'confused-acute-obtuse': `Remember: Acute is SMALL (< 90°), obtuse is BIG (> 90°). Is ${deg}° smaller or bigger than 90°? 🐲`,
                                'confused-with-right': `A right angle is exactly 90° — no more, no less. Is ${deg}° exactly 90°, less than 90° (acute), or more than 90° (obtuse)? ⚡`
                            }
                        };

                        if (modality === 'worked-example') {
                            // Example angle from a different category, so it doesn't answer this question
                            const weDeg = answer === 'acute' ? R(91, 179) : answer === 'obtuse' ? R(10, 89) : pick([R(10, 89), R(91, 179)]);
                            const weType = weDeg < 90 ? 'acute' : 'obtuse';
                            result.workedExample = `<div style="text-align:center"><p><strong>🔥 Boss Strategy:</strong></p><p>Compare to 90° (the right angle):</p><p>Less than 90° → Acute (sharp like a fang)</p><p>Exactly 90° → Right (perfect corner)</p><p>More than 90° → Obtuse (wide jaw)</p><p>Example: ${weDeg}° is ${weType}!</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(239,68,68,0.1);border-radius:8px;font-size:0.9rem;text-align:center;">
                                <div style="font-weight:700;color:var(--monster-red);margin-bottom:6px;">🐲 Boss Hint:</div>
                                <div style="font-size:1.5rem;font-weight:800;color:var(--monster-purple);">${deg}°</div>
                                <div style="margin-top:4px;">Is it smaller than 90°, equal to 90°, or bigger than 90°?</div>
                            </div>`;
                        }

                        return result;

                    } else if (type === 'missing') {
                        const total = pick([90, 180]);
                        const known = R(10, total - 10);
                        const answer = total - known;

                        const result = {
                            type: 'input',
                            questionText: `🔥 DOJO BOSS! ${known}° + ? = ${total}°`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🐉📐🔥</div>`,
                            answer,
                            hint1: `${total} - ${known} = ?`,
                            hint2: `Subtract to find the missing angle`,
                            hint3: `The missing angle is ${answer}°`,
                            diagnose(userAnswer) {
                                const wrongTotal = total === 90 ? 180 : 90;
                                if (userAnswer === wrongTotal - known) return total === 90 ? 'used-180-not-90' : 'used-90-not-180';
                                if (userAnswer === known) return 'repeated-known';
                                return null;
                            },
                            misconceptionHints: {
                                'used-180-not-90': `These angles add to 90° (complementary), not 180°! The boss says: ${total}° - ${known}° = ? 🐉`,
                                'used-90-not-180': `These angles add to 180° (supplementary), not 90°! The boss says: ${total}° - ${known}° = ? 🐉`,
                                'repeated-known': `That is the angle you already know! Use subtraction to find the missing one: ${total}° - ${known}° = ? 🔥`
                            }
                        };

                        if (modality === 'worked-example') {
                            let weKnown = R(10, total - 10);
                            while (weKnown === known || weKnown === answer) weKnown = R(10, total - 10);
                            result.workedExample = `<div style="text-align:center"><p><strong>🔥 Boss Strategy:</strong></p><p>Missing angle = Total - Known angle</p><p>Example: ${weKnown}° + ? = ${total}°</p><p>${total}° - ${weKnown}° = <strong>${total - weKnown}°</strong></p><p>${total === 90 ? 'Complementary (adds to 90°)' : 'Supplementary (adds to 180°)'}</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;padding:10px;background:rgba(239,68,68,0.1);border-radius:8px;">
                                <div style="font-weight:700;color:var(--monster-red);margin-bottom:6px;">🐉 Boss Equation:</div>
                                <div style="display:flex;gap:8px;justify-content:center;align-items:center;font-size:1.1rem;font-weight:700;">
                                    <span style="color:var(--monster-blue);">${known}°</span>
                                    <span>+</span>
                                    <span style="color:var(--monster-yellow);">?°</span>
                                    <span>=</span>
                                    <span style="color:var(--monster-purple);">${total}°</span>
                                </div>
                                <div style="margin-top:4px;font-size:0.85rem;color:var(--text-muted);">Subtract to find the missing angle!</div>
                            </div>`;
                        }

                        return result;

                    } else {
                        const a = R(20, 80);
                        const b = R(20, 80);
                        const answer = a + b;

                        const result = {
                            type: 'input',
                            questionText: `⚡ DOJO BOSS! ${a}° + ${b}° = ?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">⚡📐⚡</div>`,
                            answer,
                            hint1: `Add the two angles`,
                            hint2: `${a} + ${b} = ?`,
                            hint3: `${a}° + ${b}° = ${answer}°`,
                            diagnose(userAnswer) {
                                if (userAnswer === Math.abs(a - b)) return 'subtracted-instead';
                                if (userAnswer === a || userAnswer === b) return 'only-one-angle';
                                return null;
                            },
                            misconceptionHints: {
                                'subtracted-instead': `You subtracted instead of adding! The boss demands: ${a}° + ${b}° = ? Add the angles! ⚡`,
                                'only-one-angle': `You only used one angle. Combine both beams: ${a}° + ${b}° = ? 👾`
                            }
                        };

                        if (modality === 'worked-example') {
                            let weA = R(20, 80), weB = R(20, 80);
                            while (weA + weB === answer) { weA = R(20, 80); weB = R(20, 80); }
                            result.workedExample = `<div style="text-align:center"><p><strong>⚡ Boss Strategy:</strong></p><p>Add both angles together:</p><p>Example: ${weA}° + ${weB}° = <strong>${weA + weB}°</strong></p><p>The monster's combined beam power!</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;padding:10px;background:rgba(250,204,21,0.1);border-radius:8px;">
                                <div style="font-weight:700;color:var(--monster-yellow);margin-bottom:6px;">⚡ Boss Beam Combiner:</div>
                                <div style="display:flex;gap:10px;justify-content:center;align-items:center;font-size:1.2rem;font-weight:700;">
                                    <span style="color:var(--monster-red);">🔥 ${a}°</span>
                                    <span>+</span>
                                    <span style="color:var(--monster-blue);">⚡ ${b}°</span>
                                    <span>=</span>
                                    <span style="color:var(--monster-yellow);">👾 ?°</span>
                                </div>
                                <div style="margin-top:4px;font-size:0.85rem;color:var(--text-muted);">Add both monster beams for total power!</div>
                            </div>`;
                        }

                        return result;
                    }
                }
            }
        ];
    }
};
