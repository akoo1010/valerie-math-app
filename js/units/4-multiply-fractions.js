/* ===== UNIT: MULTIPLY FRACTIONS — Monster Theme 🐉 ===== */

const MultiplyFractions4 = {
    id: '4-multiply-fractions',
    title: 'Multiply Fractions',
    icon: '🐉',
    theme: 'monster',
    description: "Multiply fractions like a dragon master! Use visual models to conquer fraction multiplication!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;
        const shuffle = Engine.Utils.shuffle;

        return [
            // 1. Fraction × Whole Number (e.g. 3 × 2/5 = 6/5)
            {
                skillId: '4mf-frac-times-whole',
                generate(diff, modality) {
                    const denoms = diff >= 2 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5];
                    const denom = pick(denoms);
                    const numer = R(1, diff >= 2 ? denom - 1 : Math.min(3, denom - 1));
                    const whole = R(2, diff >= 2 ? 6 : 4);
                    const answerNumer = whole * numer;
                    const answer = answerNumer;

                    const result = {
                        type: 'input',
                        questionText: `🐉 The dragon attacks ${whole} times with ${numer}/${denom} power each!<br>What is ${whole} × ${numer}/${denom}?`,
                        subText: `Give the numerator of the answer (denominator is ${denom})`,
                        visual: `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                            ${Array.from({length: whole}, (_, i) => `<div style="background:rgba(255,59,48,0.15);border:2px solid var(--monster-red);border-radius:10px;padding:8px 12px;font-weight:700;">${numer}/${denom} 🔥</div>`).join('')}
                        </div>`,
                        answer,
                        hint1: `Multiply the whole number by the numerator: ${whole} × ${numer} = ?`,
                        hint2: `${whole} × ${numer} = ${answerNumer}, so the answer is ${answerNumer}/${denom}`,
                        hint3: `${whole} × ${numer}/${denom} = ${answerNumer}/${denom} — the numerator is ${answerNumer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === whole * denom) return 'multiplied-denominator';
                            if (userAnswer === whole + numer) return 'added-instead-of-multiplied';
                            return null;
                        },
                        misconceptionHints: {
                            'multiplied-denominator': `Don't multiply the denominator! Only multiply the numerator by the whole number: ${whole} × ${numer} = ${answerNumer}.`,
                            'added-instead-of-multiplied': `We need to multiply, not add! ${whole} × ${numer} = ${answerNumer}, not ${whole} + ${numer} = ${whole + numer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weW = R(2, 3), weN = 1, weD = pick([2, 3, 4]);
                        result.workedExample = `<div style="text-align:center">
                            <p><strong>Example:</strong> ${weW} × ${weN}/${weD} = ?</p>
                            <p>Multiply the whole number by the numerator: ${weW} × ${weN} = ${weW * weN}</p>
                            <p>Keep the denominator: ${weD}</p>
                            <p>Answer: <strong>${weW * weN}/${weD}</strong> — numerator is <strong>${weW * weN}</strong></p>
                        </div>`;
                    }

                    if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(255,59,48,0.1);border:1px solid var(--monster-red);border-radius:10px;">
                            <p style="font-weight:700;color:var(--monster-red);">🔥 Dragon Strategy:</p>
                            <p>1. Multiply only the numerator: ${whole} × ${numer} = <strong>${answerNumer}</strong></p>
                            <p>2. Keep the denominator: <strong>${denom}</strong></p>
                            <p>3. Answer: <strong>${answerNumer}/${denom}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Whole Number × Unit Fraction (e.g. 4 × 1/3)
            {
                skillId: '4mf-whole-times-unit',
                generate(diff, modality) {
                    const denom = pick(diff >= 2 ? [2, 3, 4, 5, 6, 8] : [2, 3, 4, 5]);
                    const whole = R(2, diff >= 2 ? 8 : 5);
                    const answerNumer = whole;
                    const answer = answerNumer;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `⚡ A lightning monster zaps ${whole} targets with 1/${denom} power each!<br>What is ${whole} × 1/${denom}?<br>Give the numerator (denominator stays ${denom}).`,
                        visual: `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                            ${Array.from({length: whole}, () => `<span style="font-size:1.5rem">⚡</span>`).join('')}
                        </div>
                        <div style="margin-top:8px;font-size:1.2rem;font-weight:700;color:var(--monster-yellow);">Each zap = 1/${denom}</div>`,
                        answer,
                        options: Engine.Utils.multipleChoice(answer),
                        hint1: `A unit fraction has 1 on top. Multiply: ${whole} × 1 = ?`,
                        hint2: `${whole} × 1/${denom} = ${whole}/${denom} — the numerator is ${whole}`,
                        hint3: `The numerator is ${whole}`,
                        diagnose(userAnswer) {
                            if (userAnswer === whole * denom) return 'multiplied-denominator';
                            return null;
                        },
                        misconceptionHints: {
                            'multiplied-denominator': `The denominator stays the same! Only multiply the numerator: ${whole} × 1 = ${whole}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weW = R(2, 3), weD = pick([2, 3, 4]);
                        result.workedExample = `<div style="text-align:center">
                            <p><strong>Example:</strong> ${weW} × 1/${weD} = ?</p>
                            <p>Multiply: ${weW} × 1 = ${weW}</p>
                            <p>Keep denominator: ${weD}</p>
                            <p>Answer: <strong>${weW}/${weD}</strong> — numerator is <strong>${weW}</strong></p>
                        </div>`;
                    }

                    if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(255,204,0,0.1);border:1px solid var(--monster-yellow);border-radius:10px;">
                            <p style="font-weight:700;color:var(--monster-yellow);">⚡ Lightning Strategy:</p>
                            <p>1. A unit fraction has 1 on top, so: ${whole} × 1 = <strong>${whole}</strong></p>
                            <p>2. Keep the denominator exactly the same: <strong>${denom}</strong></p>
                            <p>3. Answer: <strong>${whole}/${denom}</strong> — numerator is <strong>${whole}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Word Problem — Fraction of a Group (e.g. "1/4 of 12 monsters")
            {
                skillId: '4mf-fraction-of-group',
                generate(diff, modality) {
                    const denom = pick([2, 3, 4, 5, 6]);
                    const numer = R(1, denom - 1);
                    const groupSize = denom * R(2, diff >= 2 ? 4 : 3);
                    const answer = (numer * groupSize) / denom;
                    const creatures = pick(['dragons', 'goblins', 'phoenixes', 'griffins']);
                    const emojis = { dragons: '🐲', goblins: '👹', phoenixes: '🔥', griffins: '🦅' };

                    const result = {
                        type: 'input',
                        questionText: `🐾 A pack of ${groupSize} ${creatures} is in the arena. ${numer}/${denom} of them breathe fire!<br>How many ${creatures} breathe fire?`,
                        visual: `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;">
                            ${Array.from({length: groupSize}, () => `<span style="font-size:1.5rem">${emojis[creatures]}</span>`).join('')}
                        </div>`,
                        answer,
                        hint1: `Find ${numer}/${denom} of ${groupSize}: first divide ${groupSize} by ${denom}`,
                        hint2: `${groupSize} ÷ ${denom} = ${groupSize / denom}. Now multiply by ${numer}: ${groupSize / denom} × ${numer} = ?`,
                        hint3: `${numer}/${denom} of ${groupSize} = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === groupSize / denom) return 'forgot-to-multiply-numerator';
                            if (userAnswer === groupSize - answer) return 'found-complement';
                            return null;
                        },
                        misconceptionHints: {
                            'forgot-to-multiply-numerator': `You divided by ${denom} but forgot to multiply by ${numer}! ${groupSize} ÷ ${denom} = ${groupSize / denom}, then × ${numer} = ${answer}.`,
                            'found-complement': `That's how many DON'T breathe fire! We want the ones that DO: ${numer}/${denom} of ${groupSize} = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weD = 4, weN = 3, weG = 12;
                        result.workedExample = `<div style="text-align:center">
                            <p><strong>Example:</strong> ${weN}/${weD} of ${weG} monsters = ?</p>
                            <p>Step 1: Divide ${weG} by ${weD}: ${weG} ÷ ${weD} = ${weG / weD}</p>
                            <p>Step 2: Multiply by ${weN}: ${weG / weD} × ${weN} = ${(weN * weG) / weD}</p>
                            <p>Answer: <strong>${(weN * weG) / weD} monsters</strong></p>
                        </div>`;
                    }

                    if (modality === 'visual') {
                        const perGroup = groupSize / denom;
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(255,59,48,0.1);border-radius:10px;">
                            <p>Split into ${denom} equal groups of ${perGroup}:</p>
                            ${Array.from({length: denom}, (_, i) => `<div style="margin:4px 0;">${i < numer ? '🔥' : '⬜'} Group ${i + 1}: ${Array(perGroup).fill(emojis[creatures]).join('')}</div>`).join('')}
                            <div style="font-weight:700;margin-top:6px;">${numer} groups = ${answer} ${creatures}</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Visual Model — Shade the Fraction of a Group
            {
                skillId: '4mf-visual-shade',
                generate(diff, modality) {
                    const denom = pick([2, 3, 4, 5]);
                    const whole = R(2, diff >= 2 ? 5 : 3);
                    const totalParts = whole * denom;
                    const numer = R(1, denom - 1);
                    const shadedParts = whole * numer;
                    const answer = shadedParts;

                    const monsterEmoji = pick(['🐲', '🦖', '👾', '👹']);

                    const result = {
                        type: 'input',
                        questionText: `💎 Shade ${whole} × ${numer}/${denom} of the monster grid!<br>How many cells should be shaded?`,
                        visual: `<div style="text-align:center;">
                            <div style="display:grid;grid-template-columns:repeat(${denom}, 48px);gap:4px;justify-content:center;">
                                ${Array.from({length: totalParts}, (_, i) => {
                                    const row = Math.floor(i / denom);
                                    return `<div style="width:48px;height:48px;border:2px solid var(--monster-purple);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;background:${i < shadedParts ? 'rgba(147,51,234,0.3)' : 'rgba(255,255,255,0.05)'};">${monsterEmoji}</div>`;
                                }).join('')}
                            </div>
                            <div style="margin-top:8px;color:var(--monster-purple);font-weight:700;">${whole} rows × ${denom} columns — shade ${numer}/${denom} of each row</div>
                        </div>`,
                        answer,
                        hint1: `Each row has ${denom} parts. Shade ${numer} parts per row.`,
                        hint2: `${whole} rows × ${numer} shaded per row = ?`,
                        hint3: `${whole} × ${numer} = ${shadedParts} shaded cells`,
                        diagnose(userAnswer) {
                            if (userAnswer === totalParts) return 'counted-total-not-shaded';
                            if (userAnswer === whole * denom) return 'multiplied-denominators';
                            if (userAnswer === numer) return 'counted-one-row-only';
                            return null;
                        },
                        misconceptionHints: {
                            'counted-total-not-shaded': `${totalParts} is the total number of cells, not the shaded ones! Only shade ${numer} per row: ${whole} × ${numer} = ${shadedParts}.`,
                            'multiplied-denominators': `You multiplied by the denominator instead of the numerator! Shade ${numer} parts per row, not ${denom}: ${whole} × ${numer} = ${shadedParts}.`,
                            'counted-one-row-only': `${numer} is just one row! You have ${whole} rows, each with ${numer} shaded: ${whole} × ${numer} = ${shadedParts}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weD = 3, weW = 2, weN = 2;
                        result.workedExample = `<div style="text-align:center">
                            <p><strong>Example:</strong> ${weW} × ${weN}/${weD} on a grid</p>
                            <p>${weW} rows × ${weD} columns = ${weW * weD} total cells</p>
                            <p>Shade ${weN} per row: ${weW} × ${weN} = ${weW * weN}</p>
                            <p>Answer: <strong>${weW * weN} shaded cells</strong></p>
                        </div>`;
                    }

                    if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(147,51,234,0.1);border:1px solid var(--monster-purple);border-radius:10px;">
                            <p style="font-weight:700;color:var(--monster-purple);">💎 Grid Strategy:</p>
                            <p>1. Count shaded cells per row: <strong>${numer}</strong></p>
                            <p>2. Count number of rows: <strong>${whole}</strong></p>
                            <p>3. Multiply: ${whole} × ${numer} = <strong>${shadedParts}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Fraction × Whole Number as Repeated Addition
            {
                skillId: '4mf-repeated-addition',
                generate(diff, modality) {
                    const denom = pick(diff >= 2 ? [2, 3, 4, 5, 6] : [2, 3, 4]);
                    const numer = R(1, Math.min(3, denom - 1));
                    const whole = R(2, diff >= 2 ? 5 : 4);
                    const answerNumer = whole * numer;
                    const answer = answerNumer;
                    const addExpr = Array(whole).fill(`${numer}/${denom}`).join(' + ');

                    const result = {
                        type: 'input',
                        questionText: `🗡️ A knight attacks ${whole} times! Each strike deals ${numer}/${denom} damage.<br>${addExpr} = ?/${denom}`,
                        subText: `Give the numerator`,
                        visual: `<div style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;">
                            ${Array.from({length: whole}, (_, i) => `<div style="background:rgba(59,130,246,0.15);border:2px solid var(--monster-blue);border-radius:10px;padding:6px 10px;font-weight:700;">🗡️ ${numer}/${denom}</div>`).join(`<span style="font-size:1.2rem;font-weight:700;">+</span>`)}
                        </div>`,
                        answer,
                        hint1: `Add the numerators: ${Array(whole).fill(numer).join(' + ')} = ?`,
                        hint2: `${whole} × ${numer} = ${answerNumer}`,
                        hint3: `${addExpr} = ${answerNumer}/${denom} — the numerator is ${answerNumer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === whole * denom) return 'added-denominators';
                            if (userAnswer === numer) return 'counted-one-fraction';
                            return null;
                        },
                        misconceptionHints: {
                            'added-denominators': `Don't add the denominators! The denominator stays ${denom}. Just add the numerators: ${Array(whole).fill(numer).join(' + ')} = ${answerNumer}.`,
                            'counted-one-fraction': `That's just one fraction! You need to add all ${whole} of them: ${Array(whole).fill(numer).join(' + ')} = ${answerNumer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weW = 3, weN = 1, weD = 4;
                        result.workedExample = `<div style="text-align:center">
                            <p><strong>Example:</strong> 1/${weD} + 1/${weD} + 1/${weD} = ?/${weD}</p>
                            <p>Add numerators: 1 + 1 + 1 = 3</p>
                            <p>Denominator stays ${weD}</p>
                            <p>Answer: <strong>3/${weD}</strong> — numerator is <strong>3</strong></p>
                        </div>`;
                    }

                    if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(59,130,246,0.1);border:1px solid var(--monster-blue);border-radius:10px;">
                            <p style="font-weight:700;color:var(--monster-blue);">🗡️ Knight's Repeated Addition Strategy:</p>
                            <p>1. Each strike adds ${numer} to the numerator</p>
                            <p>2. After ${whole} strikes: ${Array(whole).fill(numer).join(' + ')} = <strong>${answerNumer}</strong></p>
                            <p>3. Denominator stays <strong>${denom}</strong> — never add denominators!</p>
                            <p>4. Answer numerator: <strong>${answerNumer}</strong></p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Mixed Number Result (e.g. 5 × 2/3 = 10/3 = 3 1/3) — answer as improper fraction numerator
            {
                skillId: '4mf-mixed-result',
                generate(diff, modality) {
                    const denom = pick(diff >= 2 ? [2, 3, 4, 5, 6] : [2, 3, 4]);
                    const numer = R(1, denom - 1);
                    const whole = R(3, diff >= 2 ? 7 : 5);
                    const answerNumer = whole * numer;
                    const answer = answerNumer;
                    const wholeResult = Math.floor(answerNumer / denom);
                    const remainNumer = answerNumer % denom;

                    const result = {
                        type: 'input',
                        questionText: `🛡️ A shield monster blocks ${whole} attacks of ${numer}/${denom} each!<br>What is ${whole} × ${numer}/${denom}?`,
                        subText: `Give the numerator of the improper fraction (denominator is ${denom})`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:2rem;font-weight:700;color:var(--monster-red);">
                                ${whole} × ${numer}/${denom} = ?/${denom}
                            </div>
                            <div style="margin-top:8px;font-size:0.9rem;color:var(--monster-purple);">
                                (That's ${wholeResult}${remainNumer > 0 ? ` and ${remainNumer}/${denom}` : ''} as a mixed number!)
                            </div>
                        </div>`,
                        answer,
                        hint1: `Multiply the whole number by the numerator: ${whole} × ${numer} = ?`,
                        hint2: `${whole} × ${numer} = ${answerNumer}. The fraction is ${answerNumer}/${denom}.`,
                        hint3: `${whole} × ${numer}/${denom} = ${answerNumer}/${denom} = ${wholeResult}${remainNumer > 0 ? ` ${remainNumer}/${denom}` : ''}`,
                        diagnose(userAnswer) {
                            if (userAnswer === wholeResult) return 'gave-whole-part-only';
                            if (userAnswer === remainNumer) return 'gave-remainder-only';
                            return null;
                        },
                        misconceptionHints: {
                            'gave-whole-part-only': `${wholeResult} is only the whole number part! We need the improper fraction numerator: ${whole} × ${numer} = ${answerNumer}.`,
                            'gave-remainder-only': `${remainNumer} is just the leftover! The full numerator is ${whole} × ${numer} = ${answerNumer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weW = 4, weN = 2, weD = 3;
                        const weAns = weW * weN;
                        const weWhole = Math.floor(weAns / weD);
                        const weRem = weAns % weD;
                        result.workedExample = `<div style="text-align:center">
                            <p><strong>Example:</strong> ${weW} × ${weN}/${weD} = ?</p>
                            <p>Multiply numerator: ${weW} × ${weN} = ${weAns}</p>
                            <p>Improper fraction: ${weAns}/${weD}</p>
                            <p>Mixed number: ${weWhole}${weRem > 0 ? ` ${weRem}/${weD}` : ''}</p>
                            <p>Numerator answer: <strong>${weAns}</strong></p>
                        </div>`;
                    }

                    if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(255,59,48,0.1);border:1px solid var(--monster-red);border-radius:10px;">
                            <p style="font-weight:700;color:var(--monster-red);">🛡️ Shield Monster Strategy:</p>
                            <p>1. Multiply only the numerator: ${whole} × ${numer} = <strong>${answerNumer}</strong></p>
                            <p>2. Keep the denominator: <strong>${denom}</strong></p>
                            <p>3. Improper fraction: <strong>${answerNumer}/${denom}</strong></p>
                            ${remainNumer > 0 ? `<p>4. As a mixed number: <strong>${wholeResult} ${remainNumer}/${denom}</strong> (but we want the improper numerator: <strong>${answerNumer}</strong>)</p>` : `<p>4. This simplifies to a whole number: <strong>${wholeResult}</strong> (improper numerator is still <strong>${answerNumer}</strong>)</p>`}
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Dragon Fraction Battle — Mixed Problems
            {
                skillId: '4mf-dragon-battle',
                generate(diff, modality) {
                    const problemType = R(1, 3);
                    let questionText, visual, answer, hint1, hint2, hint3;

                    let diagnoseFn, misconceptionHints;

                    if (problemType === 1) {
                        // Fraction × whole
                        const denom = pick([2, 3, 4, 5]);
                        const numer = R(1, denom - 1);
                        const whole = R(2, diff >= 2 ? 6 : 4);
                        answer = whole * numer;
                        questionText = `🐉 Dragon Battle Round! What is ${whole} × ${numer}/${denom}?<br>Give the numerator (denominator is ${denom}).`;
                        visual = `<div style="font-size:3rem;text-align:center;">🐉⚔️🐉</div>
                            <div style="text-align:center;font-size:1.3rem;font-weight:700;color:var(--monster-red);margin-top:8px;">${whole} × ${numer}/${denom} = ?/${denom}</div>`;
                        hint1 = `Multiply: ${whole} × ${numer} = ?`;
                        hint2 = `${whole} × ${numer} = ${answer}`;
                        hint3 = `The numerator is ${answer}`;
                        diagnoseFn = function(userAnswer) {
                            if (userAnswer === whole * denom) return 'multiplied-denominator';
                            if (userAnswer === whole + numer) return 'added-instead-of-multiplied';
                            return null;
                        };
                        misconceptionHints = {
                            'multiplied-denominator': `Don't multiply the denominator! Only multiply the numerator: ${whole} × ${numer} = ${answer}.`,
                            'added-instead-of-multiplied': `We need to multiply, not add! ${whole} × ${numer} = ${answer}, not ${whole} + ${numer} = ${whole + numer}.`
                        };
                    } else if (problemType === 2) {
                        // Fraction of a group
                        const denom = pick([2, 3, 4, 5]);
                        const total = denom * R(2, 3);
                        answer = total / denom;
                        questionText = `🐉 A dragon has ${total} treasure gems. It gives away 1/${denom} of them.<br>How many gems does it give away?`;
                        visual = `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;">
                            ${Array.from({length: total}, () => '<span style="font-size:1.3rem">💎</span>').join('')}
                        </div>`;
                        hint1 = `Find 1/${denom} of ${total}: divide by ${denom}`;
                        hint2 = `${total} ÷ ${denom} = ?`;
                        hint3 = `1/${denom} of ${total} = ${answer}`;
                        diagnoseFn = function(userAnswer) {
                            if (userAnswer === total) return 'gave-total-not-fraction';
                            if (userAnswer === total - answer) return 'found-complement';
                            return null;
                        };
                        misconceptionHints = {
                            'gave-total-not-fraction': `${total} is the total! We need 1/${denom} of it: ${total} ÷ ${denom} = ${answer}.`,
                            'found-complement': `That's how many the dragon KEEPS, not gives away! 1/${denom} of ${total} = ${answer}.`
                        };
                    } else {
                        // Repeated addition
                        const denom = pick([2, 3, 4]);
                        const numer = 1;
                        const whole = R(2, diff >= 2 ? 6 : 4);
                        answer = whole;
                        const addExpr = Array(whole).fill(`${numer}/${denom}`).join(' + ');
                        questionText = `🐉 ${whole} baby dragons each eat ${numer}/${denom} of a pie.<br>${addExpr} = ?/${denom}`;
                        visual = `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                            ${Array.from({length: whole}, () => '<span style="font-size:1.5rem">🐲</span>').join('')}
                        </div>`;
                        hint1 = `Add the numerators: ${Array(whole).fill(numer).join(' + ')} = ?`;
                        hint2 = `${whole} × ${numer} = ${answer}`;
                        hint3 = `The numerator is ${answer}`;
                        diagnoseFn = function(userAnswer) {
                            if (userAnswer === whole * denom) return 'added-denominators';
                            if (userAnswer === numer) return 'counted-one-fraction';
                            return null;
                        };
                        misconceptionHints = {
                            'added-denominators': `Don't add the denominators! The denominator stays ${denom}. Just add the numerators: ${Array(whole).fill(numer).join(' + ')} = ${answer}.`,
                            'counted-one-fraction': `That's just one fraction! You need to add all ${whole} of them: ${Array(whole).fill(numer).join(' + ')} = ${answer}.`
                        };
                    }

                    const result = {
                        type: 'input',
                        questionText,
                        visual,
                        answer,
                        hint1,
                        hint2,
                        hint3,
                        diagnose: diagnoseFn,
                        misconceptionHints
                    };

                    if (modality === 'worked-example') {
                        const weW = 3, weN = 2, weD = 4;
                        result.workedExample = `<div style="text-align:center">
                            <p><strong>Example:</strong> ${weW} × ${weN}/${weD} = ?</p>
                            <p>Multiply the numerator: ${weW} × ${weN} = ${weW * weN}</p>
                            <p>Keep the denominator: ${weD}</p>
                            <p>Answer: <strong>${weW * weN}/${weD}</strong> — numerator is <strong>${weW * weN}</strong></p>
                        </div>`;
                    }

                    if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="margin-top:12px;padding:10px;background:rgba(255,59,48,0.1);border:1px solid var(--monster-red);border-radius:10px;">
                            <p>🔥 Dragon Tip: When multiplying a fraction by a whole number, multiply only the numerator!</p>
                            <p>The denominator always stays the same.</p>
                        </div>`;
                    }

                    return result;
                }
            }
        ];
    }
};
