const lobbyCards = [
  {title: 'Hold’em Cash', detail: 'Quick seat suggestions and table filters.'},
  {title: 'Five Card Draw', detail: 'Preset route scaffold for alternate game modes.'},
  {title: 'Bottle Spin', detail: 'Callouts for custom games and feature experiments.'},
];

export const LobbyPage = () => {
  return (
    <>
      <section className="card">
        <p className="eyebrow">Route: /lobby</p>
        <h2>Lobby</h2>
        <p>Select a room, inspect table state, or wire in live data from the existing websocket messages.</p>
      </section>

      <section className="grid three-column-grid">
        {lobbyCards.map((card) => (
          <article key={card.title} className="card">
            <h3>{card.title}</h3>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>
    </>
  );
};
