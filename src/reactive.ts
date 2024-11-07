// proxyid, prop
export type ReactIdentity = [symbol, string|symbol];
// fookid, proxyid, prop, applyfn
type ReactiveTarget = [symbol, symbol, string|symbol, ()=>void];

// proxyid, prop
export let react_target: ReactiveTarget[] = [];
let proxy_recorder: ReactIdentity[][] = [];

const last = () => proxy_recorder[proxy_recorder.length-1] ?? []
export const record_react = (e: ReactIdentity) =>
    last().some(t=>t[0]==e[0] && t[1]==e[1]) ?
    0 : last().push(e);

const watch=(target:()=>void)=>{
    proxy_recorder.push([]);
    target();
    return proxy_recorder.pop() ?? [];
}

const subscribeReact=(id: symbol, target: ()=>void, effect: (()=>void)|void)=>(
    effect ? effect() : 0, react_target.push(
        ...watch(target).map(
            (e): ReactiveTarget =>
                [id, e[0], e[1], ()=>{
                    destroyReactives([id]);
                    subscribeReact(id, target, effect);
                }])));

export const createReact = (target: ()=>void, effect: (()=>void) | void): symbol => {
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
