import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function parseAllowedHosts(value: string | undefined): string[] | undefined {
  const hosts = value
    ?.split(",")
    .map((host) => host.trim())
    .filter(Boolean);

  return hosts?.length ? hosts : undefined;
}

const allowedHosts = parseAllowedHosts(process.env.PAPERCLIP_UI_ALLOWED_HOSTS);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      lexical: path.resolve(__dirname, "./node_modules/lexical/Lexical.mjs"),
    },
  },
  server: {
    port: 5173,
    allowedHosts,
    proxy: {
      "/api": {
        target: "http://localhost:3100",
        ws: true,
      },
    },
  },
});
