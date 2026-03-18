const profileStats = [
  {label: 'Display name', value: 'Pocket Shark'},
  {label: 'Favorite mode', value: 'Hold’em'},
  {label: 'Achievement progress', value: '12 unlocked'},
  {label: 'Reconnect policy', value: 'Same-origin websocket via /ws'},
];

export const ProfilePage = () => {
  return (
    <>
      <section className="card">
        <p className="eyebrow">Route: /profile</p>
        <h2>Profile</h2>
        <p>Reserve this route for account info, achievements, and player settings that should be browser-accessible.</p>
      </section>

      <section className="grid two-column-grid">
        {profileStats.map((stat) => (
          <article key={stat.label} className="card stat-card">
            <p className="muted">{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>
    </>
  );
};
