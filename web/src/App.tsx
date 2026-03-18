import {Navigate, Route, Routes} from 'react-router-dom';
import {Layout} from './components/Layout';
import {HomePage} from './routes/HomePage';
import {LobbyPage} from './routes/LobbyPage';
import {ProfilePage} from './routes/ProfilePage';
import {RoomPage} from './routes/RoomPage';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/room/:roomCode" element={<RoomPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
