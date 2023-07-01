import { deleteEnvironment, getAllEnvironments } from "./api";
import { getConfig } from "./config";
import { processInBatches } from "./helpers";

const config = getConfig();
const environmentsToExclude = ["production", "preview", "development"];

async function deleteEnvironments() {
  const allEnvironments = await getAllEnvironments();
  const environmentsToDelete = allEnvironments
    .filter((env) => !environmentsToExclude.includes(env.name))
    .map((env) => env.name);
  console.log(`Deleting ${environmentsToDelete.length} environments`);
  await processInBatches({
    fnc: deleteEnvironment,
    data: environmentsToDelete,
    batchSize: config.batchSize,
  });
}

deleteEnvironments();
