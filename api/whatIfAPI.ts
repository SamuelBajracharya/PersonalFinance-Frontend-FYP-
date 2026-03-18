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

export const fetchWhatIfScenariosAPI = async (config?: AxiosRequestConfig) => {
  const response = await baseInstance.get<WhatIfScenario[]>(
    "/what-if-scenarios",
    config
  );
  return response.data;
};
