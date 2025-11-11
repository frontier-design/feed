// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { webcrypto } from "node:crypto";

// Some tools accidentally unset/override global crypto; ensure it's present.
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  globalThis.crypto = webcrypto;
}

export default defineConfig({
  plugins: [react()],
});
