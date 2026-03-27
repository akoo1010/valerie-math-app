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
                        hint2: `${degrees}° is ${degrees < 90 ? 'less than' : degrees === 90 ? 'equal to' : 'greater than'} 90°`,
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
                                <div style="position:absolute;bottom:4px;left:30px;font-size:0.8rem;color:var(--monster-purple);font-weight:700;">${angle}°</div>
                            </div>
                        </div>`,
                        answer,
                        options: Engine.Utils.shuffle([
                            {label: `${angle}°`, value: angle},
                            {label: `${angle + 20}°`, value: angle + 20},
                            {label: `${Math.max(10, angle - 20)}°`, value: Math.max(10, angle - 20)},
                            {label: `${180 - angle}°`, value: 180 - angle}
                        ]),
                        hint1: `A right angle is 90°. Is this bigger or smaller?`,
                        hint2: `This angle looks ${angle < 90 ? 'smaller' : angle > 90 ? 'bigger' : 'equal to'} 90°`,
                        hint3: `The angle is ${angle}°`,
                        diagnose(userAnswer) {
                            if (userAnswer === 180 - angle) return 'picked-supplement';
                            return null;
                        },
                        misconceptionHints: {
                            'picked-supplement': `You found the supplementary angle (180° - ${angle}° = ${180 - angle}°). Look at the angle itself, not what's left over on a straight line!`
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
                                <div style="position:absolute;top:10px;left:50%;transform:translateX(-50%);font-size:0.8rem;color:var(--monster-purple);font-weight:700;">${angle}°</div>
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
                            'subtracted-instead': `You subtracted the angles instead of adding! When combining angles, add them: ${a}° + ${b}° = ${answer}°`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 35° + 55° = ?</p><p>35 + 55 = <strong>90°</strong></p><p>That makes a right angle!</p></div>`;
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
                        result.workedExample = isComplementary
                            ? `<div style="text-align:center"><p><strong>Complementary Angles:</strong></p><p>Two angles that add to 90°</p><p>Example: 30° + ? = 90°</p><p>90° - 30° = <strong>60°</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Supplementary Angles:</strong></p><p>Two angles that add to 180°</p><p>Example: 110° + ? = 180°</p><p>180° - 110° = <strong>70°</strong></p></div>`;
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
                            'added-not-subtracted': `You added the two known angles (${a1}° + ${a2}° = ${a1 + a2}°), but forgot to subtract from 180°! Triangle angles always add to 180°, so the third angle is 180° - ${a1 + a2}° = ${answer}°`,
                            'used-360-not-180': `You used 360° instead of 180°. A full circle is 360°, but triangle angles add to 180°!`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Triangle Angle Rule:</strong></p><p>All 3 angles in a triangle add to 180°</p><p>Example: angles 60° and 70°</p><p>60 + 70 = 130°</p><p>180° - 130° = <strong>50°</strong></p></div>`;
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
                        hint1: `A full turn is 360°. A half turn is half of that.`,
                        hint2: `A ${selected.name} = ?°`,
                        hint3: `A ${selected.name} = ${answer}°`,
                        diagnose(userAnswer) {
                            if (selected.degrees === 90 && userAnswer === 180) return 'confused-quarter-half';
                            if (selected.degrees === 180 && userAnswer === 90) return 'confused-quarter-half';
                            if (selected.degrees === 270 && userAnswer === 90) return 'confused-quarter-threequarter';
                            if (selected.degrees === 360 && userAnswer === 180) return 'confused-full-half';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-quarter-half': `Quarter and half turns are easy to mix up! A quarter turn is 90° (like a clock hand moving from 12 to 3). A half turn is 180° (from 12 to 6).`,
                            'confused-quarter-threequarter': `A three-quarter turn is 3 times a quarter turn: 3 x 90° = 270°, not just 90°!`,
                            'confused-full-half': `A full turn goes all the way around: 360°, not 180°. A half turn is 180°.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Turns and Degrees:</strong></p><p>Quarter turn = 360° ÷ 4 = 90°</p><p>Half turn = 360° ÷ 2 = 180°</p><p>Three-quarter turn = 3 × 90° = 270°</p><p>Full turn = 360°</p></div>`;
                    } else if (modality === 'visual') {
                        const rotation = selected.degrees;
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.4rem;font-weight:700;color:var(--monster-purple);margin-bottom:8px;">🐲 Monster Spin Tracker 🐲</div>
                            <div style="width:140px;height:140px;margin:0 auto;position:relative;border:3px solid var(--monster-purple);border-radius:50%;background:rgba(139,92,246,0.08);">
                                <div style="position:absolute;top:50%;left:50%;width:60px;height:3px;background:var(--monster-green);transform-origin:left;transform:rotate(-${rotation}deg);"></div>
                                <div style="position:absolute;top:50%;left:50%;width:60px;height:3px;background:var(--monster-red);"></div>
                                <div style="position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:0.7rem;font-weight:700;color:var(--monster-purple);">Start</div>
                            </div>
                            <div style="font-size:0.9rem;color:var(--text-muted);margin-top:6px;">The monster spun a ${selected.name}!</div>
                            <div class="visual-scaffold" style="margin-top:8px;padding:8px;background:rgba(139,92,246,0.1);border-radius:8px;font-size:0.85rem;">
                                <div style="font-weight:700;color:var(--monster-purple);">🐲 Spin Guide:</div>
                                <div>¼ turn = 90° &nbsp; ½ turn = 180°</div>
                                <div>¾ turn = 270° &nbsp; Full = 360°</div>
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
                            hint2: `${deg}° is ${deg < 90 ? 'less than' : deg === 90 ? 'equal to' : 'greater than'} 90°`,
                            hint3: `${deg}° is ${answer}`,
                            diagnose(userAnswer) {
                                if (answer === 'acute' && userAnswer === 'obtuse') return 'confused-acute-obtuse';
                                if (answer === 'obtuse' && userAnswer === 'acute') return 'confused-acute-obtuse';
                                if ((answer === 'acute' || answer === 'obtuse') && userAnswer === 'right') return 'confused-with-right';
                                return null;
                            },
                            misconceptionHints: {
                                'confused-acute-obtuse': `Remember: Acute is SMALL (< 90°), obtuse is BIG (> 90°). The boss monster knows ${deg}° is ${answer}! 🐲`,
                                'confused-with-right': `A right angle is exactly 90°. ${deg}° is ${deg < 90 ? 'less' : 'more'} than 90°, so it is ${answer}! ⚡`
                            }
                        };

                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>🔥 Boss Strategy:</strong></p><p>Compare to 90° (the right angle):</p><p>Less than 90° → Acute (sharp like a fang)</p><p>Exactly 90° → Right (perfect corner)</p><p>More than 90° → Obtuse (wide jaw)</p><p>${deg}° is ${answer}!</p></div>`;
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
                                'used-180-not-90': `These angles add to 90° (complementary), not 180°! The boss says: ${total}° - ${known}° = ${answer}° 🐉`,
                                'used-90-not-180': `These angles add to 180° (supplementary), not 90°! The boss says: ${total}° - ${known}° = ${answer}° 🐉`,
                                'repeated-known': `That is the angle you already know! Use subtraction to find the missing one: ${total}° - ${known}° = ${answer}° 🔥`
                            }
                        };

                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>🔥 Boss Strategy:</strong></p><p>Missing angle = Total - Known angle</p><p>${total}° - ${known}° = <strong>${answer}°</strong></p><p>${total === 90 ? 'Complementary (adds to 90°)' : 'Supplementary (adds to 180°)'}</p></div>`;
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
                                'subtracted-instead': `You subtracted instead of adding! The boss demands: ${a}° + ${b}° = ${answer}°. Add the angles! ⚡`,
                                'only-one-angle': `You only used one angle. Combine both beams: ${a}° + ${b}° = ${answer}° 👾`
                            }
                        };

                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>⚡ Boss Strategy:</strong></p><p>Add both angles together:</p><p>${a}° + ${b}° = <strong>${answer}°</strong></p><p>The monster's combined beam power!</p></div>`;
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
