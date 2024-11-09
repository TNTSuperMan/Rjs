import "./tests"
import {createProxy, createVElement, createVText, VNode} from "../index.ts";
//@ts-ignore
import { describe, it, expect } from "vitest";

describe("Text",()=>{
    it("Text",()=>{
        const MSG = "Hello";
        const [proxy] = createProxy({value: ""});
        let vnode:VNode<Text>|null;
        vnode = createVText(()=>proxy.value);

        expect(vnode?.node.nodeValue).toBe("");

        proxy.value = MSG
        expect(vnode?.node.nodeValue).toBe(MSG);
    })
})

describe("Element",()=>{
    it("Attr",()=>{
        const MSG = "Hello";
        const [proxy] = createProxy({value: ""});
        let vnode:VNode<Element>|null;
        vnode = createVElement("div",()=>[], ()=>({
            id: proxy.value
        }))

        expect(vnode?.node.getAttribute("id")).toBe("");

        proxy.value = MSG
        expect(vnode?.node.getAttribute("id")).toBe(MSG);
    })
})