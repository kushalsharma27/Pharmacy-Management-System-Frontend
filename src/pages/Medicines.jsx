import { useEffect, useState } from "react";
import { medicineAPI } from "../services/api";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    genericName: "",
    batchNumber: "",
    manufacturer: "",
    price: "",
    quantity: "",
    reorderLevel: 10,
    expiryDate: "",
    manufacturingDate: "",
    category: "",
    minimumStockLevel: 10,
    maximumStockLevel: 500,
    storageLocation: "",
    supplierName: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await medicineAPI.getAll();
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      alert("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      genericName: form.genericName || null,
      batchNumber: form.batchNumber,
      manufacturer: form.manufacturer || null,
      price: Number(form.price),
      quantity: Number(form.quantity),
      reorderLevel: form.reorderLevel ? Number(form.reorderLevel) : 10,
      expiryDate: form.expiryDate || null,
      manufacturingDate: form.manufacturingDate,
      category: form.category || null,
      minimumStockLevel: form.minimumStockLevel ? Number(form.minimumStockLevel) : 10,
      maximumStockLevel: form.maximumStockLevel ? Number(form.maximumStockLevel) : 500,
      storageLocation: form.storageLocation || null,
      supplierName: form.supplierName || null,
    };

    try {
      if (form.id) {
        await medicineAPI.update(form.id, payload);
        alert("Medicine updated successfully!");
      } else {
        await medicineAPI.create(payload);
        alert("Medicine added successfully!");
      }
      resetForm();
      fetchMedicines();
    } catch (error) {
      console.error("Error saving medicine:", error);
      alert("Failed to save medicine");
    }
  };

  const deleteMedicine = async (id) => {
    if (!confirm("Delete this medicine?")) return;
    try {
      await medicineAPI.delete(id);
      alert("Medicine deleted successfully!");
      fetchMedicines();
    } catch (error) {
      console.error("Error deleting medicine:", error);
      alert("Failed to delete medicine");
    }
  };

  const editMedicine = (m) => {
    setForm({
      id: m.id,
      name: m.name || "",
      genericName: m.genericName || "",
      batchNumber: m.batchNumber || "",
      manufacturer: m.manufacturer || "",
      price: m.price || "",
      quantity: m.quantity || "",
      reorderLevel: m.reorderLevel ?? 10,
      expiryDate: m.expiryDate || "",
      manufacturingDate: m.manufacturingDate || "",
      category: m.category || "",
      minimumStockLevel: m.minimumStockLevel ?? 10,
      maximumStockLevel: m.maximumStockLevel ?? 500,
      storageLocation: m.storageLocation || "",
      supplierName: m.supplierName || "",
    });
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      genericName: "",
      batchNumber: "",
      manufacturer: "",
      price: "",
      quantity: "",
      reorderLevel: 10,
      expiryDate: "",
      manufacturingDate: "",
      category: "",
      minimumStockLevel: 10,
      maximumStockLevel: 500,
      storageLocation: "",
      supplierName: "",
    });
  };

  const filtered = medicines.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading && medicines.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading medicines...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Medicine Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 border rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {form.id ? "Edit Medicine" : "Add New Medicine"}
        </h3>

        {/* Required Fields */}
        <p className="text-sm font-medium text-red-500 mb-2">* Required fields</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              className="border p-2 rounded w-full"
              placeholder="Medicine name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Batch Number <span className="text-red-500">*</span>
            </label>
            <input
              className="border p-2 rounded w-full"
              placeholder="e.g. BATCH-001"
              value={form.batchNumber}
              onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Manufacturing Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={form.manufacturingDate}
              onChange={(e) => setForm({ ...form, manufacturingDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="border p-2 rounded w-full"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              placeholder="0"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Optional Fields */}
        <p className="text-sm font-medium text-gray-500 mb-2">Optional fields</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Generic Name</label>
            <input
              className="border p-2 rounded w-full"
              placeholder="Generic name"
              value={form.genericName}
              onChange={(e) => setForm({ ...form, genericName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Manufacturer</label>
            <input
              className="border p-2 rounded w-full"
              placeholder="Manufacturer"
              value={form.manufacturer}
              onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <input
              className="border p-2 rounded w-full"
              placeholder="e.g. Antibiotic"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Expiry Date</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Supplier Name</label>
            <input
              className="border p-2 rounded w-full"
              placeholder="Supplier"
              value={form.supplierName}
              onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Storage Location</label>
            <input
              className="border p-2 rounded w-full"
              placeholder="e.g. Shelf A3"
              value={form.storageLocation}
              onChange={(e) => setForm({ ...form, storageLocation: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Reorder Level</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={form.reorderLevel}
              onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Min Stock Level</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={form.minimumStockLevel}
              onChange={(e) => setForm({ ...form, minimumStockLevel: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Max Stock Level</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={form.maximumStockLevel}
              onChange={(e) => setForm({ ...form, maximumStockLevel: e.target.value })}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded hover:bg-blue-700 px-6 py-2"
          >
            {form.id ? "Update" : "Add Medicine"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white rounded hover:bg-gray-600 px-6 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search */}
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Search medicine..."
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
              <th className="border p-2">Batch No.</th>
              <th className="border p-2">Manufacturer</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Expiry Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="border p-2">{m.id}</td>
                <td className="border p-2">{m.name}</td>
                <td className="border p-2">{m.batchNumber}</td>
                <td className="border p-2">{m.manufacturer}</td>
                <td className="border p-2">₹{m.price}</td>
                <td className="border p-2">{m.quantity}</td>
                <td className="border p-2">{m.expiryDate || "-"}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => editMedicine(m)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMedicine(m.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-gray-500">
                  {search ? "No medicines match your search" : "No medicines found. Add one above!"}
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

export default Medicines;
