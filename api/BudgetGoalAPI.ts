import { baseInstance } from "./axiosInstance";
import { AxiosError, AxiosRequestConfig } from "axios";

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

export interface BudgetGoalAlert {
  level: string;
  title: string;
  message?: string;
}

export interface BudgetGoalStatus {
  budget_id: string;
  category: string;
  current_spend: number;
  budget_amount: number;
  remaining_budget: number;
  projected_period_spend: number;
  progress_percent: number;
  burn_rate_per_day: number;
  days_left: number;
  predicted_to_exceed: boolean;
  alerts: BudgetGoalAlert[];
}

export interface BudgetGoalPredictionExplanation {
  explanation: string;
}

export interface BudgetGoalSimulationRequest {
  reduction_percent: number;
  absolute_cut: number;
}

export interface BudgetGoalSimulationResult {
  baseline_projected_spend: number;
  simulated_projected_spend: number;
  projected_savings: number;
  baseline_predicted_to_exceed: boolean;
  simulated_predicted_to_exceed: boolean;
  simulated_remaining_budget: number;
}

export interface BudgetGoalSuggestion {
  title: string;
  message: string;
  priority: string;
  estimated_savings: number;
}

export interface BudgetGoalSuggestionsResponse {
  suggestions: BudgetGoalSuggestion[];
}

export interface BudgetGoalAdaptiveAdjustment {
  recommended_budget_amount: number;
  adjustment_percent: number;
  reason: string;
}

export interface BudgetGoalPeriodReview {
  period_start: string;
  period_end: string;
  is_period_closed: boolean;
  achieved: boolean;
  budget_amount: number;
  total_spent: number;
  savings_or_overrun: number;
  next_recommended_budget: number;
  summary: string;
}

// Create budget
export const createBudgetAPI = async (payload: BudgetCreate) => {
  try {
    // Send only the fields accepted by the create budget endpoint.
    const response = await baseInstance.post<Budget>("/budgets", {
      category: payload.category,
      budget_amount: Number(payload.budget_amount),
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    const detail =
      axiosError.response?.data?.detail ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to create budget goal";

    throw new Error(detail);
  }
};

// Get user budgets
export const fetchMyBudgetsAPI = async (config?: AxiosRequestConfig) => {
  const response = await baseInstance.get<Budget[]>("/budgets", config);
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


// Get all budget goal statuses
export const fetchBudgetGoalStatusesAPI = async (config?: AxiosRequestConfig) => {
  const response = await baseInstance.get<BudgetGoalStatus[]>(
    "/budgets/goal-status",
    config
  );
  return response.data;
};

// Get single budget goal status
export const fetchSingleBudgetGoalStatusAPI = async (
  budgetId: string,
  config?: AxiosRequestConfig
) => {
  const response = await baseInstance.get<BudgetGoalStatus>(
    `/budgets/${budgetId}/goal-status`,
    config
  );
  return response.data;
};

// Get prediction explanation
export const fetchBudgetPredictionExplanationAPI = async (
  budgetId: string,
  config?: AxiosRequestConfig
) => {
  const response = await baseInstance.get<BudgetGoalPredictionExplanation>(
    `/budgets/${budgetId}/prediction-explanation`,
    config
  );
  return response.data;
};

// Simulate budget goal outcome
export const simulateBudgetGoalAPI = async (
  budgetId: string,
  payload: BudgetGoalSimulationRequest
) => {
  const response = await baseInstance.post<BudgetGoalSimulationResult>(`/budgets/${budgetId}/simulate`, payload);
  return response.data;
};

// Get goal suggestions
export const fetchBudgetGoalSuggestionsAPI = async (
  budgetId: string,
  config?: AxiosRequestConfig
) => {
  const response = await baseInstance.get<BudgetGoalSuggestionsResponse>(
    `/budgets/${budgetId}/suggestions`,
    config
  );
  return response.data;
};

// Get adaptive adjustment
export const fetchBudgetGoalAdaptiveAdjustmentAPI = async (
  budgetId: string,
  config?: AxiosRequestConfig
) => {
  const response = await baseInstance.get<BudgetGoalAdaptiveAdjustment>(
    `/budgets/${budgetId}/adaptive-adjustment`,
    config
  );
  return response.data;
};

// Get period review
export const fetchBudgetGoalPeriodReviewAPI = async (
  budgetId: string,
  config?: AxiosRequestConfig
) => {
  const response = await baseInstance.get<BudgetGoalPeriodReview>(
    `/budgets/${budgetId}/review`,
    config
  );
  return response.data;
};
