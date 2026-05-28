import { fetchWhatIfScenariosAPI, WhatIfScenario } from "@/api/whatIfAPI";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export const useWhatIfSccenarios = () => {
  return useQuery<WhatIfScenario[], unknown>({
    queryKey: queryKeys.whatIfScenarios,
    queryFn: () => {
      const onboardingSpending = localStorage.getItem("onboarding_spending");
      const preferences = onboardingSpending
        ? { protected_categories: [onboardingSpending] }
        : undefined;
      return fetchWhatIfScenariosAPI(preferences);
    },
    staleTime: 1000 * 60 * 5,
  });
};
