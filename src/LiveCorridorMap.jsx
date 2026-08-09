import { useState, useEffect, useRef } from "react";
import {
  Ambulance,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Plus,
  Minus,
  LocateFixed,
  Sparkles,
} from "lucide-react";
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

// Traffic condition per segment (between consecutive path points), used to
// color the route line — mirrors how the corridor gets busier near the hospital.
const SEGMENT_TRAFFIC = ["clear", "clear", "clear", "medium", "heavy"];
const SEGMENT_COLOR = { clear: "#22c55e", medium: "#f59e0b", heavy: "#ef4444" };

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

export default function LiveCorridorMap({
  ambulanceId = "WB-01-A102",
  distanceKm = 6.1,
  etaMin = 15,
  from = "Park Street",
  to = "City General Hospital",
  patient = { detail: "Male, 45 Yrs", condition: "Cardiac Arrest" },
  emergencyLevel = "Critical",
  priority = "High",
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

  const runDemo = () => {
    setProgress(0);
    setSpeedMult(1);
    setPlaying(true);
  };

  const ambulancePos = pointOnPath(PATH_POINTS, progress);
  const distanceRemaining = Math.max(0, distanceKm * (1 - progress)).toFixed(1);
  const etaRemaining = Math.max(0, Math.round(etaMin * (1 - progress)));
  const speedKmh = playing ? 40 + speedMult * 12 : 0;

  return (
    <div className="corridor-map">
      {/* Info bar */}
      <div className="corridor-infobar">
        <div>
          <span>Current Location</span>
          <strong>{from}</strong>
        </div>
        <div>
          <span>Destination</span>
          <strong>{to}</strong>
        </div>
        <div>
          <span>ETA</span>
          <strong className="tone-amber">
            {progress >= 1 ? "Arrived" : `${etaRemaining} min`}
          </strong>
        </div>
        <div>
          <span>Distance</span>
          <strong className="tone-green">{distanceRemaining} km</strong>
        </div>
        <div>
          <span>Emergency</span>
          <strong className="pill pill-red">{emergencyLevel}</strong>
        </div>
        <div>
          <span>Patient</span>
          <strong>{patient.detail}</strong>
        </div>
        <div>
          <span>Condition</span>
          <strong>{patient.condition}</strong>
        </div>
        <div>
          <span>Priority</span>
          <strong className="pill pill-blue">{priority}</strong>
        </div>
      </div>

      <div className="corridor-map-body">
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
        </div>

        <div className="corridor-layer-controls">
          <button className="layer-btn"><Layers size={15} /></button>
          <button className="layer-btn"><Plus size={15} /></button>
          <button className="layer-btn"><Minus size={15} /></button>
          <button className="layer-btn"><LocateFixed size={15} /></button>
        </div>

        <svg viewBox="0 0 900 500" className="corridor-svg">
          {/* base route (dim) */}
          {PATH_POINTS.slice(0, -1).map((p, i) => (
            <line
              key={`base-${i}`}
              x1={p.x} y1={p.y}
              x2={PATH_POINTS[i + 1].x} y2={PATH_POINTS[i + 1].y}
              className="corridor-route-base"
            />
          ))}

          {/* traffic-colored segments */}
          {PATH_POINTS.slice(0, -1).map((p, i) => (
            <line
              key={`seg-${i}`}
              x1={p.x} y1={p.y}
              x2={PATH_POINTS[i + 1].x} y2={PATH_POINTS[i + 1].y}
              stroke={SEGMENT_COLOR[SEGMENT_TRAFFIC[i]]}
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.9"
            />
          ))}

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
                <rect x={pos.x - 7} y={pos.y - 24} width="14" height="26" rx="4" className="signal-box" />
                <circle
                  cx={pos.x} cy={pos.y - 17} r="4"
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
            <text x="-40" y="-24" className="corridor-hospital-label">{to}</text>
          </g>

          <g transform={`translate(${ambulancePos.x}, ${ambulancePos.y})`} className="ambulance-marker">
            <rect x="-38" y="-34" width="76" height="20" rx="6" className="ambulance-tag" />
            <text x="0" y="-20" textAnchor="middle" className="ambulance-tag-text">
              {ambulanceId} {playing ? "● Live" : ""}
            </text>
            <circle r="12" className="ambulance-pulse" />
            <circle r="8" className="ambulance-dot" />
          </g>
        </svg>
      </div>

      <div className="corridor-controls">
        <button className="corridor-btn demo" onClick={runDemo}>
          <Sparkles size={16} />
          1-Click Hackathon Demo
        </button>
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

