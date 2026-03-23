import { useEffect, useState, useContext } from "react";
import AdminNavbar from "../components/AdminNavbar";
import ConfirmModal from "../components/ConfirmModal";
import { getAllUsers, createUser, updateUser, deleteUser } from "../services/userService";
import NotificationContext from "../context/NotificationContext";
import "../styles/admin.css";

const EMPTY_FORM = { name: "", email: "", password: "", role: "user" };

function AdminUsers() {
    const notification = useContext(NotificationContext);

    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // null = create mode
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [userToDelete, setUserToDelete] = useState(null);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
            setFiltered(data);
        } catch (err) {
            notification?.showToast(err.message || "Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    // Client-side search + role filter
    useEffect(() => {
        let result = users;
        if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [search, roleFilter, users]);

    const openCreate = () => {
        setEditingUser(null);
        setForm(EMPTY_FORM);
        setFormError("");
        setShowModal(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setForm({ name: user.name, email: user.email, password: "", role: user.role });
        setFormError("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormError("");
    };

    const handleSave = async () => {
        setFormError("");
        if (!form.name.trim()) return setFormError("Name is required");
        if (!form.email.trim()) return setFormError("Email is required");
        if (!editingUser && !form.password.trim())
            return setFormError("Password is required for new users");

        try {
            setSaving(true);
            if (editingUser) {
                // Only send password if it was filled in
                const payload = { name: form.name, email: form.email, role: form.role };
                if (form.password.trim()) payload.password = form.password;
                await updateUser(editingUser._id, payload);
                notification?.showToast("User updated successfully", "success");
            } else {
                await createUser(form);
                notification?.showToast("User created successfully", "success");
            }
            closeModal();
            load();
        } catch (err) {
            setFormError(err.message || "Failed to save user");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete._id);
            notification?.showToast(`User "${userToDelete.name}" deleted`, "success");
            setUserToDelete(null);
            load();
        } catch (err) {
            notification?.showToast(err.message || "Failed to delete user", "error");
            setUserToDelete(null);
        }
    };

    const adminCount = users.filter((u) => u.role === "admin").length;
    const userCount = users.filter((u) => u.role === "user").length;

    return (
        <div className="layout">
            <AdminNavbar />

            <div className="content">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1>User Management</h1>
                        <p className="page-subtitle">
                            {users.length} total · {userCount} users · {adminCount} admins
                        </p>
                    </div>
                    <button className="btn-add" onClick={openCreate}>
                        + New User
                    </button>
                </div>

                {/* Filters */}
                <div className="admin-filters">
                    <input
                        className="search-bar"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="category-filters">
                        {["all", "user", "admin"].map((r) => (
                            <button
                                key={r}
                                className={`category-btn ${roleFilter === r ? "active" : ""}`}
                                onClick={() => setRoleFilter(r)}
                            >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Users table */}
                {loading ? (
                    <p className="loading-text">Loading users…</p>
                ) : filtered.length === 0 ? (
                    <p className="empty-state">No users found</p>
                ) : (
                    <div className="users-table-wrap">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="user-avatar-cell">
                                                <div className="user-avatar">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                {u.name}
                                            </div>
                                        </td>
                                        <td className="muted-cell">{u.email}</td>
                                        <td>
                                            <span className={`role-badge ${u.role}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="muted-cell">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="btn-table-edit"
                                                    onClick={() => openEdit(u)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn-table-delete"
                                                    onClick={() => setUserToDelete(u)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box modal-box-lg">
                        <h2>{editingUser ? "Edit User" : "Create New User"}</h2>
                        <p className="modal-subtitle">
                            {editingUser
                                ? "Update user details. Leave password blank to keep it unchanged."
                                : "Fill in all fields to create a new account."}
                        </p>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Jane Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="e.g. jane@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Password{" "}
                                    {editingUser && (
                                        <span className="label-hint">(leave blank to keep current)</span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    placeholder={editingUser ? "New password…" : "Min. 6 characters"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {formError && <p className="error" style={{ marginTop: 8 }}>{formError}</p>}

                        <div className="modal-actions" style={{ marginTop: 20 }}>
                            <button className="btn-secondary" onClick={closeModal}>
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving…" : editingUser ? "Save Changes" : "Create User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={!!userToDelete}
                title="Delete User"
                message={`Permanently delete "${userToDelete?.name}" (${userToDelete?.email})? This cannot be undone.`}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setUserToDelete(null)}
            />
        </div>
    );
}

export default AdminUsers;