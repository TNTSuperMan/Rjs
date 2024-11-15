import {VNode, fook, createProxy, createVElement, createVText} from "../../../index"
export {VNode, fook, createProxy, createVElement, createVText};
// Please edit to your Rjs entry path

const createSEProxy = data=>
    new Proxy((...e)=>typeof e[0] == "function"?(
            data.el.addEventListener(data.arg.pop(),e[0]),
            createSEProxy(data)):
        ((e??[]).forEach(t=>
            typeof t == "string" ?
                data.el.appendChild(new Text(t)):
                t instanceof VNode ?
                    data.el.appendChild(t.node):
                    (()=>{throw new Error("Unknown seg: "+t)})()),
            new VNode(data.el)),{
    get(t, prop){
        data.arg.push(prop)
        if(data.arg.length >= 2){
            let value = data.arg.pop()
            data.el.setAttribute(data.arg.pop(),value)
        }
        return createSEProxy(data)
    }
})

export const seg = new Proxy({},{
    get:(t, prop)=>createSEProxy({el:document.createElement(prop),arg:[]})
})