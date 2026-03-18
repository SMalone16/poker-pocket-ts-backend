import {Link, useParams} from 'react-router-dom';

export const RoomPage = () => {
  const {roomCode = 'UNKNOWN'} = useParams();

  return (
    <>
      <section className="card">
        <p className="eyebrow">Route: /room/:roomCode</p>
        <h2>Room {roomCode}</h2>
        <p>
          Use this route to hydrate a specific table from route params, subscribe to room updates, and render seated
          players.
        </p>
      </section>

      <section className="grid two-column-grid">
        <article className="card">
          <h3>Suggested next steps</h3>
          <ul className="feature-list">
            <li>Load room metadata after the websocket opens.</li>
            <li>Render player seats, community cards, and betting actions.</li>
            <li>Handle reconnects by preserving the route-local room code.</li>
          </ul>
        </article>
        <article className="card">
          <h3>Quick navigation</h3>
          <p>Want to inspect the overall list of games instead?</p>
          <Link className="button" to="/lobby">Back to lobby</Link>
        </article>
      </section>
    </>
  );
};
