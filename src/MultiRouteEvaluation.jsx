import { Zap, MapPin, ArrowRight } from "lucide-react";
import "./MultiRouteEvaluation.css";

function trafficTone(pct) {
  if (pct < 30) return { label: "Clear", cls: "tone-clear" };
  if (pct < 60) return { label: "Medium", cls: "tone-medium" };
  return { label: "Heavy", cls: "tone-heavy" };
}

function roadConditionFor(pct) {
  if (pct < 30) return { label: "Good", cls: "tone-clear" };
  if (pct < 60) return { label: "Moderate", cls: "tone-medium" };
  return { label: "Poor", cls: "tone-heavy" };
}

export default function MultiRouteEvaluation({
  routes,
  recommendedRoute,
  selectedRouteId,
  onSelect,
}) {
  const shortest = routes.reduce((a, b) => (a.distance < b.distance ? a : b));
  const timeSaved = shortest.id !== recommendedRoute.id
    ? shortest.eta - recommendedRoute.eta
    : 0;

  return (
    <div className="route-eval">
      <div className="route-eval-header">
        <div>
          <span className="route-eval-eyebrow">
            <MapPin size={14} /> Smart route optimization engine
          </span>
          <h2>Multi-route emergency evaluation</h2>
          <p>Compares distance, live traffic density, and signal delays — prioritizes minimum travel time, not shortest distance.</p>
        </div>
      </div>

      <div className="route-eval-grid">
        {routes.map((route) => {
          const traffic = trafficTone(route.traffic);
          const roadCondition = roadConditionFor(route.traffic);
          const isRecommended = route.id === recommendedRoute.id;
          const isSelected = route.id === selectedRouteId;
          return (
            <div
              key={route.id}
              className={
                "route-eval-card" +
                (isSelected ? " selected" : "") +
                (isRecommended ? " recommended" : "")
              }
            >
              {isRecommended && (
                <span className="route-eval-badge">
                  <Zap size={12} /> Recommended
                </span>
              )}
              <h3>{route.name}</h3>
              {route.via && <p className="route-eval-via">Via {route.via}</p>}
              <div className="route-eval-stats">
                <div>
                  <span>Distance</span>
                  <strong>{route.distance} km</strong>
                </div>
                <div>
                  <span>Traffic</span>
                  <strong className={traffic.cls}>{traffic.label}</strong>
                </div>
                <div>
                  <span>Signals</span>
                  <strong>{route.signals}</strong>
                </div>
                <div>
                  <span>ETA</span>
                  <strong>{route.eta} min</strong>
                </div>
                <div>
                  <span>Road Condition</span>
                  <strong className={roadCondition.cls}>{roadCondition.label}</strong>
                </div>
              </div>
              <button
                className={isSelected ? "route-eval-select selected" : "route-eval-select"}
                onClick={() => onSelect(route.id)}
              >
                {isSelected ? "Selected for corridor" : `Choose ${route.name}`}
                {!isSelected && <ArrowRight size={14} />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="route-eval-insight">
        <Zap size={18} />
        <div>
          <strong>Core innovation: weighted time score</strong>
          {shortest.id === recommendedRoute.id ? (
            <p>
              {shortest.name} is both the shortest route and the fastest by weighted
              score — low traffic and minimal signals mean distance alone gets it right this time.
            </p>
          ) : (
            <p>
              Shortest distance is {shortest.name} ({shortest.distance} km), but it runs through
              heavier traffic and more signals. The engine instead recommends {recommendedRoute.name}
              {" "}({recommendedRoute.distance} km), saving roughly {Math.max(timeSaved, 0)} minutes
              of total emergency travel time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
