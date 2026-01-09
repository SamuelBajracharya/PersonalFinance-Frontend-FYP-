import {
  AIAssistantRequest,
  AIAssistantResponse,
  fetchAIAdvisorAPI,
} from "@/api/aiAssistant";
import { useMutation } from "@tanstack/react-query";

export const useAIAssistant = () => {
  return useMutation<AIAssistantResponse, unknown, AIAssistantRequest>({
    mutationFn: (payload: AIAssistantRequest) => fetchAIAdvisorAPI(payload),
  });
};
