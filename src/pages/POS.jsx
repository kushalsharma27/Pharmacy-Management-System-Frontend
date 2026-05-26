import { useEffect, useState } from "react";
import { medicineAPI, customerAPI, saleAPI } from "../services/api";
import { getCurrentUser } from "../services/authService";

function POS() {
  const [medicines, setMedicines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const user = getCurrentUser();

  useEffect(() => {
    fetchMedicines();
    fetchCustomers();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.getAll();
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
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

  const searchMedicines = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(term.toLowerCase()) ||
        (m.manufacturer && m.manufacturer.toLowerCase().includes(term.toLowerCase()))
    );
    setSearchResults(results.slice(0, 5));
  };

  const addToCart = (medicine) => {
    if (medicine.quantity <= 0) {
      alert("Out of stock!");
      return;
    }

    const existingItem = cart.find(item => item.id === medicine.id);

    if (existingItem) {
      if (existingItem.quantity >= medicine.quantity) {
        alert("Not enough stock!");
        return;
      }
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, cartQuantity: 1 }]);
    }

    setSearchTerm("");
    setSearchResults([]);
  };

  const updateCartQuantity = (id, newQuantity) => {
    const medicine = medicines.find(m => m.id === id);
    if (newQuantity > medicine.quantity) {
      alert("Not enough stock!");
      return;
    }
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, cartQuantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) {
      alert("Name is required!");
      return;
    }
    if (!newCustomer.phone.trim()) {
      alert("Phone is required!");
      return;
    }
    const phoneRegex = /^[0-9\-\+]{10,15}$/;
    if (!phoneRegex.test(newCustomer.phone)) {
      alert("Invalid phone number. Must be 10-15 digits (numbers, +, - allowed).");
      return;
    }

    try {
      const response = await customerAPI.create(newCustomer);
      setCustomers([...customers, response.data]);
      setSelectedCustomer(response.data);
      setShowCustomerModal(false);
      setNewCustomer({ name: "", email: "", phone: "" });
      alert("Customer added successfully!");
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Failed to add customer");
    }
  };

  const processSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);
    try {
      // Payload matches SaleRequest + SaleItemRequest DTOs exactly
      const saleData = {
        customerId: selectedCustomer?.id || null,
        items: cart.map(item => ({
          medicineId: item.id,
          quantity: item.cartQuantity,
          batchNumber: item.batchNumber || null,
        })),
        paymentMethod: paymentMethod,
        amountPaid: calculateTotal(),
        discount: 0.0,
        notes: null,
      };

      await saleAPI.create(saleData);

      if (selectedCustomer) {
        const pointsEarned = Math.floor(calculateTotal() / 10);
        await customerAPI.addPoints(selectedCustomer.id, pointsEarned);
        alert(`Sale completed! Customer earned ${pointsEarned} loyalty points!`);
      } else {
        alert("Sale completed successfully!");
      }

      setCart([]);
      setSelectedCustomer(null);
      fetchMedicines();
      fetchCustomers();

    } catch (error) {
      console.error("Error processing sale:", error);
      alert("Failed to process sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Product Search */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Point of Sale (POS)</h2>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              className="border p-3 rounded w-full text-lg"
              placeholder="Search medicines by name or manufacturer..."
              value={searchTerm}
              onChange={(e) => searchMedicines(e.target.value)}
            />

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded-b shadow-lg mt-1">
                {searchResults.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                    onClick={() => addToCart(medicine)}
                  >
                    <div>
                      <span className="font-bold">{medicine.name}</span>
                      <span className="text-gray-600 text-sm ml-2">
                        {medicine.manufacturer}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 font-bold">₹{medicine.price}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        Stock: {medicine.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Current Sale</h3>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Cart is empty. Search and add medicines.</p>
          ) : (
            <>
              <table className="w-full mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Medicine</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Total</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.manufacturer}</div>
                      </td>
                      <td className="p-2">₹{item.price}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={item.cartQuantity}
                          onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 border p-1 rounded text-center"
                        />
                      </td>
                      <td className="p-2 font-bold">₹{item.price * item.cartQuantity}</td>
                      <td className="p-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Right Column - Customer & Payment */}
      <div className="lg:col-span-1">
        {/* Customer Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold mb-4">Customer</h3>

          {selectedCustomer ? (
            <div className="mb-4 p-3 bg-green-50 rounded">
              <p className="font-bold">{selectedCustomer.name}</p>
              <p className="text-sm">{selectedCustomer.email || 'No email'}</p>
              <p className="text-sm">{selectedCustomer.phone || 'No phone'}</p>
              <p className="text-sm mt-2">
                Loyalty Points: <span className="font-bold text-green-600">{selectedCustomer.loyaltyPoints || 0}</span>
              </p>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Change Customer
              </button>
            </div>
          ) : (
            <div>
              <select
                className="border p-2 rounded w-full mb-2"
                onChange={(e) => {
                  const customer = customers.find(c => c.id === parseInt(e.target.value));
                  setSelectedCustomer(customer);
                }}
              >
                <option value="">Walk-in Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add New Customer
              </button>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Payment</h3>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span className="font-bold">₹{calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              className="border p-2 rounded w-full"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <button
            onClick={processSale}
            disabled={loading || cart.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add New Customer</h3>
            <input
              type="text"
              placeholder="Name *"
              className="border p-2 rounded w-full mb-2"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded w-full mb-2"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            />
            <input
              type="text"
              placeholder="Phone * (10-15 digits)"
              className="border p-2 rounded w-full mb-4"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              required
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCustomer}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
              >
                Add
              </button>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POS;