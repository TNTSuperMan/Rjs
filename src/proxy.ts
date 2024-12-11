import { rState, subscribeReact } from "./reactive";

const ReactDestroyer: ((e:symbol)=>void)[] = [];

export const createProxy = <T extends object>(target: T):[T,()=>void] => {
    //           prop           reactid target    effect
    let reacts: [string|symbol, symbol, ()=>void, ()=>void][] = [];
    let childProxies: [string|Symbol, object?, (()=>void)?][] = [];
    const destroy_react = (e: symbol) => 
        reacts = reacts.filter(t=>t[1] != e);

    const {proxy, revoke} = Proxy.revocable(target, {
        get(target, prop, receiver){
            let value:any = Reflect.get(target, prop, receiver);
            if(typeof value == "object"){
                const findres = childProxies.find(e=>e[0]==prop)
                if(findres){
                    value = findres[1];
                }else{
                    const child_proxy = createProxy(value);
                    childProxies.push([prop, ...child_proxy]);
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
                    ReactDestroyer.forEach(d=>d(e[1]));
                    subscribeReact(e[1], e[2], e[3]);
                });
            return setret;
        }
    });
    ReactDestroyer.push(destroy_react);
    return [proxy, ()=>(
        ReactDestroyer.splice(ReactDestroyer.findIndex(e=>e==destroy_react),1),
        childProxies.forEach(e=>e[2] ? e[2]() : 0),
        revoke())];
}
