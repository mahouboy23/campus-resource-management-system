import API_BASE_URL from "../config";

const getToken = () => localStorage.getItem("token");

export const getMyBookings = async (filter) => {
    const url = filter
        ? `${API_BASE_URL}/bookings/my?filter=${filter}`
        : `${API_BASE_URL}/bookings/my`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.data || data;
};

export const createBooking = async (booking) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(booking),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};

export const deleteBooking = async (id) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete booking");
    return data;
};

export const getDashboardStats = async () => {
    const res = await fetch(`${API_BASE_URL}/bookings/dashboard/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load dashboard stats");
    return data;
};

// Returns approved+pending bookings for a resource from today onward (for calendar)
export const getResourceBookings = async (resourceId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/resource/${resourceId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load resource bookings");
    return data;
};

// Admin: get all bookings, optional filters ?status= &user=
export const getAllBookings = async ({ status, user } = {}) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (user) params.append("user", user);

    const url = params.toString()
        ? `${API_BASE_URL}/bookings?${params.toString()}`
        : `${API_BASE_URL}/bookings`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load bookings");
    return data;
};

export const approveBooking = async (id) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to approve booking");
    return data;
};

export const rejectBooking = async (id) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to reject booking");
    return data;
};

export default {
    getMyBookings, createBooking, deleteBooking, getDashboardStats,
    getResourceBookings, getAllBookings, approveBooking, rejectBooking,
};