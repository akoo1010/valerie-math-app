/* ===== UNIT 11: MEASUREMENT — Arts & Crafts Theme 🎨 ===== */

const Measurement = {
    id: 'measurement',
    title: 'Measurement',
    icon: '🎨',
    theme: 'craft',
    description: "Measure, weigh, and pour like a crafting pro!",
    exerciseCount: 7,

    getExercises() {
        const R = Engine.Utils.rand;
        const pick = Engine.Utils.pick;

        return [
            {
                skillId: 'meas-ruler',
                generate(diff) {
                    const length = R(2, diff >= 2 ? 15 : 10);
                    return {
                        type: 'input',
                        questionText: pick([`How long is this ribbon?`, `How long is this strip of washi tape?`, `Valerie cut a piece of yarn. How long is it?`]),
                        inputSuffix: 'cm',
                        // Ticks are placed at i/length of the ribbon's width, so the last tick sits exactly at its end
                        visual: `<div style="text-align:center;">
                            <div style="background:linear-gradient(90deg,var(--craft-pink),var(--craft-lavender));height:20px;width:${length*20}px;border-radius:4px;max-width:100%;"></div>
                            <div style="position:relative;width:${length*20}px;max-width:100%;height:16px;margin-top:2px;">
                                ${Array.from({length:length+1},(_,i)=>`<div style="position:absolute;top:0;left:${(i/length)*100}%;white-space:nowrap;font-size:0.65rem;font-weight:700;color:var(--text-muted);border-left:2px solid rgba(255,255,255,0.3);padding-left:2px;">${i}</div>`).join('')}
                            </div>
                        </div>`,
                        answer: length,
                        hint1: `Read the number at the end of the ribbon`,
                        // Count jumps, not tick marks: the ruler has one more tick than cm (0 is a tick too)
                        hint2: `Start at 0 and count each 1 cm jump until you reach the end of the ribbon`,
                        hint3: `The ribbon is ${length} cm long`
                    };
                }
            },
            {
                skillId: 'meas-liquid',
                generate(diff) {
                    const amount = R(1, 5);
                    return {
                        type: 'input',
                        questionText: pick([`How much paint is in the cup?`, `How much glue is in the jar?`, `How much water is in the paint-rinse cup?`]),
                        inputSuffix: 'L',
                        visual: `<div style="width:80px;height:120px;border:3px solid rgba(255,255,255,0.3);border-radius:0 0 8px 8px;position:relative;margin:0 auto;overflow:hidden;">
                            <div style="position:absolute;bottom:0;left:0;right:0;height:${(amount/5)*100}%;background:linear-gradient(180deg,rgba(205,180,219,0.6),rgba(255,143,175,0.8));"></div>
                            ${Array.from({length:5},(_,i)=>`<div style="position:absolute;top:${100-((i+1)/5)*100}%;left:0;right:0;border-top:1px solid rgba(255,255,255,0.2);font-size:0.5rem;text-align:right;padding-right:4px;">${i+1}</div>`).join('')}
                        </div>`,
                        answer: amount,
                        hint1: `Read the level against the markings`,
                        hint2: `Put your finger on the top of the paint and slide it across to the numbers — which line does it reach?`,
                        hint3: `There are ${amount} liters`
                    };
                }
            },
            {
                skillId: 'meas-mass',
                generate(diff) {
                    // Realistic gram weights for craft supplies (whole tens), always two different items
                    const supplies = [
                        { name: 'glue bottle', emoji: '🧴', lo: 5, hi: 15 },
                        { name: 'scissors', emoji: '✂️', lo: 6, hi: 14 },
                        { name: 'paint jar', emoji: '🎨', lo: 15, hi: 40 },
                        { name: 'yarn ball', emoji: '🧶', lo: 8, hi: 20 },
                        { name: 'sketchbook', emoji: '📓', lo: 25, hi: 60 },
                        { name: 'crayon box', emoji: '🖍️', lo: 10, hi: 30 }
                    ];
                    const [sa, sb] = Engine.Utils.shuffle(supplies).slice(0, 2);
                    const a = { ...sa, w: R(sa.lo, sa.hi) * 10 };
                    const b = { ...sb, w: R(sb.lo, sb.hi) * 10 };
                    while (b.w === a.w) b.w = R(sb.lo, sb.hi) * 10;
                    const heavier = a.w > b.w ? a.name : b.name;
                    return {
                        type: 'multiple-choice',
                        questionText: `The ${a.name} ${a.emoji} weighs ${a.w} g. The ${b.name} ${b.emoji} weighs ${b.w} g. Which is heavier?`,
                        // Pans stay level with a ❓: a tipped scale would show which one is heavier before she compares
                        visual: `<div class="balance-scale"><div class="scale-pan">${a.emoji}<br>${a.w} g</div><div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><span style="font-size:1.5rem">❓</span><div class="scale-beam"></div></div><div class="scale-pan">${b.emoji}<br>${b.w} g</div></div>`,
                        answer: heavier,
                        options: [{label:`${a.emoji} ${a.name}`,value:a.name},{label:`${b.emoji} ${b.name}`,value:b.name}],
                        hint1: `Compare: ${a.w} g vs ${b.w} g`,
                        hint2: `More grams means heavier. Compare the hundreds digits first, then the tens.`,
                        hint3: `The ${heavier} is heavier!`
                    };
                }
            },
            {
                skillId: 'meas-convert',
                generate(diff) {
                    const c = pick([{f:'meters',t:'centimeters',x:100},{f:'kilograms',t:'grams',x:1000},{f:'liters',t:'milliliters',x:1000}]);
                    const v = R(1,5);
                    return {
                        type: 'input',
                        questionText: pick([
                            `Convert: ${v} ${c.f} = ? ${c.t}`,
                            `A craft recipe uses ${v} ${c.f}. How many ${c.t} is that?`
                        ]),
                        inputSuffix: c.t,
                        answer: v * c.x,
                        // When v is 1 the unit fact IS the answer, so halve the 2-unit fact instead
                        hint1: v === 1 ? `2 ${c.f} = ${2 * c.x} ${c.t}, and 1 ${c.f.slice(0,-1)} is half of that` : `1 ${c.f.slice(0,-1)} = ${c.x} ${c.t}`,
                        hint2: v === 1 ? `${2 * c.x} ÷ 2 = ?` : `${v} × ${c.x} = ?`,
                        hint3: `${v} ${c.f} = ${v*c.x} ${c.t}`
                    };
                }
            },
            {
                skillId: 'meas-estimate',
                generate(diff) {
                    // tip = a benchmark to estimate from, not the answer itself
                    const item = pick([
                        {n:'pencil',r:18,u:'cm',e:'✏️',tip:'Your hand is about 15 cm long. About how many hands long is a pencil?'},
                        {n:'book',r:25,u:'cm',e:'📚',tip:'A school ruler is 30 cm long. Is a book longer or shorter than a ruler — and by how much?'},
                        {n:'apple',r:200,u:'g',e:'🍎',tip:'About 5 apples weigh 1 kilogram, which is 1000 g. So 1 apple is about 1000 ÷ 5 = ?'},
                        {n:'crayon',r:9,u:'cm',e:'🖍️',tip:'Your hand is about 15 cm long. Is a crayon shorter or longer than your hand?'},
                        {n:'paintbrush',r:20,u:'cm',e:'🖌️',tip:'A school ruler is 30 cm long. Is a paintbrush a bit shorter than a ruler, or much longer?'},
                        {n:'door',r:200,u:'cm',e:'🚪',tip:'A grown-up is about 170 cm tall, and a door is a little taller than a grown-up.'},
                        {n:'banana',r:120,u:'g',e:'🍌',tip:'About 8 bananas weigh 1 kilogram (1000 g). Is one banana closer to 100 g or 1000 g?'}
                    ]);
                    const opts = Engine.Utils.shuffle([item.r, item.r*10, Math.round(item.r/5), item.r*3]);
                    return {
                        type: 'multiple-choice',
                        questionText: `About how ${item.u==='g'?'heavy':(item.n === 'door' ? 'tall' : 'long')} is ${/^[aeiou]/.test(item.n) ? 'an' : 'a'} ${item.n}?`,
                        visual: `<div style="font-size:3rem">${item.e}</div>`,
                        answer: item.r,
                        options: opts.map(o=>({label:`${o} ${item.u}`,value:o})),
                        hint1: `Think about the real size of a ${item.n}`,
                        hint2: item.tip,
                        hint3: `Approximately ${item.r} ${item.u}`
                    };
                }
            },
            {
                skillId: 'meas-word',
                generate(diff) {
                    const l=R(5,20), p=R(2,5);
                    return {
                        type: 'input',
                        questionText: pick([
                            `Valerie needs ${p} ribbons, each ${l} cm. How much ribbon total?`,
                            `Each bookmark uses ${l} cm of yarn. How much yarn for ${p} bookmarks?`,
                            `Valerie lines up ${p} craft sticks end to end. Each is ${l} cm. How long is the line?`
                        ]),
                        inputSuffix: 'cm',
                        answer: l*p,
                        visual: `<div style="font-size:2rem">📏✂️</div>`,
                        hint1: `Multiply the length of one piece by the number of pieces`,
                        hint2: `${l} × ${p} = ?`,
                        hint3: `${l} × ${p} = ${l*p} cm`
                    };
                }
            },
            {
                skillId: 'meas-tool',
                generate(diff) {
                    const t = pick([
                        {task:'Measure ribbon length',tool:'Ruler',kind:'length',how:'lay flat along the ribbon'},
                        {task:'Weigh beads',tool:'Scale',kind:'weight',how:'set the beads on'},
                        {task:'Measure paint volume',tool:'Measuring cup',kind:'liquid',how:'pour the paint into'}
                    ]);
                    return {
                        type: 'multiple-choice',
                        questionText: `Which tool? "${t.task}"`,
                        answer: t.tool,
                        options: Engine.Utils.shuffle(['Ruler','Scale','Measuring cup','Thermometer']).map(o=>({label:o,value:o})),
                        hint1: `First ask: are you measuring how long, how heavy, or how much liquid?`,
                        hint2: `This measures ${t.kind}. Which tool would you ${t.how}?`,
                        hint3: `Use a ${t.tool}!`
                    };
                }
            }
        ];
    }
};
