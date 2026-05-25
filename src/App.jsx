import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/authService';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
import POS from './pages/POS';
import Purchases from './pages/Purchases';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="medicines" element={<Medicines />} />
            <Route path="customers" element={<Customers />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="sales" element={<Sales />} />
            <Route path="pos" element={<POS />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="profile" element={<Profile />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;