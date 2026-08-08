export function calculateETA(route) {
  const baseTime = route.distance * 2;
  const trafficDelay = route.traffic * 0.08;
  const signalDelay = route.signals * 1.5;

  return Math.round(baseTime + trafficDelay + signalDelay);
}
export function calculateRouteScore(route) {
  const eta = calculateETA(route);

  return eta;
}
export function findBestRoute(routes) {
  let bestRoute = routes[0];

  routes.forEach((route) => {
    if (
      calculateRouteScore(route) <
      calculateRouteScore(bestRoute)
    ) {
      bestRoute = route;
    }
  });

  return {
    ...bestRoute,
    eta: calculateETA(bestRoute),
  };
}