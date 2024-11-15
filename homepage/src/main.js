import "./assets/style.css";
import index from "./components/index";

const vnode = index()
vnode.ondestroy(destroy)
document.body.appendChild(vnode.node)