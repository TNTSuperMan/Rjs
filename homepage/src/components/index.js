import createNode from "../nodes/index.htm"
import createWorldCard from "./wordcard"
import createPlay from "./play"
import {createProxy, fook} from "../nodes/_"
export default ()=>{
    let input = {
        name:null,desc:null
    }
    const [proxy, revoke] = createProxy({
        list:[
            {name: "simple", desc: "単純なリアクティブシステムと\nDOMへの反映のみを実装"},
            {name: "react", desc:  "関数からリアクティブな内容を\n伝えて最低限の更新"},
            {name: "fast", desc:   "無駄な仮想DOMを使用せずに\n更新する部分のみをすぐ更新"},
        ],
        worldcard:createWorldCard,
        play: createPlay,
        name:"",
        desc:"",
        click(){
            proxy.list.push({
                name:proxy.name,
                desc:proxy.desc
            })
            proxy.name = ""
            proxy.desc = ""
        },
        edit:{
            name(e){
                proxy.name = e.target.value;
            },
            desc(e){
                proxy.desc = e.target.value;
            }
        },
        create:{
            name(e){
                input.name = e.target;
            },
            desc(e){
                input.desc = e.target;
            }
        }
    })
    const vnode = createNode(proxy);
    vnode.ondestroy(revoke)
    fook(()=>{
        input.name.value = proxy.name;
    })
    fook(()=>{
        input.desc.value = proxy.desc;
    })
    return vnode;
}