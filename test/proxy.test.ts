import { describe, expect, it } from "vitest";
import { createProxy, hook } from "../src";

describe("proxy",()=>{
    it("effectcheck",()=>{

        const [flag] = createProxy({value:true})
        const [proxy1] = createProxy({value:"1"});
        const [proxy2] = createProxy({value:"2"});
        let effectdata = "";
        let calccount = 0;
        hook(()=>{
            calccount++;
            if(flag.value){
                effectdata = proxy1.value;
            }else{
                effectdata = proxy2.value;
            }
        })
        expect(effectdata).toBe("1");
        expect(calccount).toBe(1);//一応初期計算数等の確認

        flag.value = false;
        expect(effectdata).toBe("2");
        expect(calccount).toBe(2);//proxy2を読み込んでいることを確認

        proxy1.value = "3";
        expect(effectdata).toBe("2");
        expect(calccount).toBe(2);//参照されていないproxy1で再計算が行われないことｗ確認
    })
})