/* ===== UNIT: DIVISION (4th Grade) — Monster Theme 🛡️ ===== */

const Division4 = {
    id: '4-division',
    title: 'Division',
    icon: '🛡️',
    theme: 'monster',
    description: "Divide and conquer! Master long division with remainders in the monster arena!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Divide 2-digit by 1-digit (no remainder)
            {
                skillId: '4div-basic',
                generate(diff, modality) {
                    const b = R(2, diff >= 2 ? 9 : 5);
                    const quotient = R(diff >= 2 ? 10 : 5, diff >= 2 ? 30 : 15);
                    const a = b * quotient;
                    const answer = quotient;

                    const result = {
                        type: 'input',
                        questionText: `🛡️ Split ${a} monster gems equally among ${b} warriors!<br>How many gems does each warrior get?`,
                        visual: `<div style="text-align:center;color:var(--monster-blue);font-size:1.6rem;font-weight:700;">
                            ${a} ÷ ${b} = ?
                        </div>`,
                        answer,
                        hint1: `How many times does ${b} go into ${a}?`,
                        hint2: `${b} × ? = ${a}`,
                        hint3: `${a} ÷ ${b} = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a * b) return 'multiplied-instead';
                            if (userAnswer === a - b) return 'subtracted-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'multiplied-instead': `We're dividing, not multiplying! ${a} ÷ ${b} means splitting ${a} into ${b} equal groups.`,
                            'subtracted-instead': `Division means equal sharing, not subtracting! How many groups of ${b} fit in ${a}?`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 84 ÷ 4 = ?</p><p>4 goes into 8 → 2 times (8 ÷ 4 = 2)</p><p>4 goes into 4 → 1 time</p><p>Answer: <strong>21</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        const gemRows = [];
                        for (let i = 0; i < b; i++) {
                            gemRows.push(`<div style="margin:2px 0;"><span style="color:var(--monster-blue);font-size:1rem;">Warrior ${i + 1}:</span> ${'💎'.repeat(Math.min(answer, 12))}${answer > 12 ? ` ×${answer}` : ''}</div>`);
                        }
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.4rem;font-weight:700;color:var(--monster-blue);margin-bottom:8px;">🐲 ${a} ÷ ${b} = ?</div>
                            <div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:8px;">Split ${a} gems equally among ${b} warriors:</div>
                            <div style="display:inline-block;text-align:left;background:rgba(0,150,255,0.08);padding:8px 14px;border-radius:8px;">
                                ${gemRows.join('')}
                            </div>
                            <div style="margin-top:8px;font-size:0.95rem;color:var(--monster-blue);">⚡ Each warrior gets <strong>${answer}</strong> gems!</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Divide with remainder
            {
                skillId: '4div-remainder',
                generate(diff, modality) {
                    const b = R(2, diff >= 2 ? 9 : 5);
                    const quotient = R(5, diff >= 2 ? 50 : 20);
                    const remainder = R(1, b - 1);
                    const a = b * quotient + remainder;
                    const answer = quotient;

                    const result = {
                        type: 'input',
                        questionText: `🐲 You have ${a} potions to share equally among ${b} dragons.<br>How many potions does each dragon get? (Ignore the remainder)`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:1.6rem;font-weight:700;color:var(--monster-red);">${a} ÷ ${b} = ? R ${remainder}</div>
                            <div style="margin-top:6px;font-size:0.9rem;color:var(--text-muted);">Just enter the quotient (whole number part)</div>
                        </div>`,
                        answer,
                        hint1: `What's the biggest multiple of ${b} that fits in ${a}?`,
                        hint2: `${b} × ${quotient} = ${b * quotient}, with ${remainder} left over`,
                        hint3: `${a} ÷ ${b} = ${quotient} remainder ${remainder}`,
                        diagnose(userAnswer) {
                            if (userAnswer === remainder) return 'gave-remainder';
                            if (userAnswer === quotient + 1) return 'rounded-up';
                            return null;
                        },
                        misconceptionHints: {
                            'gave-remainder': `${remainder} is the remainder, not the quotient! The quotient is how many each dragon gets.`,
                            'rounded-up': `Don't round up! We want the whole number of potions each dragon gets, ignoring leftovers.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 29 ÷ 4 = ?</p><p>4 × 7 = 28 ✓ (28 ≤ 29)</p><p>4 × 8 = 32 ✗ (too big!)</p><p>29 - 28 = 1 remainder</p><p>Answer: <strong>7</strong> R 1</p></div>`;
                    }

                    if (modality === 'visual') {
                        const dragonGroups = [];
                        for (let i = 0; i < b; i++) {
                            dragonGroups.push(`<div style="display:inline-block;margin:3px;padding:4px 8px;background:rgba(220,50,50,0.1);border-radius:6px;font-size:0.95rem;">🐲 ${'🧪'.repeat(Math.min(quotient, 8))}${quotient > 8 ? ` ×${quotient}` : ''}</div>`);
                        }
                        const remainderPotions = '🧪'.repeat(remainder);
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.3rem;font-weight:700;color:var(--monster-red);margin-bottom:6px;">🔥 ${a} ÷ ${b}</div>
                            <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">${b} dragon${b > 1 ? 's' : ''}, each gets ${quotient} potion${quotient !== 1 ? 's' : ''}:</div>
                            <div>${dragonGroups.join('')}</div>
                            <div style="margin-top:8px;padding:4px 10px;background:rgba(255,200,0,0.15);border-radius:6px;display:inline-block;">
                                <span style="font-size:0.9rem;color:var(--monster-yellow);">👾 Leftover: ${remainderPotions} (${remainder} remainder)</span>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Interpret remainders (word problem)
            {
                skillId: '4div-interpret-remainder',
                generate(diff, modality) {
                    const b = pick([3, 4, 5, 6, 7, 8]);
                    const quotient = R(3, diff >= 2 ? 15 : 8);
                    const remainder = R(1, b - 1);
                    const a = b * quotient + remainder;

                    // Sometimes the answer needs rounding up (need extra group)
                    const needExtra = Math.random() < 0.5;
                    let questionText, answer;

                    if (needExtra) {
                        questionText = `⚡ ${a} monsters need boats. Each boat holds ${b} monsters.<br>How many boats do we need so NO monster is left behind?`;
                        answer = quotient + 1;
                    } else {
                        questionText = `🐾 A trainer has ${a} treats to put in bags of ${b}.<br>How many FULL bags can the trainer make?`;
                        answer = quotient;
                    }

                    const result = {
                        type: 'input',
                        questionText,
                        visual: `<div style="font-size:2rem;text-align:center;">${needExtra ? '⛵🐲' : '🎒🐾'}</div>`,
                        answer,
                        hint1: `${a} ÷ ${b} = ${quotient} remainder ${remainder}`,
                        hint2: needExtra ? `We need an extra boat for the ${remainder} leftover monster(s)!` : `Only count the FULL bags — the ${remainder} leftover treats don't make a full bag.`,
                        hint3: `The answer is ${answer}`,
                        diagnose(userAnswer) {
                            if (needExtra && userAnswer === quotient) return 'forgot-extra';
                            if (!needExtra && userAnswer === quotient + 1) return 'rounded-up-wrong';
                            if (userAnswer === remainder) return 'gave-remainder';
                            return null;
                        },
                        // Only the current scenario's hints — a boats hint on a bags question (or vice versa) states the wrong answer
                        misconceptionHints: needExtra ? {
                            'forgot-extra': `You found the quotient (${quotient}), but ${remainder} monster(s) would be left without a boat! You need one more boat.`,
                            'gave-remainder': `${remainder} is the remainder, not the answer! Think about what the question is really asking.`
                        } : {
                            'rounded-up-wrong': `We only want FULL bags. The ${remainder} leftover treats don't fill a bag, so the answer is ${quotient}, not ${quotient + 1}.`,
                            'gave-remainder': `${remainder} is the remainder, not the answer! Think about what the question is really asking.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = needExtra
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 23 monsters, boats hold 5</p><p>23 ÷ 5 = 4 R 3</p><p>4 boats hold 20 monsters, but 3 are left!</p><p>We need 1 more boat → <strong>5 boats</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 23 treats, bags of 5</p><p>23 ÷ 5 = 4 R 3</p><p>4 full bags (the 3 leftover don't count)</p><p>Answer: <strong>4</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        const boatIcons = Array(quotient).fill(needExtra ? '⛵' + '🐲'.repeat(b) : '🎒').join(' ');
                        const extraIcon = needExtra ? ` ⛵${'🐲'.repeat(remainder)}` : ` + ${'🐾'.repeat(remainder)} leftover`;
                        result.visual = `<div style="text-align:center;font-size:1.2rem;">
                            <div style="margin-bottom:8px;font-weight:700;color:var(--monster-blue);">${a} ÷ ${b} = ${quotient} R ${remainder}</div>
                            <div style="word-wrap:break-word;">${boatIcons}${extraIcon}</div>
                            <div style="margin-top:8px;font-size:0.9rem;color:var(--text-muted);">${needExtra ? 'Do the leftovers need their own group?' : 'Only count the FULL groups!'}</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Long division: 3-digit ÷ 1-digit
            {
                skillId: '4div-long',
                generate(diff, modality) {
                    const b = R(2, diff >= 2 ? 9 : 5);
                    const quotient = R(20, diff >= 2 ? 200 : 100);
                    const a = b * quotient;
                    const answer = quotient;

                    const result = {
                        type: 'input',
                        questionText: `🦖 Monster math! What is ${Engine.Utils.fmt(a)} ÷ ${b}?`,
                        visual: `<div style="text-align:center;font-family:var(--font-display);color:var(--monster-green);font-size:1.4rem;">
                            <div style="border-bottom:2px solid var(--monster-green);display:inline-block;padding:4px 12px;">
                                ${b} ) ${Engine.Utils.fmt(a)}
                            </div>
                        </div>`,
                        answer,
                        hint1: `Start from the leftmost digit of ${Engine.Utils.fmt(a)}. How many times does ${b} go into it?`,
                        hint2: `Work digit by digit: divide, multiply, subtract, bring down`,
                        hint3: `${Engine.Utils.fmt(a)} ÷ ${b} = ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a * b) return 'multiplied-instead';
                            if (Math.abs(userAnswer - answer) <= 2 && userAnswer !== answer) return 'carry-error';
                            if (userAnswer === a - b) return 'subtracted-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'multiplied-instead': `We're dividing, not multiplying! ${Engine.Utils.fmt(a)} ÷ ${b} means splitting ${Engine.Utils.fmt(a)} into ${b} groups.`,
                            'carry-error': `Almost! Double-check your long division steps — you may have a carry or subtraction error. Verify: ${b} × ${Engine.Utils.fmt(answer)} = ${Engine.Utils.fmt(a)}.`,
                            'subtracted-instead': `That's ${Engine.Utils.fmt(a)} minus ${b}, not divided! Use long division: divide, multiply, subtract, bring down.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 156 ÷ 3</p><p>3 into 1 → 0, bring down 5 → 3 into 15 → 5</p><p>3 into 6 → 2</p><p>Answer: <strong>52</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        const aStr = Engine.Utils.fmt(a);
                        const ansStr = Engine.Utils.fmt(answer);
                        const steps = [];
                        const digits = String(a).split('');
                        let runningDividend = 0;
                        for (let i = 0; i < digits.length; i++) {
                            runningDividend = runningDividend * 10 + parseInt(digits[i]);
                            const q = Math.floor(runningDividend / b);
                            const prod = q * b;
                            const rem = runningDividend - prod;
                            steps.push(`<div style="font-size:0.85rem;color:var(--text-muted);margin:2px 0;">
                                <span style="color:var(--monster-green);font-weight:600;">${b}</span> into <span style="color:var(--monster-blue);font-weight:600;">${runningDividend}</span>
                                → <span style="color:var(--monster-yellow);font-weight:700;">${q}</span>
                                &nbsp;(${b}×${q}=${prod}, remainder ${rem})
                            </div>`);
                            runningDividend = rem;
                        }
                        result.visual = `<div style="text-align:center;">
                            <div style="font-family:var(--font-display);font-size:1.4rem;font-weight:700;color:var(--monster-green);margin-bottom:8px;">🦖 Long Division: ${aStr} ÷ ${b}</div>
                            <div style="display:inline-block;text-align:left;background:rgba(0,200,100,0.08);padding:8px 14px;border-radius:8px;margin-bottom:8px;">
                                ${steps.join('')}
                            </div>
                            <div style="font-size:1rem;color:var(--monster-green);">⚡ Answer: <strong>${ansStr}</strong></div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Division facts & patterns (divide by 10, 100)
            {
                skillId: '4div-patterns',
                generate(diff, modality) {
                    const divisor = pick(diff >= 2 ? [10, 100] : [10]);
                    const quotient = R(1, diff >= 2 ? 99 : 50);
                    const a = quotient * divisor;
                    const answer = quotient;

                    const result = {
                        type: 'input',
                        questionText: `🗡️ Quick slash! What is ${Engine.Utils.fmt(a)} ÷ ${divisor}?`,
                        visual: `<div style="text-align:center;font-size:1.6rem;font-weight:700;color:var(--monster-yellow);">
                            ${Engine.Utils.fmt(a)} ÷ ${divisor} = ?
                        </div>`,
                        answer,
                        hint1: `Dividing by ${divisor} removes ${divisor === 10 ? 'one zero' : 'two zeros'} from the end!`,
                        hint2: `${Engine.Utils.fmt(a)} → move the decimal point ${divisor === 10 ? '1' : '2'} place(s) left`,
                        hint3: `${Engine.Utils.fmt(a)} ÷ ${divisor} = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a * divisor) return 'multiplied-instead';
                            if (divisor === 10 && userAnswer === a / 100) return 'extra-zero-removed';
                            if (divisor === 100 && userAnswer === a / 10) return 'one-zero-removed';
                            return null;
                        },
                        misconceptionHints: {
                            'multiplied-instead': `You multiplied instead of dividing! Dividing by ${divisor} makes the number smaller, not bigger.`,
                            'extra-zero-removed': `You removed two zeros, but dividing by 10 only removes one! ${Engine.Utils.fmt(a)} ÷ 10 = ${answer}.`,
                            'one-zero-removed': `You only removed one zero, but dividing by 100 removes two! ${Engine.Utils.fmt(a)} ÷ 100 = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = divisor === 10
                            ? `<div style="text-align:center"><p><strong>Example:</strong> 340 ÷ 10 = ?</p><p>Dividing by 10 → remove one zero from the end</p><p>34<s>0</s> → <strong>34</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> 5,600 ÷ 100 = ?</p><p>Dividing by 100 → remove two zeros from the end</p><p>56<s>00</s> → <strong>56</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        const zerosToRemove = divisor === 10 ? 1 : 2;
                        const aStr = String(a);
                        const kept = aStr.slice(0, aStr.length - zerosToRemove);
                        const removed = aStr.slice(aStr.length - zerosToRemove);
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.4rem;font-weight:700;color:var(--monster-yellow);margin-bottom:8px;">÷ ${divisor} = chop ${zerosToRemove === 1 ? 'one zero' : 'two zeros'}!</div>
                            <div style="font-size:2rem;font-family:var(--font-display);">
                                <span style="color:var(--monster-green);">${kept}</span><span style="text-decoration:line-through;color:var(--monster-red);opacity:0.5;">${removed}</span>
                                <span style="margin:0 8px;">→</span>
                                <span style="color:var(--monster-green);font-weight:800;">?</span>
                            </div>
                            <div style="margin-top:8px;font-size:0.9rem;color:var(--text-muted);">🗡️ Slash the zero${zerosToRemove > 1 ? 's' : ''} off!</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Relationship between multiplication and division
            {
                skillId: '4div-inverse',
                generate(diff, modality) {
                    const a = R(2, 9);
                    const b = R(2, diff >= 2 ? 12 : 9);
                    const product = a * b;
                    // Ask: if a × b = product, what is product ÷ a?
                    const askWhich = pick(['a', 'b']);
                    const divisor = askWhich === 'a' ? a : b;
                    const answer = askWhich === 'a' ? b : a;

                    const result = {
                        type: 'input',
                        questionText: `🐲 If ${a} × ${b} = ${product}, what is ${product} ÷ ${divisor}?`,
                        visual: `<div style="text-align:center;color:var(--monster-purple);">
                            <div style="font-size:1.3rem;font-weight:700;">${a} × ${b} = ${product}</div>
                            <div style="font-size:1.6rem;font-weight:800;margin-top:8px;color:var(--monster-red);">${product} ÷ ${divisor} = ?</div>
                        </div>`,
                        answer,
                        hint1: `Division is the opposite of multiplication!`,
                        hint2: `If ${a} × ${b} = ${product}, then ${product} ÷ ${divisor} = the other number`,
                        hint3: `${product} ÷ ${divisor} = ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === product) return 'gave-product';
                            if (userAnswer === divisor) return 'gave-divisor';
                            if (userAnswer === a * b * divisor) return 'multiplied-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'gave-product': `${product} is the product (the result of multiplying). We need to divide it! ${product} ÷ ${divisor} = the other factor.`,
                            'gave-divisor': `${divisor} is the divisor, not the answer! Look at the multiplication fact: ${a} × ${b} = ${product}. The OTHER number is the answer.`,
                            'multiplied-instead': `You multiplied again! We need to go backwards: ${product} ÷ ${divisor} = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> If 6 × 8 = 48, what is 48 ÷ 6?</p><p>Multiplication and division are inverse operations!</p><p>6 × <strong>8</strong> = 48, so 48 ÷ 6 = <strong>8</strong></p><p>The answer is always the "other factor."</p></div>`;
                    }

                    if (modality === 'visual') {
                        const knownFactor = divisor;
                        const unknownFactor = answer;
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1rem;color:var(--text-muted);margin-bottom:6px;">🐲 Fact family triangle:</div>
                            <div style="display:inline-block;padding:10px 20px;background:rgba(150,50,200,0.08);border-radius:10px;border:2px solid rgba(150,50,200,0.2);">
                                <div style="font-size:1.8rem;font-weight:800;color:var(--monster-purple);">${product}</div>
                                <div style="font-size:0.8rem;color:var(--text-muted);margin:4px 0;">▲</div>
                                <div style="font-size:1.2rem;font-weight:700;">
                                    <span style="color:var(--monster-blue);">${a}</span>
                                    <span style="color:var(--text-muted);margin:0 8px;">×</span>
                                    <span style="color:var(--monster-green);">${b}</span>
                                </div>
                            </div>
                            <div style="margin-top:10px;font-size:0.95rem;color:var(--text-muted);">
                                🔥 ${product} ÷ <span style="color:var(--monster-red);font-weight:700;">${knownFactor}</span>
                                = <span style="color:var(--monster-green);font-weight:700;">?</span>
                                &nbsp;← the other factor!
                            </div>
                            <div style="margin-top:4px;font-size:0.85rem;color:var(--text-muted);">👾 Cover <strong>${knownFactor}</strong> → the hidden number is your answer</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Division Boss Battle
            {
                skillId: '4div-boss',
                generate(diff, modality) {
                    const type = pick(['basic', 'remainder', 'long']);
                    let a, b, answer, questionText;

                    if (type === 'basic') {
                        b = R(2, 9);
                        answer = R(10, 50);
                        a = b * answer;
                        questionText = `⚔️ BOSS BATTLE! ${a} ÷ ${b} = ?`;
                    } else if (type === 'remainder') {
                        b = R(3, 8);
                        const q = R(5, 30);
                        const r = R(1, b - 1);
                        a = b * q + r;
                        answer = q;
                        questionText = `🐉 DRAGON BOSS! ${a} ÷ ${b} = ? (quotient only, ignore remainder)`;
                    } else {
                        b = R(2, 6);
                        answer = R(50, 200);
                        a = b * answer;
                        questionText = `🗡️ FINAL BOSS! ${Engine.Utils.fmt(a)} ÷ ${b} = ?`;
                    }

                    const result = {
                        type: 'input',
                        questionText,
                        visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🛡️⚔️🐉</div>`,
                        answer,
                        hint1: `How many times does ${b} go into ${a}?`,
                        hint2: `${b} × ? = ${type === 'remainder' ? 'close to' : ''} ${a}`,
                        hint3: `The answer is ${Engine.Utils.fmt(answer)}`,
                        diagnose(userAnswer) {
                            if (userAnswer === a * b) return 'multiplied-instead';
                            if (userAnswer === a - b) return 'subtracted-instead';
                            // Check rounded-up before close-error since answer+1 is within 2 of answer
                            if (type === 'remainder' && userAnswer === answer + 1) return 'rounded-up';
                            if (Math.abs(userAnswer - answer) <= 2 && userAnswer !== answer) return 'close-error';
                            return null;
                        },
                        misconceptionHints: {
                            'multiplied-instead': `You multiplied instead of dividing! ${a} ÷ ${b} means splitting ${a} into ${b} equal groups.`,
                            'subtracted-instead': `That's subtraction, not division! Think: how many groups of ${b} fit in ${a}?`,
                            'close-error': `So close! Double-check your work. ${b} × ${answer} = ${b * answer}.`,
                            'rounded-up': `Don't round up — just give the whole number quotient and ignore the remainder.`
                        }
                    };

                    if (modality === 'worked-example') {
                        // Fresh numbers of the same type, so the example doesn't solve the actual question
                        let exA, exB, exAns;
                        do {
                            if (type === 'basic') {
                                exB = R(2, 9); exAns = R(10, 50); exA = exB * exAns;
                            } else if (type === 'remainder') {
                                exB = R(3, 8); exAns = R(5, 30); exA = exB * exAns + R(1, exB - 1);
                            } else {
                                exB = R(2, 6); exAns = R(50, 200); exA = exB * exAns;
                            }
                        } while (exA === a && exB === b);
                        if (type === 'basic') {
                            result.workedExample = `<div style="text-align:center"><p><strong>Boss Tip:</strong> ${exA} ÷ ${exB}</p><p>Think: ${exB} × ? = ${exA}</p><p>${exB} × ${exAns} = ${exA} ✓</p><p>Answer: <strong>${exAns}</strong></p></div>`;
                        } else if (type === 'remainder') {
                            result.workedExample = `<div style="text-align:center"><p><strong>Boss Tip:</strong> ${exA} ÷ ${exB}</p><p>Find the largest multiple of ${exB} that fits in ${exA}</p><p>${exB} × ${exAns} = ${exB * exAns} (remainder ${exA - exB * exAns})</p><p>Quotient: <strong>${exAns}</strong></p></div>`;
                        } else {
                            result.workedExample = `<div style="text-align:center"><p><strong>Boss Tip:</strong> ${Engine.Utils.fmt(exA)} ÷ ${exB}</p><p>Use long division: divide, multiply, subtract, bring down</p><p>Answer: <strong>${Engine.Utils.fmt(exAns)}</strong></p></div>`;
                        }
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:2.5rem;animation:bounce 0.6s ease-in-out infinite;">🛡️⚔️🐉</div>
                            <div style="margin-top:8px;padding:8px 16px;background:rgba(255,100,50,0.1);border-radius:8px;display:inline-block;">
                                <div style="font-size:1.4rem;font-weight:700;color:var(--monster-red);">${Engine.Utils.fmt(a)} ÷ ${b}</div>
                                <div style="font-size:0.95rem;color:var(--text-muted);margin-top:4px;">Think: ${b} × <span style="color:var(--monster-green);font-weight:700;">?</span> = ${type === 'remainder' ? 'close to ' : ''}${Engine.Utils.fmt(a)}</div>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            }
        ];
    }
};
