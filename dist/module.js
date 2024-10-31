let react_target = [];
// proxyid, prop
let proxy_recorder = [];
let is_recording = false;
// proxy, proxyid, revokefn
const proxies = [];
const last_recorder = () => proxy_recorder[proxy_recorder.length - 1];
const createReact = (apply) => fook(apply, apply);
const fook = (target, effect) => {
    proxy_recorder.push([]);
    is_recording = true;
    target();
    if (proxy_recorder.length <= 1)
        is_recording = false;
    const result = proxy_recorder.pop();
    if (result) {
        react_target.push(...result.map((e) => [e[0], e[1], effect]));
        return result.map(e => [e[0], e[1]]);
    }
    return [];
};
const destroyReactives = (identities) => react_target = react_target.filter(e => !identities.some(t => t[0] == e[0] &&
    t[1] == e[1]));
const updateReactives = (identities) => react_target.filter(e => identities.some(t => t[0] == e[0] &&
    t[1] == e[1]))
    .forEach(e => e[2]());
const createProxy = (target) => {
    const id = Symbol();
    const { proxy, revoke } = Proxy.revocable(target, {
        get(target, prop, receiver) {
            if (is_recording &&
                !last_recorder().some(e => e[0] == id && e[1] == prop))
                last_recorder().push([id, prop]);
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            const setret = Reflect.set(target, prop, value, receiver);
            react_target.filter(e => e[0] == id && e[1] == prop)
                .forEach(e => e[2]());
            return setret;
        }
    });
    proxies.push([target, id, () => {
            revoke();
            react_target =
                react_target.filter(e => e[0] != id);
        }]);
    return [proxy, id];
};
const destroyProxy = (identity) => {
    const id = proxies.findIndex(e => e[1] == identity);
    if (id != -1) {
        proxies[id][2]();
        proxies.splice(id, 1);
    }
};

class VNode {
    node;
    #reacts;
    #reactvals = [];
    #remove_dom;
    constructor(node, reacts, remove) {
        this.node = node;
        this.#reacts = reacts;
        this.#remove_dom = remove;
    }
    update() {
        updateReactives(this.#reacts);
    }
    destroy() {
        this.#reactvals.forEach(e => destroyProxy(e));
        destroyReactives(this.#reacts);
        this.node.childNodes.forEach(e => e.remove());
        this.#remove_dom();
    }
    fook(target, effect) {
        this.#reacts.push(...fook(target, effect));
    }
    createProxy(target) {
        const proxy = createProxy(target);
        this.#reactvals.push(proxy[1]);
        return proxy[0];
    }
}
function createVElement(tag, attrs, contents, event) {
    const element = document.createElement(tag);
    const reacts = [];
    //Attrs
    reacts.push(...createReact(() => {
        const attrs_map = Object.entries(attrs());
        attrs_map.forEach(e => element.setAttribute(e[0], e[1]));
    }));
    //Contents
    reacts.push(...createReact(() => {
        element.childNodes.forEach(e => e.remove());
        contents().forEach(e => element.appendChild(e.node));
    }));
    //Event
    Object.entries(event).forEach(e => element.addEventListener(e[0], e[1]));
    const remove = element.remove.bind(element);
    const vnode = new VNode(element, reacts, remove);
    element.remove = () => vnode.destroy();
    return vnode;
}
function createVText(text) {
    const element = new Text();
    let reacts = createReact(() => element.nodeValue = text());
    const remove = element.remove.bind(element);
    const vnode = new VNode(element, reacts, remove);
    element.remove = () => vnode.destroy();
    return vnode;
}

export { createVElement, createVText };
