import { useState, useEffect } from "react";
import { Siren, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import "./WelcomeSplash.css";

export default function WelcomeSplash({ onProceed, redirectSeconds = 5 }) {
  const [secondsLeft, setSecondsLeft] = useState(redirectSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onProceed();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, onProceed]);

  return (
    <div className="splash-screen">
      <div className="splash-card">
        <div className="splash-logo">
          <Siren size={44} />
          <span className="splash-logo-dot" />
        </div>

        <h1 className="splash-title">
          Smart<span>Care</span>
        </h1>
        <p className="splash-subtitle">
          Smart Ambulance &amp; Intelligent Green Corridor System
        </p>

        <div className="splash-quote">
          <div className="splash-quote-tag">
            <ShieldCheck size={14} />
            Official emergency response platform
          </div>
          <p>
            "Welcome to <strong>SmartCare</strong> — saving lives through real-time
            traffic signal automation, smart ambulance dispatching, and ER
            hospital coordination."
          </p>
        </div>

        <div className="splash-footer-row">
          <div className="splash-countdown">
            <Zap size={14} />
            Redirecting in: <strong>{secondsLeft}s</strong>
          </div>
          <button className="splash-proceed" onClick={onProceed}>
            Proceed to Login
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <p className="splash-copyright">ResQWay © 2026 Emergency Telemetry Engine</p>
    </div>
  );
}
