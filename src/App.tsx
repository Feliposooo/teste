import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './components/AdminDashboard';
import ResidentDashboard from './components/ResidentDashboard';
import { initializeDefaultUsers } from './utils/storage';

initializeDefaultUsers(); // Garante que o usuário admin seja criado se não existir

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/resident" element={<ResidentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
