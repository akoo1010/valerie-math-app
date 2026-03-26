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
                        questionText: `How long is this ribbon?`,
                        inputSuffix: 'cm',
                        visual: `<div style="text-align:center;">
                            <div style="background:linear-gradient(90deg,var(--craft-pink),var(--craft-lavender));height:20px;width:${length*20}px;border-radius:4px;max-width:100%;"></div>
                            <div style="display:flex;width:${length*20}px;max-width:100%;margin-top:2px;">
                                ${Array.from({length:length+1},(_,i)=>`<div style="flex:${i===length?'0':'1'};text-align:left;font-size:0.65rem;font-weight:700;color:var(--text-muted);border-left:2px solid rgba(255,255,255,0.3);padding-left:2px;">${i}</div>`).join('')}
                            </div>
                        </div>`,
                        answer: length,
                        hint1: `Read the number at the end of the ribbon`,
                        hint2: `Count the markings on the ruler`,
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
                        questionText: `How much paint is in the cup?`,
                        inputSuffix: 'L',
                        visual: `<div style="width:80px;height:120px;border:3px solid rgba(255,255,255,0.3);border-radius:0 0 8px 8px;position:relative;margin:0 auto;overflow:hidden;">
                            <div style="position:absolute;bottom:0;left:0;right:0;height:${(amount/5)*100}%;background:linear-gradient(180deg,rgba(205,180,219,0.6),rgba(255,143,175,0.8));"></div>
                            ${Array.from({length:5},(_,i)=>`<div style="position:absolute;top:${100-((i+1)/5)*100}%;left:0;right:0;border-top:1px solid rgba(255,255,255,0.2);font-size:0.5rem;text-align:right;padding-right:4px;">${i+1}</div>`).join('')}
                        </div>`,
                        answer: amount,
                        hint1: `Read the level against the markings`,
                        hint2: `The paint fills up to the ${amount} mark`,
                        hint3: `There are ${amount} liters`
                    };
                }
            },
            {
                skillId: 'meas-mass',
                generate(diff) {
                    const a = {name:'glue',emoji:'🧴',w:R(2,8)};
                    const b = {name:'scissors',emoji:'✂️',w:R(1,7)};
                    while(b.w===a.w) b.w=R(1,7);
                    const heavier = a.w > b.w ? a.name : b.name;
                    return {
                        type: 'multiple-choice',
                        questionText: `${a.emoji} weighs ${a.w} kg, ${b.emoji} weighs ${b.w} kg. Which is heavier?`,
                        visual: `<div class="balance-scale"><div class="scale-pan ${a.w>b.w?'heavier':'lighter'}">${a.emoji}<br>${a.w}kg</div><div class="scale-beam"></div><div class="scale-pan ${b.w>a.w?'heavier':'lighter'}">${b.emoji}<br>${b.w}kg</div></div>`,
                        answer: heavier,
                        options: [{label:`${a.emoji} ${a.name}`,value:a.name},{label:`${b.emoji} ${b.name}`,value:b.name}],
                        hint1: `Compare: ${a.w} vs ${b.w}`,
                        hint2: `${Math.max(a.w,b.w)} > ${Math.min(a.w,b.w)}`,
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
                        questionText: `Convert: ${v} ${c.f} = ? ${c.t}`,
                        inputSuffix: c.t,
                        answer: v * c.x,
                        hint1: `1 ${c.f.slice(0,-1)} = ${c.x} ${c.t}`,
                        hint2: `${v} × ${c.x} = ?`,
                        hint3: `${v} ${c.f} = ${v*c.x} ${c.t}`
                    };
                }
            },
            {
                skillId: 'meas-estimate',
                generate(diff) {
                    const item = pick([{n:'pencil',r:18,u:'cm',e:'✏️'},{n:'book',r:25,u:'cm',e:'📚'},{n:'apple',r:200,u:'g',e:'🍎'}]);
                    const opts = Engine.Utils.shuffle([item.r, item.r*10, Math.round(item.r/5), item.r*3]);
                    return {
                        type: 'multiple-choice',
                        questionText: `About how ${item.u==='g'?'heavy':'long'} is a ${item.n}?`,
                        visual: `<div style="font-size:3rem">${item.e}</div>`,
                        answer: item.r,
                        options: opts.map(o=>({label:`${o} ${item.u}`,value:o})),
                        hint1: `Think about the real size of a ${item.n}`,
                        hint2: `A ${item.n} is about ${item.r} ${item.u}`,
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
                        questionText: `Valerie needs ${p} ribbons, each ${l} cm. How much ribbon total?`,
                        inputSuffix: 'cm',
                        answer: l*p,
                        visual: `<div style="font-size:2rem">📏✂️</div>`,
                        hint1: `Multiply length by number of pieces`,
                        hint2: `${l} × ${p} = ?`,
                        hint3: `${l} × ${p} = ${l*p} cm`
                    };
                }
            },
            {
                skillId: 'meas-tool',
                generate(diff) {
                    const t = pick([{task:'Measure ribbon length',tool:'Ruler'},{task:'Weigh beads',tool:'Scale'},{task:'Measure paint volume',tool:'Measuring cup'}]);
                    return {
                        type: 'multiple-choice',
                        questionText: `Which tool? "${t.task}"`,
                        answer: t.tool,
                        options: Engine.Utils.shuffle(['Ruler','Scale','Measuring cup','Thermometer']).map(o=>({label:o,value:o})),
                        hint1: `Length→ruler, Weight→scale, Liquid→measuring cup`,
                        hint2: `This measures ${t.tool==='Ruler'?'length':t.tool==='Scale'?'weight':'liquid'}`,
                        hint3: `Use a ${t.tool}!`
                    };
                }
            }
        ];
    }
};
