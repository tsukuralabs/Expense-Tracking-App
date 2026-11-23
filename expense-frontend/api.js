import axios from "https://cdn.jsdelivr.net/npm/axios@1.7.9/+esm";

const API_BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a new expense (POST /expense)
export const addExpense = async (expenseData) => {
  const response = await api.post("/expense", expenseData);
  return response.data;
};

// Get all expenses for a user (GET /expense?userId=1)
export const getExpenses = async (userId) => {
  const response = await api.get("/expense", {
    params: { userId },
  });
  return response.data;
};

// Update an existing expense (PUT /expense/:id)
export const updateExpense = async (id, expenseData, userId) => {
  const response = await api.put(`/expense/${id}`, { ...expenseData, userId }, {
    params: { userId },
  });
  return response.data;
};

// Delete an expense (DELETE /expense/:id?userId=1)
export const deleteExpense = async (id, userId) => {
  const response = await api.delete(`/expense/${id}`, {
    params: { userId },
  });
  return response.data;
};

export default api;
