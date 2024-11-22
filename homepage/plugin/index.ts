import { DOMWindow } from "jsdom";
import { JSDOM } from "jsdom";

function tostr(e:string){
    return JSON.stringify(e)
}

function gen(e:ChildNode,dom:DOMWindow,stat?:boolean):string{
    if(e instanceof dom.Element){
        const tag:string = e.tagName.toLowerCase();
        const contents:string[] = [];
        const events:[string,string][] = [];
        const attrs:[string,string][] = [];
        const reactiveAttrs:[string,string][] = [];
        
        Array.from(e.attributes).forEach(e=>{
            if(e.name.startsWith(":")){
                reactiveAttrs.push([e.name.substring(1),e.value])
            }else if(e.name.startsWith("on")){
                events.push([e.name.substring(2),e.value])
            }else{
                attrs.push([e.name, e.value])
            }
        })
        const isReact = reactiveAttrs.length ? true : false;

        e.childNodes.forEach(e=>{
            let ret = gen(e,dom,!isReact);
            if(ret != '""' && ret != `t(()=>"")`) contents.push(ret)
        })
        
        if(isReact){
            return `e(
    ${tostr(tag)},
    ()=>[ ${ contents.join(',') }]),
    ()=>({${ attrs.map(e=>`${e[0]}:${tostr(e[1])}`).join(",") },
          ${ reactiveAttrs.map(e=>`${e[0]}:${e[1]}`).join(",") }})
    {     ${ events.map(e=>`${e[0]}:${e[1]}`).join(",") }}}
    )`
        }else{
            function ntostr(e:string){
                if(/^[a-zA-Z_$]+[a-zA-Z0-9_$]*$/.test(e)){
                    return "."+e;
                }else{
                    return `[${tostr(e)}]`;
                }
            }
            const attrtext:string = attrs.map(e=>
                `${ntostr(e[0])}${ntostr(e[1])}`).join("")

            const eventtext:string = events.map(e=>
                `${ntostr(e[0])}(${e[1]})`).join("")

            const contenttext:string = contents.join(",")
            return `\nseg.${tag}${attrtext}${eventtext}(${contenttext})`;
        }
    }else if(e instanceof dom.Text){
        const text = (e.nodeValue ?? "").trim();
        if(/^\{\{.+\}\}$/.test(text)){//native
            return text.substring(2, text.length-2)
        }else if(/^\{.+\}/.test(text)){//Reactive text
            const fn = text.substring(1, text.length-1)
            return `t(()=>${fn})`;
        }else{//Text
            if(stat){
                return tostr(text);
            }else{
                return `t(()=>${tostr(text)})`
            }
        }
    }else{
        throw new Error("unexcepted gen target",{cause:e})
    }
}

function GenerateEntry(src:string){
    const dom = new JSDOM(src).window;
    const entry = dom.document.body.children[0];
    return `import {createVElement as e, createVText as t, seg} from "./_";
export default props=>${gen(entry,dom)}

`
}

export default ()=>{
    return {
        name: "rollup-plugin-rjs",
        transform(src:string, id:string){
            if(/\.htm$/.test(id)){
                const t = GenerateEntry(src)
                console.log(t);
                return {
                    code: t,
                    map: null
                }
            }
        }
    }
}