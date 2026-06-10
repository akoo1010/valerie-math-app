/* ===== UNIT 10: TIME — Swimming Theme 🏊 ===== */

const Time = {
    id: 'time',
    title: 'Time',
    icon: '🏊',
    theme: 'swim',
    description: "Tell time like a swim team champ! Read clocks, measure race durations, and build swim meet schedules!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        function formatTime(h, m) {
            const period = h >= 12 ? 'PM' : 'AM';
            const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
            return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
        }

        function clockSVG(h, m, size = 200) {
            const cx = size / 2, cy = size / 2, r = size / 2 - 10;
            // Hour hand angle
            const hourAngle = ((h % 12) + m / 60) * 30 - 90;
            const hourRad = hourAngle * Math.PI / 180;
            const hourLen = r * 0.5;
            const hx = cx + Math.cos(hourRad) * hourLen;
            const hy = cy + Math.sin(hourRad) * hourLen;
            // Minute hand angle
            const minAngle = m * 6 - 90;
            const minRad = minAngle * Math.PI / 180;
            const minLen = r * 0.75;
            const mx = cx + Math.cos(minRad) * minLen;
            const my = cy + Math.sin(minRad) * minLen;
            // Numbers
            let nums = '';
            for (let i = 1; i <= 12; i++) {
                const angle = (i * 30 - 90) * Math.PI / 180;
                const nx = cx + Math.cos(angle) * (r - 20);
                const ny = cy + Math.sin(angle) * (r - 20);
                nums += `<text class="clock-number" x="${nx}" y="${ny}">${i}</text>`;
            }
            // Tick marks
            let ticks = '';
            for (let i = 0; i < 60; i++) {
                const angle = (i * 6 - 90) * Math.PI / 180;
                const outerR = r - 4;
                const innerR = i % 5 === 0 ? r - 14 : r - 8;
                ticks += `<line x1="${cx + Math.cos(angle) * innerR}" y1="${cy + Math.sin(angle) * innerR}" x2="${cx + Math.cos(angle) * outerR}" y2="${cy + Math.sin(angle) * outerR}" stroke="rgba(255,255,255,0.2)" stroke-width="${i % 5 === 0 ? 2 : 1}"/>`;
            }
            return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                <circle class="clock-face" cx="${cx}" cy="${cy}" r="${r}"/>
                ${ticks}${nums}
                <line class="clock-hand-hour" x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}"/>
                <line class="clock-hand-minute" x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}"/>
                <circle class="clock-center" cx="${cx}" cy="${cy}" r="4"/>
            </svg>`;
        }

        return [
            // 1. Clock Reader — read the time
            {
                skillId: 'time-read',
                generate(diff) {
                    const h = R(1, 12);
                    const m = diff >= 2 ? R(0, 11) * 5 : pick([0, 15, 30, 45]);
                    const answer = formatTime(h, m);
                    const options = [answer];
                    while (options.length < 4) {
                        const fakeH = R(1, 12);
                        const fakeM = R(0, 11) * 5;
                        const fake = formatTime(fakeH, fakeM);
                        if (!options.includes(fake)) options.push(fake);
                    }
                    return {
                        type: 'multiple-choice',
                        questionText: `What time does this clock show?`,
                        subText: '🏊 Time for a swim meet event!',
                        visual: `<div class="clock-container" style="width:200px;height:200px">${clockSVG(h, m)}</div>`,
                        answer,
                        options: Engine.Utils.shuffle(options).map(o => ({label: o, value: o})),
                        hint1: `The short hand (blue) shows the hour, the long hand (pink) shows the minutes`,
                        hint2: `Hour hand points near ${h}. Minute hand: each number = 5 minutes`,
                        hint3: `The time is ${answer}`
                    };
                }
            },
            // 2. Clock Setter — type the time
            {
                skillId: 'time-set',
                generate(diff) {
                    const h = R(1, 12);
                    // Exclude m=0 to avoid trivial "0 minutes past" question
                    const m = diff >= 2 ? R(1, 11) * 5 : pick([15, 30, 45]);
                    return {
                        type: 'input',
                        questionText: `The swim race starts at ${formatTime(h, m)}.<br>How many minutes past ${h > 12 ? h - 12 : h} o'clock is that?`,
                        answer: m,
                        visual: `<div class="clock-container" style="width:180px;height:180px">${clockSVG(h, m, 180)}</div>`,
                        hint1: `Look at where the minute hand is pointing`,
                        hint2: `Each number on the clock is 5 minutes. Count by 5s from 12.`,
                        hint3: `It is ${m} minutes past ${h > 12 ? h - 12 : h}`
                    };
                }
            },
            // 3. Race Duration — elapsed time
            {
                skillId: 'time-elapsed',
                generate(diff) {
                    const startH = R(1, 10);
                    const startM = R(0, 5) * 10;
                    const duration = diff >= 2 ? R(15, 90) : R(10, 45);
                    const endTotalM = startH * 60 + startM + duration;
                    const endH = Math.floor(endTotalM / 60);
                    const endM = endTotalM % 60;
                    return {
                        type: 'input',
                        questionText: `The 50m freestyle started at ${formatTime(startH, startM)} and ended at ${formatTime(endH, endM)}.<br>How many minutes was the race?`,
                        inputSuffix: 'minutes',
                        answer: duration,
                        visual: `<div style="display:flex;gap:30px;align-items:center;">
                            <div style="text-align:center">
                                <div style="font-size:0.8rem;color:var(--text-muted)">START</div>
                                <div class="clock-container" style="width:120px;height:120px">${clockSVG(startH, startM, 120)}</div>
                                <div style="font-weight:700">${formatTime(startH, startM)}</div>
                            </div>
                            <div style="font-size:2rem">→</div>
                            <div style="text-align:center">
                                <div style="font-size:0.8rem;color:var(--text-muted)">END</div>
                                <div class="clock-container" style="width:120px;height:120px">${clockSVG(endH, endM, 120)}</div>
                                <div style="font-weight:700">${formatTime(endH, endM)}</div>
                            </div>
                        </div>`,
                        hint1: `Count from the start time to the end time`,
                        hint2: `From ${formatTime(startH, startM)} to ${formatTime(endH, endM)}...`,
                        hint3: `The race lasted ${duration} minutes`
                    };
                }
            },
            // 4. Schedule Builder
            {
                skillId: 'time-schedule',
                generate(diff) {
                    const startH = R(8, 14);
                    const startM = pick([0, 15, 30]);
                    const duration = pick([15, 20, 30, 45]);
                    const endTotalM = startH * 60 + startM + duration;
                    const endH = Math.floor(endTotalM / 60);
                    const endM = endTotalM % 60;
                    const events = ['Warm-up', 'Freestyle', 'Backstroke', 'Butterfly', 'Cool-down'];
                    const event = pick(events);
                    return {
                        type: 'multiple-choice',
                        questionText: `${event} starts at ${formatTime(startH, startM)} and lasts ${duration} minutes.<br>What time does it end?`,
                        answer: formatTime(endH, endM),
                        options: (() => {
                            const opts = [formatTime(endH, endM)];
                            while (opts.length < 4) {
                                const fakeEnd = endTotalM + pick([-15, -10, 10, 15, 30]);
                                const fH = Math.floor(fakeEnd / 60), fM = fakeEnd % 60;
                                const ft = formatTime(fH, fM >= 0 ? fM : 0);
                                if (!opts.includes(ft)) opts.push(ft);
                            }
                            return Engine.Utils.shuffle(opts).map(o => ({label: o, value: o}));
                        })(),
                        hint1: `Start at ${formatTime(startH, startM)} and add ${duration} minutes`,
                        hint2: (startM + duration < 60)
                            ? `${startM} + ${duration} = ${startM + duration} minutes past ${startH > 12 ? startH - 12 : startH}`
                            : `${startM} + ${duration} = ${startM + duration} minutes — that's more than 60, so it crosses into the next hour`,
                        hint3: `${event} ends at ${formatTime(endH, endM)}`
                    };
                }
            },
            // 5. AM/PM Events
            {
                skillId: 'time-ampm',
                generate(diff) {
                    const events = [
                        { name: 'Morning swim practice', h: R(6, 11), ampm: 'AM' },
                        { name: 'Afternoon swim meet', h: R(1, 5), ampm: 'PM' },
                        { name: 'Evening pool party', h: R(5, 8), ampm: 'PM' },
                        { name: 'Early morning warm-up', h: R(5, 8), ampm: 'AM' },
                    ];
                    const e = pick(events);
                    return {
                        type: 'multiple-choice',
                        questionText: `"${e.name}" at ${e.h}:00.<br>Is this AM or PM?`,
                        // Neutral visual — don't give away AM/PM with a 🌅/🌆 that matches an option label
                        visual: `<div style="font-size:3rem">🕐</div>`,
                        answer: e.ampm,
                        options: [{label: 'AM (morning)', value: 'AM'}, {label: 'PM (afternoon/evening)', value: 'PM'}],
                        hint1: `AM = midnight to noon. PM = noon to midnight.`,
                        hint2: `"${e.name}" — does this happen in the morning or afternoon/evening?`,
                        hint3: `${e.name} is in the ${e.ampm}!`
                    };
                }
            },
            // 6. Time Word Problems
            {
                skillId: 'time-word',
                generate(diff) {
                    const laps = R(3, 8);
                    const minsPerLap = R(2, 5);
                    const total = laps * minsPerLap;
                    return {
                        type: 'input',
                        questionText: `Valerie swims ${laps} laps. Each lap takes ${minsPerLap} minutes.<br>How many minutes total?`,
                        inputSuffix: 'min',
                        answer: total,
                        visual: `<div style="font-size:2rem">🏊⏱️</div>`,
                        hint1: `Multiply the number of laps by time per lap`,
                        hint2: `${laps} × ${minsPerLap} = ?`,
                        hint3: `${laps} × ${minsPerLap} = ${total} minutes`
                    };
                }
            },
            // 7. Countdown Timer
            {
                skillId: 'time-countdown',
                generate(diff) {
                    const now = R(1, 10);
                    const nowM = pick([0, 15, 30, 45]);
                    const delta = R(10, 40);
                    const totalEventM = now * 60 + nowM + delta;
                    const eventH = Math.floor(totalEventM / 60);
                    const eventM = totalEventM % 60;
                    const answer = delta;
                    return {
                        type: 'input',
                        questionText: `It's ${formatTime(now, nowM)} now. The swim race starts at ${formatTime(eventH, eventM)}.<br>How many minutes until the race?`,
                        inputSuffix: 'minutes',
                        answer,
                        visual: `<div style="font-size:3rem;animation:pulse 1.5s infinite;">⏰</div>`,
                        hint1: `Count the minutes from the current time up to the race time`,
                        hint2: eventH === now
                            ? `From :${nowM.toString().padStart(2,'0')} to :${eventM.toString().padStart(2,'0')}`
                            : `Count up to the next hour, then add the rest`,
                        hint3: `It's ${answer} minutes until the race`
                    };
                }
            }
        ];
    }
};
