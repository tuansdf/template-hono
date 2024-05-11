import devServer, { defaultOptions } from "@hono/vite-dev-server";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    devServer({
      exclude: ["/src/assets/.*", ...defaultOptions.exclude],
      entry: "src/server.ts", // The file path of your application.
    }),
  ],
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
