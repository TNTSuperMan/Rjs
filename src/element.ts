import { createReact } from "./reactive";

let wind:Window = window;
export const changeWindow = (w: Window) => wind = w;

export class VNode<T extends ChildNode>{
    node: T;
    #ondestroy: (()=>void)[];
    #remove_dom: ()=>void;
    constructor(node: T){
        this.node = node;
        this.#remove_dom = node.remove.bind(node);
        this.#ondestroy = [];
        node.remove = () => this.destroy();
    }
    destroy(){
        this.#ondestroy.forEach(e=>e());
        while(this.node.childNodes.length)
            this.node.childNodes[0].remove();
        this.#remove_dom();
    }
    ondestroy(fn: ()=>void){
        this.#ondestroy.push(fn);
    }
}

export const createVElement = ( tag: string, contents: (()=>VNode<ChildNode>[]), 
    attrs: ()=>object = ()=>({}), event: object = {}): VNode<HTMLElement> => {
    
    const element = wind.document.createElement(tag);

    //Attrs
    createReact(()=>
        Object.entries(attrs()).forEach(e=>
            element.setAttribute(e[0], e[1])));
    //Content
    createReact(()=>{
        while(element.childNodes.length)
            element.childNodes[0].remove();
        contents().forEach(e=>element.appendChild(e.node));
    })
    //Event
    Object.entries(event).forEach(e=>
        element.addEventListener(e[0], e[1]));
    
    element.dispatchEvent(new CustomEvent("create"));
    return new VNode(element);
}

export const createVText = ( text: (()=>string) ): VNode<Text> => {
    const element = wind.document.createTextNode("");
    createReact(()=>
        element.nodeValue = text())
    return new VNode(element);
}
