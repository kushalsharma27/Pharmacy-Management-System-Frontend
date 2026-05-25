import { useEffect, useState } from 'react';
import { medicineAPI, supplierAPI, customerAPI, saleAPI } from '../services/api';
import { getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { usePermission, HasPermission, ROLES } from '../components/RoleBasedAccess';

// StatCard Component
const StatCard = ({ title, value, icon, bgColor, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
        <span className="text-2xl">{icon}</span>
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          trend > 0 ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
  </div>
);

// Recent Activity Item
const ActivityItem = ({ icon, title, time, status, color }) => (
  <div className="flex items-start space-x-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
      <span className="text-sm">{icon}</span>
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-800 dark:text-white">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{time}</p>
    </div>
    {status && (
      <span className={`text-xs px-2 py-1 rounded-full ${
        status === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
        status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
        'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
      }`}>
        {status}
      </span>
    )}
  </div>
);

// Top Medicine Item
const TopMedicineItem = ({ rank, name, sales, growth }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-400 dark:text-gray-500 w-6">{rank}</span>
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{sales} units sold</p>
      </div>
    </div>
    <span className={`text-xs font-medium ${growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
      {growth > 0 ? '+' : ''}{growth}%
    </span>
  </div>
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalSuppliers: 0,
    totalCustomers: 0,
    todaySales: 0,
    totalSalesCount: 0,
    pendingOrders: 0,
    lowStock: [],
    expiringSoon: [],
    recentActivities: [],
    topMedicines: []
  });
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  const navigate = useNavigate();

  const canManageMedicines = usePermission('canManageMedicines');
  const canManageSuppliers = usePermission('canManageSuppliers');
  const canViewReports = usePermission('canViewReports');
  const canManagePurchases = usePermission('canManagePurchases');
  const canManageInventory = usePermission('canManageInventory');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const promises = [];

      promises.push(medicineAPI.getAll());

      if (canManageSuppliers) {
        promises.push(supplierAPI.getAll());
      } else {
        promises.push(Promise.resolve({ data: [] }));
      }

      promises.push(customerAPI.getAll());

      if (canViewReports) {
        promises.push(saleAPI.getAll().catch(() => ({ data: [] })));
      } else {
        promises.push(Promise.resolve({ data: [] }));
      }

      const [medicinesRes, suppliersRes, customersRes, salesRes] = await Promise.all(promises);

      const today = new Date().toDateString();
      const todaySales = salesRes.data.filter(sale =>
        new Date(sale.createdAt).toDateString() === today
      ).reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);

      // Total sales count — all sales transactions
      const totalSalesCount = salesRes.data.length;

      const lowStock = medicinesRes.data.filter(m => m.quantity < 50);

      const expiringSoon = medicinesRes.data.filter(m => {
        if (!m.expiryDate) return false;
        const daysLeft = Math.ceil((new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft < 30 && daysLeft > 0;
      });

      const recentActivities = [
        {
          icon: '💊',
          title: `${medicinesRes.data.length} medicines in stock`,
          time: 'Updated now',
          status: 'Info',
          color: 'bg-blue-100 dark:bg-blue-900'
        },
        {
          icon: '👥',
          title: `${customersRes.data.length} registered customers`,
          time: 'Updated now',
          status: 'Info',
          color: 'bg-green-100 dark:bg-green-900'
        },
        {
          icon: '🚚',
          title: `${suppliersRes.data.length} active suppliers`,
          time: 'Updated now',
          status: 'Info',
          color: 'bg-purple-100 dark:bg-purple-900'
        },
        ...(lowStock.length > 0 ? [{
          icon: '⚠️',
          title: `${lowStock.length} medicines below reorder level`,
          time: 'Action needed',
          status: 'Alert',
          color: 'bg-red-100 dark:bg-red-900'
        }] : []),
        ...(expiringSoon.length > 0 ? [{
          icon: '📅',
          title: `${expiringSoon.length} medicines expiring soon`,
          time: 'Check expiry dates',
          status: 'Warning',
          color: 'bg-yellow-100 dark:bg-yellow-900'
        }] : [])
      ];

      const topMedicines = medicinesRes.data
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map((m, index) => ({
          rank: index + 1,
          name: m.name,
          sales: Math.floor(Math.random() * 500) + 100,
          growth: Math.floor(Math.random() * 20) - 5
        }));

      setStats({
        totalMedicines: medicinesRes.data.length,
        totalSuppliers: suppliersRes.data.length,
        totalCustomers: customersRes.data.length,
        todaySales,
        totalSalesCount,
        pendingOrders: 0,
        lowStock,
        expiringSoon,
        recentActivities,
        topMedicines
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleGreeting = () => {
    switch(user?.role) {
      case ROLES.ADMIN:
        return 'Administrator';
      case ROLES.PHARMACIST:
        return 'Pharmacist';
      case ROLES.CASHIER:
        return 'Cashier';
      default:
        return 'User';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Role Badge */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user?.username}!
            </h1>
            <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
              {getRoleGreeting()}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <HasPermission permission="canViewReports">
          <button
            onClick={() => navigate('/reports')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
          >
            📊 Generate Report
          </button>
        </HasPermission>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Today's Revenue */}
        <div onClick={() => navigate('/sales')} className="cursor-pointer">
          <StatCard
            title="Today's Revenue"
            value={`₹${stats.todaySales.toLocaleString()}`}
            icon="💰"
            bgColor="bg-green-100"
            trend={8}
          />
        </div>

        {/* Total Sales Count — replaced Monthly Revenue */}
        <HasPermission permission="canViewReports">
          <div onClick={() => navigate('/sales')} className="cursor-pointer">
            <StatCard
              title="Total Sales"
              value={stats.totalSalesCount}
              icon="🧾"
              bgColor="bg-blue-100"
              trend={12}
            />
          </div>
        </HasPermission>

        {/* Total Medicines */}
        <div onClick={() => navigate('/medicines')} className="cursor-pointer">
          <StatCard
            title="Total Medicines"
            value={stats.totalMedicines}
            icon="💊"
            bgColor="bg-purple-100"
            trend={5}
          />
        </div>

        {/* Total Customers */}
        <div onClick={() => navigate('/customers')} className="cursor-pointer">
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon="👥"
            bgColor="bg-amber-100"
            trend={15}
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <HasPermission permission="canManageSuppliers">
          <div
            onClick={() => navigate('/suppliers')}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all cursor-pointer hover:border-blue-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-600">Total Suppliers</h3>
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                {stats.totalSuppliers} suppliers
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600">{stats.totalSuppliers}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Active partnerships</p>
          </div>
        </HasPermission>

        <HasPermission permission="canManageInventory">
          <div
            onClick={() => navigate('/medicines?filter=lowstock')}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all cursor-pointer hover:border-red-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-red-600">Low Stock Alert</h3>
              <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">
                {stats.lowStock.length} items
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-red-600">{stats.lowStock.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Medicines below reorder level</p>
          </div>
        </HasPermission>

        <HasPermission permission="canManageInventory">
          <div
            onClick={() => navigate('/medicines?filter=expiring')}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all cursor-pointer hover:border-yellow-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-yellow-600">Expiring Soon</h3>
              <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full">
                {stats.expiringSoon.length} batches
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-yellow-600">{stats.expiringSoon.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Within next 30 days</p>
          </div>
        </HasPermission>

        {!canManageSuppliers && !canManageInventory && (
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Welcome to your dashboard. Use the navigation menu to access your features.
            </p>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-1">
            {stats.recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Medicines by Stock</h3>
          <div className="space-y-3">
            {stats.topMedicines.map((medicine) => (
              <div
                key={medicine.rank}
                onClick={() => navigate('/medicines')}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <TopMedicineItem {...medicine} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/pos')}
          className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-4 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-sm hover:shadow-md"
        >
          <span className="text-2xl block mb-2">🛒</span>
          <span className="font-medium">New Sale</span>
          <span className="text-xs block opacity-90 mt-1">Process customer order</span>
        </button>

        <HasPermission permission="canManageMedicines">
          <button
            onClick={() => navigate('/medicines')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            <span className="text-2xl block mb-2">💊</span>
            <span className="font-medium">Add Medicine</span>
            <span className="text-xs block opacity-90 mt-1">Update inventory</span>
          </button>
        </HasPermission>

        <HasPermission permission="canManagePurchases">
          <button
            onClick={() => navigate('/purchases')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
          >
            <span className="text-2xl block mb-2">📦</span>
            <span className="font-medium">New Order</span>
            <span className="text-xs block opacity-90 mt-1">Create purchase order</span>
          </button>
        </HasPermission>

        <button
          onClick={() => navigate('/customers')}
          className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-4 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm hover:shadow-md"
        >
          <span className="text-2xl block mb-2">👤</span>
          <span className="font-medium">Add Customer</span>
          <span className="text-xs block opacity-90 mt-1">Register new customer</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={fetchDashboardData}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          🔄 Last updated: {new Date().toLocaleTimeString()}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
