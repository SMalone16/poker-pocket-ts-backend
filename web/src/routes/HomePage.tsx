import {Link} from 'react-router-dom';

export const HomePage = () => {
  return (
    <>
      <section className="hero card">
        <p className="eyebrow">Route: /</p>
        <h2>Bring Poker Pocket to the browser.</h2>
        <p>
          This starter client keeps the websocket backend on port 8000, proxies <code>/ws</code> through Vite in
          development, and gives Codespaces a single shareable browser URL.
        </p>
        <div className="button-row">
          <Link className="button button-primary" to="/lobby">Open lobby</Link>
          <Link className="button" to="/room/DEMO42">Jump into a room</Link>
        </div>
      </section>

      <section className="grid two-column-grid">
        <article className="card">
          <p className="eyebrow">Discover</p>
          <h3>Lobby overview</h3>
          <p>Browse active tables, find open seats, and keep your navigation inside the same public origin.</p>
        </article>
        <article className="card">
          <p className="eyebrow">Resume</p>
          <h3>Player profile</h3>
          <p>Show achievements, chips, and recent sessions on a dedicated profile route.</p>
        </article>
      </section>
    </>
  );
};
