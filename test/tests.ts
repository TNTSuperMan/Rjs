import { JSDOM } from "jsdom"
//@ts-ignore
import {vi} from "vitest"
vi.stubGlobal("window",new JSDOM().window)