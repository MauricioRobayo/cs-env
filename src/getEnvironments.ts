import { getAllEnvironments } from "./api";

getAllEnvironments().then((environments) => {
  console.log(environments.map((env) => env.name));
});
