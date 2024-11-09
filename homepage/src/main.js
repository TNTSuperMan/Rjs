import "./assets/style.css";
import index from "./components/index";
import { createProxy } from "./nodes/_";
const [proxy,destroy] = createProxy({
    hash: location.hash
})
window.addEventListener("hashchange",e=>{
    proxy.hash = location.hash
})
const vnode = index(proxy)
vnode.ondestroy(destroy)
document.body.appendChild(vnode.node)