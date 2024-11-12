import "./tests"
import {createProxy, createVElement, createVText, VNode} from "../index";
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
        let vnode:VNode<Element> = 
            createVElement("div",()=>[], ()=>({
            id: proxy.value
        }))

        expect(vnode?.node.getAttribute("id")).toBe("");

        proxy.value = MSG
        expect(vnode?.node.getAttribute("id")).toBe(MSG);
    })
    it("Remove",()=>{
        const MSG = "Hello";
        const [proxy] = createProxy([1,2]);
        let vnode:VNode<Element> = 
            createVElement("div",
                ()=>proxy.map(e=>createVText(()=>e.toString())), 
        )

        expect(vnode?.node.childNodes.length).toBe(2);

        proxy.push(3,4)
        expect(vnode?.node.childNodes.length).toBe(4);

        proxy.pop();
        expect(vnode?.node.childNodes.length).toBe(3);
    })
})