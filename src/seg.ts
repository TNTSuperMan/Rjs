import { VNode } from "./element"

type Content = string|VNode<ChildNode>;

type SEG = {
    (...fn: [()=>void]): SEG,
    (...content: Content[]): VNode<HTMLElement>
};
const createSEProxy = (el: HTMLElement, arg: string[]): SEG=>
    new Proxy<SEG>((()=>{
        function SEGFn(...content: [()=>void]): SEG;
        function SEGFn(...content: Content[]): VNode<HTMLElement>;
        function SEGFn(...content: [()=>void] | Content[]){
            if(typeof content[0] == "function"){
                const poped = arg.pop();
                if(poped) el.addEventListener(poped, content[0]);
                return SEGFn;
            }else{
                el.append(...content.map(e=>
                    typeof e == "string"?
                        e :
                        e instanceof VNode ?
                            e.node : ""))
                return new VNode<HTMLElement>(el);
            }
        }
        return SEGFn
    })(),{
    get(t, prop){
        if(typeof prop == "string"){
            arg.push(prop)
            if(arg.length == 2){
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
