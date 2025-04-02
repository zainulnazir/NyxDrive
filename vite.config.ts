import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { Buffer } from "buffer";
import process from "process";

// https://vitejs.dev/config/
export default defineConfig({
plugins: [react()],
define: {
"global": "window",
"global.Buffer": "Buffer",
"process.env": "{}", // Minimal process polyfill
},
resolve: {
alias: {
buffer: "buffer",
process: "process",
},
},
server: {
port: 1420,
},
});
