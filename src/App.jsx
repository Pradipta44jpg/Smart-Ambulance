import { useState, useRef } from "react";
import { routes } from "./logic/routeData";
import { getRouteAnalysis } from "./logic/routeAlgorithm";
import {
  Ambulance,
  Hospital,
  Siren,
  Bed,
  Activity,
  MapPin,
  Clock,
  AlertTriangle,
  User,
  Navigation,
  Route as RouteIcon,
  Radio,
  FileText,
  Settings as SettingsIcon,
} from "lucide-react";
import LiveCorridorMap from "./LiveCorridorMap";
import MultiRouteEvaluation from "./MultiRouteEvaluation";
import TrafficSignals from "./TrafficSignals";
import WelcomeSplash from "./WelcomeSplash";
import "./App.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: Activity },
  { id: "ambulances", label: "Ambulances", Icon: Ambulance },
  { id: "liveTracking", label: "Live Tracking", Icon: Navigation },
  { id: "routeAnalysis", label: "Route Analysis", Icon: RouteIcon },
  { id: "signals", label: "Signals", Icon: Radio },
  { id: "hospitals", label: "Hospitals", Icon: Hospital },
  { id: "alerts", label: "Alerts", Icon: AlertTriangle },
  { id: "reports", label: "Reports", Icon: FileText },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [currentRoutes, setCurrentRoutes] = useState(routes);
  const [signalPriority, setSignalPriority] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(
    "City General Hospital"
  );
  const [role, setRole] = useState("driver");

  // ---- Multi-route evaluation ----
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  // ---- Connected emergency flow ----
  // stage: idle -> assigned -> enroute -> arrived -> reserved -> accepted
  const [stage, setStage] = useState("idle");
  const [beds, setBeds] = useState(12);

  const emergencyActive = stage !== "idle";

  const { routes: analyzedRoutes, recommendedRoute } =
    getRouteAnalysis(currentRoutes);

  const simulateTrafficUpdate = () => {
    const updatedRoutes = currentRoutes.map((route) => ({
      ...route,
      traffic: Math.floor(Math.random() * 100),
    }));
    setCurrentRoutes(updatedRoutes);
  };

  const requestAmbulance = () => setStage("assigned");
  const startNavigation = () => setStage("enroute");
  const markArrived = () => setStage("arrived");
  const reserveBed = () => {
    setBeds((b) => Math.max(0, b - 1));
    setStage("reserved");
  };
  const acceptAmbulance = () => setStage("accepted");
  const chooseRoute = (routeId) => {
    setSelectedRouteId(routeId);
    if (stage === "assigned") setStage("enroute");
    setActiveNav("liveTracking");
  };
  const resetEmergency = () => {
    setStage("idle");
    setSignalPriority(false);
    setBeds(12);
  };

  const stageLabel = {
    idle: "Standby",
    assigned: "Ambulance Assigned",
    enroute: "Emergency Response Active",
    arrived: "Arrived at Hospital",
    reserved: "Bed Reserved",
    accepted: "Patient Received",
  }[stage];

  // ---- 1-click full hackathon demo: walks the whole story automatically ----
  const [demoRunning, setDemoRunning] = useState(false);
  const demoTimers = useRef([]);

  const clearDemoTimers = () => {
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];
  };

  const stopDemo = () => {
    clearDemoTimers();
    setDemoRunning(false);
  };

  const runFullDemo = () => {
    clearDemoTimers();
    setDemoRunning(true);

    // Reset everything to a clean starting point
    setStage("idle");
    setSignalPriority(false);
    setBeds(12);
    setRole("user");
    setActiveNav("dashboard");

    const schedule = (fn, delay) => {
      demoTimers.current.push(setTimeout(fn, delay));
    };

    // 1. User requests an ambulance
    schedule(() => setStage("assigned"), 1200);

    // 2. Switch to Driver + show route comparison
    schedule(() => {
      setRole("driver");
      setActiveNav("routeAnalysis");
    }, 3200);

    // 3. Start navigation and jump to Live Tracking (auto-plays the corridor map)
    schedule(() => {
      setStage("enroute");
      setActiveNav("liveTracking");
    }, 6200);

    // 4. Show signal priority kicking in
    schedule(() => {
      setActiveNav("signals");
      setSignalPriority(true);
    }, 10200);

    // 5. Ambulance arrives, switch to Hospital role
    schedule(() => {
      setStage("arrived");
      setRole("hospital");
      setActiveNav("dashboard");
    }, 13200);

    // 6. Reserve bed
    schedule(() => {
      setBeds((b) => Math.max(0, b - 1));
      setStage("reserved");
    }, 15200);

    // 7. Accept ambulance — story complete
    schedule(() => {
      setStage("accepted");
      setDemoRunning(false);
    }, 17200);
  };

  return (
    <>
      {showSplash && (
        <WelcomeSplash onProceed={() => setShowSplash(false)} redirectSeconds={5} />
      )}

      {!showSplash && (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <Ambulance size={25} />
          </div>
          <div>
            <h1>SmartCare</h1>
            <span>Emergency System</span>
          </div>
        </div>
        <h5>
          {role === "user"
            ? "Emergency User Dashboard"
            : role === "driver"
            ? "Ambulance Driver Dashboard"
            : "Hospital Management Dashboard"}
        </h5>
        <div className="role-list">
          <button
            className={role === "user" ? "role-item active" : "role-item"}
            onClick={() => setRole("user")}
          >
            <span className="role-avatar">
              <User size={16} />
            </span>
            <span className="role-text">
              <strong>User</strong>
              <small>Operator</small>
            </span>
          </button>

          <button
            className={role === "driver" ? "role-item active" : "role-item"}
            onClick={() => setRole("driver")}
          >
            <span className="role-avatar">
              <Ambulance size={16} />
            </span>
            <span className="role-text">
              <strong>Driver</strong>
              <small>On Duty</small>
            </span>
          </button>

          <button
            className={role === "hospital" ? "role-item active" : "role-item"}
            onClick={() => setRole("hospital")}
          >
            <span className="role-avatar">
              <Hospital size={16} />
            </span>
            <span className="role-text">
              <strong>Hospital</strong>
              <small>ER Desk</small>
            </span>
          </button>
        </div>

        <nav>
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <div
              key={id}
              className={activeNav === id ? "nav-item active" : "nav-item"}
              onClick={() => setActiveNav(id)}
              style={{ cursor: "pointer" }}
            >
              <Icon size={20} />
              {label}
            </div>
          ))}
        </nav>

        <div className="system-status">
          <div className="status-dot"></div>
          <div>
            <strong>System Online</strong>
            <span>All services operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome">Emergency Management</p>
            <h1>{NAV_ITEMS.find((n) => n.id === activeNav)?.label || "Dashboard"}</h1>
          </div>

          <div className="top-status">
            <div className="live-dot"></div>
            Live Monitoring
          </div>

          <button
            className="view-button demo-button"
            onClick={demoRunning ? stopDemo : runFullDemo}
          >
            {demoRunning ? "⏹ Stop Demo" : "🚀 Run Full Demo"}
          </button>
        </header>

        {/* Statistics — always visible */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon ambulance-icon">
              <Ambulance />
            </div>
            <div>
              <span>Active Ambulances</span>
              <h2>12</h2>
              <small>3 responding now</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon hospital-icon">
              <Hospital />
            </div>
            <div>
              <span>Connected Hospitals</span>
              <h2>08</h2>
              <small>All systems connected</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon emergency-icon">
              <Siren />
            </div>
            <div>
              <span>Active Emergencies</span>
              <h2>{emergencyActive ? "06" : "05"}</h2>
              <small>{emergencyActive ? "3 high priority" : "2 high priority"}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon emergency-icon">
              <Bed />
            </div>
            <div>
              <span>Available Beds</span>
              <h2>{beds}</h2>
              <small>{selectedHospital}</small>
            </div>
          </div>
        </section>

        {/* ============ USER ROLE ============ */}
        {activeNav === "dashboard" && role === "user" && (
          <section className="dashboard-grid">
            <div className="panel emergency-panel">
              <div className="panel-header">
                <div>
                  <h2>Emergency Assistance</h2>
                  <p>Request an ambulance to your location</p>
                </div>
                {emergencyActive && (
                  <span className="priority-badge">{stageLabel}</span>
                )}
              </div>

              <div className="ambulance-info">
                <div className="route">
                  <div className="route-point">
                    <MapPin size={18} />
                    <div>
                      <span>Pickup Location</span>
                      <strong>Current Location</strong>
                    </div>
                  </div>

                  <div className="route-line"></div>

                  <div className="route-point">
                    <Hospital size={18} />
                    <div>
                      <span>Hospital</span>
                      <strong>{selectedHospital}</strong>
                    </div>
                  </div>
                </div>

                {stage === "idle" ? (
                  <button className="view-button" onClick={requestAmbulance}>
                    🚨 Request Ambulance
                  </button>
                ) : (
                  <>
                    <div className="eta-box">
                      <Clock size={20} />
                      <div>
                        <span>Estimated Arrival</span>
                        <strong>
                          {["arrived", "reserved", "accepted"].includes(stage)
                            ? "Arrived"
                            : `${recommendedRoute.eta} minutes`}
                        </strong>
                        <span>Route: {recommendedRoute.name}</span>
                      </div>
                    </div>
                    <button className="view-button" onClick={resetEmergency}>
                      Reset demo
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ============ DRIVER ROLE ============ */}
        {activeNav === "dashboard" && role === "driver" && (
          <>
            <MultiRouteEvaluation
              routes={analyzedRoutes}
              recommendedRoute={recommendedRoute}
              selectedRouteId={selectedRouteId || recommendedRoute.id}
              onSelect={chooseRoute}            />

          <section className="dashboard-grid">
            {/* Active Emergency */}
            <div className="panel emergency-panel">
              <div className="panel-header">
                <div>
                  <h2>Active Emergency</h2>
                  <p>Real-time ambulance monitoring</p>
                </div>

                <span className="priority-badge">HIGH PRIORITY</span>
                <button
                  className="view-button"
                  onClick={() =>
                    stage === "idle" ? requestAmbulance() : resetEmergency()
                  }
                >
                  {emergencyActive ? "End Emergency" : "Simulate Emergency"}
                </button>
                <button
                  className="view-button"
                  onClick={() =>
                    setSelectedHospital(
                      selectedHospital === "City General Hospital"
                        ? "Metro Care Hospital"
                        : "City General Hospital"
                    )
                  }
                >
                  Change Hospital
                </button>
              </div>

              <div className="ambulance-info">
                <div className="ambulance-title">
                  <div className="ambulance-circle">
                    <Ambulance size={26} />
                  </div>
                  <div>
                    <h3>AMB-104</h3>
                    <p>{stageLabel}</p>
                  </div>
                </div>

                <div className="route">
                  <div className="route-point">
                    <MapPin size={18} />
                    <div>
                      <span>Current Location</span>
                      <strong>Park Street</strong>
                    </div>
                  </div>

                  <div className="route-line"></div>

                  <div className="route-point">
                    <Hospital size={18} />
                    <div>
                      <span>Destination</span>
                      <strong>{selectedHospital}</strong>
                    </div>
                  </div>
                  <div className="recommended-route">
                    <span>Recommended Route</span>
                    <strong>{recommendedRoute.name}</strong>
                  </div>
                </div>

                <div className="eta-box">
                  <Clock size={20} />
                  <div>
                    <span>Estimated Arrival</span>
                    <strong>
                      {["arrived", "reserved", "accepted"].includes(stage)
                        ? "Arrived"
                        : `${recommendedRoute.eta} minutes`}
                    </strong>
                    <span>Traffic: {recommendedRoute.traffic}%</span>
                    <span>Signals: {recommendedRoute.signals}</span>
                  </div>
                </div>

                <div className="driver-controls">
                  <button
                    className="view-button"
                    onClick={startNavigation}
                    disabled={stage !== "assigned"}
                  >
                    ▶ Start Navigation
                  </button>
                  <button
                    className="view-button"
                    onClick={markArrived}
                    disabled={stage !== "enroute"}
                  >
                    Mark Arrived
                  </button>
                </div>
              </div>
            </div>

            {/* Traffic */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Traffic Status</h2>
                  <p>Emergency route monitoring</p>
                  <button className="view-button" onClick={simulateTrafficUpdate}>
                    Update Traffic
                  </button>
                </div>
              </div>

              <div className="traffic-list">
                {analyzedRoutes.map((route) => (
                  <div className="traffic-item" key={route.id}>
                    <div>
                      <strong>{route.name}</strong>
                      <span>{route.distance} km → Hospital</span>
                    </div>

                    <span
                      className={
                        route.traffic < 30
                          ? "traffic-clear"
                          : route.traffic < 60
                          ? "traffic-medium"
                          : "traffic-heavy"
                      }
                    >
                      {route.traffic < 30
                        ? "CLEAR"
                        : route.traffic < 60
                        ? "MEDIUM"
                        : "HEAVY"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          </>
        )}
        {activeNav === "dashboard" && role === "hospital" && (
          <section className="dashboard-grid">
            <div className="panel emergency-panel">
              <div className="panel-header">
                <div>
                  <h2>{selectedHospital}</h2>
                  <p>Emergency Status: 🟢 ONLINE</p>
                </div>
              </div>

              <div className="ambulance-info">
                {emergencyActive ? (
                  <>
                    <div className="ambulance-title">
                      <div className="ambulance-circle">
                        <Ambulance size={26} />
                      </div>
                      <div>
                        <h3>AMB-104</h3>
                        <p>Emergency Patient — {stageLabel}</p>
                      </div>
                    </div>

                    <div className="eta-box">
                      <Clock size={20} />
                      <div>
                        <span>Route</span>
                        <strong>{recommendedRoute.name}</strong>
                        <span>
                          {["arrived", "reserved", "accepted"].includes(stage)
                            ? "Arrived"
                            : `ETA: ${recommendedRoute.eta} minutes`}
                        </span>
                      </div>
                    </div>

                    <div className="driver-controls">
                      <button
                        className="view-button"
                        onClick={reserveBed}
                        disabled={stage !== "arrived"}
                      >
                        {["reserved", "accepted"].includes(stage)
                          ? "🟢 Bed Reserved"
                          : "Reserve Bed"}
                      </button>
                      <button
                        className="view-button"
                        onClick={acceptAmbulance}
                        disabled={stage !== "reserved"}
                      >
                        {stage === "accepted" ? "✓ Accepted" : "Accept Ambulance"}
                      </button>
                    </div>
                  </>
                ) : (
                  <p>No incoming ambulances right now.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Hospital Status table — dashboard overview + dedicated Hospitals page */}
        {(activeNav === "dashboard" || activeNav === "hospitals") && (
          <section className="panel hospital-panel">
            <div className="panel-header">
              <div>
                <h2>Hospital Availability</h2>
                <p>Live emergency resource status</p>
              </div>
              <button className="view-button">View All</button>
            </div>

            <div className="hospital-table">
              <div className="table-row table-heading">
                <span>Hospital</span>
                <span>Emergency</span>
                <span>Beds</span>
                <span>Status</span>
              </div>

              <div className="table-row">
                <span>City General Hospital</span>
                <span>Available</span>
                <span>{selectedHospital === "City General Hospital" ? beds : 12}</span>
                <span className="available">ONLINE</span>
              </div>

              <div className="table-row">
                <span>Metro Care Hospital</span>
                <span>Available</span>
                <span>{selectedHospital === "Metro Care Hospital" ? beds : 8}</span>
                <span className="available">ONLINE</span>
              </div>

              <div className="table-row">
                <span>Central Medical Center</span>
                <span>Busy</span>
                <span>04</span>
                <span className="busy">BUSY</span>
              </div>
            </div>
          </section>
        )}

        {/* Alert — dashboard overview, once emergency is live */}
        {activeNav === "dashboard" && emergencyActive && (
          <div className="alert">
            <AlertTriangle size={22} />
            <div>
              <strong>Emergency Alert</strong>
              <p>
                AMB-104 has requested traffic priority on {recommendedRoute.name}.
                {signalPriority
                  ? " Traffic signals are being prioritized."
                  : " Traffic signal coordination required."}
              </p>
              <button
                className="view-button"
                onClick={() => setSignalPriority(!signalPriority)}
              >
                {signalPriority ? "Signal Priority Active" : "Request Signal Priority"}
              </button>
            </div>
          </div>
        )}

        {/* ============ LIVE TRACKING PAGE ============ */}
        {activeNav === "liveTracking" && (
          <section className="dashboard-grid">
            <div className="panel" style={{ gridColumn: "1 / -1" }}>
              <div className="panel-header">
                <div>
                  <h2>Live Corridor Simulation</h2>
                  <p>Ambulance movement with automated signal priority</p>
                </div>
              </div>
              {emergencyActive ? (
                <LiveCorridorMap
                  distanceKm={recommendedRoute.distance}
                  etaMin={recommendedRoute.eta}
                  to={selectedHospital}
                  autoPlay={demoRunning}
                />
              ) : (
                <div className="empty-state">
                  <p>No ambulance is currently en route.</p>
                  <button className="view-button" onClick={requestAmbulance}>
                    Simulate Emergency
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============ ROUTE ANALYSIS PAGE ============ */}
        {activeNav === "routeAnalysis" && (
          <section className="dashboard-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              <MultiRouteEvaluation
                routes={analyzedRoutes}
                recommendedRoute={recommendedRoute}
                selectedRouteId={selectedRouteId || recommendedRoute.id}
                onSelect={chooseRoute}
              />
            </div>
          </section>
        )}

        {/* ============ SIGNALS PAGE ============ */}
        {activeNav === "signals" && (
          <section className="dashboard-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              <TrafficSignals
                signalPriority={signalPriority}
                onToggleAutoPriority={setSignalPriority}
                nextSignalLabel="Junction 2 (0.4 km)"
                onExtendGreen={() => setSignalPriority(true)}
              />
            </div>
          </section>
        )}

        {/* ============ AMBULANCES PAGE ============ */}
        {activeNav === "ambulances" && (
          <section className="dashboard-grid">
            <div className="panel emergency-panel" style={{ gridColumn: "1 / -1" }}>
              <div className="panel-header">
                <div>
                  <h2>Fleet Status</h2>
                  <p>Ambulances currently connected to SmartCare</p>
                </div>
              </div>
              <div className="ambulance-info">
                <div className="ambulance-title">
                  <div className="ambulance-circle">
                    <Ambulance size={26} />
                  </div>
                  <div>
                    <h3>AMB-104</h3>
                    <p>{stageLabel}</p>
                  </div>
                </div>
                <p style={{ color: "#64748b", fontSize: 13 }}>
                  11 other ambulances are on standby across the network.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ============ ALERTS PAGE ============ */}
        {activeNav === "alerts" && (
          <section className="dashboard-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              {emergencyActive ? (
                <div className="alert">
                  <AlertTriangle size={22} />
                  <div>
                    <strong>Emergency Alert</strong>
                    <p>
                      AMB-104 has requested traffic priority on {recommendedRoute.name}.
                      {signalPriority
                        ? " Traffic signals are being prioritized."
                        : " Traffic signal coordination required."}
                    </p>
                    <button
                      className="view-button"
                      onClick={() => setSignalPriority(!signalPriority)}
                    >
                      {signalPriority ? "Signal Priority Active" : "Request Signal Priority"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="panel">
                  <p style={{ color: "#64748b" }}>No active alerts right now.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============ REPORTS / SETTINGS PLACEHOLDERS ============ */}
        {(activeNav === "reports" || activeNav === "settings") && (
          <section className="dashboard-grid">
            <div className="panel" style={{ gridColumn: "1 / -1" }}>
              <div className="panel-header">
                <div>
                  <h2>{activeNav === "reports" ? "Reports" : "Settings"}</h2>
                  <p>Coming soon</p>
                </div>
              </div>
              <p style={{ color: "#64748b" }}>
                This section isn't built yet — happy to help you design it whenever you're ready.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
      )}
    </>
  );
}

export default App;
