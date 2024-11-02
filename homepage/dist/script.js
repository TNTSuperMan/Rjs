(function () {
    'use strict';

    let react_target = [];
    // proxyid, prop
    let proxy_recorder = [];
    const last_recorder = () => proxy_recorder[proxy_recorder.length - 1];
    let is_recording = false;
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
        t.length == 2 ? t[1] == e[1] : true));
    const updateReactives = (identities) => react_target.filter(e => identities.some(t => t[0] == e[0] &&
        t[1] == e[1]))
        .forEach(e => e[2]());

    // proxy, proxyid, revokefn
    const proxies = [];
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
                destroyReactives([[id]]);
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
        #proxies;
        #remove_dom;
        constructor(node, reacts = []) {
            this.node = node;
            this.#reacts = reacts;
            this.#remove_dom = node.remove.bind(node);
            this.#proxies = [];
            node.remove = () => this.destroy();
        }
        update() {
            updateReactives(this.#reacts);
        }
        destroy() {
            this.#proxies.forEach(e => destroyProxy(e));
            destroyReactives(this.#reacts);
            this.node.childNodes.forEach(e => e.remove());
            this.#remove_dom();
        }
        fook(target, effect) {
            this.#reacts.push(...fook(target, effect));
        }
        calculate(target) {
            const proxy = createProxy({ value: target() });
            this.#proxies.push(proxy[1]);
            this.#reacts.push(...createReact(() => proxy[0].value = target()));
            return proxy[0];
        }
        addProxy(id) {
            this.#proxies.push(id);
        }
    }
    function createVElement(tag, contents, attrs = () => ({}), event = {}) {
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
        return new VNode(element, reacts);
    }
    function createVText(text) {
        const element = new Text();
        return new VNode(element, createReact(() => element.nodeValue = text()));
    }

    const _ = e=>e;
    const $ = e => (t => e);
    // Please edit to your Rjs entry path

    var createNode$1 = props=>createVElement("div",()=>[createVElement("h1",()=>[createVText($("Rjs")),],),createVElement("p",()=>[createVText($("simple, react, fast.")),],), createVElement("div",()=>props.list.map(e=>props.worldcard(e))) ,createVElement("div",()=>[createVElement("div",()=>[createVElement("input",()=>[],()=>_({"type": "text",}),{input:props.edit.name}),],()=>_({"class": "left",}),{}),createVElement("div",()=>[createVElement("textarea",()=>[],()=>_({}),{input:props.edit.desc}),],()=>_({"class": "right",}),{}),],()=>_({"class": "card",}),{}),createVElement("button",()=>[createVText($("+")),],()=>_({}),{click:props.click}),createVElement("h2",()=>[createVText($("Why")),],),createVElement("ul",()=>[createVElement("li",()=>[createVText($("サイズが小さい - 通信時間・計算量を削減")),],),createVElement("li",()=>[createVText($("仮想DOMを使わない - 不要な計算を削減")),],),createVElement("li",()=>[createVText($("ルート要素を指定しない - 自由度が増加")),],),],),createVElement("h2",()=>[createVText($("About")),],),createVElement("pre",()=>[createVText($("最近のフロントエンド開発では、フレームワークが用いられている。\nしかし、そのプログラムが大きい。無駄が多い。クライアントにその\n膨大なフレームワークの内容の通信を待たせるのだろうか？\n自分はどうしても無駄を無くしたかった。\n\n")),createVElement("b",()=>[createVText($("そうして、Rjsの開発を開始した。")),],),createVText($("\n\nフレームワークとして必要と思われた")),createVElement("b",()=>[createVText($("「リアクティブシステム」")),],),createVText($("と\n")),createVElement("b",()=>[createVText($("「モジュール化」")),],),createVText($("のみに焦点を当ててフレームワークを作った。\n\nDOM操作には少し近づき、TextとElementを分けた。さらに内部の\n情報伝達にオブジェクトは使わず配列を使い、HTMLに近い記述法を\nプラグインに託した。仮想DOMのライブラリはサイズが多いため\n使わず、リアクティブな値は直接関数から受け取り、属性と子要素を\n分け、子要素内のリアクティブな内容とは分けて高速化し、廃棄\nされた子要素内のリアクティブな内容を削除するため廃棄関数内に\nリアクティブな内容を削除するコードを埋め込んだ。さらには\nTypescriptで開発することで型安全にして、最善を尽くした。\n")),],),createVElement("h2",()=>[createVText($("Start")),],),createVElement("a",()=>[createVText($("Download Rjs")),],()=>_({"target": "_blank","href": "https://github.com/TNTSuperMan/Rjs/tree/main/dist",}),{}),],);

    var createNode = props=>createVElement("div",()=>[createVElement("div",()=>[createVText(()=>props.name),],()=>_({"class": "left",}),{}),createVElement("div",()=>[createVText(()=>props.desc),],()=>_({"class": "right",}),{}),],()=>_({"class": "card",}),{});

    var index = props=>{
        const [proxy, id] = createProxy({
            list:[
                {name: "simple", desc: "単純なリアクティブシステムと\nDOMへの反映のみを実装"},
                {name: "react", desc:  "関数からリアクティブな内容を\n伝えて最低限の更新"},
                {name: "fast", desc:   "無駄な仮想DOMを使用せずに\n更新する部分のみをすぐ更新"},
            ],
            worldcard:createNode,
            name:"",
            desc:"",
            click(){
                proxy.list.push({
                    name:proxy.name,
                    desc:proxy.desc
                });
                proxy.list = proxy.list;
            },
            edit:{
                name(e){
                    proxy.name = e.target.value;
                },
                desc(e){
                    proxy.desc = e.target.value;
                }
            }
        });
        const vnode = createNode$1(proxy);
        console.log(vnode);
        vnode.addProxy(id);
        return vnode;
    };

    document.body.appendChild(index({da:createNode({name:"simple",desc:"simple"})}).node);

})();
