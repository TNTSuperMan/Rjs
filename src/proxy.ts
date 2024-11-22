import { rState, subscribeReact } from "./reactive";

export const createProxy = <T extends object>(target: T):[T,()=>void] => {
    //           prop           reactid target    effect
    let reacts: [string|symbol, symbol, ()=>void, ()=>void][] = [];
    let childProxies: [string|Symbol, object?, (()=>void)?][] = [];
    const {proxy, revoke} = Proxy.revocable(target, {
        get(target, prop, receiver){
            let value:any = Reflect.get(target, prop, receiver);
            if(typeof value == "object"){
                const findres = childProxies.find(e=>e[0]==prop)
                if(findres){
                    value = findres[1];
                }else{
                    const child_proxy = createProxy(value);
                    childProxies.push([prop, child_proxy[0], child_proxy[1]]);
                    value = child_proxy[0];
                }
            }
            const state = rState();
            if(state)
                reacts.push([prop, ...state]);
            return value;
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
    return [proxy, ()=>(
        childProxies.forEach(e=>e[2] ? e[2]() : 0),
        revoke())];
}
