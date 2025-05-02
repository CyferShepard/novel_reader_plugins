import { Application, Router, send } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import "./classes/extensions.ts";
import { parseQuery } from "./classes/api-parser.ts";
import { ScraperPayload } from "../api-parser/mod.ts";
const PORT = 8008;
const router = new Router();

//----------------methods

async function getProjectFiles(project: string) {
  try {
    const projectDir = `./configs/${project}`;

    // Check if directory exists
    try {
      const dirInfo = await Deno.stat(projectDir);
      if (!dirInfo.isDirectory) {
        throw new Error("Project path is not a directory");
      }
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error("Project directory not found");
      }
    }

    // Read and process all TypeScript files in the project directory
    const result = [];

    for await (const entry of Deno.readDir(projectDir)) {
      if (entry.isFile && entry.name.endsWith(".json")) {
        try {
          // Get the file name without extension
          const fileName = entry.name.replace(/\.json$/, "");

          // // Read and parse the JSON file
          // const filePath = `${projectDir}/${entry.name}`;
          // const fileContent = await Deno.readTextFile(filePath);
          // const jsonData = JSON.parse(fileContent);

          // Add to result array
          result.push(fileName);
        } catch (fileErr) {
          console.error(`Error processing file ${entry.name}:`, fileErr);
          result.push({
            name: entry.name.replace(/\.json$/, ""),
            error: `Failed to process: ${fileErr instanceof Error ? fileErr.message : "Unknown error"}`,
          });
        }
      }
    }

    return {
      project: project,
      files: result,
    };
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to read project files: ${(e as Error).toString()}`);
  }
}

// CORS Middleware
function cors(ctx: any, next: any) {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow specific HTTP methods
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204; // No Content for preflight requests
    return;
  }
  return next();
}

//------------------routes

router.get("/:path*", async (context, next) => {
  const filePath = context.params.path || "index.html"; // Default to "index.html" if no file is specified
  if (filePath.startsWith("projects") || filePath.startsWith("parse") || filePath.startsWith("editprojects")) {
    await next();
  }
  try {
    await send(context, filePath, {
      root: "./web", // Path to your HTML folder
      index: "index.html", // Default file to serve
    });
  } catch (error) {}
});

//projects routes

router.get("/projects", async (context) => {
  try {
    const configsDir = "./configs"; // Path to configs folder
    const entries = [];

    // Check if directory exists
    try {
      const dirInfo = await Deno.stat(configsDir);
      if (!dirInfo.isDirectory) {
        context.response.body = { error: "Configs path is not a directory" };
        context.response.status = 500;
        return;
      }
    } catch (error) {
      // If directory doesn't exist, create it
      if (error instanceof Deno.errors.NotFound) {
        await Deno.mkdir(configsDir, { recursive: true });
      } else {
        throw error;
      }
    }

    // Read all entries in the configs directory
    for await (const entry of Deno.readDir(configsDir)) {
      if (entry.isDirectory) {
        entries.push(entry.name);
      }
    }

    context.response.body = entries;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
    context.response.body = { error: (e as Error).toString() };
  }
});

router.post("/projects/:project", async (context) => {
  const project = context.params.project;

  if (!project) {
    context.response.status = 400;
    context.response.body = { error: "Project name is required" };
    return;
  }

  let newProjectName;

  try {
    const body = await context.request.body.json();
    newProjectName = body.newProjectName; // Get the old project name from the request body
  } catch (_error) {}

  try {
    const projectDir = `./configs/${project}`;

    if (newProjectName) {
      const newProjectDir = `./configs/${newProjectName}`;
      try {
        // Check if the old project directory exists
        const dirInfo = await Deno.stat(projectDir);
        if (dirInfo.isDirectory) {
          // Rename the old project directory to the new project name
          await Deno.rename(projectDir, newProjectDir);
          context.response.status = 200;
          context.response.body = {
            success: true,
            message: `Project renamed from ${project} to ${newProjectName}`,
          };
          return;
        }
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          // Old project directory does not exist, continue with creating a new project
          console.warn(`Old project directory ${project} not found.`);
          context.response.status = 404;
          context.response.body = {
            success: false,
            message: `Project was not found for ${project}`,
          };
          return;
        } else {
          throw error;
        }
      }
    }

    // Ensure the new project directory exists
    try {
      await Deno.stat(projectDir);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        await Deno.mkdir(projectDir, { recursive: true });
      } else {
        throw error;
      }
    }

    context.response.status = 201;
    context.response.body = { success: true, message: `Project ${project} created successfully` };
  } catch (e) {
    console.error(e);
    context.response.status = 500;
    context.response.body = { error: (e as Error).toString() };
  }
});

router.delete("/projects/:project", async (context) => {
  const project = context.params.project;
  if (!project) {
    context.response.status = 400;
    context.response.body = { error: "Project name is required" };
    return;
  }

  try {
    const projectDir = `./configs/${project}`;
    await Deno.remove(projectDir, { recursive: true });
    context.response.status = 200;
    context.response.body = { success: true, message: `Project ${project} deleted successfully` };
  } catch (e) {
    console.error(e);
    context.response.status = 500;
    context.response.body = { error: (e as Error).toString() };
  }
});

//editor routes

router.get("/projects/:project", async (context) => {
  const project = context.params.project;
  if (!project) {
    context.response.status = 400;
    context.response.body = { error: "Project name is required" };
    return;
  }

  try {
    const projectFiles = await getProjectFiles(project);
    context.response.body = projectFiles;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
    context.response.body = { error: (e as Error).toString() };
  }
});

// Add this endpoint to your existing router
router.post("/projects/:project/:filename", async (context) => {
  const project = context.params.project;
  const filename = context.params.filename;
  if (!project) {
    context.response.status = 400;
    context.response.body = { error: "Project name is required" };
    return;
  }

  if (!filename) {
    context.response.status = 400;
    context.response.body = { error: "Filename is required" };
    return;
  }

  try {
    const schema =
      (await context.request.body.text()) == ""
        ? new ScraperPayload({
            url: "",
            query: [],
          }).toJson()
        : await context.request.body.json();
    // if (!schema) {
    //   context.response.status = 400;
    //   context.response.body = { error: "Schema is required" };
    //   return;
    // }

    console.log("Schema:", schema);

    // Ensure project directory exists
    const projectDir = `./configs/${project}`;
    try {
      await Deno.stat(projectDir);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        await Deno.mkdir(projectDir, { recursive: true });
      } else {
        throw error;
      }
    }

    // Write the JSON directly to a file
    const filePath = `${projectDir}/${filename.endsWith(".json") ? filename : filename + ".json"}`;
    await Deno.writeTextFile(filePath, JSON.stringify(schema, null, 2));

    context.response.status = 201;
    context.response.body = {
      success: true,
      message: `File ${filename} saved successfully`,
      path: filePath,
    };
  } catch (e) {
    console.error(e);
    context.response.status = 500;
    context.response.body = { error: (e as Error).toString() };
  }
});

router.post("/editprojects/:project/editfilename", async (context) => {
  const project = context.params.project;
  const payload = await context.request.body.json();
  if (!project) {
    context.response.status = 400;
    context.response.body = { error: "Project name is required" };
    return;
  }

  if (!payload || !payload.oldName || !payload.newName) {
    context.response.status = 400;
    context.response.body = { error: "Old and new filenames are required" };
    return;
  }

  try {
    console.log("Payload:", payload);
    const oldFilePath = `./configs/${project}/${payload.oldName}.json`;
    const newFilePath = `./configs/${payload.newProject ?? project}/${payload.newName}.json`;

    await Deno.rename(oldFilePath, newFilePath);
    context.response.status = 200;
    context.response.body = { success: true, message: `File renamed successfully` };
  } catch (e) {
    console.error(e);
    context.response.status = 500;
    context.response.body = { error: (e as Error).toString() };
  }
});

router.delete("/projects/:project/:filename", async (context) => {
  const project = context.params.project;
  const filename = context.params.filename;

  if (!project || !filename) {
    context.response.status = 400;
    context.response.body = { error: "Project name and filename are required" };
    return;
  }

  try {
    const filePath = `./configs/${project}/${filename}.json`;
    await Deno.remove(filePath);
    context.response.status = 200;
    context.response.body = { success: true, message: `File ${filename} deleted successfully` };
  } catch (e) {
    console.error(e);
    context.response.status = 500;
    context.response.body = { error: (e as Error).toString() };
  }
});

router.get("/projects/:project/:filename", async (context) => {
  const project = context.params.project;
  const filename = context.params.filename;

  if (!project || !filename) {
    context.response.status = 400;
    context.response.body = { error: "Project name and filename are required" };
    return;
  }

  try {
    const filePath = `./configs/${project}/${filename}.json`;
    const fileContent = await Deno.readTextFile(filePath);
    context.response.body = JSON.parse(fileContent);
  } catch (e) {
    console.error(e);
    context.response.status = 500;
    context.response.body = { error: (e as Error).toString() };
  }
});

//parse routes

router.post("/parse", async (context) => {
  const payload = await context.request.body.json();
  if (!payload) {
    context.response.status = 400;
    context.response.body = { error: "Payload is required" };
    return;
  }

  await parseQuery(ScraperPayload.fromJson(payload)).then((response) => {
    if (response) {
      console.log(response.toJson());
      context.response.body = response.toJson();
    } else {
      console.error("Failed to parse response");
      context.response.status = 500;
      context.response.body = { error: "Failed to parse response" };
    }
  });
});

const app = new Application();
// Use the CORS middleware
app.use(cors);

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
