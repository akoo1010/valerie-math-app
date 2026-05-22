/* ===== UNIT: FACTORS & MULTIPLES (4th Grade) — Dance Theme 🎤 ===== */

const FactorsMultiples4 = {
    id: '4-factors-multiples',
    title: 'Factors & Multiples',
    icon: '🎤',
    theme: 'dance',
    description: "Find the rhythm in numbers! Discover factors, multiples, and prime vs composite on the dance floor!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;
        const shuffle = Engine.Utils.shuffle;

        function getFactors(n) {
            const factors = [];
            for (let i = 1; i <= n; i++) {
                if (n % i === 0) factors.push(i);
            }
            return factors;
        }

        return [
            // 1. List all factor pairs
            {
                skillId: '4fm-factor-pairs',
                generate(diff, modality) {
                    const n = diff >= 2 ? pick([24, 30, 36, 48, 60]) : pick([12, 16, 18, 20, 24]);
                    const factors = getFactors(n);
                    const pairCount = Math.floor(factors.length / 2) + (Math.sqrt(n) % 1 === 0 ? 1 : 0);
                    const answer = factors.length;

                    const result = {
                        type: 'input',
                        questionText: `🎤 How many factors does ${n} have?<br>Count ALL the numbers that divide evenly into ${n}.`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:2rem;font-weight:800;color:var(--dance-gold);">🎵 ${n} 🎵</div>
                            <div style="margin-top:8px;font-size:0.9rem;color:var(--text-muted);">A factor divides evenly (no remainder)</div>
                        </div>`,
                        answer,
                        hint1: `Start checking: 1 × ? = ${n}, 2 × ? = ${n}, 3 × ? = ${n}...`,
                        hint2: `The factors are: ${factors.join(', ')}`,
                        hint3: `${n} has ${answer} factors: ${factors.join(', ')}`,
                        diagnose(userAnswer) {
                            if (userAnswer === pairCount) return 'counted-pairs-not-factors';
                            return null;
                        },
                        misconceptionHints: {
                            'counted-pairs-not-factors': `You counted factor PAIRS, not individual factors! List each number separately: ${factors.join(', ')} = ${answer} factors total.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Factors of 12</p><p>1×12, 2×6, 3×4</p><p>Factors: 1, 2, 3, 4, 6, 12 = <strong>6 factors</strong></p></div>`;
                    }

                    return result;
                }
            },
            // 2. Is this a factor?
            {
                skillId: '4fm-is-factor',
                generate(diff, modality) {
                    const pickN = () => diff >= 2 ? R(20, 60) : R(10, 30);
                    const isFactor = Math.random() < 0.5;
                    let n = pickN();
                    // For "Yes" questions, avoid primes — their only factors are 1 and n (trivial)
                    if (isFactor) while (getFactors(n).length <= 2) n = pickN();
                    let testNum;
                    if (isFactor) {
                        const factors = getFactors(n);
                        testNum = pick(factors.filter(f => f !== 1 && f !== n));
                    } else {
                        testNum = R(2, n - 1);
                        while (n % testNum === 0) testNum = R(2, n - 1);
                    }
                    const answer = n % testNum === 0 ? 'Yes' : 'No';

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🎶 Is ${testNum} a factor of ${n}?`,
                        visual: `<div style="display:flex;gap:16px;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;">
                            <span style="color:var(--dance-pink);">🎵 ${testNum}</span>
                            <span style="color:var(--dance-gold);">→</span>
                            <span style="color:var(--dance-cyan);">🎵 ${n}</span>
                        </div>`,
                        answer,
                        options: [{label: 'Yes — it divides evenly!', value: 'Yes'}, {label: 'No — there\'s a remainder!', value: 'No'}],
                        hint1: `Does ${n} ÷ ${testNum} have a remainder?`,
                        hint2: `${n} ÷ ${testNum} = ${(n / testNum).toFixed(2)}`,
                        hint3: `${n} ÷ ${testNum} = ${n % testNum === 0 ? n / testNum + ' (no remainder!)' : Math.floor(n / testNum) + ' R ' + (n % testNum)}, so ${answer}!`,
                        diagnose(userAnswer) {
                            if (answer === 'Yes' && userAnswer === 'No') return 'confused-factor-multiple';
                            if (answer === 'No' && userAnswer === 'Yes') return 'confused-factor-multiple';
                            return null;
                        },
                        misconceptionHints: {
                            'confused-factor-multiple': `Remember: a FACTOR divides evenly into the number. ${n} ÷ ${testNum} = ${n % testNum === 0 ? n / testNum + ' (exact!)' : Math.floor(n / testNum) + ' R ' + (n % testNum) + ' (remainder!)'}`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Is 4 a factor of 20?</p><p>20 ÷ 4 = 5 (no remainder)</p><p>Yes! 4 IS a factor of 20.</p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🕺 Dance Division Check 🕺</div>
                            <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                                ${Array.from({length: Math.min(n, 30)}, (_, i) => `<div style="width:18px;height:18px;border-radius:50%;background:${(i + 1) % testNum === 0 ? 'var(--dance-pink)' : 'var(--dance-cyan)'};opacity:0.8;"></div>`).join('')}
                            </div>
                            <div style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">Can ${n} dots be split into equal groups of ${testNum}?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. List multiples
            {
                skillId: '4fm-multiples',
                generate(diff, modality) {
                    const n = R(2, diff >= 2 ? 12 : 8);
                    const position = R(diff >= 2 ? 5 : 3, diff >= 2 ? 10 : 7);
                    const answer = n * position;
                    const factors = getFactors(n);

                    const result = {
                        type: 'input',
                        questionText: `🕺 What is the ${position}th multiple of ${n}?`,
                        visual: `<div style="text-align:center;">
                            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                                ${Array.from({length: Math.min(position, 5)}, (_, i) => `<div style="padding:6px 12px;background:rgba(236,72,153,0.1);border:2px solid var(--dance-pink);border-radius:8px;font-weight:700;color:var(--dance-pink);">${n * (i + 1)}</div>`).join('')}
                                ${position > 5 ? '<span style="font-size:1.3rem;color:var(--dance-gold);">...</span><div style="padding:6px 12px;background:rgba(34,211,238,0.2);border:2px solid var(--dance-cyan);border-radius:8px;font-weight:800;color:var(--dance-cyan);">?</div>' : ''}
                            </div>
                        </div>`,
                        answer,
                        hint1: `The ${position}th multiple means ${n} × ${position}`,
                        hint2: `${n} × ${position} = ?`,
                        hint3: `The ${position}th multiple of ${n} is ${answer}`,
                        diagnose(userAnswer) {
                            if (factors.includes(userAnswer) && userAnswer !== answer) return 'gave-factor-not-multiple';
                            if (userAnswer === n + position) return 'added-instead-of-multiplied';
                            return null;
                        },
                        misconceptionHints: {
                            'gave-factor-not-multiple': `That's a FACTOR of ${n}, not a multiple! A multiple is ${n} × something. The ${position}th multiple = ${n} × ${position}.`,
                            'added-instead-of-multiplied': `It looks like you added ${n} + ${position} = ${n + position}. The ${position}th MULTIPLE means ${n} × ${position} = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> 4th multiple of 6</p><p>6, 12, 18, <strong>24</strong></p><p>Or simply: 6 × 4 = <strong>24</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">💃 Skip-Counting Dance Steps 💃</div>
                            <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                                ${Array.from({length: position}, (_, i) => `<div style="padding:6px 12px;background:${i === position - 1 ? 'var(--dance-gold)' : 'rgba(236,72,153,0.15)'};border:2px solid ${i === position - 1 ? 'var(--dance-gold)' : 'var(--dance-pink)'};border-radius:8px;font-weight:700;color:${i === position - 1 ? '#fff' : 'var(--dance-pink)'};">${n * (i + 1)}</div>`).join('')}
                            </div>
                            <div style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">Each step is +${n}. What's step #${position}?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Is this a multiple?
            {
                skillId: '4fm-is-multiple',
                generate(diff, modality) {
                    const base = R(2, diff >= 2 ? 12 : 8);
                    const isMultiple = Math.random() < 0.5;
                    let testNum;
                    if (isMultiple) {
                        testNum = base * R(2, 12);
                    } else {
                        testNum = base * R(2, 12) + R(1, base - 1);
                    }
                    const answer = testNum % base === 0 ? 'Yes' : 'No';

                    const result = {
                        type: 'multiple-choice',
                        questionText: `🎵 Is ${testNum} a multiple of ${base}?`,
                        visual: `<div style="font-size:2rem;font-weight:800;text-align:center;color:var(--dance-purple);">
                            💃 ${testNum} ÷ ${base} = ?
                        </div>`,
                        answer,
                        options: [{label: 'Yes — divides evenly!', value: 'Yes'}, {label: 'No — has a remainder!', value: 'No'}],
                        hint1: `Divide ${testNum} by ${base}. Is there a remainder?`,
                        hint2: `${testNum} ÷ ${base} = ${(testNum / base).toFixed(2)}`,
                        hint3: `${testNum} ÷ ${base} = ${testNum % base === 0 ? testNum / base : Math.floor(testNum / base) + ' R ' + (testNum % base)}, so ${answer}!`,
                        diagnose(userAnswer) {
                            if (answer === 'No' && userAnswer === 'Yes') return 'ignored-remainder';
                            if (answer === 'Yes' && userAnswer === 'No') return 'skip-count-error';
                            return null;
                        },
                        misconceptionHints: {
                            'ignored-remainder': `Look again — ${testNum} ÷ ${base} = ${Math.floor(testNum / base)} remainder ${testNum % base}. That leftover means it does NOT divide evenly, so ${testNum} is NOT a multiple of ${base}.`,
                            'skip-count-error': `Try skip-counting by ${base}: ${Array.from({length: Math.min(Math.floor(testNum / base) + 1, 6)}, (_, i) => base * (i + 1)).join(', ')}... Does ${testNum} appear?`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> Is 21 a multiple of 7?</p><p>21 ÷ 7 = 3 (no remainder)</p><p>Yes! 21 = 7 × 3, so 21 IS a multiple of 7.</p><p><strong>Non-example:</strong> Is 22 a multiple of 7? 22 ÷ 7 = 3 R 1. No!</p></div>`;
                    } else if (modality === 'visual') {
                        const steps = Math.min(Math.ceil(testNum / base), 10);
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🕺 Skip-Count Dance Floor 🕺</div>
                            <div style="display:flex;gap:5px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                                ${Array.from({length: steps}, (_, i) => {
                                    const val = base * (i + 1);
                                    const isTarget = val === testNum;
                                    return `<div style="padding:5px 10px;background:${isTarget ? 'var(--dance-gold)' : 'rgba(236,72,153,0.12)'};border:2px solid ${isTarget ? 'var(--dance-gold)' : 'var(--dance-pink)'};border-radius:8px;font-weight:700;color:${isTarget ? '#fff' : 'var(--dance-pink)'};">${val}</div>`;
                                }).join('')}
                            </div>
                            <div style="font-size:0.85rem;color:var(--text-muted);">Multiples of ${base} — does ${testNum} land on a beat?</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Prime or composite?
            {
                skillId: '4fm-prime-composite',
                generate(diff, modality) {
                    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
                    const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 25, 27, 28];
                    const isPrime = Math.random() < 0.5;
                    const n = isPrime ? pick(diff >= 2 ? primes : primes.slice(0, 6)) : pick(diff >= 2 ? composites : composites.slice(0, 8));
                    const answer = isPrime ? 'Prime' : 'Composite';
                    const nFactors = getFactors(n);

                    const result = {
                        type: 'multiple-choice',
                        questionText: `✨ Is ${n} prime or composite?`,
                        visual: `<div style="text-align:center;">
                            <div style="font-size:3rem;font-weight:800;color:var(--dance-gold);">✨ ${n} ✨</div>
                            <div style="font-size:0.9rem;color:var(--text-muted);margin-top:4px;">Prime = only 1 and itself. Composite = more factors.</div>
                        </div>`,
                        answer,
                        options: [
                            {label: `Prime (only 2 factors)`, value: 'Prime'},
                            {label: `Composite (more than 2 factors)`, value: 'Composite'}
                        ],
                        hint1: `Can any number besides 1 and ${n} divide into ${n} evenly?`,
                        hint2: isPrime ? `Try dividing by 2, 3, 5... none work!` : `${n} ÷ ${nFactors[1]} = ${n / nFactors[1]} — it has more than 2 factors!`,
                        hint3: `${n} is ${answer} (factors: ${nFactors.join(', ')})`,
                        diagnose(userAnswer) {
                            if (n === 2 && userAnswer === 'Composite') return 'two-is-prime';
                            if (isPrime && userAnswer === 'Composite') return 'missed-prime';
                            if (!isPrime && userAnswer === 'Prime') return 'missed-composite';
                            return null;
                        },
                        misconceptionHints: {
                            'two-is-prime': `2 is the ONLY even prime number! It has exactly 2 factors: 1 and 2. All other even numbers are composite because 2 is also a factor.`,
                            'missed-prime': `${n} is prime — it can ONLY be divided evenly by 1 and ${n} itself. Try dividing by 2, 3, 5, 7... none go in evenly!`,
                            'missed-composite': `${n} is composite because it has MORE than 2 factors: ${nFactors.join(', ')}. The extra factor ${nFactors[1]} divides evenly into ${n}!`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Prime:</strong> 7 → factors are just 1, 7 ✓</p><p><strong>Composite:</strong> 12 → factors: 1, 2, 3, 4, 6, 12 ✗</p><p>Note: 1 is NEITHER prime nor composite!</p></div>`;
                    } else if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">💃 Factor Dance Test 💃</div>
                            <div style="font-size:2.2rem;font-weight:800;color:var(--dance-gold);margin-bottom:10px;">✨ ${n} ✨</div>
                            <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                                ${nFactors.map(f => `<div style="padding:5px 12px;background:${f === 1 || f === n ? 'rgba(168,85,247,0.15)' : 'rgba(234,179,8,0.2)'};border:2px solid ${f === 1 || f === n ? 'var(--dance-purple)' : 'var(--dance-gold)'};border-radius:8px;font-weight:700;color:${f === 1 || f === n ? 'var(--dance-purple)' : 'var(--dance-gold)'};">${f}</div>`).join('')}
                            </div>
                            <div style="font-size:0.85rem;color:var(--text-muted);">${nFactors.length === 2 ? 'Only 1 and itself — that\'s a PRIME! 🎵' : `${nFactors.length} factors — that\'s COMPOSITE! 🎵`}</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Common factors
            {
                skillId: '4fm-common-factors',
                generate(diff, modality) {
                    const pool = diff >= 2 ? [12, 16, 18, 20, 24, 30] : [6, 8, 10, 12];
                    const a = pick(pool);
                    let b = pick(pool);
                    while (b === a) b = pick(pool);
                    const aFactors = getFactors(a);
                    const bFactors = getFactors(b);
                    const common = aFactors.filter(f => bFactors.includes(f));
                    const gcf = Math.max(...common);
                    const answer = gcf;

                    // Compute LCM for diagnose
                    const lcm = (a * b) / gcf;

                    const result = {
                        type: 'input',
                        questionText: `🎤 What is the greatest common factor (GCF) of ${a} and ${b}?`,
                        visual: `<div style="text-align:center;">
                            <div style="display:flex;gap:20px;justify-content:center;">
                                <div style="padding:10px 16px;background:rgba(236,72,153,0.1);border:2px solid var(--dance-pink);border-radius:10px;">
                                    <div style="font-weight:700;color:var(--dance-pink);">Factors of ${a}:</div>
                                    <div style="color:var(--text-secondary);">${aFactors.join(', ')}</div>
                                </div>
                                <div style="padding:10px 16px;background:rgba(34,211,238,0.1);border:2px solid var(--dance-cyan);border-radius:10px;">
                                    <div style="font-weight:700;color:var(--dance-cyan);">Factors of ${b}:</div>
                                    <div style="color:var(--text-secondary);">${bFactors.join(', ')}</div>
                                </div>
                            </div>
                        </div>`,
                        answer,
                        hint1: `Common factors of ${a} and ${b}: ${common.join(', ')}`,
                        hint2: `The GREATEST of these is?`,
                        hint3: `GCF(${a}, ${b}) = ${gcf}`,
                        diagnose(userAnswer) {
                            if (userAnswer === lcm) return 'gave-lcm';
                            if (common.includes(userAnswer) && userAnswer !== gcf) return 'gave-common-not-greatest';
                            return null;
                        },
                        misconceptionHints: {
                            'gave-lcm': `You found the LCM (Least Common Multiple), not the GCF! The GCF is the GREATEST factor they SHARE. Common factors: ${common.join(', ')} → GCF = ${gcf}.`,
                            'gave-common-not-greatest': `That is a common factor, but not the GREATEST one. Common factors: ${common.join(', ')} → pick the biggest!`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> GCF of 12 and 18</p><p>Factors of 12: 1, 2, 3, 4, 6, 12</p><p>Factors of 18: 1, 2, 3, 6, 9, 18</p><p>Common: 1, 2, 3, 6 → GCF = <strong>6</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center;">
                            <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🎤 Venn Diagram Dance 🎤</div>
                            <div style="display:flex;justify-content:center;align-items:center;gap:0;">
                                <div style="padding:10px 20px 10px 16px;background:rgba(236,72,153,0.1);border:2px solid var(--dance-pink);border-radius:20px 0 0 20px;min-width:80px;">
                                    <div style="font-weight:700;font-size:0.8rem;color:var(--dance-pink);">Only ${a}</div>
                                    <div style="font-size:0.85rem;">${aFactors.filter(f => !common.includes(f)).join(', ') || '—'}</div>
                                </div>
                                <div style="padding:10px 14px;background:rgba(168,85,247,0.15);border:2px solid var(--dance-purple);min-width:70px;z-index:1;">
                                    <div style="font-weight:700;font-size:0.8rem;color:var(--dance-purple);">Both</div>
                                    <div style="font-size:0.85rem;font-weight:700;">${common.join(', ')}</div>
                                </div>
                                <div style="padding:10px 16px 10px 20px;background:rgba(34,211,238,0.1);border:2px solid var(--dance-cyan);border-radius:0 20px 20px 0;min-width:80px;">
                                    <div style="font-weight:700;font-size:0.8rem;color:var(--dance-cyan);">Only ${b}</div>
                                    <div style="font-size:0.85rem;">${bFactors.filter(f => !common.includes(f)).join(', ') || '—'}</div>
                                </div>
                            </div>
                            <div style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">Pick the GREATEST from the middle!</div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Dance-Off Boss
            {
                skillId: '4fm-boss',
                generate(diff, modality) {
                    const type = pick(['factors', 'prime', 'multiples']);

                    if (type === 'factors') {
                        const n = pick(diff >= 2 ? [24, 30, 36, 48] : [18, 24, 30, 36]);
                        const factors = getFactors(n);
                        const pairCount = Math.floor(factors.length / 2) + (Math.sqrt(n) % 1 === 0 ? 1 : 0);

                        const result = {
                            type: 'input',
                            questionText: `🎤 DANCE-OFF FINALE! How many factors does ${n} have?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🎤💃🕺</div>`,
                            answer: factors.length,
                            hint1: `List factor pairs: 1×${n}, 2×?, 3×?...`,
                            hint2: `Factors: ${factors.join(', ')}`,
                            hint3: `${n} has ${factors.length} factors`,
                            diagnose(userAnswer) {
                                if (userAnswer === pairCount) return 'counted-pairs-not-factors';
                                if (userAnswer === factors.length - 1) return 'missed-a-factor';
                                return null;
                            },
                            misconceptionHints: {
                                'counted-pairs-not-factors': `You counted factor PAIRS, not individual factors! List each number: ${factors.join(', ')} = ${factors.length} individual factors (not ${pairCount} pairs).`,
                                'missed-a-factor': `Almost! You're one short. Did you forget to check every divisor? Full list: ${factors.join(', ')}.`
                            }
                        };

                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>Strategy:</strong> Check pairs from 1 up to √${n} ≈ ${Math.sqrt(n).toFixed(1)}</p><p>Each pair gives TWO factors (unless it's a perfect square).</p><p>Factors of ${n}: ${factors.join(', ')} = <strong>${factors.length} factors</strong></p></div>`;
                        } else if (modality === 'visual') {
                            result.visual = `<div style="text-align:center;">
                                <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🎤 Factor Pair Dance 🎤</div>
                                <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                                    ${factors.map(f => `<div style="padding:5px 12px;background:rgba(236,72,153,0.12);border:2px solid var(--dance-pink);border-radius:8px;font-weight:700;color:var(--dance-pink);">${f}</div>`).join('')}
                                </div>
                                <div style="font-size:0.85rem;color:var(--text-muted);">Count ALL of them — that's your answer! 💃</div>
                            </div>`;
                        }

                        return result;

                    } else if (type === 'prime') {
                        const pool = diff >= 2 ? [2, 3, 5, 7, 11, 13, 4, 6, 8, 9, 10, 15, 17, 19, 21, 25] : [2, 3, 5, 7, 11, 13, 4, 6, 8, 9, 10, 15];
                        const n = pick(pool);
                        const nFactors = getFactors(n);
                        const isPrime = nFactors.length === 2;
                        const answer = isPrime ? 'Prime' : 'Composite';

                        const result = {
                            type: 'multiple-choice',
                            questionText: `🎤 DANCE-OFF FINALE! Is ${n} prime or composite?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">✨🎤✨</div>`,
                            answer,
                            options: [{label: 'Prime (only 2 factors)', value: 'Prime'}, {label: 'Composite (more than 2 factors)', value: 'Composite'}],
                            hint1: `Check for factors besides 1 and ${n}`,
                            hint2: `Factors of ${n}: ${nFactors.join(', ')}`,
                            hint3: `${n} is ${answer} — it has ${nFactors.length} factor${nFactors.length !== 1 ? 's' : ''}`,
                            diagnose(userAnswer) {
                                if (n === 2 && userAnswer === 'Composite') return 'two-is-prime';
                                if (isPrime && userAnswer === 'Composite') return 'missed-prime';
                                if (!isPrime && userAnswer === 'Prime') return 'missed-composite';
                                return null;
                            },
                            misconceptionHints: {
                                'two-is-prime': `2 is the ONLY even prime! It only has 2 factors: 1 and 2. Don't let the "even" fool you — 2 is prime! 🎵`,
                                'missed-prime': `${n} has exactly 2 factors (1 and ${n}) — that makes it PRIME! No other number divides in evenly. ✨`,
                                'missed-composite': `${n} has ${nFactors.length} factors: ${nFactors.join(', ')}. Since it has MORE than 2, it's COMPOSITE! 🕺`
                            }
                        };

                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>Rule:</strong> Exactly 2 factors → Prime. More than 2 → Composite.</p><p>Factors of ${n}: ${nFactors.join(', ')}</p><p>${n} is <strong>${answer}</strong>!</p><p style="font-size:0.85rem;color:var(--text-muted);">Remember: 1 is NEITHER prime nor composite.</p></div>`;
                        } else if (modality === 'visual') {
                            result.visual = `<div style="text-align:center;">
                                <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">✨ Prime or Composite Spotlight ✨</div>
                                <div style="font-size:2.5rem;font-weight:800;color:var(--dance-gold);margin-bottom:10px;">🎤 ${n} 🎤</div>
                                <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                                    ${nFactors.map(f => `<div style="padding:5px 12px;background:${f === 1 || f === n ? 'rgba(168,85,247,0.15)' : 'rgba(234,179,8,0.2)'};border:2px solid ${f === 1 || f === n ? 'var(--dance-purple)' : 'var(--dance-gold)'};border-radius:8px;font-weight:700;color:${f === 1 || f === n ? 'var(--dance-purple)' : 'var(--dance-gold)'};">${f}</div>`).join('')}
                                </div>
                                <div style="font-size:0.85rem;color:var(--text-muted);">${nFactors.length === 2 ? '2 factors only → PRIME! 🎵' : `${nFactors.length} factors → COMPOSITE! 🎵`}</div>
                            </div>`;
                        }

                        return result;

                    } else {
                        const base = R(diff >= 2 ? 4 : 3, diff >= 2 ? 12 : 9);
                        const pos = R(diff >= 2 ? 7 : 5, diff >= 2 ? 15 : 12);
                        const answer = base * pos;

                        const result = {
                            type: 'input',
                            questionText: `🎤 DANCE-OFF FINALE! What is the ${pos}th multiple of ${base}?`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🪩🎵🪩</div>`,
                            answer,
                            hint1: `The ${pos}th multiple means ${base} × ${pos}`,
                            hint2: `${base} × ${pos} = ?`,
                            hint3: `${base} × ${pos} = ${answer}`,
                            diagnose(userAnswer) {
                                if (userAnswer === base + pos) return 'added-instead-of-multiplied';
                                if (userAnswer === base * (pos - 1)) return 'off-by-one';
                                if (userAnswer === base * (pos + 1)) return 'off-by-one';
                                return null;
                            },
                            misconceptionHints: {
                                'added-instead-of-multiplied': `You added ${base} + ${pos} = ${base + pos}, but multiples use MULTIPLICATION! The ${pos}th multiple = ${base} × ${pos} = ${answer}. 🕺`,
                                'off-by-one': `Almost! Double-check your count. The ${pos}th multiple is ${base} × ${pos} = ${answer}. Did you start counting from 0 instead of 1? 🎵`
                            }
                        };

                        if (modality === 'worked-example') {
                            result.workedExample = `<div style="text-align:center"><p><strong>Shortcut:</strong> The Nth multiple of a number = number × N</p><p>The ${pos}th multiple of ${base} = ${base} × ${pos} = <strong>${answer}</strong></p><p>Skip-count check: ${Array.from({length: Math.min(pos, 5)}, (_, i) => base * (i + 1)).join(', ')}${pos > 5 ? `, ... ${answer}` : ''}</p></div>`;
                        } else if (modality === 'visual') {
                            const displayCount = Math.min(pos, 8);
                            result.visual = `<div style="text-align:center;">
                                <div style="font-size:1.1rem;font-weight:700;color:var(--dance-purple);margin-bottom:8px;">🪩 Skip-Count to the Beat 🪩</div>
                                <div style="display:flex;gap:5px;justify-content:center;flex-wrap:wrap;margin-bottom:6px;">
                                    ${Array.from({length: displayCount}, (_, i) => {
                                        const val = base * (i + 1);
                                        const isLast = i === displayCount - 1 && displayCount === pos;
                                        return `<div style="padding:5px 10px;background:${isLast ? 'var(--dance-gold)' : 'rgba(236,72,153,0.12)'};border:2px solid ${isLast ? 'var(--dance-gold)' : 'var(--dance-pink)'};border-radius:8px;font-weight:700;color:${isLast ? '#fff' : 'var(--dance-pink)'};">${val}</div>`;
                                    }).join('')}
                                    ${pos > displayCount ? `<div style="padding:5px 10px;color:var(--text-muted);font-weight:700;">... ${answer} 🎯</div>` : ''}
                                </div>
                                <div style="font-size:0.85rem;color:var(--text-muted);">Each beat = +${base}. Beat #${pos} = ${answer}!</div>
                            </div>`;
                        }

                        return result;
                    }
                }
            }
        ];
    }
};
