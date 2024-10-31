# Rjs
simple, reactive, fast.

簡易的でリアクティブなフレームワークを目指して開発しています。
## What
Reactとかのコード多いな～って、リアクティブの部分だけ作ってウルトラ単純フレームワーク作りたいな～って。  
そして生まれた。  
- Typescript対応
- 完全()関数型
- 内部伝達用オブジェクトは使わず、配列で伝達 → コードの無駄を無くす
## How to use
```js
import {createVElement as ve, createVText as vt} from "./dist/module.min.js";
const _ = e=>e;

function App(){
    return ve(
        "div", //Tag
        ()=>_({id:"app"}), //Attr
        ()=>[], //Content
        {} //Event
    )
}
```