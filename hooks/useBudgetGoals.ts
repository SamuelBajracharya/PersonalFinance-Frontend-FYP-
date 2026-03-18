import {
  BudgetGoalAdaptiveAdjustment,
  BudgetGoalPeriodReview,
  BudgetGoalPredictionExplanation,
  BudgetGoalSimulationRequest,
  BudgetGoalStatus,
  BudgetGoalSuggestionsResponse,
  createBudgetAPI,
  fetchBudgetGoalAdaptiveAdjustmentAPI,
  fetchBudgetGoalPeriodReviewAPI,
  fetchBudgetGoalStatusesAPI,
  fetchBudgetGoalSuggestionsAPI,
  fetchBudgetPredictionExplanationAPI,
  fetchSingleBudgetGoalStatusAPI,
  fetchMyBudgetsAPI,
  simulateBudgetGoalAPI,
  updateBudgetAPI,
  deleteBudgetAPI,
  Budget,
  BudgetCreate,
  BudgetUpdate,
} from "@/api/BudgetGoalAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

// Get user budgets
export const useMyBudgets = () => {
  return useQuery<Budget[], unknown>({
    queryKey: queryKeys.budgets.my,
    queryFn: () => fetchMyBudgetsAPI(),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};

// Create budget
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BudgetCreate) => createBudgetAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-status"] });
      queryClient.invalidateQueries({ queryKey: ["budget-prediction-explanation"] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-adaptive-adjustment"] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-period-review"] });
    },
  });
};

// Delete budget
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (budgetId: string) => deleteBudgetAPI(budgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-status"] });
      queryClient.invalidateQueries({ queryKey: ["budget-prediction-explanation"] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-adaptive-adjustment"] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-period-review"] });
    },
  });
};

// Get all budget goal statuses
export const useBudgetGoalStatuses = () => {
  return useQuery<BudgetGoalStatus[], unknown>({
    queryKey: queryKeys.budgets.goalStatuses,
    queryFn: fetchBudgetGoalStatusesAPI,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};

// Get single budget goal status
export const useSingleBudgetGoalStatus = (budgetId: string) => {
  return useQuery<BudgetGoalStatus, unknown>({
    queryKey: queryKeys.budgets.goalStatus(budgetId),
    queryFn: () => fetchSingleBudgetGoalStatusAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 3,
  });
};

// Get prediction explanation
export const useBudgetPredictionExplanation = (budgetId: string) => {
  return useQuery<BudgetGoalPredictionExplanation, unknown>({
    queryKey: queryKeys.budgets.predictionExplanation(budgetId),
    queryFn: () => fetchBudgetPredictionExplanationAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 3,
  });
};

// Simulate budget goal outcome
export const useSimulateBudgetGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      payload,
    }: {
      budgetId: string;
      payload: BudgetGoalSimulationRequest;
    }) =>
      simulateBudgetGoalAPI(budgetId, payload),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.goalStatuses });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.goalStatus(variables.budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.predictionExplanation(variables.budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.suggestions(variables.budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.adaptiveAdjustment(variables.budgetId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.periodReview(variables.budgetId),
      });
    },
  });
};

// Get goal suggestions
export const useBudgetGoalSuggestions = (budgetId: string) => {
  return useQuery<BudgetGoalSuggestionsResponse, unknown>({
    queryKey: queryKeys.budgets.suggestions(budgetId),
    queryFn: () => fetchBudgetGoalSuggestionsAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 3,
  });
};

// Get adaptive adjustment
export const useBudgetGoalAdaptiveAdjustment = (budgetId: string) => {
  return useQuery<BudgetGoalAdaptiveAdjustment, unknown>({
    queryKey: queryKeys.budgets.adaptiveAdjustment(budgetId),
    queryFn: () => fetchBudgetGoalAdaptiveAdjustmentAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 3,
  });
};

// Get period review
export const useBudgetGoalPeriodReview = (budgetId: string) => {
  return useQuery<BudgetGoalPeriodReview, unknown>({
    queryKey: queryKeys.budgets.periodReview(budgetId),
    queryFn: () => fetchBudgetGoalPeriodReviewAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 3,
  });
};
