import { fook } from "./reactive";

export class VNode<T extends ChildNode>{
    node: T;
    #ondestroy: (()=>void)[];
    constructor(node: T){
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
    fook(()=>
        Object.entries(attrs()).forEach(e=>
            element.setAttribute(e[0], e[1])));
    //Content
    fook(()=>{
        while(element.childNodes.length)
            element.childNodes[0].remove();
        contents().forEach(e=>element.appendChild(e.node));
    })
    //Event
    Object.entries(event).forEach(e=>
        element.addEventListener(e[0], e[1]));
    
    element.dispatchEvent(new window.CustomEvent("create"));
    return new VNode(element);
}

export const createVText = ( text: (()=>string) ): VNode<Text> => {
    const element = window.document.createTextNode("");
    fook(()=>
        element.nodeValue = text())
    return new VNode(element);
}
