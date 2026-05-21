/* ===== UNIT: MULTIPLY BY 2-DIGIT (4th Grade) — Dance Theme 💃 ===== */

const Multiply2Digit4 = {
    id: '4-multiply-2digit',
    title: 'Multiply by 2-Digit',
    icon: '💃',
    theme: 'dance',
    description: "Double the dance moves! Multiply 2-digit by 2-digit numbers with area models and algorithms!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Multiply by multiples of 10
            {
                skillId: '4m2-tens',
                generate(diff, modality) {
                    const a = R(11, diff >= 2 ? 99 : 50);
                    const b = pick([10, 20, 30, 40, 50]);
                    const answer = a * b;

                    const result = {
                        type: 'input',
                        questionText: `🎵 The DJ plays ${a} songs, each ${b} seconds long.<br>Total seconds of music?`,
                        visual: `<div style="text-align:center;font-size:1.6rem;font-weight:700;color:var(--dance-pink);">
                            ${a} × ${b} = ?
                        </div>`,
                        answer,
                        hint1: `${a} × ${b} = ${a} × ${b / 10} × 10`,
                        hint2: `${a} × ${b / 10} = ${a * (b / 10)}, then add a zero: ${Engine.Utils.fmt(answer)}`,
                        hint3: `${a} × ${b} = ${Engine.Utils.fmt(answer)}`
                    };

                    result.diagnose = function(userAnswer) {
                        if (userAnswer === a * (b / 10)) return 'forgot-zero';
                        return null;
                    };
                    result.misconceptionHints = {
                        'forgot-zero': `Almost! You found ${a} × ${b / 10} = ${a * (b / 10)}, but ${b} is ${b / 10} × 10. Don't forget to add a zero! ${a} × ${b} = ${Engine.Utils.fmt(answer)}.`
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 25 × 30 = ?</p><p>25 × 3 = 75</p><p>Add a zero: <strong>750</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-bottom:8px;">
                                <div style="background:var(--dance-pink);color:#fff;padding:10px 16px;border-radius:10px;font-weight:700;font-size:1.3rem;">${a}</div>
                                <div style="font-size:1.5rem;color:var(--dance-gold);">×</div>
                                <div style="background:var(--dance-cyan);color:#fff;padding:10px 16px;border-radius:10px;font-weight:700;font-size:1.3rem;">${b / 10}</div>
                                <div style="font-size:1.5rem;color:var(--dance-gold);">×</div>
                                <div style="background:var(--dance-purple);color:#fff;padding:10px 16px;border-radius:10px;font-weight:700;font-size:1.3rem;">10</div>
                            </div>
                            <div style="color:var(--dance-gold);font-weight:700;font-size:1.1rem;">${a} × ${b / 10} = ${a * (b / 10)}, then × 10 → add a zero!</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Area model 2-digit × 2-digit
            {
                skillId: '4m2-area-model',
                generate(diff, modality) {
                    const a = R(11, diff >= 2 ? 50 : 30);
                    const b = R(11, diff >= 2 ? 50 : 30);
                    const aTens = Math.floor(a / 10) * 10;
                    const aOnes = a % 10;
                    const bTens = Math.floor(b / 10) * 10;
                    const bOnes = b % 10;
                    const answer = a * b;

                    const p1 = aTens * bTens;
                    const p2 = aTens * bOnes;
                    const p3 = aOnes * bTens;
                    const p4 = aOnes * bOnes;

                    const result = {
                        type: 'input',
                        questionText: `💃 Use the area model to find ${a} × ${b}!`,
                        visual: `<div style="text-align:center;">
                            <div style="display:inline-grid;grid-template-columns:60px 90px 60px;gap:2px;">
                                <div></div>
                                <div style="background:rgba(236,72,153,0.2);padding:6px;border-radius:6px 6px 0 0;font-weight:700;color:var(--dance-pink);">${aTens}</div>
                                <div style="background:rgba(34,211,238,0.2);padding:6px;border-radius:6px 6px 0 0;font-weight:700;color:var(--dance-cyan);">${aOnes}</div>
                                <div style="background:rgba(251,191,36,0.2);padding:6px;border-radius:6px 0 0 6px;font-weight:700;color:var(--dance-gold);">${bTens}</div>
                                <div style="background:rgba(236,72,153,0.08);padding:10px;border:2px dashed var(--dance-pink);font-weight:700;">${p1}</div>
                                <div style="background:rgba(34,211,238,0.08);padding:10px;border:2px dashed var(--dance-cyan);font-weight:700;">${p3}</div>
                                <div style="background:rgba(168,85,247,0.2);padding:6px;border-radius:6px 0 0 6px;font-weight:700;color:var(--dance-purple);">${bOnes}</div>
                                <div style="background:rgba(168,85,247,0.08);padding:10px;border:2px dashed var(--dance-purple);font-weight:700;">${p2}</div>
                                <div style="background:rgba(217,70,239,0.08);padding:10px;border:2px dashed var(--dance-magenta);font-weight:700;">${p4}</div>
                            </div>
                            <div style="margin-top:10px;font-weight:700;color:var(--dance-gold);">${p1} + ${p3} + ${p2} + ${p4} = ?</div>
                        </div>`,
                        answer,
                        hint1: `Add all four parts of the area model together!`,
                        hint2: `${p1} + ${p3} + ${p2} + ${p4}`,
                        hint3: `${p1} + ${p3} + ${p2} + ${p4} = ${Engine.Utils.fmt(answer)}`
                    };

                    result.diagnose = function(userAnswer) {
                        const partials = [p1, p2, p3, p4];
                        for (let i = 0; i < partials.length; i++) {
                            if (userAnswer === answer - partials[i]) return 'missed-a-partial-product';
                        }
                        return null;
                    };
                    result.misconceptionHints = {
                        'missed-a-partial-product': `It looks like you missed one of the four partial products! Make sure to add all four: ${p1} + ${p2} + ${p3} + ${p4} = ${Engine.Utils.fmt(answer)}.`
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 23 × 14</p><p>20×10=200, 20×4=80, 3×10=30, 3×4=12</p><p>200+80+30+12 = <strong>322</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="display:inline-grid;grid-template-columns:60px 90px 60px;gap:4px;">
                                <div></div>
                                <div style="background:var(--dance-pink);color:#fff;padding:8px;border-radius:8px 8px 0 0;font-weight:700;">${aTens}</div>
                                <div style="background:var(--dance-cyan);color:#fff;padding:8px;border-radius:8px 8px 0 0;font-weight:700;">${aOnes}</div>
                                <div style="background:var(--dance-gold);color:#fff;padding:8px;border-radius:8px 0 0 8px;font-weight:700;">${bTens}</div>
                                <div style="background:rgba(236,72,153,0.15);padding:12px;border:3px solid var(--dance-pink);border-radius:8px;font-weight:800;font-size:1.1rem;">${p1}</div>
                                <div style="background:rgba(34,211,238,0.15);padding:12px;border:3px solid var(--dance-cyan);border-radius:8px;font-weight:800;font-size:1.1rem;">${p3}</div>
                                <div style="background:var(--dance-purple);color:#fff;padding:8px;border-radius:8px 0 0 8px;font-weight:700;">${bOnes}</div>
                                <div style="background:rgba(168,85,247,0.15);padding:12px;border:3px solid var(--dance-purple);border-radius:8px;font-weight:800;font-size:1.1rem;">${p2}</div>
                                <div style="background:rgba(217,70,239,0.15);padding:12px;border:3px solid var(--dance-magenta);border-radius:8px;font-weight:800;font-size:1.1rem;">${p4}</div>
                            </div>
                            <div style="margin-top:12px;font-size:1.2rem;font-weight:800;color:var(--dance-gold);">Add all 4 boxes: ${p1} + ${p2} + ${p3} + ${p4} = ?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Standard algorithm 2-digit × 2-digit
            {
                skillId: '4m2-standard',
                generate(diff, modality) {
                    const a = R(11, diff >= 2 ? 99 : 50);
                    const b = R(11, diff >= 2 ? 99 : 50);
                    const answer = a * b;

                    const result = {
                        type: 'input',
                        questionText: `🕺 Solve: ${a} × ${b} = ?`,
                        visual: `<div style="font-family:var(--font-display);font-size:1.6rem;text-align:right;line-height:1.8;color:var(--dance-gold);">
                            <div>${a}</div>
                            <div style="border-bottom:2px solid var(--dance-pink);padding-bottom:4px;">× ${b}</div>
                        </div>`,
                        answer,
                        hint1: `Step 1: Multiply ${a} by ${b % 10} (ones digit)`,
                        hint2: `Step 2: Multiply ${a} by ${Math.floor(b / 10) * 10} (tens). Then add both products!`,
                        hint3: `${a} × ${b} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            // Common: forgot to add the zero when multiplying by tens
                            if (userAnswer === a * (b % 10) + a * Math.floor(b / 10)) return 'forgot-tens-zero';
                            return null;
                        },
                        misconceptionHints: {
                            'forgot-tens-zero': `When multiplying by the tens digit, don't forget the zero! ${a} × ${Math.floor(b / 10)} = ${a * Math.floor(b / 10)}, but it represents ${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 34 × 12</p><p>34 × 2 = 68</p><p>34 × 10 = 340</p><p>68 + 340 = <strong>408</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:6px;">✨ Two-Step Standard Algorithm</div>
                            <div style="display:inline-block;text-align:right;line-height:2;font-size:1.2rem;">
                                <div style="color:var(--dance-gold);">${a}</div>
                                <div style="border-bottom:2px solid var(--dance-pink);color:var(--dance-pink);">× ${b}</div>
                                <div style="color:var(--dance-cyan);">Step 1: ${a} × ${b % 10} = ${a * (b % 10)}</div>
                                <div style="color:var(--dance-purple);">Step 2: ${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10}</div>
                                <div style="border-top:2px solid var(--dance-gold);color:var(--dance-gold);font-weight:800;">Total: ${Engine.Utils.fmt(answer)}</div>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Estimate products
            {
                skillId: '4m2-estimate',
                generate(diff, modality) {
                    const a = R(11, 99);
                    const b = R(11, 99);
                    const estA = Math.round(a / 10) * 10;
                    const estB = Math.round(b / 10) * 10;
                    const answer = estA * estB;
                    const exact = a * b;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🎤 Estimate! Round each number to the nearest 10, then multiply.<br>${a} × ${b} ≈ ?`,
                        visual: `<div style="display:flex;gap:12px;justify-content:center;align-items:center;font-size:1.2rem;">
                            <div style="text-align:center;color:var(--dance-pink);"><strong>${a}</strong><br><span style="font-size:0.8rem;">≈ ${estA}</span></div>
                            <div style="font-size:1.5rem;color:var(--dance-gold);">×</div>
                            <div style="text-align:center;color:var(--dance-cyan);"><strong>${b}</strong><br><span style="font-size:0.8rem;">≈ ${estB}</span></div>
                        </div>`,
                        answer,
                        options: Engine.Utils.roundedMultipleChoice(answer, 100),
                        hint1: `Round: ${a} ≈ ${estA}, ${b} ≈ ${estB}`,
                        hint2: `${estA} × ${estB} = ?`,
                        hint3: `${estA} × ${estB} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (userAnswer === exact && exact !== answer) return 'used-exact';
                            return null;
                        },
                        misconceptionHints: {
                            'used-exact': `You calculated the exact product (${Engine.Utils.fmt(exact)}), but this asks for an estimate. Round each factor to the nearest 10 first: ${a} ≈ ${estA}, ${b} ≈ ${estB}, so ${estA} × ${estB} = ${Engine.Utils.fmt(answer)}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Estimate 38 × 22</p><p>38 ≈ 40, 22 ≈ 20</p><p>40 × 20 = <strong>800</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🎵 Round Each Factor First!</div>
                            <div style="display:flex;gap:16px;justify-content:center;align-items:center;">
                                <div style="text-align:center;">
                                    <div style="font-size:1.4rem;color:var(--dance-pink);font-weight:800;">${a}</div>
                                    <div style="font-size:0.85rem;color:#888;">rounds to</div>
                                    <div style="background:var(--dance-pink);color:#fff;padding:6px 14px;border-radius:8px;font-weight:800;font-size:1.2rem;">${estA}</div>
                                </div>
                                <div style="font-size:1.8rem;color:var(--dance-gold);">×</div>
                                <div style="text-align:center;">
                                    <div style="font-size:1.4rem;color:var(--dance-cyan);font-weight:800;">${b}</div>
                                    <div style="font-size:0.85rem;color:#888;">rounds to</div>
                                    <div style="background:var(--dance-cyan);color:#fff;padding:6px 14px;border-radius:8px;font-weight:800;font-size:1.2rem;">${estB}</div>
                                </div>
                                <div style="font-size:1.8rem;color:var(--dance-gold);">≈</div>
                                <div style="background:var(--dance-gold);color:#fff;padding:6px 14px;border-radius:8px;font-weight:800;font-size:1.2rem;">?</div>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Word problems — 2-digit multiplication
            {
                skillId: '4m2-word',
                generate(diff, modality) {
                    const a = R(12, diff >= 2 ? 50 : 25);
                    const b = R(12, diff >= 2 ? 50 : 25);
                    const answer = a * b;
                    const scenarios = [
                        `🪩 A dance hall has ${a} rows of ${b} seats. How many seats total?`,
                        `🎵 A playlist has ${a} albums, each with ${b} songs. Total songs?`,
                        `💃 A dance troupe of ${a} dancers each performs ${b} shows. Total performances?`
                    ];

                    const result = {
                        type: 'input',
                        questionText: pick(scenarios),
                        visual: `<div style="font-size:2.5rem;text-align:center;">🪩💃🕺🎵</div>`,
                        answer,
                        hint1: `This is multiplication: ${a} × ${b}`,
                        hint2: `Use the area model or standard algorithm to solve`,
                        hint3: `${a} × ${b} = ${Engine.Utils.fmt(answer)}`
                    };

                    result.diagnose = function(userAnswer) {
                        if (userAnswer === a + b) return 'added-instead';
                        return null;
                    };
                    result.misconceptionHints = {
                        'added-instead': `It looks like you added ${a} + ${b} = ${a + b} instead of multiplying. This problem asks for the total when you have ${a} groups of ${b}, so you need ${a} × ${b} = ${Engine.Utils.fmt(answer)}.`
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 15 rows × 12 seats</p><p>15 × 12 = (15 × 10) + (15 × 2)</p><p>= 150 + 30 = <strong>180</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="display:flex;gap:10px;justify-content:center;align-items:center;margin-bottom:10px;">
                                <div style="background:var(--dance-pink);color:#fff;padding:12px 18px;border-radius:12px;font-weight:800;font-size:1.4rem;">${a}</div>
                                <div style="font-size:1.8rem;color:var(--dance-gold);font-weight:700;">groups of</div>
                                <div style="background:var(--dance-cyan);color:#fff;padding:12px 18px;border-radius:12px;font-weight:800;font-size:1.4rem;">${b}</div>
                            </div>
                            <div style="color:var(--dance-purple);font-weight:700;font-size:1.1rem;">Multiply: ${a} × ${b} = ?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Distributive property
            {
                skillId: '4m2-distributive',
                generate(diff, modality) {
                    const a = R(11, 40);
                    // Avoid multiples of 10 (collapses ones partial to 0) and 19 (forgot-tens-zero
                    // value collides with the tens-only partial, making diagnose ambiguous)
                    let b = R(11, 30);
                    while (b % 10 === 0 || b === 19) b = R(11, 30);
                    const bTens = Math.floor(b / 10) * 10;
                    const bOnes = b % 10;
                    const part1 = a * bTens;
                    const part2 = a * bOnes;
                    const answer = part1 + part2;

                    const result = {
                        type: 'input',
                        questionText: `🎶 Break it down! ${a} × ${b} = ${a} × ${bTens} + ${a} × ${bOnes}<br>What is ${a} × ${bTens} + ${a} × ${bOnes}?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:1.3rem;font-weight:700;color:var(--dance-purple);">
                                ${a} × ${bTens} = <span style="color:var(--dance-pink);">${part1}</span>
                            </div>
                            <div style="font-size:1.3rem;font-weight:700;color:var(--dance-purple);">
                                ${a} × ${bOnes} = <span style="color:var(--dance-cyan);">${part2}</span>
                            </div>
                            <div style="margin-top:8px;font-size:1.5rem;font-weight:800;color:var(--dance-gold);">
                                <span style="color:var(--dance-pink);">${part1}</span> + <span style="color:var(--dance-cyan);">${part2}</span> = ?
                            </div>
                        </div>`,
                        answer,
                        hint1: `Add the two partial products together`,
                        hint2: `${Engine.Utils.fmt(part1)} + ${part2} = ?`,
                        hint3: `${Engine.Utils.fmt(part1)} + ${part2} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (userAnswer === part1) return 'only-tens-part';
                            if (userAnswer === part2) return 'only-ones-part';
                            if (userAnswer === a * (b % 10) + a * Math.floor(b / 10)) return 'forgot-tens-zero';
                            return null;
                        },
                        misconceptionHints: {
                            'only-tens-part': `💃 You found ${a} × ${bTens} = ${part1}, but don't stop there! You also need to add ${a} × ${bOnes} = ${part2}. Both parts together: ${Engine.Utils.fmt(part1)} + ${part2} = ${Engine.Utils.fmt(answer)}.`,
                            'only-ones-part': `🕺 You found ${a} × ${bOnes} = ${part2}, but you also need ${a} × ${bTens} = ${part1}. Add both parts: ${Engine.Utils.fmt(part1)} + ${part2} = ${Engine.Utils.fmt(answer)}.`,
                            'forgot-tens-zero': `✨ Remember: ${bTens} is a tens number, so ${a} × ${bTens} = ${part1}, not ${a * Math.floor(b / 10)}. Then add ${a} × ${bOnes} = ${part2}. Total: ${Engine.Utils.fmt(answer)}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 15 × 23 = 15 × 20 + 15 × 3</p><p>15 × 20 = 300</p><p>15 × 3 = 45</p><p>300 + 45 = <strong>345</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🎵 Distributive Property Dance Steps</div>
                            <div style="display:flex;gap:10px;justify-content:center;align-items:stretch;">
                                <div style="background:rgba(236,72,153,0.15);border:2px solid var(--dance-pink);border-radius:10px;padding:10px 16px;text-align:center;">
                                    <div style="font-size:0.85rem;color:var(--dance-pink);font-weight:700;">Step 1 (tens)</div>
                                    <div style="font-size:1.1rem;font-weight:800;">${a} × ${bTens}</div>
                                    <div style="font-size:1.3rem;font-weight:800;color:var(--dance-pink);">= ${part1}</div>
                                </div>
                                <div style="font-size:1.8rem;color:var(--dance-gold);display:flex;align-items:center;">+</div>
                                <div style="background:rgba(34,211,238,0.15);border:2px solid var(--dance-cyan);border-radius:10px;padding:10px 16px;text-align:center;">
                                    <div style="font-size:0.85rem;color:var(--dance-cyan);font-weight:700;">Step 2 (ones)</div>
                                    <div style="font-size:1.1rem;font-weight:800;">${a} × ${bOnes}</div>
                                    <div style="font-size:1.3rem;font-weight:800;color:var(--dance-cyan);">= ${part2}</div>
                                </div>
                                <div style="font-size:1.8rem;color:var(--dance-gold);display:flex;align-items:center;">=</div>
                                <div style="background:rgba(251,191,36,0.15);border:2px solid var(--dance-gold);border-radius:10px;padding:10px 16px;display:flex;align-items:center;">
                                    <div style="font-size:1.3rem;font-weight:800;color:var(--dance-gold);">?</div>
                                </div>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Dance-off Boss
            {
                skillId: '4m2-boss',
                generate(diff, modality) {
                    const a = R(11, diff >= 2 ? 99 : 50);
                    const b = R(11, diff >= 2 ? 99 : 50);
                    const answer = a * b;
                    const bTens = Math.floor(b / 10) * 10;
                    const bOnes = b % 10;
                    const part1 = a * bTens;
                    const part2 = a * bOnes;

                    const result = {
                        type: 'input',
                        questionText: `🪩 DANCE-OFF BOSS! Solve: ${a} × ${b} = ?`,
                        visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">💃🪩🕺</div>`,
                        answer,
                        hint1: `Use any strategy: area model, distributive property, or standard algorithm!`,
                        hint2: `${a} × ${b}: try breaking ${b} into tens and ones — ${a} × ${bTens} + ${a} × ${bOnes}`,
                        hint3: `${a} × ${b} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            // Only multiplied by ones digit (equivalent to missing the tens partial)
                            if (userAnswer === a * bOnes) return 'only-ones-digit';
                            // Forgot to shift the tens partial product (treated tens digit as ones)
                            if (userAnswer === part2 + a * Math.floor(b / 10)) return 'forgot-tens-zero';
                            // Missed the ones partial product
                            if (userAnswer === answer - part2) return 'missed-ones-partial';
                            return null;
                        },
                        misconceptionHints: {
                            'only-ones-digit': `✨ You only multiplied by the ones digit (${bOnes}). Don't forget to also multiply ${a} × ${bTens} = ${part1} and add it! Total: ${Engine.Utils.fmt(part1)} + ${part2} = ${Engine.Utils.fmt(answer)}.`,
                            'forgot-tens-zero': `🎵 When multiplying by the tens digit, remember ${Math.floor(b / 10)} represents ${bTens}! So ${a} × ${bTens} = ${part1}, not ${a * Math.floor(b / 10)}. Answer: ${Engine.Utils.fmt(answer)}.`,
                            'missed-ones-partial': `🕺 Almost! It looks like you forgot to add the ones partial product (${a} × ${bOnes} = ${part2}). Add all parts: ${Engine.Utils.fmt(answer)}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 47 × 23</p><p>47 × 3 = 141</p><p>47 × 20 = 940</p><p>141 + 940 = <strong>1,081</strong></p><p>💃 You've got the moves! Apply the same steps to ${a} × ${b}.</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🪩 Boss Strategy: Break It Down!</div>
                            <div style="display:inline-grid;grid-template-columns:auto auto auto;gap:6px;align-items:center;justify-content:center;">
                                <div style="background:rgba(236,72,153,0.15);border:2px solid var(--dance-pink);border-radius:10px;padding:8px 14px;text-align:center;">
                                    <div style="font-size:0.8rem;color:var(--dance-pink);font-weight:700;">Ones part</div>
                                    <div style="font-weight:800;">${a} × ${bOnes} = ${part2}</div>
                                </div>
                                <div style="font-size:1.5rem;color:var(--dance-gold);font-weight:700;">+</div>
                                <div style="background:rgba(168,85,247,0.15);border:2px solid var(--dance-purple);border-radius:10px;padding:8px 14px;text-align:center;">
                                    <div style="font-size:0.8rem;color:var(--dance-purple);font-weight:700;">Tens part</div>
                                    <div style="font-weight:800;">${a} × ${bTens} = ${part1}</div>
                                </div>
                                <div style="grid-column:1/-1;font-size:1.3rem;font-weight:800;color:var(--dance-gold);margin-top:4px;">${part2} + ${Engine.Utils.fmt(part1)} = ?</div>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            }
        ];
    }
};
