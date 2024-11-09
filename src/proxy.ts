import { rState, subscribeReact } from "./reactive";

// proxy, proxyid, revokefn
const proxies: [object, symbol, ()=>void][] = [];

export const createProxy = <T extends object>(target: T):[T,()=>void] => {
    //           prop           reactid target    effect
    let reacts: [string|symbol, symbol, ()=>void, ()=>void][] = [];
    const {proxy, revoke} = Proxy.revocable(target, {
        get(target, prop, receiver){
            const state = rState();
            if(state)
                reacts.push([prop, state[0], state[1], state[2]]);
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver){
            const setret = Reflect.set(target, prop, value, receiver);
            reacts.filter(e=>e[0] == prop)
                .forEach(e=>{
                    reacts = reacts.filter(t=>t[1] != e[1]);
                    subscribeReact(e[1], e[2], e[3]);
                });
            return setret;
        }
    });
    return [proxy, revoke];
}
