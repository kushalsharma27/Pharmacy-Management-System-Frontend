import { useEffect, useState } from "react";
import { supplierAPI } from "../services/api";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: ""
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await supplierAPI.getAll();
      console.log("Suppliers fetched:", response.data);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      alert("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (form.id) {
        await supplierAPI.update(form.id, {
          name: form.name,
          contactPerson: form.contactPerson,
          email: form.email,
          phone: form.phone,
          address: form.address
        });
        alert("Supplier updated successfully!");
      } else {
        await supplierAPI.create({
          name: form.name,
          contactPerson: form.contactPerson,
          email: form.email,
          phone: form.phone,
          address: form.address
        });
        alert("Supplier added successfully!");
      }

      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error("Error saving supplier:", error);
      alert("Failed to save supplier");
    }
  };

  const deleteSupplier = async (id) => {
    if (!confirm("Delete this supplier?")) return;

    try {
      await supplierAPI.delete(id);
      alert("Supplier deleted successfully!");
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier");
    }
  };

  const editSupplier = (s) => {
    setForm({
      id: s.id,
      name: s.name || "",
      contactPerson: s.contactPerson || "",
      email: s.email || "",
      phone: s.phone || "",
      address: s.address || ""
    });
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: ""
    });
  };

  // Search and pagination
  const filtered = suppliers.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading && suppliers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading suppliers...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Supplier Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Company Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Contact Person"
          value={form.contactPerson}
          onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
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
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded hover:bg-blue-700 px-4 py-2 flex-1"
          >
            {form.id ? "Update" : "Add"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white rounded hover:bg-gray-600 px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search */}
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Search suppliers..."
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
              <th className="border p-2">Company</th>
              <th className="border p-2">Contact Person</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border p-2">{s.id}</td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.contactPerson || '-'}</td>
                <td className="border p-2">{s.email || '-'}</td>
                <td className="border p-2">{s.phone || '-'}</td>
                <td className="border p-2">{s.address || '-'}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => editSupplier(s)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSupplier(s.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-gray-500">
                  {search ? "No suppliers match your search" : "No suppliers found. Add one above!"}
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

export default Suppliers;