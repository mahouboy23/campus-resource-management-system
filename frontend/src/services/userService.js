import API_BASE_URL from "../config";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

export const getAllUsers = async () => {
    const res = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load users");
    return data;
};

export const createUser = async (payload) => {
    const res = await fetch(`${API_BASE_URL}/auth/users`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create user");
    return data;
};

export const updateUser = async (id, payload) => {
    const res = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update user");
    return data;
};

export const deleteUser = async (id) => {
    const res = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete user");
    return data;
};

export const getAdminStats = async () => {
    const res = await fetch(`${API_BASE_URL}/auth/admin/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load stats");
    return data;
};