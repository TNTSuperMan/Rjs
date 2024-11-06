// proxyid, prop
export type ReactIdentity = [symbol, string|symbol];
// fookid, proxyid, prop, applyfn
type ReactiveTarget = [symbol, symbol, string|symbol, ()=>void];

// proxyid, prop
export let react_target: ReactiveTarget[] = [];
let proxy_recorder: ReactIdentity[][] = [];

const last = () => proxy_recorder[proxy_recorder.length-1]
export const record_react = (e: ReactIdentity) =>
    last().some(t=>t[0]==e[0] && t[1]==e[1]) ?
    last().push(e) : 0;

const watch=(target:()=>void)=>{
    proxy_recorder.push([]);
    target();
    return proxy_recorder.pop() ?? [];
}

const subscribeReact=(id: symbol, target: ()=>void, effect: ()=>void)=>
    react_target.push(
        ...watch(target).map(
            (e): ReactiveTarget =>
                [id, e[0], e[1], ()=>{
                    effect();
                    destroyReactives([id]);
                    subscribeReact(id, target, effect);
}]));


export const createReact = (apply: ()=>void): symbol => 
    fook(apply, apply)

export const fook = (target: ()=>void, effect: ()=>void): symbol => {
    const id = Symbol();
    subscribeReact(id, target, effect);
    return id;
}

export const destroyReactives = (identities: symbol[] | symbol) => 
    Array.isArray(identities) ?
        react_target = react_target.filter(e=>
            !identities.some(t=>t == e[0])) :
        react_target = react_target.filter(e=>
            e[1] == identities)

export const updateReactives = (identities: symbol[]) =>
    react_target.filter(e=>
        identities.some(
            t=>t == e[0]))
        .forEach(e=>e[3]())
