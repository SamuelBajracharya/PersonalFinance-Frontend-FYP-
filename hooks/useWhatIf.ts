import { fetchWhatIfScenariosAPI, WhatIfScenario } from "@/api/whatIfAPI";
import { useQuery } from "@tanstack/react-query";

export const useWhatIfSccenarios = () => {
  return useQuery<WhatIfScenario[], unknown>({
    queryKey: ["what-if-scenarios"],
    queryFn: () => fetchWhatIfScenariosAPI(),
  });
};
