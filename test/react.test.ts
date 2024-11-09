import "./tests"
import {createProxy, fook} from "../index.ts";
//@ts-ignore
import { describe, it, expect } from "vitest";

describe("React",()=>{
    it("Simple",()=>{
        const MSG = "Hello"
        const [proxy] = createProxy({value:""})
        let fook_apply_target = "";

        fook(()=>fook_apply_target = proxy.value)
    
        proxy.value = MSG

        expect(fook_apply_target).toBe(MSG)
    })
    it("Target changing",()=>{
        const MSG = "Hello"
        let fook_apply_target = "";
        const [proxy] = createProxy({value1:"",value2:"",cond:false})

        fook(()=>fook_apply_target = proxy.cond ? proxy.value1 : proxy.value2)
    
        proxy.cond = true;
        proxy.value1 = MSG;
    
        expect(fook_apply_target).toBe(MSG)
    })
    it("Tower",()=>{
        const [proxy] = createProxy({value:"aaa"})
        let root_effectcount = 0;
        let child_effectcount = 0;
    
        fook(()=>{
            root_effectcount += 1
            fook(()=>proxy.value,()=>{
                child_effectcount += 1;
        })});
        
        expect(root_effectcount).toBe(1);
        expect(child_effectcount).toBe(1);
    
        proxy.value="";
        
        expect(root_effectcount).toBe(1);
        expect(child_effectcount).toBe(2);
    })
})