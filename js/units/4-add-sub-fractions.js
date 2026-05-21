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
                            if (userAnswer === n1 + n2 + denom + denom) return 'added-denominators-too';
                            if (userAnswer === denom) return 'gave-denominator';
                            return null;
                        },
                        misconceptionHints: {
                            'added-denominators-too': `Don't add the denominators! When fractions have the same denominator, keep it and only add the numerators.`,
                            'gave-denominator': `That's the denominator! We need the numerator: ${n1} + ${n2} = ${answerNumer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 2/5 + 1/5 = ?/5</p><p>Same denominator → add numerators</p><p>2 + 1 = 3</p><p>Answer: <strong>3/5</strong> 🎵</p></div>`;
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
                            <div style="color:var(--dance-cyan);font-size:0.85rem;">+ ${n2} shaded (🕺) → total shaded = ${answerNumer}</div>
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
                            if (userAnswer === n1 - n2 - denom) return 'subtracted-denominators';
                            if (userAnswer === denom) return 'gave-denominator';
                            return null;
                        },
                        misconceptionHints: {
                            'subtracted-wrong-direction': `Watch the order! Subtract from the bigger numerator: ${n1} − ${n2}, not ${n2} − ${n1}.`,
                            'subtracted-denominators': `Don't subtract the denominators! Keep the denominator the same and only subtract the numerators: ${n1} − ${n2} = ${answerNumer}.`,
                            'gave-denominator': `That's the denominator — we need the numerator: ${n1} − ${n2} = ${answerNumer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 5/6 − 2/6 = ?/6</p><p>Subtract numerators: 5 − 2 = 3</p><p>Answer: <strong>3/6</strong> 🎶</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                            <div style="margin-bottom:6px;color:var(--dance-gold);font-weight:700;">✨ Dance Bar — ${denom} parts total</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${i < n1 ? (i < answerNumer ? 'var(--dance-purple)' : 'rgba(251,191,36,0.4)') : 'rgba(255,255,255,0.1)'};border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="font-size:0.85rem;margin-top:4px;">
                                <span style="color:var(--dance-purple);">■ ${answerNumer} remaining</span> &nbsp;
                                <span style="color:var(--dance-gold);">■ ${n2} removed</span>
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
                            'used-given-numerator': `You wrote ${n1}, but that's what we already have. We need the MISSING piece: ${denom} − ${n1} = ${answer}.`,
                            'gave-denominator': `${denom} is a whole — we need the numerator of the missing piece: ${denom} − ${n1} = ${answer}.`,
                            'added-instead': `We need to find the gap, not add them together. Think: ${denom} − ${n1} = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const exDenom = 4;
                        const exN1 = 1;
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
                        questionText: `🎤 Add: ${w1} ${n1}/${denom} + ${w2} ${n2}/${denom}<br>Give the total as a single number of ${denom}ths (improper fraction numerator)`,
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
                            'forgot-fractions': `Don't forget the fraction parts! Add the fractional numerators too: ${n1} + ${n2} = ${totalNumer}, then convert to ${denom}ths.`,
                            'added-all-raw': `Mixed numbers have two parts each. Add the wholes together (${w1} + ${w2}) and the numerators together (${n1} + ${n2}) separately, then combine.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 1 2/4 + 2 1/4</p><p>Wholes: 1 + 2 = 3 &nbsp;|&nbsp; Fractions: 2/4 + 1/4 = 3/4</p><p>Total: 3 3/4 = (3 × 4 + 3)/4 = <strong>15/4</strong> 🎤</p></div>`;
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
                            <div style="margin-top:8px;font-size:0.85rem;color:rgba(255,255,255,0.7);">Then: ${answerWhole} whole${answerWhole !== 1 ? 's' : ''} ${remainNumer > 0 ? `+ ${remainNumer}/${denom}` : ''} → ${answer} total ${denom}ths</div>
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

                    const result = {
                        type: 'input',
                        questionText: `🕺 Subtract: ${w1} ${n1}/${denom} − ${w2} ${n2}/${denom}<br>Give the result as total ${denom}ths (improper fraction numerator)`,
                        visual: `<div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;">
                            <div style="padding:10px 16px;background:rgba(168,85,247,0.1);border:2px solid var(--dance-purple);border-radius:10px;font-size:1.3rem;font-weight:700;color:var(--dance-purple);">${w1} ${n1}/${denom}</div>
                            <div style="font-size:1.5rem;color:var(--dance-pink);font-weight:800;">−</div>
                            <div style="padding:10px 16px;background:rgba(251,191,36,0.1);border:2px solid var(--dance-gold);border-radius:10px;font-size:1.3rem;font-weight:700;color:var(--dance-gold);">${w2} ${n2}/${denom}</div>
                        </div>`,
                        answer,
                        hint1: `Subtract wholes: ${w1} − ${w2}${needsBorrow ? ` (borrow 1 → ${w1 - 1} − ${w2} = ${w1 - w2 - 1})` : ` = ${w1 - w2}`}. Subtract fractions: ${needsBorrow ? `${n1 + denom}` : n1}/${denom} − ${n2}/${denom}${needsBorrow ? ' (after borrowing)' : ''}.`,
                        hint2: `Result: ${resultWhole}${resultNumer > 0 ? ` ${resultNumer}/${denom}` : ''} = ?/${denom}`,
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
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 4 1/3 − 2 2/3</p><p>1/3 &lt; 2/3, so borrow: 3 4/3 − 2 2/3</p><p>Wholes: 3 − 2 = 1 &nbsp;|&nbsp; Fractions: 4/3 − 2/3 = 2/3</p><p>= 1 2/3 = <strong>5/3</strong> 🕺</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                            <div style="color:var(--dance-gold);font-weight:700;margin-bottom:8px;">🕺 Step-by-step breakdown</div>
                            ${needsBorrow ? `<div style="background:rgba(251,191,36,0.15);border:1px solid var(--dance-gold);border-radius:8px;padding:6px 12px;margin-bottom:8px;font-size:0.85rem;color:var(--dance-gold);">⚠️ Need to borrow! ${n1}/${denom} &lt; ${n2}/${denom}, so borrow 1 whole → ${n1 + denom}/${denom}</div>` : ''}
                            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
                                <div style="background:rgba(168,85,247,0.1);border:1px solid var(--dance-purple);border-radius:8px;padding:8px 12px;font-size:0.9rem;">
                                    <div style="color:var(--dance-purple);font-weight:700;">Wholes</div>
                                    <div>${needsBorrow ? `${w1} − 1 = ${w1 - 1}` : w1} − ${w2} = ${resultWhole}</div>
                                </div>
                                <div style="background:rgba(251,191,36,0.1);border:1px solid var(--dance-gold);border-radius:8px;padding:8px 12px;font-size:0.9rem;">
                                    <div style="color:var(--dance-gold);font-weight:700;">Numerators</div>
                                    <div>${needsBorrow ? `${n1 + denom}` : n1} − ${n2} = ${resultNumer}</div>
                                </div>
                            </div>
                            <div style="margin-top:8px;font-size:0.85rem;color:rgba(255,255,255,0.7);">Result: ${resultWhole}${resultNumer > 0 ? ` ${resultNumer}/${denom}` : ''} → ${answer} total ${denom}ths</div>
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
                            `🕺 A dancer used ${n1}/${denom} of their energy, then rested and recovered ${n2}/${denom}. Wait — how much energy was used after recovery?`
                        ];
                        questionText = pick(scenarios);
                    }

                    const result = {
                        type: 'input',
                        questionText: `${questionText}<br>Give the numerator (denominator is ${denom}).`,
                        visual: `<div style="font-size:2.5rem;text-align:center;">${isAdd ? '💃➕🕺' : '🪩➖💡'}</div>`,
                        answer,
                        hint1: `${isAdd ? 'Add' : 'Subtract'} the numerators: ${n1} ${isAdd ? '+' : '−'} ${n2} = ?`,
                        hint2: `${n1} ${isAdd ? '+' : '−'} ${n2} = ${answer}`,
                        hint3: `The answer is ${answer}/${denom}`,
                        diagnose(userAnswer) {
                            if (isAdd) {
                                if (userAnswer === n1 + n2 + denom + denom) return 'added-denominators';
                                if (userAnswer === denom) return 'gave-denominator';
                            } else {
                                if (userAnswer === n2 - n1) return 'subtracted-wrong-order';
                                if (userAnswer === n1 + n2) return 'added-instead-of-subtracting';
                            }
                            return null;
                        },
                        misconceptionHints: {
                            'added-denominators': `Keep the denominator the same — only add the numerators: ${n1} + ${n2} = ${answer}.`,
                            'gave-denominator': `${denom} is the denominator (bottom number). We need the numerator (top): ${n1} ${isAdd ? '+' : '−'} ${n2} = ${answer}.`,
                            'subtracted-wrong-order': `Start with the larger amount: ${n1}/${denom} minus ${n2}/${denom}. That's ${n1} − ${n2} = ${answer}, not ${n2} − ${n1}.`,
                            'added-instead-of-subtracting': `Read the problem again — something was taken away, so we subtract: ${n1} − ${n2} = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${isAdd ? '2/6 + 3/6' : '5/8 − 2/8'} = ?</p><p>Same denominator: just ${isAdd ? 'add' : 'subtract'} numerators</p><p>${isAdd ? '2 + 3 = 5' : '5 − 2 = 3'}</p><p>Answer: <strong>${isAdd ? '5/6' : '3/8'}</strong></p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                            <div style="color:var(--dance-gold);font-weight:700;margin-bottom:8px;">${isAdd ? '💃 Combining dance moves' : '🪩 Removing from the scene'}</div>
                            <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px;">
                                ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${
                                    isAdd
                                        ? (i < n1 ? 'var(--dance-pink)' : i < n1 + n2 ? 'var(--dance-cyan)' : 'rgba(255,255,255,0.1)')
                                        : (i < answer ? 'var(--dance-purple)' : i < n1 ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)')
                                };border:2px solid rgba(255,255,255,0.2);"></div>`).join('')}
                            </div>
                            <div style="font-size:0.85rem;color:rgba(255,255,255,0.7);">${isAdd ? `Pink: ${n1} + Cyan: ${n2} = ${answer} total shaded` : `Purple: ${answer} remaining after removing ${n2}`}</div>
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
                        hint2 = `${n1} + ${n2} = ${answer}`;
                        hint3 = `${answer}/${denom}`;
                        diagnose = function(userAnswer) {
                            if (userAnswer === n1 + n2 + denom + denom) return 'added-denominators';
                            if (userAnswer === denom) return 'gave-denominator';
                            return null;
                        };
                        misconceptionHints = {
                            'added-denominators': `Boss tip: never add denominators! Keep ${denom} and add only the numerators: ${n1} + ${n2} = ${answer}. ✨`,
                            'gave-denominator': `${denom} is the denominator — the numerator is ${n1} + ${n2} = ${answer}. 💃`
                        };
                    } else if (type === 'sub') {
                        const n1 = R(2, denom);
                        const n2 = R(1, n1 - 1);
                        n1Val = n1; n2Val = n2;
                        answer = n1 - n2;
                        questionText = `🕺 DANCE-OFF! ${n1}/${denom} − ${n2}/${denom} = ?/${denom}`;
                        visualBase = `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">✨🪩✨</div>`;
                        hint1 = `Subtract numerators: ${n1} − ${n2}`;
                        hint2 = `${n1} − ${n2} = ${answer}`;
                        hint3 = `${answer}/${denom}`;
                        diagnose = function(userAnswer) {
                            if (userAnswer === n2 - n1) return 'wrong-direction';
                            if (userAnswer === n1 + n2) return 'added-instead';
                            return null;
                        };
                        misconceptionHints = {
                            'wrong-direction': `Start from the top: ${n1} − ${n2} = ${answer}, not ${n2} − ${n1}. 🕺`,
                            'added-instead': `This is subtraction — remove ${n2} from ${n1}: ${n1} − ${n2} = ${answer}. ✨`
                        };
                    } else {
                        const n1 = R(1, denom - 1);
                        answer = denom - n1;
                        questionText = `🕺 DANCE-OFF! ${n1}/${denom} + ?/${denom} = 1 whole. Find the missing numerator!`;
                        visualBase = `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🎤🪩🎤</div>`;
                        hint1 = `How many ${denom}ths make a whole?`;
                        hint2 = `${denom} − ${n1} = ?`;
                        hint3 = `${answer}/${denom}`;
                        diagnose = function(userAnswer) {
                            if (userAnswer === n1) return 'used-given-part';
                            if (userAnswer === denom) return 'gave-denominator';
                            return null;
                        };
                        misconceptionHints = {
                            'used-given-part': `${n1} is what we already have. The MISSING piece is ${denom} − ${n1} = ${answer}. 🎤`,
                            'gave-denominator': `${denom} is the whole — the missing numerator is ${denom} − ${n1} = ${answer}. 🪩`
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
                        const exampleMap = {
                            'add': `<div style="text-align:center"><p><strong>Example:</strong> 2/${denom} + 1/${denom}</p><p>Add numerators: 2 + 1 = 3</p><p>Answer: <strong>3/${denom}</strong> 🎵</p></div>`,
                            'sub': `<div style="text-align:center"><p><strong>Example:</strong> 4/${denom} − 1/${denom}</p><p>Subtract numerators: 4 − 1 = 3</p><p>Answer: <strong>3/${denom}</strong> ✨</p></div>`,
                            'make-whole': `<div style="text-align:center"><p><strong>Example:</strong> 1/${denom} + ?/${denom} = 1</p><p>Missing piece: ${denom} − 1 = ${denom - 1}</p><p>Answer: <strong>${denom - 1}/${denom}</strong> 🪩</p></div>`
                        };
                        result.workedExample = exampleMap[type];
                    } else if (modality === 'visual') {
                        if (type === 'make-whole') {
                            const n1Val = denom - answer; // recover n1
                            result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                                <div style="color:var(--dance-gold);font-weight:700;margin-bottom:6px;">🎤 Fill the dance floor!</div>
                                <div style="display:flex;gap:2px;justify-content:center;margin-bottom:4px;">
                                    ${Array.from({length: denom}, (_, i) => `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${i < n1Val ? 'var(--dance-pink)' : 'rgba(255,255,255,0.05)'};border:2px dashed ${i < n1Val ? 'var(--dance-pink)' : 'var(--dance-gold)'};"></div>`).join('')}
                                </div>
                                <div style="font-size:0.85rem;color:var(--dance-gold);">Pink = filled (${n1Val}), dotted = empty. Count the empty ones!</div>
                            </div>`;
                        } else {
                            // Show operands in two colours so the visual scaffolds the thinking
                            // without revealing the answer directly
                            result.visual += `<div class="visual-scaffold" style="margin-top:14px;text-align:center;">
                                <div style="color:var(--dance-gold);font-weight:700;margin-bottom:6px;">${type === 'add' ? '💃 Pink + Cyan = total shaded' : '🪩 Purple total, remove the gold ones'}</div>
                                <div style="display:flex;gap:2px;justify-content:center;">
                                    ${Array.from({length: denom}, (_, i) => {
                                        let bg;
                                        if (type === 'add') {
                                            bg = i < n1Val ? 'var(--dance-pink)' : i < n1Val + n2Val ? 'var(--dance-cyan)' : 'rgba(255,255,255,0.1)';
                                        } else {
                                            bg = i < n2Val ? 'var(--dance-gold)' : i < n1Val ? 'var(--dance-purple)' : 'rgba(255,255,255,0.1)';
                                        }
                                        return `<div style="width:${Math.floor(220/denom)}px;height:32px;border-radius:4px;background:${bg};border:2px solid rgba(255,255,255,0.2);"></div>`;
                                    }).join('')}
                                </div>
                                <div style="font-size:0.85rem;color:rgba(255,255,255,0.7);margin-top:4px;">${type === 'add' ? `Pink: ${n1Val}/${denom} + Cyan: ${n2Val}/${denom} = ?/${denom}` : `Purple: ${n1Val}/${denom} − Gold: ${n2Val}/${denom} = ?/${denom}`}</div>
                            </div>`;
                        }
                    }

                    return result;
                }
            }
        ];
    }
};
