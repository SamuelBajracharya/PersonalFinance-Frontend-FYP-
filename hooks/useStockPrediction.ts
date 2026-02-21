import {
    FetchStockPredictionsParams,
    fetchStockPredictionsAPI,
    StockPrediction,
} from "@/api/stockPredictionAPI";
import { useQuery } from "@tanstack/react-query";

export const useStockPredictions = (
    params: FetchStockPredictionsParams = {},
) => {
    return useQuery<StockPrediction[], unknown>({
        queryKey: [
            "stock-predictions",
            params.instrument ?? null,
            params.horizon_days ?? 30,
            params.confidence_level ?? 0.95,
            params.force_source ?? "auto",
        ],
        queryFn: () => fetchStockPredictionsAPI(params),
        placeholderData: (previousData) => previousData,
    });
};
