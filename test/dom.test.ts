import "./tests"
import {createProxy, createVText, VNode} from "../index.ts";
//@ts-ignore
import { describe, it, expect, vi } from "vitest";

describe("Text",()=>{
    const MSG = "Hello"
    let proxy = {value:""};
    let vnode:VNode<Text>|null;
    it("Create proxy", ()=>
        [proxy] = createProxy(proxy))

    it("Create VText",()=>
        vnode = createVText(()=>proxy.value))

    it("Check text",()=>expect(vnode?.node.nodeValue).toBe(""))

    it("Edit proxy",()=>
        proxy.value = MSG)

    it("Is Applied?",()=>
        expect(vnode?.node.nodeValue).toBe(MSG))
})
