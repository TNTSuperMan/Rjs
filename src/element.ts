import { destroyReactives, fook, createReact, ReactIdentity, updateReactives } from "./reactive";
import { createProxy, destroyProxy } from "./proxy";

type RNode = Element | CharacterData;
export class VNode<T extends RNode>{
    node: T;
    #reacts: ReactIdentity[];
    #proxies: symbol[] = [];
    #remove_dom: ()=>void;
    constructor(node: T, reacts: ReactIdentity[] = []){
        this.node = node;
        this.#reacts = reacts;
        this.#remove_dom = node.remove.bind(node);
        node.remove = this.destroy;
    }
    update(){
        updateReactives(this.#reacts);
    }
    destroy(){
        this.#proxies.forEach(e=>destroyProxy(e));
        destroyReactives(this.#reacts);
        this.node.childNodes.forEach(e=>e.remove());
        this.#remove_dom();
    }
    fook(target: ()=>void, effect: ()=>void){
        this.#reacts.push(...fook(target, effect));
    }
    calculate<T>(target: ()=>T): {value: T}{
        const proxy = createProxy({value: target()});
        this.#proxies.push(proxy[1]);
        this.#reacts.push(...createReact(()=>
            proxy[0].value = target()));
        return proxy[0];
    }
    addProxy(id: symbol){
        this.#proxies.push(id);
    }
}

export function createVElement( tag: string, attrs: ()=>object,
    contents: (()=>VNode<RNode>[]), event: object ): VNode<HTMLElement>{
    
    const element = document.createElement(tag);

    const reacts: ReactIdentity[] = [];
    //Attrs
    reacts.push(...createReact(()=>{
        const attrs_map = Object.entries(attrs());
        attrs_map.forEach(e=>
            element.setAttribute(e[0], e[1]))
    }));
    //Contents
    reacts.push(...createReact(()=>{
        element.childNodes.forEach(e=>e.remove());
        contents().forEach(e=>element.appendChild(e.node));
    }));
    //Event
    Object.entries(event).forEach(e=>
        element.addEventListener(e[0], e[1]));
    
    return new VNode(element, reacts);
}

export function createVText( text: (()=>string) ): VNode<Text>{
    const element = new Text();
    
    return new VNode(element, 
        createReact(()=>
            element.nodeValue = text()));
}
