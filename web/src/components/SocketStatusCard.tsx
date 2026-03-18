import {useEffect, useMemo, useState} from 'react';
import {getBrowserWebSocketUrl} from '../lib/ws';

type ConnectionState = 'connecting' | 'open' | 'closed' | 'error';

export const SocketStatusCard = () => {
  const endpoint = useMemo(() => getBrowserWebSocketUrl(), []);
  const [state, setState] = useState<ConnectionState>('connecting');
  const [lastMessage, setLastMessage] = useState('Waiting for the backend to accept the socket connection.');

  useEffect(() => {
    const socket = new WebSocket(endpoint);

    socket.addEventListener('open', () => {
      setState('open');
      setLastMessage('Connected. The backend can now push room, lobby, and player updates.');
    });

    socket.addEventListener('message', (event) => {
      const text = typeof event.data === 'string' ? event.data : 'Received a non-text payload from the server.';
      setLastMessage(text.slice(0, 160));
    });

    socket.addEventListener('close', () => {
      setState('closed');
      setLastMessage('Socket closed. If the backend is offline, start it with npm run dev or npm run start.');
    });

    socket.addEventListener('error', () => {
      setState('error');
      setLastMessage('Unable to reach the websocket backend through /ws.');
    });

    return () => {
      socket.close();
    };
  }, [endpoint]);

  return (
    <section className="card status-card">
      <div className="status-heading">
        <h2>Realtime connection</h2>
        <span className={`badge badge-${state}`}>{state}</span>
      </div>
      <p className="code-line">{endpoint}</p>
      <p className="muted">{lastMessage}</p>
    </section>
  );
};
