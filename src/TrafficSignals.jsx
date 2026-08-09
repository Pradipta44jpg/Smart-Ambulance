import { useState } from "react";
import { Radio } from "lucide-react";
import "./TrafficSignals.css";

const SIGNALS = [
  { id: 1, name: "Signal 1", location: "EM Bypass" },
  { id: 2, name: "Signal 2", location: "Park Circus" },
  { id: 3, name: "Signal 3", location: "AJC Bose Road" },
  { id: 4, name: "Signal 4", location: "Minto Park" },
];

export default function TrafficSignals({
  signalPriority,
  onToggleAutoPriority,
  activeSignalId = 2,
  nextSignalLabel = "Park Circus (0.4 km)",
  ambulanceId = "WB-01-A102",
  onExtendGreen,
}) {
  return (
    <div className="panel signals-panel">
      <div className="panel-header">
        <div>
          <h2>Traffic Signals</h2>
          <p>Real-time signal status and priority control</p>
        </div>
        <label className="auto-priority-toggle">
          <span>Auto Priority</span>
          <button
            className={signalPriority ? "toggle-switch on" : "toggle-switch"}
            onClick={() => onToggleAutoPriority(!signalPriority)}
          >
            <span className="toggle-knob" />
          </button>
          <span className={signalPriority ? "toggle-state on" : "toggle-state"}>
            {signalPriority ? "ON" : "OFF"}
          </span>
        </label>
      </div>

      <div className="signals-grid">
        {SIGNALS.map((s) => {
          const isPriority = signalPriority && s.id === activeSignalId;
          return (
            <div className="signal-card" key={s.id}>
              <h4>{s.name}</h4>
              <p className="signal-location">{s.location}</p>
              <div className="signal-light">
                <span className={!isPriority ? "light red on" : "light red"} />
                <span className="light yellow" />
                <span className={isPriority ? "light green on" : "light green"} />
              </div>
              <span className="signal-status-label">Status</span>
              <span className={isPriority ? "signal-status active" : "signal-status"}>
                {isPriority ? "Priority Active" : "Normal"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="priority-control">
        <div className="priority-control-icon">
          <Radio size={18} />
        </div>
        <div className="priority-control-text">
          <strong>Priority Control</strong>
          <p>
            Ambulance <code>{ambulanceId}</code> approaching · Next signal:{" "}
            <span className="next-signal">{nextSignalLabel}</span>
          </p>
        </div>
        <button className="extend-green-btn" onClick={onExtendGreen}>
          Extend Green Time
        </button>
      </div>
    </div>
  );
}
