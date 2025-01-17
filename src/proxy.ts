import { rTarget, subscribeReact } from "./reactive";

const DepDestroyer: ((e:symbol)=>void)[] = [];

export const createProxy = <T extends object>(target: T):[T,()=>void] => {
    //           prop        reactid target    effect
    let dep: [string|symbol, symbol, ()=>void, ()=>void][] = [];
    let childProxies: [string|Symbol, object, (()=>void)][] = [];
    const destroy_dep = (e: symbol) => 
        dep = dep.filter(t=>t[1] != e);

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
            const r_target = rTarget();
            if(r_target)
                dep.push([prop, ...r_target]);
            return value;
        },
        set(target, prop, value, receiver){
            const setret = Reflect.set(target, prop, value, receiver);
            dep.filter(e=>e[0] == prop)
                .forEach(e=>{
                    DepDestroyer.forEach(d=>d(e[1]));
                    subscribeReact(e[1], e[2], e[3]);
                });
            return setret;
        }
    });
    DepDestroyer.push(destroy_dep);
    return [proxy, ()=>(
        DepDestroyer.splice(DepDestroyer.findIndex(e=>e==destroy_dep),1),
        childProxies.forEach(e=>e[2] ? e[2]() : 0),
        revoke())];
}
