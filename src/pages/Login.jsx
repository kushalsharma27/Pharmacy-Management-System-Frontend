import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);

    if (result.success) {
      switch (result.role) {
        case 'ADMIN':
          navigate('/dashboard');
          break;
        case 'PHARMACIST':
          navigate('/dashboard');
          break;
        case 'CASHIER':
          navigate('/pos');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-600 flex-col justify-between p-12">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-teal-600 text-xl">💊</span>
            </div>
            <span className="text-white font-bold text-lg">Pharmacy Management System</span>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your pharmacy smarter.
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed">
            Medicines, sales, customers, and suppliers — all in one place.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: '📦', text: 'Inventory & Stock Management' },
              { icon: '🧾', text: 'Point of Sale & Billing' },
              { icon: '👥', text: 'Customer & Supplier Tracking' },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-sm">
                  {item.icon}
                </div>
                <span className="text-teal-100 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-teal-200 text-xs">© 2026 Pharmacy Management System. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center space-x-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💊</span>
            </div>
            <span className="text-teal-600 font-bold text-lg">Pharmacy Management System</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center space-x-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors font-medium text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">Demo credentials</p>
              <div className="space-y-1">
                {[
                  { role: 'Admin', user: 'admin', pass: 'admin123' },
                  { role: 'Pharmacist', user: 'pharmacist', pass: 'pharm123' },
                  { role: 'Cashier', user: 'cashier', pass: 'cash123' },
                ].map((cred, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setUsername(cred.user); setPassword(cred.pass); }}
                    className="w-full text-left px-3 py-1.5 rounded-md hover:bg-teal-50 hover:text-teal-700 transition-colors text-xs text-gray-600 flex justify-between"
                  >
                    <span className="font-medium">{cred.role}</span>
                    <span className="text-gray-400">{cred.user} / {cred.pass}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
