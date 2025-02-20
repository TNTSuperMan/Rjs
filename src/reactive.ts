const react_state:[symbol, ()=>void, ()=>void][] = [];
export const rTarget = () => react_state.at(-1);

export const subscribeReact=(id: symbol, target: ()=>void, effect: (()=>void))=>{
    react_state.push([id, target, effect ]);
    target();
    react_state.pop();
    effect();
}

export const hook = (target: ()=>void, effect: (()=>void) = ()=>0): symbol => {
    const id = Symbol();
    subscribeReact(id, target, effect);
    return id;
}
