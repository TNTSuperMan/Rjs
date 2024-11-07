import { createProxy } from "../src/proxy";
import { createReact } from "../src/reactive";
//@ts-ignore
import { describe, it, expect } from "vitest";

describe("Simple",()=>{
    const MSG = "Hello"
    let proxy = {value:""};
    let fook_apply_target = "";
    it("Create proxy", ()=>
        [proxy] = createProxy(proxy))

    it("Subscribe react",()=>
        createReact(()=>fook_apply_target = proxy.value))

    it("Edit proxy",()=>
        proxy.value = MSG)

    it("Is Applied?",()=>
        expect(fook_apply_target).toBe(proxy.value))
})

describe("Target changing",()=>{
    const MSG = "Hello"
    let proxy = {value1:"",value2:"",cond:false};
    let fook_apply_target = "";
    it("Create proxy", ()=>
        [proxy] = createProxy(proxy))

    it("Subscribe react",()=>
        createReact(()=>fook_apply_target = proxy.cond ? proxy.value1 : proxy.value2))

    it("Edit proxy",()=>{
        proxy.cond = true;
        proxy.value1 = MSG;
    })

    it("Is Applied?",()=>
        expect(fook_apply_target).toBe(proxy.value1))
})
