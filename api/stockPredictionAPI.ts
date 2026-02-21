import { baseInstance } from "./axiosInstance";

export interface PastPricePoint {
    date: string;
    price: number;
}

export interface FuturePricePoint {
    day: number;
    price: number;
}

export interface StockPrediction {
    instrument: string;
    name: string;
    source: string;
    quantity: number;
    horizon_days: number;
    confidence_level_pct: number;
    expected_return_pct: number;
    ci_low_pct: number;
    ci_high_pct: number;
    rmse: number;
    mae: number;
    directional_accuracy_pct: number;
    baseline_mean_return_pct: number;
    baseline_rmse: number;
    baseline_mae: number;
    baseline_directional_accuracy_pct: number;
    past_price_history: PastPricePoint[];
    future_price_prediction: FuturePricePoint[];
}

export interface FetchStockPredictionsParams {
    instrument?: string;
    horizon_days?: number;
    confidence_level?: number;
    force_source?: "auto" | "mock" | "placeholder" | string;
}

export const fetchStockPredictionsAPI = async (
    params: FetchStockPredictionsParams = {},
) => {
    const response = await baseInstance.get<StockPrediction[]>("/ai/predict/stocks/", {
        params,
    });
    return response.data;
};
