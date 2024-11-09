import "./tests"
import {createProxy, fook} from "../index.ts";
//@ts-ignore
import { describe, it, expect } from "vitest";

describe("Simple",()=>{
    const MSG = "Hello"
    let proxy = {value:""};
    let fook_apply_target = "";
    it("Create proxy", ()=>
        [proxy] = createProxy(proxy))

    it("Subscribe react",()=>
        fook(()=>fook_apply_target = proxy.value))

    it("Edit proxy",()=>
        proxy.value = MSG)

    it("Is Applied?",()=>
        expect(fook_apply_target).toBe(MSG))
})

describe("Target changing",()=>{
    const MSG = "Hello"
    let proxy = {value1:"",value2:"",cond:false};
    let fook_apply_target = "";
    it("Create proxy", ()=>
        [proxy] = createProxy(proxy))

    it("Subscribe react",()=>
        fook(()=>fook_apply_target = proxy.cond ? proxy.value1 : proxy.value2))

    it("Edit proxy",()=>{
        proxy.cond = true;
        proxy.value1 = MSG;
    })

    it("Is Applied?",()=>
        expect(fook_apply_target).toBe(MSG))
})

describe("Tower",()=>{
    let proxy = {value:"aaa"};
    let root_effectcount = 0;
    let child_effectcount = 0;
    it("Create proxy",()=>
        [proxy] = createProxy(proxy));

    it("Subscribe react",()=>
        fook(()=>{
            root_effectcount += 1
            fook(()=>proxy.value,()=>{
                child_effectcount += 1;
            })}));
    
    it("Check root effect count", ()=>expect(root_effectcount).toBe(1));
    it("Check child effect count", ()=>expect(child_effectcount).toBe(1));

    it("Update", ()=>proxy.value="");
    
    it("Check root effect count", ()=>expect(root_effectcount).toBe(1));
    it("Check child effect count", ()=>expect(child_effectcount).toBe(2));
})