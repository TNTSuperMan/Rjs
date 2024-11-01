import { destroyReactives, fook, createReact, ReactIdentity, updateReactives, createProxy, destroyProxy } from "./reactive";

type RNode = Element | CharacterData;
export class VNode<T extends RNode>{
    node: T;
    #reacts: ReactIdentity[];
    #reactvals: symbol[] = [];
    #remove_dom: ()=>void;
    constructor(node: T, reacts: ReactIdentity[]){
        this.node = node;
        this.#reacts = reacts;
        this.#remove_dom = node.remove.bind(node);
        node.remove = this.destroy;
    }
    update(){
        updateReactives(this.#reacts);
    }
    destroy(){
        this.#reactvals.forEach(e=>destroyProxy(e));
        destroyReactives(this.#reacts);
        this.node.childNodes.forEach(e=>e.remove());
        this.#remove_dom();
    }
    fook(target: ()=>void, effect: ()=>void){
        this.#reacts.push(...fook(target, effect));
    }
    createProxy<T extends object>(target: T){
        const proxy = createProxy(target);
        this.#reactvals.push(proxy[1]);
        return proxy[0];
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
