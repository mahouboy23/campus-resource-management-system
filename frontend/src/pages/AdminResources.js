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
import Picker from "emoji-picker-react";

const CATEGORIES = ["room", "equipment", "device", "other"];

function AdminResources() {
  const notification = useContext(NotificationContext);

  const [resources, setResources] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("room");
  const [icon, setIcon] = useState("📦");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getAllResources();
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
      setIcon(resource.icon || "📦");
    } else {
      setName("");
      setDescription("");
      setCategory("room");
      setIcon("📦");
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name) return notification?.showToast("Name is required", "error");

    try {
      if (editingResource) {
        await updateResource(editingResource._id, {
          name,
          description,
          category,
          icon,
        });
        notification?.showToast("Resource updated", "success");
      } else {
        await createResource({
          name,
          description,
          category,
          icon,
          availabilityStatus: true,
        });
        notification?.showToast("Resource added", "success");
      }

      setShowModal(false);
      setEditingResource(null);
      setShowEmojiPicker(false);
      fetchResources();
    } catch (err) {
      notification?.showToast(err.message || "Save failed", "error");
    }
  };

  const handleToggle = async (resource) => {
    try {
      await toggleResourceAvailability(resource._id, !resource.availabilityStatus);
      fetchResources();
    } catch (err) {
      notification?.showToast(err.message || "Toggle failed", "error");
    }
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    try {
      await deleteResource(resourceToDelete._id);
      setResourceToDelete(null);
      fetchResources();
    } catch (err) {
      notification?.showToast(err.message || "Delete failed", "error");
      setResourceToDelete(null);
    }
  };

  return (
    <div className="layout">
      <AdminNavbar />

      <div className="content">
        <h1>Admin Resources</h1>

        <input
          className="search-bar"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid">
            {filtered.map((r) => (
              <div key={r._id} className="resource-card">
                <h3>{r.icon} {r.name}</h3>
                <p>{r.description}</p>

                <p className={r.availabilityStatus ? "available" : "unavailable"}>
                  {r.availabilityStatus ? "Available" : "Unavailable"}
                </p>

                <div className="card-actions">
                  <button onClick={() => handleToggle(r)}>Toggle</button>
                  <button onClick={() => openModal(r)}>Edit</button>
                  <button onClick={() => setResourceToDelete(r)}>Delete</button>
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
              <h2>{editingResource ? "Edit Resource" : "Add Resource"}</h2>

              {/* ✅ CLEAN EMOJI INPUT */}
              <div className="emoji-input">
                <button
                  type="button"
                  className="emoji-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {icon}
                </button>

                <input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <Picker
                      onEmojiClick={(emojiData) => {
                        setIcon(emojiData.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="modal-actions">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!resourceToDelete}
        title="Delete Resource"
        message={`Delete "${resourceToDelete?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setResourceToDelete(null)}
      />
    </div>
  );
}

export default AdminResources;