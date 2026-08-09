import { useState, useEffect, useRef } from "react";
import { Ambulance, Hospital as HospitalIcon, Play, Pause, RotateCcw } from "lucide-react";
import "./LiveCorridorMap.css";

// A path made of waypoints (SVG viewBox 0 0 900 500). Traffic lights sit at
// specific points along the path and flip green as the ambulance approaches.
const PATH_POINTS = [
  { x: 60, y: 400 },
  { x: 230, y: 400 },
  { x: 400, y: 330 },
  { x: 560, y: 330 },
  { x: 640, y: 200 },
  { x: 780, y: 90 },
];

const JUNCTIONS = [
  { id: "J1", label: "Junction 1", t: 0.22 },
  { id: "J2", label: "Junction 2", t: 0.48 },
  { id: "J3", label: "Junction 3", t: 0.7 },
  { id: "J4", label: "Junction 4", t: 0.92 },
];

const GREEN_WINDOW = 0.09; // how far ahead of the ambulance a light turns green

function pointOnPath(points, t) {
  const segCount = points.length - 1;
  const segT = t * segCount;
  const i = Math.min(Math.floor(segT), segCount - 1);
  const localT = segT - i;
  const a = points[i];
  const b = points[i + 1];
  return { x: a.x + (b.x - a.x) * localT, y: a.y + (b.y - a.y) * localT };
}

function pathD(points) {
  return points.reduce(
    (d, p, i) => d + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`),
    ""
  );
}

export default function LiveCorridorMap({
  distanceKm = 6.1,
  etaMin = 15,
  from = "Park Street",
  to = "City General Hospital",
}) {
  const [progress, setProgress] = useState(0); // 0 -> 1
  const [playing, setPlaying] = useState(false);
  const [speedMult, setSpeedMult] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          const next = p + 0.0025 * speedMult;
          if (next >= 1) {
            setPlaying(false);
            return 1;
          }
          return next;
        });
      }, 30);
      return () => clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speedMult]);

  const reset = () => {
    setPlaying(false);
    setProgress(0);
  };

  const ambulancePos = pointOnPath(PATH_POINTS, progress);
  const distanceRemaining = Math.max(0, distanceKm * (1 - progress)).toFixed(1);
  const etaRemaining = Math.max(0, Math.round(etaMin * (1 - progress)));
  const speedKmh = playing ? 40 + speedMult * 12 : 0;

  return (
    <div className="corridor-map">
      <div className="corridor-hud">
        <div className="hud-title">
          <span className="hud-dot" />
          Live telemetry
        </div>
        <div className="hud-row">
          <div className="hud-stat">
            <span>Speed</span>
            <strong>{speedKmh} km/h</strong>
          </div>
          <div className="hud-stat">
            <span>Distance remaining</span>
            <strong>{distanceRemaining} km</strong>
          </div>
        </div>
        <div className="hud-eta">
          <span>ETA to hospital</span>
          <strong>{progress >= 1 ? "Arrived" : `${etaRemaining} min`}</strong>
        </div>
      </div>

      <svg viewBox="0 0 900 500" className="corridor-svg">
        <path d={pathD(PATH_POINTS)} className="corridor-route" />
        <path
          d={pathD(PATH_POINTS)}
          className="corridor-route-progress"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 1000 - progress * 1000,
          }}
        />

        <circle cx={PATH_POINTS[0].x} cy={PATH_POINTS[0].y} r="9" className="corridor-start" />
        <text x={PATH_POINTS[0].x - 30} y={PATH_POINTS[0].y + 24} className="corridor-label">
          {from}
        </text>

        {JUNCTIONS.map((j) => {
          const pos = pointOnPath(PATH_POINTS, j.t);
          const isGreen = progress > j.t - GREEN_WINDOW && progress < j.t + 0.03;
          const isPassed = progress >= j.t + 0.03;
          return (
            <g key={j.id}>
              <rect
                x={pos.x - 7}
                y={pos.y - 24}
                width="14"
                height="26"
                rx="4"
                className="signal-box"
              />
              <circle
                cx={pos.x}
                cy={pos.y - 17}
                r="4"
                className={isGreen || isPassed ? "signal-green" : "signal-red"}
              />
              <text x={pos.x - 24} y={pos.y + 20} className="corridor-label">
                {j.label}
              </text>
            </g>
          );
        })}

        <g transform={`translate(${PATH_POINTS[PATH_POINTS.length - 1].x}, ${PATH_POINTS[PATH_POINTS.length - 1].y})`}>
          <rect x="-16" y="-16" width="32" height="32" rx="8" className="corridor-hospital" />
          <text x="0" y="5" textAnchor="middle" className="corridor-hospital-icon">H</text>
          <text x="-40" y="-24" className="corridor-hospital-label">
            {to}
          </text>
        </g>

        <g transform={`translate(${ambulancePos.x}, ${ambulancePos.y})`} className="ambulance-marker">
          <circle r="12" className="ambulance-pulse" />
          <circle r="8" className="ambulance-dot" />
        </g>
      </svg>

      <div className="corridor-controls">
        <button className="corridor-btn primary" onClick={() => setPlaying((p) => !p)} disabled={progress >= 1}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
          {playing ? "Pause" : "Play"}
        </button>
        <button className="corridor-btn" onClick={reset}>
          <RotateCcw size={16} />
          Reset
        </button>
        <div className="speed-group">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              className={speedMult === s ? "speed-btn active" : "speed-btn"}
              onClick={() => setSpeedMult(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
