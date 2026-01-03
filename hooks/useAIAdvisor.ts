import {
  AIAdvisorRequest,
  AIAdvisorResponse,
  fetchAIAdvisorAPI,
} from "@/api/aiAdvisor";
import { useMutation } from "@tanstack/react-query";

export const useAIAdvisor = () => {
  return useMutation<AIAdvisorResponse, unknown, AIAdvisorRequest>({
    mutationFn: (payload: AIAdvisorRequest) => fetchAIAdvisorAPI(payload),
  });
};
