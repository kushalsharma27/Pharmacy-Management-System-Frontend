import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;