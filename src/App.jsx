import {
  Ambulance,
  Hospital,
  Siren,
  Bed,
  Activity,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <Ambulance size={25} />
          </div>
          <div>
            <h2>SmartCare</h2>
            <span>Emergency System</span>
          </div>
        </div>

        <nav>
          <div className="nav-item active">
            <Activity size={20} />
            Dashboard
          </div>

          <div className="nav-item">
            <Ambulance size={20} />
            Ambulances
          </div>

          <div className="nav-item">
            <Hospital size={20} />
            Hospitals
          </div>

          <div className="nav-item">
            <MapPin size={20} />
            Traffic
          </div>

          <div className="nav-item">
            <Siren size={20} />
            Emergency
          </div>
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
            <h1>Smart Hospital Dashboard</h1>
          </div>

          <div className="top-status">
            <div className="live-dot"></div>
            Live Monitoring
          </div>
        </header>

        {/* Statistics */}
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
              <h2>05</h2>
              <small>2 high priority</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bed-icon">
              <Bed />
            </div>
            <div>
              <span>Available Beds</span>
              <h2>34</h2>
              <small>Across all hospitals</small>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="dashboard-grid">

          {/* Active Emergency */}
          <div className="panel emergency-panel">
            <div className="panel-header">
              <div>
                <h2>Active Emergency</h2>
                <p>Real-time ambulance monitoring</p>
              </div>

              <span className="priority-badge">
                HIGH PRIORITY
              </span>
            </div>

            <div className="ambulance-info">
              <div className="ambulance-title">
                <div className="ambulance-circle">
                  <Ambulance size={26} />
                </div>

                <div>
                  <h3>AMB-104</h3>
                  <p>Emergency Ambulance</p>
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
                    <strong>City General Hospital</strong>
                  </div>
                </div>
              </div>

              <div className="eta-box">
                <Clock size={20} />
                <div>
                  <span>Estimated Arrival</span>
                  <strong>08 minutes</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Traffic Status</h2>
                <p>Emergency route monitoring</p>
              </div>
            </div>

            <div className="traffic-list">
              <div className="traffic-item">
                <div>
                  <strong>Route A</strong>
                  <span>Park Street → Hospital</span>
                </div>
                <span className="traffic-clear">CLEAR</span>
              </div>

              <div className="traffic-item">
                <div>
                  <strong>Route B</strong>
                  <span>Esplanade → Hospital</span>
                </div>
                <span className="traffic-medium">MEDIUM</span>
              </div>

              <div className="traffic-item">
                <div>
                  <strong>Route C</strong>
                  <span>Sealdah → Hospital</span>
                </div>
                <span className="traffic-heavy">HEAVY</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hospital Status */}
        <section className="panel hospital-panel">
          <div className="panel-header">
            <div>
              <h2>Hospital Availability</h2>
              <p>Live emergency resource status</p>
            </div>

            <button className="view-button">
              View All
            </button>
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
              <span>12</span>
              <span className="available">ONLINE</span>
            </div>

            <div className="table-row">
              <span>Metro Care Hospital</span>
              <span>Available</span>
              <span>08</span>
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

        {/* Alert */}
        <div className="alert">
          <AlertTriangle size={22} />
          <div>
            <strong>Emergency Alert</strong>
            <p>
              AMB-104 has requested traffic priority on Route A.
              Traffic signal coordination required.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;