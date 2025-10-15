// Use relative URLs to leverage the Vite proxy
const API_URL = "/api/auth";
const API_SUBMISSION_URL = "/api/submissions";

const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    credentials: "include", // Sends the HttpOnly cookie
  });

  if (response.status === 401) {
    const error = await response.json();
    throw new Error(error.message);
  }

  if (!response.ok) {
    throw new Error("Login failed due to a server error.");
  }

  return response.json(); // Returns { _id, username, role }
};

const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
};

// Modified: Adds filtering parameters including formType
const getSubmissions = async (filters = {}) => {
  // Build query string from filters { district: 'X', divisionalSec: 'Y', formType: 'council_info' }
  const queryString = new URLSearchParams(filters).toString();
  const url = `${API_SUBMISSION_URL}?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("Not authenticated. Please log in.");
  }

  if (response.status === 403) {
    throw new Error("Not authorized. Admin privileges required.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch submissions.");
  }

  return response.json();
};

const submitForm = async (formData) => {
  const response = await fetch(API_SUBMISSION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("Not authenticated. Please log in.");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Form submission failed due to a server error."
    );
  }

  return response.json();
};

//DELETE FUNCTION ⭐
const deleteSubmission = async (id) => {
  const response = await fetch(`${API_SUBMISSION_URL}/${id}`, {
    method: "DELETE",
    credentials: "include", // Important for sending cookies/auth
  });
  // If the response is NOT OK (e.g., 404, 500)
  if (!response.ok) {
    // Try to parse error JSON, with a fallback
    const errorData = await response.json().catch(() => {
      return { message: "An unknown error occurred during deletion." };
    });
    throw new Error(errorData.message);
  }

  // For a successful 204 No Content response, we don't need to parse JSON
  return;
};

export { login, logout, getSubmissions, submitForm, deleteSubmission };
