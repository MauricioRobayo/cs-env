import dotenv from "dotenv";
dotenv.config();

const envVariables = {
  baseUrl: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
  authToken: process.env.AUTH_TOKEN,
  batchSize: Number(process.env.BATCH_SIZE ?? 10),
  batchInterval: Number(process.env.BATCH_INTERVAL ?? 1000),
  site: process.env.SITE,
};

function isValidConfig(config: typeof envVariables): config is {
  [K in keyof typeof envVariables]: NonNullable<(typeof envVariables)[K]>;
} {
  let allGood = true;
  for (const [key, value] of Object.entries(envVariables)) {
    if (!value) {
      console.error(`Missing environment variable: ${key}`);
      allGood = false;
    }
  }
  return allGood;
}

export function getConfig() {
  if (!isValidConfig(envVariables)) {
    throw new Error("Invalid configuration");
  }
  return envVariables;
}
