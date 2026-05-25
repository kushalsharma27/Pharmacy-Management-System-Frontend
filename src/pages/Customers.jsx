import { useEffect, useState } from "react";
import { customerAPI } from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    loyaltyPoints: 0
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerAPI.getAll();
      console.log("Customers fetched:", response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.id) {
        await customerAPI.update(form.id, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          loyaltyPoints: Number(form.loyaltyPoints)
        });
        alert("Customer updated successfully!");
      } else {
        await customerAPI.create({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          loyaltyPoints: Number(form.loyaltyPoints)
        });
        alert("Customer added successfully!");
      }

      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      const message = error.response?.data?.message
        || error.response?.data
        || "Failed to save customer";
      // Check for duplicate email error
      if (
        typeof message === "string" &&
        message.toLowerCase().includes("duplicate") ||
        error.response?.status === 409
      ) {
        alert("A customer with this email already exists. Please use a different email.");
      } else {
        alert(typeof message === "string" ? message : "Failed to save customer");
      }
    }
  };

  const deleteCustomer = async (id) => {
    if (!confirm("Delete this customer?")) return;

    try {
      await customerAPI.delete(id);
      alert("Customer deleted successfully!");
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer");
    }
  };

  const editCustomer = (c) => {
    setForm({
      id: c.id,
      name: c.name,
      email: c.email || "",
      phone: c.phone || "",
      address: c.address || "",
      loyaltyPoints: c.loyaltyPoints || 0
    });
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      loyaltyPoints: 0
    });
  };

  const addLoyaltyPoints = async (id) => {
    const points = prompt("Enter loyalty points to add:", "10");
    if (!points) return;

    try {
      await customerAPI.addPoints(id, parseInt(points));
      alert(`${points} points added successfully!`);
      fetchCustomers();
    } catch (error) {
      console.error("Error adding loyalty points:", error);
      alert("Failed to add loyalty points");
    }
  };

  // Search and pagination
  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading && customers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Customer Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          className="border p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Phone (10-15 digits)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          pattern="^[0-9\-\+]{10,15}$"
          title="Phone must be 10-15 digits (numbers, +, - allowed)"
        />
        <input
          className="border p-2 rounded"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Loyalty Points"
          value={form.loyaltyPoints}
          onChange={(e) => setForm({ ...form, loyaltyPoints: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded hover:bg-blue-700 px-4 py-2"
        >
          {form.id ? "Update" : "Add"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white rounded hover:bg-gray-600 px-4 py-2 col-start-5"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Search */}
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Search customers..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Loyalty Points</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="border p-2">{c.id}</td>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.email || '-'}</td>
                <td className="border p-2">{c.phone || '-'}</td>
                <td className="border p-2">{c.loyaltyPoints || 0}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => editCustomer(c)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => addLoyaltyPoints(c.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Add Points
                  </button>
                  <button
                    onClick={() => deleteCustomer(c.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500">
                  {search ? "No customers match your search" : "No customers found. Add one above!"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
  );
}

export default Customers;
