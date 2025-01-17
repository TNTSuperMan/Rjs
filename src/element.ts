import { hook } from "./reactive";

export class VNode<T extends ChildNode>{
    node: T;
    #ondestroy: (()=>void)[];
    constructor(node: T){
        node.dispatchEvent(new window.CustomEvent("create"));
        this.node = node;
        this.#ondestroy = [node.remove.bind(node)];
        node.remove = () => {
            this.#ondestroy.forEach(e=>e());
            while(this.node.childNodes.length)
                this.node.childNodes[0].remove();
        }
    }
    ondestroy(fn: ()=>void){
        this.#ondestroy.push(fn);
    }
}

export const createVElement = ( tag: string, contents: (()=>VNode<ChildNode>[]), 
    attrs: ()=>object = ()=>({}), event: object = {}): VNode<HTMLElement> => {
    
    const element = window.document.createElement(tag);

    //Attrs
    hook(()=>
        Object.entries(attrs()).forEach(e=>
            element.setAttribute(...e)));
    //Content
    hook(()=>{
        while(element.childNodes.length)
            element.childNodes[0].remove();
        contents().forEach(e=>element.appendChild(e.node));
    })
    //Event
    Object.entries(event).forEach(e=>
        element.addEventListener(...e));
    
    return new VNode(element);
}

export const createVText = ( text: (()=>string) ): VNode<Text> => {
    const element = new window.Text("");
    hook(()=>
        element.nodeValue = text())
    return new VNode(element);
}
