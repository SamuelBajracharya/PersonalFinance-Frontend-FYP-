import {
    FetchStockPredictionsParams,
    fetchStockPredictionsAPI,
    StockPrediction,
} from "@/api/stockPredictionAPI";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export const useStockPredictions = (
    params: FetchStockPredictionsParams = {},
) => {
    return useQuery<StockPrediction[], unknown>({
        queryKey: queryKeys.stockPredictions(params),
        queryFn: () => fetchStockPredictionsAPI(params),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 2,
    });
};
