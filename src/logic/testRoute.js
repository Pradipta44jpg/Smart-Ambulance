import { routes } from "./routeData";
import {
  calculateETA,
  findBestRoute,
} from "./routeAlgorithm";

console.log("ROUTES:");

routes.forEach((route) => {
  console.log(
    route.name,
    "ETA:",
    calculateETA(route),
    "minutes"
  );
});

const bestRoute = findBestRoute(routes);

console.log("BEST ROUTE:");
console.log(bestRoute);
