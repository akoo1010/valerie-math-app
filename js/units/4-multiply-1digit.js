/* ===== UNIT: MULTIPLY BY 1-DIGIT (4th Grade) — Monster Theme ⚔️ ===== */

const Multiply1Digit4 = {
    id: '4-multiply-1digit',
    title: 'Multiply by 1-Digit',
    icon: '⚔️',
    theme: 'monster',
    description: "Battle monsters with multiplication! Multiply up to 4-digit numbers by a single digit!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Multiply 2-digit × 1-digit (no regrouping at diff 1)
            {
                skillId: '4m1-basic',
                generate(diff, modality) {
                    let a, b;
                    if (diff <= 1) {
                        a = R(11, 33); b = R(2, 4);
                    } else if (diff === 2) {
                        a = R(10, 99); b = R(2, 9);
                    } else {
                        a = R(50, 99); b = R(5, 9);
                    }
                    const answer = a * b;

                    const result = {
                        type: 'input',
                        questionText: `⚔️ A monster attacks ${b} times with ${a} power each!<br>What is ${a} × ${b}?`,
                        visual: `<div style="font-family:var(--font-display);font-size:1.6rem;text-align:right;line-height:1.8;color:var(--monster-red);">
                            <div>${a}</div>
                            <div style="border-bottom:2px solid var(--monster-purple);padding-bottom:4px;">× ${b}</div>
                        </div>`,
                        answer,
                        hint1: `Break it apart: ${a} = ${Math.floor(a / 10) * 10} + ${a % 10}`,
                        // A round a makes the tens part the whole answer — stop one step short
                        hint2: a % 10 === 0
                            ? `${a / 10} × ${b} = ${(a / 10) * b}, then add a zero: ${a} × ${b} = ?`
                            : `${Math.floor(a / 10) * 10} × ${b} = ${Math.floor(a / 10) * 10 * b}, then ${a % 10} × ${b} = ${(a % 10) * b}`,
                        hint3: `${a} × ${b} = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a + b) return 'added-instead-of-multiplied';
                            if (Math.abs(userAnswer - answer) === b || Math.abs(userAnswer - answer) === a) return 'off-by-one-group';
                            return null;
                        },
                        misconceptionHints: {
                            'added-instead-of-multiplied': `We need to multiply, not add! ${a} × ${b} means ${b} groups of ${a}.`,
                            'off-by-one-group': `Almost! Your answer is off by exactly one group of ${a} or ${b}. Check each part: ${Math.floor(a / 10) * 10} × ${b} and ${a % 10} × ${b}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Question shares the example's answer (e.g. it IS 34 × 3): show a second example so it can't be copied
                        result.workedExample = answer !== 102
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 34 × 3 = ?</p><p>Step 1: 4 × 3 = 12 (write 2, carry 1)</p><p>Step 2: 3 × 3 = 9, plus carried 1 = 10</p><p>Answer: <strong>102</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 46 × 3 = ?</p><p>Step 1: 6 × 3 = 18 (write 8, carry 1)</p><p>Step 2: 4 × 3 = 12, plus carried 1 = 13</p><p>Answer: <strong>138</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        const tensA = Math.floor(a / 10) * 10;
                        const onesA = a % 10;
                        // Round a: the tens box would already be the answer, so show (a ÷ 10) × b and leave the zero to her
                        const parts = onesA
                            ? `<div style="background:rgba(239,68,68,0.15);border:2px solid var(--monster-red);border-radius:10px;padding:10px 14px;font-weight:700;">${tensA} × ${b} = ${tensA * b}</div>
                                <div style="font-size:1.4rem;font-weight:700;">+</div>
                                <div style="background:rgba(59,130,246,0.15);border:2px solid var(--monster-blue);border-radius:10px;padding:10px 14px;font-weight:700;">${onesA} × ${b} = ${onesA * b}</div>`
                            : `<div style="background:rgba(239,68,68,0.15);border:2px solid var(--monster-red);border-radius:10px;padding:10px 14px;font-weight:700;">${a / 10} × ${b} = ${(a / 10) * b}</div>
                                <div style="font-size:1.1rem;font-weight:700;">then × 10 → add a zero!</div>`;
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;color:var(--monster-red);font-weight:700;margin-bottom:8px;">⚔️ Split the monster's power!</div>
                            <div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;">
                                ${parts}
                            </div>
                            <div style="margin-top:10px;font-weight:700;color:var(--monster-purple);font-size:1.1rem;">🔥 ${onesA ? `${tensA * b} + ${onesA * b}` : `${a} × ${b}`} = ?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Multiply 3-digit × 1-digit
            {
                skillId: '4m1-3digit',
                generate(diff, modality) {
                    let a, b;
                    if (diff <= 1) {
                        a = R(100, 300); b = R(2, 4);
                    } else if (diff === 2) {
                        a = R(100, 500); b = R(2, 7);
                    } else {
                        a = R(200, 999); b = R(3, 9);
                    }
                    const answer = a * b;

                    const result = {
                        type: 'input',
                        questionText: `🐲 The dragon has ${a} HP and the spell multiplies it by ${b}!<br>What is ${a} × ${b}?`,
                        visual: `<div style="font-family:var(--font-display);font-size:1.6rem;text-align:right;line-height:1.8;color:var(--monster-blue);">
                            <div>${Engine.Utils.fmt(a)}</div>
                            <div style="border-bottom:2px solid var(--monster-yellow);padding-bottom:4px;">× ${b}</div>
                        </div>`,
                        answer,
                        hint1: `Multiply each digit by ${b}, starting from the ones place`,
                        hint2: `Ones: ${a % 10} × ${b} = ${(a % 10) * b}. Tens: ${Math.floor((a % 100) / 10)} × ${b} = ${Math.floor((a % 100) / 10) * b}. Hundreds: ${Math.floor(a / 100)} × ${b} = ${Math.floor(a / 100) * b}.`,
                        hint3: `${a} × ${b} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (Math.abs(userAnswer - answer) <= 10 && userAnswer !== answer) return 'carry-error';
                            return null;
                        },
                        misconceptionHints: {
                            'carry-error': `So close! Check your carrying — when a product is 10 or more, carry to the next column.`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Question shares the example's answer (e.g. it IS 253 × 4): show a second example so it can't be copied
                        result.workedExample = answer !== 1012
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 253 × 4 = ?</p><p>3 × 4 = 12 → write 2, carry 1</p><p>5 × 4 = 20 + 1 = 21 → write 1, carry 2</p><p>2 × 4 = 8 + 2 = 10</p><p>Answer: <strong>1,012</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 187 × 3 = ?</p><p>7 × 3 = 21 → write 1, carry 2</p><p>8 × 3 = 24 + 2 = 26 → write 6, carry 2</p><p>1 × 3 = 3 + 2 = 5</p><p>Answer: <strong>561</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        const hu = Math.floor(a / 100);
                        const te = Math.floor((a % 100) / 10);
                        const on = a % 10;
                        // Round hundreds (e.g. 300): the hundreds box alone would be the answer — stop one step short
                        const onlyHu = te === 0 && on === 0;
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;color:var(--monster-blue);font-weight:700;margin-bottom:8px;">🐲 Destroy the dragon digit by digit!</div>
                            <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                                <div style="background:rgba(239,68,68,0.15);border:2px solid var(--monster-red);border-radius:8px;padding:8px 10px;font-weight:700;">${hu * 100} × ${b} = ${onlyHu ? '?' : hu * 100 * b}</div>
                                <div style="background:rgba(59,130,246,0.15);border:2px solid var(--monster-blue);border-radius:8px;padding:8px 10px;font-weight:700;">${te * 10} × ${b} = ${te * 10 * b}</div>
                                <div style="background:rgba(250,204,21,0.15);border:2px solid var(--monster-yellow);border-radius:8px;padding:8px 10px;font-weight:700;">${on} × ${b} = ${on * b}</div>
                            </div>
                            <div style="margin-top:10px;font-weight:700;color:var(--monster-blue);font-size:1.1rem;">${onlyHu ? `👾 ${hu} × ${b} = ${hu * b}, then add two zeros → ?` : '👾 Add them all up! → ?'}</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Multiply 4-digit × 1-digit
            {
                skillId: '4m1-4digit',
                generate(diff, modality) {
                    let a, b;
                    if (diff <= 1) {
                        a = R(1000, 2000); b = R(2, 3);
                    } else if (diff === 2) {
                        a = R(1000, 5000); b = R(2, 5);
                    } else {
                        a = R(1000, 9999); b = R(2, 9);
                    }
                    const answer = a * b;

                    const result = {
                        type: 'input',
                        questionText: `🦖 A monster army of ${b} squads, each with ${Engine.Utils.fmt(a)} soldiers!<br>What is ${Engine.Utils.fmt(a)} × ${b}?`,
                        visual: `<div style="font-family:var(--font-display);font-size:1.6rem;text-align:right;line-height:1.8;color:var(--monster-purple);">
                            <div>${Engine.Utils.fmt(a)}</div>
                            <div style="border-bottom:2px solid var(--monster-green);padding-bottom:4px;">× ${b}</div>
                        </div>`,
                        answer,
                        hint1: `Start from the ones digit and multiply each digit by ${b}`,
                        hint2: `Remember to carry when any product is 10 or more!`,
                        hint3: `${Engine.Utils.fmt(a)} × ${b} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (Math.abs(userAnswer - answer) <= 10 && userAnswer !== answer) return 'carry-error';
                            if (userAnswer === a + b) return 'added-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'carry-error': `So close! Check your carrying — when a digit product is 10 or more, carry the tens digit to the next column.`,
                            'added-instead': `That looks like ${Engine.Utils.fmt(a)} + ${b}. We need to multiply, not add! ${Engine.Utils.fmt(a)} × ${b} means ${b} groups of ${Engine.Utils.fmt(a)}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Question shares the example's answer (e.g. it IS 1,234 × 3): show a second example so it can't be copied
                        result.workedExample = answer !== 3702
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 1,234 × 3 = ?</p><p>4 × 3 = 12 → write 2, carry 1</p><p>3 × 3 = 9 + 1 = 10 → write 0, carry 1</p><p>2 × 3 = 6 + 1 = 7</p><p>1 × 3 = 3</p><p>Answer: <strong>3,702</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 2,156 × 3 = ?</p><p>6 × 3 = 18 → write 8, carry 1</p><p>5 × 3 = 15 + 1 = 16 → write 6, carry 1</p><p>1 × 3 = 3 + 1 = 4</p><p>2 × 3 = 6</p><p>Answer: <strong>6,468</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        const th = Math.floor(a / 1000);
                        const hu = Math.floor((a % 1000) / 100);
                        const te = Math.floor((a % 100) / 10);
                        const on = a % 10;
                        // Round thousands (e.g. 2,000): the thousands box alone would be the answer — stop one step short
                        const onlyTh = hu === 0 && te === 0 && on === 0;
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;color:var(--monster-purple);font-weight:700;margin-bottom:8px;">🦖 Break it apart!</div>
                            <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                                <div style="background:rgba(124,58,237,0.15);border:2px solid var(--monster-purple);border-radius:8px;padding:8px 10px;font-weight:700;">${Engine.Utils.fmt(th * 1000)} × ${b} = ${onlyTh ? '?' : Engine.Utils.fmt(th * 1000 * b)}</div>
                                <div style="background:rgba(239,68,68,0.15);border:2px solid var(--monster-red);border-radius:8px;padding:8px 10px;font-weight:700;">${hu * 100} × ${b} = ${Engine.Utils.fmt(hu * 100 * b)}</div>
                                <div style="background:rgba(59,130,246,0.15);border:2px solid var(--monster-blue);border-radius:8px;padding:8px 10px;font-weight:700;">${te * 10} × ${b} = ${te * 10 * b}</div>
                                <div style="background:rgba(250,204,21,0.15);border:2px solid var(--monster-yellow);border-radius:8px;padding:8px 10px;font-weight:700;">${on} × ${b} = ${on * b}</div>
                            </div>
                            <div style="margin-top:10px;font-weight:700;color:var(--monster-green);font-size:1.2rem;">${onlyTh ? `🐾 ${th} × ${b} = ${th * b}, then add three zeros → ?` : '🐾 Add them up! → ?'}</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Word problems
            {
                skillId: '4m1-word',
                generate(diff, modality) {
                    const b = R(2, diff >= 2 ? 8 : 5);
                    const a = diff >= 2 ? R(100, 999) : R(10, 99);
                    const answer = a * b;
                    const scenarios = [
                        `🐾 Each monster nest holds ${a} eggs. There are ${b} nests. How many eggs total?`,
                        `⚡ A power crystal gives ${a} energy. A trainer collects ${b} crystals. Total energy?`,
                        `🔥 Each dragon breathes ${a} fireballs per day. How many fireballs do ${b} dragons breathe?`
                    ];

                    const result = {
                        type: 'input',
                        questionText: pick(scenarios),
                        visual: `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                            ${Array.from({length: b}, () => `<div style="background:rgba(124,58,237,0.15);border:2px solid var(--monster-purple);border-radius:10px;padding:8px 12px;font-weight:700;">🐾 ${a}</div>`).join('')}
                        </div>`,
                        answer,
                        hint1: `This is a multiplication problem: ${a} × ${b}`,
                        hint2: `${a} × ${b} — multiply step by step`,
                        hint3: `${a} × ${b} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a + b) return 'added-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'added-instead': `Read carefully — we need the total for ${b} groups of ${a}. That's multiplication: ${a} × ${b}!`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Question shares the example's answer (e.g. it IS 24 × 5): show a second example so it can't be copied
                        result.workedExample = answer !== 120 && answer !== 100
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 5 boxes of 24 items each</p><p>24 × 5 = (20 × 5) + (4 × 5) = 100 + 20 = <strong>120</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 3 boxes of 26 items each</p><p>26 × 3 = (20 × 3) + (6 × 3) = 60 + 18 = <strong>78</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        const groupsToShow = Math.min(b, 6);
                        const groupBoxes = Array.from({length: groupsToShow}, (_, i) =>
                            `<div style="background:rgba(124,58,237,0.15);border:2px solid var(--monster-purple);border-radius:10px;padding:8px 12px;font-weight:700;text-align:center;">🐾<br>${a}</div>`
                        ).join('');
                        const ellipsis = b > 6 ? `<div style="align-self:center;font-size:1.4rem;font-weight:700;">…</div>` : '';
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1rem;color:var(--monster-purple);font-weight:700;margin-bottom:8px;">⚡ ${b} groups of ${a}!</div>
                            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">${groupBoxes}${ellipsis}</div>
                            <div style="margin-top:10px;font-weight:700;color:var(--monster-red);font-size:1.1rem;">🔥 ${b} × ${a} = ?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Estimate products by rounding
            {
                skillId: '4m1-estimate',
                generate(diff, modality) {
                    const b = R(2, 9);
                    const a = diff >= 2 ? R(100, 999) : R(10, 99);
                    const roundTo = a >= 100 ? 100 : 10;
                    const estA = Math.round(a / roundTo) * roundTo;
                    const answer = estA * b;
                    const exactProduct = a * b;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🗡️ Estimate! Round ${a} to the nearest ${roundTo}, then multiply by ${b}.`,
                        // Don't show the rounded value here — rounding is the skill (visual modality replaces this with a scaffold)
                        visual: `<div style="text-align:center;color:var(--monster-yellow);font-size:1.4rem;font-weight:700;">
                            <div>${a} × ${b} ≈ ?</div>
                        </div>`,
                        answer,
                        // Distractors are (estA ± roundTo) × b etc., so every option is a plausible rounded estimate
                        options: Engine.Utils.roundedMultipleChoice(answer, roundTo * b),
                        hint1: `Round ${a} to the nearest ${roundTo}: ${estA}`,
                        hint2: `Now multiply: ${estA} × ${b} = ?`,
                        hint3: `${estA} × ${b} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (userAnswer === exactProduct) return 'used-exact';
                            return null;
                        },
                        misconceptionHints: {
                            'used-exact': `That's the exact product of ${a} × ${b}! We want an estimate — round ${a} to ${estA} first, then multiply.`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Question shares the example's answer (e.g. 46 × 6 also rounds to 50 × 6): show a second example so it can't be copied
                        result.workedExample = answer !== 300
                            ? `<div style="text-align:center"><p><strong>Example:</strong> Estimate 47 × 6</p><p>Step 1: Round 47 → 50</p><p>Step 2: 50 × 6 = <strong>300</strong></p><p>The estimate is 300!</p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> Estimate 83 × 4</p><p>Step 1: Round 83 → 80</p><p>Step 2: 80 × 4 = <strong>320</strong></p><p>The estimate is 320!</p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;color:var(--monster-yellow);font-weight:700;margin-bottom:8px;">🗡️ Estimation Battle Plan!</div>
                            <div style="display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;">
                                <div style="background:rgba(250,204,21,0.15);border:2px solid var(--monster-yellow);border-radius:10px;padding:10px 14px;">
                                    <div style="font-size:0.8rem;color:var(--monster-yellow);">Original</div>
                                    <div style="font-weight:700;font-size:1.3rem;">${a}</div>
                                </div>
                                <div style="font-size:1.5rem;">→</div>
                                <div style="background:rgba(34,197,94,0.15);border:2px solid var(--monster-green);border-radius:10px;padding:10px 14px;">
                                    <div style="font-size:0.8rem;color:var(--monster-green);">Rounded</div>
                                    <div style="font-weight:700;font-size:1.3rem;">${estA}</div>
                                </div>
                                <div style="font-size:1.5rem;">×</div>
                                <div style="background:rgba(124,58,237,0.15);border:2px solid var(--monster-purple);border-radius:10px;padding:10px 14px;">
                                    <div style="font-size:0.8rem;color:var(--monster-purple);">Monster</div>
                                    <div style="font-weight:700;font-size:1.3rem;">🐲 ${b}</div>
                                </div>
                            </div>
                            <div style="margin-top:10px;font-weight:700;color:var(--monster-red);font-size:1.1rem;">⚔️ What's ${estA} × ${b}?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Area model / distributive property
            {
                skillId: '4m1-area-model',
                generate(diff, modality) {
                    const b = R(2, diff >= 2 ? 9 : 5);
                    const tens = R(1, diff >= 2 ? 9 : 5);
                    const ones = R(1, 9);
                    const a = tens * 10 + ones;
                    const answer = a * b;

                    const result = {
                        type: 'input',
                        questionText: `🐲 Use the area model to solve ${a} × ${b}!<br>Hint: ${a} = ${tens * 10} + ${ones}`,
                        visual: `<div style="text-align:center;">
                            <div style="display:inline-grid;grid-template-columns:60px 100px 60px;gap:2px;">
                                <div style="background:transparent;"></div>
                                <div style="background:rgba(239,68,68,0.2);padding:8px;border-radius:6px 6px 0 0;font-weight:700;color:var(--monster-red);">${tens * 10}</div>
                                <div style="background:rgba(59,130,246,0.2);padding:8px;border-radius:6px 6px 0 0;font-weight:700;color:var(--monster-blue);">${ones}</div>
                                <div style="background:rgba(250,204,21,0.2);padding:8px;border-radius:6px 0 0 6px;font-weight:700;color:var(--monster-yellow);">${b}</div>
                                <div style="background:rgba(239,68,68,0.1);padding:12px;border:2px dashed var(--monster-red);font-weight:700;">${tens * 10 * b}</div>
                                <div style="background:rgba(59,130,246,0.1);padding:12px;border:2px dashed var(--monster-blue);font-weight:700;">${ones * b}</div>
                            </div>
                            <div style="margin-top:10px;font-weight:700;color:var(--monster-purple);">${tens * 10 * b} + ${ones * b} = ?</div>
                        </div>`,
                        answer,
                        hint1: `Split into two parts: (${tens * 10} × ${b}) + (${ones} × ${b})`,
                        hint2: `${tens * 10 * b} + ${ones * b} = ?`,
                        hint3: `${tens * 10 * b} + ${ones * b} = ${answer}`,
                        diagnose(userAnswer) {
                            const partTens = tens * 10 * b;
                            const partOnes = ones * b;
                            if (userAnswer === partTens || userAnswer === partOnes) return 'added-parts-wrong';
                            if (Math.abs(userAnswer - answer) <= 5 && userAnswer !== answer) return 'added-parts-wrong';
                            if (userAnswer === a + b) return 'added-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'added-parts-wrong': `Check your partial products! ${tens * 10} × ${b} = ${tens * 10 * b} and ${ones} × ${b} = ${ones * b}. Now add both parts together.`,
                            'added-instead': `We need to multiply, not add! Use the area model: (${tens * 10} × ${b}) + (${ones} × ${b}).`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Question shares the example's answer (e.g. it IS 36 × 4): show a second example so it can't be copied
                        result.workedExample = answer !== 144
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 36 × 4</p><p>30 × 4 = 120</p><p>6 × 4 = 24</p><p>120 + 24 = <strong>144</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 27 × 3</p><p>20 × 3 = 60</p><p>7 × 3 = 21</p><p>60 + 21 = <strong>81</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;color:var(--monster-purple);font-weight:700;margin-bottom:8px;">🐲 Area Model Attack!</div>
                            <div style="display:inline-grid;grid-template-columns:60px 100px 60px;gap:2px;">
                                <div style="background:transparent;"></div>
                                <div style="background:rgba(239,68,68,0.2);padding:8px;border-radius:6px 6px 0 0;font-weight:700;color:var(--monster-red);">${tens * 10}</div>
                                <div style="background:rgba(59,130,246,0.2);padding:8px;border-radius:6px 6px 0 0;font-weight:700;color:var(--monster-blue);">${ones}</div>
                                <div style="background:rgba(250,204,21,0.2);padding:8px;border-radius:6px 0 0 6px;font-weight:700;color:var(--monster-yellow);">${b}</div>
                                <div style="background:rgba(239,68,68,0.1);padding:12px;border:2px dashed var(--monster-red);font-weight:700;">${tens * 10 * b}</div>
                                <div style="background:rgba(59,130,246,0.1);padding:12px;border:2px dashed var(--monster-blue);font-weight:700;">${ones * b}</div>
                            </div>
                            <div style="margin-top:10px;font-weight:700;color:var(--monster-purple);">👾 ${tens * 10 * b} + ${ones * b} = ?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Monster Boss Battle — mixed
            {
                skillId: '4m1-boss',
                generate(diff, modality) {
                    const type = pick(['basic', '3digit', 'word']);
                    const b = R(2, diff >= 2 ? 9 : 6);
                    let a, questionText;

                    if (type === 'basic') {
                        a = R(10, 99);
                        questionText = `⚔️ BOSS BATTLE! Solve: ${a} × ${b} = ?`;
                    } else if (type === '3digit') {
                        a = R(100, 999);
                        questionText = `🐉 DRAGON BOSS! ${Engine.Utils.fmt(a)} × ${b} = ?`;
                    } else {
                        a = R(50, 500);
                        questionText = `🗡️ FINAL BATTLE! A monster drops ${a} gold coins ${b} times. Total gold?`;
                    }

                    const answer = a * b;
                    const result = {
                        type: 'input',
                        questionText,
                        visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">⚔️🐉⚔️</div>`,
                        answer,
                        hint1: `Multiply step by step from the ones digit`,
                        hint2: `${a} × ${b} — don't forget to carry!`,
                        hint3: `${a} × ${b} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a + b) return 'added-instead';
                            // Before carry-error: when a = 10, one group off is also within 10
                            if (userAnswer === a * (b - 1) || userAnswer === a * (b + 1)) return 'off-by-one-group';
                            if (Math.abs(userAnswer - answer) <= 10 && userAnswer !== answer) return 'carry-error';
                            return null;
                        },
                        misconceptionHints: {
                            'added-instead': `That's ${a} + ${b}! We need multiplication: ${a} × ${b} means ${b} groups of ${a}.`,
                            'carry-error': `So close! Double-check your carrying — when a digit product is 10 or more, carry to the next column.`,
                            'off-by-one-group': `Almost! Make sure you're multiplying by ${b}, not ${b - 1} or ${b + 1}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Question shares the example's answer (e.g. it IS 246 × 7): show a second example so it can't be copied
                        result.workedExample = answer !== 1722
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 246 × 7 = ?</p><p>6 × 7 = 42 → write 2, carry 4</p><p>4 × 7 = 28 + 4 = 32 → write 2, carry 3</p><p>2 × 7 = 14 + 3 = 17</p><p>Answer: <strong>1,722</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 158 × 4 = ?</p><p>8 × 4 = 32 → write 2, carry 3</p><p>5 × 4 = 20 + 3 = 23 → write 3, carry 2</p><p>1 × 4 = 4 + 2 = 6</p><p>Answer: <strong>632</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        const tensA = Math.floor(a / 10) * 10;
                        const onesA = a % 10;
                        // Round a: the tens box would already be the answer, so show (a ÷ 10) × b and leave the zero to her
                        const parts = onesA
                            ? `<div style="background:rgba(239,68,68,0.15);border:2px solid var(--monster-red);border-radius:10px;padding:8px 12px;font-weight:700;">${tensA} × ${b} = ${tensA * b}</div>
                                <div style="font-size:1.3rem;align-self:center;">+</div>
                                <div style="background:rgba(59,130,246,0.15);border:2px solid var(--monster-blue);border-radius:10px;padding:8px 12px;font-weight:700;">${onesA} × ${b} = ${onesA * b}</div>`
                            : `<div style="background:rgba(239,68,68,0.15);border:2px solid var(--monster-red);border-radius:10px;padding:8px 12px;font-weight:700;">${a / 10} × ${b} = ${(a / 10) * b}</div>
                                <div style="font-size:1rem;font-weight:700;align-self:center;">then × 10 → add a zero!</div>`;
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:2rem;margin-bottom:8px;animation:bounce 0.6s ease-in-out infinite;">⚔️🐉⚔️</div>
                            <div style="font-size:1rem;color:var(--monster-red);font-weight:700;margin-bottom:6px;">🐾 Break down the boss!</div>
                            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                                ${parts}
                            </div>
                            <div style="margin-top:8px;font-weight:700;color:var(--monster-purple);font-size:1.1rem;">🗡️ ${onesA ? `${tensA * b} + ${onesA * b}` : `${a} × ${b}`} = ?</div>
                        </div>`;
                    }

                    return result;
                }
            }
        ];
    }
};
