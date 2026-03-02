import { defineConfig, type Plugin, loadEnv } from "vite";
import path from "path";
import fs from "fs";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function firebaseSWPlugin(): Plugin {
  let envVars: Record<string, string> = {};

  return {
    name: "firebase-sw-env",
    configResolved(config) {
      envVars = loadEnv(config.mode, config.root, "VITE_");
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/firebase-messaging-sw.js") {
          const filePath = path.resolve("public/firebase-messaging-sw.js");
          let content = fs.readFileSync(filePath, "utf-8");
          content = content.replace(
            /\{\{(\w+)\}\}/g,
            (_, key) => envVars[key] || "",
          );
          res.setHeader("Content-Type", "application/javascript");
          res.end(content);
          return;
        }
        next();
      });
    },
    writeBundle(options) {
      const outDir = options.dir || "dist";
      const swPath = path.resolve(outDir, "firebase-messaging-sw.js");
      if (fs.existsSync(swPath)) {
        let content = fs.readFileSync(swPath, "utf-8");
        content = content.replace(
          /\{\{(\w+)\}\}/g,
          (_, key) => envVars[key] || "",
        );
        fs.writeFileSync(swPath, content);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), firebaseSWPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
