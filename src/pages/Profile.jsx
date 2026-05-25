import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Add this import
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  History,
  Shield,
  Camera,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Globe
} from 'lucide-react';

function Profile() {
  const [user, setUser] = useState(getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { isDarkMode, setDarkMode } = useTheme(); // Get theme context

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    phone: '',
    fullName: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    lowStockAlerts: true,
    expiryAlerts: true,
    salesReports: false,
    marketingEmails: false
  });

  const [loginHistory, setLoginHistory] = useState([]);
  const [preferences, setPreferences] = useState({
    theme: isDarkMode ? 'dark' : 'light', // Sync with actual theme
    language: 'en',
    timezone: 'Asia/Kolkata'
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || 'admin@pharmacy.com',
        phone: user.phone || '+91 98765 43210',
        fullName: user.fullName || 'Admin User'
      });
    }
    fetchLoginHistory();
  }, [user]);

  // Update preferences when theme changes
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      theme: isDarkMode ? 'dark' : 'light'
    }));
  }, [isDarkMode]);

  const fetchLoginHistory = async () => {
    // Mock data - replace with actual API
    setLoginHistory([
      {
        id: 1,
        date: '2026-02-17 10:30 AM',
        ip: '192.168.1.105',
        device: 'Chrome on Windows',
        location: 'Mumbai, India',
        status: 'success'
      },
      {
        id: 2,
        date: '2026-02-16 04:45 PM',
        ip: '192.168.1.105',
        device: 'Chrome on Windows',
        location: 'Mumbai, India',
        status: 'success'
      },
      {
        id: 3,
        date: '2026-02-15 09:15 AM',
        ip: '192.168.1.120',
        device: 'Mobile - Android',
        location: 'Mumbai, India',
        status: 'success'
      },
      {
        id: 4,
        date: '2026-02-14 11:20 PM',
        ip: '45.123.45.67',
        device: 'Unknown Device',
        location: 'Delhi, India',
        status: 'failed'
      },
    ]);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match!');
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long!');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);

      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
    setSuccessMessage('Notification preferences updated!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences({
      ...preferences,
      [key]: value
    });

    // If theme changes, update the actual theme
    if (key === 'theme') {
      setDarkMode(value === 'dark');
    }

    setSuccessMessage('Preferences updated!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: User, description: 'Manage your personal details' },
    { id: 'security', name: 'Security', icon: Shield, description: 'Password and 2FA settings' },
    { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Configure your alerts' },
    { id: 'history', name: 'Login History', icon: History, description: 'Recent account activity' },
    { id: 'preferences', name: 'Preferences', icon: Globe, description: 'App settings and preferences' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account preferences and security</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-700 dark:text-green-300 text-sm">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
            {/* Profile Summary */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-3xl font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{profileForm.fullName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profileForm.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                {user?.role}
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border-l-4 border-teal-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${
                    activeTab === tab.id ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className="text-sm font-medium flex-1 text-left">{tab.name}</span>
                  <ChevronRight className={`w-4 h-4 ${
                    activeTab === tab.id ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Profile Information</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          !isEditing
                            ? 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          !isEditing
                            ? 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          !isEditing
                            ? 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          !isEditing
                            ? 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    {isEditing ? (
                      <>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Security Settings</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password and security preferences</p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                {/* Two Factor Authentication */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-4">Two-Factor Authentication</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">Enable 2FA</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Notification Preferences</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choose what updates you want to receive</p>
                </div>

                <div className="space-y-4">
                  <NotificationToggle
                    label="Email Alerts"
                    description="Receive email notifications for important updates"
                    checked={notificationSettings.emailAlerts}
                    onChange={() => handleNotificationChange('emailAlerts')}
                  />

                  <NotificationToggle
                    label="Low Stock Alerts"
                    description="Get notified when medicines are running low"
                    checked={notificationSettings.lowStockAlerts}
                    onChange={() => handleNotificationChange('lowStockAlerts')}
                  />

                  <NotificationToggle
                    label="Expiry Alerts"
                    description="Get notified about medicines expiring soon"
                    checked={notificationSettings.expiryAlerts}
                    onChange={() => handleNotificationChange('expiryAlerts')}
                  />

                  <NotificationToggle
                    label="Sales Reports"
                    description="Receive daily/weekly sales summaries"
                    checked={notificationSettings.salesReports}
                    onChange={() => handleNotificationChange('salesReports')}
                  />

                  <NotificationToggle
                    label="Marketing Emails"
                    description="Receive promotional offers and updates"
                    checked={notificationSettings.marketingEmails}
                    onChange={() => handleNotificationChange('marketingEmails')}
                  />
                </div>
              </div>
            )}

            {/* Login History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Login History</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recent activity on your account</p>
                </div>

                <div className="space-y-3">
                  {loginHistory.map((login) => (
                    <div
                      key={login.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          login.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{login.device}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {login.date} • {login.ip} • {login.location}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        login.status === 'success'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      }`}>
                        {login.status === 'success' ? 'Successful' : 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">App Preferences</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customize your experience</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handlePreferenceChange('theme', 'light')}
                        className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                          preferences.theme === 'light'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        <span className="text-sm">Light</span>
                      </button>
                      <button
                        onClick={() => handlePreferenceChange('theme', 'dark')}
                        className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                          preferences.theme === 'dark'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <span className="text-sm">Dark</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                      <option value="gu">Gujarati</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="Asia/Dubai">UAE (GST)</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="Europe/London">London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for notification toggles
const NotificationToggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div>
      <p className="text-sm font-medium text-gray-800 dark:text-white">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default Profile;