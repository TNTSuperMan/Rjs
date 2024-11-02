import index from "./components/index";
import { createProxy } from "../../src";
window.addEventListener("hashchange",e=>{
    proxy = location.hash
})
const [proxy,id] = createProxy({
    hash: location.hash
})
const vnode = index(proxy)
vnode.addProxy(id)
document.body.appendChild(vnode.node)