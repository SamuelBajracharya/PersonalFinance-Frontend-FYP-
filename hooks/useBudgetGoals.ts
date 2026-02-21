import {
  createBudgetAPI,
  fetchMyBudgetsAPI,
  updateBudgetAPI,
  deleteBudgetAPI,
  Budget,
  BudgetCreate,
  BudgetUpdate,
} from "@/api/BudgetGoalAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get user budgets
export const useMyBudgets = () => {
  return useQuery<Budget[], unknown>({
    queryKey: ["budgets", "me"],
    queryFn: () => fetchMyBudgetsAPI(),
    placeholderData: (previousData) => previousData,
  });
};

// Create budget
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BudgetCreate) => createBudgetAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", "me"] });
    },
  });
};

// Update budget
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      payload,
    }: {
      budgetId: string;
      payload: BudgetUpdate;
    }) => updateBudgetAPI(budgetId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", "me"] });
    },
  });
};

// Delete budget
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (budgetId: string) => deleteBudgetAPI(budgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", "me"] });
    },
  });
};
