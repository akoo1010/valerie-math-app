/* ===== UNIT: ADD & SUBTRACT FRACTIONS (4th Grade) — Dance Theme 🕺 ===== */

const AddSubFractions4 = {
    id: '4-add-sub-fractions',
    title: 'Add & Subtract Fractions',
    icon: '🕺',
    theme: 'dance',
    description: "Add and subtract fractions to the beat! Same denominators and mixed numbers on the dance floor!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;
        // Word names for denominators: "thirds", not "3ths"
        const denomName = d => ({2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths'})[d] || `${d}ths`;

        return [
            // 1. Add fractions with same denominator
            {
                skillId: '4asf-add-same',
                generate(diff, modality) {
                    const denom = pick(diff >= 2 ? [3, 4, 5, 6, 8, 10] : [3, 4, 5, 6]);
                    // Keep n1 ≤ denom-2 so there is always room for n2, and the sum stays
                    // strictly below denom (a proper fraction, not a whole number)
                    const n1 = R(1, denom - 2);
                    const n2 = R(1, denom - n1 - 1);
                    const answerNumer = n1 + n2;
                    const answer = answerNumer;

                    const result = {
                        type: 'input',
                        questionText: `🎵 Add the dance moves! ${n1}/${denom} + ${n2}/${denom} = ?/${denom}`,
                        subText: `What is the numerator?`,
                        visual: `<div style="display:flex;gap:12px;align-items:center;justify-content:center;">
                            <div style="padding:12px 18px;background:rgba(236,72,153,0.15);border:2px solid var(--dance-pink);border-radius:12px;font-size:1.5rem;font-weight:800;color:var(--dance-pink);">💃 ${n1}/${denom}</div>
                            <div style="font-size:1.8rem;font-weight:800;color:var(--dance-gold);">+</div>
                            <div style="padding:12px 18px;background:rgba(34,211,238,0.15);border:2px solid var(--dance-cyan);border-radius:12px;font-size:1.5rem;font-weight:800;color:var(--dance-cyan);">🕺 ${n2}/${denom}</div>
                        </div>`,
                        answer,
                        hint1: `When denominators are the same, just add the numerators!`,
                        hint2: `${n1} + ${n2} = ?`,
                        hint3: `${n1}/${denom} + ${n2}/${denom} = ${answerNumer}/${denom}`,
                        diagnose(userAnswer) {
                            // Typed the two denominators added together (e.g. 5 + 5 = 10)
                            if (userAnswer === denom + denom) return 'added-denominators-too';
                            if (userAnswer === denom) return 'gave-denominator';
                            return null;
                        },
                        misconceptionHints: {
                            'added-denominators-too': `Don't add the denominators! When fractions have the same denominator, keep it and only add the numerators.`,
                            'gave-denominator': `That's the denominator! We need the numerator: ${n1} + ${n2} = ?`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Switch examples when the example's result (3) is this question's answer (e.g. 1/5 + 2/5)
                        result.workedExample = answer === 3
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 1/4 + 1/4 = ?/4</p><p>Same denominator → add numerators</p><p>1 + 1 = 2</p><p>Answer: <strong>2/4</strong> 🎵</p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 2/5 + 1/5 = ?/5</p><p>Same denominator → add numerators</p><p>2 + 1 = 3</p><p>Answer: <strong>3/5</strong> 🎵</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                            <div style="margin-bottom:6px;color:var(--dance-gold);font-weight:700;">💃 Fraction Bar — ${denom} parts total</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${i < n1 ? 'var(--dance-pink)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="color:var(--dance-pink);font-size:0.85rem;margin-bottom:8px;">${n1} shaded (💃)</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${i < n2 ? 'var(--dance-cyan)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="color:var(--dance-cyan);font-size:0.85rem;">+ ${n2} shaded (🕺) → total shaded = ?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Subtract fractions with same denominator
            {
                skillId: '4asf-sub-same',
                generate(diff, modality) {
                    const denom = pick(diff >= 2 ? [3, 4, 5, 6, 8, 10] : [3, 4, 5, 6]);
                    const n1 = R(2, denom);
                    const n2 = R(1, n1 - 1);
                    const answerNumer = n1 - n2;
                    const answer = answerNumer;

                    const result = {
                        type: 'input',
                        questionText: `🎶 Subtract the moves! ${n1}/${denom} − ${n2}/${denom} = ?/${denom}`,
                        subText: `What is the numerator?`,
                        visual: `<div style="display:flex;gap:12px;align-items:center;justify-content:center;">
                            <div style="padding:12px 18px;background:rgba(168,85,247,0.15);border:2px solid var(--dance-purple);border-radius:12px;font-size:1.5rem;font-weight:800;color:var(--dance-purple);">💃 ${n1}/${denom}</div>
                            <div style="font-size:1.8rem;font-weight:800;color:var(--dance-gold);">−</div>
                            <div style="padding:12px 18px;background:rgba(251,191,36,0.15);border:2px solid var(--dance-gold);border-radius:12px;font-size:1.5rem;font-weight:800;color:var(--dance-gold);">🕺 ${n2}/${denom}</div>
                        </div>`,
                        answer,
                        hint1: `Same denominator → subtract numerators only!`,
                        hint2: `${n1} − ${n2} = ?`,
                        hint3: `${n1}/${denom} − ${n2}/${denom} = ${answerNumer}/${denom}`,
                        diagnose(userAnswer) {
                            if (userAnswer === n2 - n1) return 'subtracted-wrong-direction';
                            // Subtracting the denominators too gives d − d = 0
                            if (userAnswer === 0) return 'subtracted-denominators';
                            if (userAnswer === denom) return 'gave-denominator';
                            return null;
                        },
                        misconceptionHints: {
                            'subtracted-wrong-direction': `Watch the order! Subtract from the bigger numerator: ${n1} − ${n2}, not ${n2} − ${n1}.`,
                            'subtracted-denominators': `Don't subtract the denominators! Keep the denominator the same and only subtract the numerators: ${n1} − ${n2} = ?`,
                            'gave-denominator': `That's the denominator — we need the numerator: ${n1} − ${n2} = ?`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Switch examples when the example's result (3) is this question's answer
                        result.workedExample = answer === 3
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 4/5 − 2/5 = ?/5</p><p>Subtract numerators: 4 − 2 = 2</p><p>Answer: <strong>2/5</strong> 🎶</p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 5/6 − 2/6 = ?/6</p><p>Subtract numerators: 5 − 2 = 3</p><p>Answer: <strong>3/6</strong> 🎶</p></div>`;
                    } else if (modality === 'visual') {
                        // Only the starting amount is shaded — taking away is her step
                        // (pre-colouring the leftover cells would just be the answer to count)
                        result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                            <div style="margin-bottom:6px;color:var(--dance-gold);font-weight:700;">✨ Dance Bar — ${denom} parts total</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${i < n1 ? 'var(--dance-purple)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="font-size:0.85rem;margin-top:4px;">
                                <span style="color:var(--dance-purple);">■ ${n1} to start</span> &nbsp;
                                <span style="color:var(--dance-gold);">Cover ${n2} with your finger — how many are left?</span>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Add fractions that make a whole
            {
                skillId: '4asf-make-whole',
                generate(diff, modality) {
                    const denom = pick([2, 3, 4, 5, 6, 8]);
                    const n1 = R(1, denom - 1);
                    const answer = denom - n1;

                    const result = {
                        type: 'input',
                        questionText: `🪩 What fraction must you add to ${n1}/${denom} to make a whole?<br>${n1}/${denom} + ?/${denom} = ${denom}/${denom}`,
                        subText: `Give the numerator`,
                        visual: `<div style="text-align:center;">
                            <div style="display:flex;gap:2px;justify-content:center;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(200/denom)}px;height:36px;border-radius:4px;background:${i < n1 ? 'var(--dance-pink)' : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="margin-top:8px;color:var(--dance-gold);font-weight:700;">How many more to fill the bar?</div>
                        </div>`,
                        answer,
                        hint1: `How many parts are NOT shaded?`,
                        hint2: `${denom} − ${n1} = ?`,
                        hint3: `${n1}/${denom} + ${answer}/${denom} = ${denom}/${denom} = 1 whole!`,
                        diagnose(userAnswer) {
                            if (userAnswer === n1) return 'used-given-numerator';
                            if (userAnswer === denom) return 'gave-denominator';
                            if (userAnswer === denom + n1) return 'added-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'used-given-numerator': `You wrote ${n1}, but that's what we already have. We need the MISSING piece: ${denom} − ${n1} = ?`,
                            'gave-denominator': `${denom} is a whole — we need the numerator of the missing piece: ${denom} − ${n1} = ?`,
                            'added-instead': `We need to find the gap, not add them together. Think: ${denom} − ${n1} = ?`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Use an example with a different denominator whose missing piece isn't this answer
                        const ex = [{n: 1, d: 4}, {n: 1, d: 3}, {n: 1, d: 5}].find(e => e.d !== denom && e.d - e.n !== answer);
                        const exDenom = ex.d;
                        const exN1 = ex.n;
                        const exAns = exDenom - exN1;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${exN1}/${exDenom} + ?/${exDenom} = 1 whole</p><p>1 whole = ${exDenom}/${exDenom}</p><p>Missing piece: ${exDenom} − ${exN1} = ${exAns}</p><p>Answer: <strong>${exAns}/${exDenom}</strong> 🪩</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                            <div style="margin-bottom:6px;color:var(--dance-gold);font-weight:700;">🪩 Fill the dance floor!</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${i < n1 ? 'var(--dance-pink)' : 'rgba(255,255,255,0.05)'};border:2px dashed ${i < n1 ? 'var(--dance-pink)' : 'var(--dance-gold)'};"></div>`).join('')}
                            </div>
                            <div style="font-size:0.85rem;color:var(--dance-gold);">Pink = filled (${n1}), dotted gold = empty. How many empty?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Add mixed numbers (same denominator)
            {
                skillId: '4asf-add-mixed',
                generate(diff, modality) {
                    const denom = pick([3, 4, 5, 6]);
                    const w1 = R(1, diff >= 2 ? 5 : 3);
                    const n1 = R(1, denom - 1);
                    const w2 = R(1, diff >= 2 ? 5 : 3);
                    const n2 = R(1, denom - 1);
                    const totalNumer = n1 + n2;
                    const extraWhole = Math.floor(totalNumer / denom);
                    const remainNumer = totalNumer % denom;
                    const answerWhole = w1 + w2 + extraWhole;
                    // Answer as improper fraction total parts
                    const answer = answerWhole * denom + remainNumer;

                    const result = {
                        type: 'input',
                        questionText: `🎤 Add: ${w1} ${n1}/${denom} + ${w2} ${n2}/${denom}<br>Give the total as a single number of ${denomName(denom)} (improper fraction numerator)`,
                        visual: `<div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;">
                            <div style="padding:10px 16px;background:rgba(236,72,153,0.1);border:2px solid var(--dance-pink);border-radius:10px;font-size:1.3rem;font-weight:700;color:var(--dance-pink);">${w1} ${n1}/${denom}</div>
                            <div style="font-size:1.5rem;color:var(--dance-gold);font-weight:800;">+</div>
                            <div style="padding:10px 16px;background:rgba(34,211,238,0.1);border:2px solid var(--dance-cyan);border-radius:10px;font-size:1.3rem;font-weight:700;color:var(--dance-cyan);">${w2} ${n2}/${denom}</div>
                        </div>`,
                        answer,
                        hint1: `Add whole numbers: ${w1} + ${w2} = ${w1 + w2}. Add fractions: ${n1}/${denom} + ${n2}/${denom} = ${totalNumer}/${denom}.`,
                        hint2: `Total: ${answerWhole}${remainNumer > 0 ? ` ${remainNumer}/${denom}` : ''} = ?/${denom}`,
                        hint3: `${answerWhole} × ${denom} + ${remainNumer} = ${answer}. The numerator is ${answer}.`,
                        diagnose(userAnswer) {
                            // Added only whole parts, forgot fractions
                            if (userAnswer === (w1 + w2) * denom) return 'forgot-fractions';
                            // Added all four numbers together raw
                            if (userAnswer === w1 + n1 + w2 + n2) return 'added-all-raw';
                            return null;
                        },
                        misconceptionHints: {
                            'forgot-fractions': `Don't forget the fraction parts! Add the fractional numerators too: ${n1} + ${n2} = ${totalNumer}, then convert to ${denomName(denom)}.`,
                            'added-all-raw': `Mixed numbers have two parts each. Add the wholes together (${w1} + ${w2}) and the numerators together (${n1} + ${n2}) separately, then combine.`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Switch examples when the example's result (15) is this question's answer
                        result.workedExample = answer === 15
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 2 1/3 + 1 1/3</p><p>Wholes: 2 + 1 = 3 &nbsp;|&nbsp; Fractions: 1/3 + 1/3 = 2/3</p><p>Total: 3 2/3 = (3 × 3 + 2)/3 = <strong>11/3</strong> 🎤</p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 1 2/4 + 2 1/4</p><p>Wholes: 1 + 2 = 3 &nbsp;|&nbsp; Fractions: 2/4 + 1/4 = 3/4</p><p>Total: 3 3/4 = (3 × 4 + 3)/4 = <strong>15/4</strong> 🎤</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                            <div style="color:var(--dance-gold);font-weight:700;margin-bottom:8px;">🎤 Step-by-step breakdown</div>
                            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
                                <div style="background:rgba(236,72,153,0.1);border:1px solid var(--dance-pink);border-radius:8px;padding:8px 12px;font-size:0.9rem;">
                                    <div style="color:var(--dance-pink);font-weight:700;">Wholes</div>
                                    <div>${w1} + ${w2} = ${w1 + w2}</div>
                                </div>
                                <div style="background:rgba(34,211,238,0.1);border:1px solid var(--dance-cyan);border-radius:8px;padding:8px 12px;font-size:0.9rem;">
                                    <div style="color:var(--dance-cyan);font-weight:700;">Numerators</div>
                                    <div>${n1} + ${n2} = ${totalNumer}${totalNumer >= denom ? ' (carry!)' : ''}</div>
                                </div>
                            </div>
                            <div style="margin-top:8px;font-size:0.85rem;color:rgba(255,255,255,0.7);">Then: ${answerWhole} whole${answerWhole !== 1 ? 's' : ''} ${remainNumer > 0 ? `+ ${remainNumer}/${denom}` : ''} → ${answerWhole} × ${denom}${remainNumer > 0 ? ` + ${remainNumer}` : ''} = ? total ${denomName(denom)}</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Subtract mixed numbers (same denominator)
            {
                skillId: '4asf-sub-mixed',
                generate(diff, modality) {
                    const denom = pick([3, 4, 5, 6]);
                    const w1 = R(3, diff >= 2 ? 8 : 5);
                    const n1 = R(1, denom - 1);
                    const w2 = R(1, w1 - 1);
                    let n2 = R(1, denom - 1);

                    // Ensure result is positive
                    let resultWhole = w1 - w2;
                    let resultNumer = n1 - n2;
                    if (resultNumer < 0) {
                        resultWhole -= 1;
                        resultNumer += denom;
                    }
                    const answer = resultWhole * denom + resultNumer;
                    const needsBorrow = n1 < n2;
                    // With 0 wholes left (only after borrowing) the numerator difference IS the answer,
                    // so hint2 and the scaffold must leave that subtraction to her
                    const noWholesLeft = resultWhole === 0;

                    const result = {
                        type: 'input',
                        questionText: `🕺 Subtract: ${w1} ${n1}/${denom} − ${w2} ${n2}/${denom}<br>Give the result as total ${denomName(denom)} (improper fraction numerator)`,
                        visual: `<div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;">
                            <div style="padding:10px 16px;background:rgba(168,85,247,0.1);border:2px solid var(--dance-purple);border-radius:10px;font-size:1.3rem;font-weight:700;color:var(--dance-purple);">${w1} ${n1}/${denom}</div>
                            <div style="font-size:1.5rem;color:var(--dance-pink);font-weight:800;">−</div>
                            <div style="padding:10px 16px;background:rgba(251,191,36,0.1);border:2px solid var(--dance-gold);border-radius:10px;font-size:1.3rem;font-weight:700;color:var(--dance-gold);">${w2} ${n2}/${denom}</div>
                        </div>`,
                        answer,
                        hint1: `Subtract wholes: ${w1} − ${w2}${needsBorrow ? ` (borrow 1 → ${w1 - 1} − ${w2} = ${w1 - w2 - 1})` : ` = ${w1 - w2}`}. Subtract fractions: ${needsBorrow ? `${n1 + denom}` : n1}/${denom} − ${n2}/${denom}${needsBorrow ? ' (after borrowing)' : ''}.`,
                        hint2: noWholesLeft
                            ? `The wholes cancel out (${w1 - 1} − ${w2} = 0), so only the fraction part is left: ${n1 + denom}/${denom} − ${n2}/${denom} = ?/${denom}`
                            : `Result: ${resultWhole}${resultNumer > 0 ? ` ${resultNumer}/${denom}` : ''} = ?/${denom}`,
                        hint3: `${resultWhole} × ${denom} + ${resultNumer} = ${answer}`,
                        diagnose(userAnswer) {
                            // Borrowed correctly for the fraction but forgot to reduce the whole by 1
                            if (needsBorrow && userAnswer === (w1 - w2) * denom + (n1 - n2 + denom)) return 'forgot-reduce-whole';
                            // Subtracted fractions the wrong way without borrowing
                            if (needsBorrow && userAnswer === (w1 - w2) * denom + (n2 - n1)) return 'forgot-borrow';
                            // Subtracted wholes only, ignored fractions
                            if (userAnswer === (w1 - w2) * denom) return 'forgot-fraction-part';
                            // Subtracted in wrong direction overall
                            if (userAnswer === (w2 - w1) * denom + (n2 - n1)) return 'wrong-direction';
                            return null;
                        },
                        misconceptionHints: {
                            'forgot-reduce-whole': `Almost! When you borrow, you must subtract 1 from the whole number part too. So ${w1} becomes ${w1 - 1}, giving ${w1 - 1} − ${w2} = ${w1 - w2 - 1} for the whole part.`,
                            'forgot-borrow': `When the top fraction (${n1}/${denom}) is smaller than the bottom (${n2}/${denom}), borrow 1 whole from ${w1} and add ${denom}/${denom} to your fraction before subtracting!`,
                            'forgot-fraction-part': `Don't forget the fractional parts! After subtracting wholes (${w1} − ${w2} = ${w1 - w2}), also handle the fraction: ${n1}/${denom} − ${n2}/${denom}.`,
                            'wrong-direction': `Subtract the second number FROM the first: ${w1} ${n1}/${denom} is the starting amount, ${w2} ${n2}/${denom} is what we remove.`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Switch examples when the example's result (5) is this question's answer,
                        // or the question has the example's exact fraction step (1/3 − 2/3 after borrowing)
                        result.workedExample = (answer === 5 || (denom === 3 && n1 === 1 && n2 === 2))
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 5 1/4 − 2 3/4</p><p>1/4 &lt; 3/4, so borrow: 4 5/4 − 2 3/4</p><p>Wholes: 4 − 2 = 2 &nbsp;|&nbsp; Fractions: 5/4 − 3/4 = 2/4</p><p>= 2 2/4 = <strong>10/4</strong> 🕺</p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 4 1/3 − 2 2/3</p><p>1/3 &lt; 2/3, so borrow: 3 4/3 − 2 2/3</p><p>Wholes: 3 − 2 = 1 &nbsp;|&nbsp; Fractions: 4/3 − 2/3 = 2/3</p><p>= 1 2/3 = <strong>5/3</strong> 🕺</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                            <div style="color:var(--dance-gold);font-weight:700;margin-bottom:8px;">🕺 Step-by-step breakdown</div>
                            ${needsBorrow ? `<div style="background:rgba(251,191,36,0.15);border:1px solid var(--dance-gold);border-radius:8px;padding:6px 12px;margin-bottom:8px;font-size:0.85rem;color:var(--dance-gold);">⚠️ Need to borrow! ${n1}/${denom} &lt; ${n2}/${denom}, so borrow 1 whole → ${n1 + denom}/${denom}</div>` : ''}
                            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
                                <div style="background:rgba(168,85,247,0.1);border:1px solid var(--dance-purple);border-radius:8px;padding:8px 12px;font-size:0.9rem;">
                                    <div style="color:var(--dance-purple);font-weight:700;">Wholes</div>
                                    <div>${needsBorrow ? `${w1} − 1 = ${w1 - 1}, then ${w1 - 1}` : w1} − ${w2} = ${resultWhole}</div>
                                </div>
                                <div style="background:rgba(251,191,36,0.1);border:1px solid var(--dance-gold);border-radius:8px;padding:8px 12px;font-size:0.9rem;">
                                    <div style="color:var(--dance-gold);font-weight:700;">Numerators</div>
                                    <div>${needsBorrow ? `${n1 + denom}` : n1} − ${n2} = ${noWholesLeft ? '?' : resultNumer}</div>
                                </div>
                            </div>
                            <div style="margin-top:8px;font-size:0.85rem;color:rgba(255,255,255,0.7);">${noWholesLeft
                                ? `Result: 0 wholes + ?/${denom} → ? total ${denomName(denom)}`
                                : `Result: ${resultWhole}${resultNumer > 0 ? ` ${resultNumer}/${denom}` : ''} → ${resultWhole} × ${denom}${resultNumer > 0 ? ` + ${resultNumer}` : ''} = ? total ${denomName(denom)}`}</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Word problems with fraction addition/subtraction
            {
                skillId: '4asf-word',
                generate(diff, modality) {
                    const denom = pick([4, 5, 6, 8]);
                    const isAdd = Math.random() < 0.5;
                    let n1, n2, answer, questionText;

                    if (isAdd) {
                        n1 = R(1, Math.floor(denom / 2));
                        n2 = R(1, denom - n1);
                        answer = n1 + n2;
                        const scenarios = [
                            `💃 Dancer A completed ${n1}/${denom} of the routine, then Dancer B added ${n2}/${denom} more. How much of the routine is done?`,
                            `🎵 A song is ${n1}/${denom} recorded. The band records ${n2}/${denom} more. Total recorded?`
                        ];
                        questionText = pick(scenarios);
                    } else {
                        n1 = R(3, denom);
                        n2 = R(1, n1 - 1);
                        answer = n1 - n2;
                        const scenarios = [
                            `🪩 A disco ball was ${n1}/${denom} lit. ${n2}/${denom} of the lights burned out. How much is still lit?`,
                            `🕺 ${n1}/${denom} of the dance floor is crowded. Then ${n2}/${denom} of the floor clears out. How much of the floor is still crowded?`
                        ];
                        questionText = pick(scenarios);
                    }

                    const result = {
                        type: 'input',
                        questionText: `${questionText}<br>Give the numerator (denominator is ${denom}).`,
                        visual: `<div style="font-size:2.5rem;text-align:center;">${isAdd ? '💃➕🕺' : '🪩➖💡'}</div>`,
                        answer,
                        hint1: `${isAdd ? 'Add' : 'Subtract'} the numerators: ${n1} ${isAdd ? '+' : '−'} ${n2} = ?`,
                        hint2: isAdd
                            ? `Start at ${n1} and count up ${n2} more. The number you land on is the numerator — the ${denomName(denom)} stay ${denomName(denom)}.`
                            : `Start at ${n1} and count back ${n2}. The number you land on is the numerator — the ${denomName(denom)} stay ${denomName(denom)}.`,
                        hint3: `The answer is ${answer}/${denom}`,
                        diagnose(userAnswer) {
                            if (isAdd) {
                                if (userAnswer === denom + denom) return 'added-denominators';
                                if (userAnswer === denom) return 'gave-denominator';
                            } else {
                                if (userAnswer === n2 - n1) return 'subtracted-wrong-order';
                                if (userAnswer === n1 + n2) return 'added-instead-of-subtracting';
                            }
                            return null;
                        },
                        misconceptionHints: {
                            'added-denominators': `Keep the denominator the same — only add the numerators: ${n1} + ${n2} = ?`,
                            'gave-denominator': `${denom} is the denominator (bottom number). We need the numerator (top): ${n1} ${isAdd ? '+' : '−'} ${n2} = ?`,
                            'subtracted-wrong-order': `Start with the larger amount: ${n1}/${denom} minus ${n2}/${denom}. Work out ${n1} − ${n2}, not ${n2} − ${n1}.`,
                            'added-instead-of-subtracting': `Read the problem again — something was taken away, so we subtract: ${n1} − ${n2} = ?`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Fall back to a second example when the first one's result is this question's answer
                        const ex = isAdd
                            ? (answer === 5 ? {a: 1, b: 2, d: 5} : {a: 2, b: 3, d: 6})
                            : (answer === 3 ? {a: 4, b: 2, d: 6} : {a: 5, b: 2, d: 8});
                        const exAns = isAdd ? ex.a + ex.b : ex.a - ex.b;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${ex.a}/${ex.d} ${isAdd ? '+' : '−'} ${ex.b}/${ex.d} = ?</p><p>Same denominator: just ${isAdd ? 'add' : 'subtract'} numerators</p><p>${ex.a} ${isAdd ? '+' : '−'} ${ex.b} = ${exAns}</p><p>Answer: <strong>${exAns}/${ex.d}</strong></p></div>`;
                    } else if (modality === 'visual') {
                        // Only the starting amount is shaded: counting on (add) or taking away (sub) is her step
                        // (shading both addends would leave a bar that already shows answer/denom)
                        result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                            <div style="color:var(--dance-gold);font-weight:700;margin-bottom:8px;">${isAdd ? '💃 Combining dance moves' : '🪩 Removing from the scene'}</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${i < n1 ? (isAdd ? 'var(--dance-pink)' : 'var(--dance-purple)') : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="font-size:0.85rem;color:rgba(255,255,255,0.7);">${isAdd ? `Pink: ${n1} to start. Count on ${n2} more parts — which part do you land on? That's ?/${denom}` : `Purple: ${n1} to start. Cover ${n2} with your finger — how many are left?`}</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Fraction Dance-Off Boss
            {
                skillId: '4asf-boss',
                generate(diff, modality) {
                    const denom = pick([3, 4, 5, 6, 8]);
                    const type = pick(['add', 'sub', 'make-whole']);

                    let questionText, visualBase, answer, hint1, hint2, hint3;
                    let diagnose, misconceptionHints;
                    let n1Val = 0, n2Val = 0; // captured for use in the visual scaffold below

                    if (type === 'add') {
                        const n1 = R(1, Math.floor(denom / 2));
                        const n2 = R(1, denom - n1);
                        n1Val = n1; n2Val = n2;
                        answer = n1 + n2;
                        questionText = `🕺 DANCE-OFF! ${n1}/${denom} + ${n2}/${denom} = ?/${denom}`;
                        visualBase = `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🎵💃🕺🎵</div>`;
                        hint1 = `Add numerators: ${n1} + ${n2}`;
                        hint2 = `Start at ${n1} and count up ${n2} more — keep the ${denomName(denom)} as ${denomName(denom)}.`;
                        hint3 = `${answer}/${denom}`;
                        diagnose = function(userAnswer) {
                            if (userAnswer === denom + denom) return 'added-denominators';
                            if (userAnswer === denom) return 'gave-denominator';
                            return null;
                        };
                        misconceptionHints = {
                            'added-denominators': `Boss tip: never add denominators! Keep ${denom} and add only the numerators: ${n1} + ${n2} = ? ✨`,
                            'gave-denominator': `${denom} is the denominator — for the numerator, work out ${n1} + ${n2} = ? 💃`
                        };
                    } else if (type === 'sub') {
                        const n1 = R(2, denom);
                        const n2 = R(1, n1 - 1);
                        n1Val = n1; n2Val = n2;
                        answer = n1 - n2;
                        questionText = `🕺 DANCE-OFF! ${n1}/${denom} − ${n2}/${denom} = ?/${denom}`;
                        visualBase = `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">✨🪩✨</div>`;
                        hint1 = `Subtract numerators: ${n1} − ${n2}`;
                        hint2 = `Start at ${n1} and count back ${n2} — keep the ${denomName(denom)} as ${denomName(denom)}.`;
                        hint3 = `${answer}/${denom}`;
                        diagnose = function(userAnswer) {
                            if (userAnswer === n2 - n1) return 'wrong-direction';
                            if (userAnswer === n1 + n2) return 'added-instead';
                            return null;
                        };
                        misconceptionHints = {
                            'wrong-direction': `Start from the first (bigger) numerator: work out ${n1} − ${n2}, not ${n2} − ${n1}. 🕺`,
                            'added-instead': `This is subtraction — remove ${n2} from ${n1}: ${n1} − ${n2} = ? ✨`
                        };
                    } else {
                        const n1 = R(1, denom - 1);
                        answer = denom - n1;
                        questionText = `🕺 DANCE-OFF! ${n1}/${denom} + ?/${denom} = 1 whole. Find the missing numerator!`;
                        visualBase = `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🎤🪩🎤</div>`;
                        hint1 = `How many ${denomName(denom)} make a whole?`;
                        hint2 = `${denom} − ${n1} = ?`;
                        hint3 = `${answer}/${denom}`;
                        diagnose = function(userAnswer) {
                            if (userAnswer === n1) return 'used-given-part';
                            if (userAnswer === denom) return 'gave-denominator';
                            return null;
                        };
                        misconceptionHints = {
                            'used-given-part': `${n1} is what we already have. The MISSING piece is ${denom} − ${n1} = ? 🎤`,
                            'gave-denominator': `${denom} is the whole — the missing numerator is ${denom} − ${n1} = ? 🪩`
                        };
                    }

                    const result = {
                        type: 'input',
                        questionText,
                        visual: visualBase,
                        answer,
                        hint1,
                        hint2,
                        hint3,
                        diagnose,
                        misconceptionHints
                    };

                    if (modality === 'worked-example') {
                        // The examples share the question's denominator, so switch to a second example
                        // whenever the first one's result is this question's answer (covers 1/d + 2/d too)
                        const exAdd = answer === 3 ? [1, 1] : [2, 1];
                        const exSub = answer === 3 ? [3, 1] : [4, 1];
                        // make-whole: use a different denominator whose missing piece isn't this answer
                        // (with thirds, 1/3 and 2/3 are the only pair, so a same-denominator example always collides)
                        const exWhole = [{n: 1, d: 4}, {n: 1, d: 3}, {n: 1, d: 5}].find(e => e.d !== denom && e.d - e.n !== answer);
                        const exampleMap = {
                            'add': `<div style="text-align:center"><p><strong>Example:</strong> ${exAdd[0]}/${denom} + ${exAdd[1]}/${denom}</p><p>Add numerators: ${exAdd[0]} + ${exAdd[1]} = ${exAdd[0] + exAdd[1]}</p><p>Answer: <strong>${exAdd[0] + exAdd[1]}/${denom}</strong> 🎵</p></div>`,
                            'sub': `<div style="text-align:center"><p><strong>Example:</strong> ${exSub[0]}/${denom} − ${exSub[1]}/${denom}</p><p>Subtract numerators: ${exSub[0]} − ${exSub[1]} = ${exSub[0] - exSub[1]}</p><p>Answer: <strong>${exSub[0] - exSub[1]}/${denom}</strong> ✨</p></div>`,
                            'make-whole': `<div style="text-align:center"><p><strong>Example:</strong> ${exWhole.n}/${exWhole.d} + ?/${exWhole.d} = 1</p><p>Missing piece: ${exWhole.d} − ${exWhole.n} = ${exWhole.d - exWhole.n}</p><p>Answer: <strong>${exWhole.d - exWhole.n}/${exWhole.d}</strong> 🪩</p></div>`
                        };
                        result.workedExample = exampleMap[type];
                    } else if (modality === 'visual') {
                        if (type === 'make-whole') {
                            const n1Val = denom - answer; // recover n1
                            const cellW = Math.floor(220 / denom);
                            // Bar model: the filled part is split into countable cells, the missing part is one
                            // un-split "?" box, so finding how many parts it holds (d − n1) is still her step
                            result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                                <div style="color:var(--dance-gold);font-weight:700;margin-bottom:6px;">🎤 Fill the dance floor!</div>
                                <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px;">
                                    ${Array.from({length: n1Val}, () => `<div style="width:${cellW}px;height:32px;border-radius:4px;background:var(--dance-pink);border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                                    <div style="width:${(denom - n1Val) * (cellW + 2) - 2}px;height:32px;border-radius:4px;background:rgba(255,255,255,0.05);border:2px dashed var(--dance-gold);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--dance-gold);">?</div>
                                </div>
                                <div style="font-size:0.85rem;color:var(--dance-gold);">1 whole = ${denom}/${denom}. You have ${n1Val}. Count on from ${n1Val} up to ${denom} — how many more? ${denom} − ${n1Val} = ?</div>
                            </div>`;
                        } else {
                            // Only the starting n1 cells are shaded: shading the added cells would leave a bar
                            // showing answer/denom, and marking the removed ones would leave exactly the answer's
                            // cells to count — so counting on / taking away is her step
                            result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                                <div style="color:var(--dance-gold);font-weight:700;margin-bottom:6px;">${type === 'add' ? `💃 Start with the pink parts, then count on ${n2Val} more` : `🪩 Start with the purple parts, then take away ${n2Val} of them`}</div>
                                <div style="display:flex;gap:2px;justify-content:center;">
                                    ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${i < n1Val ? (type === 'add' ? 'var(--dance-pink)' : 'var(--dance-purple)') : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                                </div>
                                <div style="font-size:0.85rem;color:rgba(255,255,255,0.7);margin-top:4px;">${type === 'add' ? `Pink: ${n1Val}/${denom} + ${n2Val}/${denom} more = ?/${denom}` : `Purple: ${n1Val}/${denom} − take away: ${n2Val}/${denom} = ?/${denom}`}</div>
                            </div>`;
                        }
                    }

                    return result;
                }
            }
        ];
    }
};
