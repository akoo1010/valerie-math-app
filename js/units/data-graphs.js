/* ===== UNIT 12: DATA & GRAPHS — Swimming Theme 🏊 ===== */

const DataGraphs = {
    id: 'data-graphs',
    title: 'Data & Graphs',
    icon: '🏊',
    theme: 'swim',
    description: "Track swim stats with graphs! Read bar graphs, make picture graphs, and analyze swim meet data!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;
        const colors = ['var(--ocean-glow)','var(--gd-pink)','var(--gd-green)','var(--gd-yellow)','var(--craft-lavender)'];

        function barGraphHTML(data, maxVal, showValues = true) {
            // Build a y-axis tick list so kids can read bar heights even without printed values.
            // Each label is centred exactly at its height: the bars' baseline sits 32px above the
            // bottom (2px border + 10px padding + 16px bar label + 4px gap), so label t is at 32 + t*tickHeight.
            const ticks = Array.from({length: maxVal + 1}, (_, i) => i);
            const tickHeight = 120 / Math.max(maxVal, 1);
            return `<div style="display:flex;gap:8px;justify-content:center;">
                <div style="position:relative;width:1.6em;height:160px;font-size:0.65rem;color:var(--text-secondary);font-weight:700;">
                    ${ticks.map(t => `<div style="position:absolute;right:0;bottom:${32 + t * tickHeight}px;transform:translateY(50%);line-height:1;">${t}</div>`).join('')}
                </div>
                <div style="display:flex;align-items:flex-end;gap:12px;height:160px;padding:10px;border-left:2px solid rgba(255,255,255,0.3);border-bottom:2px solid rgba(255,255,255,0.3);">
                    ${data.map((d,i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;">
                        ${showValues ? `<span style="font-size:0.7rem;font-weight:800">${d.value}</span>` : ''}
                        <div style="width:36px;height:${(d.value/maxVal)*120}px;background:${colors[i%colors.length]};border-radius:4px 4px 0 0;min-height:4px;"></div>
                        <span style="font-size:0.65rem;font-weight:700;color:var(--text-secondary);text-align:center;max-width:60px;height:16px;line-height:16px;">${d.label}</span>
                    </div>`).join('')}
                </div>
            </div>`;
        }

        return [
            // 1. Read Bar Graph
            {
                skillId: 'data-read-bar',
                generate(diff) {
                    const events = ['Freestyle','Backstroke','Butterfly','Breaststroke'];
                    const data = events.map(e => ({label: e, value: R(2, 12)}));
                    const maxVal = Math.max(...data.map(d => d.value));
                    const askAbout = pick(data);
                    return {
                        type: 'input',
                        questionText: `How many swimmers are in the ${askAbout.label} event?`,
                        // Hide printed values so the student must read bar height against the y-axis
                        visual: barGraphHTML(data, maxVal, false),
                        answer: askAbout.value,
                        hint1: `Find the ${askAbout.label} bar and read its height against the y-axis`,
                        hint2: `Slide your finger straight across from the top of the bar to the numbers on the side`,
                        hint3: `${askAbout.label} has ${askAbout.value} swimmers`
                    };
                }
            },
            // 2. Compare Bar Graph
            {
                skillId: 'data-compare-bar',
                generate(diff) {
                    const events = ['Freestyle','Backstroke','Butterfly','Breaststroke'];
                    // Assign unique values so there's exactly one maximum
                    const pool = Engine.Utils.shuffle([2,3,4,5,6,7,8,9,10,11,12]).slice(0, events.length);
                    const data = events.map((e, i) => ({label: e, value: pool[i]}));
                    const maxVal = Math.max(...data.map(d => d.value));
                    const sorted = [...data].sort((a,b) => b.value - a.value);
                    return {
                        type: 'multiple-choice',
                        questionText: `Which event has the MOST swimmers?`,
                        visual: barGraphHTML(data, maxVal),
                        answer: sorted[0].label,
                        options: Engine.Utils.shuffle(events).map(o=>({label:o,value:o})),
                        hint1: `Look for the tallest bar`,
                        hint2: `Compare the heights of all the bars`,
                        hint3: `${sorted[0].label} has the most with ${sorted[0].value} swimmers!`
                    };
                }
            },
            // 3. Picture Graph
            {
                skillId: 'data-picture',
                generate(diff) {
                    const swimmers = ['Valerie','Emma','Sophia','Liam'];
                    const data = swimmers.map(s => ({label:s, value:R(1,6)}));
                    const askAbout = pick(data);
                    const icon = '🏅';
                    return {
                        type: 'input',
                        questionText: `How many medals did ${askAbout.label} win?`,
                        visual: `<div class="picture-graph" style="width:100%;">
                            ${data.map(d => `<div class="picture-graph-row">
                                <span class="picture-graph-label">${d.label}</span>
                                <div class="picture-graph-icons">${Array(d.value).fill(`<span class="picture-graph-icon">${icon}</span>`).join('')}</div>
                            </div>`).join('')}
                        </div>`,
                        answer: askAbout.value,
                        hint1: `Find ${askAbout.label}'s row and count the ${icon}`,
                        hint2: `Count carefully...`,
                        hint3: `${askAbout.label} won ${askAbout.value} medal${askAbout.value === 1 ? '' : 's'}`
                    };
                }
            },
            // 4. Picture Graph Total
            {
                skillId: 'data-picture-total',
                generate(diff) {
                    const teams = ['Sharks','Dolphins','Rays'];
                    const data = teams.map(t => ({label:t, value:R(2,7)}));
                    const total = data.reduce((a,d) => a + d.value, 0);
                    return {
                        type: 'input',
                        questionText: `How many total wins across ALL teams?`,
                        visual: `<div class="picture-graph" style="width:100%;">
                            ${data.map(d => `<div class="picture-graph-row">
                                <span class="picture-graph-label">${d.label}</span>
                                <div class="picture-graph-icons">${Array(d.value).fill('<span class="picture-graph-icon">🏆</span>').join('')}</div>
                            </div>`).join('')}
                        </div>`,
                        answer: total,
                        hint1: `Count ALL the trophies in every row`,
                        hint2: `${data.map(d=>d.value).join(' + ')} = ?`,
                        hint3: `Total = ${total} wins`
                    };
                }
            },
            // 5. Line Plot
            {
                skillId: 'data-lineplot',
                generate(diff) {
                    const times = Array.from({length:8}, () => R(30, 50));
                    const min = Math.min(...times);
                    return {
                        type: 'input',
                        questionText: `What is the FASTEST (lowest) lap time?`,
                        inputSuffix: 'seconds',
                        visual: `<div style="text-align:center;">
                            <div style="font-weight:700;margin-bottom:8px;color:var(--ocean-glow);">Valerie's Lap Times (seconds)</div>
                            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                                ${times.map(t => `<div style="padding:6px 10px;background:rgba(69,183,209,0.15);border:1px solid rgba(69,183,209,0.3);border-radius:8px;font-weight:700;">${t}s</div>`).join('')}
                            </div>
                        </div>`,
                        answer: min,
                        hint1: `Look for the smallest number — that's the fastest time!`,
                        hint2: `Compare all the times...`,
                        hint3: `The fastest time is ${min} seconds`
                    };
                }
            },
            // 6. How Many More
            {
                skillId: 'data-difference',
                generate(diff) {
                    const events = ['Freestyle','Backstroke','Butterfly','Breaststroke'];
                    // Use a unique-values pool so the two compared bars never tie
                    const pool = Engine.Utils.shuffle([3,4,5,6,7,8,9,10,11,12]).slice(0, events.length);
                    const data = events.map((e, i) => ({label:e, value:pool[i]}));
                    const maxVal = Math.max(...data.map(d=>d.value));
                    const [a, b] = Engine.Utils.shuffle(data).slice(0, 2);
                    const answer = Math.abs(a.value - b.value);
                    return {
                        type: 'input',
                        questionText: `How many MORE swimmers are in ${a.value>b.value?a.label:b.label} than ${a.value>b.value?b.label:a.label}?`,
                        visual: barGraphHTML(data, maxVal),
                        answer,
                        hint1: `Subtract the smaller number from the bigger number`,
                        hint2: `${Math.max(a.value,b.value)} − ${Math.min(a.value,b.value)} = ?`,
                        hint3: `The difference is ${answer}`
                    };
                }
            },
            // 7. Data Word Problems
            {
                skillId: 'data-word',
                generate(diff) {
                    const events = ['Freestyle','Backstroke','Butterfly'];
                    const v = events.map(()=>R(3,10));
                    const total = v.reduce((a,b)=>a+b,0);
                    return {
                        type: 'input',
                        questionText: `At the swim meet: ${events[0]} had ${v[0]} swimmers, ${events[1]} had ${v[1]}, and ${events[2]} had ${v[2]}. How many swimmers total?`,
                        visual: `<div style="font-size:2rem">🏊📊</div>`,
                        answer: total,
                        hint1: `Add all three numbers together`,
                        hint2: `${v.join(' + ')} = ?`,
                        hint3: `Total = ${total} swimmers`
                    };
                }
            }
        ];
    }
};
