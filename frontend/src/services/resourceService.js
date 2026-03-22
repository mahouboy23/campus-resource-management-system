import API_BASE_URL from "../config";

const getToken = () => localStorage.getItem("token");

export const getAllResources = async ({ sortBy, category } = {}) => {
    const params = new URLSearchParams();
    if (sortBy) params.append("sortBy", sortBy);
    if (category) params.append("category", category);

    const queryString = params.toString();
    const url = queryString
        ? `${API_BASE_URL}/resources?${queryString}`
        : `${API_BASE_URL}/resources`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load resources");
    }

    return data.data || data;
};

export const getResourceById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
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