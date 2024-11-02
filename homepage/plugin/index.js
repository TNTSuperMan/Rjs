import { JSDOM } from "jsdom";

function tostr(e){
    return JSON.stringify(e)
}

function gen(e){
    if(e.nodeType == 1){
        let text = `e(${ tostr(e.tagName.toLowerCase()) },`
        text += "()=>["
        e.childNodes.forEach(e=>{
            let ret = gen(e)
            if(ret) text += ret + ","
        })
        text += "],"
        if(e.attributes.length){
            let events = []
            text += "()=>_({";
            for(let i = 0;i < e.attributes.length;i++){
                let attr = e.attributes[i];
                if(/^:/.test(attr.nodeName)){
                    text += `${tostr(attr.nodeName.substring(1))}: ${attr.nodeValue}`
                }else if(/^on/.test(attr.nodeName)){
                    events.push([attr.nodeName.substring(2),attr.nodeValue])
                    continue;
                }else{
                    text += `${tostr(attr.nodeName)}: ${tostr(attr.nodeValue)}`
                }
                text += ","
            }
            text += "}),{"
            events.forEach(e=>{
                text += `${e[0]}:${e[1]},`
            })
            text += "}"
        }
        return text + ")";
    }else if(e.nodeType == 3){
        let t = e.nodeValue.trim()
        //console.log(t)
        if(/^\{\{.+\}\}$/.test(t)){ //Native
            return t.substring(2,t.length-2);
        }else if(/^\{.+\}$/.test(t)){ //ReactText
            return `t(()=>${t.substring(1,t.length-1)})`
        }else{
            if(t){
                return `t($(${tostr(e.nodeValue)}))`
            }else{
                return undefined;
            }
        }
    }else{
        return undefined
    }
}

function GenerateEntry(src){
    const entry = new JSDOM(src).window.document.body.children[0];
    return `import {createVElement as e, createVText as t, $,_,$_} from "./_"
export default props=>${gen(entry)}

`
}

export default ()=>{
    return {
        name: "rollup-plugin-rjs",
        transform(src, id){
            if(/\.htm$/.test(id)){
                console.log(GenerateEntry(src))
                return {
                    code: GenerateEntry(src),
                    map: null
                }
            }
        }
    }
}