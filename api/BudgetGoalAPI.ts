import { baseInstance } from "./axiosInstance";

// Types
export interface Budget {
  id: string;
  user_id: string;
  category: string;
  budget_amount: string;
  start_date: string;
  end_date: string;
}

export interface BudgetCreate {
  category: string;
  budget_amount: number;
}

export interface BudgetUpdate {
  budget_amount: number;
}

// Create budget
export const createBudgetAPI = async (payload: BudgetCreate) => {
  const response = await baseInstance.post<Budget>("/budgets", payload);
  return response.data;
};

// Get user budgets
export const fetchMyBudgetsAPI = async () => {
  const response = await baseInstance.get<Budget[]>("/budgets");
  return response.data;
};

// Update budget
export const updateBudgetAPI = async (
  budgetId: string,
  payload: BudgetUpdate
) => {
  const response = await baseInstance.put<Budget>(
    `/budgets/${budgetId}`,
    payload
  );
  return response.data;
};

// Delete budget
export const deleteBudgetAPI = async (budgetId: string) => {
  await baseInstance.delete(`/budgets/${budgetId}`);
};
