import API_BASE_URL from "../config";

const getToken = () => localStorage.getItem("token");

export const getMyBookings = async (filter) => {
    const url = filter
        ? `${API_BASE_URL}/bookings/my?filter=${filter}`
        : `${API_BASE_URL}/bookings/my`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data.data || data;
};

export const createBooking = async (booking) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(booking)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const deleteBooking = async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete booking");
    }

    return data;
};

export const getDashboardStats = async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/dashboard/stats`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard stats");
    }

    return data;
};

export const getAllBookings = async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings");
    }

    return data;
};

export const approveBooking = async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/approve`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to approve booking");
    return data;
};

export const rejectBooking = async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/reject`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to reject booking");
    return data;
};

export default { getMyBookings, createBooking, deleteBooking, getDashboardStats, getAllBookings, approveBooking, rejectBooking };