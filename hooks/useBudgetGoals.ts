import {
  BudgetGoalAdaptiveAdjustment,
  BudgetGoalPeriodReview,
  BudgetGoalPredictionExplanation,
  BudgetGoalSimulationRequest,
  BudgetGoalSimulationResult,
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
      queryClient.invalidateQueries({ queryKey: ["budget-goal-statuses"] });
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
      queryClient.invalidateQueries({ queryKey: ["budget-goal-statuses"] });
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
      queryClient.invalidateQueries({ queryKey: ["budgets", "me"] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-statuses"] });
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
    queryKey: ["budget-goal-statuses"],
    queryFn: fetchBudgetGoalStatusesAPI,
    placeholderData: (previousData) => previousData,
  });
};

// Get single budget goal status
export const useSingleBudgetGoalStatus = (budgetId: string) => {
  return useQuery<BudgetGoalStatus, unknown>({
    queryKey: ["budget-goal-status", budgetId],
    queryFn: () => fetchSingleBudgetGoalStatusAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
  });
};

// Get prediction explanation
export const useBudgetPredictionExplanation = (budgetId: string) => {
  return useQuery<BudgetGoalPredictionExplanation, unknown>({
    queryKey: ["budget-prediction-explanation", budgetId],
    queryFn: () => fetchBudgetPredictionExplanationAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
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
      queryClient.invalidateQueries({ queryKey: ["budget-goal-statuses"] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-status", variables.budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budget-prediction-explanation", variables.budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-suggestions", variables.budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-adaptive-adjustment", variables.budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budget-goal-period-review", variables.budgetId] });
    },
  });
};

// Get goal suggestions
export const useBudgetGoalSuggestions = (budgetId: string) => {
  return useQuery<BudgetGoalSuggestionsResponse, unknown>({
    queryKey: ["budget-goal-suggestions", budgetId],
    queryFn: () => fetchBudgetGoalSuggestionsAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
  });
};

// Get adaptive adjustment
export const useBudgetGoalAdaptiveAdjustment = (budgetId: string) => {
  return useQuery<BudgetGoalAdaptiveAdjustment, unknown>({
    queryKey: ["budget-goal-adaptive-adjustment", budgetId],
    queryFn: () => fetchBudgetGoalAdaptiveAdjustmentAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
  });
};

// Get period review
export const useBudgetGoalPeriodReview = (budgetId: string) => {
  return useQuery<BudgetGoalPeriodReview, unknown>({
    queryKey: ["budget-goal-period-review", budgetId],
    queryFn: () => fetchBudgetGoalPeriodReviewAPI(budgetId),
    enabled: !!budgetId,
    placeholderData: (previousData) => previousData,
  });
};
