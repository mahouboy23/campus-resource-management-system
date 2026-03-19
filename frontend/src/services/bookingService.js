import API_BASE_URL from "../config";

const getToken = () => localStorage.getItem("token");

export const getMyBookings = async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/my`, {
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