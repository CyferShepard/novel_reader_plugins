import { walk } from "https://deno.land/std/fs/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { dirname, join, relative, basename, resolve } from "https://deno.land/std/path/mod.ts";

const inputFolder = "./plugins"; // Root folder to scan for .ts files
const outputFolder = "./configs"; // Folder to store JSON outputs

async function processFiles() {
  for await (const entry of walk(inputFolder, { exts: [".ts"], includeDirs: false })) {
    if (entry.isFile) {
      const relativePath = relative(inputFolder, entry.path);
      const outputPath = join(outputFolder, relativePath.replace(/\.ts$/, ".json"));
      const fileName = basename(entry.path, ".ts"); // Get the file name without extension

      try {
        // Resolve the absolute path for the file
        const absolutePath = resolve(entry.path);

        // Dynamically import the .ts file
        const module = await import(`file://${absolutePath}`);
        const exportedObject = module.default; // Access the default export

        if (exportedObject && typeof exportedObject.toJson === "function") {
          const result = await exportedObject.toJson(); // Call the `.toJson` property
          await ensureDir(dirname(outputPath)); // Ensure the output directory exists
          await Deno.writeTextFile(outputPath, JSON.stringify(result, null, 2)); // Write JSON output
          console.log(`Processed: ${entry.path} -> ${outputPath}`);
        } else {
          console.warn(`Skipped: ${entry.path} (default export missing or .toJson not a function)`);
        }
      } catch (error) {
        console.error(`Error processing ${entry.path}:`, error);
      }
    }
  }
}

processFiles().catch((error) => console.error("Error:", error));
