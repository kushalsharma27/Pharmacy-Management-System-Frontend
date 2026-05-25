import { useEffect, useState } from "react";
import { purchaseAPI, supplierAPI, medicineAPI } from "../services/api";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [form, setForm] = useState({
    supplierId: "",
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: "",
    items: [{ medicineId: "", quantity: 1, unitPrice: 0 }],
    status: "PENDING"
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchMedicines();
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [page]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await purchaseAPI.getAll();
      // Sort by date (newest first)
      const sortedPurchases = response.data.sort((a, b) =>
        new Date(b.orderDate) - new Date(a.orderDate)
      );
      setTotalPages(Math.ceil(sortedPurchases.length / pageSize));
      const paginated = sortedPurchases.slice(
        (page - 1) * pageSize,
        page * pageSize
      );
      setPurchases(paginated);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      alert("Failed to fetch purchases");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await supplierAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.getAll();
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleAddItem = () => {
    setForm({
      ...form,
      items: [...form.items, { medicineId: "", quantity: 1, unitPrice: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate total amount
      const totalAmount = form.items.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice),
        0
      );

      const purchaseData = {
        ...form,
        totalAmount,
        items: form.items.map(item => ({
          ...item,
          medicineId: parseInt(item.medicineId)
        }))
      };

      await purchaseAPI.create(purchaseData);
      alert("Purchase order created successfully!");
      setShowForm(false);
      resetForm();
      fetchPurchases();
    } catch (error) {
      console.error("Error creating purchase:", error);
      alert("Failed to create purchase order");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await purchaseAPI.updateStatus(id, newStatus);
      alert(`Purchase order ${newStatus.toLowerCase()} successfully!`);
      fetchPurchases();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const resetForm = () => {
    setForm({
      supplierId: "",
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: "",
      items: [{ medicineId: "", quantity: 1, unitPrice: 0 }],
      status: "PENDING"
    });
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : "Unknown";
  };

  const getMedicineName = (medicineId) => {
    const medicine = medicines.find(m => m.id === medicineId);
    return medicine ? medicine.name : "Unknown";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Purchase Orders</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ New Purchase Order"}
          </button>
        </div>

        {/* New Purchase Form */}
        {showForm && (
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="text-lg font-bold mb-4">Create Purchase Order</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier *</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={form.supplierId}
                    onChange={(e) => setForm({...form, supplierId: e.target.value})}
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order Date *</label>
                  <input
                    type="date"
                    className="border p-2 rounded w-full"
                    value={form.orderDate}
                    onChange={(e) => setForm({...form, orderDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Delivery</label>
                  <input
                    type="date"
                    className="border p-2 rounded w-full"
                    value={form.expectedDelivery}
                    onChange={(e) => setForm({...form, expectedDelivery: e.target.value})}
                  />
                </div>
              </div>

              <h4 className="font-bold mb-2">Items</h4>
              {form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                  <div>
                    <select
                      className="border p-2 rounded w-full"
                      value={item.medicineId}
                      onChange={(e) => handleItemChange(index, 'medicineId', e.target.value)}
                      required
                    >
                      <option value="">Select Medicine</option>
                      {medicines.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="border p-2 rounded w-full"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Unit Price"
                      className="border p-2 rounded w-full"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
              >
                + Add Item
              </button>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {loading ? "Creating..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Purchases Table */}
        {loading ? (
          <div className="text-center py-8">Loading purchases...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">PO #</th>
                  <th className="border p-2">Supplier</th>
                  <th className="border p-2">Order Date</th>
                  <th className="border p-2">Expected</th>
                  <th className="border p-2">Items</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-4 text-gray-500">
                      No purchase orders found
                    </td>
                  </tr>
                ) : (
                  purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50">
                      <td className="border p-2">#{purchase.id}</td>
                      <td className="border p-2">{getSupplierName(purchase.supplierId)}</td>
                      <td className="border p-2">{formatDate(purchase.orderDate)}</td>
                      <td className="border p-2">
                        {purchase.expectedDelivery ? formatDate(purchase.expectedDelivery) : '-'}
                      </td>
                      <td className="border p-2">{purchase.items?.length || 0}</td>
                      <td className="border p-2 font-bold">₹{purchase.totalAmount?.toFixed(2)}</td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(purchase.status)}`}>
                          {purchase.status}
                        </span>
                      </td>
                      <td className="border p-2 space-x-2">
                        <button
                          onClick={() => setSelectedPurchase(purchase)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                        {purchase.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateStatus(purchase.id, 'CONFIRMED')}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(purchase.id, 'CANCELLED')}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {purchase.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateStatus(purchase.id, 'SHIPPED')}
                            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                          >
                            Ship
                          </button>
                        )}
                        {purchase.status === 'SHIPPED' && (
                          <button
                            onClick={() => updateStatus(purchase.id, 'DELIVERED')}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Deliver
                          </button>
                        )}
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

      {/* Purchase Details Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Purchase Order #{selectedPurchase.id}</h3>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
              <div>
                <p className="font-bold">Supplier:</p>
                <p>{getSupplierName(selectedPurchase.supplierId)}</p>
              </div>
              <div>
                <p className="font-bold">Order Date:</p>
                <p>{formatDate(selectedPurchase.orderDate)}</p>
              </div>
              <div>
                <p className="font-bold">Expected Delivery:</p>
                <p>{selectedPurchase.expectedDelivery ? formatDate(selectedPurchase.expectedDelivery) : 'Not set'}</p>
              </div>
              <div>
                <p className="font-bold">Status:</p>
                <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(selectedPurchase.status)}`}>
                  {selectedPurchase.status}
                </span>
              </div>
            </div>

            <h4 className="font-bold mb-2">Items</h4>
            <table className="w-full mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Medicine</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Unit Price</th>
                  <th className="p-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedPurchase.items?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{getMedicineName(item.medicineId)}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">₹{item.unitPrice}</td>
                    <td className="p-2">₹{item.quantity * item.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-bold">
                <tr>
                  <td colSpan="3" className="p-2 text-right">Total:</td>
                  <td className="p-2">₹{selectedPurchase.totalAmount?.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPurchase(null)}
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

export default Purchases;