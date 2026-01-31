import {
  BudgetPrediction,
  fetchBudgetPredictionsAPI,
} from "@/api/budgetPrediction";
import { useQuery } from "@tanstack/react-query";

export const useBudgetPredictions = () => {
  return useQuery<BudgetPrediction[], unknown>({
    queryKey: ["budget-predictions"],
    queryFn: fetchBudgetPredictionsAPI,
  });
};
