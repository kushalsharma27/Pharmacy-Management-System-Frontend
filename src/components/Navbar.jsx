import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-4 shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center">

        {/* Pharmacy Name */}
        <Link to="/dashboard" className="flex flex-col group">
          <span className="text-xl font-bold leading-tight group-hover:text-amber-200 transition-colors duration-300">Pharmacy Management</span>
          <span className="text-xs text-teal-200 leading-tight group-hover:text-amber-200 transition-colors duration-300">System</span>
        </Link>

        {/* Right side - Hamburger and Profile */}
        <div className="flex items-center space-x-3">
          {/* Profile 'A' Button */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center hover:bg-amber-300 transition-all duration-300 transform hover:scale-110 focus:outline-none shadow-md hover:shadow-xl"
              aria-label="Profile menu"
            >
              <span className="text-teal-800 font-bold text-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </button>

            {/* Profile Dropdown - Now with gradient background */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-teal-600 to-teal-700 rounded-xl shadow-2xl z-50 py-2 border border-teal-500 animate-fadeIn">
                {/* Profile Link */}
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-teal-500 transition-all duration-200 flex items-center space-x-2 group"
                >
                  <svg className="w-4 h-4 text-amber-300 group-hover:text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Profile</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-amber-200 hover:bg-teal-500 transition-all duration-200 flex items-center space-x-2 group"
                >
                  <svg className="w-4 h-4 text-amber-300 group-hover:text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-teal-500 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2 bg-amber-300' : ''}`}></span>
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2 bg-amber-300' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Menu Dropdown - Now with gradient background */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gradient-to-b from-teal-600 to-teal-700 shadow-2xl z-50 animate-slideDown rounded-b-2xl border-t-2 border-amber-400">
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)} icon="📊">
                Dashboard
              </NavLink>
              <NavLink to="/medicines" onClick={() => setIsMenuOpen(false)} icon="💊">
                Medicines
              </NavLink>
              <NavLink to="/suppliers" onClick={() => setIsMenuOpen(false)} icon="🚚">
                Suppliers
              </NavLink>
              <NavLink to="/customers" onClick={() => setIsMenuOpen(false)} icon="👥">
                Customers
              </NavLink>
              <NavLink to="/sales" onClick={() => setIsMenuOpen(false)} icon="💰">
                Sales
              </NavLink>
              <NavLink to="/pos" onClick={() => setIsMenuOpen(false)} icon="🛒">
                POS
              </NavLink>
              <NavLink to="/purchases" onClick={() => setIsMenuOpen(false)} icon="📦">
                Purchases
              </NavLink>
              <NavLink to="/reports" onClick={() => setIsMenuOpen(false)} icon="📊">
                Reports
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper component for nav links with icons - Updated for gradient background
const NavLink = ({ to, onClick, icon, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-2 p-3 text-white hover:bg-teal-500 rounded-lg transition-all duration-200 hover:scale-105 group"
  >
    <span className="text-xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <span className="text-sm font-medium group-hover:text-amber-200">{children}</span>
  </Link>
);

export default Navbar;