import { getConfig } from "./config";

const config = getConfig();

export async function api({
  path,
  method = "GET",
  body,
}: {
  path: string;
  method?: string;
  body?: any;
}) {
  const url = new URL(path, config.baseUrl);

  const headers = new Headers();
  headers.append("api_key", config.apiKey);
  headers.append("authorization", config.authToken);
  headers.append("Content-Type", "application/json");

  const response = await fetch(url, { method, headers, body });
  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return data;
}

export async function getAllEnvironments() {
  const {
    environments,
  }: {
    environments: Array<{
      uid: string;
      name: string;
      urls: Array<{
        url: string;
        locale: string;
      }>;
    }>;
  } = await api({ path: "environments" });
  return environments;
}

export async function deleteEnvironment(name: string) {
  const data = await api({ path: `environments/${name}`, method: "DELETE" });
  console.log(`Deleted environment ${name}`);
  return data;
}

export async function createEnvironment(environment: {
  name: string;
  urls: Array<{ locale: string; url: string }>;
}) {
  const data = await api({
    path: `environments`,
    method: "POST",
    body: JSON.stringify({ environment }),
  });
  console.log(`Created environment ${environment.name}`);
  return data;
}
