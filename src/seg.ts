import { VNode } from "./element"

type Content = string|VNode<ChildNode>;
type SEG = typeof SEGFn;

function SEGFn(this: [HTMLElement, string[]], ...content: [()=>void]): SEG;
function SEGFn(this: [HTMLElement, string[]], ...content: Content[]): VNode<HTMLElement>;
function SEGFn(this: [HTMLElement, string[]], ...content: [()=>void] | Content[]){
    const [el, arg] = this;
    if(arg.length >= 1 && typeof content[0] == "function"){
        el.addEventListener(arg.pop()??"", content[0]);
        return createSEProxy(el, arg);
    }else{
        content.forEach((t,i)=>{
            if(typeof t == "string"){
                el.appendChild(new Text(t));
            }else if(t instanceof VNode){
                el.appendChild(t.node)
            }else{
                console.error(`Unknown seg content[${i}]:`, t)
            }
        })
        return new VNode<ChildNode>(el);
    }
}

const createSEProxy = (el: HTMLElement, arg: string[]):SEG=>
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

export const seg = new Proxy<{[key: string]: SEG}>({},{
    get:(t, prop)=>
        typeof prop == "string" ?
            createSEProxy(window.document.createElement(prop),[]):undefined
})
createSEProxy(document.createElement("a"), [])("")