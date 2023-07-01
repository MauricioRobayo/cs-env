import path from "path";
import { createEnvironment } from "./api";
import fs from "fs/promises";
import { getConfig } from "./config";
import { processInBatches } from "./helpers";

const config = getConfig();

async function getEnvironmentsToCreate(): Promise<
  Array<{ url: string; name: string }>
> {
  const content = await fs.readFile(
    path.join(process.cwd(), "src/environments.json"),
    "utf-8"
  );
  const environments: Array<{ url: string; name: string }> =
    JSON.parse(content);
  return environments.map((env) => {
    return {
      url: env.url.replace("{{site}}", config.site),
      name: env.name,
    };
  });
}

async function createEnvironments() {
  const allEnvironments = await getEnvironmentsToCreate();
  const environmentsToCreate = allEnvironments.map((env) => ({
    name: env.name.toLocaleLowerCase().replace(/\s+/g, "-"),
    urls: [{ locale: "en-us", url: env.url }],
  }));
  console.log(`Creating ${allEnvironments.length} environments`);
  await processInBatches({
    fnc: createEnvironment,
    data: environmentsToCreate,
    batchSize: config.batchSize,
  });
}

createEnvironments();
