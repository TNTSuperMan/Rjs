import createNode from "../nodes/play.htm"
import { createProxy } from "../nodes/_"
import __cdntext from "./__cdntext"
export default ()=>{
    const [proxy,destroy] = createProxy({
        src:
`const e = R.createVElement;
const t = R.createVText;
const seg = R.seg;
const [data,destroy] = R.createProxy({value:"Hello, World!"});

function title(text){
    return e("h2", ()=>[t(()=>data.value)]);
}

function input(){
    return (seg.input
        .value[data.value]
        .input(e=>data.value = e.target.value)());
}

function app(){
    return seg.div.id.app(title(),input());
}

const vm = app();
vm.ondestroy(destroy);
document.body.appendChild(vm.node);`,
        apply:()=>{},
        oncrifrm(et){
            const e = et.target
            proxy.apply = () => {
                let t = `
<html><body>
<script>${__cdntext}</script>
<script>${proxy.src}</script>
</body></html>`
                e.setAttribute("srcdoc",t)
            }
            proxy.apply()
        },
        oncreate(e){
            e.target.value = proxy.src;
        },
        onchange(e){
            proxy.src = e.target.value;
            proxy.apply()
        }
    })
    const vnode = createNode(proxy)
    vnode.ondestroy(destroy)
    return vnode;
}