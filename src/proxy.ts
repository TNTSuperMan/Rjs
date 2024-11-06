import { last_recorder, is_recording, react_target, destroyReactives } from "./reactive";

// proxy, proxyid, revokefn
const proxies: [object, symbol, ()=>void][] = [];

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
                e[1] == id && e[2] == prop)
                .forEach(e=>e[3]());
            return setret;
        }
    });
    proxies.push([target, id, ()=>{
        revoke();
        destroyReactives(id);
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
