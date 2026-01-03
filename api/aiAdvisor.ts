import { baseInstance } from "./axiosInstance";

export interface AIAdvisorRequest {
  user_prompt: string;
}

export interface AIAdvisorResponse {
  summary: string;
  advice: string;
  raw_model_output: string;
}

export const fetchAIAdvisorAPI = async (payload: AIAdvisorRequest) => {
  const response = await baseInstance.post<AIAdvisorResponse>(
    "/ai/advisor",
    payload
  );
  return response.data;
};
