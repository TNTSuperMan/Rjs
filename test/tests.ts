import { JSDOM } from "jsdom"
//@ts-ignore
import {vi} from "vitest"
vi.stubGlobal("document", new JSDOM("").window.document);
var document = new JSDOM("").window.document;