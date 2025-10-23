// next.config.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./next.config.ts").default;
export default config;