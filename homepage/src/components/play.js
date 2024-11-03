import createNode from "../nodes/play.htm"
import { createProxy } from "../nodes/_"
import __cdntext from "./__cdntext"
export default ()=>{
    const [proxy,id] = createProxy({
        src:
`const e = R.createVElement;
const t = R.createVText;

function title(text){
    return e("h2", ()=>[t(()=>text)]);
}

function app(){
    return e("div", ()=>[title("Hello, World!")]);
}

document.body.appendChild(app().node);`,
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
    vnode.addProxy(id)
    return vnode;
}