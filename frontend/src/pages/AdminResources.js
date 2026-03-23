import { useEffect, useState, useContext, useRef } from "react";
import AdminNavbar from "../components/AdminNavbar";
import {
    getAllResources,
    createResource,
    updateResource,
    deleteResource,
    toggleResourceAvailability,
} from "../services/resourceService";
import "../styles/resource.css";
import "../styles/admin.css";
import ConfirmModal from "../components/ConfirmModal";
import NotificationContext from "../context/NotificationContext";

const CATEGORIES = ["room", "equipment", "device", "other"];

// Curated emoji sets per category — no external library needed
const EMOJI_SETS = {
    room: ["🏫", "🏢", "🏛️", "🎓", "🖥️", "📚", "🪑", "🛋️", "🏗️", "🏠", "🎭", "🎬", "🔬", "🧪", "💼"],
    equipment: ["📷", "🎥", "🎙️", "🖨️", "📡", "🔭", "🔬", "🧲", "⚙️", "🔧", "🔌", "💡", "📻", "🎚️", "🖱️"],
    device: ["💻", "🖥️", "📱", "⌨️", "🖨️", "📠", "📟", "🎮", "🕹️", "🖱️", "📀", "💾", "🔋", "📺", "⌚"],
    other: ["📦", "🗂️", "📋", "🗓️", "📌", "📎", "✏️", "🖊️", "📏", "🗃️", "🔑", "🏷️", "🎁", "🚀", "⭐"],
};

function EmojiGrid({ category, selected, onSelect }) {
    const emojis = EMOJI_SETS[category] || EMOJI_SETS.other;
    return (
        <div className="emoji-grid-panel">
            <p className="emoji-grid-label">Choose an icon</p>
            <div className="emoji-grid">
                {emojis.map((e) => (
                    <button
                        key={e}
                        type="button"
                        className={`emoji-grid-item ${selected === e ? "active" : ""}`}
                        onClick={() => onSelect(e)}
                    >
                        {e}
                    </button>
                ))}
            </div>
        </div>
    );
}

function AdminResources() {
    const notification = useContext(NotificationContext);
    const modalRef = useRef(null);

    const [resources, setResources] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [catFilter, setCatFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("room");
    const [icon, setIcon] = useState("📦");
    const [saving, setSaving] = useState(false);

    const [resourceToDelete, setResourceToDelete] = useState(null);

    // ── fetch ──────────────────────────────────────────────────────
    const fetchResources = async () => {
        try {
            setLoading(true);
            const data = await getAllResources({
                sortBy: sortBy || undefined,
                category: catFilter !== "all" ? catFilter : undefined,
            });
            setResources(data);
        } catch (err) {
            notification?.showToast(err.message || "Failed to load resources", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchResources(); }, [sortBy, catFilter]);

    // client-side name search
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(resources.filter((r) => r.name.toLowerCase().includes(q)));
    }, [search, resources]);

    // close modal on outside click
    useEffect(() => {
        if (!showModal) return;
        const handler = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showModal]);

    // when category changes inside the modal, reset icon to first of that set
    const handleCategoryChange = (val) => {
        setCategory(val);
        setIcon(EMOJI_SETS[val]?.[0] || "📦");
    };

    // ── open modal ─────────────────────────────────────────────────
    const openModal = (resource = null) => {
        setEditingResource(resource);
        if (resource) {
            setName(resource.name);
            setDescription(resource.description || "");
            setCategory(resource.category || "room");
            setIcon(resource.icon || "📦");
        } else {
            setName("");
            setDescription("");
            setCategory("room");
            setIcon(EMOJI_SETS.room[0]);
        }
        setShowModal(true);
    };

    // ── save ───────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!name.trim()) return notification?.showToast("Name is required", "error");
        try {
            setSaving(true);
            if (editingResource) {
                await updateResource(editingResource._id, { name, description, category, icon });
                notification?.showToast("Resource updated", "success");
            } else {
                await createResource({ name, description, category, icon, availabilityStatus: true });
                notification?.showToast("Resource added", "success");
            }
            setShowModal(false);
            fetchResources();
        } catch (err) {
            notification?.showToast(err.message || "Save failed", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (resource) => {
        try {
            await toggleResourceAvailability(resource._id, !resource.availabilityStatus);
            notification?.showToast(
                `"${resource.name}" is now ${resource.availabilityStatus ? "unavailable" : "available"}`,
                "success"
            );
            fetchResources();
        } catch (err) {
            notification?.showToast(err.message || "Toggle failed", "error");
        }
    };

    const handleDelete = async () => {
        if (!resourceToDelete) return;
        try {
            await deleteResource(resourceToDelete._id);
            notification?.showToast(`"${resourceToDelete.name}" deleted`, "success");
            setResourceToDelete(null);
            fetchResources();
        } catch (err) {
            notification?.showToast(err.message || "Delete failed", "error");
            setResourceToDelete(null);
        }
    };

    // ── render ─────────────────────────────────────────────────────
    return (
        <div className="layout">
            <AdminNavbar />

            <div className="content">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1>Resources</h1>
                        <p className="page-subtitle">{resources.length} total resources</p>
                    </div>
                    <button className="btn-add" onClick={() => openModal(null)}>
                        + Add Resource
                    </button>
                </div>

                {/* Controls */}
                <div className="resources-controls">
                    <input
                        className="search-bar"
                        placeholder="Search by name…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Sort: Default</option>
                        <option value="availability">Sort: Availability</option>
                        <option value="category">Sort: Category</option>
                    </select>
                    <div className="category-filters">
                        {["all", ...CATEGORIES].map((cat) => (
                            <button
                                key={cat}
                                className={`category-btn ${catFilter === cat ? "active" : ""}`}
                                onClick={() => setCatFilter(cat)}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <p className="loading-text">Loading…</p>
                ) : filtered.length === 0 ? (
                    <p className="empty-state">No resources found</p>
                ) : (
                    <div className="grid">
                        {filtered.map((r) => (
                            <div key={r._id} className="resource-card">
                                <div className="resource-card-top">
                                    <span className="resource-icon-display">{r.icon}</span>
                                    <span className={r.availabilityStatus ? "available" : "unavailable"}>
                                        {r.availabilityStatus ? "Available" : "Unavailable"}
                                    </span>
                                </div>
                                <h3>{r.name}</h3>
                                <p>{r.description || <em>No description</em>}</p>
                                <span className="resource-category-tag">{r.category}</span>

                                <div className="card-actions">
                                    <button
                                        className="btn-toggle"
                                        onClick={() => handleToggle(r)}
                                        title={r.availabilityStatus ? "Mark unavailable" : "Mark available"}
                                    >
                                        {r.availabilityStatus ? "Disable" : "Enable"}
                                    </button>
                                    <button className="btn-edit" onClick={() => openModal(r)}>
                                        Edit
                                    </button>
                                    <button className="btn-delete" onClick={() => setResourceToDelete(r)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Add / Edit Modal ───────────────────────────────────── */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="resource-modal" ref={modalRef}>
                        {/* Modal header */}
                        <div className="resource-modal-header">
                            <h2>{editingResource ? "Edit Resource" : "Add Resource"}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        {/* Selected icon preview + name */}
                        <div className="resource-modal-preview">
                            <div className="icon-preview">{icon}</div>
                            <div className="resource-modal-name-wrap">
                                <label className="form-label">Resource Name</label>
                                <input
                                    className="resource-modal-input"
                                    placeholder="e.g. Conference Room A"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group" style={{ marginBottom: 14 }}>
                            <label className="form-label">Description</label>
                            <input
                                className="resource-modal-input"
                                placeholder="Optional description…"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Category */}
                        <div className="form-group" style={{ marginBottom: 14 }}>
                            <label className="form-label">Category</label>
                            <div className="resource-cat-pills">
                                {CATEGORIES.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`resource-cat-pill ${category === c ? "active" : ""}`}
                                        onClick={() => handleCategoryChange(c)}
                                    >
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Emoji grid */}
                        <EmojiGrid
                            category={category}
                            selected={icon}
                            onSelect={setIcon}
                        />

                        {/* Actions */}
                        <div className="resource-modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving…" : editingResource ? "Save Changes" : "Add Resource"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!resourceToDelete}
                title="Delete Resource"
                message={`Permanently delete "${resourceToDelete?.name}"? This cannot be undone.`}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setResourceToDelete(null)}
            />
        </div>
    );
}

export default AdminResources;