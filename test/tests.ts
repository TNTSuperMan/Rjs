import { JSDOM } from "jsdom"
//@ts-ignore
import {vi} from "vitest"
const wind = new JSDOM("").window;
vi.stubGlobal("document", wind.document);
vi.stubGlobal("CustomEvent", wind.CustomEvent);