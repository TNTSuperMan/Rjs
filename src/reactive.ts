// proxyid, prop
export type ReactIdentity = [symbol, string|symbol];
// proxyid, prop, applyfn
type ReactiveTarget = [symbol, string|symbol, ()=>void];
export let react_target: ReactiveTarget[] = [];

// proxyid, prop
let proxy_recorder: ReactIdentity[][] = [];
export const last_recorder = () => proxy_recorder[proxy_recorder.length-1];
export let is_recording = false;


export const createReact = (apply: ()=>void): ReactIdentity[] => 
    fook(apply, apply)

export const fook = (target: ()=>void, effect: ()=>void): ReactIdentity[] => {
    proxy_recorder.push([]);
    is_recording = true;
    target();
    if(proxy_recorder.length <= 1) is_recording = false;
    const result = proxy_recorder.pop();
    if(result){
        react_target.push(
            ...result.map(
                (e): ReactiveTarget =>
                    [e[0], e[1], effect]));
        return result.map(e=>[e[0],e[1]]);
    }
    return [];
}

export const destroyReactives = (identities: ReactIdentity[] | [symbol][]) => 
    react_target = react_target.filter(e=>
        !identities.some(
            t=>t[0] == e[0] &&
               t.length == 2 ? t[1] == e[1] : true))

export const updateReactives = (identities: ReactIdentity[]) =>
    react_target.filter(e=>
        identities.some(
            t=>t[0] == e[0] &&
               t[1] == e[1]))
        .forEach(e=>e[2]())
