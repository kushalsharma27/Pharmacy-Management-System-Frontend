import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Install recharts first:
// npm install recharts

function Reports() {
  const [activeTab, setActiveTab] = useState('daily');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Mock data - Replace with API calls
  const dailySalesData = [
    { date: '2026-02-17', sales: 12500, transactions: 45 },
    { date: '2026-02-16', sales: 15200, transactions: 52 },
    { date: '2026-02-15', sales: 9800, transactions: 38 },
    { date: '2026-02-14', sales: 18700, transactions: 63 },
    { date: '2026-02-13', sales: 14300, transactions: 48 },
    { date: '2026-02-12', sales: 16900, transactions: 55 },
    { date: '2026-02-11', sales: 13400, transactions: 44 },
  ];

  const topMedicines = [
    { name: 'Amoxicillin 500mg', sales: 456, revenue: 6840 },
    { name: 'Paracetamol 500mg', sales: 389, revenue: 2334 },
    { name: 'Vitamin C', sales: 278, revenue: 33360 },
    { name: 'Cough Syrup', sales: 198, revenue: 18810 },
    { name: 'Cetirizine', sales: 167, revenue: 918.50 },
  ];

  const expiryData = [
    { medicine: 'Amoxicillin 250mg', batch: 'BATCH-001', expiry: '2026-08-15', stock: 500 },
    { medicine: 'Paracetamol', batch: 'BATCH-002', expiry: '2026-09-20', stock: 1000 },
    { medicine: 'Vitamin C', batch: 'BATCH-003', expiry: '2026-07-10', stock: 300 },
    { medicine: 'Aspirin', batch: 'BATCH-004', expiry: '2026-06-05', stock: 200 },
    { medicine: 'Ibuprofen', batch: 'BATCH-005', expiry: '2026-05-30', stock: 150 },
  ];

  const supplierPerformance = [
    { supplier: 'Cipla', orders: 12, amount: 45600, onTime: 92 },
    { supplier: 'Sun Pharma', orders: 8, amount: 32400, onTime: 88 },
    { supplier: 'Abbott', orders: 5, amount: 18900, onTime: 95 },
    { supplier: 'Dr. Reddy\'s', orders: 6, amount: 22300, onTime: 83 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const tabs = [
    { id: 'daily', name: 'Daily Sales', icon: '📊' },
    { id: 'monthly', name: 'Monthly P&L', icon: '📈' },
    { id: 'top', name: 'Top Medicines', icon: '💊' },
    { id: 'expiry', name: 'Expiry Report', icon: '⚠️' },
    { id: 'suppliers', name: 'Supplier Performance', icon: '🚚' },
    { id: 'customers', name: 'Customer History', icon: '👥' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">View and analyze your pharmacy performance</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            className="border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            className="border rounded px-3 py-2 mt-1"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-6">
          Apply Filter
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Daily Sales Report */}
          {activeTab === 'daily' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Daily Sales Report</h2>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold">₹{dailySalesData.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold">{dailySalesData.reduce((sum, d) => sum + d.transactions, 0)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Average Sale</p>
                  <p className="text-2xl font-bold">
                    ₹{(dailySalesData.reduce((sum, d) => sum + d.sales, 0) / dailySalesData.reduce((sum, d) => sum + d.transactions, 0)).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Sales Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales (₹)" />
                    <Bar yAxisId="right" dataKey="transactions" fill="#82ca9d" name="Transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Sales Table */}
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Sales (₹)</th>
                    <th className="border p-2">Transactions</th>
                    <th className="border p-2">Avg. Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySalesData.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{day.date}</td>
                      <td className="border p-2 text-right">₹{day.sales.toLocaleString()}</td>
                      <td className="border p-2 text-right">{day.transactions}</td>
                      <td className="border p-2 text-right">₹{(day.sales / day.transactions).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Monthly P&L */}
          {activeTab === 'monthly' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Monthly Profit & Loss</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          )}

          {/* Top Medicines */}
          {activeTab === 'top' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Top Selling Medicines</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topMedicines}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={entry => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="sales"
                      >
                        {topMedicines.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Table */}
                <div>
                  <table className="w-full border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Medicine</th>
                        <th className="border p-2">Units Sold</th>
                        <th className="border p-2">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topMedicines.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border p-2">{item.name}</td>
                          <td className="border p-2 text-right">{item.sales}</td>
                          <td className="border p-2 text-right">₹{item.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Expiry Report */}
          {activeTab === 'expiry' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Expiry Report</h2>

              {/* Expiry Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="text-sm text-gray-600">Expiring in 30 days</p>
                  <p className="text-2xl font-bold text-red-600">3 items</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-sm text-gray-600">Expiring in 60 days</p>
                  <p className="text-2xl font-bold text-yellow-600">5 items</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm text-gray-600">Expiring in 90+ days</p>
                  <p className="text-2xl font-bold text-green-600">12 items</p>
                </div>
              </div>

              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Medicine</th>
                    <th className="border p-2">Batch</th>
                    <th className="border p-2">Expiry Date</th>
                    <th className="border p-2">Stock</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expiryData.map((item, index) => {
                    const daysLeft = Math.ceil((new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24));
                    let statusClass = 'bg-green-100 text-green-800';
                    if (daysLeft < 30) statusClass = 'bg-red-100 text-red-800';
                    else if (daysLeft < 60) statusClass = 'bg-yellow-100 text-yellow-800';

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-2">{item.medicine}</td>
                        <td className="border p-2">{item.batch}</td>
                        <td className="border p-2">{item.expiry}</td>
                        <td className="border p-2 text-right">{item.stock}</td>
                        <td className="border p-2">
                          <span className={`px-2 py-1 rounded text-xs ${statusClass}`}>
                            {daysLeft} days left
                          </span>
                        </td>
                        <td className="border p-2">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                            Markdown
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Supplier Performance */}
          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Supplier Performance</h2>
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Supplier</th>
                    <th className="border p-2">Orders</th>
                    <th className="border p-2">Total Amount</th>
                    <th className="border p-2">On-Time %</th>
                    <th className="border p-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierPerformance.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{item.supplier}</td>
                      <td className="border p-2 text-right">{item.orders}</td>
                      <td className="border p-2 text-right">₹{item.amount.toLocaleString()}</td>
                      <td className="border p-2 text-right">{item.onTime}%</td>
                      <td className="border p-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-lg ${i < Math.floor(item.onTime/20) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customer History */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Customer Purchase History</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;