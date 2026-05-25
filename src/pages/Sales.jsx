import { useEffect, useState } from "react";
import { saleAPI, customerAPI } from "../services/api";

function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    customerId: "",
    paymentMethod: ""
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchSales();
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchSales();
  }, [page, filters]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await saleAPI.getAll();
      let filteredSales = response.data;

      // Apply filters
      if (filters.startDate) {
        filteredSales = filteredSales.filter(sale =>
          new Date(sale.saleDate) >= new Date(filters.startDate)
        );
      }
      if (filters.endDate) {
        filteredSales = filteredSales.filter(sale =>
          new Date(sale.saleDate) <= new Date(filters.endDate)
        );
      }
      if (filters.customerId) {
        filteredSales = filteredSales.filter(sale =>
          sale.customerId === parseInt(filters.customerId)
        );
      }
      if (filters.paymentMethod) {
        filteredSales = filteredSales.filter(sale =>
          sale.paymentMethod === filters.paymentMethod
        );
      }

      // Sort by date (newest first)
      filteredSales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));

      setTotalPages(Math.ceil(filteredSales.length / pageSize));
      const paginatedSales = filteredSales.slice(
        (page - 1) * pageSize,
        page * pageSize
      );
      setSales(paginatedSales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      alert("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchSaleDetails = async (saleId) => {
    try {
      const response = await saleAPI.getById(saleId);
      setSelectedSale(response.data);
    } catch (error) {
      console.error("Error fetching sale details:", error);
    }
  };

  const getCustomerName = (customerId) => {
    if (!customerId) return "Walk-in Customer";
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : "Unknown";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      customerId: "",
      paymentMethod: ""
    });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Sales History</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Customer</label>
            <select
              className="border p-2 rounded w-full"
              value={filters.customerId}
              onChange={(e) => setFilters({...filters, customerId: e.target.value})}
            >
              <option value="">All Customers</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              className="border p-2 rounded w-full"
              value={filters.paymentMethod}
              onChange={(e) => setFilters({...filters, paymentMethod: e.target.value})}
            >
              <option value="">All Methods</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset Filters
          </button>
        </div>

        {/* Sales Table */}
        {loading ? (
          <div className="text-center py-8">Loading sales...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Invoice #</th>
                  <th className="border p-2">Date & Time</th>
                  <th className="border p-2">Customer</th>
                  <th className="border p-2">Items</th>
                  <th className="border p-2">Subtotal</th>
                  <th className="border p-2">Tax</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Payment</th>
                  <th className="border p-2">Cashier</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-4 text-gray-500">
                      No sales found
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="border p-2">#{sale.id}</td>
                      <td className="border p-2">{formatDate(sale.saleDate)}</td>
                      <td className="border p-2">{getCustomerName(sale.customerId)}</td>
                      <td className="border p-2">{sale.items?.length || 0}</td>
                      <td className="border p-2">₹{sale.subtotal?.toFixed(2)}</td>
                      <td className="border p-2">₹{sale.tax?.toFixed(2)}</td>
                      <td className="border p-2 font-bold">₹{sale.totalAmount?.toFixed(2)}</td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          sale.paymentMethod === 'CASH' ? 'bg-green-100 text-green-800' :
                          sale.paymentMethod === 'CARD' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="border p-2">{sale.cashierId || '-'}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => fetchSaleDetails(sale.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Invoice #{selectedSale.id}</h3>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="border-b pb-4 mb-4">
              <p><span className="font-bold">Date:</span> {formatDate(selectedSale.saleDate)}</p>
              <p><span className="font-bold">Customer:</span> {getCustomerName(selectedSale.customerId)}</p>
              <p><span className="font-bold">Cashier:</span> {selectedSale.cashierId || 'N/A'}</p>
              <p><span className="font-bold">Payment Method:</span> {selectedSale.paymentMethod}</p>
            </div>

            <h4 className="font-bold mb-2">Items</h4>
            <table className="w-full mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Medicine</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Qty</th>
                  <th className="p-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.items?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.medicineName || `Medicine #${item.medicineId}`}</td>
                    <td className="p-2">₹{item.price}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹{selectedSale.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (10%):</span>
                <span>₹{selectedSale.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">₹{selectedSale.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
              >
                Print Invoice
              </button>
              <button
                onClick={() => setSelectedSale(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;