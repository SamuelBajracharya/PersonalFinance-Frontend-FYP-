import { baseInstance } from "./axiosInstance";

export interface AIAssistantRequest {
  user_prompt: string;
}

export interface AIAssistantResponse {
  summary: string;
  advice: string;
  raw_model_output: string;
}

export const fetchAIAdvisorAPI = async (payload: AIAssistantRequest) => {
  const response = await baseInstance.post<AIAssistantResponse>(
    "/ai/advisor",
    payload
  );
  return response.data;
};
