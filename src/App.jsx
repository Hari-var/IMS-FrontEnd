import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5294';

export default function App() {
  const [name, setName] = useState('IMS User');
  const [health, setHealth] = useState('Checking backend connection...');
  const [message, setMessage] = useState('Waiting for backend response...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        setHealth(`${data.status} - ${data.message}`);
      } catch (error) {
        setHealth('Backend is not running yet. Start the .NET app on port 5294.');
      }
    };

    loadHealth();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/hello?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('The frontend could not reach the .NET API. Please run the backend first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <aside>
        <div className="brand"><b>R</b> React + .NET</div>
        <small className="muted side-label">FULLSTACK APP</small>
        <div className="nav active">Overview</div>
        <div className="nav">API status</div>
        <div className="nav">Dashboard</div>
        <div className="user">
          <span>IM</span>
          <div>
            <strong>IMS Portal</strong>
            <small>Frontend connected</small>
          </div>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <small className="muted">APP / OVERVIEW</small>
            <h1>Insurance system demo</h1>
          </div>
          <button type="button">Connected app</button>
        </header>

        <section className="hero">
          <small>BACKEND STATUS</small>
          <h2>{health}</h2>
          <p>
            This React app is calling the .NET API running on port 5294. If both services are active,
            the response below will come directly from the backend.
          </p>
          <div className="watermark">API</div>
        </section>

        <section className="card-panel">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Enter your name</label>
            <div className="form-row">
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter a name"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send to backend'}
              </button>
            </div>
          </form>

          <div className="response-box">
            <small className="muted">RESPONSE FROM .NET</small>
            <p>{message}</p>
          </div>
        </section>
      </main>
    </div>
  );
}