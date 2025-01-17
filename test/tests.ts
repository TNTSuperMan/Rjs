import { JSDOM } from "jsdom"
import { vi } from "vitest"
vi.stubGlobal("window",new JSDOM().window)