import { useEffect, useState, useContext } from "react";
import AdminNavbar from "../components/AdminNavbar";
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  toggleResourceAvailability,
} from "../services/resourceService";
import "../styles/resource.css";
import ConfirmModal from "../components/ConfirmModal";
import NotificationContext from "../context/NotificationContext";

const CATEGORIES = ["room", "equipment", "device", "other"];

function AdminResources() {
  const notification = useContext(NotificationContext);

  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("room");

  const [resourceToDelete, setResourceToDelete] = useState(null);

  useEffect(() => {
    fetchResources();
  }, [sortBy, categoryFilter]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getAllResources({
        sortBy: sortBy || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
      });
      setResources(data);
      setFiltered(data);
    } catch (err) {
      notification?.showToast(err.message || "Failed to load resources", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const result = resources.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, resources]);

  const openModal = (resource = null) => {
    setEditingResource(resource);
    if (resource) {
      setName(resource.name);
      setDescription(resource.description);
      setCategory(resource.category);
    } else {
      setName("");
      setDescription("");
      setCategory("room");
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name) return notification?.showToast("Name is required", "error");

    try {
      if (editingResource) {
        await updateResource(editingResource._id, { name, description, category });
        notification?.showToast("Resource updated successfully", "success");
      } else {
        await createResource({ name, description, category, availabilityStatus: true });
        notification?.showToast("Resource added successfully", "success");
      }

      setShowModal(false);
      setEditingResource(null);
      fetchResources();
    } catch (err) {
      notification?.showToast(err.message || "Failed to save resource", "error");
    }
  };

  const handleToggle = async (resource) => {
    try {
      await toggleResourceAvailability(resource._id, !resource.availabilityStatus);
      notification?.showToast(
        `Resource "${resource.name}" is now ${resource.availabilityStatus ? "Unavailable" : "Available"}`,
        "success"
      );
      fetchResources();
    } catch (err) {
      notification?.showToast(err.message || "Failed to toggle availability", "error");
    }
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    try {
      await deleteResource(resourceToDelete._id);
      notification?.showToast(`Resource "${resourceToDelete.name}" deleted`, "success");
      setResourceToDelete(null);
      fetchResources();
    } catch (err) {
      notification?.showToast(err.message || "Failed to delete resource", "error");
      setResourceToDelete(null);
    }
  };

  return (
    <div className="layout">
      <AdminNavbar />

      <div className="content">
        <h1>Admin Resources</h1>

        <div className="resources-controls">
          <input
            className="search-bar"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort by: Default</option>
            <option value="availability">Sort by: Availability</option>
            <option value="category">Sort by: Category</option>
          </select>

          <div className="category-filters">
            {["all", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                className={`category-btn ${categoryFilter === cat ? "active" : ""}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No resources found</p>
        ) : (
          <div className="grid">
            {filtered.map((r) => (
              <div key={r._id} className="resource-card">
                <h3>{r.name}</h3>
                <p>{r.description}</p>
                <p className={r.availabilityStatus ? "available" : "unavailable"}>
                  {r.availabilityStatus ? "Available" : "Unavailable"}
                </p>
                <div className="card-actions">
                  <button onClick={() => handleToggle(r)}>Toggle</button>
                  <button onClick={() => openModal(r)}>Edit</button>
                  <button className="btn-delete" onClick={() => setResourceToDelete(r)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="floating-add-btn" onClick={() => openModal(null)}>
          +
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editingResource ? "Edit Resource" : "Add New Resource"}</h2>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button onClick={handleSave}>{editingResource ? "Save" : "Add"}</button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingResource(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!resourceToDelete}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resourceToDelete?.name}"?`}
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setResourceToDelete(null)}
      />
    </div>
  );
}

export default AdminResources;