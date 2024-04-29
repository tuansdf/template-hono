import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/server.ts",
  output: {
    file: "dist/main.mjs",
    format: "es",
    sourcemap: true,
  },
  plugins: [nodeResolve(), commonjs(), json(), typescript()],
};
