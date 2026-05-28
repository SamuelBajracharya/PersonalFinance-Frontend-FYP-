import { baseInstance } from "./axiosInstance";
import { AxiosRequestConfig } from "axios";

export interface WhatIfScenario {
  category: string;
  total_spent: number;
  reduction_percentage: number;
  monthly_savings: number;
  new_budget: number;
  message: string;
}

export interface WhatIfPreferences {
  protected_categories?: string[];
  category_caps?: Record<string, number>;
  global_min_reduction?: number;
  global_max_reduction?: number;
}

export const fetchWhatIfScenariosAPI = async (
  preferences?: WhatIfPreferences,
  config?: AxiosRequestConfig
) => {
  const response = await baseInstance.post<WhatIfScenario[]>(
    "/what-if-scenarios/generate",
    preferences,
    config
  );
  return response.data;
};
