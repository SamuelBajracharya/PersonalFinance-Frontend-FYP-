import { baseInstance } from "./axiosInstance";

export interface WhatIfScenario {
  category: string;
  total_spent: number;
  reduction_percentage: number;
  monthly_savings: number;
  new_budget: number;
  message: string;
}

export const fetchWhatIfScenariosAPI = async () => {
  const response = await baseInstance.get<WhatIfScenario[]>(
    "/what-if-scenarios"
  );
  return response.data;
};
