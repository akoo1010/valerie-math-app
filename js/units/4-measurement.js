/* ===== UNIT: MEASUREMENT & DATA (4th Grade) — Monster Theme ⚖️ ===== */

const Measurement4 = {
    id: '4-measurement',
    title: 'Measurement & Data',
    icon: '⚖️',
    theme: 'monster',
    description: "Weigh, measure, and convert like a monster scientist! Master units of measurement!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            // 1. Convert within customary length (in, ft, yd)
            {
                skillId: '4meas-length-cust',
                generate(diff, modality) {
                    const conversions = [
                        {from: 'feet', to: 'inches', factor: 12, emoji: '📏', singular: 'foot'},
                        {from: 'yards', to: 'feet', factor: 3, emoji: '📐', singular: 'yard'},
                    ];
                    if (diff >= 2) conversions.push({from: 'miles', to: 'feet', factor: 5280, emoji: '🗺️', singular: 'mile'});
                    const conv = pick(conversions);
                    const amount = R(1, diff >= 2 ? 10 : 5);
                    const answer = amount * conv.factor;
                    const fromUnit = amount === 1 ? conv.singular : conv.from;

                    const result = {
                        type: 'input',
                        questionText: `${conv.emoji} A monster is ${amount} ${fromUnit} tall!<br>How many ${conv.to} is that?`,
                        visual: `<div style="text-align:center;font-size:1.5rem;font-weight:700;color:var(--monster-red);">
                            🐲 ${amount} ${fromUnit} = ? ${conv.to}
                        </div>`,
                        answer,
                        hint1: `1 ${conv.singular} = ${conv.factor} ${conv.to}`,
                        hint2: `${amount} × ${conv.factor} = ?`,
                        hint3: `${amount} ${fromUnit} = ${Engine.Utils.fmt(answer)} ${conv.to}`,
                        diagnose(userAnswer) {
                            if (conv.factor !== 1 && userAnswer === amount / conv.factor) return 'divided-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'divided-instead': `Going from a bigger unit to a smaller unit means MULTIPLY! ${amount} × ${conv.factor} = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weFeet = (conv.from === 'feet' && amount === 3) ? 4 : 3;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weFeet} feet = ? inches</p><p>1 foot = 12 inches</p><p>${weFeet} × 12 = <strong>${weFeet * 12} inches</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center">
                            <div style="font-size:2rem;margin-bottom:0.5rem;">📏🐲📏</div>
                            <div style="display:flex;justify-content:center;align-items:center;gap:0.5rem;flex-wrap:wrap;margin:0.5rem 0;">
                                ${Array.from({length: amount}, (_, i) => `<div style="background:var(--monster-red);color:#fff;border-radius:12px;padding:0.3rem 0.7rem;font-size:0.9rem;font-weight:700;">${conv.singular} ${i + 1}</div>`).join('<span style="font-size:1rem;">+</span>')}
                            </div>
                            <p style="margin-top:0.5rem;font-weight:700;color:var(--monster-red);">${amount} ${fromUnit} × ${conv.factor} = ? ${conv.to}</p>
                            <p style="font-size:0.85rem;color:#666;">⚡ Each ${conv.singular} = ${conv.factor} ${conv.to}</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 2. Convert within customary weight (oz, lb)
            {
                skillId: '4meas-weight-cust',
                generate(diff, modality) {
                    const pounds = R(1, diff >= 2 ? 15 : 8);
                    const answer = pounds * 16;

                    const result = {
                        type: 'input',
                        questionText: `⚖️ A monster egg weighs ${pounds} ${pounds === 1 ? 'pound' : 'pounds'}.<br>How many ounces is that?`,
                        visual: `<div style="text-align:center;font-size:1.5rem;font-weight:700;color:var(--monster-blue);">
                            🥚 ${pounds} lb = ? oz
                        </div>`,
                        answer,
                        hint1: `1 pound = 16 ounces`,
                        hint2: `${pounds} × 16 = ?`,
                        hint3: `${pounds} lb = ${answer} oz`,
                        diagnose(userAnswer) {
                            if (userAnswer === pounds / 16) return 'divided-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'divided-instead': `Pounds are bigger than ounces, so MULTIPLY! ${pounds} × 16 = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weLb = pounds === 3 ? 4 : 3;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weLb} pounds = ? ounces</p><p>1 pound = 16 ounces</p><p>${weLb} × 16 = <strong>${weLb * 16} ounces</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center">
                            <div style="font-size:2rem;margin-bottom:0.5rem;">🥚⚖️🐲</div>
                            <div style="display:flex;justify-content:center;gap:0.5rem;flex-wrap:wrap;">
                                ${Array.from({length: pounds}, () => '<div style="background:var(--monster-blue);color:#fff;border-radius:12px;padding:0.3rem 0.6rem;font-size:0.9rem;">1 lb = 16 oz</div>').join('')}
                            </div>
                            <p style="margin-top:0.5rem;font-weight:700;color:var(--monster-blue);">${pounds} lb × 16 = ? oz</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 3. Convert within customary volume (cups, pints, quarts, gallons)
            {
                skillId: '4meas-volume-cust',
                generate(diff, modality) {
                    const conversions = [
                        {from: 'pints', to: 'cups', factor: 2},
                        {from: 'quarts', to: 'pints', factor: 2},
                        {from: 'gallons', to: 'quarts', factor: 4},
                    ];
                    if (diff >= 2) conversions.push({from: 'gallons', to: 'cups', factor: 16});
                    const conv = pick(conversions);
                    const amount = R(1, diff >= 2 ? 8 : 5);
                    const answer = amount * conv.factor;
                    const fromUnit = amount === 1 ? conv.from.slice(0, -1) : conv.from;

                    const result = {
                        type: 'input',
                        questionText: `🧪 A potion cauldron holds ${amount} ${fromUnit}.<br>How many ${conv.to} is that?`,
                        visual: `<div style="text-align:center;font-size:1.5rem;font-weight:700;color:var(--monster-purple);">
                            🧪 ${amount} ${fromUnit} = ? ${conv.to}
                        </div>`,
                        answer,
                        hint1: `1 ${conv.from.slice(0, -1)} = ${conv.factor} ${conv.to}`,
                        hint2: `${amount} × ${conv.factor} = ?`,
                        hint3: `${amount} ${fromUnit} = ${answer} ${conv.to}`,
                        diagnose(userAnswer) {
                            if (conv.factor !== 1 && userAnswer === amount / conv.factor) return 'divided-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'divided-instead': `Going from a bigger unit to a smaller unit means MULTIPLY! ${amount} × ${conv.factor} = ${answer}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weGal = answer === 12 ? 2 : 3;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weGal} gallons = ? quarts</p><p>1 gallon = 4 quarts</p><p>${weGal} × 4 = <strong>${weGal * 4} quarts</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center">
                            <div style="font-size:2rem;margin-bottom:0.5rem;">🧪🐲🧪</div>
                            <div style="display:flex;justify-content:center;gap:0.5rem;flex-wrap:wrap;">
                                ${Array.from({length: amount}, () => `<div style="background:var(--monster-purple);color:#fff;border-radius:12px;padding:0.3rem 0.6rem;font-size:0.9rem;">1 ${conv.from.slice(0, -1)} = ${conv.factor} ${conv.to}</div>`).join('')}
                            </div>
                            <p style="margin-top:0.5rem;font-weight:700;color:var(--monster-purple);">${amount} ${fromUnit} × ${conv.factor} = ? ${conv.to}</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 4. Metric conversions (km, m, cm, mm)
            {
                skillId: '4meas-metric-length',
                generate(diff, modality) {
                    const conversions = [
                        {from: 'meters', to: 'centimeters', factor: 100},
                        {from: 'centimeters', to: 'millimeters', factor: 10},
                        {from: 'kilometers', to: 'meters', factor: 1000},
                    ];
                    const conv = pick(diff >= 2 ? conversions : conversions.slice(0, 2));
                    const amount = R(1, diff >= 2 ? 10 : 5);
                    const answer = amount * conv.factor;
                    const fromUnit = amount === 1 ? conv.from.slice(0, -1) : conv.from;

                    const result = {
                        type: 'input',
                        questionText: `🐾 A monster ran ${amount} ${fromUnit}.<br>How many ${conv.to} is that?`,
                        visual: `<div style="text-align:center;font-size:1.5rem;font-weight:700;color:var(--monster-green);">
                            🐾 ${amount} ${fromUnit} = ? ${conv.to}
                        </div>`,
                        answer,
                        hint1: `1 ${conv.from.slice(0, -1)} = ${Engine.Utils.fmt(conv.factor)} ${conv.to}`,
                        hint2: `${amount} × ${Engine.Utils.fmt(conv.factor)} = ?`,
                        hint3: `${amount} ${fromUnit} = ${Engine.Utils.fmt(answer)} ${conv.to}`,
                        diagnose(userAnswer) {
                            if (conv.factor !== 1 && userAnswer === amount / conv.factor) return 'divided-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'divided-instead': `Bigger unit to smaller unit means MULTIPLY! ${amount} × ${Engine.Utils.fmt(conv.factor)} = ${Engine.Utils.fmt(answer)}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weM = answer === 500 ? 4 : 5;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weM} meters = ? centimeters</p><p>1 meter = 100 centimeters</p><p>${weM} × 100 = <strong>${weM * 100} centimeters</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center">
                            <div style="font-size:2rem;margin-bottom:0.5rem;">🐾🐲🐾</div>
                            <div style="display:flex;justify-content:center;align-items:center;gap:0.3rem;margin:0.5rem 0;">
                                <div style="background:var(--monster-green);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;">${amount} ${fromUnit}</div>
                                <span style="font-size:1.3rem;">→</span>
                                <div style="background:var(--monster-green);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;">× ${Engine.Utils.fmt(conv.factor)}</div>
                                <span style="font-size:1.3rem;">→</span>
                                <div style="background:var(--monster-green);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;">? ${conv.to}</div>
                            </div>
                        </div>`;
                    }

                    return result;
                }
            },
            // 5. Metric mass (kg, g)
            {
                skillId: '4meas-metric-mass',
                generate(diff, modality) {
                    const kg = R(1, diff >= 2 ? 10 : 5);
                    const answer = kg * 1000;

                    const result = {
                        type: 'input',
                        questionText: `🦖 A dinosaur-monster weighs ${kg} ${kg === 1 ? 'kilogram' : 'kilograms'}.<br>How many grams is that?`,
                        visual: `<div style="text-align:center;font-size:1.5rem;font-weight:700;color:var(--monster-yellow);">
                            🦖 ${kg} kg = ? g
                        </div>`,
                        answer,
                        hint1: `1 kilogram = 1,000 grams`,
                        hint2: `${kg} × 1,000 = ?`,
                        hint3: `${kg} kg = ${Engine.Utils.fmt(answer)} g`,
                        diagnose(userAnswer) {
                            if (userAnswer === kg / 1000) return 'divided-instead';
                            return null;
                        },
                        misconceptionHints: {
                            'divided-instead': `Kilograms are bigger than grams, so MULTIPLY! ${kg} × 1,000 = ${Engine.Utils.fmt(answer)}.`
                        }
                    };

                    if (modality === 'worked-example') {
                        const weKg = kg === 4 ? 3 : 4;
                        result.workedExample = `<div style="text-align:center"><p><strong>Example:</strong> ${weKg} kilograms = ? grams</p><p>1 kilogram = 1,000 grams</p><p>${weKg} × 1,000 = <strong>${Engine.Utils.fmt(weKg * 1000)} grams</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center">
                            <div style="font-size:2rem;margin-bottom:0.5rem;">🦖⚡🦖</div>
                            <div style="display:flex;justify-content:center;align-items:center;gap:0.4rem;margin:0.5rem 0;">
                                <div style="background:var(--monster-yellow);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;font-size:1.1rem;">${kg} kg</div>
                                <span style="font-size:1.3rem;font-weight:700;">× 1,000</span>
                                <span style="font-size:1.5rem;">→</span>
                                <div style="background:var(--monster-yellow);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;font-size:1.1rem;">? g</div>
                            </div>
                            <p style="font-size:0.85rem;color:#666;margin-top:0.4rem;">🔥 1 kilogram = 1,000 grams — bigger unit means MULTIPLY!</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 6. Elapsed time
            {
                skillId: '4meas-time',
                generate(diff, modality) {
                    const startHour = R(1, 11);
                    const startMin = pick([0, 15, 30, 45]);
                    const elapsedHours = R(1, diff >= 2 ? 3 : 2);
                    // Use [15, 30, 45] only; 60 produces awkward "X hour and 60 minutes" phrasing
                    const elapsedMins = pick([15, 30, 45]);
                    const totalMins = startHour * 60 + startMin + elapsedHours * 60 + elapsedMins;
                    const endHour = Math.floor(totalMins / 60) % 12 || 12;
                    const endMin = totalMins % 60;
                    const answer = `${endHour}:${String(endMin).padStart(2, '0')}`;

                    const period = startHour < 12 ? 'AM' : 'PM';
                    const startStr = `${startHour}:${String(startMin).padStart(2, '0')} ${period}`;

                    // Build distractor times; ensure all labels are unique and different from the answer
                    const labelSet = new Set([answer]);
                    const valueMap = { [answer]: answer };
                    const addLabel = (label, tag) => {
                        if (!labelSet.has(label)) { labelSet.add(label); valueMap[label] = tag; }
                    };
                    addLabel(`${endHour}:${String((endMin + 15) % 60).padStart(2, '0')}`, 'wrong1');
                    addLabel(`${(endHour % 12) + 1}:${String(endMin).padStart(2, '0')}`, 'wrong2');
                    // Third distractor: the real "subtracted the minutes" mistake (start + hours − minutes),
                    // so the 'subtracted-minutes' hint matches what was picked
                    const subMins = startHour * 60 + startMin + elapsedHours * 60 - elapsedMins;
                    const subLabel = `${Math.floor(subMins / 60) % 12 || 12}:${String(subMins % 60).padStart(2, '0')}`;
                    if (!labelSet.has(subLabel)) addLabel(subLabel, 'wrong3');
                    // Fallback (untagged, so no targeted hint) if that time was somehow already taken
                    for (const off of [30, -30, 10, -10, 5, -5, 20, -20]) {
                        if (labelSet.size >= 4) break;
                        const m = ((endMin + off) % 60 + 60) % 60;
                        const cand = `${endHour}:${String(m).padStart(2, '0')}`;
                        if (!labelSet.has(cand)) addLabel(cand, 'wrong4');
                    }
                    const options = Engine.Utils.shuffle([...labelSet]).map(l => ({label: l, value: valueMap[l]}));

                    const result = {
                        type: 'multiple-choice',
                        questionText: `⏰ A monster training session starts at ${startStr} and lasts ${elapsedHours > 0 ? elapsedHours + ' hour' + (elapsedHours > 1 ? 's' : '') + ' and ' : ''}${elapsedMins} minutes.<br>What time does it end?`,
                        visual: `<div style="text-align:center;font-size:1.5rem;font-weight:700;color:var(--monster-red);">⏰ 🐲 Start: ${startStr}</div>`,
                        answer,
                        options,
                        hint1: `Start at ${startStr} and count forward ${elapsedHours > 0 ? elapsedHours + ' hour(s) and ' : ''}${elapsedMins} minutes`,
                        hint2: `Add the hours first, then the minutes`,
                        hint3: `The session ends at ${answer}`,
                        diagnose(userAnswer) {
                            if (userAnswer === 'wrong1') return 'minutes-off';
                            if (userAnswer === 'wrong2') return 'hour-off';
                            if (userAnswer === 'wrong3') return 'subtracted-minutes';
                            return null;
                        },
                        misconceptionHints: {
                            'minutes-off': `Check your minute calculation. Start at ${startMin} minutes and add ${elapsedMins} minutes carefully.`,
                            'hour-off': `The minutes are right, but re-check the hour. Did you count the hours correctly from ${startHour}?`,
                            'subtracted-minutes': `We need to count FORWARD in time, not backward! Add the minutes to the start time.`
                        }
                    };

                    if (modality === 'worked-example') {
                        result.workedExample = answer === '4:15'
                            ? `<div style="text-align:center"><p><strong>Example:</strong> Start 3:15 PM, lasts 2 hours and 30 minutes</p><p>3:15 + 2 hours = 5:15</p><p>5:15 + 30 min = <strong>5:45 PM</strong></p></div>`
                            : `<div style="text-align:center"><p><strong>Example:</strong> Start 2:30 PM, lasts 1 hour and 45 minutes</p><p>2:30 + 1 hour = 3:30</p><p>3:30 + 45 min = <strong>4:15 PM</strong></p></div>`;
                    }

                    if (modality === 'visual') {
                        result.visual = `<div style="text-align:center">
                            <div style="font-size:2rem;margin-bottom:0.5rem;">⏰🐲⏰</div>
                            <div style="display:flex;justify-content:center;align-items:center;gap:0.5rem;flex-wrap:wrap;margin:0.5rem 0;">
                                <div style="background:var(--monster-red);color:#fff;border-radius:8px;padding:0.4rem 0.9rem;font-weight:700;">🕐 Start<br>${startStr}</div>
                                <div style="font-size:1.2rem;font-weight:700;">+${elapsedHours > 0 ? elapsedHours + 'h ' : ''}${elapsedMins}m</div>
                                <div style="background:var(--monster-red);color:#fff;border-radius:8px;padding:0.4rem 0.9rem;font-weight:700;">🕐 End<br>?</div>
                            </div>
                            <p style="font-size:0.85rem;color:#666;margin-top:0.4rem;">👾 Add hours first, then minutes!</p>
                        </div>`;
                    }

                    return result;
                }
            },
            // 7. Measurement Boss
            {
                skillId: '4meas-boss',
                generate(diff, modality) {
                    const type = pick(['length', 'weight', 'metric']);

                    if (type === 'length') {
                        const feet = R(2, 10);
                        const answer = feet * 12;
                        const result = {
                            type: 'input',
                            questionText: `⚡ BOSS BATTLE! 🐲 ${feet} feet = ? inches`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">⚡🐲⚡</div>`,
                            answer,
                            hint1: `1 foot = 12 inches`,
                            hint2: `${feet} × 12 = ?`,
                            hint3: `${feet} feet = ${answer} inches`,
                            diagnose(userAnswer) {
                                if (userAnswer === feet / 12) return 'divided-instead';
                                return null;
                            },
                            misconceptionHints: {
                                'divided-instead': `Feet to inches means MULTIPLY! ${feet} × 12 = ${answer}.`
                            }
                        };
                        if (modality === 'worked-example') {
                            const weFt = feet === 2 ? 3 : 2;
                            result.workedExample = `<div style="text-align:center"><p><strong>🐲 Boss Example:</strong> ${weFt} feet = ? inches</p><p>1 foot = 12 inches</p><p>${weFt} × 12 = <strong>${weFt * 12} inches</strong></p><p>⚡ Bigger unit → smaller unit = MULTIPLY!</p></div>`;
                        }
                        if (modality === 'visual') {
                            result.visual = `<div style="text-align:center">
                                <div style="font-size:3rem;animation:bounce 0.6s ease-in-out infinite;">⚡🐲⚡</div>
                                <div style="display:flex;justify-content:center;align-items:center;gap:0.3rem;margin:0.5rem 0;">
                                    <div style="background:var(--monster-red);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;">${feet} ft</div>
                                    <span style="font-size:1.3rem;">→ × 12 →</span>
                                    <div style="background:var(--monster-red);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;">? in</div>
                                </div>
                            </div>`;
                        }
                        return result;
                    } else if (type === 'weight') {
                        const lb = R(2, 8);
                        const answer = lb * 16;
                        const result = {
                            type: 'input',
                            questionText: `🔥 BOSS BATTLE! 🦖 ${lb} pounds = ? ounces`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">🔥🦖🔥</div>`,
                            answer,
                            hint1: `1 pound = 16 ounces`,
                            hint2: `${lb} × 16 = ?`,
                            hint3: `${lb} lb = ${answer} oz`,
                            diagnose(userAnswer) {
                                if (userAnswer === lb / 16) return 'divided-instead';
                                return null;
                            },
                            misconceptionHints: {
                                'divided-instead': `Pounds to ounces means MULTIPLY! ${lb} × 16 = ${answer}.`
                            }
                        };
                        if (modality === 'worked-example') {
                            const weLb = lb === 3 ? 4 : 3;
                            result.workedExample = `<div style="text-align:center"><p><strong>🦖 Boss Example:</strong> ${weLb} pounds = ? ounces</p><p>1 pound = 16 ounces</p><p>${weLb} × 16 = <strong>${weLb * 16} ounces</strong></p><p>🔥 Bigger unit → smaller unit = MULTIPLY!</p></div>`;
                        }
                        if (modality === 'visual') {
                            result.visual = `<div style="text-align:center">
                                <div style="font-size:3rem;animation:bounce 0.6s ease-in-out infinite;">🔥🦖🔥</div>
                                <div style="display:flex;justify-content:center;align-items:center;gap:0.3rem;margin:0.5rem 0;">
                                    <div style="background:var(--monster-blue);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;">${lb} lb</div>
                                    <span style="font-size:1.3rem;">→ × 16 →</span>
                                    <div style="background:var(--monster-blue);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;">? oz</div>
                                </div>
                            </div>`;
                        }
                        return result;
                    } else {
                        const m = R(2, 10);
                        const answer = m * 100;
                        const result = {
                            type: 'input',
                            questionText: `👾 BOSS BATTLE! 🐲 ${m} meters = ? centimeters`,
                            visual: `<div style="font-size:3rem;text-align:center;animation:bounce 0.6s ease-in-out infinite;">👾🐲👾</div>`,
                            answer,
                            hint1: `1 meter = 100 centimeters`,
                            hint2: `${m} × 100 = ?`,
                            hint3: `${m} m = ${answer} cm`,
                            diagnose(userAnswer) {
                                if (userAnswer === m / 100) return 'divided-instead';
                                return null;
                            },
                            misconceptionHints: {
                                'divided-instead': `Meters to centimeters means MULTIPLY! ${m} × 100 = ${answer}.`
                            }
                        };
                        if (modality === 'worked-example') {
                            const weM = m === 3 ? 4 : 3;
                            result.workedExample = `<div style="text-align:center"><p><strong>👾 Boss Example:</strong> ${weM} meters = ? centimeters</p><p>1 meter = 100 centimeters</p><p>${weM} × 100 = <strong>${weM * 100} centimeters</strong></p><p>🐲 Bigger unit → smaller unit = MULTIPLY!</p></div>`;
                        }
                        if (modality === 'visual') {
                            result.visual = `<div style="text-align:center">
                                <div style="font-size:3rem;animation:bounce 0.6s ease-in-out infinite;">👾🐲👾</div>
                                <div style="display:flex;justify-content:center;align-items:center;gap:0.3rem;margin:0.5rem 0;">
                                    <div style="background:var(--monster-green);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;">${m} m</div>
                                    <span style="font-size:1.3rem;">→ × 100 →</span>
                                    <div style="background:var(--monster-green);color:#fff;border-radius:8px;padding:0.4rem 0.8rem;font-weight:700;">? cm</div>
                                </div>
                            </div>`;
                        }
                        return result;
                    }
                }
            }
        ];
    }
};
