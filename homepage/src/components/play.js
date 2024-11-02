import createNode from "../nodes/play.htm"
import { createProxy } from "../nodes/_"
export default ()=>{
    const [proxy,id] = createProxy({
        src:""
    })
    const vnode = createNode(proxy)
    vnode.addProxy(id)
    return vnode;
}