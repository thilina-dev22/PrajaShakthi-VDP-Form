// Base API URL: in production set VITE_API_BASE_URL to your backend URL; in dev falls back to relative paths (Vite proxy)
const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE_URL
  ? String(import.meta.env.VITE_API_BASE_URL)
  : "").replace(/\/$/, "");

const API_URL = `${API_BASE}/api/auth`;
const API_SUBMISSION_URL = `${API_BASE}/api/submissions`;

// LocalStorage key for Bearer token (used by Safari/iOS where cookies are blocked cross-domain)
const TOKEN_KEY = "ps_token";

const getAuthHeaders = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

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

  const data = await response.json(); // { _id, username, role, token? }
  // Store token for Safari/iOS or any cross-domain scenario
  if (data && data.token) {
    try {
      localStorage.setItem(TOKEN_KEY, data.token);
    } catch (e) {
      void e; // ignore storage errors (e.g., private mode)
    }
  }
  return data;
};

const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
  // Clear stored token
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    void e; // ignore storage errors
  }
};

// Modified: Adds filtering parameters including formType
const getSubmissions = async (filters = {}) => {
  // Build query string from filters { district: 'X', divisionalSec: 'Y', formType: 'council_info' }
  const queryString = new URLSearchParams(filters).toString();
  const url = `${API_SUBMISSION_URL}?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
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
    headers: {
      ...getAuthHeaders(),
    },
    credentials: "include", // Send cookies if available as well
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

//UPDATE FUNCTION ⭐
const updateSubmission = async (id, formData) => {
  const response = await fetch(`${API_SUBMISSION_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("Not authenticated. Please log in.");
  }

  if (response.status === 403) {
    throw new Error("Not authorized to update this submission.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => {
      return { message: "An unknown error occurred during update." };
    });
    throw new Error(errorData.message);
  }

  return response.json();
};

//ADD THE NEW STATUS CHECK FUNCTION
const checkAuthStatus = async () => {
  const response = await fetch(`${API_URL}/status`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
    credentials: "include", // Send cookie if present
  });

  if (!response.ok) {
    // This is expected if the user is not logged in, so we don't throw an error,
    // we just signal that the check failed by returning null.
    return null;
  }

  return response.json(); // Returns { _id, username, role }
};

export {
  login,
  logout,
  getSubmissions,
  submitForm,
  deleteSubmission,
  updateSubmission,
  checkAuthStatus,
};
