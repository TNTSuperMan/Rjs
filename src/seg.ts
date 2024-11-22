import { VNode } from "./element"

const createSEProxy = (data: {arg:string[], el:Element})=>
    new Proxy(
        (...e: [()=>void] | (string|VNode<ChildNode>)[])=>{
        if(typeof e[0] == "function"){
            const name = data.arg.pop();
            if(name){
                data.el.addEventListener(name, e[0]);
            }
            return createSEProxy(data);
        }else{
            e.forEach(t=>{
                if(typeof t == "string"){
                    data.el.appendChild(new Text(t));
                }else if(t instanceof VNode){
                    data.el.appendChild(t.node)
                }else{
                    throw new Error("Unknown seg: "+t);
                }
            })
            return new VNode(data.el);
        }
    },{
    get(t, prop){
        if(typeof prop == "string"){
            data.arg.push(prop)
            const value = data.arg.pop()
            const name = data.arg.pop()
            if(name && value)
                data.el.setAttribute(name,value)
            return createSEProxy(data)
        }
    }
})

export const seg = new Proxy({},{
    get:(t, prop)=>
        typeof prop == "string" ?
            createSEProxy({el:document.createElement(prop),arg:[]}):null
})