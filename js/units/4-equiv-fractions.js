/* ===== UNIT: EQUIVALENT FRACTIONS (4th Grade) — Monster Theme 🐲🦖⚡🔥👾 ===== */

const EquivFractions4 = {
    id: '4-equiv-fractions',
    title: 'Equivalent Fractions',
    icon: '🔮',
    theme: 'monster',
    description: "Discover fraction magic! Find equivalent fractions, compare, and simplify like a true wizard!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

        return [
            // 1. Find equivalent fraction (multiply)
            {
                skillId: '4ef-multiply',
                generate(diff, modality) {
                    const denom = pick([2, 3, 4, 5, 6]);
                    const numer = R(1, denom - 1);
                    const multiplier = R(2, diff >= 2 ? 5 : 3);
                    const newDenom = denom * multiplier;
                    const answer = numer * multiplier;

                    const result = {
                        type: 'input',
                        questionText: `🔮 Find the missing number!<br>${numer}/${denom} = ?/${newDenom}`,
                        visual: `<div style="display:flex;gap:20px;align-items:center;justify-content:center;">
                            <div style="text-align:center;padding:12px 20px;background:rgba(124,58,237,0.15);border:2px solid var(--monster-purple);border-radius:12px;">
                                <div style="font-size:2rem;font-weight:800;color:var(--monster-purple);">${numer}</div>
                                <div style="height:3px;background:var(--monster-purple);margin:4px 0;"></div>
                                <div style="font-size:2rem;font-weight:800;color:var(--monster-purple);">${denom}</div>
                            </div>
                            <div style="font-size:2rem;font-weight:800;color:var(--monster-yellow);">=</div>
                            <div style="text-align:center;padding:12px 20px;background:rgba(239,68,68,0.1);border:2px solid var(--monster-red);border-radius:12px;">
                                <div style="font-size:2rem;font-weight:800;color:var(--monster-red);">?</div>
                                <div style="height:3px;background:var(--monster-red);margin:4px 0;"></div>
                                <div style="font-size:2rem;font-weight:800;color:var(--monster-red);">${newDenom}</div>
                            </div>
                        </div>`,
                        answer,
                        hint1: `The denominator was multiplied by ${multiplier} (${denom} × ${multiplier} = ${newDenom})`,
                        hint2: `Do the same to the numerator: ${numer} × ${multiplier} = ?`,
                        hint3: `${numer}/${denom} = ${answer}/${newDenom}`,
                        diagnose(userAnswer) {
                            if (userAnswer === numer) return 'didnt-multiply';
                            if (userAnswer === numer + multiplier) return 'added-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'didnt-multiply': `The numerator changes too! If the denominator is multiplied by ${multiplier}, the numerator must also be multiplied by ${multiplier}.`,
                            'added-instead': `We multiply both parts, not add! ${numer} × ${multiplier} = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 1/3 = ?/9</p><p>3 × 3 = 9 (denominator × 3)</p><p>1 × 3 = 3 (numerator × 3)</p><p>1/3 = <strong>3/9</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;padding:12px;background:rgba(124,58,237,0.1);border-radius:12px;margin-bottom:12px;">
                            <div style="font-size:1rem;color:var(--monster-purple);font-weight:700;">🐲 Monster Fraction Bars</div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">Each top bar section splits into ${multiplier} smaller pieces below!</p>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-purple);">${numer}/${denom}</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:8px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220 / denom)}px;height:36px;border-radius:4px;background:${i < numer ? 'var(--monster-purple)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-red);">?/${newDenom}</div>
                            <div style="display:flex;gap:2px;justify-content:center;">
                                ${Array.from({length: newDenom}, (_, i) => `<div style="width:${Math.floor(220 / newDenom)}px;height:36px;border-radius:4px;background:${i < answer ? 'var(--monster-red)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:8px;">Count the 🔥 red sections — that's your answer!</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Simplify a fraction (divide by GCD)
            {
                skillId: '4ef-simplify',
                generate(diff, modality) {
                    const simpleDenom = pick([2, 3, 4, 5, 6]);
                    // Force the target "simplified" pair to be coprime so the displayed answer
                    // is actually in lowest terms (e.g., reject 2/4, 2/6, 3/6, 4/6)
                    let simpleNumer = R(1, simpleDenom - 1);
                    while (gcd(simpleNumer, simpleDenom) !== 1) simpleNumer = R(1, simpleDenom - 1);
                    const multiplier = R(2, diff >= 2 ? 5 : 3);
                    const numer = simpleNumer * multiplier;
                    const denom = simpleDenom * multiplier;
                    const answer = simpleNumer;

                    const result = {
                        type: 'input',
                        questionText: `🐲 Simplify the fraction!<br>${numer}/${denom} = ?/${simpleDenom}`,
                        subText: `What is the simplified numerator?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:2rem;font-weight:800;color:var(--monster-blue);">${numer}/${denom}</div>
                            <div style="margin-top:8px;font-size:1.2rem;color:var(--monster-yellow);">÷ ? = ?/${simpleDenom}</div>
                        </div>`,
                        answer,
                        hint1: `Find a number that divides both ${numer} and ${denom} evenly`,
                        hint2: `Both ${numer} and ${denom} are divisible by ${multiplier}`,
                        hint3: `${numer} ÷ ${multiplier} = ${simpleNumer}, so ${numer}/${denom} = ${simpleNumer}/${simpleDenom}`,
                        diagnose(userAnswer) {
                            if (userAnswer === numer) return 'didnt-divide';
                            if (userAnswer === numer - multiplier) return 'subtracted-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'didnt-divide': `You gave the original numerator! To simplify, divide both parts by ${multiplier}: ${numer} ÷ ${multiplier} = ${simpleNumer}.`,
                            'subtracted-instead': `Simplifying means dividing, not subtracting! ${numer} ÷ ${multiplier} = ${simpleNumer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Simplify 6/8</p><p>GCD of 6 and 8 is 2</p><p>6 ÷ 2 = 3, 8 ÷ 2 = 4</p><p>6/8 = <strong>3/4</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;padding:12px;background:rgba(59,130,246,0.1);border-radius:12px;margin-bottom:12px;">
                            <div style="font-size:1rem;color:var(--monster-blue);font-weight:700;">🦖 Monster Simplify Bars</div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">Merge every ${multiplier} small pieces into 1 big piece!</p>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-blue);">${numer}/${denom} (original)</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:8px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220 / denom)}px;height:36px;border-radius:4px;background:${i < numer ? 'var(--monster-blue)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-green);">${simpleNumer}/${simpleDenom} (simplified)</div>
                            <div style="display:flex;gap:2px;justify-content:center;">
                                ${Array.from({length: simpleDenom}, (_, i) => `<div style="width:${Math.floor(220 / simpleDenom)}px;height:36px;border-radius:4px;background:${i < simpleNumer ? 'var(--monster-green)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:8px;">Both bars are filled the same amount — same fraction, simpler form! ⚡</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Are these fractions equivalent? (yes/no)
            {
                skillId: '4ef-check',
                generate(diff, modality) {
                    const denom1 = pick([2, 3, 4, 5, 6]);
                    const numer1 = R(1, denom1 - 1);
                    const multiplier = R(2, 4);
                    const isEquiv = Math.random() < 0.5;

                    let numer2, denom2;
                    if (isEquiv) {
                        numer2 = numer1 * multiplier;
                        denom2 = denom1 * multiplier;
                    } else {
                        numer2 = numer1 * multiplier + pick([-1, 1]);
                        denom2 = denom1 * multiplier;
                        if (numer2 <= 0) numer2 = numer1 * multiplier + 1;
                    }

                    const answer = isEquiv ? 'Yes' : 'No';
                    const cross1 = numer1 * denom2;
                    const cross2 = numer2 * denom1;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `⚡ Are these fractions equivalent?<br>${numer1}/${denom1} and ${numer2}/${denom2}`,
                        visual: `<div style="display:flex;gap:24px;align-items:center;justify-content:center;">
                            <div style="padding:12px 20px;background:rgba(59,130,246,0.15);border:2px solid var(--monster-blue);border-radius:12px;font-size:1.8rem;font-weight:800;color:var(--monster-blue);">⚡ ${numer1}/${denom1}</div>
                            <div style="font-size:2rem;color:var(--monster-yellow);">?</div>
                            <div style="padding:12px 20px;background:rgba(239,68,68,0.15);border:2px solid var(--monster-red);border-radius:12px;font-size:1.8rem;font-weight:800;color:var(--monster-red);">🔥 ${numer2}/${denom2}</div>
                        </div>`,
                        answer,
                        options: [{label: 'Yes — Equivalent!', value: 'Yes'}, {label: 'No — Different!', value: 'No'}],
                        hint1: `Cross multiply: ${numer1} × ${denom2} vs ${numer2} × ${denom1}`,
                        hint2: `${numer1} × ${denom2} = ${cross1}, ${numer2} × ${denom1} = ${cross2}. Are they equal?`,
                        hint3: `${cross1} ${cross1 === cross2 ? '=' : '≠'} ${cross2}, so ${answer}!`,
                        diagnose(userAnswer) {
                            if (isEquiv && userAnswer === 'No') return 'missed-equivalent';
                            if (!isEquiv && userAnswer === 'Yes') return 'false-equivalent';
                            return null;
                        },
                        misconceptionHints: {
                            'missed-equivalent': `These ARE equivalent! Cross multiply to check: ${numer1} × ${denom2} = ${cross1} and ${numer2} × ${denom1} = ${cross1}. Equal products mean equal fractions! 🐲`,
                            'false-equivalent': `These are NOT equivalent! Cross multiply: ${numer1} × ${denom2} = ${cross1} but ${numer2} × ${denom1} = ${cross2}. Different products mean different fractions! 👾`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Are 2/3 and 6/9 equivalent?</p><p>Cross multiply: 2 × 9 = 18, 6 × 3 = 18</p><p>18 = 18, so <strong>Yes</strong>!</p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;padding:12px;background:rgba(124,58,237,0.1);border-radius:12px;margin-bottom:12px;">
                            <div style="font-size:1rem;color:var(--monster-purple);font-weight:700;">🔮 Monster Potion Bars</div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">If both potion bars are filled to the same level, the fractions are equivalent!</p>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-blue);">⚡ ${numer1}/${denom1}</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:8px;">
                                ${Array.from({length: denom1}, (_, i) => `<div style="width:${Math.floor(220 / denom1)}px;height:36px;border-radius:4px;background:${i < numer1 ? 'var(--monster-blue)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-red);">🔥 ${numer2}/${denom2}</div>
                            <div style="display:flex;gap:2px;justify-content:center;">
                                ${Array.from({length: denom2}, (_, i) => `<div style="width:${Math.floor(220 / denom2)}px;height:36px;border-radius:4px;background:${i < numer2 ? 'var(--monster-red)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:8px;">Do the filled portions look the same? 👾</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Compare fractions (< > =)
            {
                skillId: '4ef-compare',
                generate(diff, modality) {
                    // Same denominator or different
                    const sameDenom = diff <= 1 || Math.random() < 0.4;
                    let n1, d1, n2, d2;

                    if (sameDenom) {
                        d1 = d2 = pick([3, 4, 5, 6, 8]);
                        n1 = R(1, d1 - 1);
                        n2 = R(1, d1 - 1);
                        while (n2 === n1) n2 = R(1, d1 - 1);
                    } else {
                        d1 = pick([2, 3, 4, 5, 6]);
                        d2 = pick([2, 3, 4, 5, 6].filter(d => d !== d1));
                        n1 = R(1, d1 - 1);
                        n2 = R(1, d2 - 1);
                    }

                    const val1 = n1 / d1;
                    const val2 = n2 / d2;
                    const answer = val1 > val2 ? '>' : val1 < val2 ? '<' : '=';
                    const cross1 = n1 * d2;
                    const cross2 = n2 * d1;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🔮 Compare the fractions — which is larger, or are they equal?`,
                        visual: `<div style="display:flex;gap:20px;align-items:center;justify-content:center;">
                            <div style="padding:12px 20px;background:rgba(124,58,237,0.15);border:2px solid var(--monster-purple);border-radius:12px;font-size:1.8rem;font-weight:800;color:var(--monster-purple);">🐲 ${n1}/${d1}</div>
                            <div style="font-size:2rem;color:var(--monster-yellow);">?</div>
                            <div style="padding:12px 20px;background:rgba(34,197,94,0.15);border:2px solid var(--monster-green);border-radius:12px;font-size:1.8rem;font-weight:800;color:var(--monster-green);">🦖 ${n2}/${d2}</div>
                        </div>`,
                        answer,
                        options: [{label: `${n1}/${d1} > ${n2}/${d2}`, value: '>'}, {label: `${n1}/${d1} < ${n2}/${d2}`, value: '<'}, {label: `${n1}/${d1} = ${n2}/${d2}`, value: '='}],
                        hint1: sameDenom ? `Same denominator — just compare the numerators!` : `Find a common denominator or cross-multiply`,
                        hint2: sameDenom ? `${n1} vs ${n2}` : `Cross multiply: ${n1} × ${d2} = ${cross1} vs ${n2} × ${d1} = ${cross2}`,
                        hint3: `${n1}/${d1} ${answer} ${n2}/${d2}`,
                        diagnose(userAnswer) {
                            if (userAnswer === '=' && answer !== '=') return 'said-equal';
                            if (userAnswer === '>' && answer === '<') return 'reversed-comparison';
                            if (userAnswer === '<' && answer === '>') return 'reversed-comparison';
                            return null;
                        },
                        misconceptionHints: {
                            'said-equal': `These fractions are NOT equal! ${sameDenom ? `Same denominator, so compare numerators: ${n1} ≠ ${n2}.` : `Cross multiply: ${n1} × ${d2} = ${cross1} and ${n2} × ${d1} = ${cross2}. They differ!`} 🐲`,
                            'reversed-comparison': `You got the direction backwards! ${sameDenom ? `Compare numerators: ${n1} ${answer} ${n2}.` : `Cross multiply: ${cross1} ${answer} ${cross2}, so ${n1}/${d1} ${answer} ${n2}/${d2}.`} ⚡`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Compare 2/3 and 3/4</p><p>Cross multiply: 2 × 4 = 8, 3 × 3 = 9</p><p>8 < 9, so 2/3 < 3/4</p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;padding:12px;background:rgba(59,130,246,0.1);border-radius:12px;margin-bottom:12px;">
                            <div style="font-size:1rem;color:var(--monster-blue);font-weight:700;">🐲 Monster Health Bars</div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">The longer filled bar wins the battle!</p>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-purple);">🐲 ${n1}/${d1}</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:8px;">
                                ${Array.from({length: d1}, (_, i) => `<div style="width:${Math.floor(220 / d1)}px;height:36px;border-radius:4px;background:${i < n1 ? 'var(--monster-purple)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-green);">🦖 ${n2}/${d2}</div>
                            <div style="display:flex;gap:2px;justify-content:center;">
                                ${Array.from({length: d2}, (_, i) => `<div style="width:${Math.floor(220 / d2)}px;height:36px;border-radius:4px;background:${i < n2 ? 'var(--monster-green)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:8px;">Which monster has more health? 🔥</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Find common denominator
            {
                skillId: '4ef-common-denom',
                generate(diff, modality) {
                    const d1 = pick([2, 3, 4, 5, 6]);
                    const d2 = pick([2, 3, 4, 5, 6].filter(d => d !== d1));
                    const n1 = R(1, d1 - 1);
                    const n2 = R(1, d2 - 1);

                    // Find LCD
                    const lcm = (d1 * d2) / gcd(d1, d2);
                    const mult1 = lcm / d1;
                    const mult2 = lcm / d2;
                    const newN1 = n1 * mult1;
                    const answer = newN1;

                    const result = {
                        type: 'input',
                        questionText: `🐾 Rewrite with a common denominator of ${lcm}:<br>${n1}/${d1} = ?/${lcm}`,
                        subText: `What's the new numerator?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:1.6rem;font-weight:700;color:var(--monster-blue);">${n1}/${d1} = ?/${lcm}</div>
                            <div style="margin-top:8px;font-size:0.9rem;color:var(--text-muted);">Common denominator: ${lcm}</div>
                        </div>`,
                        answer,
                        hint1: `${d1} × ${mult1} = ${lcm}, so multiply the numerator by ${mult1} too`,
                        hint2: `${n1} × ${mult1} = ?`,
                        hint3: `${n1}/${d1} = ${newN1}/${lcm}`,
                        diagnose(userAnswer) {
                            if (userAnswer === n1 + mult1) return 'added-instead';
                            if (userAnswer === n1) return 'didnt-multiply';
                            return null;
                        },
                        misconceptionHints: {
                            'added-instead': `Don't add the multiplier — multiply! ${n1} × ${mult1} = ${newN1}, not ${n1} + ${mult1} = ${n1 + mult1}. ⚡`,
                            'didnt-multiply': `The numerator must change too! Since ${d1} × ${mult1} = ${lcm}, the numerator also gets × ${mult1}: ${n1} × ${mult1} = ${newN1}. 🐲`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Rewrite 2/3 with denominator 12</p><p>3 × 4 = 12, so multiply numerator by 4 too</p><p>2 × 4 = 8</p><p>2/3 = <strong>8/12</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;padding:12px;background:rgba(34,197,94,0.1);border-radius:12px;margin-bottom:12px;">
                            <div style="font-size:1rem;color:var(--monster-green);font-weight:700;">🦖 Monster Pizza Bars</div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">Splitting each slice into ${mult1} smaller pieces — same amount, more slices!</p>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-blue);">${n1}/${d1} (original)</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:8px;">
                                ${Array.from({length: d1}, (_, i) => `<div style="width:${Math.floor(220 / d1)}px;height:36px;border-radius:4px;background:${i < n1 ? 'var(--monster-blue)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-green);">?/${lcm} (new form)</div>
                            <div style="display:flex;gap:2px;justify-content:center;">
                                ${Array.from({length: lcm}, (_, i) => `<div style="width:${Math.floor(220 / lcm)}px;height:36px;border-radius:4px;background:${i < newN1 ? 'var(--monster-green)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:8px;">Count the green sections — that's the new numerator! 🔥</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Visual model — shade equivalent fraction
            {
                skillId: '4ef-visual',
                generate(diff, modality) {
                    const denom = pick([2, 3, 4, 5]);
                    const numer = R(1, denom - 1);
                    const multiplier = R(2, 3);
                    const newDenom = denom * multiplier;
                    const answer = numer * multiplier;

                    const result = {
                        type: 'input',
                        questionText: `💎 Both bars show the same amount! How many parts are shaded in the bottom bar?`,
                        visual: `<div style="text-align:center;">
                            <div style="margin-bottom:8px;font-weight:700;color:var(--monster-purple);">${numer}/${denom}</div>
                            <div style="display:flex;gap:2px;justify-content:center;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(200 / denom)}px;height:36px;border-radius:4px;background:${i < numer ? 'var(--monster-red)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="margin-top:12px;font-weight:700;color:var(--monster-blue);">?/${newDenom}</div>
                            <div style="display:flex;gap:2px;justify-content:center;">
                                ${Array.from({length: newDenom}, (_, i) => `<div style="width:${Math.floor(200 / newDenom)}px;height:36px;border-radius:4px;background:${i < answer ? 'var(--monster-blue)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                        </div>`,
                        answer,
                        hint1: `Count the shaded sections in the bottom bar!`,
                        hint2: `Each original section was split into ${multiplier} parts: ${numer} × ${multiplier} = ?`,
                        hint3: `${numer}/${denom} = ${answer}/${newDenom}`,
                        diagnose(userAnswer) {
                            if (userAnswer === newDenom) return 'counted-all';
                            if (userAnswer === numer) return 'used-top-numerator';
                            return null;
                        },
                        misconceptionHints: {
                            'counted-all': `You counted ALL parts, not just the shaded ones! Only ${answer} out of ${newDenom} are shaded. 👾`,
                            'used-top-numerator': `That's the top bar's numerator! The bottom bar has more sections — count the blue shaded ones. Each top piece becomes ${multiplier} bottom pieces. 🔥`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 1/2 = ?/6</p><p>The bar is split into 6 parts instead of 2</p><p>Each original piece becomes 3 smaller pieces</p><p>1 shaded piece becomes <strong>3</strong> shaded pieces</p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;padding:12px;background:rgba(239,68,68,0.1);border-radius:12px;margin-bottom:12px;">
                            <div style="font-size:1rem;color:var(--monster-red);font-weight:700;">🔥 Monster Fraction Bars — Visual Mode</div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">Each shaded top section = ${multiplier} shaded bottom sections!</p>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-red);">${numer}/${denom} (top bar)</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:8px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220 / denom)}px;height:40px;border-radius:4px;background:${i < numer ? 'var(--monster-red)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:white;font-weight:700;">${i < numer ? '🔥' : ''}</div>`).join('')}
                            </div>
                            <div style="margin-bottom:4px;font-weight:700;color:var(--monster-blue);">?/${newDenom} (bottom bar)</div>
                            <div style="display:flex;gap:2px;justify-content:center;">
                                ${Array.from({length: newDenom}, (_, i) => `<div style="width:${Math.floor(220 / newDenom)}px;height:40px;border-radius:4px;background:${i < answer ? 'var(--monster-blue)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:white;font-weight:700;">${i < answer ? '⚡' : ''}</div>`).join('')}
                            </div>
                            <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:8px;">Count the ⚡ blue sections! 🐲</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Fraction Wizard Boss
            {
                skillId: '4ef-boss',
                generate(diff, modality) {
                    const type = pick(['equiv', 'compare', 'simplify']);
                    let result;

                    if (type === 'equiv') {
                        const d = pick([2, 3, 4, 5]);
                        const n = R(1, d - 1);
                        const m = R(2, 4);
                        const answer = n * m;
                        result = {
                            type: 'input',
                            questionText: `🔮 WIZARD BOSS! ${n}/${d} = ?/${d * m}`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🔮✨🐲</div>`,
                            answer,
                            hint1: `Denominator × ${m}, so numerator × ${m}`,
                            hint2: `${n} × ${m} = ?`,
                            hint3: `${n}/${d} = ${answer}/${d * m}`,
                            diagnose(userAnswer) {
                                if (userAnswer === n) return 'didnt-multiply';
                                if (userAnswer === n + m) return 'added-instead';
                                return null;
                            },
                            misconceptionHints: {
                                'didnt-multiply': `The numerator must change too! Multiply by ${m}: ${n} × ${m} = ${answer}. 🐲`,
                                'added-instead': `Multiply, don't add! ${n} × ${m} = ${answer}, not ${n} + ${m} = ${n + m}. ⚡`
                            }
                        };
                    } else if (type === 'compare') {
                        const d1 = pick([3, 4, 5, 6]);
                        const d2 = pick([3, 4, 5, 6].filter(x => x !== d1));
                        const n1 = R(1, d1 - 1);
                        const n2 = R(1, d2 - 1);
                        const answer = (n1 / d1) > (n2 / d2) ? '>' : (n1 / d1) < (n2 / d2) ? '<' : '=';
                        const cross1 = n1 * d2;
                        const cross2 = n2 * d1;
                        result = {
                            type: 'multiple-choice',
                            questionText: `🔮 WIZARD BOSS! Compare: ${n1}/${d1} ☐ ${n2}/${d2}`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">⚡🔮⚡</div>`,
                            answer,
                            options: [{label: '>', value: '>'}, {label: '<', value: '<'}, {label: '=', value: '='}],
                            hint1: `Cross multiply to compare!`,
                            hint2: `${n1} × ${d2} = ${cross1} vs ${n2} × ${d1} = ${cross2}`,
                            hint3: `${n1}/${d1} ${answer} ${n2}/${d2}`,
                            diagnose(userAnswer) {
                                if (userAnswer === '=' && answer !== '=') return 'said-equal';
                                if (userAnswer === '>' && answer === '<') return 'reversed-comparison';
                                if (userAnswer === '<' && answer === '>') return 'reversed-comparison';
                                return null;
                            },
                            misconceptionHints: {
                                'said-equal': `Not equal! Cross multiply: ${n1} × ${d2} = ${cross1} and ${n2} × ${d1} = ${cross2}. They're different! 👾`,
                                'reversed-comparison': `Flip it! Cross multiply: ${cross1} ${answer} ${cross2}, so ${n1}/${d1} ${answer} ${n2}/${d2}. 🔥`
                            }
                        };
                    } else {
                        const sd = pick([2, 3, 4, 5]);
                        // Force (sn, sd) coprime so "Simplify sn*m/sd*m" actually reduces to sn/sd
                        let sn = R(1, sd - 1);
                        while (gcd(sn, sd) !== 1) sn = R(1, sd - 1);
                        const m = R(2, 4);
                        const answer = sn;
                        result = {
                            type: 'input',
                            questionText: `🔮 WIZARD BOSS! Simplify ${sn * m}/${sd * m}. What's the numerator?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🐲🔮🐲</div>`,
                            answer,
                            hint1: `Both ${sn * m} and ${sd * m} are divisible by ${m}`,
                            hint2: `${sn * m} ÷ ${m} = ?`,
                            hint3: `${sn * m}/${sd * m} = ${sn}/${sd}`,
                            diagnose(userAnswer) {
                                if (userAnswer === sn * m) return 'didnt-divide';
                                if (userAnswer === sn * m - m) return 'subtracted-instead';
                                return null;
                            },
                            misconceptionHints: {
                                'didnt-divide': `You gave the original numerator! Divide by ${m}: ${sn * m} ÷ ${m} = ${sn}. 🐲`,
                                'subtracted-instead': `Simplifying means dividing, not subtracting! ${sn * m} ÷ ${m} = ${sn}. ⚡`
                            }
                        };
                    }

                    if (modality === 'worked-example') {
                        if (type === 'equiv') {
                            result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 3/5 = ?/15</p><p>5 × 3 = 15, so numerator × 3</p><p>3 × 3 = <strong>9</strong></p></div>`;
                        } else if (type === 'compare') {
                            result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Compare 1/3 and 2/5</p><p>Cross multiply: 1 × 5 = 5, 2 × 3 = 6</p><p>5 < 6, so 1/3 <strong><</strong> 2/5</p></div>`;
                        } else {
                            result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Simplify 8/12</p><p>GCD is 4: 8 ÷ 4 = 2, 12 ÷ 4 = 3</p><p>8/12 = <strong>2/3</strong></p></div>`;
                        }
                    }

                    if (modality === 'visual') {
                        if (type === 'equiv') {
                            result.visual = `<div style="text-align:center;padding:12px;background:rgba(124,58,237,0.1);border-radius:12px;margin-bottom:12px;">
                                <div style="font-size:1rem;color:var(--monster-purple);font-weight:700;">🔮 Boss Visual — Equivalent</div>
                                <p style="font-size:0.85rem;color:var(--text-secondary);">The denominator scales up — scale the numerator the same way to keep the fraction equal! 🐲⚡</p>
                                <div style="font-size:2.5rem;text-align:center;margin-top:8px;">🔮✨🐲</div>
                            </div>`;
                        } else if (type === 'compare') {
                            result.visual = `<div style="text-align:center;padding:12px;background:rgba(239,68,68,0.1);border-radius:12px;margin-bottom:12px;">
                                <div style="font-size:1rem;color:var(--monster-red);font-weight:700;">🔥 Boss Visual — Compare</div>
                                <p style="font-size:0.85rem;color:var(--text-secondary);">Cross multiply to find which fraction is larger. The bigger product wins the monster battle! ⚡🔮⚡</p>
                                <div style="font-size:2.5rem;text-align:center;margin-top:8px;">⚡🔮⚡</div>
                            </div>`;
                        } else {
                            result.visual = `<div style="text-align:center;padding:12px;background:rgba(34,197,94,0.1);border-radius:12px;margin-bottom:12px;">
                                <div style="font-size:1rem;color:var(--monster-green);font-weight:700;">🦖 Boss Visual — Simplify</div>
                                <p style="font-size:0.85rem;color:var(--text-secondary);">Divide both top and bottom by the same number. The fraction value stays the same — smaller and simpler! 🐲🔮🐲</p>
                                <div style="font-size:2.5rem;text-align:center;margin-top:8px;">🐲🔮🐲</div>
                            </div>`;
                        }
                    }

                    return result;
                }
            }
        ];
    }
};
