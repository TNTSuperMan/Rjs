// proxyid, prop
export type ReactIdentity = [symbol, string|symbol];
// proxyid, prop, applyfn
type ReactiveTarget = [symbol, string|symbol, ()=>void];
let react_target: ReactiveTarget[] = [];

// proxyid, prop
let proxy_recorder: [symbol, string|symbol][][] = [];
let is_recording = false;

// proxy, proxyid, revokefn
const proxies: [object, symbol, ()=>void][] = [];

const last_recorder = () => proxy_recorder[proxy_recorder.length-1];

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

export const destroyReactives = (identities: ReactIdentity[]) => 
    react_target = react_target.filter(e=>
        !identities.some(
            t=>t[0] == e[0] &&
               t[1] == e[1]))

export const updateReactives = (identities: ReactIdentity[]) =>
    react_target.filter(e=>
        identities.some(
            t=>t[0] == e[0] &&
               t[1] == e[1]))
        .forEach(e=>e[2]())

export const createProxy = <T extends object>(target: T):[T,symbol] => {
    const id = Symbol();
    const {proxy, revoke} = Proxy.revocable(target, {
        get(target, prop, receiver){
            if( is_recording && 
                !last_recorder().some(e=>
                    e[0]==id && e[1]==prop))
                last_recorder().push([id, prop]);
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver){
            const setret = Reflect.set(target, prop, value, receiver);
            react_target.filter(e=>
                e[0] == id && e[1] == prop)
                .forEach(e=>e[2]());
            return setret;
        }
    });
    proxies.push([target, id, ()=>{
        revoke();
        react_target =
            react_target.filter(e=>e[0] != id)
    }])
    return [proxy, id];
}

export const destroyProxy = (identity: symbol) => {
    const id = proxies.findIndex(e=>e[1] == identity);
    if(id != -1){
        proxies[id][2]();
        proxies.splice(id, 1);
    }
}
