# Rjs
simple, reactive, fast.

簡易的でリアクティブなフレームワークを目指して開発しています。
## What
Reactとかのコード多いな～って、リアクティブの部分だけ作って  
ウルトラ単純フレームワーク作りたいな～って。  
そして生まれた。  
- Typescript対応
- 完全()関数型
- 内部伝達用オブジェクトは使わず、配列で伝達 → コードの無駄を無くす
## How to use...
```js
import {createVElement as ve, createVText as vt} from "./dist/module.min.js";

function App(){
    return ve(
        "div", //Tag
        ()=>[vt(()=>"hello, world!")], //Content
        ()=>({id:"app"}), //Attr
        {} //Event
    )
}
document.body.appendChild(App().node);
```
## グローバル変数について
Rjsをnode上でjsdomとか使いたい人向けです  
設定すべきはwindowのみです。以下のようにしてください。
```js
import * as R from "./dist/module.min.js"
import {JSDOM} from "jsdom"
globalThis.window = new JSDOM().window;
//...Rjsのコード
console.log(R.createVText(()=>""));
```