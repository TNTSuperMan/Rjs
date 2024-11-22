import { VNode } from "./element"

const createSEProxy = (data: {arg:string[], el:Element})=>
    new Proxy(
        (...e: [()=>void] | (string|VNode<ChildNode>)[])=>{
        if(data.arg.length >= 1){
            if(typeof e[0] == "function"){
                data.el.addEventListener(data.arg.pop()??"", e[0]);
            }else{
                data.arg.pop();
                console.error("Unknown seg event handler:", e[0]);
            }
            return createSEProxy(data);
        }else{
            e.forEach((t,i)=>{
                if(typeof t == "string"){
                    data.el.appendChild(new Text(t));
                }else if(t instanceof VNode){
                    data.el.appendChild(t.node)
                }else{
                    console.error(`Unknown seg content[${i}]:`, t)
                }
            })
            return new VNode(data.el);
        }
    },{
    get(t, prop){
        if(typeof prop == "string"){
            data.arg.push(prop)
            if(data.arg.length >= 2){
                data.el.setAttribute(
                    data.arg.shift()??"",
                    data.arg.pop()??""
                )
            }
            return createSEProxy(data)
        }
    }
})

export const seg = new Proxy({},{
    get:(t, prop)=>
        typeof prop == "string" ?
            createSEProxy({el:document.createElement(prop),arg:[]}):null
})