import API_BASE_URL from "../config";

const getToken = () => localStorage.getItem("token");

// GET ALL RESOURCES
export const getAllResources = async ({ sortBy, category } = {}) => {
  const params = new URLSearchParams();
  if (sortBy) params.append("sortBy", sortBy);
  if (category) params.append("category", category);

  const url = params.toString()
    ? `${API_BASE_URL}/resources?${params.toString()}`
    : `${API_BASE_URL}/resources`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to load resources");
  return data.data || data;
};

// GET BY ID
export const getResourceById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data || data;
};

// CREATE RESOURCE
export const createResource = async (resource) => {
  const response = await fetch(`${API_BASE_URL}/resources`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(resource),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create resource");
  return data.data || data;
};

// UPDATE RESOURCE
export const updateResource = async (id, resource) => {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(resource),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update resource");
  return data.data || data;
};

// DELETE RESOURCE
export const deleteResource = async (id) => {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete resource");
  return data.data || data;
};

// TOGGLE AVAILABILITY
export const toggleResourceAvailability = async (id, availabilityStatus) => {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ availabilityStatus }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update resource");
  return data.data || data;
};