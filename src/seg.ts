import { VNode } from "./element"

const createSEProxy = (el: Element, arg: string[])=>
    new Proxy(
        (...e: [()=>void] | (string|VNode<ChildNode>)[])=>{
        if(arg.length >= 1){
            if(typeof e[0] == "function"){
                el.addEventListener(arg.pop()??"", e[0]);
            }else{
                arg.pop();
                console.error("Unknown seg event handler:", e[0]);
            }
            return createSEProxy(el, arg);
        }else{
            e.forEach((t,i)=>{
                if(typeof t == "string"){
                    el.appendChild(new Text(t));
                }else if(t instanceof VNode){
                    el.appendChild(t.node)
                }else{
                    console.error(`Unknown seg content[${i}]:`, t)
                }
            })
            return new VNode(el);
        }
    },{
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

export const seg = new Proxy({},{
    get:(t, prop)=>
        typeof prop == "string" ?
            createSEProxy(window.document.createElement(prop),[]):null
})