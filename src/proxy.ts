import { rTarget, subscribeReact } from "./reactive";

const DepDestroyer: ((e:symbol)=>void)[] = [];

export const createProxy = <T extends object>(target: T): T => {
    //           prop        reactid target    effect
    let dep: [string|symbol, symbol, ()=>void, ()=>void][] = [];
    let childProxies: Map<string|symbol, object> = new Map;
    const destroy_dep = (e: symbol) => 
        dep = dep.filter(t=>t[1] != e);

    const proxy = new Proxy(target, {
        get(target, prop, receiver){
            let value:any = Reflect.get(target, prop, receiver);
            if(typeof value == "object"){
                if(childProxies.has(prop)){
                    value = childProxies.get(prop);
                }else{
                    const child_proxy = createProxy(value);
                    childProxies.set(prop, child_proxy);
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
    return proxy;
}
