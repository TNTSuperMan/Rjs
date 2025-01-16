import { VNode } from "./element"

type Content = string|VNode<ChildNode>;

type TypeSEGFn = ( this: [Element, string[]],
    fnc?: ((()=>void) | Content), ...e: (typeof fnc extends (()=>void) ? [] : Content[]))
    => (typeof fnc extends (()=>void) ? SEG : VNode<ChildNode>);
type SEG = TypeSEGFn;

const SEGFn: TypeSEGFn = function(fnc, ...e){
    const [el, arg] = this;
    if(arg.length >= 1 && typeof fnc == "function"){
        el.addEventListener(arg.pop()??"", fnc);
        return createSEProxy(el, arg);
    }else if(typeof fnc == "string" || fnc instanceof Element){
        [fnc, ...e].forEach((t,i)=>{
            if(typeof t == "string"){
                el.appendChild(new Text(t));
            }else if(t instanceof VNode){
                el.appendChild(t.node)
            }else{
                console.error(`Unknown seg content[${i}]:`, t)
            }
        })
        return new VNode<ChildNode>(el);
    }else{
        return createSEProxy(el, arg);
    }
}

const createSEProxy = (el: Element, arg: string[]):SEG=>
    new Proxy<SEG>((...args)=>SEGFn.call([el, arg],...args),{
    get(t, prop){
        if(typeof prop == "string"){
            arg.push(prop)
            if(arg.length >= 2){
                el.setAttribute(
                    arg.shift()??"",
                    arg.pop()??""
                )
            }
            return createSEProxy(el, arg);
        }
    }
})

export const seg = new Proxy<{[key: string]: object | null}>({},{
    get:(t, prop)=>
        typeof prop == "string" ?
            createSEProxy(window.document.createElement(prop),[]):null
})
createSEProxy(document.createElement("a"), [])("")