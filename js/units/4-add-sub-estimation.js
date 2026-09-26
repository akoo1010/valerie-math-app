/* ===== UNIT: ADD, SUB & ESTIMATION (4th Grade) — Dance Theme 🎵 ===== */

const AddSubEstimation4 = {
    id: '4-add-sub-estimation',
    title: 'Add, Sub & Estimation',
    icon: '🎵',
    theme: 'dance',
    description: "Add, subtract, and estimate to the beat! Multi-digit math with rhythm and style!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;
        const shuffle = Engine.Utils.shuffle;

        const PLACES = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten-thousands', 'Hundred-thousands', 'Millions'];
        // Column-by-column addition with carries, for every place (not just the first three).
        // The biggest column is left as "= ?" so finishing it and putting the digits together stays hers.
        const addColumns = (a, b) => {
            const rows = [];
            let carry = 0, i = 0;
            for (let p = 1; p <= Math.max(a, b); p *= 10, i++) {
                const da = Math.floor(a / p) % 10, db = Math.floor(b / p) % 10;
                const s = da + db + carry;
                const last = p * 10 > Math.max(a, b);
                rows.push(`<div>${PLACES[i]}: ${da} + ${db}${carry ? ' + 1' : ''} = ${last ? '?' : `${s}${s >= 10 ? ` → write ${s % 10}, carry 1` : ''}`}</div>`);
                carry = s >= 10 ? 1 : 0;
            }
            return rows.join('');
        };
        // Column-by-column subtraction with regrouping (a > b), for every place. Every column from the answer's
        // leading digit up is left as "= ?" — when a − b has fewer digits than a, a's top column is just 0.
        const subColumns = (a, b) => {
            const rows = [];
            let borrow = 0, i = 0;
            for (let p = 1; p <= a; p *= 10, i++) {
                const da = Math.floor(a / p) % 10, db = Math.floor(b / p) % 10;
                const top = da - borrow; // after lending 1 to the column on its right
                const regroup = top < db;
                const t = regroup ? top + 10 : top;
                const notes = [borrow ? 'lent 1' : '', regroup ? 'borrow!' : ''].filter(Boolean).join(', ');
                rows.push(`<div>${PLACES[i]}: ${notes ? `${da} → ${t} (${notes}), ` : ''}${t} − ${db} = ${p * 10 > a - b ? '?' : t - db}</div>`);
                borrow = regroup ? 1 : 0;
            }
            return rows.join('');
        };

        return [
            // 1. Multi-digit addition (up to 6-digit)
            {
                skillId: '4-add-sub-est-multidigit-add',
                generate(diff, modality) {
                    let a, b;
                    if (diff >= 3) {
                        a = R(100000, 999999);
                        b = R(100000, 999999);
                    } else if (diff >= 2) {
                        a = R(10000, 99999);
                        b = R(10000, 99999);
                    } else {
                        a = R(1000, 9999);
                        b = R(1000, 9999);
                    }
                    const answer = a + b;

                    const result = {
                        type: 'input',
                        questionText: `🎵 The DJ played ${Engine.Utils.fmt(a)} beats in the first set and ${Engine.Utils.fmt(b)} beats in the second set.<br>How many beats total?`,
                        visual: `<div style="font-family:var(--font-display); font-size:1.6rem; text-align:right; line-height:1.8; color:var(--dance-pink);">
                            <div>${Engine.Utils.fmt(a)}</div>
                            <div style="border-bottom:2px solid var(--dance-purple); padding-bottom:4px;">+ ${Engine.Utils.fmt(b)}</div>
                        </div>`,
                        answer,
                        hint1: `Line up the digits by place value. Start adding from the ones column 🎶`,
                        hint2: `Don't forget to carry! Ones → Tens → Hundreds → Thousands...`,
                        hint3: `${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(b)} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a - b || userAnswer === b - a) return 'subtracted-instead';
                            if (Math.abs(userAnswer - answer) === 10 || Math.abs(userAnswer - answer) === 100) return 'carry-error';
                            if (Math.abs(userAnswer - answer) === 1) return 'off-by-one';
                            return null;
                        },
                        misconceptionHints: {
                            'subtracted-instead': `Oops! We're adding the beats together, not subtracting. Try ${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(b)}.`,
                            'carry-error': `Almost! Check your carrying — when digits add to 10 or more, carry the 1 to the next column. 💃`,
                            'off-by-one': `So close! Double-check your ones column.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weA = R(1000, 3000), weB = R(1000, 3000);
                        const weOnes = (weA % 10) + (weB % 10);
                        const weCarry = weOnes >= 10 ? 1 : 0;
                        const weTens = Math.floor((weA % 100)/10) + Math.floor((weB % 100)/10) + weCarry;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${Engine.Utils.fmt(weA)} + ${Engine.Utils.fmt(weB)} = ?</p><p>Ones: ${weA % 10} + ${weB % 10} = ${weOnes}${weCarry ? ' (carry 1!)' : ''}</p><p>Tens: ${Math.floor((weA % 100)/10)} + ${Math.floor((weB % 100)/10)}${weCarry ? ' + 1' : ''} = ${weTens}${weTens >= 10 ? ' (carry 1!)' : ''}</p><p>Keep going column by column...</p><p>Answer: <strong>${Engine.Utils.fmt(weA + weB)}</strong> 🎵</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="color:var(--dance-cyan);"><p>🎶 Break it down by place value:</p>${addColumns(a, b)}<div>Finish the last column — it's the last one, so if it makes 10 or more, write both digits! Then put your digits together: <strong>Total: ?</strong> 💃</div></div>`;
                    }

                    return result;
                }
            },
            // 2. Multi-digit subtraction with regrouping
            {
                skillId: '4-add-sub-est-multidigit-sub',
                generate(diff, modality) {
                    let a, b;
                    if (diff >= 3) {
                        a = R(100000, 999999);
                        b = R(10000, a - 1);
                    } else if (diff >= 2) {
                        a = R(10000, 99999);
                        b = R(1000, a - 1);
                    } else {
                        a = R(1000, 9999);
                        b = R(100, a - 1);
                    }
                    const answer = a - b;

                    const result = {
                        type: 'input',
                        questionText: `🕺 A dance competition had ${Engine.Utils.fmt(a)} votes cast. ${Engine.Utils.fmt(b)} votes went to Team Groove.<br>How many votes did the other teams get?`,
                        visual: `<div style="font-family:var(--font-display); font-size:1.6rem; text-align:right; line-height:1.8; color:var(--dance-gold);">
                            <div>${Engine.Utils.fmt(a)}</div>
                            <div style="border-bottom:2px solid var(--dance-pink); padding-bottom:4px;">− ${Engine.Utils.fmt(b)}</div>
                        </div>`,
                        answer,
                        hint1: `Start from the ones column. If the top digit is smaller, you'll need to regroup (borrow)! 🎶`,
                        hint2: `Borrow from the next column when needed — subtract column by column.`,
                        hint3: `${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(b)} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a + b) return 'added-instead';
                            if (Math.abs(userAnswer - answer) === 10 || Math.abs(userAnswer - answer) === 100) return 'borrow-error';
                            return null;
                        },
                        misconceptionHints: {
                            'added-instead': `We're finding the difference, not the total! Subtract: ${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(b)}. 🎵`,
                            'borrow-error': `Close! Check your regrouping — did you borrow correctly from the next column? 💃`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weA = R(500, 1000), weB = R(100, 499);
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weA} − ${weB} = ?</p><p>Ones: ${weA % 10} − ${weB % 10}${(weA % 10) < (weB % 10) ? ' → borrow from tens!' : ` = ${(weA % 10) - (weB % 10)}`}</p><p>Work column by column, borrowing when needed.</p><p>Answer: <strong>${weA - weB}</strong> 🕺</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="color:var(--dance-purple); margin-top:8px;"><p>🕺 Break it down by place value:</p>${subColumns(a, b)}<div>Finish each ? column, then put your digits together: <strong>Difference: ?</strong> 💃</div></div>`;
                    }

                    return result;
                }
            },
            // 3. Estimate sums by rounding to nearest thousand
            {
                skillId: '4-add-sub-est-estimate-sum',
                generate(diff, modality) {
                    const roundTo = diff >= 2 ? 1000 : 100;
                    const a = R(1000, 9999);
                    const b = R(1000, 9999);
                    const estA = Math.round(a / roundTo) * roundTo;
                    const estB = Math.round(b / roundTo) * roundTo;
                    const answer = estA + estB;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🎤 Estimate the total audience! Round each number to the nearest ${Engine.Utils.fmt(roundTo)}, then add.<br>${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(b)} ≈ ?`,
                        // Rounded values only in visual modality — elsewhere the rounding is the skill being practiced
                        visual: `<div style="display:flex;gap:16px;justify-content:center;align-items:center;font-size:1.3rem;color:var(--dance-purple);">
                            <div style="text-align:center;"><span style="font-weight:700;">${Engine.Utils.fmt(a)}</span>${modality === 'visual' ? `<br><span style="font-size:0.8rem;">≈ ${Engine.Utils.fmt(estA)}</span>` : ''}</div>
                            <div style="font-size:1.8rem;color:var(--dance-pink);">+</div>
                            <div style="text-align:center;"><span style="font-weight:700;">${Engine.Utils.fmt(b)}</span>${modality === 'visual' ? `<br><span style="font-size:0.8rem;">≈ ${Engine.Utils.fmt(estB)}</span>` : ''}</div>
                        </div>`,
                        answer,
                        options: Engine.Utils.roundedMultipleChoice(answer, roundTo),
                        hint1: `Round ${Engine.Utils.fmt(a)} to the nearest ${Engine.Utils.fmt(roundTo)}: ${Engine.Utils.fmt(estA)} 🎵`,
                        hint2: `Round ${Engine.Utils.fmt(b)} to the nearest ${Engine.Utils.fmt(roundTo)}: ${Engine.Utils.fmt(estB)}. Now add!`,
                        hint3: `${Engine.Utils.fmt(estA)} + ${Engine.Utils.fmt(estB)} = ${Engine.Utils.fmt(answer)} 🌟`,
                        diagnose(userAnswer) {
                            if (userAnswer === a + b) return 'exact-not-estimate';
                            return null;
                        },
                        misconceptionHints: {
                            'exact-not-estimate': `Good math, but we want an estimate! Round each number to the nearest ${Engine.Utils.fmt(roundTo)} first, then add. 🎶`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weA = R(1000, 5000), weB = R(1000, 5000);
                        const weEstA = Math.round(weA / roundTo) * roundTo;
                        const weEstB = Math.round(weB / roundTo) * roundTo;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Estimate ${Engine.Utils.fmt(weA)} + ${Engine.Utils.fmt(weB)}</p><p>${Engine.Utils.fmt(weA)} ≈ ${Engine.Utils.fmt(weEstA)}</p><p>${Engine.Utils.fmt(weB)} ≈ ${Engine.Utils.fmt(weEstB)}</p><p>${Engine.Utils.fmt(weEstA)} + ${Engine.Utils.fmt(weEstB)} = <strong>${Engine.Utils.fmt(weEstA + weEstB)}</strong> 🎵</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="color:var(--dance-cyan); margin-top:8px;"><p>🎤 Round, then add:</p><div>${Engine.Utils.fmt(a)} ≈ <strong>${Engine.Utils.fmt(estA)}</strong></div><div>${Engine.Utils.fmt(b)} ≈ <strong>${Engine.Utils.fmt(estB)}</strong></div><div style="border-top:2px solid var(--dance-purple); margin-top:4px; padding-top:4px;">💃 ${Engine.Utils.fmt(estA)} + ${Engine.Utils.fmt(estB)} = <strong>?</strong></div></div>`;
                    }

                    return result;
                }
            },
            // 4. Estimate differences by rounding
            {
                skillId: '4-add-sub-est-estimate-diff',
                generate(diff, modality) {
                    const roundTo = diff >= 2 ? 1000 : 100;
                    const a = R(5000, 9999);
                    const b = R(1000, 4999);
                    const estA = Math.round(a / roundTo) * roundTo;
                    const estB = Math.round(b / roundTo) * roundTo;
                    const answer = estA - estB;

                    const result = {
                        type: 'multiple-choice',
                        questionText: `💃 Estimate the difference! Round each number to the nearest ${Engine.Utils.fmt(roundTo)}, then subtract.<br>${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(b)} ≈ ?`,
                        // Rounded values only in visual modality — elsewhere the rounding is the skill being practiced
                        visual: `<div style="display:flex;gap:16px;justify-content:center;align-items:center;font-size:1.3rem;color:var(--dance-gold);">
                            <div style="text-align:center;"><span style="font-weight:700;">${Engine.Utils.fmt(a)}</span>${modality === 'visual' ? `<br><span style="font-size:0.8rem;">≈ ${Engine.Utils.fmt(estA)}</span>` : ''}</div>
                            <div style="font-size:1.8rem;color:var(--dance-pink);">−</div>
                            <div style="text-align:center;"><span style="font-weight:700;">${Engine.Utils.fmt(b)}</span>${modality === 'visual' ? `<br><span style="font-size:0.8rem;">≈ ${Engine.Utils.fmt(estB)}</span>` : ''}</div>
                        </div>`,
                        answer,
                        options: Engine.Utils.roundedMultipleChoice(answer, roundTo),
                        hint1: `Round ${Engine.Utils.fmt(a)} → ${Engine.Utils.fmt(estA)} 🎶`,
                        hint2: `Round ${Engine.Utils.fmt(b)} → ${Engine.Utils.fmt(estB)}. Now subtract!`,
                        hint3: `${Engine.Utils.fmt(estA)} − ${Engine.Utils.fmt(estB)} = ${Engine.Utils.fmt(answer)} ✨`,
                        diagnose(userAnswer) {
                            if (userAnswer === a - b) return 'exact-not-estimate';
                            if (userAnswer === estA + estB) return 'added-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'exact-not-estimate': `Good subtraction, but we want an estimate! Round each number to the nearest ${Engine.Utils.fmt(roundTo)} first, then subtract. 🎶`,
                            'added-instead': `You rounded correctly but added instead of subtracting! Try ${Engine.Utils.fmt(estA)} − ${Engine.Utils.fmt(estB)}. 💃`
                        }
                    };

                    if (modality === 'worked-example') {
                        // weA ≥ 4,000 > weB (≤ 3,000) keeps the rounded example difference positive
                        const weA = R(4000, 7000), weB = R(1000, 3000);
                        const weEstA = Math.round(weA / roundTo) * roundTo;
                        const weEstB = Math.round(weB / roundTo) * roundTo;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Estimate ${Engine.Utils.fmt(weA)} − ${Engine.Utils.fmt(weB)}</p><p>${Engine.Utils.fmt(weA)} ≈ ${Engine.Utils.fmt(weEstA)}</p><p>${Engine.Utils.fmt(weB)} ≈ ${Engine.Utils.fmt(weEstB)}</p><p>${Engine.Utils.fmt(weEstA)} − ${Engine.Utils.fmt(weEstB)} = <strong>${Engine.Utils.fmt(weEstA - weEstB)}</strong> 💃</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="color:var(--dance-cyan); margin-top:8px;"><p>🎶 Round, then subtract:</p><div>${Engine.Utils.fmt(a)} ≈ <strong>${Engine.Utils.fmt(estA)}</strong></div><div>${Engine.Utils.fmt(b)} ≈ <strong>${Engine.Utils.fmt(estB)}</strong></div><div style="border-top:2px solid var(--dance-purple); margin-top:4px; padding-top:4px;">💃 ${Engine.Utils.fmt(estA)} − ${Engine.Utils.fmt(estB)} = <strong>?</strong></div></div>`;
                    }

                    return result;
                }
            },
            // 5. Addition/subtraction word problem (dance-themed)
            {
                skillId: '4-add-sub-est-word',
                generate(diff, modality) {
                    const isAdd = Math.random() < 0.5;
                    // Each scenario carries its own clue so the scaffold and wrong-operation hint only quote words it actually uses
                    const scenarios = isAdd ? [
                        { text: (a, b) => `🪩 On Friday night, ${Engine.Utils.fmt(a)} people came to the dance party. On Saturday, ${Engine.Utils.fmt(b)} more joined! How many dancers total?`,
                          cue: `"More joined" and "total" mean the groups are put together — that means add!` },
                        { text: (a, b) => `🎤 A singer sold ${Engine.Utils.fmt(a)} tickets for the first show and ${Engine.Utils.fmt(b)} for the encore. How many tickets in all?`,
                          cue: `"In all" means both shows are put together — that means add!` },
                        { text: (a, b) => `💃 The dance studio had ${Engine.Utils.fmt(a)} students last year and enrolled ${Engine.Utils.fmt(b)} new dancers this year. How many total?`,
                          cue: `New dancers "enrolled" and the question asks for the "total" — that means add!` }
                    ] : [
                        { text: (a, b) => `🕺 There were ${Engine.Utils.fmt(a)} people at the dance-off. ${Engine.Utils.fmt(b)} left after the first round. How many stayed?`,
                          cue: `Some people "left" — take them away to find how many stayed. That means subtract!` },
                        { text: (a, b) => `🎵 A playlist had ${Engine.Utils.fmt(a)} songs. The DJ removed ${Engine.Utils.fmt(b)} slow songs. How many are left?`,
                          cue: `"Removed" and "left" mean take away — that means subtract!` },
                        { text: (a, b) => `🪩 The disco ball lit up ${Engine.Utils.fmt(a)} times. ${Engine.Utils.fmt(b)} were during warm-up. How many were during the show?`,
                          cue: `You know the total and the warm-up part — take the warm-up part away to find the show part. That means subtract!` }
                    ];
                    const scenario = pick(scenarios);
                    const a = diff >= 2 ? R(10000, 50000) : R(1000, 9999);
                    const b = diff >= 2 ? R(5000, a - 1) : R(500, a - 1);
                    const answer = isAdd ? a + b : a - b;

                    const result = {
                        type: 'input',
                        questionText: scenario.text(a, b),
                        visual: `<div style="font-size:3rem;">${isAdd ? '🪩 ➕ 💃' : '🪩 ➖ 🕺'}</div>`,
                        answer,
                        hint1: `Read the problem carefully — is this addition or subtraction? ${isAdd ? '➕' : '➖'}`,
                        hint2: `${Engine.Utils.fmt(a)} ${isAdd ? '+' : '−'} ${Engine.Utils.fmt(b)} = ? 🎶`,
                        hint3: `${Engine.Utils.fmt(a)} ${isAdd ? '+' : '−'} ${Engine.Utils.fmt(b)} = ${Engine.Utils.fmt(answer)} 🌟`,
                        diagnose(userAnswer) {
                            const wrongOp = isAdd ? a - b : a + b;
                            if (userAnswer === wrongOp) return 'wrong-operation';
                            return null;
                        },
                        misconceptionHints: {
                            'wrong-operation': isAdd
                                ? `${scenario.cue} Try ${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(b)}. 🎵`
                                : `${scenario.cue} Try ${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(b)}. 💃`
                        }
                    };

                    if (modality === 'worked-example') {
                        // weA ≥ 250 > weB (≤ 200) so the subtraction example never goes negative
                        const weA = R(250, 500), weB = R(50, 200);
                        const weAns = isAdd ? weA + weB : weA - weB;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${isAdd ? `${weA} people + ${weB} more` : `${weA} songs − ${weB} removed`}</p><p>${weA} ${isAdd ? '+' : '−'} ${weB} = <strong>${weAns}</strong> 🎵</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="color:var(--dance-gold); margin-top:8px;"><p>${isAdd ? '💃 This is an addition situation:' : '🕺 This is a subtraction situation:'}</p><div style="font-size:1.2rem;">${Engine.Utils.fmt(a)} ${isAdd ? '+' : '−'} ${Engine.Utils.fmt(b)} = ❓</div><div style="margin-top:4px;">🎵 ${scenario.cue}</div></div>`;
                    }

                    return result;
                }
            },
            // 6. Find the missing number (a + ? = c  or  a - ? = c)
            {
                skillId: '4-add-sub-est-missing',
                generate(diff, modality) {
                    const isAdd = Math.random() < 0.5;
                    const a = diff >= 2 ? R(10000, 50000) : R(1000, 5000);
                    const missingMin = diff >= 2 ? 5000 : 500;
                    const missingMax = diff >= 2 ? 20000 : 2000;
                    // Constrain missing < a when subtracting so c stays non-negative
                    const missing = isAdd
                        ? R(missingMin, missingMax)
                        : R(missingMin, Math.min(missingMax, a - 1));
                    const c = isAdd ? a + missing : a - missing;
                    const answer = missing;

                    const result = {
                        type: 'input',
                        questionText: isAdd
                            ? `🎶 Find the missing beat!<br>${Engine.Utils.fmt(a)} + ? = ${Engine.Utils.fmt(c)}`
                            : `🎶 Find the missing beat!<br>${Engine.Utils.fmt(a)} − ? = ${Engine.Utils.fmt(c)}`,
                        visual: `<div style="font-size:2rem; color:var(--dance-cyan);">
                            <span>${Engine.Utils.fmt(a)}</span>
                            <span style="color:var(--dance-pink);"> ${isAdd ? '+' : '−'} </span>
                            <span style="color:var(--dance-gold); font-size:2.5rem;">❓</span>
                            <span style="color:var(--dance-pink);"> = </span>
                            <span>${Engine.Utils.fmt(c)}</span>
                        </div>`,
                        answer,
                        hint1: isAdd
                            ? `To find the missing addend, subtract! ${Engine.Utils.fmt(c)} − ${Engine.Utils.fmt(a)} = ? 🎵`
                            : `To find what was subtracted, subtract the result from the start! ${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(c)} = ? 🎵`,
                        hint2: isAdd
                            ? `${Engine.Utils.fmt(c)} − ${Engine.Utils.fmt(a)} = ?`
                            : `${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(c)} = ?`,
                        hint3: `The missing number is ${Engine.Utils.fmt(answer)} 💃`,
                        diagnose(userAnswer) {
                            // User added when they should have subtracted (or vice versa)
                            if (isAdd && userAnswer === a + c) return 'wrong-operation';
                            if (!isAdd && userAnswer === a + c) return 'wrong-operation';
                            if (userAnswer === c) return 'picked-total';
                            if (userAnswer === a) return 'picked-start';
                            return null;
                        },
                        misconceptionHints: {
                            'wrong-operation': isAdd
                                ? `You added ${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(c)}, but we need to subtract to find the missing part! Try ${Engine.Utils.fmt(c)} − ${Engine.Utils.fmt(a)}. 🎵`
                                : `Use subtraction to find the missing number! Try ${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(c)}. 🎵`,
                            'picked-total': `That's the ${isAdd ? 'total' : 'result after subtracting'}, not the missing number. Use inverse operations to find what's missing! 💃`,
                            'picked-start': `That's the starting number, not the missing one. Think about what operation undoes ${isAdd ? 'addition' : 'subtraction'}. 🎶`
                        }
                    };

                    if (modality === 'worked-example') {
                        // weA ≥ 250 > weMissing (≤ 200) so the subtraction example never goes negative
                        const weA = R(250, 500), weMissing = R(50, 200);
                        const weC = isAdd ? weA + weMissing : weA - weMissing;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weA} ${isAdd ? '+' : '−'} ? = ${weC}</p><p>To find the missing number, use the inverse operation:</p><p>${isAdd ? `${weC} − ${weA}` : `${weA} − ${weC}`} = <strong>${weMissing}</strong> 🎶</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual += `<div class="visual-scaffold" style="color:var(--dance-gold); margin-top:8px;"><p>💃 Use the inverse operation:</p><div style="font-size:1.2rem;">${isAdd ? `${Engine.Utils.fmt(c)} − ${Engine.Utils.fmt(a)} = ❓` : `${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(c)} = ❓`}</div><div style="margin-top:4px;">🎵 Think: what number makes the equation balance?</div></div>`;
                    }

                    return result;
                }
            },
            // 7. Dance-off calculation challenge — mixed
            {
                skillId: '4-add-sub-est-danceoff',
                generate(diff, modality) {
                    const ops = pick(['add', 'sub', 'estimate-add', 'estimate-sub']);
                    let result;
                    if (ops === 'add') {
                        const a = diff >= 2 ? R(10000, 99999) : R(1000, 9999);
                        const b = diff >= 2 ? R(10000, 99999) : R(1000, 9999);
                        const answer = a + b;
                        result = {
                            type: 'input',
                            questionText: `🪩 DANCE-OFF ROUND! Solve fast!<br>${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(b)} = ?`,
                            visual: `<div style="font-size:2.5rem; animation: bounce 0.6s ease-in-out infinite; color:var(--dance-gold);">💃🕺</div>`,
                            answer,
                            hint1: `Add column by column, starting from the right! 🎵`,
                            hint2: `${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(b)}: remember to carry!`,
                            hint3: `${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(b)} = ${Engine.Utils.fmt(answer)} ✨`,
                            diagnose(userAnswer) {
                                if (userAnswer === a - b || userAnswer === b - a) return 'subtracted-instead';
                                if (Math.abs(userAnswer - answer) === 10 || Math.abs(userAnswer - answer) === 100) return 'carry-error';
                                return null;
                            },
                            misconceptionHints: {
                                'subtracted-instead': `This is addition, not subtraction! Try ${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(b)}. 🎵`,
                                'carry-error': `Almost! Check your carrying — when digits add to 10+, carry the 1 to the next column. 💃`
                            }
                        };
                        if (modality === 'worked-example') {
                            const weA = R(1000, 3000), weB = R(1000, 3000);
                            result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${Engine.Utils.fmt(weA)} + ${Engine.Utils.fmt(weB)} = ?</p><p>Add column by column from the right, carrying when needed.</p><p>Answer: <strong>${Engine.Utils.fmt(weA + weB)}</strong> 🪩</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="color:var(--dance-cyan); margin-top:8px;"><p>🎶 Break it down by place value:</p>${addColumns(a, b)}<div>Finish the last column — it's the last one, so if it makes 10 or more, write both digits! Then put your digits together: <strong>Total: ?</strong> 💃</div></div>`;
                        }
                    } else if (ops === 'sub') {
                        const a = diff >= 2 ? R(50000, 99999) : R(5000, 9999);
                        const b = diff >= 2 ? R(10000, a - 1) : R(1000, a - 1);
                        const answer = a - b;
                        result = {
                            type: 'input',
                            questionText: `🪩 DANCE-OFF ROUND! Solve fast!<br>${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(b)} = ?`,
                            visual: `<div style="font-size:2.5rem; animation: bounce 0.6s ease-in-out infinite; color:var(--dance-pink);">🕺💃</div>`,
                            answer,
                            hint1: `Subtract column by column. Regroup if the top digit is smaller! 🎶`,
                            hint2: `${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(b)}: watch your borrowing!`,
                            hint3: `${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(b)} = ${Engine.Utils.fmt(answer)} 🌟`,
                            diagnose(userAnswer) {
                                if (userAnswer === a + b) return 'added-instead';
                                if (Math.abs(userAnswer - answer) === 10 || Math.abs(userAnswer - answer) === 100) return 'borrow-error';
                                return null;
                            },
                            misconceptionHints: {
                                'added-instead': `This is subtraction, not addition! Try ${Engine.Utils.fmt(a)} − ${Engine.Utils.fmt(b)}. 🎶`,
                                'borrow-error': `Close! Double-check your regrouping — did you borrow correctly? 🕺`
                            }
                        };
                        if (modality === 'worked-example') {
                            const weA = R(3000, 5000), weB = R(1000, 2999);
                            result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${Engine.Utils.fmt(weA)} − ${Engine.Utils.fmt(weB)} = ?</p><p>Subtract column by column, borrowing when the top digit is smaller.</p><p>Answer: <strong>${Engine.Utils.fmt(weA - weB)}</strong> 🪩</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="color:var(--dance-purple); margin-top:8px;"><p>🕺 Break it down by place value:</p>${subColumns(a, b)}<div>Finish each ? column, then put your digits together: <strong>Difference: ?</strong> 💃</div></div>`;
                        }
                    } else {
                        const a = R(1000, 9999);
                        const b = R(1000, 9999);
                        const estA = Math.round(a / 1000) * 1000;
                        const estB = Math.round(b / 1000) * 1000;
                        const isAdd = ops === 'estimate-add';
                        const answer = isAdd ? estA + estB : Math.max(estA, estB) - Math.min(estA, estB);
                        const big = Math.max(a, b), small = Math.min(a, b);
                        const bigEst = Math.max(estA, estB), smallEst = Math.min(estA, estB);
                        result = {
                            type: 'multiple-choice',
                            questionText: `🪩 DANCE-OFF ROUND! Estimate by rounding to the nearest 1,000!<br>${isAdd ? `${Engine.Utils.fmt(a)} + ${Engine.Utils.fmt(b)}` : `${Engine.Utils.fmt(big)} − ${Engine.Utils.fmt(small)}`} ≈ ?`,
                            visual: `<div style="font-size:2.5rem; animation: bounce 0.6s ease-in-out infinite; color:var(--dance-purple);">🎤✨</div>`,
                            answer,
                            options: Engine.Utils.roundedMultipleChoice(answer, 1000),
                            hint1: `Round each number to the nearest 1,000 first! 🎵`,
                            hint2: isAdd
                                ? `${Engine.Utils.fmt(a)} ≈ ${Engine.Utils.fmt(estA)}, ${Engine.Utils.fmt(b)} ≈ ${Engine.Utils.fmt(estB)}`
                                : `${Engine.Utils.fmt(big)} ≈ ${Engine.Utils.fmt(bigEst)}, ${Engine.Utils.fmt(small)} ≈ ${Engine.Utils.fmt(smallEst)}`,
                            hint3: `The estimate is ${Engine.Utils.fmt(answer)} 💃`,
                            diagnose(userAnswer) {
                                if (isAdd && userAnswer === a + b) return 'exact-not-estimate';
                                if (!isAdd && userAnswer === big - small) return 'exact-not-estimate';
                                if (isAdd && userAnswer === estA - estB) return 'wrong-operation';
                                if (!isAdd && userAnswer === estA + estB) return 'wrong-operation';
                                return null;
                            },
                            misconceptionHints: {
                                'exact-not-estimate': `That's the exact answer, but we need an estimate! Round to the nearest 1,000 first. 🎤`,
                                'wrong-operation': isAdd
                                    ? `You subtracted instead of adding! Try ${Engine.Utils.fmt(estA)} + ${Engine.Utils.fmt(estB)}. ✨`
                                    : `You added instead of subtracting! Try ${Engine.Utils.fmt(bigEst)} − ${Engine.Utils.fmt(smallEst)}. ✨`
                            }
                        };
                        if (modality === 'worked-example') {
                            let weA = R(1000, 5000), weB = R(1000, 5000);
                            // Subtract the smaller from the larger (rounding keeps the order), so the shown math is true
                            if (!isAdd && weA < weB) [weA, weB] = [weB, weA];
                            const weEstA = Math.round(weA / 1000) * 1000;
                            const weEstB = Math.round(weB / 1000) * 1000;
                            const weAns = isAdd ? weEstA + weEstB : weEstA - weEstB;
                            result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Estimate ${Engine.Utils.fmt(weA)} ${isAdd ? '+' : '−'} ${Engine.Utils.fmt(weB)}</p><p>${Engine.Utils.fmt(weA)} ≈ ${Engine.Utils.fmt(weEstA)}, ${Engine.Utils.fmt(weB)} ≈ ${Engine.Utils.fmt(weEstB)}</p><p>${Engine.Utils.fmt(weEstA)} ${isAdd ? '+' : '−'} ${Engine.Utils.fmt(weEstB)} = <strong>${Engine.Utils.fmt(weAns)}</strong> 🪩</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual += `<div class="visual-scaffold" style="color:var(--dance-gold); margin-top:8px;"><p>🎤 Round to the nearest 1,000, then ${isAdd ? 'add' : 'subtract'}:</p><div>${isAdd ? Engine.Utils.fmt(a) : Engine.Utils.fmt(big)} ≈ <strong>${isAdd ? Engine.Utils.fmt(estA) : Engine.Utils.fmt(bigEst)}</strong></div><div>${isAdd ? Engine.Utils.fmt(b) : Engine.Utils.fmt(small)} ≈ <strong>${isAdd ? Engine.Utils.fmt(estB) : Engine.Utils.fmt(smallEst)}</strong></div><div style="border-top:2px solid var(--dance-pink); margin-top:4px; padding-top:4px;">✨ ${isAdd ? `${Engine.Utils.fmt(estA)} + ${Engine.Utils.fmt(estB)}` : `${Engine.Utils.fmt(bigEst)} − ${Engine.Utils.fmt(smallEst)}`} = <strong>?</strong></div></div>`;
                        }
                    }
                    return result;
                }
            }
        ];
    }
};
