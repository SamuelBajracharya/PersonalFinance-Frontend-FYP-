import { baseInstance } from "./axiosInstance";

export interface BudgetPrediction {
  category: string;
  predicted_amount: number;
  risk_probability: number;
  risk_level: string;
  remaining_budget: number;
  prediction_date: string; // ISO date
}

export const fetchBudgetPredictionsAPI = async () => {
  const response = await baseInstance.get<BudgetPrediction[]>(
    "/ai/predict/budgets/",
  );
  return response.data;
};
