import fs from "node:fs";
import path from "node:path";

import { type BuildOptions, defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const watch: BuildOptions["watch"] =
    mode === "watch" ? { buildDelay: 500 } : undefined;

  return {
    plugins: [
      dts({
        insertTypesEntry: true,
        beforeWriteFile: (filePath, content) => {
          if (filePath.endsWith("dist/index.d.ts")) {


            const ctsFile = filePath.replace("d.ts", "d.cts");
            fs.writeFileSync(ctsFile, content);

          }

          return {
            filePath,
            content,
          };
        },
      }),
    ],
    build: {
      emptyOutDir: true,
      sourcemap: true,
      watch,
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        formats: ["es", "cjs"],
        fileName: "index",
      },
    },
  };
});
