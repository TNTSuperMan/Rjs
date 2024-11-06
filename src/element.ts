import { destroyReactives, fook, createReact, updateReactives } from "./reactive";
import { createProxy, destroyProxy } from "./proxy";

type RNode = Element | CharacterData;
export class VNode<T extends RNode>{
    node: T;
    #reacts: symbol[];
    #proxies: symbol[];
    #remove_dom: ()=>void;
    constructor(node: T, reacts: symbol[] = []){
        this.node = node;
        this.#reacts = reacts;
        this.#remove_dom = node.remove.bind(node);
        this.#proxies = [];
        node.remove = () => this.destroy();
    }
    update(){
        updateReactives(this.#reacts);
    }
    destroy(){
        this.#proxies.forEach(e=>destroyProxy(e));
        destroyReactives(this.#reacts);
        while(this.node.childNodes.length)
            this.node.childNodes[0].remove();
        this.#remove_dom();
    }
    fook(target: ()=>void, effect: ()=>void){
        this.#reacts.push(fook(target, effect));
    }
    addProxy(id: symbol){
        this.#proxies.push(id);
    }
}

export const createVElement = ( tag: string, contents: (()=>VNode<RNode>[]), 
    attrs: ()=>object = ()=>({}), event: object = {}): VNode<HTMLElement> => {
    
    const element = document.createElement(tag);

    const reacts: symbol[] = [
        //Attrs
        createReact(()=>
            Object.entries(attrs()).forEach(e=>
                element.setAttribute(e[0], e[1]))),
        //Content
        createReact(()=>{
            while(element.childNodes.length)
                element.childNodes[0].remove();
            contents().forEach(e=>element.appendChild(e.node));
        })
    ];
    //Event
    Object.entries(event).forEach(e=>
        element.addEventListener(e[0], e[1]));
    
    element.dispatchEvent(new CustomEvent("create"));
    return new VNode(element, reacts);
}

export const createVText = ( text: (()=>string) ): VNode<Text> => {
    const element = new Text();
    
    return new VNode(element, 
        [createReact(()=>
            element.nodeValue = text())]);
}
