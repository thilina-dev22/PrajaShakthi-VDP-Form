import API_BASE_URL, { API_ENDPOINTS } from '../config/api';
import { authFetch } from '../utils/fetch';

const API_URL = API_ENDPOINTS.AUTH.LOGIN.replace('/login', '');
const API_SUBMISSION_URL = API_ENDPOINTS.SUBMISSIONS.BASE;
const TOKEN_KEY = "token";

const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  if (response.status === 401) {
    const error = await response.json();
    throw new Error(error.message);
  }

  if (!response.ok) {
    throw new Error("Login failed due to a server error.");
  }

  const data = await response.json();
  
  // Store token AND user data
  if (data && data.token) {
    try {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (e) {
      console.error('❌ Failed to save token:', e);
    }
  }
  return data;
};

const logout = async () => {
  const response = await authFetch(`${API_URL}/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('user');
};

const getSubmissions = async (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const url = `${API_SUBMISSION_URL}?${queryString}`;

  const response = await authFetch(url, {
    method: "GET",
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
  const response = await authFetch(API_SUBMISSION_URL, {
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (response.status === 401) {
    throw new Error("Not authenticated. Please log in.");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Form submission failed due to a server error.");
  }

  return response.json();
};

const deleteSubmission = async (id) => {
  const response = await authFetch(`${API_SUBMISSION_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => {
      return { message: "An unknown error occurred during deletion." };
    });
    throw new Error(errorData.message);
  }

  return;
};

const updateSubmission = async (id, formData) => {
  const response = await authFetch(`${API_SUBMISSION_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(formData),
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

const checkAuthStatus = async () => {
  const response = await authFetch(`${API_URL}/status`, {
    method: "GET",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

const resetOwnPassword = async (currentPassword, newPassword) => {
  const response = await authFetch(`${API_URL}/reset-password`, {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (response.status === 401) {
    const error = await response.json();
    throw new Error(error.message || "Current password is incorrect");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to reset password");
  }

  return response.json();
};

const resetUserPassword = async (userId, newPassword) => {
  const response = await authFetch(API_ENDPOINTS.USERS.RESET_PASSWORD(userId), {
    method: "PUT",
    body: JSON.stringify({ newPassword }),
  });

  if (response.status === 403) {
    const error = await response.json();
    throw new Error(error.message || "Not authorized to reset this password");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to reset password");
  }

  return response.json();
};

export {
  login,
  logout,
  getSubmissions,
  submitForm,
  deleteSubmission,
  updateSubmission,
  checkAuthStatus,
  resetOwnPassword,
  resetUserPassword,
};
