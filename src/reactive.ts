// proxyid, prop
export type ReactIdentity = [symbol, string|symbol];
// fookid, proxyid, prop, applyfn
type ReactiveTarget = [symbol, symbol, string|symbol, ()=>void];
export let react_target: ReactiveTarget[] = [];

// proxyid, prop
let proxy_recorder: ReactIdentity[][] = [];
export const last_recorder = () => proxy_recorder[proxy_recorder.length-1];
export let is_recording = false;

const watch=(target:()=>void)=>{
    proxy_recorder.push([]);
    is_recording = true;
    target();
    if(proxy_recorder.length <= 1) is_recording = false;
    return proxy_recorder.pop();
}

const subscribeReact=(id: symbol, target: ()=>void, effect: ()=>void)=>{
    const result = watch(target);
    if(result){
        react_target.push(
            ...result.map(
                (e): ReactiveTarget =>
                    [id, e[0], e[1], ()=>{
                        effect();
                        destroyReactives([id]);
                        subscribeReact(id, target, effect);
                    }]));
    }
}

export const createReact = (apply: ()=>void): symbol => 
    fook(apply, apply)

export const fook = (target: ()=>void, effect: ()=>void): symbol => {
    const id = Symbol();
    subscribeReact(id, target, effect);
    return id;
}

export const destroyReactives = (identities: symbol[]) => 
    react_target = react_target.filter(e=>
        !identities.some(t=>t == e[0]))

export const updateReactives = (identities: symbol[]) =>
    react_target.filter(e=>
        identities.some(
            t=>t == e[0]))
        .forEach(e=>e[3]())
