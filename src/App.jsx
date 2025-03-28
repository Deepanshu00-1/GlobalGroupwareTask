import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import UsersList from './components/UsersList';
import EditUserPage from './components/EditUserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id/edit" element={<EditUserPage />} />
      </Routes>
    </Router>
  );
}

export default App;