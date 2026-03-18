import {NavLink, Outlet} from 'react-router-dom';
import {SocketStatusCard} from './SocketStatusCard';

const navItems = [
  {to: '/', label: 'Home'},
  {to: '/lobby', label: 'Lobby'},
  {to: '/profile', label: 'Profile'},
  {to: '/room/DEMO42', label: 'Sample Room'},
];

export const Layout = () => {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Poker Pocket</p>
          <h1>Web Client</h1>
          <p className="muted">
            Same-origin browser client for local development, Codespaces previews, and packaged deployments.
          </p>
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({isActive}) => isActive ? 'nav-link nav-link-active' : 'nav-link'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <SocketStatusCard />
      </aside>
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};
